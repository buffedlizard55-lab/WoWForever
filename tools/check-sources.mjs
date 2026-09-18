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
 *    styles, comments, digits-only tokens like countdown timers and "3h ago"),
 *    so ordinary ad rotation and relative timestamps do not raise false alarms.
 *  - A source that fails to fetch is reported as "unreachable", never silently
 *    dropped, and its previous fingerprint is preserved so a transient outage
 *    does not destroy the baseline.
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
const STATE_FILE = join(HERE, 'source-state.json');
const REPORT_FILE = join(HERE, 'source-report.md');

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
  return list.filter((s) => typeof s.url === 'string' && /^https?:\/\//i.test(s.url));
}

/* ---------- fingerprinting ---------- */

function normalise(body) {
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    // Volatile: relative timestamps, countdowns, vote counts, view counts.
    .replace(/\b\d+\s*(?:d|h|m|s|hr|min|sec|day|days|hour|hours|minute|minutes|second|seconds|ago)\b/gi, ' ')
    .replace(/\b\d[\d,.:]*\b/g, ' ')
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

const sources = await loadSources();
const previous = existsSync(STATE_FILE) ? JSON.parse(await readFile(STATE_FILE, 'utf8')) : { checked: null, sources: {} };

const results = await fetchAll(sources);
const byId = new Map(sources.map((s) => [s.id, s]));

const changed = [];
const unreachable = [];
const added = [];
const state = { checked: new Date().toISOString(), sources: { ...previous.sources } };

for (const r of results) {
  const meta = byId.get(r.id) || {};
  const before = previous.sources[r.id];

  if (!r.ok) {
    unreachable.push({ ...r, title: meta.title, reason: r.reason });
    // Preserve the old fingerprint: a transient outage must not reset the baseline.
    if (before) state.sources[r.id] = { ...before, lastError: r.reason, lastErrorAt: state.checked };
    continue;
  }

  const entry = { hash: r.hash, length: r.length, url: r.url, checked: state.checked };

  if (!before) {
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

/* ---------- report ---------- */

const lines = [];
lines.push(`# Source watch report — ${state.checked.slice(0, 10)}`);
lines.push('');
lines.push(`Checked **${results.length}** registered source URLs from \`data/sources.js\`.`);
lines.push('');
lines.push(`- Changed since last check: **${changed.length}**`);
lines.push(`- Unreachable this run: **${unreachable.length}**`);
lines.push(`- New sources baselined: **${added.length}**`);
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

if (unreachable.length) {
  lines.push('## Unreachable — check for a moved or deleted page');
  lines.push('');
  lines.push('| Source | URL | Reason |');
  lines.push('| --- | --- | --- |');
  for (const u of unreachable) lines.push(`| \`${u.id}\` — ${u.title || ''} | ${u.url} | ${u.reason} |`);
  lines.push('');
  lines.push('Previous fingerprints were preserved, so a transient outage will resolve itself on the next run. A persistent failure means the citation needs an archive link or a replacement source.');
  lines.push('');
}

if (added.length) {
  lines.push('## Newly baselined (no action needed)');
  lines.push('');
  for (const a of added) lines.push(`- \`${a.id}\` — ${a.title || ''}`);
  lines.push('');
}

if (!changed.length && !unreachable.length) {
  lines.push('No changes and no unreachable sources. Nothing to do.');
  lines.push('');
}

const report = lines.join('\n');
await writeFile(REPORT_FILE, report, 'utf8');

if (!DRY_RUN) await writeFile(STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf8');

// Machine-readable outcome for the workflow.
const needsIssue = !INIT && (changed.length > 0 || unreachable.length > 0);
if (process.env.GITHUB_OUTPUT) {
  await writeFile(
    process.env.GITHUB_OUTPUT,
    `needs_issue=${needsIssue ? 'true' : 'false'}\nchanged=${changed.length}\nunreachable=${unreachable.length}\n`,
    { flag: 'a' }
  );
}

console.log(report);
