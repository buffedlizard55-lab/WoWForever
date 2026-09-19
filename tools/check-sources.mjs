#!/usr/bin/env node
/*
 * check-sources.mjs — source URL watcher for WoWForever.
 *
 * Reads data/sources.js, fetches every registered http(s) URL, and records a
 * content fingerprint per source in tools/source-state.json. On the next run,
 * any source whose fingerprint changed (or whose URL stopped responding) is
 * reported. The GitHub workflow turns that report into an issue.
 *
 * Deliberate design choices:
 *  - No dependencies. Node 20+ global fetch only, so no lockfile to rot.
 *  - The fingerprint is taken over text with volatile chrome stripped (scripts,
 *    styles, comments, relative timestamps, countdown labels and view-count
 *    chrome, so ordinary ad rotation does not raise false alarms while
 *    meaningful dates and numbers remain detectable. Main URLs and every
 *    registered `also` URL are checked once.
 *  - A source that fails to fetch is reported as "unreachable", never silently
 *    dropped, and its previous fingerprint is preserved so a transient outage
 *    does not destroy the baseline. Failures are counted: a source that was
 *    reachable before and is not now is a regression worth an issue, while a
 *    source that has never been reachable needs two consecutive failures
 *    before it is worth anyone's attention.
 *  - A first run that fingerprints nothing writes no baseline at all, so a
 *    network-blocked runner cannot silently establish an empty "baseline" that
 *    every later run compares against.
 *  - Exit code is always 0 unless the script itself is broken; change detection
 *    is signalled through the report file, not through process failure.
 *
 * Usage:
 *   node tools/check-sources.mjs              # check and update state
 *   node tools/check-sources.mjs --dry-run    # check, do not write state
 *   node tools/check-sources.mjs --init       # write baseline, report nothing
 */

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const SOURCES_JS = join(ROOT, 'data', 'sources.js');
/* Paths can be redirected by the offline harness (tools/test-source-watch.mjs)
   so a test run never touches the repository's real baseline. */
const STATE_FILE = process.env.WOWF_STATE_FILE || join(HERE, 'source-state.json');
const REPORT_FILE = process.env.WOWF_REPORT_FILE || join(HERE, 'source-report.md');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const INIT = args.has('--init');

const TIMEOUT_MS = 30000;
const CONCURRENCY = 4;
const UA =
  'WoWForeverHub-SourceWatcher/1.0 (+https://github.com/buffedlizard55-lab/WoWForever) ' +
  'non-commercial fan project; checks whether cited pages changed';

/* ---------- load the source registry without a browser ---------- */

async function loadSources() {
  const js = await readFile(SOURCES_JS, 'utf8');
  const sandbox = { window: {} };
  // The registry is a plain assignment to window.WOWF_SOURCES; evaluating it in
  // a function scope with a fake `window` avoids pulling in a JS parser.
  const fn = new Function('window', js + '\nreturn window.WOWF_SOURCES;');
  const list = fn(sandbox.window);
  if (!Array.isArray(list)) throw new Error('data/sources.js did not produce an array');
  return list;
}

/* Expand the optional `also` links into independently watched URLs. The main
   source id stays stable; additional pages get a deterministic child id. A URL
   is fetched once even if a registry entry repeats it in two `also` arrays. */
function expandSources(list) {
  const out = [];
  const seenUrls = new Set();
  const add = (source, url, id, title) => {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return;
    const key = url.replace(/\/+$/, '').toLowerCase();
    if (seenUrls.has(key)) return;
    seenUrls.add(key);
    out.push({ ...source, id, parentId: source.id, title, url });
  };

  // Preserve every source's primary id before deduplicating additional links.
  // That keeps reports stable when two registry entries point to the same page.
  for (const source of list) add(source, source.url, source.id, source.title);
  for (const source of list) {
    (Array.isArray(source.also) ? source.also : []).forEach((url, index) => {
      add(source, url, `${source.id}::also-${index + 1}`, `${source.title} (additional page ${index + 1})`);
    });
  }
  return out;
}

/* ---------- fingerprinting ---------- */

function normalise(body) {
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    // Remove only presentation chrome. Do not remove every number: launch
    // dates, level caps, costs, rank counts and percentages are the facts this
    // watcher must notice when a cited page changes.
    .replace(/\b(?:just now|today|yesterday)\b/gi, ' ')
    .replace(/\b\d+\s*(?:d|h|m|s|hr|min|sec|day|days|hour|hours|minute|minutes|second|seconds)\s*ago\b/gi, ' ')
    .replace(/\b\d[\d,]*\s+(?:views?|comments?|likes?|votes?|replies|followers?)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function fingerprint(body) {
  const text = normalise(body);
  return {
    hash: createHash('sha256').update(text).digest('hex'),
    length: text.length
  };
}

/* ---------- fetching ---------- */

async function fetchOne(source) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(source.url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,*/*' }
    });
    const body = await res.text();
    if (!res.ok) {
      return { id: source.id, url: source.url, ok: false, status: res.status, reason: `HTTP ${res.status}` };
    }
    return { id: source.id, url: source.url, ok: true, status: res.status, ...fingerprint(body) };
  } catch (err) {
    return { id: source.id, url: source.url, ok: false, status: 0, reason: String(err && err.message ? err.message : err) };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAll(sources) {
  const out = [];
  const queue = sources.slice();
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length) {
      const next = queue.shift();
      out.push(await fetchOne(next));
    }
  });
  await Promise.all(workers);
  return out;
}

/* ---------- main ---------- */

const sources = expandSources(await loadSources());
const firstRun = !existsSync(STATE_FILE);
const previous = firstRun ? { checked: null, sources: {} } : JSON.parse(await readFile(STATE_FILE, 'utf8'));

const results = await fetchAll(sources);
const byId = new Map(sources.map((s) => [s.id, s]));

const changed = [];        // fingerprint moved: the page was edited
const regressed = [];      // was reachable, now is not
const neverBaselined = []; // has never been reachable from this runner
const added = [];          // newly fingerprinted, nothing to compare against
const state = { checked: new Date().toISOString(), sources: { ...previous.sources } };

for (const r of results) {
  const meta = byId.get(r.id) || {};
  const before = previous.sources[r.id];

  if (!r.ok) {
    const failures = (before && before.failures ? before.failures : 0) + 1;
    const entry = { failures, lastError: r.reason, lastErrorAt: state.checked, url: r.url };
    if (before && before.hash) Object.assign(entry, { hash: before.hash, length: before.length, checked: before.checked });
    state.sources[r.id] = entry;
    const row = { ...r, title: meta.title, tier: meta.tier, failures, previouslyReachable: Boolean(before && before.hash) };
    if (row.previouslyReachable) regressed.push(row);
    else neverBaselined.push(row);
    continue;
  }

  const entry = { hash: r.hash, length: r.length, url: r.url, checked: state.checked, failures: 0 };

  if (!before || !before.hash) {
    added.push({ ...r, title: meta.title });
  } else if (before.hash !== r.hash) {
    changed.push({
      ...r,
      title: meta.title,
      tier: meta.tier,
      before: before.hash.slice(0, 12),
      after: r.hash.slice(0, 12),
      delta: r.length - (before.length || 0)
    });
  }
  state.sources[r.id] = entry;
}

const fingerprinted = Object.values(state.sources).filter((entry) => entry && entry.hash).length;
const baselineEstablished = fingerprinted > 0;

/* Sources that have never been reachable need a second consecutive failure
   before they are worth an issue: one blocked request is usually transient. */
const persistentlyBlocked = neverBaselined.filter((u) => u.failures >= 2);

/* ---------- report ---------- */

const lines = [];
lines.push(`# Source watch report — ${state.checked.slice(0, 10)}`);
lines.push('');
lines.push(`Checked **${results.length}** registered source URLs from \`data/sources.js\`.`);
lines.push('');
lines.push(`- Fingerprints on file after this run: **${fingerprinted}**`);
lines.push(`- Changed since last check: **${changed.length}**`);
lines.push(`- Unreachable this run: **${regressed.length + neverBaselined.length}** (${regressed.length} regressions, ${neverBaselined.length} never reachable)`);
lines.push(`- Newly fingerprinted: **${added.length}**`);
lines.push('');

if (changed.length) {
  lines.push('## Changed — re-verify the claims that cite these');
  lines.push('');
  lines.push('| Source | Evidence class | URL | Text length delta |');
  lines.push('| --- | --- | --- | --- |');
  for (const c of changed) {
    lines.push(`| \`${c.id}\` — ${c.title || ''} | ${c.tier || ''} | ${c.url} | ${c.delta > 0 ? '+' : ''}${c.delta} chars |`);
  }
  lines.push('');
  lines.push('A change means the page text moved, not that our claim is wrong. Open the page, re-read the lines our ledger cites, and either bump the claim snapshot date or record a correction.');
  lines.push('');
}

if (regressed.length) {
  lines.push('## Regressions — a source that was reachable is not any more');
  lines.push('');
  lines.push('| Source | URL | Reason | Consecutive failures |');
  lines.push('| --- | --- | --- | --- |');
  for (const u of regressed) lines.push(`| \`${u.id}\` — ${u.title || ''} | ${u.url} | ${u.reason} | ${u.failures} |`);
  lines.push('');
  lines.push('The previous fingerprint was kept, so a transient outage resolves itself on the next run. A persistent regression means the citation needs an archive link or a replacement source.');
  lines.push('');
}

if (neverBaselined.length) {
  lines.push('## Never reachable from this runner');
  lines.push('');
  lines.push('| Source | URL | Reason | Consecutive failures |');
  lines.push('| --- | --- | --- | --- |');
  for (const u of neverBaselined) lines.push(`| \`${u.id}\` — ${u.title || ''} | ${u.url} | ${u.reason} | ${u.failures} |`);
  lines.push('');
  lines.push(neverBaselined.length && persistentlyBlocked.length < neverBaselined.length
    ? 'One failure is treated as transient and does not file an issue by itself; two in a row does. If a site blocks the runner permanently, those citations need archive links or an exception recorded on the Work plan page.'
    : 'Two or more consecutive failures: either the runner is blocked or the page has gone. Check by hand before changing anything.');
  lines.push('');
}

if (added.length) {
  lines.push('## Newly fingerprinted (no action needed)');
  lines.push('');
  for (const a of added) lines.push(`- \`${a.id}\` — ${a.title || ''}`);
  lines.push('');
}

if (!changed.length && !regressed.length && !neverBaselined.length) {
  lines.push('No changes and no unreachable sources. Nothing to do.');
  lines.push('');
}

const report = lines.join('\n');
await writeFile(REPORT_FILE, report, 'utf8');

/* Never write a baseline made of nothing: if the runner cannot reach a single
   source, leave the file absent so the next run is still a first run and the
   failure stays visible instead of becoming a silent empty comparison. */
const writeState = !DRY_RUN && (baselineEstablished || !firstRun);
if (writeState) await writeFile(STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf8');

// Machine-readable outcome for the workflow.
const needsIssue = !INIT && (
  changed.length > 0 ||
  regressed.length > 0 ||
  persistentlyBlocked.length > 0 ||
  !baselineEstablished
);
if (process.env.GITHUB_OUTPUT) {
  await writeFile(
    process.env.GITHUB_OUTPUT,
    [
      `needs_issue=${needsIssue ? 'true' : 'false'}`,
      `changed=${changed.length}`,
      `regressed=${regressed.length}`,
      `unreachable=${regressed.length + neverBaselined.length}`,
      `baseline_established=${baselineEstablished ? 'true' : 'false'}`,
      `fingerprinted=${fingerprinted}`,
      ''
    ].join('\n'),
    { flag: 'a' }
  );
}
if (process.env.GITHUB_STEP_SUMMARY) {
  await writeFile(
    process.env.GITHUB_STEP_SUMMARY,
    [
      '### Source watch',
      '',
      `- URLs checked: ${results.length}`,
      `- Fingerprints on file: ${fingerprinted}`,
      `- Changed: ${changed.length}`,
      `- Unreachable: ${regressed.length + neverBaselined.length} (${regressed.length} regressions)`,
      `- Baseline established: ${baselineEstablished ? 'yes' : 'no'}`,
      writeState ? '' : '- State file not written: no source was reachable, so this run stays a first run.',
      ''
    ].join('\n'),
    { flag: 'a' }
  );
}

console.log(report);
