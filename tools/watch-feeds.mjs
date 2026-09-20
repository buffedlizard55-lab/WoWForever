#!/usr/bin/env node
/*
 * watch-feeds.mjs — dated, semantic watch of Blizzard's keyless structured feeds.
 *
 * The text-fingerprint watcher (check-sources.mjs) is the right tool for a
 * page that should not change. It is the wrong tool for a feed that changes by
 * design — a forum topic list moves hourly and a build manifest moves whenever
 * a build ships — because "the hash changed" is all it can say. This script
 * reads a short list of first-party feeds and records WHAT they said, with the
 * date, so the weekly report can say "wow_classic_beta: 1.60.1.69913 →
 * 1.60.1.70xxx" or "a Blizzard community manager posted in the beta forum"
 * instead of "changed".
 *
 * Every URL here is a registered source in data/sources.js (the offline test
 * asserts it), so the citation checker and the endpoint register cover it too.
 *
 * Feeds and what is recorded:
 *  - version service, per product   → BuildId, VersionsName, regions, seqn
 *  - version service, summary       → which WoW product codes carry a versions
 *                                     record (the signal that a code went live)
 *  - forum category latest.json     → newest topic id/title/url, topic count,
 *                                     and any topic whose posters carry
 *                                     Blizzard's staff marker
 *
 * Rules, the same as the other watcher:
 *  - No dependencies; Node 20+ global fetch.
 *  - A feed that fails is reported, never dropped; its last good observation
 *    is kept and its failure count incremented. A first run with nothing
 *    reachable writes no state at all.
 *  - The script never edits site content. A change is a prompt for a human
 *    to re-verify and update the ledger with a dated claim.
 *  - Exit code 0 unless the script itself is broken; outcomes go to the report
 *    file, GITHUB_OUTPUT and the step summary.
 *
 * Usage:
 *   node tools/watch-feeds.mjs             # check, update tools/feed-state.json
 *   node tools/watch-feeds.mjs --dry-run   # check, write nothing
 *   node tools/watch-feeds.mjs --init      # record a baseline, report no changes
 *   node tools/watch-feeds.mjs --list      # print the feed list as JSON and exit
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const SOURCES_JS = join(ROOT, 'data', 'sources.js');
const STATE_FILE = process.env.WOWF_FEED_STATE_FILE || join(HERE, 'feed-state.json');
const REPORT_FILE = process.env.WOWF_FEED_REPORT_FILE || join(HERE, 'feed-report.md');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const INIT = args.has('--init');
const LIST = args.has('--list');

const TIMEOUT_MS = 30000;
const UA =
  'WoWForeverHub-FeedWatcher/1.0 (+https://github.com/buffedlizard55-lab/WoWForever) ' +
  'non-commercial fan project; reads public build manifests and forum topic lists weekly';

/* ---------- the feeds ----------
   `source` is the id in data/sources.js whose url (or `also` entry) is fetched.
   Keeping the list here rather than in the data file is deliberate: the data
   file describes evidence, this file describes a job. */
const FEEDS = [
  {
    id: 'versions:wow_classic_beta',
    kind: 'versions',
    label: 'Version service — wow_classic_beta (identified as the Forever beta client, C212)',
    source: 'bnet-version-classic-beta',
    url: 'https://us.version.battle.net/v2/products/wow_classic_beta/versions'
  },
  {
    id: 'versions:wow_classic_era',
    kind: 'versions',
    label: 'Version service — wow_classic_era (control)',
    source: 'bnet-version-era',
    url: 'https://us.version.battle.net/v2/products/wow_classic_era/versions'
  },
  {
    id: 'versions:wow_classic',
    kind: 'versions',
    label: 'Version service — wow_classic (control)',
    source: 'bnet-version-classic',
    url: 'https://us.version.battle.net/v2/products/wow_classic/versions'
  },
  {
    id: 'summary:wow-products',
    kind: 'summary',
    label: 'Version service — which WoW product codes carry a versions record',
    source: 'bnet-version-summary',
    url: 'https://us.version.battle.net/v2/summary',
    // Only these rows are compared; the rest of the file is other games.
    watchProducts: ['wowf', 'wow_classic_beta', 'wow_classic_era_beta', 'wow_cn_beta', 'wow_classic', 'wow_classic_era', 'wow_anniversary']
  },
  {
    id: 'forum:us-forever-346',
    kind: 'discourse',
    label: 'US forum — WoW: Forever category (346)',
    source: 'bnet-forum-forever-us',
    url: 'https://us.forums.blizzard.com/en/wow/c/wow-forever/l/latest.json',
    pageBase: 'https://us.forums.blizzard.com/en/wow/t/'
  },
  {
    id: 'forum:us-forever-beta-349',
    kind: 'discourse',
    label: 'US forum — WoW: Forever Beta Discussion category (349)',
    source: 'bnet-forum-beta-us',
    url: 'https://us.forums.blizzard.com/en/wow/c/in-development/wow-forever-beta-discussion/349/l/latest.json',
    pageBase: 'https://us.forums.blizzard.com/en/wow/t/'
  }
];

if (LIST) {
  console.log(JSON.stringify(FEEDS, null, 2));
  process.exit(0);
}

/* ---------- registry guard: every feed URL must be a registered source ---------- */

async function loadSources() {
  const js = await readFile(SOURCES_JS, 'utf8');
  const fn = new Function('window', js + '\nreturn window.WOWF_SOURCES;');
  const list = fn({});
  if (!Array.isArray(list)) throw new Error('data/sources.js did not produce an array');
  return list;
}

const canon = (u) => String(u || '').replace(/\/+$/, '').toLowerCase();

function assertRegistered(sources) {
  const byId = new Map(sources.map((s) => [s.id, s]));
  const problems = [];
  for (const f of FEEDS) {
    const s = byId.get(f.source);
    if (!s) { problems.push(`${f.id}: source id "${f.source}" is not registered`); continue; }
    const urls = [s.url, ...(Array.isArray(s.also) ? s.also : [])].map(canon);
    if (!urls.includes(canon(f.url))) problems.push(`${f.id}: url is not the registered url (or an "also" url) of source "${f.source}"`);
  }
  if (problems.length) {
    // This is a script defect, not a network outcome, so it fails loudly.
    console.error('watch-feeds.mjs: feed list does not match data/sources.js');
    for (const p of problems) console.error('  - ' + p);
    process.exit(2);
  }
}

/* ---------- parsers ---------- */

/* Blizzard's version service returns a header line of `Name!TYPE:len` columns,
   a `## seqn = N` comment, then pipe-delimited rows. */
function parseTact(text) {
  const lines = String(text).split(/\r?\n/).filter((l) => l.trim().length);
  const rows = [];
  let header = null;
  let seqn = null;
  for (const line of lines) {
    const m = /^##\s*seqn\s*=\s*(\d+)/i.exec(line);
    if (m) { seqn = Number(m[1]); continue; }
    const cells = line.split('|');
    if (!header) {
      header = cells.map((c) => c.split('!')[0].trim());
      continue;
    }
    const row = {};
    header.forEach((h, i) => { row[h] = (cells[i] || '').trim(); });
    rows.push(row);
  }
  return { header: header || [], seqn, rows };
}

function observeVersions(text) {
  const { rows, seqn } = parseTact(text);
  const regions = rows.filter((r) => r.Region && r.VersionsName);
  if (!regions.length) throw new Error('no version rows in response');
  const versions = [...new Set(regions.map((r) => r.VersionsName))];
  const builds = [...new Set(regions.map((r) => r.BuildId))];
  return {
    seqn,
    regions: regions.map((r) => r.Region),
    version: versions.length === 1 ? versions[0] : versions.join(' / '),
    buildId: builds.length === 1 ? builds[0] : builds.join(' / '),
    perRegion: Object.fromEntries(regions.map((r) => [r.Region, r.VersionsName]))
  };
}

function observeSummary(text, watchProducts) {
  const { rows, seqn } = parseTact(text);
  if (!rows.length) throw new Error('no product rows in response');
  const products = {};
  for (const code of watchProducts) products[code] = { present: false, cdn: false, versions: false };
  for (const r of rows) {
    const code = r.Product;
    if (!(code in products)) continue;
    products[code].present = true;
    const flag = (r.Flags || '').trim();
    if (flag === 'cdn') products[code].cdn = true;
    else if (flag === '') products[code].versions = true;
  }
  return { seqn, products };
}

const STAFF_GROUP = /community-manager|blizzard/i;

function isStaffUser(u) {
  if (!u) return false;
  if (u.admin === true || u.moderator === true) return true;
  return STAFF_GROUP.test(u.primary_group_name || '') || STAFF_GROUP.test(u.flair_name || '');
}

function observeDiscourse(text, pageBase) {
  const data = JSON.parse(text);
  const users = Array.isArray(data.users) ? data.users : [];
  const topics = data && data.topic_list && Array.isArray(data.topic_list.topics) ? data.topic_list.topics : null;
  if (!topics) throw new Error('no topic_list.topics in response');
  const staffIds = new Set(users.filter(isStaffUser).map((u) => u.id));
  const staffNames = Object.fromEntries(users.filter(isStaffUser).map((u) => [u.id, u.username || u.name || String(u.id)]));
  const toRecord = (t) => ({
    id: t.id,
    title: t.title || t.fancy_title || '',
    url: `${pageBase}${t.slug || 't'}/${t.id}`,
    created_at: t.created_at || null,
    last_posted_at: t.last_posted_at || null,
    posts_count: t.posts_count ?? null
  });
  const staffTopics = topics
    .filter((t) => Array.isArray(t.posters) && t.posters.some((p) => staffIds.has(p.user_id)))
    .map((t) => ({ ...toRecord(t), staff: [...new Set(t.posters.filter((p) => staffIds.has(p.user_id)).map((p) => staffNames[p.user_id]))] }));
  const byId = topics.slice().sort((a, b) => Number(b.id) - Number(a.id));
  return {
    topicCount: topics.length,
    newestTopicId: byId.length ? Number(byId[0].id) : null,
    newestTopic: byId.length ? toRecord(byId[0]) : null,
    staffUsers: [...staffIds].map((id) => staffNames[id]),
    staffTopics
  };
}

function observe(feed, text) {
  if (feed.kind === 'versions') return observeVersions(text);
  if (feed.kind === 'summary') return observeSummary(text, feed.watchProducts);
  if (feed.kind === 'discourse') return observeDiscourse(text, feed.pageBase);
  throw new Error(`unknown feed kind ${feed.kind}`);
}

/* ---------- diffing: what changed, in words ---------- */

function describeChanges(feed, before, after) {
  const out = [];
  if (!before) return out;
  if (feed.kind === 'versions') {
    if (before.version !== after.version || before.buildId !== after.buildId) {
      out.push(`build moved: ${before.version} (BuildId ${before.buildId}) → ${after.version} (BuildId ${after.buildId})`);
    }
    const gone = (before.regions || []).filter((r) => !(after.regions || []).includes(r));
    const added = (after.regions || []).filter((r) => !(before.regions || []).includes(r));
    if (gone.length) out.push(`regions no longer listed: ${gone.join(', ')}`);
    if (added.length) out.push(`regions newly listed: ${added.join(', ')}`);
  } else if (feed.kind === 'summary') {
    for (const code of Object.keys(after.products || {})) {
      const b = (before.products || {})[code] || { present: false, cdn: false, versions: false };
      const a = after.products[code];
      if (!b.present && a.present) out.push(`product code "${code}" appeared in the summary`);
      if (b.present && !a.present) out.push(`product code "${code}" disappeared from the summary`);
      if (!b.versions && a.versions) out.push(`product code "${code}" now carries a versions record — /products/${code}/versions should answer`);
      if (b.versions && !a.versions) out.push(`product code "${code}" lost its versions record`);
    }
  } else if (feed.kind === 'discourse') {
    const prevNewest = Number(before.newestTopicId || 0);
    const newTopics = Number(after.newestTopicId || 0) > prevNewest;
    const prevStaff = new Set((before.staffTopics || []).map((t) => `${t.id}:${t.last_posted_at || ''}`));
    const newStaff = (after.staffTopics || []).filter((t) => !prevStaff.has(`${t.id}:${t.last_posted_at || ''}`));
    if (newStaff.length) {
      for (const t of newStaff) out.push(`staff-touched topic (${t.staff.join(', ')}): "${t.title}" — ${t.url}`);
    }
    if (newTopics && after.newestTopic) {
      out.push(`newest topic is now #${after.newestTopicId} "${after.newestTopic.title}" (${after.newestTopic.url})`);
    }
  }
  return out;
}

/* Which changes deserve an issue. New player topics do not: a forum moves
   every day. A build change, a product-code change or a staff post does. */
function isNotable(feed, changes) {
  if (!changes.length) return false;
  if (feed.kind === 'discourse') return changes.some((c) => c.startsWith('staff-touched topic'));
  return true;
}

/* ---------- fetch ---------- */

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': UA, accept: 'application/json,text/plain,*/*' }
    });
    const body = await res.text();
    if (!res.ok) return { ok: false, status: res.status, reason: `HTTP ${res.status}` };
    return { ok: true, status: res.status, body };
  } catch (err) {
    return { ok: false, status: 0, reason: String(err && err.message ? err.message : err) };
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- main ---------- */

assertRegistered(await loadSources());

const firstRun = !existsSync(STATE_FILE);
const previous = firstRun ? { checked: null, feeds: {} } : JSON.parse(await readFile(STATE_FILE, 'utf8'));
const now = new Date().toISOString();
const state = { checked: now, feeds: { ...previous.feeds } };

const results = [];
for (const feed of FEEDS) {
  const before = previous.feeds[feed.id];
  const res = await fetchText(feed.url);
  let observed = null;
  let reason = null;
  if (res.ok) {
    try { observed = observe(feed, res.body); } catch (err) { reason = `unparseable response: ${err.message}`; }
  } else {
    reason = res.reason;
  }

  if (!observed) {
    const failures = (before && before.failures ? before.failures : 0) + 1;
    const entry = { url: feed.url, kind: feed.kind, label: feed.label, failures, lastError: reason, lastErrorAt: now };
    if (before && before.observed) Object.assign(entry, { observed: before.observed, observedAt: before.observedAt });
    state.feeds[feed.id] = entry;
    results.push({ feed, ok: false, reason, failures, hadBaseline: Boolean(before && before.observed) });
    continue;
  }

  const changes = describeChanges(feed, before && before.observed, observed);
  state.feeds[feed.id] = { url: feed.url, kind: feed.kind, label: feed.label, failures: 0, observed, observedAt: now };
  results.push({ feed, ok: true, observed, changes, notable: isNotable(feed, changes), isNew: !(before && before.observed) });
}

const observedCount = Object.values(state.feeds).filter((f) => f && f.observed).length;
const baselineEstablished = observedCount > 0;
const notable = results.filter((r) => r.ok && r.notable);
const changedAny = results.filter((r) => r.ok && r.changes && r.changes.length);
const failed = results.filter((r) => !r.ok);
const regressed = failed.filter((r) => r.hadBaseline);
const persistentlyBlocked = failed.filter((r) => !r.hadBaseline && r.failures >= 2);

/* ---------- report ---------- */

const day = now.slice(0, 10);
const lines = [];
lines.push(`# Feed watch report — ${day}`);
lines.push('');
lines.push(`Read **${FEEDS.length}** first-party structured feeds (Blizzard version service and forum topic lists), all keyless and all registered in \`data/sources.js\`.`);
lines.push('');
lines.push(`- Feeds observed this run: **${results.filter((r) => r.ok).length}** of ${FEEDS.length}`);
lines.push(`- Notable changes (build, product code, staff post): **${notable.length}**`);
lines.push(`- Unreachable this run: **${failed.length}** (${regressed.length} previously observed)`);
lines.push('');

lines.push('## What the feeds said today');
lines.push('');
lines.push('| Feed | Observation | Read at (UTC) |');
lines.push('| --- | --- | --- |');
for (const r of results) {
  if (!r.ok) { lines.push(`| ${r.feed.label} | _unreachable: ${r.reason}_ | ${now.slice(0, 16).replace('T', ' ')} |`); continue; }
  const o = r.observed;
  let text = '';
  if (r.feed.kind === 'versions') text = `**${o.version}** (BuildId ${o.buildId}) for ${o.regions.join(', ')}`;
  else if (r.feed.kind === 'summary') {
    text = Object.entries(o.products).map(([code, p]) => `${code}: ${!p.present ? 'absent' : p.versions ? 'versions record' : 'cdn only'}`).join('; ');
  } else if (r.feed.kind === 'discourse') {
    text = `${o.topicCount} topics in the page; newest #${o.newestTopicId}${o.newestTopic ? ` "${o.newestTopic.title}"` : ''}; staff-touched topics on the page: ${o.staffTopics.length}`;
  }
  lines.push(`| ${r.feed.label} | ${text} | ${now.slice(0, 16).replace('T', ' ')} |`);
}
lines.push('');

/* Staff-touched topics are listed every run, not only when new: on the very
   first run there is no "before", and a blue post that is already on the page
   would otherwise never be surfaced. */
const staffNow = results.filter((r) => r.ok && r.feed.kind === 'discourse' && r.observed.staffTopics.length);
if (staffNow.length) {
  lines.push('## Staff-touched topics on the page right now (prompts to open, not citations)');
  lines.push('');
  for (const r of staffNow) {
    for (const t of r.observed.staffTopics) {
      lines.push(`- ${r.feed.label}: (${t.staff.join(', ')}) "${t.title}" — ${t.url} — last post ${t.last_posted_at || 'unknown'}`);
    }
  }
  lines.push('');
}

if (notable.length) {
  lines.push('## Notable — re-verify and record with a dated claim');
  lines.push('');
  for (const r of notable) {
    lines.push(`### ${r.feed.label}`);
    lines.push('');
    for (const c of r.changes) lines.push(`- ${c}`);
    lines.push('');
  }
  lines.push('A new build number proves a client changed, not what changed; a staff marker on a topic is a prompt to open the thread, not a verified blue post. Nothing on the site changes until a human has read the source and written the claim.');
  lines.push('');
} else if (changedAny.length) {
  lines.push('## Routine movement (no issue by itself)');
  lines.push('');
  for (const r of changedAny) for (const c of r.changes) lines.push(`- ${r.feed.label}: ${c}`);
  lines.push('');
}

if (failed.length) {
  lines.push('## Unreachable');
  lines.push('');
  lines.push('| Feed | URL | Reason | Consecutive failures |');
  lines.push('| --- | --- | --- | --- |');
  for (const r of failed) lines.push(`| ${r.feed.label} | ${r.feed.url} | ${r.reason} | ${r.failures} |`);
  lines.push('');
  lines.push('The last good observation was kept. A feed that has never answered needs two consecutive failures before it is worth an issue; a feed that used to answer and stopped is reported at once.');
  lines.push('');
}

if (firstRun && baselineEstablished) {
  lines.push('_First run: this is the baseline. Changes are reported from the next run on._');
  lines.push('');
}

const report = lines.join('\n');
await writeFile(REPORT_FILE, report, 'utf8');

const writeState = !DRY_RUN && (baselineEstablished || !firstRun);
if (writeState) await writeFile(STATE_FILE, JSON.stringify(state, null, 2) + '\n', 'utf8');

const needsIssue = !INIT && (
  notable.length > 0 ||
  regressed.length > 0 ||
  persistentlyBlocked.length > 0 ||
  !baselineEstablished
);
const headline = notable.length
  ? notable.map((r) => r.changes[0]).join('; ').slice(0, 120)
  : failed.length ? `${failed.length} feed(s) unreachable` : 'no notable change';

if (process.env.GITHUB_OUTPUT) {
  await writeFile(
    process.env.GITHUB_OUTPUT,
    [
      `feed_needs_issue=${needsIssue ? 'true' : 'false'}`,
      `feed_notable=${notable.length}`,
      `feed_unreachable=${failed.length}`,
      `feed_baseline_established=${baselineEstablished ? 'true' : 'false'}`,
      `feed_headline=${headline.replace(/\r?\n/g, ' ')}`,
      ''
    ].join('\n'),
    { flag: 'a' }
  );
}
if (process.env.GITHUB_STEP_SUMMARY) {
  await writeFile(process.env.GITHUB_STEP_SUMMARY, report + '\n', { flag: 'a' });
}

console.log(report);
