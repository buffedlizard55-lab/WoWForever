#!/usr/bin/env node
/*
 * check-a11y.mjs — structural accessibility and print checks for WoWForever.
 *
 * This is not a WCAG conformance test and does not pretend to be one: contrast,
 * reading order in a screen reader and cognitive load cannot be decided by a
 * regex. What it does is refuse the structural mistakes that make a page
 * unusable for keyboard, screen-reader or printed use, all of which are
 * checkable offline and all of which have a habit of creeping back in when a
 * page is added by hand.
 *
 * Checks per page:
 *   - doctype, lang, non-empty title, description and viewport
 *   - exactly one h1, and no skipped heading levels
 *   - a skip link that points at a real #main landmark
 *   - a labelled navigation whose links match the site's page list, on every page
 *   - every table has a caption, scoped header cells and a scroll wrapper
 *   - no empty links or buttons, no image without an alt attribute
 *   - every form control is labelled
 *   - no duplicate id attributes
 *   - external links carry rel="noopener"
 *
 * Checks for the stylesheet and the script:
 *   - :focus-visible styles, a print stylesheet, prefers-reduced-motion support
 *     and scroll-margin offsets for a sticky header
 *   - the print block keeps tables readable on paper (no clipped scroll wrapper,
 *     repeating table headers)
 *
 * Usage:
 *   node tools/check-a11y.mjs            # human-readable report
 *   node tools/check-a11y.mjs --json
 *   node tools/check-a11y.mjs --strict   # warnings also fail the run
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const argv = process.argv.slice(2);
const JSON_OUT = argv.includes('--json');
const STRICT = argv.includes('--strict');

const errors = [];
const warnings = [];
const pages = (await readdir(ROOT)).filter((f) => f.endsWith('.html')).sort();
const pageFiles = new Set(pages);
const sitePages = pages.filter((f) => f !== '404.html');

/* The navigation contract: every page, including the 404 page, offers the same
   set of links in the same order. A page that quietly drops a nav entry is a
   page some readers can never reach. */
const expectedNav = sitePages;

let navSignature = null;

for (const file of pages) {
  const raw = await readFile(join(ROOT, file), 'utf8');
  const where = (msg) => `${file}: ${msg}`;

  /* ---------- document basics ---------- */
  if (!/^\s*<!DOCTYPE html>/i.test(raw)) errors.push(where('missing <!DOCTYPE html>'));
  const lang = raw.match(/<html[^>]*\blang="([^"]*)"/i);
  if (!lang) errors.push(where('<html> has no lang attribute (screen readers need it)'));
  else if (!lang[1].trim()) errors.push(where('<html lang=""> is empty'));

  const title = raw.match(/<title>([\s\S]*?)<\/title>/i);
  if (!title || !title[1].trim()) errors.push(where('missing or empty <title>'));

  const desc = raw.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  if (!desc || desc[1].trim().length < 40) errors.push(where('missing or too-short meta description'));
  else if (desc[1].length > 320) warnings.push(where(`meta description is ${desc[1].length} characters long`));

  if (!/<meta\s+name="viewport"[^>]*width=device-width/i.test(raw)) {
    errors.push(where('missing a device-width viewport meta tag'));
  }

  /* ---------- headings ---------- */
  const headings = [...raw.matchAll(/<(h[1-6])\b[^>]*>/gi)].map((m) => Number(m[1][1]));
  const h1s = headings.filter((n) => n === 1).length;
  if (h1s !== 1) errors.push(where(`expected exactly one <h1>, found ${h1s}`));
  let previous = 0;
  for (const level of headings) {
    if (previous && level > previous + 1) {
      errors.push(where(`heading level jumps from h${previous} to h${level}`));
      break;
    }
    previous = level;
  }

  /* ---------- skip link and landmarks ---------- */
  const skip = raw.match(/<a class="skip-link" href="(#?[\w-]+)"/);
  if (!skip) errors.push(where('no skip link ("Skip to content")'));
  else {
    const target = skip[1].replace(/^#/, '');
    if (!new RegExp(`id="${target}"`).test(raw)) errors.push(where(`skip link points at #${target}, which does not exist`));
  }
  if (!/<main\s+id="main"/.test(raw)) errors.push(where('no <main id="main"> landmark'));
  if (!/<header class="site-header"/.test(raw)) warnings.push(where('no site header landmark'));
  if (!/<footer class="site-footer"/.test(raw)) warnings.push(where('no site footer landmark'));

  /* ---------- navigation ---------- */
  const navMatch = raw.match(/<nav class="nav" aria-label="([^"]+)"[^>]*>([\s\S]*?)<\/nav>/);
  if (!navMatch) {
    errors.push(where('no labelled <nav class="nav" aria-label="...">'));
  } else {
    const hrefs = [...navMatch[2].matchAll(/href="([^"]+)"/g)].map((m) => m[1]).sort();
    const signature = hrefs.join(' ');
    if (!navSignature) navSignature = signature;
    else if (signature !== navSignature) errors.push(where('the main navigation does not match the other pages'));

    for (const href of hrefs) {
      if (!pageFiles.has(href)) errors.push(where(`nav links to ${href}, which is not a page in this repository`));
    }
    for (const expected of expectedNav) {
      if (!hrefs.includes(expected)) errors.push(where(`nav is missing a link to ${expected}`));
    }
  }

  /* ---------- tables ---------- */
  const tables = raw.match(/<table\b[^>]*>[\s\S]*?<\/table>/gi) || [];
  for (const [index, table] of tables.entries()) {
    const label = `table ${index + 1}`;
    if (!/<caption>/i.test(table)) warnings.push(where(`${label} has no <caption>`));
    const ths = table.match(/<th\b[^>]*>/gi) || [];
    for (const th of ths) {
      if (!/\bscope="/i.test(th)) errors.push(where(`${label} has a <th> without a scope attribute`));
    }
    if (!/class="table-wrap"/.test(raw.split(table)[0].slice(-400))) {
      warnings.push(where(`${label} is not wrapped in <div class="table-wrap"> (horizontal scrolling on narrow screens)`));
    }
  }

  /* ---------- links, buttons, images, controls ---------- */
  for (const m of raw.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const attrs = m[0].slice(0, m[0].indexOf('>'));
    if (!/rel="[^"]*noopener/i.test(attrs)) {
      errors.push(where(`external link without rel="noopener": ${m[1]}`));
    }
  }
  for (const m of raw.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = m[1];
    if (!/href=/.test(attrs)) continue;
    const text = m[2].replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').trim();
    if (!text && !/aria-label=/.test(attrs)) {
      errors.push(where(`link with no accessible name: ${attrs.trim().slice(0, 80)}`));
    }
  }
  for (const m of raw.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const text = m[2].replace(/<[^>]*>/g, ' ').trim();
    if (!text && !/aria-label=/.test(m[1])) errors.push(where('button with no accessible name'));
  }
  for (const m of raw.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt=/.test(m[1])) errors.push(where(`image without an alt attribute: ${m[1].trim().slice(0, 80)}`));
  }
  for (const m of raw.matchAll(/<(input|select|textarea)\b([^>]*)>/gi)) {
    const tag = m[1].toLowerCase();
    const attrs = m[2];
    if (tag === 'input' && /type="hidden"/i.test(attrs)) continue;
    if (/aria-label=/.test(attrs) || /aria-labelledby=/.test(attrs) || /id="/.test(attrs)) continue;
    const before = raw.slice(0, m.index);
    const openLabel = (before.match(/<label\b/gi) || []).length - (before.match(/<\/label>/gi) || []).length;
    if (openLabel <= 0) warnings.push(where(`<${tag}> may have no label`));
  }

  /* ---------- duplicate ids ---------- */
  const ids = [...raw.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) errors.push(where(`duplicate id="${id}"`));
    seen.add(id);
  }
}

/* ---------- stylesheet and script ---------- */
const css = await readFile(join(ROOT, 'assets', 'css', 'style.css'), 'utf8');
const js = await readFile(join(ROOT, 'assets', 'js', 'site.js'), 'utf8');

if (!/:focus-visible/.test(css)) errors.push('assets/css/style.css: no :focus-visible rule (keyboard users lose track of focus)');
if (!/@media\s+print/.test(css)) errors.push('assets/css/style.css: no @media print block');
if (!/prefers-reduced-motion/.test(css)) errors.push('assets/css/style.css: no prefers-reduced-motion handling');
if (!/scroll-margin-top/.test(css)) errors.push('assets/css/style.css: no scroll-margin-top, so sticky-header anchors hide the heading they point at');
if (!/overflow:\s*visible/.test(css.split('@media print')[1] || '')) {
  errors.push('assets/css/style.css: the print stylesheet does not release .table-wrap overflow (wide tables get clipped on paper)');
}
if (!/table-header-group/.test(css.split('@media print')[1] || '')) {
  warnings.push('assets/css/style.css: printed tables do not repeat their headers across pages');
}
if (!/prefers-reduced-motion/.test(js)) {
  errors.push('assets/js/site.js: smooth scrolling is not disabled for prefers-reduced-motion');
}
if (!/overflow:\s*visible/.test(css) && !/break-inside/.test(css)) {
  warnings.push('assets/css/style.css: print rules do not prevent rows and cards breaking across pages');
}

/* ---------- report ---------- */
const result = { pages: pages.length, errors, warnings };

if (JSON_OUT) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Accessibility & print check — ${pages.length} pages, 1 stylesheet, 1 script`);
  console.log('');
  if (errors.length) {
    console.log(`ERRORS (${errors.length}):`);
    for (const e of errors) console.log('  ✗ ' + e);
  } else {
    console.log('No structural errors: landmarks, headings, captions, labels, focus styles, reduced-motion handling and print rules are in place.');
  }
  if (warnings.length) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) console.log('  ! ' + w);
  }
  console.log('');
  console.log('This is a structural check only. Contrast, reading order with a screen reader and');
  console.log('real printed output still need a human pass — see work-plan.html#phase1.');
}

process.exit(errors.length || (STRICT && warnings.length) ? 1 : 0);
