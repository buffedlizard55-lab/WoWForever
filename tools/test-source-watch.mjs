#!/usr/bin/env node
/*
 * test-source-watch.mjs — offline proof that the source watcher behaves correctly.
 *
 * The authoring environment has no outbound network access and the GitHub token
 * available to this session cannot dispatch workflows, so the first scheduled
 * source-watch run cannot be observed from here. What CAN be tested offline is
 * the watcher's logic, by replacing global fetch with a fixture server and
 * running the real script against it.
 *
 * Scenarios, in order:
 *   1. first run, everything reachable        → baseline written, no issue
 *   2. one page edited                        → change reported, issue wanted
 *   3. a previously reachable page now fails  → regression, fingerprint kept
 *   4. first run with nothing reachable       → NO baseline written, issue wanted
 *   5. a source that has never worked         → issue only after two failures
 *
 * Usage: node tools/test-source-watch.mjs
 */

import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const FIXTURE = pathToFileURL(join(HERE, 'test-fixture-fetch.mjs')).href;

/* Read the registry the same way the watcher does, so every registered URL is
   served by the fixture and no request is left to the real network. */
const sourcesJs = await readFile(join(ROOT, 'data', 'sources.js'), 'utf8');
const sources = new Function('window', sourcesJs + '\nreturn window.WOWF_SOURCES;')({});
const urls = [];
const urlKey = new Map();   // url -> the state key the watcher will use
const seenUrls = new Set();
function addUrl(url, key) {
  if (!/^https?:\/\//i.test(url || '')) return;
  const canon = String(url).replace(/\/+$/, '').toLowerCase();
  if (seenUrls.has(canon)) return;   // the watcher fetches a URL once
  seenUrls.add(canon);
  urls.push(url);
  urlKey.set(url, key);
}
/* Mirror expandSources(): every main URL first, then each source's extra pages. */
for (const s of sources) addUrl(s.url, s.id);
for (const s of sources) {
  (Array.isArray(s.also) ? s.also : []).forEach((extra, index) => addUrl(extra, `${s.id}::also-${index + 1}`));
}
const keyFor = (url) => urlKey.get(url);

if (!urls.length) {
  console.error('No registered URLs found — the fixture would test nothing.');
  process.exit(1);
}

const dir = await mkdtemp(join(tmpdir(), 'wowf-watch-'));
const failures = [];

function check(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    console.log(`  ✗ ${label}${detail ? ' — ' + detail : ''}`);
    failures.push(label);
  }
}

async function scenario(name, config, { stateFile, summaryFile }) {
  const fixtureFile = join(dir, `${name}.fixtures.json`);
  await writeFile(fixtureFile, JSON.stringify(config), 'utf8');
  const outFile = join(dir, `${name}.out`);
  await writeFile(outFile, '', 'utf8');
  const reportFile = join(dir, `${name}.report.md`);
  const env = {
    ...process.env,
    WOWF_TEST_FIXTURES: fixtureFile,
    WOWF_STATE_FILE: stateFile,
    WOWF_REPORT_FILE: reportFile,
    GITHUB_OUTPUT: outFile,
    GITHUB_STEP_SUMMARY: summaryFile || join(dir, `${name}.summary.md`)
  };
  const { stdout } = await run(process.execPath, ['--import', FIXTURE, join(HERE, 'check-sources.mjs')], {
    cwd: ROOT,
    env,
    maxBuffer: 32 * 1024 * 1024
  });
  const outputs = Object.fromEntries(
    (await readFile(outFile, 'utf8'))
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [k, ...rest] = line.split('=');
        return [k, rest.join('=')];
      })
  );
  const report = existsSync(reportFile) ? await readFile(reportFile, 'utf8') : '';
  const state = existsSync(stateFile) ? JSON.parse(await readFile(stateFile, 'utf8')) : null;
  return { stdout, outputs, report, state };
}

const healthy = { responses: {}, default: { body: '<html><body>source page</body></html>' } };
const sameBody = (text) => ({ responses: {}, default: { body: `<html><body>${text}</body></html>` } });

console.log('Source watcher offline test — fixtures only, no network access');
console.log(`  (${urls.length} registered URLs served by the fixture)\n`);

/* ---------- 1. first run: baseline only ---------- */
console.log('1. First run with every source reachable');
{
  const stateFile = join(dir, 's1.state.json');
  const { outputs, report, state } = await scenario('s1', healthy, { stateFile });
  check('a baseline file was written', Boolean(state));
  check('the baseline covers every URL', state && Object.keys(state.sources).length === urls.length,
    state ? `${Object.keys(state.sources).length} of ${urls.length}` : 'no state');
  check('nothing is reported as changed', outputs.changed === '0', outputs.changed);
  check('the baseline is marked established', outputs.baseline_established === 'true', outputs.baseline_established);
  check('no issue is wanted on a clean baseline', outputs.needs_issue === 'false', outputs.needs_issue);
  check('every source is listed as newly fingerprinted', /## Newly fingerprinted/.test(report));
  check('no regression section on a clean run', !/## Regressions/.test(report));
}

/* ---------- 2. a page changes ---------- */
console.log('\n2. A cited page is edited');
{
  const stateFile = join(dir, 's2.state.json');
  await scenario('s2a', healthy, { stateFile });
  const target = urls[0];
  const config = { responses: { [target]: { body: '<html><body>source page with an extra sentence</body></html>' } }, default: { body: '<html><body>source page</body></html>' } };
  const { outputs, report } = await scenario('s2b', config, { stateFile });
  check('one change is detected', outputs.changed === '1', outputs.changed);
  check('an issue is wanted', outputs.needs_issue === 'true', outputs.needs_issue);
  check('the report names the changed source', report.includes(target), target);
  check('the report explains what a change does not mean', /not that our claim is wrong/.test(report));
}

/* ---------- 3. a source goes away ---------- */
console.log('\n3. A previously reachable source fails');
{
  const stateFile = join(dir, 's3.state.json');
  await scenario('s3a', healthy, { stateFile });
  const before = JSON.parse(await readFile(stateFile, 'utf8'));
  const target = urls[1];
  const config = { responses: { [target]: { status: 404 } }, default: { body: '<html><body>source page</body></html>' } };
  const { outputs, report, state } = await scenario('s3b', config, { stateFile });
  check('the failure is counted as a regression', outputs.regressed === '1', outputs.regressed);
  check('an issue is wanted', outputs.needs_issue === 'true', outputs.needs_issue);
  check('the old fingerprint is preserved', state.sources[keyFor(target)].hash === before.sources[keyFor(target)].hash);
  check('the failure count is recorded', state.sources[keyFor(target)].failures === 1, String(state.sources[keyFor(target)].failures));
  check('the report has a regression section', /## Regressions/.test(report));
}

/* ---------- 4. first run with nothing reachable ---------- */
console.log('\n4. First run where nothing can be reached');
{
  const stateFile = join(dir, 's4.state.json');
  const config = { responses: {}, default: { error: 'getaddrinfo ENOTFOUND' } };
  const { outputs, state } = await scenario('s4', config, { stateFile });
  check('no baseline file is written', !state);
  check('the baseline is reported as not established', outputs.baseline_established === 'false', outputs.baseline_established);
  check('every URL is reported unreachable', outputs.unreachable === String(urls.length), outputs.unreachable);
  check('an issue is wanted, so a blocked runner is visible', outputs.needs_issue === 'true', outputs.needs_issue);
}

/* ---------- 5. a source that has never worked ---------- */
console.log('\n5. A source that has never been reachable needs two failures');
{
  const stateFile = join(dir, 's5.state.json');
  const target = urls[2];
  const config = { responses: { [target]: { status: 403 } }, default: { body: '<html><body>source page</body></html>' } };
  const first = await scenario('s5a', config, { stateFile });
  check('one failure does not file an issue', first.outputs.needs_issue === 'false', first.outputs.needs_issue);
  check('the attempt is recorded', first.state.sources[keyFor(target)].failures === 1, String(first.state.sources[keyFor(target)].failures));
  const second = await scenario('s5b', config, { stateFile: join(dir, 's5.state.json') });
  check('the second consecutive failure files an issue', second.outputs.needs_issue === 'true', second.outputs.needs_issue);
  check('the report lists it as never reachable', /## Never reachable from this runner/.test(second.report));
}

await rm(dir, { recursive: true, force: true });

console.log('');
if (failures.length) {
  console.error(`FAILED — ${failures.length} check(s) did not hold:`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('All source-watch scenarios behaved as documented.');
