/* =============================================================================
   PUBLIC ENDPOINT REGISTER — WoWForever
   -----------------------------------------------------------------------------
   The project rule this file implements (from the brief): a data source may be
   used only if it is FREE, PUBLICLY AVAILABLE, and requires NO SIGN-UP — and it
   must not sit behind a free tier whose limits or terms hold the project to
   ransom. A key that anyone can obtain without registering is acceptable; an
   account, an OAuth client, a paid tier or a revocable commercial licence is not.

   Every entry below was fetched on the date in `verified` by the person who
   wrote the entry, and `observed` records what actually came back — status,
   shape and the values seen. An entry that could not be verified is NOT
   described as working: it sits in this file with status "pending" or
   "rejected" and the reason is printed on the page.

   status:
     verified  — fetched successfully with no credentials; safe to rely on
     pending   — not yet fetched, or fetched and unresolved; must not be used
     rejected  — fetched, understood, and deliberately NOT used

   A rejected entry is not debris. It is the record of a decision, so the next
   session does not re-litigate it and a reader can check the reasoning.

   `use` and `limit` are required for every verified entry: the first is what
   this project may do with the endpoint, the second is what it must never do
   with it. A source with no stated limit is an invitation to overreach.
   ========================================================================== */

window.WOWF_API_RULE = {
  title: 'Eligibility rule for any data source',
  tests: [
    {
      key: 'noKey',
      label: 'No secret required',
      test: 'The endpoint answers a plain request. If a credential is needed at all, it must be one any reader can generate without an account.'
    },
    {
      key: 'noSignup',
      label: 'No account, no registration',
      test: 'No Battle.net account, no developer portal client, no OAuth application, no two-factor enrolment, no acceptance of a developer agreement before the first byte comes back.'
    },
    {
      key: 'noTier',
      label: 'No free-tier gate',
      test: 'Unlimited or generously bounded public use that does not depend on a paid plan, a commercial licence, a partner agreement, or a permission the provider can withdraw to make the site stop working.'
    }
  ],
  fallback:
    'Anything that fails a test is not used. Where a source fails, the site records the gap and keeps using the public HTML page a human can open in a browser — that is the whole point of the source registry, and it is why no page on this site depends on a credential.',
  protocol:
    'Every verified endpoint carries the date it was fetched and a plain description of the response. Re-verification happens on the same cadence as the weekly source watch. A change in status is a claim change and is logged.'
};

window.WOWF_APIS = [
  /* ---------- VERIFIED: first-party Blizzard, no credentials ---------- */
  {
    id: 'bnet-forum-us',
    name: 'World of Warcraft forum (US) — live topic feed',
    publisher: 'Blizzard Entertainment — us.forums.blizzard.com',
    url: 'https://us.forums.blizzard.com/en/wow/latest.json',
    tier: 'official',
    firstParty: true,
    status: 'verified',
    noKey: true,
    noSignup: true,
    noTier: true,
    format: 'JSON topic list (Blizzard\'s forums run on Discourse)',
    verified: '2026-09-19',
    observed:
      'HTTP 200 with no credentials of any kind. The payload contained a users[] array of posters and a topic list carrying id, title, slug, created_at, last_posted_at, posts_count and excerpt for each topic. Topic dates seen on 19 September 2026 were current to that hour (the newest entries were posted the same evening), so the feed is live rather than cached by the day.',
    fields: ['topic.id', 'topic.title', 'topic.slug', 'topic.created_at', 'topic.last_posted_at', 'topic.posts_count', 'topic.excerpt'],
    use:
      'Spotting a Blizzard post worth reading, and timestamping it. A topic id resolves to a public page at /en/wow/t/<slug>/<id>, which is what the site links to — never the JSON.',
    limit:
      'A forum post is a Blizzard statement only when it is posted by a Blizzard employee in an official capacity. Player posts are not evidence, and this endpoint cannot tell the difference by itself: the author is checked against the blue-tracker listing before anything is ledgered.'
  },
  {
    id: 'bnet-forum-forever-us',
    name: 'World of Warcraft forum (US) — WoW: Forever category feed',
    publisher: 'Blizzard Entertainment — us.forums.blizzard.com',
    url: 'https://us.forums.blizzard.com/en/wow/c/wow-forever/l/latest.json',
    tier: 'official',
    firstParty: true,
    status: 'verified',
    noKey: true,
    noSignup: true,
    noTier: true,
    format: 'JSON topic list, scoped to one forum category',
    verified: '2026-09-19',
    observed:
      'HTTP 200 with no credentials. The request resolves through /c/wow-forever/346/l/latest.json, so the US category id is 346 and its slug is wow-forever. Topics seen included recruitment, mob-tagging feedback and beta discussion, all carrying the same fields as the whole-forum feed.',
    fields: ['category id 346 (slug wow-forever)', 'topic.id', 'topic.title', 'topic.created_at', 'topic.last_posted_at', 'topic.posts_count'],
    use:
      'The narrowest first-party feed for Forever specifically: it is the fastest machine-readable way to notice a Forever blue post or a beta known-issues update without reading the whole forum.',
    limit:
      'Category membership is not authority, and a category feed carries no marker of who is Blizzard staff. Same rule as the whole-forum feed: verify the author through the blue-tracker listing before citing anything.'
  },
  {
    id: 'bnet-forum-forever-eu',
    name: 'World of Warcraft forum (EU) — WoW: Forever category record',
    publisher: 'Blizzard Entertainment — eu.forums.blizzard.com',
    url: 'https://eu.forums.blizzard.com/en/wow/c/wow-forever.json',
    tier: 'official',
    firstParty: true,
    status: 'verified',
    noKey: true,
    noSignup: true,
    noTier: true,
    format: 'JSON category record',
    verified: '2026-09-19',
    observed:
      'HTTP 200 with no credentials, resolving to /c/wow-forever/359.json: the EU category id is 359 and the slug is also wow-forever, so the US and EU categories share a slug and differ by region and id.',
    fields: ['category id 359 (slug wow-forever)', 'topic list for the category'],
    use:
      'Confirming that a regional equivalent of the US Forever forum exists, and giving the source watcher a stable second URL to fingerprint. EU posts are read for items the US forum does not carry (the 18 September known-issues post appeared on both).',
    limit:
      'EU and US posts are separate threads on the same topics; a fact present on one is not evidence of the other. Cite the thread actually read.'
  },
  {
    id: 'bnet-version-classic',
    name: 'Blizzard version service — Classic product line versions',
    publisher: 'Blizzard Entertainment — us.version.battle.net',
    url: 'https://us.version.battle.net/v2/products/wow_classic/versions',
    tier: 'official',
    firstParty: true,
    status: 'verified',
    noKey: true,
    noSignup: true,
    noTier: true,
    format: 'pipe-delimited text table (TACT version manifest), not JSON',
    verified: '2026-09-19',
    observed:
      'HTTP 200 with no credentials. The response is a header line followed by one row per region, and on 19 September 2026 it read 5.5.4.69585 for us, eu, cn, kr and tw, with BuildId 69585 and a shared BuildConfig hash. Nothing in the request asked who was calling.',
    fields: ['Region', 'BuildConfig', 'CDNConfig', 'BuildId', 'VersionsName (e.g. 5.5.4.69585)', 'ProductConfig'],
    use:
      'An authoritative build number straight from Blizzard, which is the strongest available "did a new build ship?" signal for a client whose patch notes are sometimes published late or not at all. Cross-checked on 19 September against the version a distribution site listed for the same client (see claim C197).',
    limit:
      'It reports the build, never the contents: a version bump says a client changed, not what changed. It also carries no date, so a build number is only ever reported alongside the date it was observed. A product code must be read from the service\'s own summary, never guessed: the two guessed Forever codes tried first returned no data, and the real one (wow_classic_beta, below) was found only by reading the summary (C193, C211).'
  },
  {
    id: 'bnet-version-era',
    name: 'Blizzard version service — Classic Era product versions',
    publisher: 'Blizzard Entertainment — us.version.battle.net',
    url: 'https://us.version.battle.net/v2/products/wow_classic_era/versions',
    tier: 'official',
    firstParty: true,
    status: 'verified',
    noKey: true,
    noSignup: true,
    noTier: true,
    format: 'pipe-delimited text table (TACT version manifest), not JSON',
    verified: '2026-09-19',
    observed:
      'HTTP 200 with no credentials, returning 1.15.9.69722 for every region on 19 September 2026 (BuildId 69722). Used here as the control that proves the path shape works, because the same request against two guessed Forever product codes returned no data instead; the summary endpoint later showed those codes carry no versions record.',
    fields: ['Region', 'BuildId', 'VersionsName (1.15.9.69722)'],
    use:
      'A worked control case: it shows what a successful lookup looks like, so "no matched data" on a guessed Forever product code is a real negative rather than a broken request.',
    limit:
      'Same as the Classic path: the build number is not a changelist, and this product is not Forever. Never substitute another client\'s build for a Forever build.'
  },
  {
    id: 'bnet-version-summary',
    name: 'Blizzard version service — product summary (every product code)',
    publisher: 'Blizzard Entertainment — us.version.battle.net',
    url: 'https://us.version.battle.net/v2/summary',
    tier: 'official',
    firstParty: true,
    status: 'verified',
    noKey: true,
    noSignup: true,
    noTier: true,
    format: 'pipe-delimited text table (Product | Seqn | Flags), not JSON',
    verified: '2026-09-19',
    observed:
      'HTTP 200 with no credentials. One row per product code and record type: a row flagged "cdn" is the product\'s CDN record, a row with a blank flag is its versions record, and "bgdl" is a background-download record. On 19 September 2026 the WoW family included wow, wow_beta, wow_anniversary, wow_classic, wow_classic_beta, wow_classic_era, wow_classic_era_ptr, wow_classic_ptr, wow_classic_titan, wowt, wowxptr and wowz with versions records, while wowf, wow_classic_era_beta and wow_cn_beta carried a CDN record only. The blank-flag sequence number for wow_classic_beta (4026306) matched the seqn printed by that product\'s versions endpoint the same minute.',
    fields: ['Product (code)', 'Seqn (sequence number)', 'Flags (cdn, bgdl or blank = versions record)'],
    use:
      'The index that makes the versions endpoint safe to use: it lists which product codes exist and which of them will answer /products/<code>/versions, so a code is read rather than guessed. It is how the Forever beta\'s product code was located on 19 September (C211) after two guesses had failed (C193). tools/watch-feeds.mjs reads it weekly to notice when a WoW product gains or loses a versions record — for example if the "wowf" code ever goes live.',
    limit:
      'It names products, never games: nothing in the file says which code is Forever, which is why the identification is a separately reasoned claim (C212). The whole file changes constantly for products unrelated to WoW, so it is excluded from the text-fingerprint watcher and only the WoW rows are compared. Sequence numbers are not versions and must not be reported as build numbers.'
  },
  {
    id: 'bnet-version-classic-beta',
    name: 'Blizzard version service — Classic beta product versions (wow_classic_beta)',
    publisher: 'Blizzard Entertainment — us.version.battle.net',
    url: 'https://us.version.battle.net/v2/products/wow_classic_beta/versions',
    tier: 'official',
    firstParty: true,
    status: 'verified',
    noKey: true,
    noSignup: true,
    noTier: true,
    format: 'pipe-delimited text table (TACT version manifest), not JSON',
    verified: '2026-09-19',
    observed:
      'HTTP 200 with no credentials, fetched twice on 19 September 2026 with identical results: us, eu, kr and tw all on 1.60.1.69913 (BuildId 69913), one shared BuildConfig and CDNConfig, seqn 4026306. No cn row was present. The response never uses the word Forever.',
    fields: ['Region', 'BuildConfig', 'CDNConfig', 'KeyRing', 'BuildId', 'VersionsName (e.g. 1.60.1.69913)', 'ProductConfig'],
    use:
      'The first-party build number for the product this project identifies as the Forever beta (C211 for the record, C212 for the identification). Reported on the Beta log and Data page as "the wow_classic_beta build on <date>", and compared weekly by tools/watch-feeds.mjs, which reports a change as "old → new" so a reader sees exactly what moved. The 1.60.1 line is also the cross-check for add-on listings that declare Forever support (C197).',
    limit:
      'A build number is not a changelist and not a patch note: it proves a client changed, not what changed, and nothing about class tuning may be inferred from it. It is also not Blizzard saying "Forever": the product name is wow_classic_beta, and the site must keep the identification caveat wherever the number is printed. It carries no date, so it is only ever reported with the date it was read.'
  },
  {
    id: 'bnet-forum-beta-us',
    name: 'World of Warcraft forum (US) — WoW: Forever Beta Discussion topic feed',
    publisher: 'Blizzard Entertainment — us.forums.blizzard.com',
    url: 'https://us.forums.blizzard.com/en/wow/c/in-development/wow-forever-beta-discussion/349/l/latest.json',
    tier: 'official',
    firstParty: true,
    status: 'verified',
    noKey: true,
    noSignup: true,
    noTier: true,
    format: 'JSON (Discourse topic list: users[] and topic_list.topics[])',
    verified: '2026-09-19',
    observed:
      'HTTP 200 with no credentials on 19 September 2026. The payload carries a users[] array and topic_list.topics[]; each topic has id, title, slug, created_at, last_posted_at, posts_count, category_id 349 and a posters[] list of user ids. The users[] entry for Blizzard community manager Kaivax carried primary_group_name "community-manager", flair_name "community-manager", admin true and moderator true; ordinary posters carried none of those. The newest topics were beta-feedback threads posted the same evening (UTC).',
    fields: ['users[].id / username / primary_group_name / admin / moderator', 'topic_list.topics[].id / title / slug / created_at / last_posted_at / posts_count / category_id', 'topic_list.topics[].posters[].user_id'],
    use:
      'The beta-specific feed, found through a community manager\'s redirect on 19 September. tools/watch-feeds.mjs records the newest topic id each week and lists any topic whose posters include a user with Blizzard\'s staff marker, with the public thread URL (/en/wow/t/<slug>/<id>) so a human can open it. This is how a Forever beta blue post is noticed without anyone reading the forum by hand every day.',
    limit:
      'A staff marker on a poster is a prompt, not a citation: the thread page must be read and the blue post seen there before anything enters the ledger (C216). Player topics in the feed are community evidence at most and are never recorded as facts about the game. The feed changes hourly, so it is excluded from the text-fingerprint watcher and only its structure is compared.'
  },
  /* ---------- VERIFIED, then REJECTED: read, understood, and not used ---------- */
  {
    id: 'raiderio-api',
    name: 'Raider.IO developer API',
    publisher: 'Raider.IO',
    url: 'https://raider.io/api',
    tier: 'tooling',
    firstParty: false,
    status: 'rejected',
    noKey: true,
    noSignup: true,
    noTier: false,
    format: 'OpenAPI 2.0 description of a JSON API',
    verified: '2026-09-19',
    observed:
      'Readable in full without an account. It states that "Unauthenticated requests are rate limited" with HTTP 429 and Retry-After, and that registering an application unlocks higher rates; that public-facing applications "must include a link back"; and that the API "is provided for community and personal use" and may not be used to "build competing services", with access revocable at any time. Its own scope line describes "character and guild rankings for Raiding and Mythic+ content".',
    fields: [],
    use:
      'None. Recorded so the decision is visible and does not have to be re-argued.',
    limit:
      'Rejected twice over. It fails the no-tier test in substance: the usable rate is a permission the provider can withdraw, and the acceptable-use terms reach further than a link back. It also has no Forever content — the data is sourced from Blizzard\'s modern API for raiding and Mythic+, and Forever has neither Mythic+ nor a public character API. This is exactly the class of source the brief excludes, so it is documented rather than used.'
  },
  {
    id: 'bnet-game-data',
    name: 'Blizzard Battle.net developer APIs (Game Data / Community)',
    publisher: 'Blizzard Entertainment — community.developer.battle.net',
    url: 'https://community.developer.battle.net/documentation/guides/getting-started',
    tier: 'official',
    firstParty: true,
    status: 'rejected',
    noKey: false,
    noSignup: false,
    noTier: true,
    format: 'Documentation page',
    verified: '2026-09-19',
    observed:
      'Read without an account (the documentation itself is public). It states that before any API use a caller must "Login or create a new Battle.net account", attach an authenticator because "Two-factor authentication is required for any API usage", accept the Blizzard Developer API Terms of Use, and create a client with a secret to obtain tokens through the OAuth client-credentials flow.',
    fields: [],
    use:
      'None for data. The page is cited as the evidence for why Blizzard\'s own first-party APIs are out of scope under this project\'s rule.',
    limit:
      'Excluded by the no-signup test, and the exclusion is Blizzard\'s own documented requirement rather than a preference of ours. It is worth stating plainly what that costs: no automated auction-house feed, no character data and no item feed can be built under this rule, which is why every market number on this site will have to come from a dated human observation with a permalink.'
  },
  /* ---------- PENDING: not resolvable this session, and not asserted ---------- */
  {
    id: 'wcl-api',
    name: 'Warcraft Logs API (v2)',
    publisher: 'Warcraft Logs',
    url: '',
    tier: 'community',
    firstParty: false,
    status: 'pending',
    noKey: null,
    noSignup: null,
    noTier: null,
    format: 'unknown — documentation page could not be read',
    verified: '',
    observed:
      'The documentation URL served an anti-bot challenge to this project\'s retrieval tool on 19 September 2026, so nothing about its credential requirements is stated here. The page is deliberately not linked, because this site may only link to a URL it has actually read.',
    fields: [],
    use:
      'None.',
    limit:
      'Nothing is claimed about this API — not that a key is needed, not that one is not. It stays pending until the documentation can be read and the requirement quoted. If it turns out to require an account, it is rejected by the same test as the two entries above; if it does not, it is added to the register with its own date and observed payload.'
  }
];
