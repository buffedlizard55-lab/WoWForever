#!/usr/bin/env node
/*
 * test-watch-feeds.mjs — offline proof that the feed watcher behaves as documented.
 *
 * The authoring environment cannot reach battle.net, so the watcher's first
 * real run happens on the GitHub runner. What can be tested here is its logic:
 * global fetch is replaced by the same fixture double the source watcher's
 * test uses (tools/test-fixture-fetch.mjs) and the real script runs against
 * fixtures shaped like the responses recorded on 2026-09-19.
 *
 * Scenarios, in order:
 *   0. every feed URL is a registered source (registry guard)
 *   1. first run, everything reachable      → baseline written, values parsed, no issue
 *   2. a build number moves                 → notable change, issue wanted, "old → new" printed
 *   3. a product code gains a versions row  → notable change (the "wowf went live" signal)
 *   4. forum: a new player topic            → routine, no issue; a staff-touched topic → issue
 *   5. a feed that used to answer fails     → regression, last observation kept, issue wanted
 *   6. first run with nothing reachable     → NO baseline written, issue wanted
 *   7. a feed that has never answered       → issue only after two consecutive failures
 *
 * Usage: node tools/test-watch-feeds.mjs
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
const SCRIPT = join(HERE, 'watch-feeds.mjs');

const failures = [];
function check(label, condition, detail = '') {
  if (condition) console.log(`  ✓ ${label}`);
  else { console.log(`  ✗ ${label}${detail ? ' — ' + detail : ''}`); failures.push(label); }
}

/* ---------- 0. registry guard ---------- */
console.log('Feed watcher offline test — fixtures only, no network access\n');
console.log('0. Every feed URL is a registered source');
const { stdout: listOut } = await run(process.execPath, [SCRIPT, '--list'], { cwd: ROOT });
const feeds = JSON.parse(listOut);
const sourcesJs = await readFile(join(ROOT, 'data', 'sources.js'), 'utf8');
const sources = new Function('window', sourcesJs + '\nreturn window.WOWF_SOURCES;')({});
const canon = (u) => String(u || '').replace(/\/+$/, '').toLowerCase();
const registered = new Set();
for (const s of sources) { registered.add(canon(s.url)); (s.also || []).forEach((u) => registered.add(canon(u))); }
check('the feed list is non-empty', feeds.length >= 4, String(feeds.length));
for (const f of feeds) check(`${f.id} → registered URL`, registered.has(canon(f.url)), f.url);
const byId = Object.fromEntries(feeds.map((f) => [f.id, f]));
const url = (id) => byId[id].url;

/* ---------- fixtures shaped like the 2026-09-19 responses ---------- */
const tact = (version, buildId, regions, seqn) =>
  'Region!STRING:0|BuildConfig!HEX:16|CDNConfig!HEX:16|KeyRing!HEX:16|BuildId!DEC:4|VersionsName!String:0|ProductConfig!HEX:16\n' +
  `## seqn = ${seqn}\n` +
  regions.map((r) => `${r}|6c0df97e8e481a9a41600e373367c200|5525ea1ce6668e895569c89c2d6a154c||${buildId}|${version}|fcfd1bc39031f5921d00aee2d869adb5`).join('\n') + '\n';

const summary = ({ wowfVersions = false } = {}) =>
  'Product!STRING:0|Seqn!DEC:4|Flags!STRING:0\n## seqn = 4027205\n' +
  'agent|3433090|cdn\nagent|3990403|\n' +
  'wow|4019522|cdn\nwow|4026319|\n' +
  'wow_anniversary|4019538|cdn\nwow_anniversary|4026317|\n' +
  'wow_classic|4019526|cdn\nwow_classic|4026309|\n' +
  'wow_classic_beta|4019530|cdn\nwow_classic_beta|4026306|\n' +
  'wow_classic_era|4019533|cdn\nwow_classic_era|4026318|\n' +
  'wow_classic_era_beta|4019534|cdn\n' +
  'wow_cn_beta|4019539|cdn\n' +
  'wowf|4019540|cdn\n' + (wowfVersions ? 'wowf|4027300|\n' : '') +
  'zeus|3439234|cdn\n';

const staffUser = { id: 3390, username: 'Kaivax', name: 'Kaivax', primary_group_name: 'community-manager', flair_name: 'community-manager', admin: true, moderator: true, trust_level: 4 };
const player = (id, name) => ({ id, username: `${name}-${id}`, name, trust_level: 2, animated_avatar: null });
const topic = (id, title, posters, when = '2026-09-19T21:55:14.810Z') => ({
  id, title, fancy_title: title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  posts_count: posters.length, created_at: when, last_posted_at: when, bumped_at: when, category_id: 349,
  posters: posters.map((uid, i) => ({ extras: i === posters.length - 1 ? 'latest' : null, description: i ? 'Recent Poster' : 'Original Poster', user_id: uid, primary_group_id: null, flair_group_id: null }))
});
const discourse = (topics, users) => JSON.stringify({ users, topic_list: { can_create_topic: false, per_page: 30, topics } });

const players = [player(1489126, 'Galaris'), player(2850695, 'Chimmee'), player(269017, 'Mastar')];
const forumQuiet = discourse([
  topic(2355348, "Don't see any of the visual world updates", [1489126, 2850695, 269017]),
  topic(2355100, 'Hall of Thanes feedback', [2850695])
], players);
const forumNewPlayerTopic = discourse([
  topic(2355400, 'Ruins of Lordaeron queue times', [269017], '2026-09-20T09:00:00.000Z'),
  topic(2355348, "Don't see any of the visual world updates", [1489126, 2850695, 269017]),
  topic(2355100, 'Hall of Thanes feedback', [2850695])
], players);
const forumStaffTopic = discourse([
  topic(2355500, 'Beta build notes — level cap raised to 30', [3390, 269017], '2026-09-21T17:00:00.000Z'),
  topic(2355348, "Don't see any of the visual world updates", [1489126, 2850695, 269017])
], [staffUser, ...players]);

const healthy = {
  responses: {
    [url('versions:wow_classic_beta')]: { body: tact('1.60.1.69913', 69913, ['us', 'eu', 'kr', 'tw'], 4026306) },
    [url('versions:wow_classic_era')]: { body: tact('1.15.9.69722', 69722, ['us', 'eu', 'cn', 'kr', 'tw'], 4026318) },
    [url('versions:wow_classic')]: { body: tact('5.5.4.69585', 69585, ['us', 'eu', 'cn', 'kr', 'tw'], 4026309) },
    [url('summary:wow-products')]: { body: summary() },
    [url('forum:us-forever-346')]: { body: forumQuiet },
    [url('forum:us-forever-beta-349')]: { body: forumQuiet }
  },
  default: { status: 404 }
};
const withOverride = (overrides) => ({ responses: { ...healthy.responses, ...overrides }, default: healthy.default });

const dir = await mkdtemp(join(tmpdir(), 'wowf-feeds-'));

async function scenario(name, config, stateFile, extraArgs = []) {
  const fixtureFile = join(dir, `${name}.fixtures.json`);
  await writeFile(fixtureFile, JSON.stringify(config), 'utf8');
  const outFile = join(dir, `${name}.out`);
  await writeFile(outFile, '', 'utf8');
  const reportFile = join(dir, `${name}.report.md`);
  const env = {
    ...process.env,
    WOWF_TEST_FIXTURES: fixtureFile,
    WOWF_FEED_STATE_FILE: stateFile,
    WOWF_FEED_REPORT_FILE: reportFile,
    GITHUB_OUTPUT: outFile,
    GITHUB_STEP_SUMMARY: join(dir, `${name}.summary.md`)
  };
  const { stdout } = await run(process.execPath, ['--import', FIXTURE, SCRIPT, ...extraArgs], { cwd: ROOT, env, maxBuffer: 16 * 1024 * 1024 });
  const outputs = Object.fromEntries(
    (await readFile(outFile, 'utf8')).split('\n').filter(Boolean).map((line) => {
      const [k, ...rest] = line.split('=');
      return [k, rest.join('=')];
    })
  );
  const report = existsSync(reportFile) ? await readFile(reportFile, 'utf8') : '';
  const state = existsSync(stateFile) ? JSON.parse(await readFile(stateFile, 'utf8')) : null;
  return { stdout, outputs, report, state };
}

/* ---------- 1. first run ---------- */
console.log('\n1. First run with every feed reachable');
{
  const stateFile = join(dir, 's1.state.json');
  const { outputs, report, state } = await scenario('s1', healthy, stateFile);
  check('a baseline file was written', Boolean(state));
  check('every feed was observed', state && Object.values(state.feeds).every((f) => f.observed), state ? JSON.stringify(Object.keys(state.feeds)) : 'no state');
  const beta = state && state.feeds['versions:wow_classic_beta'].observed;
  check('the wow_classic_beta build is parsed as 1.60.1.69913', beta && beta.version === '1.60.1.69913' && beta.buildId === '69913', beta && `${beta.version} / ${beta.buildId}`);
  check('the regions are recorded', beta && beta.regions.join(',') === 'us,eu,kr,tw', beta && beta.regions.join(','));
  check('the sequence number is recorded', beta && beta.seqn === 4026306, beta && String(beta.seqn));
  const sum = state && state.feeds['summary:wow-products'].observed;
  check('the summary marks wowf as cdn-only', sum && sum.products.wowf.present && sum.products.wowf.cdn && !sum.products.wowf.versions);
  check('the summary marks wow_classic_beta as having a versions record', sum && sum.products.wow_classic_beta.versions === true);
  const forum = state && state.feeds['forum:us-forever-beta-349'].observed;
  check('the forum newest topic id is recorded', forum && forum.newestTopicId === 2355348, forum && String(forum.newestTopicId));
  check('the forum topic URL is the public page form', forum && forum.newestTopic.url === 'https://us.forums.blizzard.com/en/wow/t/don-t-see-any-of-the-visual-world-updates/2355348', forum && forum.newestTopic.url);
  check('no staff-touched topic on a quiet page', forum && forum.staffTopics.length === 0);
  check('no issue is wanted on a clean baseline', outputs.feed_needs_issue === 'false', outputs.feed_needs_issue);
  check('the baseline is marked established', outputs.feed_baseline_established === 'true', outputs.feed_baseline_established);
  check('the report says it is a baseline', /First run: this is the baseline/.test(report));
  check('the report prints the build number', report.includes('**1.60.1.69913**'));
}

/* ---------- 2. build moves ---------- */
console.log('\n2. The wow_classic_beta build number moves');
{
  const stateFile = join(dir, 's2.state.json');
  await scenario('s2a', healthy, stateFile);
  const bumped = withOverride({ [url('versions:wow_classic_beta')]: { body: tact('1.60.1.70001', 70001, ['us', 'eu', 'kr', 'tw'], 4026999) } });
  const { outputs, report, state } = await scenario('s2b', bumped, stateFile);
  check('one notable change is counted', outputs.feed_notable === '1', outputs.feed_notable);
  check('an issue is wanted', outputs.feed_needs_issue === 'true', outputs.feed_needs_issue);
  check('the report prints old → new', report.includes('1.60.1.69913 (BuildId 69913) → 1.60.1.70001 (BuildId 70001)'));
  check('the headline output carries the movement', /1\.60\.1\.70001/.test(outputs.feed_headline), outputs.feed_headline);
  check('the state now holds the new build', state.feeds['versions:wow_classic_beta'].observed.version === '1.60.1.70001');
  check('the control products are not reported as changed', !/wow_classic_era.*build moved/.test(report));
}

/* ---------- 3. a product code gains a versions record ---------- */
console.log('\n3. The wowf product code gains a versions record');
{
  const stateFile = join(dir, 's3.state.json');
  await scenario('s3a', healthy, stateFile);
  const live = withOverride({ [url('summary:wow-products')]: { body: summary({ wowfVersions: true }) } });
  const { outputs, report } = await scenario('s3b', live, stateFile);
  check('the change is notable', outputs.feed_notable === '1', outputs.feed_notable);
  check('the report names the product and the path to try', report.includes('product code "wowf" now carries a versions record — /products/wowf/versions should answer'));
}

/* ---------- 4. forum movement ---------- */
console.log('\n4. Forum: player topics are routine, staff topics are notable');
{
  const stateFile = join(dir, 's4.state.json');
  await scenario('s4a', healthy, stateFile);
  const playerOnly = withOverride({ [url('forum:us-forever-beta-349')]: { body: forumNewPlayerTopic } });
  const a = await scenario('s4b', playerOnly, stateFile);
  check('a new player topic is not notable', a.outputs.feed_notable === '0', a.outputs.feed_notable);
  check('a new player topic files no issue', a.outputs.feed_needs_issue === 'false', a.outputs.feed_needs_issue);
  check('but it is listed as routine movement', /Routine movement/.test(a.report) && a.report.includes('#2355400'));
  const staff = withOverride({ [url('forum:us-forever-beta-349')]: { body: forumStaffTopic } });
  const b = await scenario('s4c', staff, stateFile);
  check('a staff-touched topic is notable', b.outputs.feed_notable === '1', b.outputs.feed_notable);
  check('an issue is wanted', b.outputs.feed_needs_issue === 'true', b.outputs.feed_needs_issue);
  check('the report names the staff member and links the thread', b.report.includes('staff-touched topic (Kaivax): "Beta build notes — level cap raised to 30" — https://us.forums.blizzard.com/en/wow/t/beta-build-notes-level-cap-raised-to-30/2355500'));
  check('the report says the marker is a prompt, not a verified blue post', /not a verified blue post/.test(b.report));
  const c = await scenario('s4d', staff, stateFile);
  check('the same staff topic is not reported twice', c.outputs.feed_notable === '0', c.outputs.feed_notable);
}

/* ---------- 5. regression ---------- */
console.log('\n5. A feed that used to answer stops answering');
{
  const stateFile = join(dir, 's5.state.json');
  await scenario('s5a', healthy, stateFile);
  const before = JSON.parse(await readFile(stateFile, 'utf8'));
  const broken = withOverride({ [url('versions:wow_classic_beta')]: { status: 503 } });
  const { outputs, report, state } = await scenario('s5b', broken, stateFile);
  check('the failure is counted', state.feeds['versions:wow_classic_beta'].failures === 1, String(state.feeds['versions:wow_classic_beta'].failures));
  check('the last good observation is kept', state.feeds['versions:wow_classic_beta'].observed.version === before.feeds['versions:wow_classic_beta'].observed.version);
  check('an issue is wanted for a regression', outputs.feed_needs_issue === 'true', outputs.feed_needs_issue);
  check('the report has an Unreachable section naming the feed', /## Unreachable/.test(report) && /HTTP 503/.test(report));
  const garbage = withOverride({ [url('versions:wow_classic_beta')]: { body: '<html>maintenance</html>' } });
  const g = await scenario('s5c', garbage, stateFile);
  check('an unparseable body counts as a failure, not as a change', g.state.feeds['versions:wow_classic_beta'].failures === 2 && g.outputs.feed_notable === '0', `${g.state.feeds['versions:wow_classic_beta'].failures} / ${g.outputs.feed_notable}`);
}

/* ---------- 6. first run, nothing reachable ---------- */
console.log('\n6. First run where nothing can be reached');
{
  const stateFile = join(dir, 's6.state.json');
  const { outputs, state } = await scenario('s6', { responses: {}, default: { error: 'getaddrinfo ENOTFOUND' } }, stateFile);
  check('no baseline file is written', !state);
  check('the baseline is reported as not established', outputs.feed_baseline_established === 'false', outputs.feed_baseline_established);
  check('an issue is wanted, so a blocked runner is visible', outputs.feed_needs_issue === 'true', outputs.feed_needs_issue);
}

/* ---------- 7. never reachable ---------- */
console.log('\n7. A feed that has never answered needs two failures');
{
  const stateFile = join(dir, 's7.state.json');
  const blocked = withOverride({ [url('forum:us-forever-346')]: { status: 403 } });
  const first = await scenario('s7a', blocked, stateFile);
  check('one failure does not file an issue', first.outputs.feed_needs_issue === 'false', first.outputs.feed_needs_issue);
  check('the other feeds still form a baseline', first.outputs.feed_baseline_established === 'true');
  const second = await scenario('s7b', blocked, stateFile);
  check('the second consecutive failure files an issue', second.outputs.feed_needs_issue === 'true', second.outputs.feed_needs_issue);
  check('--init records a baseline without asking for an issue', (await scenario('s7c', healthy, join(dir, 's7c.state.json'), ['--init'])).outputs.feed_needs_issue === 'false');
}

await rm(dir, { recursive: true, force: true });

console.log('');
if (failures.length) {
  console.error(`FAILED — ${failures.length} check(s) did not hold:`);
  for (const f of failures) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('All feed-watch scenarios behaved as documented.');
