# WoW Forever Hub

A small, source-verified information site for **World of Warcraft: Forever** (Blizzard's launch on
**4 November 2026**, raids unlocking **9 December 2026**), with a deliberate focus on

* **PvP content** — battlegrounds, the Honor/rank structure, and what can honestly be said about each class today;
* **gold-making and market dynamics** — the verified economy rules and dated content catalysts that move prices;
* **gear and Best-in-Slot status** — why no verified BiS list can exist yet, plus the framework and tracker that
  will hold the real data the moment it exists.

**Live site:** https://buffedlizard55-lab.github.io/WoWForever/ (GitHub Pages, built from `main`)

## What makes this repository different

Every factual statement on the site is recorded in a claims ledger with an evidence class, a source, and the date it
was last checked. Nothing is published without one of these:

| Evidence class | Meaning |
| --- | --- |
| `official` | A first-party Blizzard URL: news article, product page, or official forum blue post |
| `press` | Verified secondary reporting or a named outlet quoting a named Blizzard developer; never relabelled as official |
| `datamine` | Data extracted from the beta client by a reputable guide site — always marked "may change" |
| `guide` | A reputable guide site's own analysis, attributed and never stated as Blizzard's position |
| `tooling` | A software project's own release metadata (an add-on's version list). First-party for the *software*, and no evidence at all about the game |
| `ours` | Our own reasoning from verified facts, explicitly labelled as analysis |
| `unknown` | Deliberately recorded as *not announced*, so the gap stays visible |
| `community` | Forum posts, unattributed sites, boosting/RMT services — used only as flagged negative examples |

The rules are enforced by five offline checks plus a self-test of the watcher (see **Verifying the repository**
below), and the site cannot link to a URL that is not registered as a source. Any number a page prints about this project
is machine-checked against the data files. Current totals — counted from the data files, never typed by hand — are printed
on the home page.

Known, deliberate **omissions** (with reasons and sources on the site): no class tier list, no Best-in-Slot item lists,
no gold-per-hour figures. The beta is capped at level 20 (30 later); items are hidden until they drop; Honor thresholds
and PvP vendor inventories are unpublished. Guessing at those numbers would break the one rule this project exists to
keep.

Two pages exist specifically to keep that promise honest as the game changes: **`addons.html`** tracks, with dates and
registered listings, which add-ons declare a Forever build, and **`beta.html`** tracks what has (and has not) been
observed in the beta, with the rule for upgrading a claim from *reported* to *observed*.

## Site map

| Page | Contents |
| --- | --- |
| `index.html` | Overview, key dates, live ledger counts, the honest-gaps table |
| `roadmap.html` | Official dates vs. reported estimates, beta waves, data-availability schedule |
| `pvp.html` | Confirmed PvP systems, Honor/ranks, battlegrounds, unpublished numbers, preparation |
| `classes.html` | Racial changes, published class changes, why no tier list is verifiable yet |
| `class-pvp.html` | Nine per-class PvP profiles built from published mechanics only, plus a verified reading list per class |
| `gear.html` | BiS status, gearing framework, per-class slot tracker (CSV export), verification procedure |
| `gold.html` | Economy rules, dated market catalysts, professions, verified add-on status, launch watchlist |
| `addons.html` | Add-on and tooling compatibility tracker: dated release listings, Blizzard's addon-API statements, gold/PvP consequences |
| `beta.html` | Beta observation log: dated beta calendar, per-class observation status, the reported → observed rule, false positives to avoid |
| `sources.html` | Full source registry and claims ledger (filterable) |
| `method.html` | Verification method, what we refuse to publish, irregularity log I-1…I-16 |
| `work-plan.html` | Delivered work, this session's line-by-line record, blocked items, limitations, decisions, next steps |

## Repository layout

```
index.html … work-plan.html   static pages, no build step
assets/css/style.css          one stylesheet, dark theme, print styles
assets/js/site.js             progressive enhancement only (nav state, table filters, copy buttons)
data/sources.js               source registry  (window.WOWF_SOURCES, optional `also: [urls]` per source)
data/claims.js                claims ledger    (window.WOWF_CLAIMS; 123 claims today, IDs are not contiguous)
data/market-log.csv           market observation log — schema documented inside, empty until launch
tools/check-ledger.mjs        ledger integrity + staleness
tools/check-citations.mjs     offline audit: registered sources, links, anchors, claim IDs, tag balance
tools/check-market-log.mjs    market-log schema, watchlist cross-check, pre-launch refusal
tools/check-quotes.mjs        flags any quotation of 3+ words with no source link or claim id nearby
tools/quote-allowlist.txt     interface labels that are exempt from the quotation rule
tools/check-a11y.mjs          accessibility and print structure: landmarks, headings, captions, labels, focus, reduced motion, print rules
tools/check-sources.mjs       source-URL watcher (network); writes tools/source-state.json
tools/test-source-watch.mjs   offline fixture test of the watcher: baseline, change, regression, blocked runner
tools/test-fixture-fetch.mjs  the test double that replaces fetch during that test
robots.txt, sitemap.xml       crawler metadata for the published site
.github/workflows/verify.yml  runs the three offline checkers on every push and pull request
.github/workflows/source-watch.yml  weekly URL fingerprinting; opens an issue on change
```

Everything is plain HTML/CSS/JS so it can be served directly by GitHub Pages from the repository root
(`.nojekyll` is present so no Jekyll processing is applied).

## Verifying the repository

No dependencies, no build step:

```bash
node tools/check-ledger.mjs            # integrity; --stale 30 lists ageing claims; --json for CI
node tools/check-citations.mjs         # registered URLs, resolving anchors, canonicals, sitemap, claim ids, tag balance,
                                       #   machine-checked self-reported counts, documented evidence classes
node tools/check-market-log.mjs        # fails on schema errors or any pre-launch price row
node tools/check-quotes.mjs --strict   # fails if any quotation has no source link or claim id nearby
node tools/check-a11y.mjs --strict     # structure and print: landmarks, headings, captions, labels, focus, reduced motion
node tools/test-source-watch.mjs       # offline: proves the watcher's baseline/change/regression behaviour
node tools/check-sources.mjs --dry-run # network: fingerprint every registered source URL
```

CI (`.github/workflows/verify.yml`) runs the five offline checkers with `--strict`, plus the watcher's self-test, on
every push and pull request. `source-watch.yml` runs the network step weekly (and on demand).
The checkers verify structure — that a quotation is anchored, not that its wording matches the live page. Wording is
checked by hand, and the corrections found that way are logged as I-11 to I-16 on the Method page (three of the last
three were failures on this project's own pages, not in someone else's reporting).

## Running the site locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

The site also works when opened as local files, except that the filterable tables and the home-page ledger counts need
a real HTTP origin in some browsers.

## Flags and corrections

Sections marked **our reasoning** contain argument, not sourced fact. The source-watch fingerprint baseline
(`tools/source-state.json`) was established by the first run on 19 September 2026: **86 of the 87 registered URLs** were
fingerprinted, with the Skill Capped PvP UI guide unreachable from that runner and held to the two-strike rule. The baseline
is created and repaired by `source-watch.yml` — the weekly schedule, a manual dispatch with *Baseline only* ticked, or
automatically by the next push to `main` while no baseline exists (a preflight job keeps ordinary pushes from running the
network step). The authoring environment that builds this site has no outbound network and no workflow-dispatch permission,
so it cannot create one itself. Everything else carries a source link.
Corrections are welcome as issues: give the claim ID (for example `C127`), the corrected statement, and a link to a
primary source. Superseded numbers are kept in the ledger so changes are visible — see the irregularity log on the
Method page for worked examples.

## Legal

Independent, non-commercial fan project. World of Warcraft and Blizzard Entertainment are trademarks of Blizzard
Entertainment, Inc. This site is not affiliated with, endorsed by, or sponsored by Blizzard. No content from
Wowhead, Icy Veins or any other site is rehosted here; sources are summarised, credited and linked.
