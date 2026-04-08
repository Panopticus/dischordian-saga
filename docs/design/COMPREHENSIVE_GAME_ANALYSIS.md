# DISCHORDIAN SAGA — COMPREHENSIVE GAME ANALYSIS
### Quality Assurance, Monetization & Narrative Design Review
**Date:** April 8, 2026 | **Reviewer:** Game Design, QE & Monetization Audit

---

## TABLE OF CONTENTS
1. [Executive Summary](#executive-summary)
2. [Narrative Pacing & Onboarding](#narrative-pacing--onboarding)
3. [Feature Discovery Paths](#feature-discovery-paths)
4. [The Living Ark & Living Universe](#the-living-ark--living-universe)
5. [Interconnected World Systems](#interconnected-world-systems)
6. [Monetization & Economy Health](#monetization--economy-health)
7. [Technical Implementation Status — Every System](#technical-implementation-status)
8. [Systems Needing Development Work](#systems-needing-development-work)
9. [Architect's Console — Admin & Testing Requirements](#architects-console-requirements)
10. [Priority Roadmap](#priority-roadmap)

---

## 1. EXECUTIVE SUMMARY

**Scale:** ~228,000 lines of TypeScript across 600+ files. 111 database tables, 58 server routers, 50+ client pages, 4 WebSocket servers, Stripe payment integration, full OAuth auth.

**Overall Assessment:** This is a production-grade game with extraordinary design ambition. The narrative architecture, economy design, and system breadth rival AAA live-service titles. However, there is a critical gap between **what is designed** and **what is wired end-to-end**. Approximately 6 major game systems are fully functional (client ↔ server ↔ database), 8 are partially wired (40-70%), and 12 are design-only with zero server integration. The game's soul — the morality choice system, living universe events, and prestige system — exists as beautifully designed shared logic that no server endpoint ever calls.

**The Good:** Onboarding is cinematic and immersive. The economy is ethically designed with no pay-to-win. The narrative ambition (7-act branching story, asymmetric NPC knowledge, emergent world events) is genuinely exceptional. The Degen's Casino is a masterclass in narrative-gated feature revelation.

**The Urgent:** The morality system has no endpoint to record choices. The living universe events have no database table and no trigger mechanism. The prestige system can't execute. The graduate legion army system doesn't exist. These are the features that make the world feel alive and interconnected — and they're the ones not wired.

---

## 2. NARRATIVE PACING & ONBOARDING

### 2.1 The Awakening (Minutes 0-2) — EXCELLENT

The opening is a masterclass in immersive onboarding. The player wakes in a cryo pod, guided by Elara's voice-over audio. Character creation happens *inside the fiction*:

1. **BLACKOUT** → Pod cinematic
2. **CRYO_OPEN** → Elara introduces herself (VO: `elara_vo_cryo_open`)
3. **SPECIES_QUESTION** → Choose DeMagi/Quarchon/Ne-Yon with lore flavor
4. **CLASS_QUESTION** → Engineer/Oracle/Assassin/Soldier/Spy
5. **ALIGNMENT_QUESTION** → Order vs Chaos (morality seed planted)
6. **ELEMENT_QUESTION** → Elemental affinity
7. **NAME_INPUT** → Name your character
8. **ATTRIBUTES** → Distribute 9 points across Attack/Defense/Vitality
9. **FIRST_STEPS** → Closing narrative
10. **COMPLETE** → Transition to QUARTERS_UNLOCKED phase

Typewriter effect at 30ms/char. Skippable text. VO audio preloaded to prevent download stalls. An `AwakeningJournalEntry` auto-generates a first-person narrative of all choices made — the player's first piece of lore is *about themselves*. This is outstanding.

**Assessment:** 9/10. The only gap is that alignment choice here should plant visible narrative seeds ("Order... interesting. The Architect would approve.") that pay off later. Currently the choice is made but the narrative echo is thin.

### 2.2 First Exploration (Minutes 2-10) — GOOD

The `TutorialOrchestrator` fires a cascading FTUE sequence:
- Phase 1: "welcome" (priority 100, not skippable)
- Phase 2: "navigation" (priority 90, skippable, requires welcome complete)
- Phase 3: "first_room" (priority 80, triggers on room entry)
- Phase 4: "first_dialog" (priority 70, triggers on first NPC talk)
- Phase 5: "games_intro" (priority 60, triggers on games page entry)
- Phase 6: "first_fight" (priority 50, triggers on entering a fight)

This is learning-by-doing. No tutorial pop-ups that break immersion — each tutorial fires when the player *does the thing*. Elara's guidance feels like a shipmate showing you around, not a game UI explaining buttons.

**Room Unlock Chain (Narrative Causality):**
```
Cryo Bay (start)
  → Medical Bay (visit cryo bay) — find Observation Keycard here
  → Bridge (visit cryo bay) — "bridge_systems_restored" flag set
    → Archives (visit bridge)
    → Comms Array (bridge_systems_restored flag)
      → Engineering (power_grid_restored flag from Comms)
        → Armory (combat_systems_online flag from Engineering)
          → Cargo Hold (cargo_bay_pressurized flag from Armory)
  → Observation Deck (requires observation-keycard item from Medical Bay)
```

Each room unlock triggers a `DiscoveryUnlockOverlay` — a full-screen cinematic reveal (KOTOR-style "New Area Discovered") with:
- Icon burst animation with radiating rings
- System name in all-caps
- Elara narrating *why* access opened (not just *that* it opened)
- Feature list below
- Auto-dismiss after ~5 seconds

**Assessment:** 8/10. The narrative causality chain is excellent — each room feels earned because a previous room's systems caused it. The keycard mechanic (find item in Medical Bay → unlocks Observation Deck) is particularly good because it teaches item-driven exploration.

### 2.3 Narrative Concern: Information Density in Hours 1-4

Between minutes 10-60, the player unlocks 6-8 rooms in rapid succession. Each room brings 3-8 new features. This creates a potential information avalanche:

- Bridge alone has: Conspiracy Board, Timeline, Quests, Guild, Diplomacy, Faction Wars, Daily Brief, Ark Console
- Armory has: Combat Sim, Card Game, PvP Arena, Boss Battle, Lore Quiz
- Cargo Hold has: Trade Empire, Requisitions Store, Marketplace

**Recommendation:** Implement a **breathing room** mechanic. After every 2nd room unlock, have Elara suggest the player spend time with what they've found before pushing forward. Narratively: *"There's more of the ship to explore, but these systems need your attention first. I'll let you know when I've traced the next power conduit."* Gate the next unlock behind a lightweight engagement check (e.g., complete 1 quest, play 1 game, talk to 1 NPC) rather than just visiting the previous room. This transforms the cascade into a rhythm: **discover → engage → discover → engage**.

### 2.4 Lore Tutorials — EXCELLENT CONCEPT

The `loreTutorials.ts` system provides voluntary tutorials accessible via "Learn with Elara" buttons:
- "tut-exploration" — Navigating the Inception Ark
- "tut-loredex" — The Loredex Intelligence Database
- "tut-cards" — Card Collection & Deck Building

Each tutorial has morality choices, rewards (Dream Tokens, XP, cards), and is player-initiated rather than forced. This is the gold standard for optional tutorial design.

**Recommendation:** Add lore tutorials for *every* major system, triggered contextually. When a player first opens the Marketplace, a subtle Elara prompt should appear: *"I could walk you through how trading works aboard the Ark. Interested?"* — leading to a lore tutorial that rewards engagement. Currently only 3 tutorials exist; there should be 10-12 covering crafting, PvP, guilds, companions, chess, and the casino.


---

## 3. FEATURE DISCOVERY PATHS

### 3.1 The Degen's Casino — MODEL FOR ALL FEATURES

The casino is the **best example** of narrative-gated discovery in the game. It is NOT an information dump — it's a gradual revelation:

**Discovery Path:**
1. Player unlocks Trade Hub (Deck 5) through natural exploration
2. Adjudicator Locke becomes available as an NPC
3. Player builds trust with Locke through trade activities (trust ≥ 30 required)
4. Locke mentions "a place where the real deals happen" in dialog
5. Casino access unlocks — the player has *heard about it* before they *find it*
6. Inside, The Degen (Ne-Yon #8, domain: entropy) runs the floor as a bartender
7. VIP tiers (Tourist → Regular → High Roller → Whale → Ne-Yon's Chosen) gradually reveal The Degen's true cosmic nature
8. At VIP 5, The Degen becomes a companion NPC — his identity fully revealed

**Why This Works:**
- Seeds planted early (Locke's dialog hints)
- Trust-gated (earned, not given)
- Identity revealed in layers (bartender → cosmic entity)
- Each VIP tier unlocks "Degen's Tales" — micro-stories that recontextualize earlier game events
- The Equilibrium Achievement (reach exactly 0 net profit/loss across 1,000 bets) is a philosophical statement about entropy that doubles as endgame content

**This pattern should be the template for EVERY major feature unlock.** Currently, several features lack this layered approach:

### 3.2 Features That NEED Narrative Discovery Paths

| Feature | Current State | What's Missing |
|---------|--------------|----------------|
| **Guild System** | Unlocks at Level 5 via `LockedFeaturesGuide` | No NPC mentions guilds before unlock. No story about *why* guilds exist on the Ark. Elara should mention "other survivors organizing into groups" around Level 3-4 |
| **PvP Arena** | Unlocks at Level 10 | No narrative buildup. The Armory should have environmental storytelling (old combat records, fight posters) that hint at arena culture before it unlocks |
| **Crafting** | Unlocks with Engineering Bay room | Good room-based unlock, but Engineering needs an environmental object (broken device) that Elara says "you could fix this if you had crafting tools" — planting the seed |
| **Chess** | Available in Armory | No narrative justification for *why chess exists on a spaceship*. The Human should mention it as "a game we played to stay sane" — tying it to lore |
| **Trade Empire** | Unlocks with Cargo Hold | Needs radio chatter in Comms Array about "trade routes reopening" before the Cargo Hold opens — seeds the economic layer |
| **Tower Defense** | Available in Armory | Needs Terminus Swarm to be mentioned/feared before the defense game unlocks. Elara's daily briefs should reference Swarm proximity alerts starting at Day 2-3 |
| **Prestige System** | Unlocks at Level 25 | The Antiquarian should start referencing "cycles" and "doing it all again" at Level 15+ — planting the seed for NG+ thematically |

### 3.3 Recommended Narrative Breadcrumb System

Every feature should follow a **3-beat discovery arc**:

1. **THE SEED (Passive):** An NPC mentions something, or the player finds an environmental object that references the feature. No UI, no notification — just a line of dialog or a discoverable object. *"I've detected organized signal patterns from other survivors. They seem to be... coordinating."* (→ Guild system seed)

2. **THE ECHO (Active):** A second reference, more direct, possibly from a different NPC or a daily brief event. The player is now primed. *"Those survivor groups I mentioned? They're calling themselves guilds now. Some have even established headquarters."* (→ Guild system echo)

3. **THE REVELATION (Unlock):** The feature unlocks with a `DiscoveryUnlockOverlay` that feels *earned* because the player has been hearing about it. The reveal feels like a payoff, not an information dump.

### 3.4 Environmental Storytelling Objects — EXCELLENT

The game already has 9 discoverable objects with asymmetric NPC recognition:

| Object | Room | Who Recognizes It |
|--------|------|-------------------|
| Kael's Scratch Marks | Cryo | The Human (yes), Elara (no) |
| Project Vector Vial | Medical | The Human (yes), Elara (missing from records) |
| Maintenance Log 93,847 | Engineering | Elara (doesn't remember), Antiquarian (deeper meaning) |
| The Changing Book | Archives | Shadow Tongue (claims ownership), Antiquarian (warns danger) |
| Agent Zero's Weapon Slot | Armory | Agent Zero (questions existence), Elara (inconsistency) |
| Channel 7 Static | Comms | Antiquarian (recognizes The Meme), Elara (sees noise) |
| Unnamed Constellation | Observation | The Human (knows author), Elara (artificial arrangement) |
| Ghost Processes | Bridge | The Human (is one of them), Elara (flagged benign) |
| Biohazard Container | Cargo | The Human (Warlord's insurance), Elara (hidden from her) |

**This is brilliant.** The same object tells different stories depending on who explains it. No quest markers — pure curiosity-driven discovery. This system should be expanded:

**Recommendation:** Add 2-3 objects per room (currently 1 per room) and tie some objects to feature unlocks. For example, finding a "broken arena terminal" in the Armory should be a seed for PvP — when PvP later unlocks, the player thinks "Oh, *that's* what that was."

### 3.5 Transmission → Loredex Unlock Chain — GOOD

Each watched episode unlocks specific Loredex entries after The Meme's outro:
- Episode 1-0 (In the Beginning) → Architect, Programmer, CoNexus
- Episode 1-3 (The Terminus Swarm) → Terminus, Terminus Swarm entities
- Episode 1-6 (The Source) → Kael, The Recruiter
- Episode 1-11 (The City/Oracle reveal) → The Oracle, Council of Harmony

Toast notification: "The Architect's origin revealed." This is elegant — the music/story content feeds the game's knowledge base.

**Recommendation:** Make this bidirectional. If a player discovers a Loredex entry *before* watching the relevant episode, the episode should have a unique intro: *"You already know about the Architect. But you don't know what The Meme saw."* This rewards exploration order and makes the content feel responsive.

---

## 4. THE LIVING ARK & LIVING UNIVERSE

### 4.1 The Living Ark — DESIGN EXCELLENT, NEEDS DEEPENING

The Ark is structured as 12 rooms across 6 decks, each generating daily events through the Daily Brief system:

**Daily Brief Structure (3 events/day):**
1. Gameplay event (boss spawn, draft tournament, trade opportunity)
2. Story event (signal fragment, lore discovery, music transmission)
3. Relationship event (NPC conversation, stargazing, diagnostics)

Each event type triggers specific systems:
- Signal fragments → The Human trust +2, flag `signal_fragment_found`, material drop `signal_shard`
- Quarantine events → Source trust +1, resources +50 Salvage/+15 Dream
- Tome discoveries → Antiquarian trust +3, card reward based on room

**What Makes It Feel Alive:**
- Events are seeded (deterministic randomness), so each day feels fresh but fair
- Room-specific events create reasons to revisit areas
- NPC trust changes from events create organic relationship growth
- Material drops from events feed crafting, creating economic flow

**What's Missing:**
- **Room state changes:** Rooms should visually evolve based on player actions. If the player crafts heavily in Engineering, the room should gain new tools/decorations. If Terminus events accumulate, Armory should show damage. Currently rooms are static.
- **Cross-room event chains:** Events should occasionally span rooms. A quarantine in Medical Bay should trigger an alert in Engineering. A signal fragment in Comms should make the Bridge conspiracy board update. Currently events are room-isolated.
- **Crew presence:** After the Crew Awakening cutscene, cloned crew members should appear in rooms (engineer NPCs in Engineering, soldiers in Armory). Currently the Ark feels empty after the drama of creating a crew.

### 4.2 The Living Universe — DESIGN MASTERPIECE, 0% IMPLEMENTED

This is the most ambitious system in the game and it has **zero server-side implementation.**

**The Design (from `livingUniverseEvents.ts`):**

Five emergent events driven by *community behavior pressure*, not timers:

| Event | Fuel Source | Counter-Force | Impact |
|-------|-----------|---------------|--------|
| **The Necromancer Returns** | Community deaths across all modes | Banishment quests, healing | 5x soul fragments, death economy buffs |
| **The Dreamer Awakens** | NPC trust gains, humanity choices | Machine-aligned choices | Peaceful dialog options, soft healing |
| **Terminus Approaches** | Viral exposure, machine choices | Healing, humanity choices | Thought Virus strengthens, Swarm danger up |
| **Timelines Converge** | Lore exploration, tome completions | Shadow Tongue corruption | Alternate timeline lore unlocks |
| **The Grand Edit** | Betrayals, broken promises | Truth-telling, purification | NPC dialog corrupts, records change |

**Event Synergies:**
- Necromancer + Terminus = death accelerates Terminus 2x
- Dreamer + Antiquarian = hope reveals true timelines
- Shadow Tongue + Terminus = ultimate dark path

Max 2 events active simultaneously. Events affect: market prices, diplomacy difficulty, combat bonuses, music atmosphere, NPC dialog.

**What Exists:** Complete type definitions, event data, NPC reaction strings, pressure calculations, impact definitions. Every bit of *design* is done.

**What's Missing — CRITICAL:**
- No `PressureTracker` database table
- No server endpoint to record pressure events (deaths, betrayals, trust gains)
- `getEmergingEvent()` is never called by any server code
- No event activation mechanism
- No event state persistence
- No consequence application to any game system
- No client-side event display

**This is the #1 priority for making the world feel alive.** Without it, the "living universe" is a lie — events are lore-only, the world doesn't react to player behavior, and the game's central thesis (your choices reshape reality) is unfulfilled.

### 4.3 Recommendations for Living Universe Implementation

**Phase 1 (1 week): Foundation**
- Create `universe_pressure` database table (event_id, pressure_score, last_updated)
- Create `universe_active_events` table (event_id, activated_at, expires_at)
- Add pressure increment logic to existing endpoints (fight wins add death pressure, trust gains add dreamer pressure)
- Create `livingUniverse.checkPressure()` cron job that runs daily

**Phase 2 (1 week): Manifestation**
- When pressure > 1000, activate event in database
- Push event notification to all active players
- Apply market price multipliers from event data
- Apply combat bonuses from event data
- Update NPC dialog pool to include event-specific reactions

**Phase 3 (1 week): Resolution**
- Create community counter-event quests
- Track counter-pressure
- When counter-pressure > event pressure, resolve event
- Award resolution rewards
- Log event history for narrative continuity


---

## 5. INTERCONNECTED WORLD SYSTEMS

### 5.1 Current System Connections — What Works

The game has several well-implemented cross-system connections:

**Economy Flow:**
```
Combat Wins → Material Drops → Crafting → Items → Marketplace Sales → Credits + Tax
                                                                        ↓
                                                           Guild Treasury (20% of tax)
                                                                        ↓
                                                              Guild Hall Upgrades
                                                                        ↓
                                                          Guild Perks (+XP, +resources)
                                                                        ↓
                                                    Faster Progression → More Combat → ...
```

**Progression Flow:**
```
Any Activity → XP → Level Up → Room Unlocks → New Features → New Activities
                  → Class Mastery XP → Branch Choice → Specialized Perks
                  → Civil Skill XP → Trade/Craft/Social bonuses
                  → Achievement Traits → Passive stat increases
```

**Social Flow:**
```
Guild Membership → Guild Chat → Coordinate → Guild Wars → Territory Bonuses
                → Donations → Reputation → Officer Rank → Guild Governance
                → Hall Decorations → Passive Bonuses → Member Retention
```

### 5.2 Where Connections Are BROKEN or MISSING

**THE MORALITY DISCONNECT — Critical**

The morality system is the game's philosophical spine. Every dialog choice defines `moralityDelta` values. The theme system reads `moralityScore` to unlock cosmetics. The morality leaderboard displays scores. NPC dialog adapts to score.

**But there is NO ENDPOINT that writes morality changes to the database from player choices.**

The dialog wheel (`dialogWheel.ts`) defines outcomes with `moralityDelta: +5` or `-10`, but no server route processes these. The `characterSheets.moralityScore` field exists in the DB but is never updated by choice logic. The entire morality-choice-consequence pipeline is severed at the most critical junction.

**Fix:** Create an `rpgSystems.applyMoralityChoice` endpoint that accepts a `choiceId` and `moralityDelta`, updates the character's morality score, and triggers any threshold unlocks (morality-gated cosmetics, NPC relationship shifts, content gates).

**THE PRESTIGE SEVERANCE — High Priority**

The prestige system (`prestigeSystem.ts`) defines 7 tiers with multipliers up to 2.5x XP. Functions exist for `canPrestige()`, `getPrestigeMultipliers()`, `calculatePrestigeCost()`. The DB has a `prestigeProgress` table.

**But there is NO "doPrestige()" endpoint.** Players cannot execute a prestige reset. The level reset logic isn't implemented. The preservation logic (what survives reset) isn't wired. The multiplier application to XP/resources isn't connected.

**THE GRADUATE LEGION PHANTOM — Zero Implementation**

The Graduate Legion (`graduateLegion.ts`) defines a full army deployment system where graduated apprentices serve roles (Army Leader, Tower Captain, Trade Emissary, Intel Operative, Lore Keeper). Role bonuses are perfectly calculated. Slot limits are defined.

**But:** No database table for assignments. No server endpoint for deployment. `computeRoleBonus()` and `getAllActiveDeploymentBonuses()` are never called. The army battle system referenced in narrative Acts 6-7 doesn't exist.

**COMPANION COMBAT GAP**

`companionSynergies.ts` defines `resolveCompanionBonuses()` for combat bonuses when companions fight alongside the player. This is called in `rpgSystems.ts` but the bonuses from bond level don't flow to the actual fight engine or pet battle system. Companions track trust and give trinkets but don't meaningfully affect combat outcomes.

**LIVING UNIVERSE → EVERYTHING**

Because the living universe events system is unwired, none of the following work:
- Market prices don't shift based on world events
- Diplomacy difficulty doesn't change
- Combat bonuses from world state don't apply
- Music atmosphere doesn't adapt
- NPC dialog doesn't reference active events
- The world feels static when it should feel dynamic

### 5.3 Recommendations: Making Choices Matter Everywhere

**Principle: Every action should ripple through at least 2 other systems.**

Here's how to achieve that with what already exists:

1. **Morality → Economy:** Machine-aligned players should see different marketplace prices (tech items cheaper, organic items expensive). Humanity-aligned players the reverse. The `moralityScore` is already in the DB — marketplace queries just need to factor it in.

2. **Combat Deaths → Living Universe:** Every PvP loss, fight loss, and pet death should increment the Necromancer pressure meter. This is a single line of code in each combat resolution endpoint.

3. **NPC Trust → Living Universe:** Every trust gain should increment the Dreamer pressure meter. Already tracked in companion relationship system — just needs to emit an event.

4. **Crafting Success → Ark State:** Successful crafts in Engineering should visually upgrade the room and contribute to Ark Restoration community goals. The `arkRestoration` system exists in economy sinks — wire crafting to it.

5. **Guild War Outcomes → Faction Wars:** Guild war victories should shift the larger faction war balance. Both systems exist independently — connecting them creates a cascade where small-group actions affect the world.

6. **Prestige Resets → NPC Memory:** When a player prestiges, NPCs should recognize them: *"You again. I remember you from... before."* The Antiquarian should be the first to acknowledge the cycle. This is pure narrative flavor that makes NG+ feel meaningful.

7. **Casino Wins/Losses → The Degen's Favor → Living Universe:** Heavy gambling should contribute to entropy pressure in the living universe system. The Degen tracks favor (0-100) — at extremes, world events should be influenced. Tie casino_activity_total to a new "entropy" pressure dimension.

8. **Environmental Objects → Quest Triggers:** Currently, discoverable objects are standalone lore. They should occasionally trigger mini-quests. Finding Kael's scratch marks should start a chain: investigate → find more marks → discover a hidden cryo pod → unlock a story beat. Environmental storytelling that *leads somewhere*.

---

## 6. MONETIZATION & ECONOMY HEALTH

### 6.1 Revenue Model — Ethical & Well-Designed

**Core Principle Enforced:** No pay-to-win. All stat advantages earnable through gameplay. PvP matchmaking ignores premium status. Premium items are cosmetic-only.

**Revenue Streams:**
| Stream | Price | Value |
|--------|-------|-------|
| Dream Token Packs | $0.99 - $49.99 | 101-220 Dream/dollar (scaling value) |
| Ark Commander Sub | $3.99/month | QoL: +2 quests, +25% craft speed, ad-free |
| Commander's Blessing | $4.99/month | Currency: 37 Dream/day + 90 immediate = 1,200 total |
| Epoch Pass Premium | 500 Dream (~$3-5) | 50-tier seasonal rewards track |
| Cosmetic Bundles | $7.99 each | Themed ship/character skins, time-limited |
| First Purchase Bundle | $0.99 (one-time) | 200 Dream + 3 packs + exclusive frame |
| Ad Watching | Free | 5 Dream/ad, max 3/day = 15 Dream/day |

**Payer Distribution Target:** 93% free, 4% minnow ($12/mo), 2% dolphin ($35/mo), 1% whale ($120/mo)

### 6.2 Economy Flow Analysis

**Daily F2P Income:** ~50 Dream from quests + 15 from ads = 65 Dream/day
**Monthly F2P Income:** ~1,950 Dream

**Key Sinks:**
- Respec: 500-1,000 Dream (with cooldowns)
- Guild Hall: 100-5,000 Dream per tier
- Cosmetics: 1,000-10,000 Dream
- Card Enhancement: 200-2,000 Dream per boost
- Prestige Auras: 5,000-25,000 Dream (endgame chain)

**Inflation Risk:** Design docs note 35-78x Dream inflation over 90 days without sinks. The endgame sinks (Ark Restoration, Dream Tithe, Prestige Auras, Card Gilding) are designed to absorb this, but **they need to actually be wired and accessible** for the economy to balance. Currently, several high-value sinks exist only in shared type definitions.

### 6.3 Monetization Recommendations

1. **Pity Timer for Dream Lottery:** Currently no guarantee system. Add a pity counter that guarantees a rare+ reward every 10 draws. The crafting system's near-miss mechanic is good precedent — extend it to gambling.

2. **Seasonal FOMO Management:** Cosmetic bundles have expiration dates and urgency tiers. This is fine for revenue but add a "legacy shop" where expired seasonal cosmetics return at 2x price after 6 months. The design doc mentions this as a principle but no implementation exists.

3. **Guild Treasury Health:** 20% of marketplace tax feeding guild treasury is elegant but needs a minimum floor. New/small guilds should receive a "guild welfare" baseline of 50 Dream/week to prevent dead guilds from feeling hopeless.

4. **Battle Pass Completion Rate:** 50 tiers over a season is standard but ensure the XP curve allows casual players (400 XP/day) to reach tier 35+ organically. Currently `xpPerTier` is unspecified — this MUST be tuned before launch.

5. **Subscription Stacking Clarity:** Ark Commander + Commander's Blessing are separate products that stack. This is good design (different value props) but the UI must make it crystal clear they're complementary, not competitive. A comparison table on the store page would help.


---

## 7. TECHNICAL IMPLEMENTATION STATUS — EVERY SYSTEM

### Legend
- **FULL** = Client ↔ Server ↔ Database, all features functional
- **WIRED** = Endpoints exist and DB connected, some features incomplete
- **PARTIAL** = Server route exists but significant gaps
- **DESIGN** = Shared logic only, no server integration
- **GHOST** = Referenced but doesn't exist

---

### 7.1 FULLY IMPLEMENTED SYSTEMS (Production-Ready)

| System | Server Router | DB Tables | Client Page | Lines | Status |
|--------|--------------|-----------|-------------|-------|--------|
| **Card Game (Dischordia)** | cardGame.ts (1,165 lines) | cards, userCards, decks, cardGameMatches | CardGamePage.tsx | 1,165 | **FULL** |
| **Marketplace** | marketplace.ts (1,027 lines) | marketListings, marketBuyOrders, marketAuctions, marketTransactions, marketTaxPool | MarketplacePage.tsx | 1,027 | **FULL** |
| **Trade Wars** | tradeWars.ts (1,638 lines) | twSectors, twPlayerState, twColonies, twGameLog | TradeWarsPage.tsx | 1,638 | **FULL** |
| **Chess** | chess.ts (1,011 lines) | chessGames, chessRankings, chessTournaments | ChessPage.tsx | 1,011 | **FULL** |
| **PvP Card Battles** | pvp.ts + pvpWs.ts (WebSocket) | pvpMatches, pvpLeaderboard, pvpDecks, pvpSeasons | ArenaPage.tsx | 800+ | **FULL** |
| **Guild System** | guild.ts + guildHall.ts + guildWars.ts | guilds, guildMembers, guildChat, guildWars, guildInvites | GuildPage.tsx | 1,200+ | **FULL** |
| **Crafting** | crafting.ts | craftingLog, materials | CraftingPage.tsx | 400+ | **FULL** |
| **Inventory** | inventory.ts | userCards, materials, dreamBalance | InventoryPage.tsx | 350+ | **FULL** |
| **Trading (P2P)** | trading.ts | trades | TradingPage.tsx | 300+ | **FULL** |
| **Store (Stripe)** | store.ts | storePurchases, dreamBalance | StorePage.tsx | 400+ | **FULL** |
| **Social/Friends** | socialFeatures.ts | friends, directMessages | SocialPage.tsx | 350+ | **FULL** |
| **Daily Quests** | dailyQuests.ts | dailyQuests, dailyStreaks | QuestsPage.tsx | 500+ | **FULL** |
| **Space Stations** | spaceStation.ts | spaceStations, stationModules | SpaceStationPage.tsx | 400+ | **FULL** |
| **Tower Defense** | towerDefense.ts (649 lines) | towerPlacements, raidLogs, defenseWaves | TowerDefensePage.tsx | 649 | **FULL** |
| **Leaderboards** | fightLeaderboard.ts, moralityLeaderboard.ts | fightLeaderboard, pvpLeaderboard | LeaderboardPage.tsx | 300+ | **FULL** |
| **Notifications** | notificationRouter.ts | notifications | (integrated) | 200+ | **FULL** |
| **Discovery/Unlocks** | discovery.ts | featureUnlocks | DiscoveryUnlockOverlay.tsx | 250+ | **FULL** |
| **Analytics** | analytics.ts | analyticsEvents | (admin) | 208 | **FULL** |
| **Auth** | OAuth system | users | (integrated) | 400+ | **FULL** |

**Total: 19 fully implemented systems.**

### 7.2 WIRED BUT INCOMPLETE SYSTEMS (Need Finishing Work)

| System | What Works | What's Missing | Effort |
|--------|-----------|----------------|--------|
| **Battle Pass** | Season tracking, tier progress, XP accumulation, reward claiming | `xpPerTier` unspecified, seasonal reward content not populated, campaign challenges not visible | 1 week |
| **Companion System** | Companion summoning, synergy detection, battle reactions | Combat bonuses from bond level don't flow to fight engine, passive bonuses incomplete | 1 week |
| **Eidolon Bonds** | Bond tracking, memorial, daily interactions | Eidolon acquisition system missing, combat bonuses not wired | 1 week |
| **Pet Battles** | Pet roster, battle result submission, history | Pet acquisition paths unclear, rewards partially done, no pet evolution | 1-2 weeks |
| **Class Mastery** | XP tracking, branch selection, perk definitions | Some perk effects not enforced in combat calculations | 3-5 days |
| **Seasonal Events** | Event scheduling, participation tracking | No dynamic quest generation, no event-specific mechanics | 2 weeks |
| **Citizen/RPG** | Character creation, trait calculation, synergy bonuses | Trait effects inconsistently applied across all combat modes | 1 week |
| **Boss Mastery** | Damage logging, phase tracking | Boss fight simulation incomplete, health sync missing, rewards incomplete | 2 weeks |
| **Co-op Raids** | Contribution tracking, raid creation | Actual raid combat loop not implemented | 2-3 weeks |
| **Tech/Mastery Trees** | UI exists, DB tables exist | Unlocks not enforced server-side, research progression arbitrary | 1 week |
| **Cosmetic Shop** | Item definitions, purchase flow | Limited inventory, no rotation system, no preview | 1 week |
| **Quest Progress** | Tracking framework, completion recording | Weekly and epoch quest content not populated | 1 week |
| **Personal Quarters** | Room customization endpoints | Limited decoration options, no visitor system | 1-2 weeks |
| **Replay System** | Match recording framework | Playback UI incomplete, sharing not implemented | 1-2 weeks |
| **Friendly Challenges** | Challenge creation, friend matching | No custom rule sets, no spectator mode | 1 week |
| **Promo Codes** | Code creation, redemption, deactivation | No bulk generation, no analytics dashboard | 3 days |
| **Lore Journal** | Entry tracking, discovery recording | Content sparse, no journal UI browsing | 1 week |

**Total: 17 partially implemented systems.**

### 7.3 DESIGN-ONLY SYSTEMS (No Server Wiring)

| System | Shared File | What's Designed | Server Endpoint | DB Table | Fix Effort |
|--------|------------|-----------------|-----------------|----------|------------|
| **Living Universe Events** | livingUniverseEvents.ts | 5 emergent events, pressure tracking, NPC reactions, market/combat impacts, event synergies | **NONE** | **NONE** | 3 weeks |
| **Morality Choice Processing** | dialogWheel.ts, moralityThemes.ts | Dialog choices with moralityDelta, threshold unlocks, milestone rewards | **NONE** (score displays but never updates from choices) | Field exists, never written | 3-5 days |
| **Prestige/NG+ Execution** | prestigeSystem.ts | 7 tiers, multipliers, reset/preserve logic, cost calculation | **NONE** (canPrestige() never called server-side) | Table exists, never populated | 1 week |
| **Graduate Legion/Army** | graduateLegion.ts | Role assignments, deployment bonuses, slot limits, sacrifice system | **NONE** | **NONE** | 2-3 weeks |
| **Apprentice Betrayal** | apprenticeBetrayal.ts | Betrayal triggers, probability calculation, narrative branches, consequence system | **NONE** | **NONE** | 2 weeks |
| **Necromancer Cycle** | necromancerCycle.ts | Event lifecycle, community response mechanics, resolution conditions | **NONE** (subcomponent of living universe) | **NONE** | (part of living universe) |
| **Breaking Point System** | breakingPoint.ts | NPC psychological limits, trigger conditions, relationship consequences | **NONE** | **NONE** | 1-2 weeks |
| **Dark Arts Progression** | darkArts.ts | Forbidden knowledge tree, corruption costs, power unlocks | **NONE** | **NONE** | 2 weeks |
| **Governance Voting** | governance.ts | 5-panel voting wheel, faction proposals, consequence system | **NONE** (architectConsole has admin votes, but player governance is unwired) | Table exists, empty | 1 week |
| **Dynamic Difficulty** | dynamicDifficulty.ts | Performance-based AI scaling, win rate tracking, difficulty curves | **NONE** | **NONE** | 1 week |
| **Character Creation Impact** | characterCreationImpact.ts | Species/class/alignment affecting game world state | **NONE** (choices recorded but don't affect world) | **NONE** | 1 week |
| **Crew Trade Integration** | crewTradeIntegration.ts | Crew members affecting trade empire outcomes | **NONE** | **NONE** | 1-2 weeks |

**Total: 12 design-only systems.**

### 7.4 Ghost Systems (Referenced But Don't Exist)

| System | Referenced In | What's Expected | Status |
|--------|-------------|-----------------|--------|
| **Army Battle System** | narrativeActs.ts (Acts 6-7 require army missions) | Troop deployment, squad combat, territory conquest | Does not exist. Acts 6-7 are blocked. |
| **Multiplayer Trade War PvP** | tradeWars.ts (mentions intercepting traders) | PvP piracy/interception in trade routes | Combat references exist but no implementation |
| **Elara AI Deep Chat** | elara.ts router exists | LLM-powered conversational AI | Framework exists, LLM integration depth unclear |
| **Music Atmosphere System** | livingUniverseEvents.ts (events change music) | Dynamic music overlays based on world state | Sound system exists, dynamic overlays not wired |
| **Shadow Tongue Corruption Visuals** | Referenced in Grand Edit event | Text corruption, historical record changes | No visual corruption system implemented |

---

### 7.5 WebSocket Servers — All Functional

| Server | File | Purpose | Status |
|--------|------|---------|--------|
| PvP Card Battles | pvpWs.ts | Queue matchmaking, real-time turns, emotes, spectator mode, session recovery | **FULL** |
| Chess Multiplayer | chessWs.ts | Real-time chess, time controls, draw offers, ELO ranking | **FULL** |
| Duelyst Card Game | duelystWs.ts | Board-based card game, state sync | **FULL** |
| Terminus Swarm | terminusWs.ts | Co-op raid boss, multi-player coordination | **FULL** |

### 7.6 Database Schema Completeness

**111 tables defined in drizzle/schema.ts.** Key coverage:
- Auth & identity: 3 tables
- Card systems: 5 tables
- Character/progression: 8 tables
- Economy: 7 tables
- Guild: 6 tables
- PvP/Competition: 8 tables
- Combat: 4 tables
- Trade: 4 tables
- Content/Events: 6 tables
- Space/Tower: 6 tables
- Raids: 4 tables
- Pets/Companions: 3 tables
- Admin/Governance: 4 tables
- Analytics: 1 table
- Social: 3 tables

**Missing tables needed for unwired systems:**
- `universe_pressure` (living universe event pressure tracking)
- `universe_active_events` (currently active world events)
- `universe_event_history` (resolved events log)
- `graduate_deployments` (army role assignments)
- `apprentice_betrayals` (betrayal event log)
- `dark_arts_progress` (forbidden knowledge tracking)
- `dynamic_difficulty_state` (per-player difficulty tuning)


---

## 8. SYSTEMS NEEDING DEVELOPMENT WORK — PRIORITIZED

### Tier 0: CRITICAL (Game's thesis depends on these)

| # | System | Gap | Effort | Why Critical |
|---|--------|-----|--------|-------------|
| 1 | **Morality Choice Endpoint** | No server route updates moralityScore from dialog choices | 3-5 days | The entire game is about choices mattering. Without this, they don't. |
| 2 | **Living Universe Events** | 0% server integration. No DB tables, no triggers, no consequences. | 3 weeks | The "living universe" is the game's marquee feature. It's currently fictional. |
| 3 | **Prestige System Execution** | No doPrestige() endpoint. Can't reset. Can't earn multipliers. | 1 week | Endgame retention anchor. Without it, max-level players have no goal. |

### Tier 1: HIGH (Core loops broken without these)

| # | System | Gap | Effort |
|---|--------|-----|--------|
| 4 | **Battle Pass Reward Population** | XP per tier unspecified, reward content not defined per season | 1 week |
| 5 | **Companion Combat Bonuses** | Bond level doesn't affect fight/pet battle outcomes | 1 week |
| 6 | **Graduate Legion Deployment** | No endpoint, no DB table, army bonuses don't apply | 2-3 weeks |
| 7 | **Apprentice Betrayal Triggers** | Server-side betrayal checks not implemented | 2 weeks |
| 8 | **Boss Mastery Combat Loop** | Boss fight simulation incomplete | 2 weeks |
| 9 | **Co-op Raid Combat** | Contribution tracking works, actual raid loop missing | 2-3 weeks |

### Tier 2: MEDIUM (Feature completeness)

| # | System | Gap | Effort |
|---|--------|-----|--------|
| 10 | **Dynamic Difficulty** | No server-side AI scaling based on player performance | 1 week |
| 11 | **Seasonal Event Content** | Framework exists, no dynamic quest generation | 2 weeks |
| 12 | **Pet Evolution/Acquisition** | No acquisition paths, no evolution mechanics | 1-2 weeks |
| 13 | **Civil Skills Combat Effects** | Inconsistent application across game modes | 1 week |
| 14 | **Tech/Mastery Tree Enforcement** | Unlocks not enforced server-side | 1 week |
| 15 | **Governance Player Voting** | Admin votes work, player governance unwired | 1 week |

### Tier 3: POLISH (Nice-to-have before launch)

| # | System | Gap | Effort |
|---|--------|-----|--------|
| 16 | **Replay System Playback** | Recording works, playback UI incomplete | 1-2 weeks |
| 17 | **Dark Arts Progression** | Forbidden knowledge tree not implemented | 2 weeks |
| 18 | **Breaking Point System** | NPC psychological limit system unwired | 1-2 weeks |
| 19 | **Music Atmosphere Adaptation** | World events should change music, not wired | 1 week |
| 20 | **Shadow Tongue Visual Corruption** | Text corruption visuals not implemented | 1 week |

**Total estimated effort for all tiers: ~12-16 weeks of focused development.**

---

## 9. ARCHITECT'S CONSOLE — ADMIN & TESTING REQUIREMENTS

### 9.1 What Currently Exists

The Architect's Console (`architectConsole.ts`, 718 lines) currently provides:

**Surveillance View (Analytics):**
- Total players, DAU, WAU, total characters
- Morality alignment distribution (5 buckets)
- Species census
- Game metrics (total cards, user cards, fight matches, card game matches)

**Governance View (Community Votes):**
- Create community directives with 3-5 options
- Vote management (list, close, declare winner)
- Audit logging

**Live Operations (Events):**
- Create admin events (notification, living_universe, seasonal_bonus, instance_spawn, narrative_trigger, multiplier)
- Activate/deactivate events
- Target audience filtering (all, by_level, by_guild, specific players)
- Scheduled events with expiration

**Requisitions (Promo Codes):**
- Create/list/deactivate promo codes
- Redemption tracking

**Awards (Resource Distribution):**
- Award Dream, soul-bound Dream, credits, cards to individuals
- Bulk award to up to 500 players
- Audit logging for all awards

**Admin Panel (separate, `/admin` route):**
- User management (search, promote/demote roles)
- Card management (toggle active/disabled)
- Content rewards definition
- Discovery unlock management (unlock all features for all players)
- Loredex CRUD with CSV import/export

### 9.2 What's MISSING for Full Testing & Live Operations

#### A. PLAYER STATE INSPECTION & MANIPULATION

These are critical for QA testing and customer support:

| Admin Function | Purpose | Priority |
|---------------|---------|----------|
| **View Any Player's Full State** | Inspect character sheet, inventory, morality score, NPC trust levels, quest progress, guild membership, prestige level, achievements, battle pass progress — all in one dashboard | **P0** |
| **Modify Player Morality Score** | Set morality to any value for testing morality-gated content | **P0** |
| **Modify Player Level/XP** | Set level to any value for testing level-gated features | **P0** |
| **Modify NPC Trust Levels** | Set trust to any value per NPC for testing trust-gated content (e.g., casino unlock at Locke trust 30) | **P0** |
| **Set Player Narrative Flags** | Set/clear narrative flags (act completion, room visited, etc.) for testing story progression | **P0** |
| **Reset Player to Any Phase** | Reset game phase (FIRST_VISIT, AWAKENING, QUARTERS_UNLOCKED, EXPLORING, FULL_ACCESS) for testing onboarding | **P0** |
| **Grant/Remove Items** | Add or remove specific materials, cards, currencies for testing economy flows | **P1** |
| **Trigger Room Unlocks** | Force-unlock specific rooms for a player to test progression | **P1** |
| **Set Prestige Level** | Set prestige tier (0-7) for testing prestige content without grinding | **P1** |
| **Impersonate Player** | View the game as a specific player sees it (read-only) for debugging | **P2** |

#### B. ECONOMY & MARKETPLACE MANAGEMENT

| Admin Function | Purpose | Priority |
|---------------|---------|----------|
| **Economy Dashboard** | Real-time view of: total Dream in circulation, total credits, Dream faucet rate (earned/day), Dream sink rate (spent/day), inflation index | **P0** |
| **Marketplace Moderation** | View all active listings, cancel fraudulent listings, ban marketplace access per player | **P0** |
| **Price History & Analytics** | View average sale prices per item over time, detect price manipulation | **P1** |
| **Tax Pool Management** | View tax pool balance, redistribute to guilds, adjust tax rate | **P1** |
| **Dream Faucet/Sink Tuning** | Adjust quest reward amounts, crafting costs, respec prices in real-time without code deploy | **P1** |
| **Transaction Log Viewer** | Search all marketplace transactions by player, item, date range, amount | **P1** |
| **Currency Rollback** | Reverse a specific transaction (refund + item return) for dispute resolution | **P2** |

#### C. LIVING UNIVERSE EVENT CONTROL

| Admin Function | Purpose | Priority |
|---------------|---------|----------|
| **Pressure Meter Dashboard** | View all 5 event pressure meters in real-time | **P0** |
| **Force-Trigger Event** | Manually activate any living universe event (bypass pressure thresholds) for testing | **P0** |
| **Force-Resolve Event** | Manually end an active event and apply resolution rewards | **P0** |
| **Pressure Injection** | Add/subtract pressure points to any meter for testing | **P1** |
| **Event History Log** | View all past events with activation date, duration, resolution, and player participation | **P1** |
| **Event Impact Preview** | Preview what market/combat/dialog changes an event would cause before activating | **P2** |

#### D. NARRATIVE & CONTENT MANAGEMENT

| Admin Function | Purpose | Priority |
|---------------|---------|----------|
| **Narrative Flag Inspector** | View all narrative flags across all players (who's in which act, which paths taken) | **P0** |
| **Story Progress Statistics** | Aggregated view: % of players in each act, most common dialog choices, morality distribution per act | **P0** |
| **Force Act Transition** | Push a player to any narrative act for testing | **P1** |
| **Dialog Choice Analytics** | Which choices are most popular, which NPCs are most trusted, which paths are abandoned | **P1** |
| **NPC Trust Distribution** | Aggregated trust levels across all players per NPC (are players ignoring certain NPCs?) | **P1** |
| **Environmental Object Discovery Rate** | Which objects have been found by what % of players | **P2** |
| **Transmission Completion Tracking** | Which episodes watched by what % of players, completion funnels | **P2** |

#### E. GAME MODE MANAGEMENT

| Admin Function | Purpose | Priority |
|---------------|---------|----------|
| **Match History Search** | Search PvP, chess, card game, fight matches by player, date, outcome | **P0** |
| **Active Match Viewer** | View currently active WebSocket matches (PvP, chess, Terminus) | **P0** |
| **ELO Distribution Dashboard** | View player distribution across rank tiers (Bronze through Grandmaster) | **P1** |
| **Tournament Management** | Create, manage, and view draft/chess tournaments | **P1** |
| **Matchmaking Queue Stats** | How many players in each queue, average wait time, match quality | **P1** |
| **Force Match Result** | Override a match result for dispute resolution | **P2** |
| **Card Balance Dashboard** | Win rates per card, per deck archetype, per faction — identify balance issues | **P1** |
| **Ban Cards from Ranked** | Temporarily disable specific cards from PvP without changing their active status | **P2** |

#### F. GUILD & SOCIAL MANAGEMENT

| Admin Function | Purpose | Priority |
|---------------|---------|----------|
| **Guild Dashboard** | All guilds with member count, treasury, level, faction, activity metrics | **P0** |
| **Guild Moderation** | Disband guild, remove members, transfer leadership | **P0** |
| **Guild War Management** | View active wars, force-resolve wars, adjust scoring | **P1** |
| **Chat Moderation** | View and moderate guild chat + direct messages (report system) | **P0** |
| **Social Graph Viewer** | Friend connections, messaging volume, identify isolated vs connected players | **P2** |

#### G. BATTLE PASS & SEASONAL MANAGEMENT

| Admin Function | Purpose | Priority |
|---------------|---------|----------|
| **Season Management** | Create/edit/end seasons, define reward tiers | **P0** |
| **Battle Pass Progress Distribution** | What tier are players at, completion funnels, drop-off points | **P0** |
| **Reward Population Tool** | UI to populate season reward content per tier (free + premium tracks) | **P0** |
| **Season Revenue Dashboard** | Premium pass purchase rate, cosmetic bundle sales, Dream token sales per season | **P1** |
| **Test Season Mode** | Create a test season visible only to admin accounts | **P1** |

#### H. SYSTEM HEALTH & OPERATIONS

| Admin Function | Purpose | Priority |
|---------------|---------|----------|
| **Server Health Dashboard** | Active connections, response times, error rates, WebSocket status | **P0** |
| **Database Health** | Table sizes, slow queries, connection pool status | **P0** |
| **Stripe Dashboard** | Recent transactions, refund requests, failed payments | **P0** |
| **Rate Limit Dashboard** | Players hitting rate limits, potential abuse detection | **P1** |
| **Audit Log Viewer** | Search all admin actions by admin, date, action type | **P0** |
| **Feature Flags** | Enable/disable game features without code deploy | **P1** |
| **Maintenance Mode** | Put game in maintenance with custom message, without full shutdown | **P1** |
| **Announcement System** | Push in-game announcements to all players or segments | **P0** |
| **Data Export** | Export player data for analytics, GDPR compliance, or backup | **P1** |

#### I. TESTING-SPECIFIC TOOLS

| Admin Function | Purpose | Priority |
|---------------|---------|----------|
| **Time Machine** | Advance server time for a test account to test daily resets, streak mechanics, season transitions, event expirations (partially exists as lazy-loaded component) | **P0** |
| **Bot Player Generator** | Create N bot accounts at specified levels with random inventories for load testing and matchmaking | **P1** |
| **Economy Simulator** | Simulate N days of economy with specified player counts to project inflation | **P1** |
| **Narrative Walkthrough Mode** | Step through all 7 acts with all dialog choices visible, skipping gameplay requirements | **P1** |
| **Regression Test Triggers** | One-click test suites: "Test full onboarding flow", "Test prestige reset", "Test marketplace cycle" | **P2** |
| **Seed Data Manager** | Re-run card seeding, reset galaxy state, populate test data sets from admin UI | **P1** |

### 9.3 Summary: Admin Functions Needed

| Category | Exists | Needed | Gap |
|----------|--------|--------|-----|
| Player State Inspection | 0 | 10 | 10 |
| Economy Management | 2 (basic awards) | 7 | 5 |
| Living Universe Control | 0 | 6 | 6 |
| Narrative Management | 0 | 7 | 7 |
| Game Mode Management | 0 | 8 | 8 |
| Guild/Social Management | 0 | 5 | 5 |
| Battle Pass/Seasonal | 0 | 5 | 5 |
| System Health | 2 (performance, analytics) | 9 | 7 |
| Testing Tools | 1 (Time Machine shell) | 5 | 4 |
| **TOTAL** | **5** | **62** | **57** |

**The Architect's Console needs 57 additional admin functions to fully test and operate this game in production.**


---

## 10. PRIORITY ROADMAP

### Phase 1: Make Choices Matter (Weeks 1-2)

**Goal:** The game's thesis — "your choices reshape reality" — must be mechanically true.

1. **Create `applyMoralityChoice` endpoint** — dialog choices update moralityScore in DB
2. **Create `universe_pressure` and `universe_active_events` DB tables**
3. **Wire death/trust/betrayal events to pressure meters** — increment pressure in existing combat/companion endpoints
4. **Create `checkLivingUniverse` scheduled job** — daily check for event activation
5. **Apply active event effects** — market price multipliers, NPC dialog pools, combat bonuses
6. **Wire companion bond bonuses** to fight engine and pet battle system

**Outcome:** Morality choices update score. World events emerge from player behavior. Combat companions matter.

### Phase 2: Complete Core Loops (Weeks 3-5)

**Goal:** Every major game loop should be completable end-to-end.

1. **Implement `doPrestige()` endpoint** — reset level/rooms/quests, preserve trust/achievements/cards, apply multipliers
2. **Populate Battle Pass rewards** — define XP per tier, reward content for 50 tiers per season
3. **Create Graduate Legion deployment system** — DB table, assignment endpoint, bonus application
4. **Implement Boss Mastery combat loop** — boss HP sync, phase transitions, reward distribution
5. **Wire Tech/Mastery Tree enforcement** — server-side unlock validation
6. **Populate weekly and epoch quest content**

**Outcome:** Prestige system playable. Battle pass rewarding. Apprentices useful post-graduation.

### Phase 3: Architect's Console Expansion (Weeks 5-8)

**Goal:** Full admin capability for testing and live operations.

1. **Player State Inspector** — view full player profile with all systems in one dashboard
2. **Player State Manipulation** — set morality, level, NPC trust, narrative flags, prestige
3. **Economy Dashboard** — Dream circulation, faucet/sink rates, inflation tracking
4. **Marketplace Moderation** — listing management, transaction search, dispute resolution
5. **Living Universe Dashboard** — pressure meters, event control, force-trigger/resolve
6. **Narrative Analytics** — act progression stats, choice analytics, NPC trust distribution
7. **Game Mode Analytics** — match search, ELO distribution, card win rates
8. **Season Management** — create seasons, populate rewards, track completion
9. **Chat Moderation** — guild and DM monitoring
10. **Feature Flags** — enable/disable features without deploy

**Outcome:** Full operational capability for testing every feature and managing live game.

### Phase 4: Narrative Depth (Weeks 8-12)

**Goal:** Feature discovery paths and narrative breadcrumbs for every system.

1. **Add narrative breadcrumbs** for all features per the 3-beat discovery pattern (Seed → Echo → Revelation)
2. **Expand environmental objects** to 2-3 per room with quest triggers
3. **Implement Apprentice Betrayal system** — server-side trigger checks, narrative consequences
4. **Implement Breaking Point system** — NPC psychological limits
5. **Add breathing room mechanic** to onboarding (engagement check between room unlocks)
6. **Expand lore tutorials** from 3 to 12 (one per major system)
7. **Wire music atmosphere** to world events
8. **Implement Dynamic Difficulty** — AI scaling based on player performance

**Outcome:** Every feature has a narrative discovery path. The world responds to player behavior at every level.

### Phase 5: Polish & Endgame (Weeks 12-16)

**Goal:** Retention systems for veteran players.

1. **Implement Dark Arts progression** — forbidden knowledge tree
2. **Implement Governance player voting** — faction proposals, consequences
3. **Wire Co-op Raids combat loop**
4. **Implement Replay System playback**
5. **Pet Evolution system**
6. **Seasonal event dynamic content generation**
7. **Shadow Tongue visual corruption effects**
8. **Army Battle System** (Acts 6-7 prerequisite)

**Outcome:** Endgame content depth. Veteran players have aspirational goals.

---

## APPENDIX A: FILES REFERENCE

### Critical Server Files
| File | System | Lines |
|------|--------|-------|
| `server/routers.ts` | Router aggregation (58 routers registered) | 296 |
| `server/routers/architectConsole.ts` | Admin panel | 718 |
| `server/routers/tradeWars.ts` | Trade Wars game | 1,638 |
| `server/routers/cardGame.ts` | Card game | 1,165 |
| `server/routers/marketplace.ts` | P2P marketplace | 1,027 |
| `server/routers/chess.ts` | Chess multiplayer | 1,011 |
| `server/routers/towerDefense.ts` | Tower defense | 649 |

### Critical Shared Files (Design-Only Systems)
| File | System | Wired? |
|------|--------|--------|
| `shared/livingUniverseEvents.ts` | Living Universe | NO |
| `shared/dialogWheel.ts` | Morality choices | NO |
| `shared/prestigeSystem.ts` | Prestige/NG+ | NO |
| `shared/graduateLegion.ts` | Army deployment | NO |
| `shared/apprenticeBetrayal.ts` | Betrayal system | NO |
| `shared/breakingPoint.ts` | NPC limits | NO |
| `shared/darkArts.ts` | Forbidden knowledge | NO |
| `shared/governance.ts` | Player voting | NO |
| `shared/dynamicDifficulty.ts` | AI scaling | NO |

### Critical Client Files
| File | System |
|------|--------|
| `client/src/contexts/GameContext.tsx` | Core game state (181 KB) |
| `client/src/pages/AwakeningPage.tsx` | Character creation |
| `client/src/lib/tutorialOrchestrator.ts` | FTUE system |
| `client/src/data/narrativeActs.ts` | 7-act story (1,268 lines) |
| `client/src/game/degensCasino.ts` | Casino (1,311 lines) |
| `client/src/game/livingArk.ts` | Ark rooms & events |

### Database
| File | Content |
|------|---------|
| `drizzle/schema.ts` | 111 tables (128 KB) |
| `drizzle/migrations/` | 29 SQL migrations |

---

## APPENDIX B: FINAL ASSESSMENT SCORECARD

| Category | Score | Notes |
|----------|-------|-------|
| **Narrative Design** | 9/10 | 7-act branching story, asymmetric NPC knowledge, environmental storytelling. Exceptional ambition. |
| **Onboarding** | 8/10 | Cinematic awakening, learn-by-doing tutorials, KOTOR-style discovery overlays. Needs breathing room in hour 1-4. |
| **Feature Discovery** | 7/10 | Casino is gold standard. Other features need narrative breadcrumb paths. |
| **Living World** | 3/10 | Brilliantly designed, 0% implemented. The #1 priority. |
| **Monetization Ethics** | 10/10 | No pay-to-win. Cosmetics-only premium. Fair pricing. Spending caps. Model-worthy. |
| **Economy Balance** | 7/10 | Good faucet/sink design. Needs endgame sinks wired. Inflation risk noted. |
| **Technical Architecture** | 9/10 | 111 DB tables, 58 routers, 4 WebSocket servers, Stripe, OAuth. Professional grade. |
| **System Completion** | 5/10 | 19 systems fully wired, 17 partial, 12 design-only. The gap between vision and wiring is the #1 risk. |
| **Admin/Ops Readiness** | 3/10 | Basic analytics and awards exist. Missing 57 admin functions for testing and live ops. |
| **Interconnectedness** | 4/10 | Economy flow works. Morality, living universe, and prestige systems — the interconnection backbone — are all unwired. |

**Overall: 6.5/10 — Extraordinary design held back by incomplete integration. The vision is AAA. The wiring is alpha.**

---

*End of Comprehensive Game Analysis*
*Dischordian Saga — Panopticus/dischordian-saga*
*Generated April 8, 2026*
