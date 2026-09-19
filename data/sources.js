/* =============================================================================
   SOURCE REGISTRY — WoWForever
   Every entry below was opened and read by the maintainer on 2026-09-18 (UTC)
   unless its note says otherwise. `tier` describes the *evidence class*, not how
   much we like the site:
     official  = a first-party Blizzard URL (news article, product page, or blue post)
     press     = developer interview or reporting by a named outlet; verified secondary reporting
     datamine  = client data / beta build extraction, subject to change
     guide     = reputable standing guide site's own analysis
     community = unverified player post, forum opinion, or RMT-adjacent site
   An entry may carry an optional `also: [urls]` list. Those URLs are additional
   pages of the same source that this site links to (for example the other two
   Warrior spec guides on the same site). tools/check-citations.mjs treats them
   as registered, so a page can never link out to an unregistered URL; the
   source watcher fingerprints the main `url` and every HTTP URL in `also`.
   ========================================================================== */
window.WOWF_SOURCES = [
  {
    id: "bnet-forever",
    title: "World of Warcraft: Forever product page",
    publisher: "Blizzard Entertainment",
    date: "2026-09-12 (updated through 2026-09-18)",
    url: "https://worldofwarcraft.blizzard.com/en-us/forever",
    tier: "official",
    firstParty: true,
    supports: [
      "Forever is included with an active WoW subscription",
      "Launch 4 Nov 2026 with a countdown clock on the page",
      "Skyborne, new and expanded zones, class/spec revamps, Legacy, Camping, Honor changes",
      "Links to the official Blizzard panel recaps"
    ]
  },
  {
    id: "bnet-whats-next",
    title: "World of Warcraft: Forever — What's Next Panel Recap",
    publisher: "Blizzard Entertainment (news.blizzard.com)",
    date: "2026-09-12",
    url: "https://news.blizzard.com/en-us/article/24303862/world-of-warcraft-forever-whats-next-panel-recap",
    tier: "official",
    firstParty: true,
    supports: [
      "Four launch pillars: approachable/familiar, world as main character, journey before destination, protect social play",
      "No flying mounts, no level scaling. Re-read line by line on 2026-09-19: the written recap frames everything inside \"the level 1–60 journey\" and calls Barrow Deeps a \"maximum-level\" raid, but it does not print a level-cap figure and does not contain the word 'indefinitely' — that word is Holly Longdale's on-stage statement as reported by PCGamesN (pcgn-announce), and was wrongly attributed to this page until 2026-09-19 (irregularity I-17)",
      "Four new zones named: Mount Hyjal, Shen'dralas, Riverglades, Zephras Isle",
      "1,000+ new quests across the level 1–60 journey",
      "Nine new dungeons named",
      "Barrow Deeps = maximum-level 10-player raid; Hyjal Summit = 20-player raid",
      "Darkspear Islands = 15 vs 15 battleground, control points plus Arathi-Basin-style flag capture",
      "9 Dec 2026: new raids unlock; later: more raids, dungeons, PvP updates, world content, quests, Hardcore, a revamped iconic raid",
      "Launch 4 Nov 2026 at 3:00 p.m. PST; beta from 17 Sep",
      "\"This is not a mode, a season, or a new version of Classic\""
    ]
  },
  {
    id: "bnet-deep-dive",
    title: "World of Warcraft: Forever Deep Dive Panel Recap",
    publisher: "Blizzard Entertainment (news.blizzard.com)",
    date: "2026-09-13",
    url: "https://news.blizzard.com/en-us/article/24303313/world-of-warcraft-forever-deep-dive-panel-recap",
    tier: "official",
    firstParty: true,
    supports: [
      "Campsites: vendors, repairs, profession workspaces, one-hour buffs; campfire lasts 10 min (per dev interview) and holds up to 3 crafted objects, upgraded campfires hold 5 or 10",
      "600+ new recipes; Blueprint recipes from dungeon bosses; crafted food gives a small XP bonus plus stat boosts",
      "Legacy Points from challenges; 16 spendable per character at launch, up to 65 earnable; trees: Professions, Adventure, Resourcefulness",
      "Legacy examples: Well Rested (rested XP cap), Bountiful Harvest (more Mining/Herbalism/Skinning materials), Reagent Economy (removes reagent costs)",
      "Realmless rulesets: Normal, PvP, Roleplaying, Hardcore (after launch); no cross-ruleset grouping; factions remain separate",
      "Collections and Legacy Points are account-wide across rulesets, Hardcore excepted",
      "Two-part names, unique per region; Season-of-Discovery-style faction balance for the PvP ruleset",
      "Itemization: spell/melee/ranged hit merged, crit merged; weapon skill reduced per item; bonus healing now includes one third as much bonus damage; new anti-dodge/parry stats; caster weapons grant spell damage/healing",
      "Every dungeon drop re-examined; unique dungeon boss items are now blue; set bonuses improved; hundreds of new drops; world-drop epics improved; hundreds of new rare-creature drops",
      "Quest reward examples: Ladimore Heirloom Ring (Duskwood / Mor'ladim), Master Hunter's Spellsword (Hemet Nesingwary)",
      "Racials reworked: every race has two active and two passive abilities. Dwarf Stoneform reduces Physical damage taken; Mace Specialization gives crit with all spells and abilities while a mace is equipped; Undead Will of the Forsaken removes Charm/Fear/Sleep but no longer grants immunity",
      "Six new race/class combos: Gnome Priest, Human Hunter, Dwarf Shaman, Orc Mage, Troll Warlock, Undead Paladin",
      "Talent trees: same structure and row count as Classic; milestones at 11, 16, 21, 31; Divine Spirit, Blessing of Kings and Improved Mark of the Wild are baseline",
      "Paladin changelist: Holy Strike at level 6 (12s cooldown), seals no longer consumed by Judgement, Seal of Fury taunt for Protection, Consecration baseline at 20, named Holy/Protection/Retribution talents. Paladins still lack an interrupt and cannot slow like other classes",
      "Combat pacing: an ordinary solo creature takes roughly 10–15 seconds; crowd control (Polymorph, Banish, Fear, Root) still matters",
      "Re-read line by line on 2026-09-19. Mount cost, first-party: Forever is \"adopting the Burning Crusade-style mount-cost approach, shifting the up-front mount cost into training and granting a mount when players learn the riding skill\" — the structural half of C127; the 100 / 1,000 gold figures remain interview statements",
      "Rulesets, first-party detail: \"if a Hardcore character dies, that character can transfer to another ruleset, including PvP\"; Legacy Reward Track rewards are cosmetic or prestige \"without providing a competitive gameplay advantage\"",
      "Itemisation examples, first-party: the Worgenbane Talisman as a situational trinket; effects tied to environments such as Woodlands, Mountains or Deserts and to creature types (X'caliboar named as an example)",
      "Paladin detail beyond the summary line: Holy — Voice of Truth grants temporary immunity to Silence and Interrupts, Reverence regenerates Mana from Spirit while casting, Infusion of Light, Holy Shock on a 10-second cooldown, Consecrated Ground, Light's Vigil; Protection — Improved Seal of Fury, Shield Specialization, Swift Judgment, Templar's Bulwark, redesigned Reckoning, Iron Creed; Retribution — Vindication, Sacred Arbiter, Champion of the Light, Instrument of the Law, Twist of Light (seal twisting without a swing-timer add-on)"
    ]
  },
  {
    id: "bnet-found-photos",
    title: "World of Warcraft: Forever Found Photos Panel Recap",
    publisher: "Blizzard Entertainment (news.blizzard.com)",
    date: "2026-09-12",
    url: "https://news.blizzard.com/en-us/article/24304071/world-of-warcraft-forever-found-photos-panel-recap",
    tier: "official",
    firstParty: true,
    supports: [
      "Found Photos framing: Forever begins in the early Year 1 period and occupies its own time bubble",
      "New ship routes, Riverglades and Powderfuse Port, including the roughly Stranglethorn-sized zone and nearly 200 quests",
      "Forsaken Paladin journey beginning at Bandarion Keep and an epic mount quest at level 60",
      "Skyborne and Zephras Isle context, including the Windshapers, High Order and Al’Aketh"
    ]
  },
  {
    id: "bnet-prepurchase",
    title: "Pre-Purchase World of Warcraft: Forever Upgrades and Begin Your Next Journey in Azeroth",
    publisher: "Blizzard Entertainment (news.blizzard.com)",
    date: "2026-09-12",
    url: "https://news.blizzard.com/en-us/article/24301508/pre-purchase-world-of-warcraft-forever-upgrades-and-begin-your-next-journey-in-azeroth",
    tier: "official",
    firstParty: true,
    supports: [
      "Paid packs exist (Skyborne Heroic, Skyborne Epic, Warcraft Forever Collection)",
      "Links Forever to beta access for eligible bundles",
      "Read line by line on 2026-09-19 (it had previously been listed without a full reading). Dated facts it adds: Early Name Reservation runs 27 October through 3 November 2026 PST, is included with any upgrade purchase, allows up to three characters to be created and customised, and names are first-come, first-served and not guaranteed",
      "Invite-A-Friend Launch Codes let eligible invitees play Forever without a subscription or Game Time during launch week, 4 through 11 November 2026 PST; codes are emailed from 20 October 2026 PST; Heroic includes one code, Epic and the Collection three; the codes do not include beta access",
      "The Skyborne Epic Pack and the Warcraft Forever Collection add 30 days of Game Time starting 4 November; the Collection is available through 11 January 2027",
      "The Heroic Pack's Cerulean Prideclaw ground mount carries Blizzard's own note that \"players will need to purchase the riding skill in-game to access and use this mount\" — first-party corroboration that a shop mount does not skip riding training",
      "Beta window stated as 17 September through 21 October 2026 PST; launch 4 November 2026 at 3:00 p.m. PST; Forever requires a subscription or Game Time"
    ]
  },
  {
    id: "wh-roadmap",
    title: "World of Warcraft: Forever Roadmap — Release Date, New Content",
    publisher: "Wowhead",
    date: "2026-09-15 (updated)",
    url: "https://www.wowhead.com/forever/guide/content-release-roadmap",
    tier: "guide",
    supports: [
      "Wowhead's own content-release table and the explicit warning that later dates are estimates",
      "Dec 9 2026: Barrow Deeps, Hyjal Summit and Onyxia's Lair",
      "Winter 2026: Hardcore; Spring 2027: 2 raids, 2 dungeons, quests, new playable area, legendary questline, PvP season refresh; Summer 2027: revamped iconic raid, new raid, PvP season refresh, professions and Legacy updates",
      "Skyborne class list: both factions Warrior/Hunter/Rogue/Druid; Horde Shaman; Alliance Mage",
      "Dungeon level bands as of the guide's update"
    ]
  },
  {
    id: "wh-dungeons",
    title: "Dungeons Overview for Forever — Locations, Guides and Details",
    publisher: "Wowhead",
    date: "2026-09-15 (updated)",
    url: "https://www.wowhead.com/forever/guide/dungeons-overview-locations-details",
    tier: "guide",
    supports: [
      "All nine dungeons with level bands, locations and one-line descriptions",
      "Hall of Thanes (Alliance, under Ironforge), Ruins of Lordaeron (Horde), Excavation Site in the Wetlands, City of Dalaran, Blackmaw Hold (North Azshara, Furbolg), The Drowned City (off Stranglethorn), Krol'dok Stronghold (Riverglades), Alcaz Prison (Alcaz Island), Shaper's Terrace (Un'Goro)"
    ]
  },
  {
    id: "wh-kroldok",
    title: "Blizzard Clarifies Krol'dok Stronghold Level Range in Forever — All 9 Dungeons Listed",
    publisher: "Wowhead (reporting a Blizzard blue post)",
    date: "2026-09-15",
    url: "https://www.wowhead.com/forever/news/blizzard-clarifies-krol-dok-stronghold-level-range-in-forever-382895",
    tier: "press",
    supports: [
      "Wowhead's report of Blizzard's correction: Krol'dok Stronghold is level 40–45, superseding earlier 40–55 material",
      "Secondary copy of the level-band table; the direct Blizzard forum post is registered as bnet-kroldok"
    ]
  },
  {
    id: "wh-racials",
    title: "All Racials and Available Class-Race Combinations in World of Warcraft: Forever",
    publisher: "Wowhead (guide by Serenal)",
    date: "2026-09-16 (updated)",
    url: "https://www.wowhead.com/forever/guide/new-race-class-combinations",
    tier: "datamine",
    supports: [
      "Full racial lists per race with tooltips, including Skyborne Windshaper (Horde) vs High Order (Alliance)",
      "Skyborne Mage is Alliance only; Skyborne Shaman is Horde only",
      "Undead: Cannibalize restores 7% health and mana per 2s over 10s; Will of the Forsaken removes Charm/Fear/Sleep; Touch of the Grave; Underwater Breathing",
      "Tauren: Endurance (+5% health, +1% hit), War Stomp (2s stun, 2 min cooldown), Plainsrunning (up to 30% movement speed), Cultivation"
    ]
  },
  {
    id: "wh-beta",
    title: "Forever Beta Overview: How to Access, Level Caps and More",
    publisher: "Wowhead (guide by Serenal)",
    date: "2026-09-16 (updated)",
    url: "https://www.wowhead.com/forever/guide/beta-content-unlock-overview",
    tier: "guide",
    supports: [
      "Beta level cap 20 at launch, rising to 30 after two weeks",
      "Beta access: Skyborne Epic Pack / Warcraft Forever Collection, McDonald's Australia promo, or opt-in (not guaranteed)",
      "Initial beta content: levels 1–20, new talents, new profession items, Hall of Thanes and Ruins of Lordaeron, starter zones, Legacy System",
      "Flashback: the 55–60 dungeons are unreachable in beta"
    ]
  },
  {
    id: "wh-pvp-rank",
    title: "14-Rank PvP Honor Track and Darkspear Islands Battleground Coming in WoW: Forever",
    publisher: "Wowhead, reporting a Kotaku interview with Blizzard",
    date: "2026-09-16",
    url: "https://www.wowhead.com/forever/news/14-rank-pvp-honor-track-and-darkspear-islands-battleground-coming-in-wow-forever-382947",
    tier: "press",
    supports: [
      "Each patch cycle has a new 14-rank Honor track",
      "Honor comes from battlegrounds and PvP-related content",
      "Rewards include cosmetics and PvP armor that has stats on it",
      "New battlegrounds including Darkspear Islands; Blizzard used the plural 'battlegrounds'"
    ]
  },
  {
    id: "wh-qa",
    title: "World of Warcraft: Live Q&A Liveblog — Midnight and Forever",
    publisher: "Wowhead (liveblog of a Blizzard Q&A)",
    date: "2026-09-17",
    url: "https://www.wowhead.com/forever/news/world-of-warcraft-live-q-a-liveblog-midnight-and-forever-382967",
    tier: "press",
    supports: [
      "PvP: no Rated PvP; a new PvP track that resets each season/tier; Honor gains adjusted so parking in Alterac Valley is not the best play; a new battleground with a new reputation",
      "Realmless rulesets: PvE, PvP, Roleplay, Hardcore; battlegrounds are shared across rulesets. Exact liveblog wording on switching: \"Without a character transfer, you can't swap between rulesets\" — it says a swap needs a transfer, not that transfers do not exist (our earlier paraphrase 'no character transfer between rulesets' overstated it; corrected 2026-09-19, irregularity I-18)",
      "A weekly podcast during the beta: \"every week for the next 6 weeks\", featuring Josh Greenfield and Josh Corbett from Countdown to Classic — a spoken channel where class-tuning statements may surface before any written changelist",
      "Oceanic players are hosted in Oceania but share the same US-wide auction house",
      "GDKP is not allowed; Blizzard will actively monitor the economy and be very punishing toward gold buyers",
      "Addons: modern client API, simplified boss encounters, unified API with Modern",
      "Dungeons/raids: single difficulty, no flex raiding, every tier has a 10-player and a 20-player raid, 40-player raids start with Onyxia's Lair, no cross-faction play",
      "Names are region-wide and cannot repeat across rulesets"
    ]
  },
  {
    id: "wh-gdkp",
    title: "GDKP Will Not Be Allowed in WoW: Forever",
    publisher: "Wowhead (reporting the Blizzard Q&A)",
    date: "2026-09-17",
    url: "https://www.wowhead.com/forever/news/gdkp-will-not-be-allowed-in-wow-forever-382968",
    tier: "press",
    supports: [
      "GDKP banned in Forever",
      "Blizzard's stated reasons: GDKP overtaking guild structures, pricing players out of content, gold laundering, RMT stigma",
      "Blizzard says it has been too lenient on gold buyers and will crack down aggressively (perma-ban language implied)"
    ]
  },
  {
    id: "wh-reals",
    title: "Tarnished Undermine Reals Coming to World of Warcraft: Forever",
    publisher: "Wowhead (reporting the Blizzard Q&A)",
    date: "2026-09-17",
    url: "https://www.wowhead.com/forever/news/tarnished-undermine-reals-coming-to-world-of-warcraft-forever-382969",
    tier: "press",
    supports: [
      "Tarnished Undermine Reals (a Season of Discovery currency) are coming to Forever, announced by Josh Greenfield in the live Q&A",
      "In SoD they were earned in dungeons and spent on gear, toys, patterns and reagents; how they are earned in Forever is not yet known",
      "Verified item page pattern: https://www.wowhead.com/forever/item=226404/tarnished-undermine-real"
    ]
  },
  {
    id: "wh-professions",
    title: "Changes & Additions to Professions in World of Warcraft: Forever",
    publisher: "Wowhead (news, by Nodge)",
    date: "2026-09-18",
    url: "https://www.wowhead.com/forever/news/changes-and-additions-to-professions-in-world-of-warcraft-forever-382924",
    tier: "guide",
    supports: [
      "The profession system stays the Classic system — fixed material requirements, fixed stats on crafted items; the Dragonflight crafting overhaul is NOT used",
      "600+ new recipes across professions and level ranges",
      "Campsite buff objects do not stack with the equivalent class buffs (example: Herbalist Incense Candle vs Mage Arcane Intellect)",
      "Legacy Points for first time reaching 150 / 225 / 300 in a tradeskill",
      "Professions Legacy tree perks include more skill-ups and more Scarce materials from Mining/Herbalism/Skinning, plus supply-crate turn-ins to the Azeroth Commerce Authority or Durotar Supply and Logistics",
      "A level 3–4 starter quest hands out a Herbalism, Mining or Skinning manual"
    ]
  },
  {
    id: "wh-bank",
    title: "Increased Bank Space, Raid Items Hidden Until It Drops — MMORPG Interview on WoW: Forever",
    publisher: "Wowhead, summarising an MMORPG interview with Josh Greenfield and Jeff Parrott",
    date: "2026-09-18",
    url: "https://www.wowhead.com/forever/news/increased-bank-space-raid-items-hidden-until-it-drops-mmorpg-interview-on-wow-382960",
    tier: "press",
    supports: [
      "Blizzard is obfuscating items: you will not see item stats until the item drops for you or on your server; there will be no Dungeon Journal; Blizzard expects the first raid week to be a 'Wild West' before BiS lists appear",
      "Default bank is two to four times larger; bags start at original size",
      "Campsite fixtures: every profession provides a buff; higher-level camps hold more fixtures; campfire lasts 10 minutes with a one-hour cooldown; cannot be placed in cities or too near another campfire",
      "Horizontal progression: hundreds of biome-specific effects; epic items are meant to keep prestige",
      "Built-in damage meter is in; cooldown manager planned later; addon approach mirrors Modern WoW",
      "Class questlines: some Season of Discovery class quests return, plus new and expanded ones"
    ]
  },
  {
    id: "wh-legacy",
    title: "All Known Ways to Earn Legacy Points in WoW: Forever",
    publisher: "Wowhead (datamine)",
    date: "2026-09-17",
    url: "https://www.wowhead.com/forever/news/all-known-ways-to-earn-legacy-points-in-wow-forever-382961",
    tier: "datamine",
    supports: [
      "Datamined Legacy achievements: profession 300 milestones, class level 45 milestones, Barrow Deeps / Hyjal Summit / Onyxia achievements, and more",
      "Launch spending cap of 16 points while more can be earned"
    ]
  },
  {
    id: "wh-compendium",
    title: "Forever Guide Compendium: Every Guide You'll Need for Beta Launch",
    publisher: "Wowhead",
    date: "2026-09-17",
    url: "https://www.wowhead.com/forever/news/forever-guide-compendium-every-guide-you-ll-need-for-beta-launch-382965",
    tier: "guide",
    supports: [
      "Wowhead's Forever guide suite index: beta, pre-order, Skyborne, dungeons, raids, zones, tier sets, systems, camping, Legacy, roadmap, talent calculator, class/race combos",
      "Class coverage at that moment consisted of Feral Tank Druid and Protection Paladin PvE guides"
    ]
  },
  {
    id: "wh-class-guides",
    title: "Class Guides — Forever (category listing)",
    publisher: "Wowhead",
    date: "2026-09-18 (checked)",
    url: "https://www.wowhead.com/forever/guides/classes",
    tier: "guide",
    supports: [
      "At the time of checking, the Forever class-guide category contained exactly one guide: all racials and class/race combinations",
      "Evidence that no complete per-class PvP guide set exists yet"
    ]
  },
  {
    id: "kotaku-interview",
    title: "8 New Things We Learned About World Of Warcraft: Forever",
    publisher: "Kotaku (Rebekah Valentine), interview with lead Classic designer Tim Jones and lead encounter designer Mike Nuthals",
    date: "2026-09-14",
    url: "https://kotaku.com/new-things-learned-world-of-warcraft-forever-2000734005",
    tier: "press",
    supports: [
      "No Season-of-Discovery-style wacky class/role combos (e.g. shaman tanks) at launch; design baseline is 'adjacent to the Classic game'",
      "Every raid tier will have at least one 10-player and one 20-player option, sometimes a 40-player raid",
      "Mount gold cost moved off the mount and onto riding training — it costs more gold than before to train riding",
      "Meeting Stones open a Looking-for-Group window but do not summon players; a Warlock is still needed to summon",
      "Addons restricted like retail: no computational addons that automate marking or communicating",
      "No one-button rotation",
      "PvP has a new progression system built on Honor earned in battlegrounds and PvP-related content",
      "Re-read on 2026-09-19. Tim Jones, verbatim: \"We're excited for people to jump into new battlegrounds like the Darkspear Islands to supplement the original Vanilla battlegrounds that people will be able to jump into\" — a developer statement, in an interview, that the original battlegrounds remain; Blizzard's written recaps still do not name them",
      "Tim Jones on the name: \"we have a level 60 cap. We are going to continue to build content horizontally for players\"",
      "Mount wording, verbatim: \"we've readjusted the gold cost to not be on the mount itself, but on the training so that we're not giving someone free training for a mount when they hit level 40\""
    ]
  },
  {
    id: "wt-token",
    title: "WoW Forever — No Plans for WoW Token or Character Boosts",
    publisher: "Warcraft Tavern, reporting YouTuber Destin's BlizzCon interview with Clay Stone and Nora Mills",
    date: "2026-09-14",
    url: "https://www.warcrafttavern.com/forever/news/wow-forever-no-plans-for-wow-token-or-character-boosts/",
    tier: "press",
    supports: [
      "No WoW Token and no character boosts planned for Forever",
      "'The journey is the game' and 'you get better at the game by playing the game'",
      "Caveat: this is a 'no plans' interview statement, not a published Blizzard policy page"
    ]
  },
  {
    id: "mop-addons",
    title: "WoW Forever discusses addons, party forming, PvP progression, and how it effectively negates WoW 2",
    publisher: "Massively Overpowered (Chris Neal)",
    date: "2026-09-15",
    url: "https://massivelyop.com/2026/09/15/wow-forever-discusses-classes-addons-party-forming-pvp-progression-and-how-it-effectively-negates-wow-2/",
    tier: "press",
    supports: [
      "Mount riding training costs more gold than before",
      "Meeting stones open an LFG window but do not teleport players",
      "Addons restricted similar to retail for automating communication or marking",
      "PvP progression: Honor earns ranks, 14 ranks every PvP season or patch cycle, plus cosmetics and armor with PvP stats"
    ]
  },
  {
    id: "mop-announce",
    title: "BlizzCon 2026: World of Warcraft Forever is a 'permanent home' for Classic players",
    publisher: "Massively Overpowered",
    date: "2026-09-12",
    url: "https://massivelyop.com/2026/09/12/blizzcon-2026-world-of-warcraft-forever-announced-as-a-permanent-home-for-classic-players/",
    tier: "press",
    supports: [
      "Announcement context, launch date, beta date, headline content list",
      "Third-party confirmation of the content list published by Blizzard"
    ]
  },
  {
    id: "iv-tauren",
    title: "Tauren Race Guide for WoW Forever",
    publisher: "Icy Veins (Abide)",
    date: "2026-09-17",
    url: "https://www.icy-veins.com/wow-forever/tauren-race-guide",
    tier: "guide",
    supports: [
      "Tauren racial changes from Classic to Forever in a comparison table",
      "War Stomp 2s stun, Endurance +5% health and +1% hit, Plainsrunning up to 30% movement speed, Cultivation bonus herb node, Nature Resistance removed"
    ]
  },
  {
    id: "iv-firstaid",
    title: "Healing Potions Now Crafted by First Aid in WoW Forever",
    publisher: "Icy Veins (Anshlun)",
    date: "2026-09-17",
    url: "https://www.icy-veins.com/wow-forever/news/healing-potions-now-crafted-by-first-aid-in-wow-forever/",
    tier: "datamine",
    supports: [
      "Healing Potions move from Alchemy to First Aid in Forever",
      "First Aid levels required per potion: Minor 55, Lesser 85, Healing 135, Greater 155, Superior 215, Major 275",
      "Potion recipes still use herbs and vials but now also consume cooking reagents such as Mild Spices and Hot Spices"
    ]
  },
  {
    id: "iv-tiersets",
    title: "WoW Forever Crafted Tier Sets Datamined: Recipes, Costs, and Set Bonuses",
    publisher: "Icy Veins (Anshlun), citing community dataminer Stiven",
    date: "2026-09-18",
    url: "https://www.icy-veins.com/wow-forever/news/wow-forever-crafted-tier-sets-datamined-recipes-costs-and-set-bonuses/",
    tier: "datamine",
    supports: [
      "Crafted tier sets ('Artisan' sets) exist in the beta data, expanding over phases",
      "Crafting material: Malleable Essence of Nature, obtained only by disenchanting items from Hyjal Summit or Barrow Deeps",
      "Shoulders, boots, leggings and gloves cost 3 Malleable Essence of Nature each",
      "Crafted tier pieces are Bind on Equip; only one may be equipped at first, with a second unlocked via the Guardians of Hyjal reputation",
      "Five-piece bonuses listed per class (Druid, Hunter, Mage, Paladin, Priest, Rogue, Shaman and more in the article)",
      "Everything here is datamined and may change"
    ]
  },
  {
    id: "wago-tsm",
    title: "TradeSkillMaster — versions (addon distribution)",
    publisher: "Wago Addons",
    date: "2026-09-13 (latest build listed), checked 2026-09-19 (twice, unchanged)",
    url: "https://addons.wago.io/addons/tradeskillmaster/versions?stability=stable",
    tier: "tooling",
    supports: [
      "TSM v4.14.77 supports Retail 12.1.0, Mists of Pandaria Classic 5.5.4, Burning Crusade 2.5.6 and Classic Era 1.15.9",
      "No Forever / 1.60.x build is listed, so TSM does not yet ship a Forever-supported release"
    ]
  },
  {
    id: "cf-priceanswer",
    title: "Price Answer for TradeSkillMaster — supported versions and price sources",
    publisher: "CurseForge (addon documentation by the Price Answer authors)",
    date: "checked 2026-09-18",
    url: "https://www.curseforge.com/wow/addons/price-answer",
    tier: "community",
    supports: [
      "Classic Era (vanilla) has only limited native TSM price sources (crafting and destroy); an external price addon such as Auctionator, Auctioneer or AHDB is required for market values",
      "Useful context for any vanilla-ruleset economy tooling, including Forever"
    ]
  },
  {
    id: "wiki-forever",
    title: "World of Warcraft: Forever — Warcraft Wiki",
    publisher: "Warcraft Wiki (wiki.gg)",
    date: "2026-09-15 (last modified)",
    url: "https://warcraft.wiki.gg/wiki/World_of_Warcraft:_Forever",
    tier: "guide",
    supports: [
      "Independent summary: release date, setting (first year of WoW, after WC3 Reforged: Forsaken Kingdom, before Molten Core), feature list",
      "Dungeon list with level ranges and new zones; realm rulesets; level cap 60 indefinitely"
    ]
  },
  {
    id: "polygon-announce",
    title: "Blizzard announces World of Warcraft Forever, the 'Classic Plus' fans have demanded",
    publisher: "Polygon (Michael McWhertor)",
    date: "2026-09-12",
    url: "https://www.polygon.com/world-of-warcraft-forever-announced-classic-plus-blizzcon-2026/",
    tier: "press",
    supports: [
      "Independent confirmation of the announcement, launch date, and the headline content list (new zones, 1,000+ quests, Darkspear Islands battleground, nine dungeons, two raids, Skyborne)",
      "Re-checked 2026-09-19: the article itself now loads behind a reCAPTCHA wall for automated fetches; its indexed text still reads that Forever \"will maintain a level cap of 60 for the MMO variant's foreseeable future\" — Polygon's paraphrase, not a Blizzard quotation"
    ]
  },
  {
    id: "pcgn-announce",
    title: "World of Warcraft Forever is the MMORPG's \"Classic Plus,\" and its beta is imminent",
    publisher: "PCGamesN (Ken Allsop), reporting the BlizzCon 2026 opening ceremony",
    date: "2026-09-12; read 2026-09-19",
    url: "https://www.pcgamesn.com/world-of-warcraft/forever-blizzcon-2026-wow-classic-plus",
    tier: "press",
    supports: [
      "The origin of the word 'indefinitely': \"Longdale says the level cap will stay at 60 'indefinitely'\" — Executive Producer Holly Longdale, on stage, as reported by PCGamesN. It is a reported spoken statement, not text on a Blizzard page",
      "Longdale's framing of Forever as \"your new permanent home\", \"friendly, familiar, and new\", set \"essentially year one of vanilla WoW\" after Warcraft III Reforged: Forsaken Kingdom",
      "Blizzard's stage list: \"over 1,000 new quests, new items and rewards, new professions content, new reputations, account-wide perks\", an SD/HD character-model toggle, Hardcore as an optional extra; launch Wednesday 4 November, beta Thursday 17 September"
    ]
  },
  {
    id: "mmos-beta",
    title: "WoW Forever Beta Brings New Dungeons and a Level 20 Cap",
    publisher: "MMOs.com",
    date: "2026-09-18",
    url: "https://mmos.com/news/mmorpg-news/wow-forever-beta",
    tier: "press",
    supports: [
      "Beta invitation process, launcher steps, beta running through 21 October",
      "Blizzard's phishing warning about fake beta invites",
      "A later 'Server Slam' open beta window is planned, timing unannounced"
    ]
  },

  {
    id: "wh-pvp-rewards",
    title: "PvP and Legacy System Rewards in World of Warcraft: Forever",
    publisher: "Wowhead (datamine) — iMX3",
    date: "2026-09-17",
    url: "https://www.wowhead.com/forever/news/pvp-and-legacy-system-rewards-in-world-of-warcraft-forever-382959",
    tier: "datamine",
    supports: [
      "Rank-by-rank rewards for the 14-rank Honor track: rank 1 Faction Tabard, 2 Insignia Trinket, 3 Faction Cloak, 4 Faction Necklace, 5 Combat Potions unlocked, 6 Elite Faction Tabard, 7 Battle Standard, 8 Elite Wrist + Waist upgrades, 9 Elite Boot upgrade, 10 Elite Glove upgrade, 11 Black War mounts, 12 Elite Shoulder + Leg upgrades, 13 Elite Helmet + Chest upgrades, 14 Weapon Arsenal",
      "Legacy reward track: level 15 Replica Ironforge Air Rifle, level 25 Spectral Bear Cub, level 40 Spectral Bear Tabard, level 55 Reins of the Spectral Bear (epic mount, 100% speed), all claimed from Innkeeper Wiley in Ratchet",
      "Wowhead's own warning: \"these ranks and rewards are subject to change\" and the final versions will likely be adjusted before launch"
    ]
  },
  {
    id: "wh-guide-index",
    title: "Wowhead Forever guides index (all 17 published guides) and the Class Guides category",
    publisher: "Wowhead",
    date: "2026-09-18 (checked)",
    url: "https://www.wowhead.com/forever/guides",
    tier: "guide",
    supports: [
      "Wowhead's full Forever guide index lists 17 guides at the snapshot date",
      "Class/spec coverage is limited to three pages: Feral Tank Druid overview, Protection Paladin abilities, Protection Paladin overview — all PvE tank guides",
      "There is no PvP guide, no Best-in-Slot guide and no gold-making guide in the Forever guide index",
      "Re-checked 2026-09-18 (third round, this session): the index still reads \"17 of 17\", the four Classes-category entries are unchanged, and there is still no PvP, Best-in-Slot or gold guide",
      "The Class Guides category page (wowhead.com/forever/guides/classes) displayed a single guide while the full index showed the three class/spec pages — used as evidence of coverage, not of game facts"
    ]
  },
  {
    id: "iv-class-overviews",
    title: "WoW Forever class overviews (all nine classes)",
    publisher: "Icy Veins",
    date: "2026-09-18 (checked)",
    url: "https://www.icy-veins.com/wow-forever/",
    tier: "guide",
    supports: [
      "A class overview page exists for every class: /wow-forever/druid-class-overview, hunter-, mage-, paladin-, priest-, rogue-, shaman-, warlock-, warrior-class-overview",
      "Icy Veins' hub also hosts a Forever overview, roadmap, beta access and subscription pages, plus a Forever news feed",
      "Class overviews are attributed analysis, not Blizzard statements; where they state gear recommendations they mark them as pending beta testing",
      "Per-spec Forever PvE guides now exist for every class, not just a few: the class switcher on the Arms Warrior guide (opened 2026-09-18, last updated 17 Sep 2026) lists Balance Druid, Beast Mastery Hunter, Frost Mage, Holy Paladin, Discipline Priest, Assassination Rogue, Elemental Shaman, Affliction Warlock and Arms Warrior, with Fury and Protection Warrior alongside. All eleven URLs are registered below and are on the weekly watcher",
      "Those spec guides are explicitly level-20 and PvE-scoped: the Arms guide says it \"covers leveling and PvE play through level 20\", that its advice is \"starting recommendations based on the available WoW Forever trainer and talent information\", and that its scores \"are early ratings based on the Level 20 toolkit and do not reflect end-game potential\"",
      "Individually opened on 2026-09-18: the Warrior overview and the Arms Warrior guide. The other spec-guide URLs are registered from that switcher and have not each been read end to end — stated here so a reviewer is not misled",
      "Warrior overview re-checked 2026-09-18: it states Dwarf Mace Specialization now gives 1% critical strike with all spells and abilities while a mace is equipped, and that the new Dwarf racial Big Game Hunter deals 5% more damage to Beasts"
    ],
    also: [
      "https://www.icy-veins.com/wow-forever/balance-druid-ranged-dps-pve-guide",
      "https://www.icy-veins.com/wow-forever/beast-mastery-hunter-ranged-dps-pve-guide",
      "https://www.icy-veins.com/wow-forever/frost-mage-ranged-dps-pve-guide",
      "https://www.icy-veins.com/wow-forever/holy-paladin-healer-pve-guide",
      "https://www.icy-veins.com/wow-forever/discipline-priest-healer-pve-guide",
      "https://www.icy-veins.com/wow-forever/assassination-rogue-melee-dps-pve-guide",
      "https://www.icy-veins.com/wow-forever/elemental-shaman-ranged-dps-pve-guide",
      "https://www.icy-veins.com/wow-forever/affliction-warlock-ranged-dps-pve-guide",
      "https://www.icy-veins.com/wow-forever/arms-warrior-melee-dps-pve-guide",
      "https://www.icy-veins.com/wow-forever/fury-warrior-melee-dps-pve-guide",
      "https://www.icy-veins.com/wow-forever/protection-warrior-tank-pve-guide"
    ]
  },
  {
    id: "iv-bestrace",
    title: "Best Race for Every Class in WoW Forever — Watch Our Breakdown",
    publisher: "Icy Veins — Anshlun",
    date: "2026-09-17",
    url: "https://www.icy-veins.com/wow-forever/news/best-race-for-every-class-in-wow-forever-watch-our-breakdown/",
    tier: "guide",
    supports: [
      "Per-class best-race picks: Druid Night Elf / Tauren; Hunter Human / Troll; Mage Gnome / Orc; Paladin Human / Undead; Priest Gnome / Undead; Rogue Night Elf / Troll; Shaman Dwarf / Orc; Warlock Gnome / Undead; Warrior Night Elf (Dwarf for tanking) / Orc or Tauren",
      "The article states the picks are based on the BlizzCon demos and datamining and that they will likely change before launch",
      "Bonus tip: Tauren Plainsrunning is expected to be strong during a level-20 beta cap",
      "Every race receives four new or reworked racial abilities in Forever"
    ]
  },
  {
    id: "iv-addons",
    title: "Addons in WoW Forever? Blizzard Devs Just Addressed the Big Question",
    publisher: "Icy Veins — Emma",
    date: "2026-09-17",
    url: "https://www.icy-veins.com/wow-forever/news/addons-in-wow-forever-blizzard-devs-just-addressed-the-big-question/",
    tier: "press",
    supports: [
      "Blizzard message shared in the WoW UI Discord: \"WoW Forever shares Mainline WoW's UI architecture, including the vast majority of APIs available in 12.1.5\"",
      "Addons are part of the Forever experience, with the same API restrictions introduced with Midnight",
      "Built-in damage meter and cooldown manager are coming to Forever",
      "Game Informer interview: the developers want to keep customisation but not let addons have \"too much power and control over a player's experience\""
    ]
  },
  {
    id: "wh-preorder",
    title: "Forever Pre-Orders Guide: All Editions and Rewards",
    publisher: "Wowhead — Serenal",
    date: "2026-09-16 (updated)",
    url: "https://www.wowhead.com/forever/guide/pre-order-packs-rewards",
    tier: "guide",
    supports: [
      "Three packs: Skyborne Heroic Pack $29.99, Skyborne Epic Pack $59.99, Warcraft Forever Collection $79.99; upgrading later is possible, downgrading is not",
      "Forever itself is included with a WoW subscription, but the Skyborne race and Zephras Isle starting experience require at least the Heroic Pack",
      "All three packs include WoW Forever Early Name Reservations; Heroic includes one Invite-A-Friend launch code, Epic and Collection include three",
      "Beta access comes with the Epic Pack or the Collection, from a McDonald's Australia promotion, or from the Battle.net beta opt-in (not guaranteed)",
      "Epic and Collection also include 30 days of Game Time; the Collection adds Warcraft III Reforged: Forsaken Kingdom",
      "Guide is written against patch 1.60.1"
    ]
  },
  {
    id: "wh-item-forever",
    title: "Tarnished Undermine Real — Forever item page (item id 226404)",
    publisher: "Wowhead",
    date: "2026-09-18 (checked)",
    url: "https://www.wowhead.com/forever/item=226404/tarnished-undermine-real",
    tier: "datamine",
    supports: [
      "The item exists in the Forever database: item level 60, binds when picked up, unique (250), max stack 250, \"Added in patch 1.60.1\"",
      "Used as the worked example of how an item is cited on this site (item ID + permalink)",
      "Caution recorded as irregularity I-8: the same page's drop list is aggregated across game versions — its filters include Season of Discovery difficulties (SoD Normal, Heat Level 1–3, Seasonal 40) and vanilla raid bosses (Molten Core, Blackwing Lair, Zul'Gurub, Stratholme), which cannot be treated as Forever drop sources"
    ]
  },
  /* =========================================================================
     ADDED 2026-09-18, THIRD VERIFICATION ROUND (this session)
     Every entry below was opened and read on 18 September 2026. Where a page
     could not be read end to end, the note says so explicitly.
     ========================================================================= */
  {
    id: "bnet-beta-live",
    title: "The World of Warcraft: Forever Beta Now Live",
    publisher: "Blizzard Entertainment (news.blizzard.com)",
    date: "2026-09-17",
    url: "https://news.blizzard.com/en-us/article/24304160/the-world-of-warcraft-forever-beta-now-live",
    tier: "official",
    firstParty: true,
    supports: [
      "The beta runs from 17 September \"through October 21, the last full day of testing\"",
      "The level cap starts at 20 and \"will be raised to 30 later in the beta\"",
      "Week 1 beta content: Skyborne and Zephras Isle, Hall of Thanes (level 13–18), Ruins of Lordaeron (level 15–20), all zone content up to level 20",
      "Blizzard's own words: \"Additional zones, dungeons, and the new battleground will open for testing as the beta continues\"",
      "A \"Server Slam\" window will open the beta to everyone for several hours later in the test; details to be announced",
      "Beta access routes: Battle.net opt-in invitations sent regularly through the test, or eligible digital bundle purchases; phishing warning and how to verify a licence on the Battle.net account"
    ]
  },
  {
    id: "bnet-kroldok",
    title: "Krol’dok Stronghold — Blizzard forum clarification",
    publisher: "Blizzard Entertainment / Kaivax",
    date: "2026-09-14",
    url: "https://us.forums.blizzard.com/en/wow/t/krol%E2%80%99dok-stronghold/2349672",
    tier: "official",
    firstParty: true,
    supports: [
      "Blizzard corrects Krol’dok Stronghold to level 40–45",
      "The blue post lists the level bands for all nine new dungeons"
    ]
  },
  {
    id: "bnet-beta-issues",
    title: "WoW Forever Beta Known Issues — September 18",
    publisher: "Blizzard Entertainment / Kaivax",
    date: "2026-09-17; updated in-topic 2026-09-18",
    url: "https://us.forums.blizzard.com/en/wow/t/2352687/1",
    tier: "official",
    firstParty: true,
    supports: [
      "Blizzard’s dated beta known-issues list for the 18 September test opening",
      "Incorrect Glancing Blow penalties, incomplete pet-stat display and class-varying Cooldown Manager work in progress",
      "Bear Form armor interaction with consumables and buffs, On-Next Attack spell-queue interaction and lower-level resurrection-sickness duration",
      "The topic says it will be updated as issues are resolved or added"
    ],
    note: "Read both returned page chunks, including the later in-topic update. The list is a dated snapshot and can change."
  },
  {
    id: "sk-interview",
    title: "\"They might have reasons to welcome the Forsaken\" — WoW Forever's Kris Zierhut and Michael Nuthals on visiting Gilneas, What-Ifs, and more [Exclusive]",
    publisher: "Sportskeeda (Jason Parker); interview with Kris Zierhut (Principal Game Designer) and Michael Nuthals (Senior Game Designer)",
    date: "2026-09-15 (modified 10:50 GMT); read 2026-09-18",
    url: "https://www.sportskeeda.com/mmo/news-they-might-reasons-welcome-forsaken-wow-forevers-kris-zierhut-michael-nuthals-visiting-gilneas-what-ifs-exclusive",
    tier: "press",
    supports: [
      "Mount gold cost sits in the training, quoted from Kris Zierhut: \"when you buy the training, the training is the full first 100 or 1,000 gold depending on which level. And then you get your first mount for free after paying for the training.\"",
      "Cosmetic bundle mounts give no gameplay advantage: \"They still need to buy their training. You still got to pay the 1,000 gold.\" Blizzard states it is \"dead set against\" selling gameplay advantage",
      "Every raid boss carries low-drop-chance items that are better than its other drops; the designers' own comparison is the Dragonspine Trophy from Gruul's Lair",
      "Items can carry special effects tied to environments (forests, mountains, underground) or to creature types (Worgen, Dwarves, Undead, Dragons) — the stated purpose is to keep old raid loot useful in later tiers",
      "Blizzard does not plan permanently unobtainable content: \"we never plan to do something like what was in Naxxramas, where you can't do it anymore\"; world events such as the Ahn'Qiraj gates style event will still exist",
      "Setting: \"an adjacent timeline\" roughly two years after Warcraft III, whose \"day they diverge is that first day of launch of WoW\" (November 2004)",
      "Aspiration only, explicitly not a plan: \"I would love to have a Caverns of Time-themed battleground\", plus Gilneas and Uldum as long-term wishes — the designers repeat that these are \"nothing to be promising\""
    ]
  },
  {
    id: "wh-sportskeeda",
    title: "Official Controller Supports, Training Mount Skill Costs - Sportskeeda Interview on WoW: Forever",
    publisher: "Wowhead (Squishei) — full summary of the Sportskeeda interview",
    date: "2026-09-18",
    url: "https://www.wowhead.com/forever/news/official-controller-supports-training-mount-skill-costs-sportskeeda-interview-on-382963",
    tier: "press",
    supports: [
      "Controller play is officially supported in Forever and framed as an accessibility option",
      "Mount training costs 100 or 1,000 gold depending on tier, with the first mount then free",
      "Blizzard will keep adding leveling content, not only level 60 content",
      "New quests were aimed at level ranges that had few options, \"a lot of level 30 to 50 zones\""
    ]
  },
  {
    id: "wh-bwt",
    title: "No Raid Attunements for Launch Raids - But Why Tho? Interview on WoW: Forever",
    publisher: "Wowhead (Squishei) — full summary of the But Why Tho? interview with Ana Resendez and Clayton Stone",
    date: "2026-09-18",
    url: "https://www.wowhead.com/forever/news/no-raid-attunements-for-launch-raids-but-why-tho-interview-on-wow-forever-382964",
    tier: "press",
    supports: [
      "\"The new raids at launch will not require attunement\"; Blizzard \"won't answer that at the moment\" for later raids",
      "Raid sizes are fixed at 10, 20 and 40 players instead of flex",
      "Difficulty never adapts: \"they don't want to automatically change the difficulty of the content or have it adapt to your level\", so groups can out-gear or out-level content",
      "Forever starts from a pre-Season-of-Discovery baseline; more SoD ideas may be brought into classes later"
    ]
  },
  {
    id: "bwt-interview",
    title: "BLIZZCON 2026: The 'World Of Warcraft: Forever' Developers Talk Balancing Old And New",
    publisher: "But Why Tho? (Mick Abrahamson); interview with Ana Resendez (Lead Software Engineer) and Clayton Stone (Associate Production Director)",
    date: "2026-09-13, updated 2026-09-16; read 2026-09-18",
    url: "https://butwhytho.net/2026/09/wow-classic-devs-world-of-warcraft-forever/",
    tier: "press",
    supports: [
      "Clayton Stone, quoted directly: \"For WoW Forever, we are starting a little bit on a more conservative side. We certainly heard feedback from players that with Season of Discovery, we pushed the envelope about as far as we could push it.\"",
      "\"I think we will certainly bring in more and more of those interesting things that we brought into Season of Discovery\" — SoD material is a later direction, not a launch feature",
      "Reading note: the opening and the design-philosophy sections were read directly; the attunement and raid-size answers sit in the later part of the same interview and are quoted on this site through Wowhead's full summary (wh-bwt), which was read end to end"
    ]
  },
  {
    id: "wh-tier-models",
    title: "Updated: Raid Tier Set Models Datamined for WoW: Forever",
    publisher: "Wowhead (Archimtiros)",
    date: "2026-09-16",
    url: "https://www.wowhead.com/forever/news/raid-tier-set-models-datamined-for-wow-forever-382938",
    tier: "datamine",
    supports: [
      "Raid set appearances datamined for all nine classes in HD and SD variants, with alternate colour versions for each class",
      "No items are attached to those appearances yet: \"We have not yet datamined any items associated with these sets\"",
      "Wowhead notes the sets are tagged \"Hyjal\" (the first 20-player raid) and expects traditional tier set bonuses",
      "Used as evidence that raid tier sets exist for every class while their stats, item levels and drop sources remain unpublished"
    ]
  },
  {
    id: "wh-talentcalc",
    title: "Forever Talent Calculator (tool)",
    publisher: "Wowhead (tool fronted by Archimtiros)",
    date: "checked 2026-09-18 (calculator updated from the BlizzCon demo on 13–14 Sep 2026)",
    url: "https://www.wowhead.com/forever/talent-calc",
    tier: "datamine",
    supports: [
      "All nine classes are present, each with three 51-point talent trees — consistent with Blizzard's statement that trees keep the Classic structure and row count",
      "Wowhead's own disclaimer on the tool page: the data \"uses information gathered from testing at Blizzcon, as well as streams from the event\" and \"will be refreshed and fully accurate once we have the beta client available to datamine\"",
      "The only publicly browsable per-class Forever talent view at this snapshot; used on our site as a planning link, never as a source for a ranking"
    ]
  },
  {
    id: "wh-issues",
    title: "WoW Forever Beta Known Issues — September 18 (Blue Tracker mirror of Blizzard's forum post)",
    publisher: "Wowhead Blue Tracker (mirror of Blizzard's forum post)",
    date: "2026-09-18",
    url: "https://www.wowhead.com/blue-tracker/topic/us/2352687",
    tier: "press",
    supports: [
      "Blizzard maintains a dated beta known-issues post; the edition mirrored here is 18 September 2026",
      "Secondary mirror of the primary list; the direct Blizzard forum entry is bnet-beta-issues",
      "Registered as a monitoring target, not used as the primary evidence for the individual issue wording"
    ]
  },
  {
    id: "iv-issues",
    title: "WoW Forever Beta Known Issues List: September 18th",
    publisher: "Icy Veins (Starym)",
    date: "2026-09-18",
    url: "https://www.icy-veins.com/wow-forever/news/wow-forever-beta-known-issues-list-september-18th/",
    tier: "guide",
    supports: [
      "Independent mirror of the same Blizzard known-issues list, confirming it is published in EU and US and re-issued as the beta progresses",
      "Used as a monitoring target only"
    ]
  },
  {
    id: "cf-tsm",
    title: "TradeSkillMaster — CurseForge addon page (distribution listing)",
    publisher: "CurseForge",
    date: "checked 2026-09-19",
    url: "https://www.curseforge.com/wow/addons/tradeskill-master",
    tier: "tooling",
    supports: [
      "Second distribution channel checked alongside Wago for a Forever-compatible TSM build",
      "Used only as a tooling-status link on the Gold page and in the Method coverage map; no game fact rests on it"
    ]
  },
  {
    id: "wh-forever-news",
    title: "Forever News and Guides (Wowhead news index)",
    publisher: "Wowhead",
    date: "checked 2026-09-18",
    url: "https://www.wowhead.com/forever/news",
    tier: "guide",
    supports: [
      "The index used to find the interview write-ups, datamines and beta posts recorded in this round",
      "At the snapshot it carried, among others: the guide compendium, Season of Discovery class quests returning, raid tier set models datamined, the Legacy system calculator, the talent calculator and the beta known-issues posts",
      "Used as evidence of what the largest Forever coverage source is publishing, never as a game fact by itself"
    ]
  },
  {
    id: "sc-coverage",
    title: "Skill Capped PvP addons and UI guide (coverage check)",
    publisher: "Skill Capped",
    date: "checked 2026-09-18",
    url: "https://www.skill-capped.com/wowarticles/general/pvp-addons-ui-guide/",
    tier: "guide",
    supports: [
      "Checked as part of the coverage audit requested by the brief: Skill Capped's PvP material found at the snapshot covers retail (Midnight) and TBC Classic — battleground UI profiles, addon set-ups and spec guides",
      "No Forever-specific PvP guide, battleground guide or tier list was found on the domain, which is recorded as a coverage gap rather than as a source of facts",
      "Not cited for any statement about Forever anywhere on this site"
    ]
  },
  /* ---- FLAGGED SOURCES: recorded so reviewers can see what we deliberately did NOT use ---- */
  {
    id: "iv-druid",
    title: "Druid Class Overview — WoW Forever",
    publisher: "Icy Veins (Meyra and Voulk)",
    date: "2026-09-15 (last updated); read 2026-09-18",
    url: "https://www.icy-veins.com/wow-forever/druid-class-overview",
    tier: "guide",
    supports: [
      "Omen of Clarity is baseline and procs from spells and heals as well as melee attacks",
      "Nature's Grasp is baseline with a 100% chance to entangle the next attacker in Entangling Roots",
      "Frenzied Regeneration heals 1% of maximum health per Rage consumed",
      "Berserk is a new 3-minute cooldown; in Cat form it doubles combo-point-generator crit chance, in Bear form it removes Mangle's cooldown and hits 3 targets; the Druid is immune to fear during Berserk",
      "Tiger's Fury is a 15% physical damage increase for 6s on a 30s cooldown and costs no energy",
      "Restoration gains Wild Growth; Swiftmend no longer consumes a heal-over-time effect",
      "Damage-over-time and heal-over-time effects can critically strike",
      "Furor reworked: power-shifting no longer nets extra energy"
    ]
  },
  {
    id: "iv-hunter",
    title: "Hunter Class Overview — WoW Forever",
    publisher: "Icy Veins (Impakt)",
    date: "2026-09-15 (last updated); read 2026-09-18",
    url: "https://www.icy-veins.com/wow-forever/hunter-class-overview",
    tier: "guide",
    supports: [
      "Traps are now usable in combat",
      "Pets scale with the hunter's stats",
      "Aimed Shot is baseline for all hunters and shares a cooldown with Multi-Shot",
      "Abilities no longer clip Auto Shot, though the hunter must still stand still to shoot",
      "Lone Wolf is an early Marksmanship talent giving 20% more damage while no pet is active",
      "Sniper Shot is the Marksmanship capstone with a 4-second cast, described as a strong burst option",
      "Survival is redesigned as a primarily melee specialization with Strider Kick, Savage Strikes and improved traps",
      "Human is a new hunter race; Icy Veins states Will to Survive breaks stuns and does not share a cooldown with the standard PvP trinket"
    ]
  },
  {
    id: "iv-mage",
    title: "Mage Class Overview — WoW Forever",
    publisher: "Icy Veins (Wrdlbrmpft)",
    date: "2026-09-13 (last updated); read 2026-09-18",
    url: "https://www.icy-veins.com/wow-forever/mage-class-overview",
    tier: "guide",
    supports: [
      "Ice Lance is an instant cast dealing 300% increased damage to frozen targets",
      "Fingers of Frost gives chill effects a 30% chance to treat the next 2 spells as if the target were frozen",
      "Shatter reaches its 50% crit bonus against frozen targets with 3 points and no longer depends on Improved Frost Nova",
      "Improved Blizzard's chill lowers movement speed by 45% for 1.5s (down from 65% / 2s in Classic)",
      "Hot Streak stacks up to 3 times, each stack cutting Pyroblast cast time by 25%",
      "Frostfire Bolt damages, slows and applies a damage-over-time effect, using whichever school the target resists less",
      "Arcane Blast stacks to 4, each stack increasing Arcane Blast damage by 175%",
      "Orc Axe Specialization is irrelevant to mages because mages cannot wield axes"
    ]
  },
  {
    id: "iv-paladin",
    title: "Paladin Class Overview — WoW Forever",
    publisher: "Icy Veins (Meyra and Mytholxgy)",
    date: "2026-09-16 (last updated); read 2026-09-18",
    url: "https://www.icy-veins.com/wow-forever/paladin-class-overview",
    tier: "guide",
    supports: [
      "Guide-side coverage of the Paladin changelist that Blizzard published in the Deep Dive recap",
      "Used only as a secondary reading link; every Paladin fact on this site is cited to Blizzard's own recap"
    ]
  },
  {
    id: "iv-priest",
    title: "Priest Class Overview — WoW Forever",
    publisher: "Icy Veins (Rainy)",
    date: "2026-09-16 (last updated); read 2026-09-18",
    url: "https://www.icy-veins.com/wow-forever/priest-class-overview",
    tier: "guide",
    supports: [
      "Fear Ward is no longer Dwarf-only and is baseline for every priest race",
      "Devouring Plague is no longer Undead-only and is available to every priest race",
      "Shadow Word: Death is a new Shadow spell",
      "Shadowform now blocks healing spells rather than Holy spells; it increases Shadow damage by 10%, halves Shadow spell mana cost, adds 100% Shadow crit damage and reduces physical damage taken by 15%",
      "Divine Spirit is learned as a normal priest spell instead of a Discipline talent",
      "Race-specific priest spells persist: Dwarf gains Chastise (a root against Humanoids) in place of Fear Ward; Human trades Desperate Prayer for Divine Grace; Undead gains Dark Sacrifice; Night Elf Elune's Grace now gives 50% dodge against melee and ranged",
      "Troll priest race spells were not confirmed from the BlizzCon demo at the time of writing",
      "Gnome Priest racial spells are Confounding Flash (an area effect that confuses up to 5 enemies) and Contingency Plan",
      "Skyborne cannot play Priest"
    ]
  },
  {
    id: "iv-rogue",
    title: "Rogue Class Overview — WoW Forever",
    publisher: "Icy Veins (Sellin)",
    date: "2026-09-15 (last updated); read 2026-09-18; spec guides read 2026-09-19",
    url: "https://www.icy-veins.com/wow-forever/rogue-class-overview",
    also: [
      "https://www.icy-veins.com/wow-forever/combat-rogue-melee-dps-pve-guide",
      "https://www.icy-veins.com/wow-forever/subtlety-rogue-melee-dps-pve-guide"
    ],
    tier: "guide",
    supports: [
      "Energy is now a continuously regenerating resource instead of ticking in pulses",
      "Restless Blades reduces the cooldowns of Adrenaline Rush, Blade Flurry, Evasion, Sprint and Vanish by 2 seconds per combo point spent",
      "Cutthroat gives Backstab a chance to make the next Ambush usable outside stealth",
      "Mutilate is added, generating two combo points and hitting harder against poisoned targets",
      "Venom is the Assassination capstone: +30% poison damage and +10% application chance, duration scaling with combo points",
      "Improved Kidney Shot increases the rogue's own damage against the target",
      "Hack and Slash gives per-weapon-type bonuses instead of forcing a weapon choice",
      "Rogues can use one-handed axes in Forever",
      "From the 17 Sep spec guides (read 2026-09-19): Combat is a two-button Sinister Strike/Eviscerate core with Kick as one of the few early interrupts and Sap/Blind arriving later; Subtlety notes energy regeneration is slow in Forever, names Human (Perception, sword crit) and Orc (stun resistance, Blood Fury) as the PvP race picks, recommends Engineering for PvP (grenades and gadgets) and First Aid bandaging after Gouge or Blind"
    ]
  },
  {
    id: "iv-shaman",
    title: "Shaman Class Overview — WoW Forever",
    publisher: "Icy Veins (Seksixeny)",
    date: "2026-09-17 (last updated); read 2026-09-18; spec guide read 2026-09-19",
    url: "https://www.icy-veins.com/wow-forever/shaman-class-overview",
    also: [
      "https://www.icy-veins.com/wow-forever/enhancement-shaman-melee-dps-pve-guide"
    ],
    tier: "guide",
    supports: [
      "Ghost Wolf's base cast time drops to 2 seconds and Improved Ghost Wolf can make it instant and usable everywhere",
      "Totemic Projection and Totemic Recall allow totems to be moved up to 30 yards; Call of the Elements drops a full set with a 3-second cast",
      "Earthbound causes Earthbind Totem to root nearby targets for 5 seconds on cast — Icy Veins calls this incredibly powerful in PvP",
      "Lava Burst is the Elemental capstone, 20% stronger against Flame Shock targets",
      "Maelstrom Weapon reduces Lightning Bolt cast time and mana cost as it stacks; Rage of the Farseer is the Enhancement capstone",
      "Riptide is the Restoration capstone and boosts Chain Heal on its target by 25%",
      "Dwarf is the Alliance shaman race; Horde Skyborne can be shaman",
      "Lightning Bolt max rank is a 2.5-second cast and Chain Lightning is 0.5s faster than Vanilla",
      "From the 17 Sep Enhancement guide (Wordup, read 2026-09-19): Maelstrom Weapon is carried forward to hybridise melee and spells; the talent tree targets Enhancement's Mana economy and ability cooldowns so Windfury Weapon can pair with Windfury Totem; more AoE via Fire Nova; Improved Ghost Wolf is usable indoors"
    ]
  },
  {
    id: "iv-warlock",
    title: "Warlock Class Overview — WoW Forever",
    publisher: "Icy Veins (Crix)",
    date: "2026-09-15 (last updated); read 2026-09-18",
    url: "https://www.icy-veins.com/wow-forever/warlock-class-overview",
    tier: "guide",
    supports: [
      "Warlock damage-over-time effects can now critically strike",
      "Demons scale with the warlock's stats and gain a Move To command with 100-yard range, which the guide calls a major improvement for positioning in PvP",
      "Bane of Agony and Bane of Doom are no longer Curses, so they stack with a separate Curse",
      "Spellstone grants 1% haste and spell power; Firestone grants 1% crit and crit damage; both are now weapon oils rather than wand-slot items",
      "Felhunter retains Spell Lock; Succubus was the strongest damage pet in the tested build; Voidwalker generated extreme threat",
      "Drain Soul's Improved Drains bonus is tripled below 20% target health",
      "Haste does not currently affect damage-over-time effects or drain channels in the tested build"
    ]
  },
  {
    id: "iv-warrior",
    title: "Warrior Class Overview — WoW Forever",
    publisher: "Icy Veins (Abide)",
    date: "2026-09-13 (last updated); read 2026-09-18",
    url: "https://www.icy-veins.com/wow-forever/warrior-class-overview",
    tier: "guide",
    supports: [
      "Recklessness, Retaliation and Shield Wall no longer share cooldowns with each other",
      "Shield Wall reduces damage taken by 60% for 12 seconds on a 15-minute cooldown; Retaliation is also 15 minutes",
      "Victory Rush restores 10% maximum health on a 30-second cooldown after a qualifying kill",
      "Thunder Clap is usable in Defensive Stance, slows enemy attack speed by 20% and hits up to 4 targets",
      "Shield Block blocks 2 attacks over 7 seconds on a 5-second cooldown",
      "Taunt has an 8-second cooldown and benefits from the new universal Hit stat",
      "Bloodthirst deals 35% attack power (down from 45%) and grants 10% movement speed",
      "Spearing Strike deals bonus damage to Giants, Dragonkin and mounted targets and forcibly dismounts mounted targets",
      "Weaponmaster merges the weapon-specific talents; Bloodthrill gives Overpower procs from Rend targets without requiring a dodge",
      "Warriors can be every race including Skyborne"
    ]
  },
  /* ---------- added in the 2026-09-19 session ---------- */
  {
    id: "ign-nordic",
    title: "'World of Warcraft Forever needs to truly be forever' — Interview",
    publisher: "IGN Nordic (Nick Nijland); interview with Michael Nuthals (Senior Game Designer) and Tim Jones (Lead Game Designer)",
    date: "2026-09-13 (published); read 2026-09-19",
    url: "https://nordic.ign.com/world-of-warcraft-forever/112801/world-of-warcraft-forever-needs-to-truly-be-forever-interview",
    tier: "press",
    note: "Reading note, recorded rather than hidden: direct retrieval of this URL returned HTTP 403 from the authoring environment on 19 September 2026 (IGN declines automated fetches), so the interview was read from the page's indexed text, which reproduces its headings and paragraphs. Every quoted passage was then cross-checked against three independent reproductions of the same article (r/classicwow, an MMORPG.com forum thread and a Spanish-language forum), which agree word for word with the indexed text, and against the Dutch edition of the interview (`also`), which carries the same horizontal-progression passage in translation. Opening the page in a browser is still outstanding and is logged as irregularity I-14 on the Method page. Second attempt, 2026-09-19 (later session): both the English and the Dutch URL again returned HTTP 403 to a direct fetch; the English page's search-engine-indexed text was re-read and matched every passage quoted on this site word for word, and confirmed the byline (Nick Nijland) and publication time (13 September 2026, 20:22 UTC). That is a second independent retrieval path, not a browser view, so the limitation stays recorded. Fourth attempt, 2026-09-19 (queue-closing pass): both the English URL and the Dutch mirror (nl.ign.com) again returned HTTP 403 to a fourth independent client (this environment's platform fetcher); four separate retrieval attempts have now been blocked identically, confirming the block is on the article itself rather than any one client. A human browser view remains the only step that can close I-14.",
    also: [
      "https://nl.ign.com/world-of-warcraft-forever/167066/world-of-warcraft-forever-moet-echt-voor-altijd-zijn-interview"
    ],
    supports: [
      "Nuthals: Forever \"really is a promise to create a 'forever' home for our Classic players\"",
      "A server-side system keeps players meeting people they have already met — the Elwynn Forest example, seeing them again \"thirty levels later in Desolace\"",
      "Items carry biome buffs and creature-type bonuses: \"you could also find a trinket that gives you extra damage against dragons or dwarves\", worth collecting early and using later in a dungeon or raid",
      "The developers' stated purpose: \"These biomes and creature types give us the opportunity to expand progression horizontally\"",
      "On power growth: \"We've now tested the extreme variations, and we're going to be very responsible with how we approach this. Tier 2 and Tier 3 raids will therefore have better gear, but we're going to be responsible about it. We still want gear from previous raids to remain useful, such as the Onslaught Girdle.\"",
      "Pre-beta class-balance statement: \"In the beta, we're going to look at class balance now that some classes have new spells, and we'll make adjustments where necessary.\"",
      "The article's own framing of the itemisation change: it \"encourages them to return to older content and switch between different pieces of gear depending on the situation\""
    ]
  },
  {
    id: "wh-ign-nordic",
    title: "New Biome Buff Gear — IGN Nordic Interview on WoW: Forever",
    publisher: "Wowhead (Squishei) — full summary of the IGN Nordic interview",
    date: "2026-09-18 (posted); read 2026-09-19",
    url: "https://www.wowhead.com/forever/news/new-biome-buff-gear-ign-nordic-interview-on-wow-forever-382936",
    tier: "press",
    note: "Read end to end on 2026-09-19, including the link out to the IGN Nordic original. Where its wording rounds off the interview's own phrasing — it says a Tier 2 raid \"will have better loot\" where IGN Nordic writes \"Tier 2 and Tier 3 raids will therefore have better gear\" — this site follows the IGN Nordic wording and says so in claim C149.",
    supports: [
      "Full summary of the IGN Nordic interview, naming Michael Nuthals (Senior Game Designer) and Tim Jones (Lead Game Designer)",
      "Horizontal progression: biome buffs on gear, creature-type damage bonuses, better loot in later tiers without extreme power growth, and older-raid gear such as the Onslaught Girdle staying useful",
      "New content: the questless kobold cave in northern Elwynn Forest, and expanded existing questlines alongside new quests",
      "Class balance: the beta is where the new spells get looked at"
    ]
  },
  {
    id: "wh-addon-api",
    title: "WoW: Forever Will Have Addon Changes from Midnight",
    publisher: "Wowhead (Squishei) — reproducing a Blizzard statement posted in the WoW UI Discord",
    date: "2026-09-16 (posted); read 2026-09-19",
    url: "https://www.wowhead.com/news/wow-forever-will-have-addon-changes-from-midnight-382921",
    tier: "press",
    note: "The original statement is a Blizzard message in the WoW UI Discord, which is not a public page this project can register or link. Wowhead is therefore cited as the outlet that reproduces it, never as its author, and the statements stay Press rather than Official.",
    supports: [
      "Blizzard, via the WoW UI Discord: Forever \"shares Mainline WoW's UI architecture, including the vast majority of APIs available in 12.1.5\"",
      "The Midnight addon disarmament changes, \"including secrets\", are active in Forever, and further UI changes can be expected in both Modern WoW and Forever",
      "The 12.1.0 AuraContainer/AuraButton changes are available in Forever as well",
      "Every Forever addon has to adapt to the new API: Classic-built addons will likely need to be remade, while current Midnight addons are expected to port more easily",
      "WeakAuras stopped development before Midnight; the article treats a Forever build as unlikely"
    ]
  },
  {
    id: "wh-kotaku",
    title: "No Summoning Stones & Mount Cost Changes — Kotaku Interview",
    publisher: "Wowhead (Squishei) — full summary of the Kotaku interview",
    date: "2026-09-16 (posted); read 2026-09-19",
    url: "https://www.wowhead.com/forever/news/no-summoning-stones-and-mount-cost-changes-kotaku-interview-382944",
    tier: "press",
    note: "Wowhead's summary links to the Kotaku interview already registered as kotaku-interview; claims that rest on it cite both ids so a reader can open either.",
    supports: [
      "Meeting Stones will not summon players; a new LFG feature is intended for listing and discovering groups, and groups make their own way to a dungeon unless a Warlock helps",
      "The mount gold cost was moved from the mount to the training",
      "\"Computational addons will be restricted\"",
      "No flex raiding: every tier keeps at least one 10-player and one 20-player option, and some tiers will have a 40-player raid"
    ]
  },
  {
    id: "wago-auctionator",
    title: "Auctionator — release list (stable channel)",
    publisher: "Wago Addons (release listing maintained by the Auctionator project)",
    date: "checked 2026-09-19 (twice, unchanged); latest release 337 published 2026-09-17",
    url: "https://addons.wago.io/addons/auctionator/versions?stability=stable",
    tier: "tooling",
    note: "Evidence about a piece of software, not about the game: the listing shows which game versions a build declares. Recorded because it is the first auction-house tool this project has verified as Forever-capable, which is a gold-making fact of the tooling kind.",
    supports: [
      "Auctionator release 337 (17 Sep 2026) declares \"Supported Classic Forever patch1.60.1\" alongside Retail 12.1.0, MoP 5.5.4, Wrath 3.80.0, TBC 2.5.6 and Classic Era 1.15.8/1.15.9",
      "The two releases before it (336 of 13 Sep and 335 of 24 Aug 2026) list Classic Era but no Forever entry, so the Forever line appears with release 337"
    ]
  },
  {
    id: "wago-questie",
    title: "Questie — release list (stable channel)",
    publisher: "Wago Addons (release listing maintained by the Questie project)",
    date: "checked 2026-09-19 (twice, unchanged); latest release v11.38.0 published 2026-09-15",
    url: "https://addons.wago.io/addons/questie/versions?stability=stable",
    tier: "tooling",
    supports: [
      "The ten most recent Questie releases listed (10 Aug – 15 Sep 2026) declare Mists of Pandaria 5.5.4, Wrath 3.80.2, Burning Crusade 2.5.6 and Classic Era 1.15.9",
      "No Forever (1.60.x) build is listed, so quest routing over the new Forever zones is uncovered by Questie as of this check"
    ]
  },
  {
    id: "cf-details",
    title: "Details! Damage Meter — file list",
    publisher: "CurseForge (release listing maintained by the Details! project)",
    date: "checked 2026-09-19 (twice, unchanged); newest file listed 2026-09-18",
    url: "https://www.curseforge.com/wow/addons/details/files",
    tier: "tooling",
    supports: [
      "The newest Details! file (listed 18 Sep 2026) is tagged with the 12.1.0 and MoP Classic families",
      "The project's game-version filter offers 12.1.0 through 2.5.x, 1.15.x, 1.14.x and 1.13.x — no 1.60.x",
      "Recorded consequence for PvP and gold work: combat-log parsers have not been ported, so the in-game damage meter is the supported measurement path for now"
    ]
  },
  {
    id: "wh-bt-midnight-tuning",
    title: "Class Tuning Incoming — September 22 (patch 12.1.0)",
    publisher: "Wowhead Blue Tracker (mirror of a Blizzard forum post)",
    date: "2026-09-18 (posted); read 2026-09-19",
    url: "https://www.wowhead.com/blue-tracker/topic/us/2354340",
    tier: "press",
    note: "Registered as an accuracy guard rather than as Forever news. The post appears in the same blue-tracker feed as the Forever beta posts, but it is tagged Patch 12.1.0 and its text is about modern WoW's Mythic+, raid and PvP tuning. A future session must not file it as Forever class tuning.",
    supports: [
      "Blizzard posted a class-tuning announcement for 22 September 2026 that belongs to patch 12.1.0 (Midnight), not to Forever",
      "That blue-tracker feed mixes Forever topics (beta known issues, beta access problems) with modern-WoW topics, so an entry appearing there is not Forever evidence by default"
    ]
  },
  {
    id: "flag-rmt-tierlists",
    title: "Gold/boosting-site 'tier lists' and 'BiS lists' for Forever (multiple domains)",
    publisher: "expcarry.com, ssegold.com, boostroom.com, frostyboost.com, skycoach.gg, lfcarry.com, conquestcapped.com and similar",
    date: "2026-09-14 to 2026-09-18",
    url: "method.html#irregularities",
    tier: "community",
    note: "No direct link is published for this entry: we do not send readers to boosting or gold-selling services. The finding is documented in full on the Method page.",
    supports: [
      "These pages publish confident PvP tier lists, BiS lists and honor numbers for a game whose beta is capped at level 20 and whose level-60 database does not exist",
      "Several mix real, well-sourced facts with invented rankings, and many sell boosting or gold services",
      "FLAGGED: never cited as authority anywhere on this site; see Method → Irregularities"
    ]
  },
  {
    id: "flag-unofficial-wikis",
    title: "Unofficial 'WoW Forever' guide domains and beta 'tracker' sites",
    publisher: "world-of-warcraft-forever.wiki, wowforeverbuilds.com, wowforeverguides.com, foreverwisp.com, wowdata.app, wowforevertalents.com and similar",
    date: "checked 2026-09-18; re-checked 2026-09-19",
    url: "method.html#irregularities",
    tier: "community",
    note: "No direct link is published for this entry; the finding is documented on the Method page.",
    supports: [
      "Some pages state 'not published yet' honestly; others describe an 'arena strategy' for a game with no announced arenas",
      "Re-checked 2026-09-19: the family now includes beta-client 'tracker' sites that publish specific numbers - a Darkspear Islands level 30-60 range joining the random battleground pool, 'Hyjal Crater' and 'Mak'gora Arena' queues, a 15,000 Honor Points cap, PvP set piece counts - none of it corroborated by an established outlet, and one 'Battle for Gilneas (rated)' string that contradicts the developer statement that there is no rated PvP (C021)",
      "FLAGGED: not used as sources. Where they point at a primary source we follow the primary source instead"
    ]
  },
  {
    id: "wh-skyborne",
    title: "Skyborne Race Overview: Racials and Customization — WoW: Forever",
    publisher: "Wowhead (guide by Nodge)",
    date: "2026-09-17",
    url: "https://www.wowhead.com/forever/guide/skyborne-race-overview",
    tier: "guide",
    supports: [
      "Skyborne can be played as Alliance or Horde",
      "Six playable classes: Warrior, Hunter, Rogue, Druid (both factions), Shaman (Horde only), Mage (Alliance only)",
      "Skyborne racials: Walk on Air (10s glide), Wind Blessed (+1% haste spell/melee/ranged), Elemental Insight (+5% damage to Elementals), and a faction-specific active — Skysight (Horde, +10% move/mounted speed) or Read Ley Line (Alliance, +100% health/mana regen)",
      "Skyborne racial mounts are Galestriders (level 40 and level 60 variants)"
    ]
  },
  {
    id: "wh-camping",
    title: "Camping Overview in Forever — Buffs, Vendors and Rewards",
    publisher: "Wowhead (guide by Serenal)",
    date: "2026-09-18",
    url: "https://www.wowhead.com/forever/guide/camping-overview-unlock-rewards",
    tier: "guide",
    supports: [
      "Camping is a new crafting system, not a profession; it sits alongside professions",
      "Around level 5 a quest 'The Great Outdoors' starts the system; training Cooking lets you craft a Basic Campfire",
      "Each profession contributes a three-tier campsite object — for example Blacksmithing's Sharpening Wheel (+Strength), Enchanting's Enchanted Lute (+Armor, All Stats, Resistances), Skinning's Camp Chair (+2% Crit), Fishing's bowl (+8% stats), Herbalism's Incense Candle (+Intellect), Mining's Lodestone (+melee Attack Power), Tailoring's Faction Banner (+Spirit), Leatherworking's Camp Tent (Rested XP)",
      "Camp tiers unlock with camp level"
    ]
  },
  {
    id: "iv-human",
    title: "Human Race Guide for WoW Forever",
    publisher: "Icy Veins (guide by Abide)",
    date: "2026-09-17",
    url: "https://www.icy-veins.com/wow-forever/human-race-guide",
    tier: "guide",
    supports: [
      "Human racials: Will to Survive (active removes all stuns, 3m CD), Perception (active increases stealth detection for 20s, 3m CD), Sword Specialization (passive increases spell and ability crit by 2% with 1H/2H swords), The Human Spirit (passive +5% spirit)",
      "Human Priest racials: Divine Grace (active heals friendly <50% and clears Weakened Soul, 10m CD), Feedback (active burns mana and deals shadow damage on spell cast against priest, 15s, 3m CD)",
      "Diplomacy and Mace Specialization removed from Humans",
      "Hunters added as a new playable Human class"
    ]
  },
  {
    id: "iv-dwarf",
    title: "Dwarf Race Guide for WoW Forever",
    publisher: "Icy Veins (guide by Abide)",
    date: "2026-09-17",
    url: "https://www.icy-veins.com/wow-forever/dwarf-race-guide",
    tier: "guide",
    supports: [
      "Dwarf racials: Stoneform (active removes and grants immunity to Bleed, Poison, Disease, and reduces physical damage taken by 10% for 8s, 3m CD), Find Treasure (active, operates alongside other tracking), Mace Specialization (passive +1% crit with 1H/2H maces), Big Game Hunter (passive +5% damage to Beasts)",
      "Dwarf Priest racials: Chastise (active holy damage and immobilizes Humanoids for up to 2s, 2m CD), Desperate Prayer (active large instant self-heal, 10m CD); Fear Ward removed from race and made baseline for all Priests",
      "Gun Specialization and Frost Resistance removed from Dwarves",
      "Shamans added as a new playable Dwarf class"
    ]
  },
  {
    id: "iv-night-elf",
    title: "Night Elf Race Guide for WoW Forever",
    publisher: "Icy Veins (guide by Abide)",
    date: "2026-09-17",
    url: "https://www.icy-veins.com/wow-forever/night-elf-race-guide",
    tier: "guide",
    supports: [
      "Night Elf racials: Elune's Light (active +10% crit chance with all spells and attacks for 15s, 3m CD), Shadowmeld (active stealth, usable in combat to drop enemy priority, 2m CD, grants Rogues stealth opener), Quickness (passive +1% dodge and +2% run speed), Wisp Spirit (passive +75% movement speed while dead)",
      "Night Elf Priest racials: Elune's Grace (active -50% chance hit by melee/ranged attacks for 15s or 3 misses, 5m CD), Starshards (active arcane DoT over 6s, 30s CD)",
      "Nature Resistance removed from Night Elves"
    ]
  },
  {
    id: "iv-gnome",
    title: "Gnome Race Guide for WoW Forever",
    publisher: "Icy Veins (guide by Abide)",
    date: "2026-09-17",
    url: "https://www.icy-veins.com/wow-forever/gnome-race-guide",
    tier: "guide",
    supports: [
      "Gnome racials: Escape Artist (active removes movement-impairing effects and grants 3s immunity, 2m CD), Eureka (active next 3 damaging or healing abilities cost 50% less and deal/heal 10% more, 2m CD), Expansive Mind (passive +5% maximum Mana, Rage, or Energy), Engineering Specialization (passive Engineering devices more reliable)",
      "Gnome Priest racials: Confounding Flash (active confuses up to 5 enemies within 8 yards for 3s, breaks on damage, 2m CD), Contingency Plan (active holy ward procs below 35% health for absorb shield and HoT, 10m CD)",
      "Arcane Resistance removed from Gnomes",
      "Priests added as a new playable Gnome class"
    ]
  },
  {
    id: "iv-orc",
    title: "Orc Race Guide for WoW Forever",
    publisher: "Icy Veins (guide by Abide)",
    date: "2026-09-17",
    url: "https://www.icy-veins.com/wow-forever/orc-race-guide",
    tier: "guide",
    supports: [
      "Orc racials: Blood Fury (active +10% Attack Power and Spell Power for 15s, no healing reduction penalty, 2m CD), Shatter Curse (active removes and grants immunity to Curses and Banes, -15% magical damage taken for 8s, 3m CD), Axe Specialization (passive +1% crit with 1H/2H axes), Hardiness (passive reduces Stun duration by 20%)",
      "Command removed from Orcs",
      "Mages added as a new playable Orc class"
    ]
  },
  {
    id: "iv-undead",
    title: "Undead Race Guide for WoW Forever",
    publisher: "Icy Veins (guide by Abide)",
    date: "2026-09-17",
    url: "https://www.icy-veins.com/wow-forever/undead-race-guide",
    tier: "guide",
    supports: [
      "Undead racials: Will of the Forsaken (active removes Charm, Fear, Sleep, 2m CD, no lingering immunity), Cannibalize (active restores 7% health and mana every 2s for 10s up to 35% each from corpse, 2m CD), Underwater Breathing (passive 300% longer breath), Touch of the Grave (passive 5% proc chance to drain health up to 5% max HP)",
      "Undead Priest racials: Dark Sacrifice (active sacrifice health over 15s to restore mana, 10m CD), Touch of Weakness (active shadow damage and melee AP reduction to attacker, no CD)",
      "Shadow Resistance removed from Undead",
      "Paladins added as a new playable Undead class"
    ]
  },
  {
    id: "iv-troll",
    title: "Troll Race Guide for WoW Forever",
    publisher: "Icy Veins (guide by Abide)",
    date: "2026-09-17",
    url: "https://www.icy-veins.com/wow-forever/troll-race-guide",
    tier: "guide",
    supports: [
      "Troll racials: Berserking (active +10% attack and casting speed for 10s, fixed value, 3m CD), Rapid Regeneration (active channeled 50% max HP restore over 6s, cancels on movement/action/damage, 3m CD), Beast Slaying (passive +5% damage to Beasts), Regeneration (passive +10% health regen, 10% continues in combat)",
      "Troll Priest racials: Hex of Weakness (active reduces melee AP and -20% healing received for 2m, no CD), Shadowguard (active 3-charge shadow damage retaliation, 10m, no CD)",
      "Bow Specialization and Throwing Specialization removed from Trolls",
      "Warlocks added as a new playable Troll class"
    ]
  },
  {
    id: "wh-overview",
    title: "World of Warcraft: Forever Overview - New Features, Zones, Raids",
    publisher: "Wowhead (guide by Nodge)",
    date: "2026-09-17",
    url: "https://www.wowhead.com/forever/guide/overview-features-zones-raids",
    tier: "guide",
    supports: [
      "Forever overview: permanent level 60 cap, 4 new zones (Mount Hyjal, Shen'Dralas, Riverglades, Zephras Isle), 9 new dungeons, 2 new raids plus returning Onyxia",
      "Darkspear Islands is a new 15v15 battleground structured similarly to Eye of the Storm with interactable capture points",
      "Optional transmog system where players can disable transmog entirely and view base models",
      "New loading screens for Kalimdor, Eastern Kingdoms, Zephras Isle, Dalaran, Old Ironforge, Excavation Site, Ruins of Lordaeron, Darkspear Islands"
    ]
  },
  {
    id: "wh-zones",
    title: "Forever Zones Overview - New & Updated Zones",
    publisher: "Wowhead (guide by Serenal)",
    date: "2026-09-17",
    url: "https://www.wowhead.com/forever/guide/zones-maps-locations-rewards",
    tier: "guide",
    supports: [
      "Mount Hyjal: level 60 endgame zone set in the aftermath of Archimonde's defeat, home to Hyjal Summit raid",
      "Shen'Dralas: adventure zone located between Mulgore and Desolace, sending players to Razorfen Downs and Maraudon",
      "Riverglades: level 35-45 frontier zone with grasslands, rivers, and trade routes, reached by Steamwheedle boat to Powderfuse Port",
      "Zephras Isle: level 1-12 starting zone for Skyborne elves in Skywall plane"
    ]
  },
  {
    id: "wh-raids",
    title: "Forever Raids Overview - Locations, Bosses and Guides",
    publisher: "Wowhead (guide by Serenal)",
    date: "2026-09-13",
    url: "https://www.wowhead.com/forever/guide/raids-overview-hub-dates-locations",
    tier: "guide",
    supports: [
      "Hyjal Summit is a 20-player raid in Mount Hyjal opening December 9, 2026",
      "The Barrow Deeps is a 10-player raid in Mount Hyjal with 3 entrances located throughout the world, opening December 9, 2026",
      "Onyxia's Lair returns as a 40-player raid in Dustwallow Marsh on December 9, 2026"
    ]
  },
  {
    id: "wh-druid-feral",
    title: "Feral Tank Druid Overview Guide - Forever",
    publisher: "Wowhead (guide by L0uki)",
    date: "2026-09-18",
    url: "https://www.wowhead.com/forever/guide/classes/druid/feral/overview-pve-tank",
    tier: "guide",
    supports: [
      "Feral shapeshift forms (Bear and Cat Form) now support consumable usage while shapeshifted",
      "Feral shapeshift abilities now scale with weapon damage",
      "Furor functionality reworked for cat form while retaining bear form generation; power shifting fundamentally altered",
      "Leader of the Pack moved to 21 talent points and affects both melee and spell crit",
      "Entangling Roots can now be cast indoors; Nature's Grasp can be cast while shapeshifted",
      "Feral tank toolkit additions: Mangle, Lacerate (threat bleed stacking up to 5 times), Berserk (breaks/immunes fear), Natural Reaction"
    ]
  },
  {
    id: "wh-paladin-prot",
    title: "Protection Paladin Overview Guide - Forever",
    publisher: "Wowhead (guide by Riyani)",
    date: "2026-09-18",
    url: "https://www.wowhead.com/forever/guide/classes/paladin/protection/overview-pve-tank",
    tier: "guide",
    also: [
      "https://www.wowhead.com/forever/guide/classes/paladin/protection/abilities-pve-tank"
    ],
    supports: [
      "Judgement unleashed with Seal of Fury taunts the target to attack the Paladin for 4 seconds",
      "Templar's Bulwark gives 100% max health absorb for 8 seconds and triggers Forbearance",
      "Holy Strike is an instant normalized attack dealing 42% weapon damage plus Holy damage",
      "Consecration rebalanced: base ground damage with increased spell power bonus on the first 4 enemies",
      "Holy Shield has no charge limit (20% block chance for 10 seconds, dealing Holy damage on block)"
    ]
  },
  {
    id: "wh-season1-tiersets",
    title: "Forever Tier Set Overview for Season 1 - Appearances and Bonuses",
    publisher: "Wowhead (guide by Serenal)",
    date: "2026-09-17",
    url: "https://www.wowhead.com/forever/guide/season-1-tier-set-bonus-appearance-overview",
    tier: "guide",
    supports: [
      "Datamined Season 1 raid tier sets feature 5-piece bonus structures across specs (2-piece, 3-piece, 4-piece, and 5-piece bonuses)",
      "Bonuses target specific spell interactions such as Nature's Grasp/Barkskin/Hibernate for Druid, Frost/Freezing Trap for Hunter, Counterspell/Frostfire Bolt for Mage",
      "HD and SD visual toggle applies to tier armor appearances"
    ]
  },
  {
    id: "wh-legacy-guide",
    title: "Legacy System Overview for Forever — Earning, Rewards, and Trees",
    publisher: "Wowhead (guide by Nodge)",
    date: "2026-09-17",
    url: "https://www.wowhead.com/forever/guide/legacy-system-overview-rewards",
    tier: "guide",
    supports: [
      "Account-wide progression system rewarding perks and cosmetic rewards for completing challenges",
      "Milestone rewards: level 15 Replica Ironforge Air Rifle, level 25 Spectral Bear Cub, level 40 Spectral Bear Tabard, level 55 Reins of the Spectral Bear (epic mount, 100% speed)",
      "Challenge categories include Classes, Tradeskills, Player vs. Player, and Adventure",
      "Perks are account-bound across all characters"
    ]
  },
  {
    id: "wh-mounts",
    title: "All Mounts in World of Warcraft: Forever - Models and Locations",
    publisher: "Wowhead (guide by Nodge)",
    date: "2026-09-18",
    url: "https://www.wowhead.com/forever/guide/collections/mounts-locations-appearances",
    tier: "guide",
    supports: [
      "Forsaken Paladin class mounts: Summon Warhorse and Summon Forsaken Charger via dedicated questline",
      "Skyborne racial mounts: Galestriders (Empyrean, Regal, Stormy, Umber and Swift variants) sold by reputation vendor",
      "Legacy Progress Track milestone reward: Reins of the Spectral Bear at 55 Legacy Points",
      "Store edition mounts: Cerulean Prideclaw (all packs), Veteran Adventurer's Loyal Companion (Epic/Collection)"
    ]
  },
  {
    id: "wh-pets",
    title: "All Companions in World of Warcraft: Forever - Models and Locations",
    publisher: "Wowhead (guide by Jurdi)",
    date: "2026-09-17",
    url: "https://www.wowhead.com/forever/guide/collections/pets-locations-sources",
    tier: "guide",
    supports: [
      "Vanity companion pets in Forever: Zergling Leash, Panda Collar, Diablo Stone, Pachimari from Epic/Collection packs",
      "All companions are purely cosmetic non-combat collector items"
    ]
  },

  /* ---------- added in the 2026-09-19 second pass (live web verification) ---------- */
  {
    id: "wh-ellis-beta",
    title: "Behind the Scenes of the WoW: Forever Beta Issues - Tom Ellis Explains on X",
    publisher: "Wowhead (Squishei), quoting Senior Game Producer Tom Ellis",
    date: "2026-09-19",
    url: "https://www.wowhead.com/forever/news/behind-the-scenes-of-the-wow-forever-beta-issues-tom-ellis-explains-on-x-382993",
    tier: "press",
    supports: [
      "The beta runs on the smaller BETA/PTR environment stack, not a production stack, because WoW betas are not usually large traffic events",
      "Day-one disconnects after the login queue were traced to the Battle.net Game Service metering system: one regional realm with two connections distorted its load math, and scaling two connections to eight fixed it",
      "Slow looting and quest acceptance were database statistics failing to keep up with new tables and heavy inserts; a manual table analysis plus automated jobs cleared the delays immediately",
      "A restart was required because WORLD pools ran hot and approached out-of-memory: empty maps were not being shut down correctly; the fix passed QA, extra WORLDs were added and the regional service was given a second instance",
      "Ellis's summary after the fixes: things were incredibly smooth for the first few hours of a public beta"
    ]
  },
  {
    id: "wh-phasing",
    title: "New Phasing Notification in WoW: Forever - Changing Phases Safely",
    publisher: "Wowhead (Squishei)",
    date: "2026-09-19",
    url: "https://www.wowhead.com/forever/news/new-phasing-notification-in-wow-forever-changing-phases-safely-382994",
    tier: "guide",
    supports: [
      "Forever adds a notification when a forced phase change (a zone refresh) is about to occur, giving players 5 minutes to reach a safe location",
      "A Refresh Now button triggers the phase early once the player is safe; Okay hides the notification and a chat-box arrow tracks the remaining time",
      "Wowhead reports the technology was revealed at BlizzCon as created with Hardcore players in mind, since a forced phase at the wrong time might mean certain death; all players can use Refresh",
      "Wowhead's framing of what a new phase can contain: mobs alive again and immediately aggroed, quest mobs or pickups despawned, or new herb and mining nodes appearing"
    ]
  },
  {
    id: "wh-bags",
    title: "Grab Free Bags in Beginner Zones with Quests",
    publisher: "Wowhead (Jurdi)",
    date: "2026-09-18",
    url: "https://www.wowhead.com/forever/news/grab-free-bags-in-beginner-zones-with-quests-382982",
    tier: "guide",
    supports: [
      "A new quest around level 3-4 in Dun Morogh (Grund and Gozwin: down a Snow Leopard Prowler, recover Gozwin's Mechanic's Log) rewards an early bind-on-pickup 6-slot bag",
      "The known quest Carry Your Weight also rewards one; Wowhead expects each starting zone to have its own version",
      "In Forever, bags automatically go into bag slots when an empty slot is available",
      "Seven 6-slot quest bags are listed from the beta database (Collecting Basket, Book Bag, Soft Saber Sack, Simple Leather Satchel, Scorched Leather Pouch, Handmade Leather Bag, Canvas Latchbag), item level 5-6, all bind-on-pickup"
    ]
  },
  {
    id: "wh-openworld",
    title: "What We Know About the Open World So Far in WoW: Forever",
    publisher: "Wowhead (Jurdi)",
    date: "2026-09-19",
    url: "https://www.wowhead.com/forever/news/what-we-know-about-the-open-world-so-far-in-wow-forever-382931",
    tier: "guide",
    supports: [
      "All starting zones get new NPCs, quests and experiences alongside the original content (attributed to Lead Content Designer Evan Lee, Found Photos panel); Desolace and the Wetlands received major quest additions",
      "Three ports: Stormwind Harbor (Auberdine/Wetlands to Stormwind), Southshore's dock as a stop between Menethil Harbor and Auberdine, and a Steamwheedle Port boat to Riverglades",
      "Riverglades targets the mid-30s to early-40s leveling drought and also has a second access point: a new travel point in Redridge through an entrance in the Burning Steppes; the zone is inhabited by Ogres and the Twilight's Hammer",
      "Zephras Isle serves levels 1-12, after which Skyborne characters join their faction's level 10-20 zones",
      "Camping profession objects imitate class buffs (Blacksmithing Sharpening Wheel = Strength, Tailoring Faction Banner = Spirit, Herbalism Incense Candle = Intellect, Fishing Fish Bowl = all stats), consistent with the Camping guide",
      "Cooking gains a new Well Fed buff type that grants +5% Experience - a second guide source for the number Blizzard describes only as a small XP bonus"
    ]
  },
  {
    id: "iv-changelog",
    title: "WoW Forever Changelog (Icy Veins)",
    publisher: "Icy Veins",
    date: "2026-09-19 (site last updated 2026-09-19)",
    url: "https://www.icy-veins.com/wow-forever/changelog",
    tier: "guide",
    supports: [
      "17-18 September: Icy Veins added its first per-spec Forever beta guides - Elemental, Enhancement and Restoration Shaman; Assassination, Combat and Subtlety Rogue; Affliction, Demonology and Destruction Warlock; Arms, Fury and Protection Warrior; Balance Druid, Feral Druid and Restoration Druid; Holy, Protection and Retribution Paladin; Frost Mage; Beast Mastery Hunter - all scoped to the level-20 beta cap and written for PvE",
      "18 September: a Name Reservation guide was added (Blizzard's own dates for that window are already ledgered as C162/C163)",
      "16 September: a Tier List Directory was added (see iv-tierlists); 15 September: an all-class-guides index page and the remaining race guides"
    ]
  },
  {
    id: "iv-tierlists",
    title: "Tier Lists for WoW Forever - directory",
    publisher: "Icy Veins (Petko)",
    date: "2026-09-16 (added); read 2026-09-19",
    url: "https://www.icy-veins.com/wow-forever/tier-list-hub",
    tier: "guide",
    supports: [
      "Icy Veins created a Forever tier-list directory on 16 September 2026; as of 19 September every list on it is marked COMING SOON, including the DPS and Healer PvP tier lists and all three raiding lists (DPS, Tank, Healer)",
      "The page carries Icy Veins' own disclaimer that its tier lists are not final and differences in opinion may be had",
      "Used as dated evidence that no reputable guide site has published a Forever PvP class ranking yet"
    ]
  },
  {
    id: "wh-forsaken-mounts",
    title: "New Forsaken Paladin Mounts Datamined from Forever Beta Client",
    publisher: "Wowhead (datamine) — Jezartroz",
    date: "2026-09-16 (posted); read 2026-09-19",
    url: "https://www.wowhead.com/forever/news/new-forsaken-paladin-mounts-datamined-from-forever-beta-client-382940",
    tier: "datamine",
    note: "Read 2026-09-19. A short datamine post: the substance is the pair of datamined mount-model screenshots plus the note that the Forever beta client data had become available for datamining. Comment timestamps place publication on 16 September 2026.",
    supports: [
      "The WoW: Forever beta client data became available for datamining, and the first Forsaken Paladin mount models were found in it",
      "Screenshots of the Forsaken Paladin mounts (an armored skeletal charger in the Paladin style) published under a spoiler warning"
    ]
  },
  {
    id: "iv-mounts-datamine",
    title: "WoW Forever Just Revealed Its First Wave of Mounts (Spoiler Warning)",
    publisher: "Icy Veins (datamine) — Neryssa",
    date: "2026-09-16 (posted); read 2026-09-19",
    url: "https://www.icy-veins.com/wow-forever/news/wow-forever-just-revealed-its-first-wave-of-mounts-spoiler-warning/",
    tier: "datamine",
    note: "Read end to end 2026-09-19. Independently corroborates the Wowhead mounts datamine from the same day and adds the speed-tier detail for the Skyborne racial mounts. Names and availability are beta data and may change.",
    supports: [
      "Forsaken Charger is the racial mount for Undead Paladins, one of the first new model iterations in the client",
      "Skyborne racial mounts are the Galestriders: unarmored 60% speed versions unlocked at level 40, armored 100% versions at level 60",
      "Retail-later recolors present in the client: Venomhide Ravasaur (Cataclysm), Striped Dawnsaber, Ochre Skeletal Warhorse, White Kodo and Black Skeletal Horse (Wrath of the Lich King)",
      "Models that existed in the files but were never made obtainable: Golden Sabercat, Dark Skeletal Horse, Lavender Kodo; plus the new Pack Kodo",
      "Cerulean Prideclaw confirmed as the pre-order edition mount and Spectral Bear as a Legacy system reward"
    ]
  },
  {
    id: "wh-reputations",
    title: "New Reputation Names Datamined for WoW: Forever",
    publisher: "Wowhead (datamine) — Jezartroz",
    date: "2026-09-16 (posted); read 2026-09-19",
    url: "https://www.wowhead.com/forever/news/new-reputation-names-datamined-for-wow-forever-382945",
    tier: "datamine",
    note: "Read end to end 2026-09-19, including every faction description. Three names appear without a NEW flag and are treated here as returning records, not new factions.",
    supports: [
      "14 new faction records in the beta client: Cenarion Scouts, Kirin Tor, Barkskin Burrow, Nightclaw Druids, Guardians of Hyjal, Windshapers, High Order, Bolder'ok Clan, Earthen Ring, Darkspear Raiders, Theramore Expeditionary Force, The Watchers, Brotherhood of the Horse and Powderfuse",
      "The two battleground reputations describe each other: the Darkspear Raiders battle the Theramore Expeditionary Force for the Darkspear Islands, and vice versa",
      "Guardians of Hyjal is a Cenarion Circle splinter charged with Mount Hyjal's protection — the same faction the Season 1 tier-set guide names as the gate for equipping a second crafted tier piece",
      "Windshapers, High Order and Powderfuse corroborate names already in Blizzard's Found Photos recap (Windshapers, High Order, Powderfuse Port)",
      "Three names appear without a NEW flag: Timbermaw Hold, Ravasaur Trainers, Shen'dralar",
      "Wowhead's own caveat: 'all datamined information may change before actual launch. None of these names are final until we see them in the released client, and not all reputations may be present when we finally enter the game'"
    ]
  },
  {
    id: "wh-setbonuses",
    title: "New and Updated Gear Set Bonuses in WoW: Forever",
    publisher: "Wowhead (datamine) — Archimtiros",
    date: "2026-09-16/17 (posted); read 2026-09-19",
    url: "https://www.wowhead.com/forever/news/new-and-updated-gear-set-bonuses-in-wow-forever-382958",
    tier: "datamine",
    note: "Read 2026-09-19 across the full article (General Sets, Dungeon Sets, Raid Tier Sets, New Sets, PvP Sets). Wowhead's own caveats are carried verbatim in the claims that cite it. Set bonuses live in spell data, not per-item drop data, so this datamine does not contradict the statement that item stats stay hidden until a drop occurs (see irregularity I-20).",
    supports: [
      "Hundreds of gear set bonuses datamined from the beta client, covering reworked existing sets and brand-new raid tier",
      "General/crafted sets reworked with effects replacing flat stats: The Gladiator gains fear resist, attack power, a Roar of the Crowd effect and set-wide crit; The Postmaster, Cadaverous Garb, Necropile Raiment, Bloodmail Regalia and Deathbone Guardian all carry NEW/REMOVED bonus changes",
      "New Tier-1-style raid sets per class and spec with 2/3/4/5-piece bonuses, e.g. Raiments of Conviction (Priest, Shadow), Grimstitch Armor (Rogue), The Spiritcaller and its spec variants (Shaman), Demonheart Raiment (Warlock), Battlegear/Battleplate of Glory (Warrior)",
      "Creature-type bonuses appear on tier sets: attack power versus Humanoids, spell damage versus Demons, Elementals or Undead — matching the biome/creature-type itemisation design",
      "Classic PvP rank sets present under the Champion's, Lieutenant Commander's, Field Marshal's and Warlord's names with changed bonuses (2-piece Parry replaced by Attack Power 40 or Agility 20; 6-piece Stamina 15 to 20; hybrid healing/spell damage 44/15) and effect bonuses (Gouge, Blink, Psychic Scream); several sets renamed (Lieutenant Commander's Arcanum to Champion's Regalia; Investiture to Champion's Raiment; Lieutenant Commander's Refuge removed)",
      "Wowhead's own caveats: the datamine 'may not be reflective of what reaches live servers', and 'some effects from Season of Discovery have also appeared in our datamining, though we have taken care to filter them out of this article to the best of our ability'"
    ]
  }
];

/* Convenience index used by pages to render a source link by id. */
window.WOWF_SOURCE_INDEX = (function () {
  var out = {};
  window.WOWF_SOURCES.forEach(function (s) { out[s.id] = s; });
  return out;
})();
