# WoW Forever Hub

A small, source-verified information site for **World of Warcraft: Forever** (Blizzard's launch on
**4 November 2026**, raids unlocking **9 December 2026**), with a deliberate focus on

* **PvP content** — battlegrounds, the Honor/rank structure, and what can honestly be said about classes today;
* **gold-making and market dynamics** — the economy rules and dated content catalysts that move prices;
* **gear and Best-in-Slot status** — why no verified BiS list can exist yet, plus the framework and tracker that
  will hold the real lists the moment the data exists.

**Live site:** https://buffedlizard55-lab.github.io/WoWForever/

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

Known, deliberate **omissions** (with reasons and sources on the site): no class tier list, no Best-in-Slot item
lists, no gold-per-hour figures. Beta is capped at level 20; items are hidden until they drop; Honor thresholds and
PvP vendor inventories are unpublished. Guessing at those numbers would break the one rule this project exists to
keep.

## Site map

| Page | Contents |
| --- | --- |
| `index.html` | Overview, key dates, the honest-gaps table |
| `roadmap.html` | Official release dates vs. reported estimates, data-availability schedule |
| `pvp.html` | Confirmed PvP systems, Honor/ranks, battlegrounds, unpublished numbers, preparation |
| `classes.html` | Racial changes, published class changes, why no tier list is verifiable yet |
| `gear.html` | BiS status, gearing framework, per-class slot tracker (CSV export), verification procedure |
| `gold.html` | Economy rules, dated market catalysts, professions, tooling (TSM) status, launch watchlist |
| `sources.html` | Full source registry and claims ledger (filterable) |
| `method.html` | Verification method, what we refuse to publish, irregularity log I-1…I-7 |
| `work-plan.html` | Remaining work, blocked deliverables, limitations, decisions requested |

## Repository layout

```
index.html … work-plan.html   static pages, no build step
assets/css/style.css          one stylesheet, dark theme, print styles
assets/js/site.js             progressive enhancement only (nav state, table filters, copy buttons)
data/sources.js               source registry (window.WOWF_SOURCES + WOWF_SOURCE_INDEX)
data/claims.js                claims ledger (window.WOWF_CLAIMS), IDs C001–C110
```

Everything is plain HTML/CSS/JS so it can be served directly by GitHub Pages from the repository root
(`.nojekyll` is present so no Jekyll processing is applied).

## Running locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

No dependencies, no build step. The site also works when opened as local files, except that the
filterable tables need a real HTTP origin in some browsers.

## Flags and corrections

Sections marked **our reasoning** contain argument, not sourced fact. Everything else carries a source link.
Corrections are welcome as issues: give the claim ID (for example `C083`), the corrected statement, and a link to a
primary source. Superseded numbers are kept in the ledger so changes are visible.

## Legal

Independent, non-commercial fan project. World of Warcraft and Blizzard Entertainment are trademarks of Blizzard
Entertainment, Inc. This site is not affiliated with, endorsed by, or sponsored by Blizzard. No content from
Wowhead, Icy Veins or any other site is rehosted here; sources are summarised, credited and linked.
