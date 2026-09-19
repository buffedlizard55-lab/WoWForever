#!/usr/bin/env node
/*
 * check-quotes.mjs — flags quotations that are not anchored to a source.
 *
 *   node tools/check-quotes.mjs             # report; exit 0 (advisory by default)
 *   node tools/check-quotes.mjs --strict    # exit 1 if anything is unanchored
 *   node tools/check-quotes.mjs --json      # machine-readable
 *   node tools/check-quotes.mjs --all       # also list the anchored quotations
 *
 * Rule being checked: a quoted phrase has to sit near a link to the page it was
 * read from, or near a claim id — which resolves to that link in the ledger.
 * "Near" means within --window characters of HTML in either direction, which
 * covers a table cell, its row and the caption above it.
 *
 * The tool checks anchoring, not wording. Whether the words match the live page
 * is a human job, and the Method page says so (I-11–I-13). What this removes is
 * the silent case: a quotation that looks sourced but has no source anywhere
 * near it.
 *
 * Quotations listed in tools/quote-allowlist.txt (one exact string per line,
 * blank lines and # comments ignored) are interface labels rather than claims
 * about the game — "Where it comes from", "best at level 20" — and are skipped.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const showAll = args.includes('--all');
const strict = args.includes('--strict');
const num = (flag, fallback) => {
  const i = args.indexOf(flag);
  if (i === -1) return fallback;
  const n = Number(args[i + 1]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};
const minWords = num('--min-words', 3);
const window = num('--window', 1400);

const allowPath = join(root, 'tools', 'quote-allowlist.txt');
const allow = new Set(
  existsSync(allowPath)
    ? readFileSync(allowPath, 'utf8')
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#'))
    : []
);

const linkRe = /href="https?:\/\//;
const claimRe = /\bC\d{3}\b/;

const pages = readdirSync(root)
  .filter((f) => f.endsWith('.html'))
  .sort();

const findings = [];
const anchored = [];
const allowed = [];
let quoteCount = 0;

for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');

  for (const m of html.matchAll(/“([^”]{2,400})”/g)) {
    const text = m[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length < minWords) continue;
    quoteCount += 1;

    if (allow.has(text)) {
      allowed.push({ page, quote: text });
      continue;
    }

    const at = m.index ?? 0;
    const around = html.slice(Math.max(0, at - window), at + m[0].length + window);
    const entry = { page, quote: text, char: at };
    if (linkRe.test(around) || claimRe.test(around)) anchored.push(entry);
    else findings.push(entry);
  }
}

if (asJson) {
  console.log(JSON.stringify({ minWords, window, quoteCount, findings, anchored, allowed }, null, 2));
} else {
  console.log(
    `Quote audit — ${pages.length} pages, ${quoteCount} quotation(s) of ${minWords}+ words ` +
      `(${allowed.length} allow-listed as interface labels, ${anchored.length} anchored)`
  );
  if (showAll) {
    console.log('\nAnchored (informational):');
    for (const a of anchored) console.log(`  ok  ${a.page} “${a.quote.slice(0, 95)}”`);
  }
  if (findings.length === 0) {
    console.log(
      `\nNo unanchored quotations: every quotation of ${minWords}+ words sits within ${window} characters of a source link or a claim id.`
    );
    console.log('Anchoring is checked here; wording and provenance are checked by hand against the live page (method.html I-11–I-16).');
  } else {
    console.log(`\n${findings.length} quotation(s) with no source link or claim id nearby:`);
    for (const f of findings) console.log(`  !!  ${f.page} “${f.quote.slice(0, 110)}”`);
    console.log(
      '\nFix by linking the page the quote came from, citing its claim id, or removing the quotation marks.\n' +
        'If the string is interface text rather than a claim about the game, add it to tools/quote-allowlist.txt.'
    );
  }
}

process.exit(strict && findings.length > 0 ? 1 : 0);
