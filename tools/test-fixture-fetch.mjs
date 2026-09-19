#!/usr/bin/env node
/*
 * test-fixture-fetch.mjs — replaces global fetch with a fixture server.
 *
 * Loaded by tools/test-source-watch.mjs through `node --import`, before the
 * watcher runs, so the watcher's real code path is exercised without touching
 * the network. The fixture file is JSON:
 *
 *   { "default": { "body": "..." } | { "status": 404 } | { "error": "..." },
 *     "responses": { "https://exact/url": { ...same shape... } } }
 *
 * This file is a test double. It is never imported by the site or by the
 * production watcher.
 */

import { readFileSync } from 'node:fs';

const configPath = process.env.WOWF_TEST_FIXTURES;
if (!configPath) throw new Error('test-fixture-fetch.mjs loaded without WOWF_TEST_FIXTURES');

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const requests = [];

globalThis.fetch = async (url) => {
  const key = String(url);
  requests.push(key);
  const rule = (config.responses && config.responses[key]) || config.default || { body: '' };

  if (rule.error) throw new Error(rule.error);

  const status = rule.status || 200;
  if (status >= 400) {
    return new Response('fixture error', { status, statusText: `Fixture ${status}` });
  }
  return new Response(rule.body ?? '', { status: 200, headers: { 'content-type': 'text/html' } });
};

/* Exposed for a debugging session: node --import ./tools/test-fixture-fetch.mjs -e ... */
globalThis.__WOWF_FIXTURE_REQUESTS = requests;
