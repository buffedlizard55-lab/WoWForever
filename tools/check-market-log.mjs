#!/usr/bin/env node
/*
 * check-market-log.mjs — schema and sanity checks for data/market-log.csv.
 *
 * The market log is the one place on this site where a human types numbers by
 * hand, so it is the one place where a typo could become a false published
 * fact. This script enforces the schema documented at the top of the CSV and
 * refuses rows that cannot be true.
 *
 * Rules:
 *   - The header row must match the documented column list exactly.
 *   - Data rows must have 9 fields; quoted commas in notes are supported;
 *     dates must be real ISO dates; faction is restricted; quantities and
 *     copper prices are integers.
 *   - Before the 4 November 2026 launch there is no auction house, so any data
 *     row at all is an error. This makes "we do not publish invented prices"
 *     a machine-checked rule rather than a promise.
 *   - Item names or category labels are cross-checked against the watchlist
 *     table on gold.html (the #watchlist section). Off-list items are warnings
 *     by default and errors under --strict. To add a real item, add its exact
 *     verified name to that table first.
 *
 * Usage:
 *   node tools/check-market-log.mjs
 *   node tools/check-market-log.mjs --strict
 *   node tools/check-market-log.mjs --json
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const argv = process.argv.slice(2);
const JSON_OUT = argv.includes('--json');
const STRICT = argv.includes('--strict');

const LAUNCH = '2026-11-04'; // verified launch date; no auction house before it
const EXPECTED = ['date', 'faction', 'item', 'item_id', 'qty_listed', 'min_buyout_c', 'observer', 'source_url', 'note'];
const FACTIONS = new Set(['alliance', 'horde']);

const csvText = await readFile(join(ROOT, 'data', 'market-log.csv'), 'utf8');

/* A small RFC 4180-compatible line parser is enough here: notes may contain
   commas, but the log deliberately does not support embedded newlines. */
function parseCsvLine(line) {
  const cells = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (ch === ',' && !quoted) {
      cells.push(field.trim());
      field = '';
    } else {
      field += ch;
    }
  }
  if (quoted) return { error: 'unterminated quoted field' };
  cells.push(field.trim());
  return { cells };
}

const physicalLines = csvText.split(/\r?\n/);
const dataLines = physicalLines
  .map((line, index) => ({ line, number: index + 1 }))
  .filter(({ line }) => line.trim() !== '' && !line.trimStart().startsWith('##'));

const errors = [];
const warnings = [];

if (!dataLines.length) {
  errors.push('data/market-log.csv has no header row');
}

const headerResult = dataLines.length ? parseCsvLine(dataLines[0].line) : { cells: [] };
if (headerResult.error) errors.push(`header: ${headerResult.error}`);
const header = headerResult.cells || [];
if (dataLines.length && header.join(',') !== EXPECTED.join(',')) {
  errors.push(`header mismatch:\n    expected: ${EXPECTED.join(',')}\n    found:    ${header.join(',')}`);
}

/* ---------- pull the watchlist labels out of the Gold page ---------- */
const goldHtml = await readFile(join(ROOT, 'gold.html'), 'utf8');
const watchSection = goldHtml.split('id="watchlist"')[1] || '';
const watchNames = new Set(
  [...watchSection.matchAll(/<tr>\s*<td>([^<]+)<\/td>/g)].map((m) => m[1].trim().toLowerCase())
);
if (watchNames.size === 0) warnings.push('could not read any watchlist rows from gold.html#watchlist');

function validIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

/* ---------- validate rows ---------- */
const rowRecords = dataLines.slice(1);
const today = new Date().toISOString().slice(0, 10);

rowRecords.forEach(({ line, number }) => {
  const parsed = parseCsvLine(line);
  if (parsed.error) {
    errors.push(`line ${number}: ${parsed.error}`);
    return;
  }
  const cells = parsed.cells;
  if (cells.length !== EXPECTED.length) {
    errors.push(`line ${number}: expected ${EXPECTED.length} fields, found ${cells.length}`);
    return;
  }
  const [date, faction, item, itemId, qty, buyout, observer, sourceUrl] = cells;

  if (!validIsoDate(date)) errors.push(`line ${number}: date "${date}" is not a real ISO YYYY-MM-DD date`);
  if (!FACTIONS.has(faction.toLowerCase())) errors.push(`line ${number}: faction "${faction}" must be alliance or horde`);
  if (!item) errors.push(`line ${number}: item name is empty`);
  if (itemId && !/^\d+$/.test(itemId)) errors.push(`line ${number}: item_id "${itemId}" is not numeric (leave blank if unconfirmed)`);
  if (!/^\d+$/.test(qty)) errors.push(`line ${number}: qty_listed "${qty}" is not a whole number`);
  if (!/^\d+$/.test(buyout) || BigInt(buyout || '0') <= 0n) errors.push(`line ${number}: min_buyout_c must be a positive integer of copper`);
  if (!observer) errors.push(`line ${number}: observer is empty — every observation must be attributable`);
  if (sourceUrl && !/^https?:\/\//i.test(sourceUrl)) errors.push(`line ${number}: source_url "${sourceUrl}" is not a URL`);

  if (validIsoDate(date) && date < LAUNCH) {
    errors.push(`line ${number}: observation dated ${date}, before the ${LAUNCH} launch — no auction house exists, so this row cannot be a real observation`);
  }
  if (validIsoDate(date) && date > today) errors.push(`line ${number}: observation dated ${date}, which is in the future`);

  if (item && watchNames.size && !watchNames.has(item.toLowerCase())) {
    const msg = `line ${number}: "${item}" is not on the gold.html watchlist — add it there first, or record why it is being logged off-list`;
    if (STRICT) errors.push(msg); else warnings.push(msg);
  }
});

const result = {
  dataRows: rowRecords.length,
  watchlistEntries: watchNames.size,
  launchDate: LAUNCH,
  errors,
  warnings
};

if (JSON_OUT) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Market log check — ${rowRecords.length} data row(s), ${watchNames.size} watchlist entries on gold.html`);
  if (!rowRecords.length) console.log('Empty by design: no auction house exists before 4 November 2026, so a row here would be invented data.');
  if (errors.length) {
    console.log(`\nERRORS (${errors.length}):`);
    for (const e of errors) console.log('  ✗ ' + e);
  } else {
    console.log('Schema valid; no impossible rows.');
  }
  if (warnings.length) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) console.log('  ! ' + w);
  }
}

process.exit(errors.length ? 1 : 0);
