#!/usr/bin/env node
/*
 * check-ledger.mjs — integrity and staleness checks for the claims ledger.
 *
 * Run with no arguments in CI or locally:
 *   node tools/check-ledger.mjs            # integrity only
 *   node tools/check-ledger.mjs --stale 30 # also list claims older than 30 days
 *   node tools/check-ledger.mjs --json     # machine-readable output
 *
 * Exits non-zero if an integrity problem is found (dangling source id, duplicate
 * id, bad status, malformed date, or evidence-class mismatch). Unused sources are
 * warnings: a registered source may be a page-level reading link before it is
 * needed by a claim. Staleness is reported but does not fail the run, because a
 * claim can be correct and old.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const argv = process.argv.slice(2);
const JSON_OUT = argv.includes('--json');
const staleIdx = argv.indexOf('--stale');
const STALE_DAYS = staleIdx !== -1 ? Number(argv[staleIdx + 1]) : null;

async function loadGlobal(file, key) {
  const js = await readFile(join(ROOT, 'data', file), 'utf8');
  const fn = new Function('window', js + `\nreturn window.${key};`);
  return fn({});
}

const sources = await loadGlobal('sources.js', 'WOWF_SOURCES');
const claims = await loadGlobal('claims.js', 'WOWF_CLAIMS');

const VALID_TIERS = new Set(['official', 'press', 'datamine', 'guide', 'community', 'tooling']);
const VALID_STATUS = new Set(['official', 'press', 'datamine', 'guide', 'community', 'tooling', 'ours', 'unknown']);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const FIRST_PARTY_HOST = /(^|\.)blizzard\.com$|(^|\.)battle\.net$|(^|\.)blizzard\.net$|(^|\.)forums\.blizzard\.com$/i;

const errors = [];
const warnings = [];

/* ---- sources ---- */
const seenSource = new Set();
const sourceById = new Map();
for (const s of sources) {
  if (!s.id) errors.push('source with no id');
  if (seenSource.has(s.id)) errors.push(`duplicate source id: ${s.id}`);
  seenSource.add(s.id);
  sourceById.set(s.id, s);
  if (!VALID_TIERS.has(s.tier)) errors.push(`source ${s.id}: invalid tier "${s.tier}"`);
  if (!s.url) errors.push(`source ${s.id}: no url`);
  if (!Array.isArray(s.supports) || s.supports.length === 0) warnings.push(`source ${s.id}: no "supports" lines`);
  if (!s.title) errors.push(`source ${s.id}: no title`);
  if (!s.publisher) errors.push(`source ${s.id}: no publisher`);

  // “Official” is reserved for a first-party Blizzard URL. This prevents a
  // secondary article or search snippet from silently becoming official just
  // because it repeats a Blizzard statement.
  let host = '';
  if (/^https?:\/\//i.test(s.url || '')) {
    try { host = new URL(s.url).hostname; } catch { errors.push(`source ${s.id}: invalid URL "${s.url}"`); }
  } else if (s.tier !== 'community' || !/^method\.html#/i.test(s.url || '')) {
    errors.push(`source ${s.id}: non-HTTP sources must be a documented internal flag link`);
  }
  if (s.tier === 'official') {
    if (s.firstParty !== true) errors.push(`source ${s.id}: official sources must set firstParty: true`);
    if (host && !FIRST_PARTY_HOST.test(host)) errors.push(`source ${s.id}: official source is not on a Blizzard first-party host (${host})`);
  } else if (s.firstParty === true) {
    errors.push(`source ${s.id}: firstParty is only valid for tier "official"`);
  }
}

/* ---- claims ---- */
const seenClaim = new Set();
const usedSources = new Set();
const stale = [];
const today = new Date();

for (const c of claims) {
  if (!c.id) errors.push('claim with no id');
  if (seenClaim.has(c.id)) errors.push(`duplicate claim id: ${c.id}`);
  seenClaim.add(c.id);

  if (!VALID_STATUS.has(c.status)) errors.push(`claim ${c.id}: invalid status "${c.status}"`);
  if (!c.claim || c.claim.trim().length < 10) errors.push(`claim ${c.id}: empty or trivial claim text`);
  if (!DATE_RE.test(c.snapshot || '')) errors.push(`claim ${c.id}: bad snapshot date "${c.snapshot}"`);
  if (!Array.isArray(c.sources) || c.sources.length === 0) {
    errors.push(`claim ${c.id}: no sources`);
  } else {
    for (const sid of c.sources) {
      if (!seenSource.has(sid)) errors.push(`claim ${c.id}: cites unknown source "${sid}"`);
      usedSources.add(sid);
    }
  }

  const citedTiers = (c.sources || [])
    .map((sid) => sourceById.get(sid)?.tier)
    .filter(Boolean);
  if (c.status === 'official' && !citedTiers.includes('official')) {
    errors.push(`claim ${c.id}: status "official" requires at least one first-party official source`);
  }
  if (c.status === 'press' && !citedTiers.some((tier) => tier === 'press' || tier === 'official')) {
    errors.push(`claim ${c.id}: status "press" requires a press or official source`);
  }
  if (c.status === 'guide' && !citedTiers.includes('guide')) {
    errors.push(`claim ${c.id}: status "guide" requires a guide source`);
  }
  if (c.status === 'datamine' && !citedTiers.includes('datamine')) {
    errors.push(`claim ${c.id}: status "datamine" requires a datamine source`);
  }
  if (c.status === 'community' && !citedTiers.includes('community')) {
    errors.push(`claim ${c.id}: status "community" requires a community source`);
  }
  // Tooling rows are about software (addon builds, price tools), never about the
  // game. The class exists so an addon listing cannot be filed as a datamine,
  // which would overstate it.
  if (c.status === 'tooling' && !citedTiers.includes('tooling')) {
    errors.push(`claim ${c.id}: status "tooling" requires a tooling source`);
  }

  // An "ours" claim is analysis; it must still point at the facts it reasons from.
  if (c.status === 'ours' && (!c.sources || !c.sources.length)) {
    errors.push(`claim ${c.id}: status "ours" still needs the verified facts it reasons from`);
  }

  if (STALE_DAYS && DATE_RE.test(c.snapshot || '')) {
    const age = Math.floor((today - new Date(c.snapshot + 'T00:00:00Z')) / 86400000);
    if (age > STALE_DAYS) stale.push({ id: c.id, snapshot: c.snapshot, age, cat: c.cat });
  }
}

for (const s of sources) {
  if (!usedSources.has(s.id)) warnings.push(`source ${s.id} is registered but not cited by any claim`);
}

const result = {
  sources: sources.length,
  claims: claims.length,
  errors,
  warnings,
  staleThresholdDays: STALE_DAYS,
  stale
};

if (JSON_OUT) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Ledger check — ${sources.length} sources, ${claims.length} claims`);
  const byStatus = {};
  for (const c of claims) byStatus[c.status] = (byStatus[c.status] || 0) + 1;
  console.log('By evidence class: ' + Object.entries(byStatus).map(([k, v]) => `${k}=${v}`).join(', '));
  console.log('');
  if (errors.length) {
    console.log(`ERRORS (${errors.length}):`);
    for (const e of errors) console.log('  ✗ ' + e);
  } else {
    console.log('No integrity errors.');
  }
  if (warnings.length) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) console.log('  ! ' + w);
  }
  if (STALE_DAYS) {
    console.log(`\nClaims older than ${STALE_DAYS} days: ${stale.length}`);
    for (const s of stale) console.log(`  · ${s.id} (${s.cat}) last checked ${s.snapshot}, ${s.age} days ago`);
  }
}

process.exit(errors.length ? 1 : 0);
