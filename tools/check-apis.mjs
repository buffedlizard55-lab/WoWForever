#!/usr/bin/env node
/*
 * check-apis.mjs — offline audit of the public-endpoint register.
 *
 * The brief allows no source that needs a signup, a key that cannot be obtained
 * without an account, or a free tier. A page can *say* that; a checker has to
 * prove the register actually holds to it. This script answers, with no network:
 *
 *   1. Is every entry complete — publisher, format, and a description of what a
 *      plain request actually returned?
 *   2. Does every entry marked "verified" pass all three eligibility tests, carry
 *      a real fetch date, and name both its use and its limit?
 *   3. Is every published URL registered in data/sources.js, so the citation
 *      checker and the weekly source watcher cover it too?
 *   4. Is a rejected or pending candidate genuinely unused — i.e. its URL appears
 *      as a link on no page except the one documenting the refusal, and a pending
 *      entry publishes no URL at all?
 *   5. Is the register actually published, rather than sitting in the data folder
 *      where no reader can see it?
 *
 * A register that fails to state a limit is treated as a failure, not a warning:
 * an endpoint with no stated limit is an invitation, and this project's whole
 * position is that limits are part of the evidence.
 *
 * Usage:
 *   node tools/check-apis.mjs            # human-readable report
 *   node tools/check-apis.mjs --json
 *   node tools/check-apis.mjs --strict   # warnings also fail the run
 */

import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const argv = process.argv.slice(2);
const JSON_OUT = argv.includes('--json');
const STRICT = argv.includes('--strict');

const errors = [];
const warnings = [];

async function loadGlobal(file, key) {
  const js = await readFile(join(ROOT, 'data', file), 'utf8');
  const fn = new Function('window', js + `\nreturn window.${key};`);
  return fn({});
}

function canon(url) {
  return String(url)
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/[#?].*$/, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}

const rule = await loadGlobal('apis.js', 'WOWF_API_RULE');
const apis = await loadGlobal('apis.js', 'WOWF_APIS');
const sources = await loadGlobal('sources.js', 'WOWF_SOURCES');

const EVIDENCE_CLASSES = ['official', 'press', 'datamine', 'guide', 'tooling', 'community', 'ours', 'unknown'];
const STATUSES = ['verified', 'pending', 'rejected'];

/* Every URL the site is allowed to link, built exactly the way the citation
   checker builds it: the main url of each source plus any `also` entries. */
const registered = new Map();
for (const s of sources) {
  for (const u of [s.url, ...(Array.isArray(s.also) ? s.also : [])]) {
    if (typeof u === 'string' && /^https?:\/\//i.test(u)) registered.set(canon(u), s.id);
  }
}

/* ---------- the rule block ---------- */
{
  if (!rule || typeof rule !== 'object') {
    errors.push('data/apis.js does not define window.WOWF_API_RULE');
  } else {
    if (!rule.title) errors.push('WOWF_API_RULE has no title');
    if (!Array.isArray(rule.tests) || rule.tests.length !== 3) {
      errors.push(`WOWF_API_RULE should define exactly three eligibility tests, found ${rule.tests ? rule.tests.length : 0}`);
    } else {
      const keys = new Set();
      for (const t of rule.tests) {
        if (!t.key || !t.label || !t.test) errors.push('WOWF_API_RULE.test entry missing key, label or test');
        else keys.add(t.key);
        if (t.test && t.test.length < 40) warnings.push(`rule test "${t.key}" is very short (${t.test.length} chars)`);
      }
      for (const k of ['noKey', 'noSignup', 'noTier']) {
        if (!keys.has(k)) errors.push(`WOWF_API_RULE is missing the "${k}" test`);
      }
    }
    if (!rule.fallback || rule.fallback.length < 40) errors.push('WOWF_API_RULE has no usable fallback statement');
    if (!rule.protocol || rule.protocol.length < 40) errors.push('WOWF_API_RULE has no usable protocol statement');
  }
}

/* ---------- per-entry checks ---------- */
{
  if (!Array.isArray(apis) || apis.length === 0) {
    errors.push('data/apis.js defines no endpoints');
  } else {
    const ids = new Set();
    const verified = [];
    for (const a of apis) {
      const where = `endpoint ${a.id || '(no id)'}`;
      if (!a.id) errors.push('an endpoint has no id');
      else if (ids.has(a.id)) errors.push(`${where}: duplicate id`);
      else ids.add(a.id);

      if (!a.name) errors.push(`${where}: no name`);
      if (!a.publisher) errors.push(`${where}: no publisher`);
      if (!a.format) errors.push(`${where}: no format`);
      if (!EVIDENCE_CLASSES.includes(a.tier)) errors.push(`${where}: tier "${a.tier}" is not an evidence class used on this site`);
      if (!STATUSES.includes(a.status)) errors.push(`${where}: status "${a.status}" is not one of ${STATUSES.join(', ')}`);
      if (typeof a.observed !== 'string' || a.observed.length < 80) {
        errors.push(`${where}: "observed" must describe what a request actually returned (at least 80 characters)`);
      }

      for (const key of ['noKey', 'noSignup', 'noTier']) {
        if (!(key in a)) errors.push(`${where}: eligibility flag "${key}" is missing`);
        else if (a[key] !== true && a[key] !== false && a[key] !== null) {
          errors.push(`${where}: eligibility flag "${key}" must be true, false or null`);
        }
      }

      if (a.status === 'verified') {
        verified.push(a);
        for (const key of ['noKey', 'noSignup', 'noTier']) {
          if (a[key] !== true) {
            errors.push(`${where}: marked verified but "${key}" is ${JSON.stringify(a[key])} — a verified endpoint must pass all three tests`);
          }
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(a.verified || '')) {
          errors.push(`${where}: verified entries need a YYYY-MM-DD fetch date, found "${a.verified || ''}"`);
        }
        if (!Array.isArray(a.fields) || a.fields.length === 0) {
          errors.push(`${where}: a verified endpoint must list at least one field it actually returns`);
        }
        if (!a.use || a.use.length < 40) errors.push(`${where}: verified entries need a real "use" statement`);
        if (!a.limit || a.limit.length < 60) errors.push(`${where}: verified entries need a real "limit" statement`);
      }

      if (a.status === 'rejected') {
        if (!a.limit || a.limit.length < 60) errors.push(`${where}: a rejected candidate must state what the refusal costs`);
        if (a.noKey !== false && a.noKey !== true && a.noKey !== null) errors.push(`${where}: bad noKey flag`);
        if (a.noTier !== false && a.noTier !== true && a.noTier !== null) errors.push(`${where}: bad noTier flag`);
      }

      if (a.status === 'pending') {
        /* Pending means: not resolved, and therefore nothing about it is
           asserted or linked. */
        if (a.url) {
          errors.push(`${where}: a pending candidate must not publish a URL — this site only links what it has read`);
        }
        if (a.noKey !== null || a.noSignup !== null || a.noTier !== null) {
          errors.push(`${where}: a pending candidate must not claim eligibility either way (flags must be null)`);
        }
        if (!a.limit || a.limit.length < 40) errors.push(`${where}: a pending candidate must say what would resolve it`);
      }

      if (a.url) {
        if (!/^https:\/\//i.test(a.url)) errors.push(`${where}: url is not https → ${a.url}`);
        else if (!registered.has(canon(a.url))) errors.push(`${where}: url is not registered in data/sources.js → ${a.url}`);
      }
    }

    if (verified.length === 0) errors.push('no endpoint is marked verified — the page would have nothing to show');
  }
}

/* ---------- a rejected or pending candidate must be genuinely unused ----------
   One deliberate exception: the page that documents the refusal may link the
   refused URL. A rejection a reader cannot check is an assertion, not evidence,
   and the whole point of the register is that a reader can open Blizzard's own
   documentation and read the requirement for themselves. Every OTHER page is
   held to the absolute rule: a rejected endpoint is never linked. */
{
  const pages = (await readdir(ROOT)).filter((f) => f.endsWith('.html'));
  const DOCC_PAGE = 'data-api.html';
  const rejectedUrls = new Map();
  for (const a of apis) {
    if (a.status !== 'verified' && a.url) rejectedUrls.set(canon(a.url), a.id);
  }
  for (const file of pages) {
    const raw = await readFile(join(ROOT, file), 'utf8');
    for (const m of raw.matchAll(/href=["'](https?:\/\/[^"']+)["']/g)) {
      const id = rejectedUrls.get(canon(m[1]));
      if (!id) continue;
      if (file === DOCC_PAGE) continue;
      errors.push(`${file}: links to ${m[1]}, which is a rejected endpoint (${id}) — only ${DOCC_PAGE} may link a refused URL, and only to document the refusal`);
    }
  }
  const docPage = await readFile(join(ROOT, DOCC_PAGE), 'utf8');
  if (!/rejected/i.test(docPage)) {
    warnings.push(`${DOCC_PAGE} links a rejected endpoint but never uses the word "rejected" — the refusal must be stated, not implied`);
  }
}

/* ---------- the register must be readable by a human, not just by us ---------- */
{
  const page = await readFile(join(ROOT, 'data-api.html'), 'utf8');
  if (!page.includes('data/apis.js')) errors.push('data-api.html does not load data/apis.js');
  if (!page.includes('data-count="apis"')) {
    warnings.push('data-api.html does not print a machine-checked endpoint total');
  }
  if (!/WOWF_APIS/.test(page)) errors.push('data-api.html never renders the register');
}

/* ---------- report ---------- */
const verifiedCount = apis.filter((a) => a.status === 'verified').length;
const rejectedCount = apis.filter((a) => a.status === 'rejected').length;
const pendingCount = apis.filter((a) => a.status === 'pending').length;

if (JSON_OUT) {
  console.log(JSON.stringify({
    total: apis.length,
    verified: verifiedCount,
    rejected: rejectedCount,
    pending: pendingCount,
    errors,
    warnings
  }, null, 2));
} else {
  console.log(`Endpoint register check — ${apis.length} candidate(s): ${verifiedCount} verified, ${rejectedCount} rejected, ${pendingCount} pending\n`);
  if (errors.length) {
    console.log(`ERRORS (${errors.length}):`);
    for (const e of errors) console.log('  ✗ ' + e);
    console.log('');
  }
  if (warnings.length) {
    console.log(`WARNINGS (${warnings.length}):`);
    for (const w of warnings) console.log('  ! ' + w);
    console.log('');
  }
  if (!errors.length) {
    console.log('Every verified endpoint passes all three eligibility tests, states what it returned, what it is for and what it must never be used for. Rejected and pending candidates are published with their evidence, and no page links a refused URL except the page documenting the refusal.');
  }
}

const failed = errors.length > 0 || (STRICT && warnings.length > 0);
process.exit(failed ? 1 : 0);
