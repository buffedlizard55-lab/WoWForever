#!/usr/bin/env node
/*
 * check-citations.mjs — offline integrity audit for a "no hallucinations" site.
 *
 * This script never touches the network. It answers four questions that a
 * human reviewer would otherwise have to check by hand, page by page:
 *
 *   1. Does every external link on the site point at a URL that is registered
 *      in data/sources.js? (An unregistered link is an uncited claim.)
 *   2. Is every registered source actually used — cited by a claim or linked
 *      from at least one page?
 *   3. Does every internal link resolve — the file exists and the #fragment
 *      matches a real id in that file?
 *   4. Do the claim IDs printed in the prose exist in data/claims.js, and are
 *      all pages on the same snapshot date?
 *
 * It also runs a deliberately simple HTML tag-balance check with <script> and
 * <style> bodies removed, which is how the missing </section> on the Method
 * page was found. It is a heuristic, not a parser: it fails loudly rather than
 * pretending to be a validator.
 *
 * Usage:
 *   node tools/check-citations.mjs            # human-readable report
 *   node tools/check-citations.mjs --json     # machine-readable
 *   node tools/check-citations.mjs --strict   # warnings also fail the run
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const argv = process.argv.slice(2);
const JSON_OUT = argv.includes('--json');
const STRICT = argv.includes('--strict');

/* ------------------------------------------------------------------ *
 * Load the registry and the ledger the same way the browser and the    *
 * ledger checker do: evaluate the plain `window.X = [...]` assignment. *
 * ------------------------------------------------------------------ */

async function loadGlobal(file, key) {
  const js = await readFile(join(ROOT, 'data', file), 'utf8');
  const fn = new Function('window', js + `\nreturn window.${key};`);
  return fn({});
}

const sources = await loadGlobal('sources.js', 'WOWF_SOURCES');
const claims = await loadGlobal('claims.js', 'WOWF_CLAIMS');

/* Normalise a URL for comparison: no trailing slash, no fragment, and the
   www. prefix ignored, so a link and its registry entry cannot disagree over
   cosmetic differences. */
function canon(url) {
  return String(url)
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/[#?].*$/, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}

const sourceUrls = new Map(); // canonical url -> source id
for (const s of sources) {
  const urls = [s.url, ...(Array.isArray(s.also) ? s.also : [])];
  for (const u of urls) {
    if (typeof u === 'string' && /^https?:\/\//i.test(u)) sourceUrls.set(canon(u), s.id);
  }
}

/* Pages that are part of the site itself. tools/, data/ and assets/ are not
   scanned for links; their content is checked elsewhere. */
const htmlFiles = (await readdir(ROOT)).filter((f) => f.endsWith('.html')).sort();

const errors = [];
const warnings = [];
const info = { pages: [], externalLinks: new Map(), citations: new Map(), selfLinks: [] };

/* The site's own canonical base URL. Canonical <link> tags are absolute
   self-references, not citations, so they are resolved to a local file and
   checked for existence instead of against the source registry. */
const SITE = 'https://buffedlizard55-lab.github.io/WoWForever/';

const CLAIM_ID_RE = /\bC\d{3}\b/g;
const EXTERNAL_RE = /href=["'](https?:\/\/[^"']+)["']/g;
const INTERNAL_RE = /href=["']([^"'#][^"']*\.html)(#[^"']+)?["']/g;
const ANCHOR_RE = /id=["']([^"']+)["']/g;

for (const file of htmlFiles) {
  const raw = await readFile(join(ROOT, file), 'utf8');

  /* ---------- 1. external links must be registered sources ---------- */
  const externals = new Set();
  for (const m of raw.matchAll(EXTERNAL_RE)) {
    const url = m[1];
    if (url.startsWith(SITE)) {
      const rest = url.slice(SITE.length).split('#')[0];
      /* The home page is served as both / and /index.html, so both forms are
         legal self-references; anything else must resolve to a real file. */
      const local = rest === '' ? 'index.html' : rest;
      if (!existsSync(join(ROOT, local))) {
        errors.push(`${file}: canonical/self link points at a file that does not exist → ${rest}`);
      }
      info.selfLinks.push({ file, url, resolved: local });
      continue; // self-reference, not a citation
    }
    externals.add(url);
    if (!sourceUrls.has(canon(url))) {
      errors.push(`${file}: external link is not a registered source → ${url}`);
    } else {
      const id = sourceUrls.get(canon(url));
      info.citations.set(id, (info.citations.get(id) || 0) + 1);
    }
  }
  info.externalLinks.set(file, externals);

  /* ---------- 2. internal links and fragments ---------- */
  for (const m of raw.matchAll(INTERNAL_RE)) {
    const target = m[1];
    if (/^https?:/i.test(target)) continue; // absolute links are handled above
    const frag = m[2] ? m[2].slice(1) : null;
    if (!existsSync(join(ROOT, target))) {
      errors.push(`${file}: internal link to a missing file → ${target}`);
      continue;
    }
    if (frag) {
      const targetRaw = target === file ? raw : await readFile(join(ROOT, target), 'utf8');
      const ids = new Set([...targetRaw.matchAll(ANCHOR_RE)].map((x) => x[1]));
      if (!ids.has(frag)) {
        errors.push(`${file}: link to #${frag} but ${target} has no element with that id`);
      }
    }
  }

  /* ---------- 3. same-page anchors (#id) ---------- */
  const ids = new Set([...raw.matchAll(ANCHOR_RE)].map((x) => x[1]));
  for (const m of raw.matchAll(/href=["']#([^"']+)["']/g)) {
    if (!ids.has(m[1])) errors.push(`${file}: same-page link to #${m[1]} with no such id`);
  }

  /* ---------- 4. claim IDs mentioned in prose must exist ---------- */
  const mentioned = new Set(raw.match(CLAIM_ID_RE) || []);
  for (const id of mentioned) {
    if (!claims.some((c) => c.id === id)) {
      errors.push(`${file}: mentions claim ${id}, which is not in the ledger`);
    }
  }

  /* ---------- 5. snapshot dates agree across the site ---------- */
  const snaps = new Set([...raw.matchAll(/data-snapshot>([\d-]+)</g)].map((m) => m[1]));
  if (snaps.size > 1) errors.push(`${file}: mixed snapshot dates ${[...snaps].join(', ')}`);
  for (const s of snaps) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) errors.push(`${file}: malformed snapshot date "${s}"`);
  }

  /* ---------- 6. crude tag balance, ignoring script/style bodies ---------- */
  const stripped = raw
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const tracked = ['html', 'head', 'body', 'main', 'header', 'footer', 'nav', 'section', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'div', 'ul', 'ol', 'li', 'details', 'summary', 'caption'];
  for (const tag of tracked) {
    const open = (stripped.match(new RegExp(`<${tag}(\\s|>)`, 'gi')) || []).length;
    const close = (stripped.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (open !== close) errors.push(`${file}: <${tag}> opened ${open}× but closed ${close}×`);
  }

  /* ---------- 7. the canonical link must point at this page ---------- */
  const canonical = raw.match(/<link rel="canonical" href="([^"]+)"/i);
  if (file === '404.html') {
    if (canonical) warnings.push('404.html: has a canonical link; a 404 page should not claim one URL as its address');
  } else {
    const expected = file === 'index.html' ? SITE : SITE + file;
    if (!canonical) errors.push(`${file}: no <link rel="canonical">`);
    else if (canonical[1] !== expected) {
      errors.push(`${file}: canonical is ${canonical[1]} but this page is served at ${expected}`);
    }
  }

  info.pages.push(file);
}

/* ---------- 8. sitemap.xml and the page list must agree ---------- */
{
  const sitemapPath = join(ROOT, 'sitemap.xml');
  if (!existsSync(sitemapPath)) {
    errors.push('sitemap.xml is missing');
  } else {
    const locs = [...readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const expected = new Set([
      SITE,
      ...htmlFiles.filter((f) => f !== '404.html' && f !== 'index.html').map((f) => SITE + f),
    ]);
    for (const loc of locs) {
      if (!expected.has(loc)) errors.push(`sitemap.xml lists ${loc}, which is not one of this site's pages`);
      expected.delete(loc);
    }
    for (const missing of expected) errors.push(`sitemap.xml does not list ${missing}`);
  }
  const robotsPath = join(ROOT, 'robots.txt');
  if (!existsSync(robotsPath)) errors.push('robots.txt is missing');
  else if (!/Sitemap:\s*\S+/i.test(readFileSync(robotsPath, 'utf8'))) {
    errors.push('robots.txt does not point at the sitemap');
  }
}

/* ---------- every registered source should be used somewhere ---------- */
const usedIds = new Set(info.citations.keys());
for (const c of claims) for (const id of c.sources || []) usedIds.add(id);
for (const s of sources) {
  if (!usedIds.has(s.id)) warnings.push(`source ${s.id} is registered but never cited or linked`);
}

/* ---------- output ---------- */
const result = { pages: info.pages.length, sources: sources.length, claims: claims.length, errors, warnings };

if (JSON_OUT) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Citation check — ${info.pages.length} pages, ${sources.length} registered sources, ${claims.length} claims`);
  console.log('');
  if (errors.length) {
    console.log(`ERRORS (${errors.length}):`);
    for (const e of errors) console.log('  ✗ ' + e);
  } else {
    console.log('No citation errors: every external link is a registered source, every internal link and anchor resolves, and every claim ID printed in the prose exists.');
  }
  if (warnings.length) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) console.log('  ! ' + w);
  }
  const unused = htmlFiles.length ? '' : '';
  void unused;
  console.log('');
  console.log('Registered sources linked from pages: ' + info.citations.size + ' distinct ids');
}

process.exit(errors.length || (STRICT && warnings.length) ? 1 : 0);
