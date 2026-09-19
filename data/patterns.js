/* =============================================================================
   SITE PATTERN REGISTER — WoWForever
   -----------------------------------------------------------------------------
   The brief asks this project to "reverse engineer portions of well established
   WoW websites". This file is the honest version of that instruction.

   What is recorded here is *structure*: the URL shapes, section namespaces and
   listing conventions that each site actually uses, observed on the date shown.
   That is information the public can see, it is the part that is useful to a
   reader who is trying to find their way around a site, and it is the part this
   project can state without copying anybody's work.

   What is deliberately NOT recorded here:
     - article bodies, guide text, tables or images (never rehosted, never scraped)
     - "hidden" internal endpoints, undocumented JSON, or anything behind a login
     - rankings, tier lists or statistics as if they were our own finding
     - anything we could not open and read ourselves

   `verified` is the date the pattern was last confirmed against the live site.
   `observed` says what was actually seen. `limit` says what the pattern must not
   be used for. A pattern with no limit is not a pattern, it is a temptation:
   knowing a URL shape does not make its contents ours to reproduce.
   ========================================================================== */

window.WOWF_PATTERN_RULE = {
  allowed:
    'Read a page, note its URL shape, section namespaces and how it separates news from guides from datamined material, credit it by name and link, and use the structure to organise and to navigate.',
  forbidden:
    'Never scrape, mirror, rehost, translate, republish or paraphrase-at-length another site\'s content; never present their analysis as ours; never treat a guide site as a primary source when a Blizzard page exists.',
  why:
    'Because a guide site is somebody else\'s business. The public structure is a map; the content is their property. This project is a map of verified facts that always links out to the page a reader can check.'
};

window.WOWF_PATTERNS = [
  {
    id: 'wh-hub-forever',
    site: 'Wowhead',
    kind: 'product namespace hub',
    pattern: '/forever and /forever/...',
    hub: 'https://www.wowhead.com/forever',
    examples: [],
    verified: '2026-09-19',
    observed:
      'Fetched directly. The page is titled "Forever News and Guides" and is a single front door for everything Wowhead publishes about Forever: a Blue Tracker column with US/EU toggles, a news column, and links out to guide indexes. Wowhead keeps a separate Forever namespace rather than filing Forever under its Classic namespace.',
    reading:
      'The namespace boundary is the clearest editorial statement any guide site makes: /forever/ means "this page is about Forever", /classic/ means the two-decade-old client. A reader can trust that split far more than a page title, because it survives redesigns.',
    use:
      'Every Wowhead link on this site is taken from the /forever/ namespace and checked against its registered source URL, so a Classic-era page can never be cited as a Forever fact by accident.',
    limit:
      'The namespace says what a page is about, not whether it is right. Wowhead analysis is still guide evidence here, attributed and dated, and it is never quoted as Blizzard\'s position.'
  },
  {
    id: 'wh-news-item',
    site: 'Wowhead',
    kind: 'dated news item',
    pattern: '/forever/news/<slug>-<six-digit-id>',
    hub: 'https://www.wowhead.com/forever',
    examples: [
      'https://www.wowhead.com/forever/news/changes-and-additions-to-professions-in-world-of-warcraft-forever-382924'
    ],
    verified: '2026-09-19',
    observed:
      'Fetched directly (id 382924). The trailing number is Wowhead\'s own article id, not a game id and not a Blizzard id — the same story titled on Blizzard\'s site keeps Blizzard\'s number in the Blizzard URL. Ids observed on the hub in the same listing ran from 382922 to 382994, i.e. they are issued in sequence and densely during a beta week.',
    reading:
      'The id gives every article a stable address even if the slug is edited, and the slug carries the editorial angle ("changes and additions", "no raid attunements"). Reading title + timestamp + id from the hub is enough to date a story without opening it.',
    use:
      'News URLs are registered with their id so the weekly watcher fingerprints the exact article rather than a moving index page.',
    limit:
      'A Wowhead news post is a report. Where it summarises a Blizzard article, this site cites the Blizzard article; where it reports an interview, the interview is the source and the claim is marked press, never official.'
  },
  {
    id: 'wh-news-filter',
    site: 'Wowhead',
    kind: 'filtered news listing',
    pattern: '/forever/news?type=<n>',
    hub: 'https://www.wowhead.com/forever/news',
    examples: [],
    verified: '2026-09-19',
    observed:
      'Seen as a link on a fetched article, which lists itself under "[Forever](https://www.wowhead.com/forever/news?type=24)". So the type parameter is a news category filter, and this project does not know what any individual number means.',
    reading:
      'A filtered view is useful for a human browsing but a poor citation target: two readers can land on different lists behind the same URL as new articles arrive.',
    use:
      'Recorded for navigation only. No fact on this site cites a filtered list.',
    limit:
      'No claim may ever cite a listing, filtered or not. Claims cite a specific article with an id, because a list is not a source.'
  },
  {
    id: 'wh-guide',
    site: 'Wowhead',
    kind: 'guide page',
    pattern: '/forever/guide/<slug>',
    hub: 'https://www.wowhead.com/forever/guides',
    examples: [
      'https://www.wowhead.com/forever/guide/camping-overview-unlock-rewards',
      'https://www.wowhead.com/forever/guide/legacy-system-overview-rewards'
    ],
    verified: '2026-09-19',
    observed:
      'Both examples were seen as in-body links on a fetched news article, and further /guide/ URLs are already registered by earlier sessions (roadmap, dungeons, new race and class combinations, beta content unlock, pre-order packs). Guides and news are different namespaces on purpose: /guide/ for evergreen pages, /news/ for dated posts.',
    reading:
      'The split tells a reader which page is expected to be revised in place (guides carry a "last updated" expectation) and which is a snapshot of a day (news). This project mirrors that split because it has the same problem.',
    use:
      'Guide URLs are registered with the date they were read, and the guide\'s own "last updated" stamp is carried into the claim note so a later revision is visible.',
    limit:
      'Wowhead guides are dated, revised in place, and occasionally overtaken by a build. They are recorded as guide evidence with the reading date, never as a fixed fact.'
  },
  {
    id: 'wh-class-guides-index',
    site: 'Wowhead',
    kind: 'class guide index',
    pattern: '/forever/guides/classes and /forever/guides',
    hub: 'https://www.wowhead.com/forever/guides',
    examples: [],
    verified: '2026-09-19',
    observed:
      'Both URLs are already registered sources from earlier sessions (the guide index and its classes section). Re-checked here as part of the pattern sweep; the index is the page this project counted its 17 Forever guides from.',
    reading:
      'An index is the cheapest way to answer "how much does this site actually cover?" without reading every page — and that count is itself a fact worth dating.',
    use:
      'Used for the coverage audits on the Method page and for the standing question of whether a per-class PvP guide exists anywhere yet.',
    limit:
      'An index entry is not evidence that the guide behind it exists in a usable state; a "coming soon" stub sits in an index exactly like a finished guide.'
  },
  {
    id: 'wh-blue-tracker',
    site: 'Wowhead',
    kind: 'Blizzard post tracker',
    pattern: '/blue-tracker/news/{us|eu}/<blizzard-article-id> and /blue-tracker/topic/{us|eu}/<forum-topic-id>',
    hub: 'https://www.wowhead.com/forever/blue-tracker',
    examples: [
      'https://www.wowhead.com/blue-tracker/news/us/24301508',
      'https://www.wowhead.com/blue-tracker/topic/us/2354340'
    ],
    verified: '2026-09-19',
    observed:
      'Blue Tracker entries carry two different shapes side by side, and the ids in them come from two different systems. A news row such as /blue-tracker/news/us/24301508 reuses the Blizzard article number (that URL is the pre-purchase article on news.blizzard.com), while a topic row such as /blue-tracker/topic/us/2354340 uses the forum topic id and corresponds to a forum thread. Both were seen in the same fetched listings.',
    reading:
      'That one column mixes Blizzard\'s news site and Blizzard\'s forum is itself information: it is how a tracker site keeps a single chronological view of two publishing systems with separate ids. It also warns a reader that a "blue post" can be a news article or a forum reply, which carry different weight.',
    use:
      'The tracker is used as a discovery list and as a cross-check that a forum topic is really a Blizzard employee post; the underlying Blizzard URL — article or forum thread — is what the claim links to.',
    limit:
      'A tracker row is somebody else\'s index of Blizzard pages. It is never the citation: this project links the Blizzard page itself, because a tracker can drop or retitle a row without notice.'
  },
  {
    id: 'wh-author-page',
    site: 'Wowhead',
    kind: 'author attribution page',
    pattern: '/forever/author/<name>',
    hub: 'https://www.wowhead.com/forever',
    examples: [],
    verified: '2026-09-19',
    observed:
      'Every fetched Wowhead Forever article carries an author byline linking to a per-author page (for example the link to /forever/author/Nodge from the professions article). The author page states that writer\'s PvP and PvE background.',
    reading:
      'Attribution is the difference between "a site says" and "a named person, with a stated background, says". The background is checkable and often explains the angle of the piece.',
    use:
      'Author names are carried into the ledger note wherever a guide-site claim is recorded, so a reader can weigh the claim against who made it.',
    limit:
      'An author\'s credentials do not upgrade an opinion into evidence. A named guide writer\'s ranking is still guide evidence; only Blizzard can make a fact official.'
  },
  {
    id: 'wh-item-page',
    site: 'Wowhead',
    kind: 'item page inside the Forever namespace',
    pattern: '/forever/item=<id>/<slug>',
    hub: 'https://www.wowhead.com/forever',
    examples: [],
    verified: '2026-09-18 (registered by a prior session; not re-fetched this session)',
    observed:
      'Already registered by an earlier session for a Forever reward item ("Tarnished Undermine Real"). The id sits in the path as item=<id>, a Classic-era address style rather than the modern /item/<id>/<slug> form.',
    reading:
      'This is the address a Best-in-Slot link will take the day item data is discoverable. Right now most of those pages cannot be checked at all, because Blizzard hides an item\'s stats until it drops (C062) — the namespace exists, the content behind it is deliberately empty.',
    use:
      'Registered so that the first verifiable BiS item can be cited immediately, in the namespace a reader can actually open.',
    limit:
      'An item page is tooling-adjacent evidence about a database, not a loot table. A drop source recorded on this project\'s BiS tracker must come from a client observation or a Blizzard statement, not from an item page\'s "dropped by" line, until the drop has been seen to happen.'
  },
  {
    id: 'iv-hub-forever',
    site: 'Icy Veins',
    kind: 'product namespace hub',
    pattern: '/wow-forever/',
    hub: 'https://www.icy-veins.com/wow-forever/',
    examples: [
      'https://www.icy-veins.com/wow-forever/'
    ],
    verified: '2026-09-19',
    observed:
      'Fetched directly. The hub is titled "World of Warcraft Forever Guides and News", carries a launch countdown, and lists its newest news items with timestamps and author names. Its sub-pages sit directly under the namespace with readable slugs rather than under /news/ or /guide/.',
    reading:
      'A countdown on a hub is a small, checkable claim in itself: it is the site\'s own statement of the launch instant, and its zone choice (UTC) tells a reader what to expect from the rest of the site\'s times.',
    use:
      'The hub is the coverage-audit page for Icy Veins: its listing is what the site counts when it asks whether a PvP ranking exists yet.',
    limit:
      'Guides under a namespace are revised in place and a hub listing changes hourly. Every Icy Veins fact on this site is cited to the specific page, with the date it was read.'
  },
  {
    id: 'iv-guide',
    site: 'Icy Veins',
    kind: 'guide page',
    pattern: '/wow-forever/<slug>',
    hub: 'https://www.icy-veins.com/wow-forever/',
    examples: [
      'https://www.icy-veins.com/wow-forever/choosing-your-main',
      'https://www.icy-veins.com/wow-forever/legacy-system',
      'https://www.icy-veins.com/wow-forever/tier-list-hub',
      'https://www.icy-veins.com/wow-forever/wow-forever-subscription'
    ],
    verified: '2026-09-19',
    observed:
      'All five were read directly. Slugs are plain and descriptive (choosing-your-main, legacy-system, tier-list-hub), a tier-list directory lives at its own slug, and no numeric ids appear anywhere in the path.',
    reading:
      'Because slugs are human-readable and stable, an Icy Veins URL is guessable — which is a trap as much as a convenience, because a guessed slug that 404s looks exactly like a page that was moved (see the unverified list below for a documented instance).',
    use:
      'Guide URLs are registered with their reading date; the tier-list directory is the page this project checks to see whether a Forever PvP ranking exists yet (it does not — C198).',
    limit:
      'Where Icy Veins states a ranking, a preference or a "best" that has no measurement behind it, it is recorded as that writer\'s opinion with the date, never as a result.'
  },
  {
    id: 'iv-news',
    site: 'Icy Veins',
    kind: 'dated news item',
    pattern: '/wow-forever/news/<slug>/',
    hub: 'https://www.icy-veins.com/wow-forever/',
    examples: [
      'https://www.icy-veins.com/wow-forever/news/healing-potions-now-crafted-by-first-aid-in-wow-forever/',
      'https://www.icy-veins.com/wow-forever/news/wow-forever-crafted-tier-sets-datamined-recipes-costs-and-set-bonuses/'
    ],
    verified: '2026-09-19',
    observed:
      'The shape is confirmed by two news URLs already registered by earlier sessions, both ending in a trailing slash. A slug guessed by this session without matching a real headline — /wow-forever/news/wow-forever-crafted-tier-sets-datamined/ — returned a 404 page while the registered, real slug exists, which is the useful half of this observation.',
    reading:
      'Trailing slash, no id, slug equals the headline: Icy Veins news has no stable numeric address, so the slug IS the address. Any shortening or paraphrase of a headline breaks a link, and inventing one produces a 404 that looks like a deleted article.',
    use:
      'News URLs are copied from the site and registered verbatim, never transcribed from a summary.',
    limit:
      'The 404 is on record here as a process finding, not as a claim about Icy Veins. This project does not report a URL it has not opened, and it does not "fix" a slug that fails — it takes the real one from the hub.'
  },
  {
    id: 'sc-articles',
    site: 'Skill Capped',
    kind: 'article namespace',
    pattern: '/wowarticles/<category>/<slug>/',
    hub: 'https://www.skill-capped.com/',
    examples: [
      'https://www.skill-capped.com/wowarticles/general/pvp-addons-ui-guide/',
      'https://www.skill-capped.com/wowarticles/tier-lists/solo-shuffle/'
    ],
    verified: '2026-09-19',
    observed:
      'The second URL was read directly this session and is a live retail PvP tier list headed "Best Classes & Specs for Midnight Season 2", last updated 1 September 2026, ranking specs for Solo Shuffle. The first URL is the registered coverage-check page from an earlier session and uses the same shape. So Skill Capped files its PvP material under /wowarticles/ with a category segment such as general or tier-lists.',
    reading:
      'A tier list filed by retail season and ranked by a retail bracket (Solo Shuffle) is not a Forever document, and no Forever page exists yet in this namespace. That is a fact about the site, and it is the single most useful thing this project can say about Skill Capped today: the exact site named in the brief as a PvP source has nothing for Forever, because Forever has no rated PvP to rank.',
    use:
      'The namespace is watched for the day a Forever article appears under it; the coverage gap is recorded on the Method page and dated.',
    limit:
      'Skill Capped\'s retail rankings carry no weight here at all — a Midnight Season 2 Solo Shuffle ranking is not evidence about a level-60 battleground game with no rated brackets. Their guides remain a named, linked reference for format and structure only.'
  },
  {
    id: 'bnet-news-article',
    site: 'Blizzard',
    kind: 'first-party news article',
    pattern: 'news.blizzard.com/en-us/article/<id>/<slug>',
    hub: 'https://news.blizzard.com/en-us/world-of-warcraft',
    examples: [
      'https://news.blizzard.com/en-us/article/24302498/pre-purchase-the-world-of-warcraft-forever-collectors-edition'
    ],
    verified: '2026-09-19',
    observed:
      'Read directly (the Collector\'s Edition article). The article id is also the anchor other sites reuse: Wowhead\'s blue tracker links the same story as /blue-tracker/news/us/24302498, and the game-site mirror is worldofwarcraft.blizzard.com/en-us/news/24302498 — one Blizzard article, three addressable URLs.',
    reading:
      'The id is the identity and the slug is decoration, which is why the same article can be cited from either sub-domain. That is also the trap the previous session logged (I-17): two Blizzard pages can restate the same fact with slightly different wording and even different timezone labels.',
    use:
      'Blizzard articles are the preferred citation for every launch, date, price and system fact, registered with the id form so the watcher fingerprints the exact page.',
    limit:
      'Blizzard repeats itself with small edits. When two Blizzard pages disagree, the disagreement is recorded rather than smoothed over — see the beta-window zone label in the irregularity log (I-21).'
  },
  {
    id: 'bnet-wow-news-mirror',
    site: 'Blizzard',
    kind: 'game-site news mirror',
    pattern: 'worldofwarcraft.blizzard.com/en-us/news/<article-id>',
    hub: 'https://worldofwarcraft.blizzard.com/en-us/forever',
    examples: [
      'https://worldofwarcraft.blizzard.com/en-us/news/24302498'
    ],
    verified: '2026-09-19',
    observed:
      'Read directly. The same Collector\'s Edition article is served on the game sub-domain under /news/<id> with no slug, alongside the product page at /en-us/forever. The body is a shortened version of the news.blizzard.com original — the long bullet list of what is inside the box appears on the news site and is abbreviated on the game site.',
    reading:
      'Same publisher, two addresses, different lengths. A citation therefore has to name which one was read; citing "Blizzard" while quoting a line that only exists on one of the two is exactly the kind of drift this project exists to prevent.',
    use:
      'Used as a second, checkable address for a Blizzard statement, and as the register entry for the product page the whole project cites for launch facts.',
    limit:
      'The shorter mirror must never be quoted as though it were the fuller article, and vice versa. The claim note records which address carries the words being quoted.'
  },
  {
    id: 'bnet-forum-topic',
    site: 'Blizzard',
    kind: 'forum thread and its machine-readable twin',
    pattern: '/en/wow/t/<slug>/<topic-id> (page) and /en/wow/.../<topic-id>.json (same thread, structured)',
    hub: 'https://us.forums.blizzard.com/en/wow/c/wow-forever/l/latest.json',
    examples: [
      'https://us.forums.blizzard.com/en/wow/t/about-the-wow-forever-category/2347159'
    ],
    verified: '2026-09-19',
    observed:
      'The public page form is the one the forum itself advertises: the categories payload returns topic_url "/en/wow/t/about-the-wow-forever-category/2347159" for the Forever category\'s own pinned thread. The structured form is the one this project fetches, and it exposes the same topic id (2354340 for the current class-tuning thread), so page and payload can be matched by id.',
    reading:
      'Blizzard\'s forums run on Discourse, whose public API shapes are documented by the platform rather than by Blizzard. That means the request format is documented, the data is first-party, and no credential is involved — which is why these are the only machine-readable game sources this project can use at all under the no-sign-up rule.',
    use:
      'Topic ids read from the payload are turned into public page URLs for citation; the payload is never cited, because a reader cannot open it with the surrounding context a forum page gives.',
    limit:
      'A topic id proves a thread exists, not who wrote in it. Only a Blizzard employee posting officially makes a thread a blue post, and that is verified on the page before anything is recorded.'
  },
  {
    id: 'wago-versions',
    site: 'Wago Addons',
    kind: 'add-on release listing',
    pattern: 'addons.wago.io/addons/<addon>/versions?stability=stable',
    hub: 'https://addons.wago.io/',
    examples: [
      'https://addons.wago.io/addons/tradeskillmaster/versions?stability=stable'
    ],
    verified: '2026-09-19',
    observed:
      'Fetched directly. The listing is a dense table of release name, size, date, downloads and — the column that matters here — the game versions a release declares, rendered as separate "Supported Retail patch12.1.0", "Supported Mists of Pandaria patch5.5.4", "Supported Burning Crusade patch2.5.6" and "Supported Classic Era patch1.15.9" chips. The newest TSM release on 19 September 2026 was v4.14.77 from 13 September and carried no Forever chip.',
    reading:
      'The declared-version chips are the difference between "this add-on works on Forever" and "this add-on says it works on Forever" — and the version numbers on the chips can be cross-checked against Blizzard\'s own version service, which this project did on 19 September (C197).',
    use:
      'The listing is tooling evidence: it is first-party for the software\'s own claims, and the dates and version chips are recorded verbatim for each re-check.',
    limit:
      'A declaration is not a working install. The listing proves what the project published, never what the client does, and the gold-making workflow it will one day support stays unpublished until somebody verifies a live install after launch.'
  }
];

window.WOWF_PATTERNS_UNVERIFIED = [
  {
    id: 'wh-classic-class-guides',
    question: 'Does Wowhead publish per-class Forever guides in a predictable namespace?',
    status: 'not verified',
    note:
      'Wowhead\'s Classic estate clearly has class guide namespaces, but no Forever class-guide URL was observed during this sweep, and the earlier coverage audit counted only three class pages in the Forever guide index, all PvE tank pages. So this project records the gap rather than assuming the namespace carries over.'
  },
  {
    id: 'iv-pvp-page',
    question: 'Is there an Icy Veins Forever PvP guide to link for battleground play?',
    status: 'not found',
    note:
      'The tier-list directory lists two PvP tier lists, both marked coming soon, and no battleground guide was observed under the namespace on 19 September 2026. Nothing is linked because nothing was found.'
  },
  {
    id: 'level-60-item-pages',
    question: 'Do level-60 Forever item pages resolve to real stats yet?',
    status: 'blocked by Blizzard',
    note:
      'Items are hidden until they drop (C062), so item pages cannot be used to build Best-in-Slot lists even though the address shape is known. This is a Blizzard design decision, not a gap on any guide site.'
  },
  {
    id: 'market-endpoints',
    question: 'Is there any public auction-house or price endpoint for Forever?',
    status: 'does not exist yet',
    note:
      'No auction house exists before launch on 4 November 2026, and Blizzard\'s own game APIs are excluded by the no-sign-up rule. Every market number on this site must therefore begin as a dated human observation with a permalink.'
  }
];
