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
| `official` | Blizzard first-party: news article, product page, blue post |
| `press` | A named outlet quoting a named Blizzard developer |
| `datamine` | Data extracted from the beta client by a reputable guide site — always marked "may change" |
| `guide` | A reputable guide site's own analysis, attributed and never stated as Blizzard's position |
| `ours` | Our own reasoning from verified facts, explicitly labelled as analysis |
| `unknown` | Deliberately recorded as *not announced*, so the gap stays visible |
| `community` | Forum posts, unattributed sites, boosting/RMT services — used only as flagged negative examples |

The rules are enforced by three offline tools (see **Verifying the repository** below), and the site cannot link to a
URL that is not registered as a source. Current totals — counted from the data files, never typed by hand — are printed
on the home page.

Known, deliberate **omissions** (with reasons and sources on the site): no class tier list, no Best-in-Slot item lists,
no gold-per-hour figures. The beta is capped at level 20 (30 later); items are hidden until they drop; Honor thresholds
and PvP vendor inventories are unpublished. Guessing at those numbers would break the one rule this project exists to
keep.

## Site map

| Page | Contents |
| --- | --- |
| `index.html` | Overview, key dates, live ledger counts, the honest-gaps table |
| `roadmap.html` | Official dates vs. reported estimates, beta waves, data-availability schedule |
| `pvp.html` | Confirmed PvP systems, Honor/ranks, battlegrounds, unpublished numbers, preparation |
| `classes.html` | Racial changes, published class changes, why no tier list is verifiable yet |
| `class-pvp.html` | Nine per-class PvP profiles built from published mechanics only, plus a verified reading list per class |
| `gear.html` | BiS status, gearing framework, per-class slot tracker (CSV export), verification procedure |
| `gold.html` | Economy rules, dated market catalysts, professions, tooling (TSM) status, launch watchlist |
| `sources.html` | Full source registry and claims ledger (filterable) |
| `method.html` | Verification method, what we refuse to publish, irregularity log I-1…I-10 |
| `work-plan.html` | Delivered work, this session's line-by-line record, blocked items, limitations, decisions, next steps |

## Repository layout

```
index.html … work-plan.html   static pages, no build step
assets/css/style.css          one stylesheet, dark theme, print styles
assets/js/site.js             progressive enhancement only (nav state, table filters, copy buttons)
data/sources.js               source registry  (window.WOWF_SOURCES, optional `also: [urls]` per source)
data/claims.js                claims ledger    (window.WOWF_CLAIMS, IDs C001–C148)
data/market-log.csv           market observation log — schema documented inside, empty until launch
tools/check-ledger.mjs        ledger integrity + staleness
tools/check-citations.mjs     offline audit: registered sources, links, anchors, claim IDs, tag balance
tools/check-market-log.mjs    market-log schema, watchlist cross-check, pre-launch refusal
tools/check-quotes.mjs        flags any quotation of 3+ words with no source link or claim id nearby
tools/quote-allowlist.txt     interface labels that are exempt from the quotation rule
tools/check-sources.mjs       source-URL watcher (network); writes tools/source-state.json
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
node tools/check-citations.mjs         # fails if a page cites an unregistered URL, a dead anchor or an unknown claim id
node tools/check-market-log.mjs        # fails on schema errors or any pre-launch price row
node tools/check-quotes.mjs --strict   # fails if any quotation has no source link or claim id nearby
node tools/check-sources.mjs --dry-run # network: fingerprint every registered source URL
```

CI (`.github/workflows/verify.yml`) runs the four offline checkers with `--strict` on every push and pull request.
The checkers verify structure — that a quotation is anchored, not that its wording matches the live page. Wording is
checked by hand, and the corrections found that way are logged as I-11 and I-12 on the Method page.

## Running the site locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

The site also works when opened as local files, except that the filterable tables and the home-page ledger counts need
a real HTTP origin in some browsers.

## Flags and corrections

Sections marked **our reasoning** contain argument, not sourced fact. Everything else carries a source link.
Corrections are welcome as issues: give the claim ID (for example `C127`), the corrected statement, and a link to a
primary source. Superseded numbers are kept in the ledger so changes are visible — see the irregularity log on the
Method page for worked examples.

## Legal

Independent, non-commercial fan project. World of Warcraft and Blizzard Entertainment are trademarks of Blizzard
Entertainment, Inc. This site is not affiliated with, endorsed by, or sponsored by Blizzard. No content from
Wowhead, Icy Veins or any other site is rehosted here; sources are summarised, credited and linked.
