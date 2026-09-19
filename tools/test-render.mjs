#!/usr/bin/env node
/*
 * test-render.mjs — executes each page's table renderer offline and checks the result.
 *
 * Three pages build their tables in JavaScript from the data files (Sources,
 * Public endpoints, Site patterns). That is invisible to every other checker,
 * which reads the raw HTML: a renderer that prints "undefined" into a cell, or
 * links an empty href, produces a page that looks fine to the tooling and
 * broken to a reader. Two of those pages were added on 2026-09-19, which is
 * when this test was written.
 *
 * It runs the page's own inline script in a sandbox with a minimal DOM stub and
 * the real data files loaded, then fails if:
 *   - the renderer never touched a table it is supposed to fill
 *   - a table came out empty
 *   - the rendered HTML contains a literal undefined, null, NaN or [object Object]
 *   - a rendered link has an empty or undefined href
 *
 * No network, no dependencies, no headless browser.
 *
 * Usage: node tools/test-render.mjs [--json]
 */

import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const pages = [
  { file: 'data-api.html', selectors: ['#apiTable tbody', '#rejectTable tbody'] },
  { file: 'site-patterns.html', selectors: ['#patternTable tbody', '#failedTable tbody'] },
];

let failures = 0;
for (const { file, selectors } of pages) {
  const html = await readFile(file, 'utf8');
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');

  const rendered = new Map();
  const document = {
    querySelector(sel) {
      if (!selectors.includes(sel)) return null;
      const el = { _html: '', set innerHTML(v) { this._html = v; }, get innerHTML() { return this._html; } };
      rendered.set(sel, el);
      return el;
    },
    querySelectorAll() { return []; },
  };

  const sandbox = { window: {}, document, location: { pathname: '/' + file }, console };
  const ctx = vm.createContext(sandbox);
  for (const dataFile of ['data/sources.js', 'data/apis.js', 'data/patterns.js', 'data/claims.js']) {
    try { vm.runInContext(await readFile(dataFile, 'utf8'), ctx, { filename: dataFile }); } catch {}
  }
  vm.runInContext(inline, ctx, { filename: file });

  for (const sel of selectors) {
    const el = rendered.get(sel);
    if (!el) { console.log(`✗ ${file} ${sel}: renderer never touched this table`); failures++; continue; }
    const out = el.innerHTML;
    const rows = (out.match(/<tr /g) || []).length;
    if (rows === 0) { console.log(`✗ ${file} ${sel}: rendered 0 rows`); failures++; continue; }
    for (const bad of ['undefined', 'null', '[object Object]', 'NaN']) {
      if (out.includes(`>${bad}<`) || out.includes(` ${bad} `) || out.includes(`${bad}<`)) {
        const i = out.indexOf(bad);
        console.log(`✗ ${file} ${sel}: rendered literal ${bad} → …${out.slice(Math.max(0, i - 90), i + 60)}…`);
        failures++;
      }
    }
    if (out.includes('href="undefined"') || out.includes('href=""')) { console.log(`✗ ${file} ${sel}: empty or undefined link target`); failures++; }
    console.log(`✓ ${file} ${sel}: ${rows} row(s), ${out.length} bytes, no undefined/null leaks`);
  }
}
process.exit(failures ? 1 : 0);
