#!/usr/bin/env node
/*
 * check-patterns.mjs — offline audit of the site-pattern register.
 *
 * data/patterns.js records public URL and section shapes observed on the guide
 * sites this project reads. Those patterns are rendered as links, so the register
 * is one careless edit away from publishing a URL nobody registered — or worse, a
 * URL that was never opened. This script enforces, offline:
 *
 *   1. Every pattern states what was observed, why it matters and what it must
 *      never be used for. Structure without limits becomes copying.
 *   2. Every example URL is https and is registered in data/sources.js, so the
 *      citation checker and the weekly watcher cover it as well.
 *   3. Every pattern carries a dated observation — "we think it looks like this"
 *      is not a pattern.
 *   4. An unverified entry publishes NO URL. A guide site's address that this
 *      project could not open must not be linked, even as an example of failure.
 *   5. No entry may present another site's ranking or analysis as this project's
 *      own finding: the `use` and `limit` strings are required to be substantive,
 *      and a pattern whose limit is empty fails rather than warns.
 *
 * Usage:
 *   node tools/check-patterns.mjs            # human-readable report
 *   node tools/check-patterns.mjs --json
 *   node tools/check-patterns.mjs --strict   # warnings also fail the run
 */

import { readFile } from 'node:fs/promises';
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

const rule = await loadGlobal('patterns.js', 'WOWF_PATTERN_RULE');
const patterns = await loadGlobal('patterns.js', 'WOWF_PATTERNS');
const unverified = await loadGlobal('patterns.js', 'WOWF_PATTERNS_UNVERIFIED');
const sources = await loadGlobal('sources.js', 'WOWF_SOURCES');

const SITES = ['Wowhead', 'Icy Veins', 'Skill Capped', 'Wago Addons', 'Blizzard'];

const registered = new Map();
for (const s of sources) {
  for (const u of [s.url, ...(Array.isArray(s.also) ? s.also : [])]) {
    if (typeof u === 'string' && /^https?:\/\//i.test(u)) registered.set(canon(u), s.id);
  }
}

/* ---------- the boundary rule ---------- */
{
  if (!rule || typeof rule !== 'object') errors.push('data/patterns.js does not define window.WOWF_PATTERN_RULE');
  else {
    for (const key of ['allowed', 'forbidden', 'why']) {
      if (!rule[key] || rule[key].length < 60) errors.push(`WOWF_PATTERN_RULE.${key} must state the boundary in a full sentence`);
    }
    const forbidden = (rule.forbidden || '').toLowerCase();
    for (const word of ['scrape', 'rehost']) {
      if (!forbidden.includes(word)) warnings.push(`WOWF_PATTERN_RULE.forbidden does not mention "${word}" — the boundary should name what is refused`);
    }
  }
}

/* ---------- verified patterns ---------- */
{
  if (!Array.isArray(patterns) || patterns.length === 0) {
    errors.push('data/patterns.js defines no patterns');
  } else {
    const ids = new Set();
    for (const p of patterns) {
      const where = `pattern ${p.id || '(no id)'}`;
      if (!p.id) errors.push('a pattern has no id');
      else if (ids.has(p.id)) errors.push(`${where}: duplicate id`);
      else ids.add(p.id);

      if (!SITES.includes(p.site)) errors.push(`${where}: site "${p.site}" is not one this register covers (${SITES.join(', ')})`);
      if (!p.kind) errors.push(`${where}: no kind`);
      if (!p.pattern) errors.push(`${where}: no pattern string`);
      if (!/^\d{4}-\d{2}-\d{2}/.test(p.verified || '')) {
        errors.push(`${where}: verified entries need a dated observation, found "${p.verified || ''}"`);
      }
      if (typeof p.observed !== 'string' || p.observed.length < 80) {
        errors.push(`${where}: "observed" must say what was actually seen (at least 80 characters)`);
      }
      if (!p.reading || p.reading.length < 60) errors.push(`${where}: "reading" must explain why the pattern matters`);
      if (!p.use || p.use.length < 40) errors.push(`${where}: "use" must state how this project uses the pattern`);
      if (!p.limit || p.limit.length < 60) {
        errors.push(`${where}: "limit" must state what the pattern must never be used for — an unlimited pattern fails this check`);
      }

      if (p.examples && !Array.isArray(p.examples)) errors.push(`${where}: examples must be an array`);
      for (const url of p.examples || []) {
        if (!/^https:\/\//i.test(url)) {
          errors.push(`${where}: example is not https → ${url}`);
          continue;
        }
        if (!registered.has(canon(url))) errors.push(`${where}: example URL is not registered in data/sources.js → ${url}`);
      }
    }
  }
}

/* ---------- unverified entries must not smuggle a URL in ---------- */
{
  if (!Array.isArray(unverified)) errors.push('data/patterns.js defines no WOWF_PATTERNS_UNVERIFIED list');
  else {
    for (const u of unverified) {
      const where = `unverified ${u.id || '(no id)'}`;
      if (!u.id) errors.push('an unverified entry has no id');
      if (!u.question) errors.push(`${where}: no question`);
      if (!u.status) errors.push(`${where}: no status`);
      if (!u.note || u.note.length < 60) errors.push(`${where}: the note must explain what happened`);
      if (/https?:\/\//i.test(u.note || '')) {
        errors.push(`${where}: an unverified entry must not publish a URL — this site links only what it has opened`);
      }
    }
  }
}

/* ---------- the register must be published ---------- */
{
  let page = '';
  try {
    page = await readFile(join(ROOT, 'site-patterns.html'), 'utf8');
  } catch {
    errors.push('site-patterns.html is missing — the pattern register is not published anywhere');
  }
  if (page) {
    if (!page.includes('data/patterns.js')) errors.push('site-patterns.html does not load data/patterns.js');
    if (!/WOWF_PATTERNS/.test(page)) errors.push('site-patterns.html never renders the pattern register');
    if (!/WOWF_PATTERNS_UNVERIFIED/.test(page)) {
      warnings.push('site-patterns.html does not publish the unverified list — the failures are part of the finding');
    }
    if (!page.includes('data-count="patterns"')) warnings.push('site-patterns.html does not print a machine-checked pattern total');
  }
}

/* ---------- report ---------- */
if (JSON_OUT) {
  console.log(JSON.stringify({ patterns: patterns.length, unverified: unverified.length, errors, warnings }, null, 2));
} else {
  console.log(`Site-pattern check — ${patterns.length} verified pattern(s), ${unverified.length} unverified question(s)\n`);
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
    console.log('Every pattern states what was observed, how it is used and what it must never be used for; every example URL is a registered source; nothing unverified is linked.');
  }
}

const failed = errors.length > 0 || (STRICT && warnings.length > 0);
process.exit(failed ? 1 : 0);
