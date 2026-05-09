# Trade Empire — §8 Improvements: Design Specs

This document is the designer-grade companion to the merged Trade Empire system. It enumerates the ten §8 improvements first listed in `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` row 17 and turns each into a concrete, schema-aware, testable spec. Each improvement is a coherent slice of work that can be picked up independently.

For every improvement:

- **Hook** — one sentence: what the player feels.
- **State** — what's already in code or schema.
- **Rules** — the actual mechanics (numbers, thresholds, edge cases).
- **Data shapes** — types/tables to add or extend.
- **UX surface** — where it lives in the unified hub.
- **Wire-in** — where in the existing routers/services it bolts.
- **Acceptance** — how to know it's done.
- **Open questions** — what writers/designers still need to decide.

The merged hub is `TradeEmpireHubPage` with three tabs: **Map & Missions** (economic), **Court & Politics** (political), **Convergence** (climax). Each improvement below maps to one of those tabs.

---

## §8.1 — Narrative Sectors

**Hook.** Some sectors aren't just markets — they're story beats. Walking into them changes the act.

**State.** `tradeSectorArrivals` table tracks `firstEnteredAt` + `cinematicWatched`. `sectorFirstEntered` ripple already fires.

**Rules.**

- 8 of the 26 sectors are story-bearing: `terminus_approach`, `terminus_core`, `dreamer_barrier`, `ark_debris_field`, `antiquarian_archive`, `hell_gate`, `thaloria`, `panopticon_ruins`.
- First entry to a story-bearing sector triggers a `narrative_flag.<sectorId>_first_entry` flag and unlocks the corresponding dialog node in the priority-roster NPC who owns that sector.
- Non-story sectors fire only the existing `sector_first_entered` ripple — no narrative flag, no dialog unlock.
- A second visit to a story sector does not refire the cinematic but does post a `revisit_<sectorId>` public-knowledge entry the first time.

**Data shapes.** Extend `apps/shared/tradeEmpire/sectors.ts` (or add it) with a `STORY_SECTOR_OWNERSHIP` map: `Record<sectorId, { ownerNpcKey: NpcKey; flagKey: string; cinematicKey: string }>`. No DB migration; existing `tradeSectorArrivals` is sufficient.

**UX surface.** Map tab. The sector tile shows a star icon if it's story-bearing and unentered; a half-star if entered but not seen the cinematic; nothing if fully consumed. Mouseover shows the owner NPC.

**Wire-in.** `tradeEmpire.ts:sectorFirstEntered` mutation — after the existing `tradeSectorArrivals` insert, look up `STORY_SECTOR_OWNERSHIP[sectorId]`; if present, call the narrative-flag setter and the dialog-unlock writer.

**Acceptance.**

- Source-scan test pinning the 8 story sectors against `STORY_SECTOR_OWNERSHIP`.
- Integration: enter `terminus_approach` for the first time → flag set, owner NPC's dialog node unlocks, public-knowledge entry posts.
- Re-entering a story sector posts a `revisit_*` event exactly once.

**Open questions.** Are `dreamer_barrier` and `terminus_core` enterable at all in act 1, or hard-gated? (Recommend: hard-gated until §8.7 Dreamer's Shield mystery resolves.)

---

## §8.2 — Table Diplomacy minigame (Act 3)

**Hook.** Faction treaties are negotiated as a turn-based card minigame at a literal table. The Court tab's signature interactive moment.

**State.** Nothing built. `tradeCourt.ts` has `declareAlliance`/`betrayAlliance` stubs; no minigame.

**Rules.**

- **Setup.** Two factions sit across a table. Each side draws a hand of 5 from a per-faction "Demand Deck" (described below). The player plays the role of broker (neutral mediator) or party (one side).
- **Demand Deck.** Each faction has 12 demand cards across 3 archetypes (territorial / economic / ideological), 4 cards per archetype, in 3 power tiers (small / medium / world-shaping). Cards have a "demand text" (the ask) and a "concession line" (what the faction will accept in exchange).
- **Turn structure.** 5 rounds. Each round both sides reveal one demand. Player (as broker) plays a counter-card from the player's hand; the counter-card's effect modifies the demand's resolution (downgrade tier, swap archetype, force rejection, etc.).
- **Scoring.** Each unresolved demand at end of round 5 contributes to the treaty terms in writing. Player's hand is built from their reputation + signed contracts in advance.
- **Outcome.** Treaty terms become a `seasonalDeclaration` for the next season; both factions absorb the rep deltas inscribed in the treaty.

**Data shapes.**

```ts
// apps/shared/tradeEmpire/tableDiplomacy.ts
export interface DemandCard {
  cardKey: string;
  factionId: GalacticFactionId;
  archetype: "territorial" | "economic" | "ideological";
  tier: "small" | "medium" | "world_shaping";
  demandText: string;
  concessionLine: string;
}
export interface CounterCard {
  cardKey: string;
  effect: CounterEffect; // discriminated union
  flavorText: string;
}
export interface DiplomacySession {
  sessionId: string;
  partyA: GalacticFactionId;
  partyB: GalacticFactionId;
  brokerUserId: number;
  rounds: ReadonlyArray<DiplomacyRound>;
  treatyTermsResolved: ReadonlyArray<string>;
  outcomeDeclarationKey: string | null;
}
```

DB: `diplomacySessions` (sessionId, brokerUserId, partyA, partyB, status, outcomeDeclarationKey, startedAt, resolvedAt).

**UX surface.** New `DiplomacyTable` component embedded in Court tab. 9-faction backdrops (one per faction; art manifest needed). Card animations: framer-motion deal/reveal/counter sequences.

**Wire-in.** New router `tradeDiplomacy.ts` with `startSession`, `playCounter`, `resolveSession`. `resolveSession` writes the resulting declaration into next season's `seasonClockState.declaration`.

**Acceptance.**

- All 9 × 8 = 72 faction-pair matchups resolvable (8 because the player can broker between any two of 9 factions).
- 36 demand cards (3 archetypes × 4 cards × 3 tiers), 12 counter cards minimum.
- Source-scan test pinning the demand-deck export.
- Vitest: a 5-round session always produces a non-empty `treatyTermsResolved` and a valid declarationKey.

**Open questions.** Should the Player-as-Party variant exist in Act 3, or is the player always the broker? (Recommend: Act 3 broker-only; player-as-party unlocks in Act 4 once the player has a seat at the table.) How long is a typical session? (Recommend: 5 rounds × 2 minutes each = 10 minutes max.)

---

## §8.3 — Infiltration Paths

**Hook.** Spy class chains cover identities across sectors; one blown cover can cascade.

**State.** `tradeActiveCovers` table + `activateCoverIdentity`/`blowCoverCheck` exist for single-cover. `classTradeAccess.ts` lists Spy-exclusive sectors.

**Rules.**

- A cover identity has a `chainSlot` (1, 2, 3) and an `infiltrationGraph` neighbor list. A player can hold up to 3 active covers in chain (`chainSlot=1` is primary, 2-3 are auxiliary).
- Each hop in the chain has a per-hop detection roll: `baseDifficulty + (rivalrySum / 10)` where `rivalrySum` is the cumulative rivalry intensity of all sub-houses bridged.
- If a cover is blown, the cascade rule: each chain-adjacent cover suffers a -20 stealth modifier for 24 hours. Two covers blowing in sequence cascade-kills the third.
- Chain composition is constrained — no two adjacent covers may share a `factionId` (cover swapping inside a faction is too obvious).

**Data shapes.** Extend `tradeActiveCovers` with `chain_slot` (int, 1-3), `chain_id` (uuid grouping the chain), `compromised_until` (bigint, ms timestamp). `apps/shared/classTradeAccess.ts` extends `SPY_COVER_IDENTITIES` with `infiltrationGraph: ReadonlyArray<string>` listing valid neighbors.

**UX surface.** Map tab → Spy panel. New "Infiltration Map" view: dossier-style graph showing the player's current chain, dotted lines for valid next hops. Each cover renders with portrait + faction badge + compromised-timer if applicable.

**Wire-in.** `tradeEmpire.ts:activateCoverIdentity` accepts an optional `chainSlot` and `chainId`. `blowCoverCheck` runs the cascade: on blown, set `compromised_until = now + 24h` on all chain-adjacent covers.

**Acceptance.**

- Vitest: cascade math is correct for 1, 2, 3-cover chains.
- E2E: blowing a cover applies cascade modifier to neighbors.
- Source-scan test: infiltration graph is bidirectional and respects the no-adjacent-same-faction rule.

**Open questions.** Is the cover-identity portrait the same as the sub-house portrait, or a distinct "cover headshot"? (Recommend distinct — 12 cover headshots in the art manifest.) Does a blown chain also cost faction rep, or is it pure stealth/access? (Recommend: -10 rep with target faction's enforcement sub-house, applied via `applySubHouseRepDelta`.)

---

## §8.4 — Living Sector Economies

**Hook.** Prices drift continuously based on player + NPC activity. Markets you've flooded crash; markets you've ignored creep up.

**State.** Partial. `tradePriceDrift.ts` has pressure-driven price math. `tradeRouteSaturationService.ts` (177 LOC) implements saturation decay (8-pt bumps, 1-pt/hr decay, multiplier `1 - saturation/400`). `getPriceModifiers` query is wired.

**Rules.**

- **Player-driven flow.** Every mission completion bumps saturation +8 in its sector. Decay 1pt/hr (already wired). Price multiplier `max(0.5, 1 - saturation/400)`.
- **NEW: NPC-driven flow.** Each tick (5min) a `npcEconomyDrift` injector applies per-faction ambient flow:
  - Authority (high-volume institutional): +2 saturation/tick to `trade_nexus`.
  - Hierarchy: +3 saturation/tick to `the_trench`.
  - Antiquarian: -1 saturation/tick to `antiquarian_archive` (they hoard, not flood).
  - Free Ports: +2 saturation/tick spread across the 3 frontier sectors (rotates).
  - Thaloria: 0 (pacifist economy).
  - Insurgency: +1 saturation/tick to whichever sector has a current active mission with insurgency-aligned cargo.
- **Declaration interaction.** When `decl.casino.spread_open` is active, the saturation decay rate doubles (markets resolve faster); when `decl.freeports.barter_season` is active, all NPC-driven flow halves (no credit cleared).

**Data shapes.** No DB change. New module `apps/server/services/npcEconomyDrift.ts` with `runDriftTick(): Promise<void>` reading `seasonClockState.declaration` and writing per-sector saturation.

**UX surface.** Convergence tab — already showing saturation HUD. Map tab — sector tiles show a small price-multiplier read-out next to the threat indicator.

**Wire-in.** `seasonTickService.runSeasonTick` calls `npcEconomyDrift.runDriftTick()` once per tick.

**Acceptance.**

- Vitest: 10 ticks of running phase with the Authority drift active raises `trade_nexus` saturation by exactly 20.
- Vitest: declaration `decl.casino.spread_open` halves the saturation observed after 10 ticks (faster decay).
- Integration: 24 hours of no-player drift returns saturation to 0 in any sector with no NPC injector.

**Open questions.** Should NPC flow be visible to the player as a "flow report" UI element? (Recommend: yes, but only when player rep with the relevant sub-house is ≥ 50 — high-rep characters get the inside view.) Tunable: NPC flow numbers above are starting estimates; expect designer iteration.

---

## §8.5 — Trade Fleets as Companions

**Hook.** Crew companions (Patch, Zephyr-9, Little One) command trade fleets. The fleet picks up the companion's voice + traits.

**State.** Crew system exists; `crewTradeIntegration.ts` (12KB) bridges crew↔trade missions. No fleet-commander assignment.

**Rules.**

- The player has a roster of 3 fleet slots (unlockable by act). Each slot can be assigned to one companion. Companion can be reassigned but only when the fleet is idle (no active mission).
- Per-companion bonuses:
  - **Patch** (engineer): +25% salvage reward on missions; +5 saturation decay/hr in the active sector (Patch fixes things faster than they break).
  - **Zephyr-9** (intelligence): +1 random `intelligence` reward per mission; +10% chance of revealing one hidden clause when signing a contract through this fleet.
  - **Little One** (stealth): -50% spy-cover detection probability when this fleet is in a sector with an active cover; cannot run combat-positive missions (Little One avoids violence).
  - Future companions extend via the same `FleetCommanderTrait` registry.
- Fleet missions cost the same dispatch resources but route their reward stream through the companion's voice (post-mission dialogue uses companion bank).
- **Risk:** fleet attacks (§8.8 Piracy) trigger companion-specific reactions; losing a fleet to piracy costs companion morale (-10) and triggers a recovery quest.

**Data shapes.** New `tradeFleetCommanders` table: (userId, fleetSlot 1-3, companionId, assignedAt, lastIdleAt). Shared registry `apps/shared/tradeEmpire/fleetCommanders.ts` defines `FLEET_COMMANDER_TRAITS: Record<companionId, FleetCommanderTrait>`.

**UX surface.** Map tab — new Fleet Roster panel. Three slots with companion portraits when assigned, "+" empty state. Click slot → companion picker modal.

**Wire-in.** `tradeEmpire.ts:dispatchMission` accepts optional `fleetSlot` (1-3); if present, applies that commander's trait to the mission reward calc. `crewTradeIntegration.ts` extends with the companion-voice routing for completion dialog.

**Acceptance.**

- Source-scan: every defined companion has a `FleetCommanderTrait` entry (or is explicitly excluded).
- Vitest: dispatching a mission with `fleetSlot=1` (Patch assigned) returns +25% salvage reward.
- Vitest: Little One refuses combat-positive missions with a clean error.

**Open questions.** Can a companion be assigned to a fleet AND be in the active battle party? (Recommend: yes, with a -5 morale cost — they're stretched thin.) Do unlocked companions appear automatically, or via a one-time "first fleet" quest? (Recommend: first-fleet quest in Act 2; subsequent companions auto-unlock.)

---

## §8.6 — Sector Memory + Gossip Line

**Hook.** Sectors remember what you did. NPCs in those sectors gossip about it next time you walk in.

**State.** `publicKnowledgeService.ts` is the spine — append-only feed, ring-buffer of recent. NPC banks already read public knowledge for reactive lines.

**Rules.**

- Every public-knowledge event has a `gossipDecayHours` (default 168 = 1 week). After decay, the event is no longer surfaced as gossip but stays in the ledger.
- **Cross-sector contamination.** Events propagate to adjacent sectors at a contamination factor: 0.6 to immediate neighbors, 0.3 to 2-hop neighbors, 0 beyond. A "contaminated" event has its priority weight multiplied by the contamination factor.
- **Gossip-priority weights** (event types that travel further):
  - `contract_signed`: weight 1.0, decay 168h
  - `cover_blown`: weight 1.4, decay 336h (talked about for 2 weeks)
  - `agenda_step`: weight 0.9, decay 168h
  - `demand_paid`: weight 0.7, decay 96h
  - `demand_refused`: weight 1.2, decay 240h
  - `route_milestone`: weight 0.6, decay 120h
  - `mission_outcome`: weight 0.5, decay 72h
  - `climax_resolved`: weight 2.0, decay 720h (a full season)
- **Sector bulletin board.** Each sector renders the top-5 active gossip events the player walks into.

**Data shapes.** Extend `tradePublicKnowledge` with `gossip_decay_hours` (int, default 168), `priority_weight` (decimal). New helper `apps/server/services/publicKnowledgeService.ts:getGossipForSector(sectorId, now)` ranks active events by `priority_weight × contamination_factor × time_decay_factor`.

**UX surface.** Map tab — entering a sector pops a small "Sector talks about..." card showing top-3 gossip events. Court tab feed remains unchanged but adds a sector-filter dropdown.

**Wire-in.** `publicKnowledgeService.postPublicKnowledge` already handles the write path; just add the new fields. New reader `getGossipForSector` is purely additive.

**Acceptance.**

- Vitest: a `cover_blown` event in `trade_nexus` is gossiped in `the_trench` (adjacent) at weight 0.84 (1.4 × 0.6).
- Vitest: events past their decay window are excluded from `getGossipForSector` but still readable via the existing `getRecentPublicKnowledge`.
- E2E: walk into a sector after an event there; the bulletin board shows it.

**Open questions.** Sector adjacency map — does it follow the existing GALACTIC_MAP edges, or is gossip-adjacency separate (slower)? (Recommend: same map; gossip is geographic.) Per-sub-house gossip lines: ~120 lines (24 sub-houses × 5 lines each) — see VO line packs.

---

## §8.7 — Dreamer's Shield playable mystery

**Hook.** The Dreamer Barrier is sealed. The mystery is figuring out how to step through.

**State.** `dreamer_barrier` exists in `GALACTIC_MAP` (threat 0, sealed). Dreamer Shield sub-house is `dreamer_shield_opaque` (unalignable). No unlock chain.

**Rules.**

- **5-step investigation chain:**
  1. **Find the seam.** Trigger: visit `terminus_approach` while reputation with `antiquarian_shelfmates` ≥ 30. Daniel Cross volunteers an annotation suggesting the Shield's mathematical signature breaks at a single coordinate.
  2. **Verify the math.** Sign 3 Antiquarian contracts of any tier — the Cross-References Desk corroborates.
  3. **Find the artifact.** A Wraith Calder dialog reveals an artifact in `panopticon_ruins`. Run an exploration mission there; bring the artifact back.
  4. **Tribute the artifact.** Tribute the artifact to Antiquarian Shelf-mates. The Casino spreads bets on whether the math is right; ignore them. Daniel Cross writes the proof.
  5. **The crossing.** Walk into `dreamer_barrier`. The Shield does not reject the player; it simply does not respond. The sector becomes accessible (still threat 0, but enterable).
- **Once-per-save.** This is a single irreversible chain.
- **Choice gate at step 5.** The player can either: (a) cross alone, or (b) bring Wraith Calder. Different post-crossing flags.

**Data shapes.** Pure narrative flag chain — no new tables. Flags: `dreamer_seam_found`, `dreamer_math_verified`, `dreamer_artifact_recovered`, `dreamer_artifact_tributed`, `dreamer_crossed_alone | dreamer_crossed_with_calder`.

**UX surface.** Map tab — `dreamer_barrier` tile shows a special "?" icon while the chain is active. Court tab — Antiquarian Shelf-mates sub-house panel surfaces the chain progress.

**Wire-in.** Story team owns the dialog/cinematic content. Engine wiring is purely flag-setting in existing dialog trees and the existing `sectorFirstEntered` ripple.

**Acceptance.**

- Vitest: full 5-step chain completes in canonical order; out-of-order steps produce no flag changes.
- Story-team review: each of the 5 steps has authored dialog.

**Open questions.** What does the player find inside the Shield? (Story team — recommend: a single conversation with someone who is both alive and not, transcribed for downstream NPC dialog references.) Is this Act 4 or Act 5? (Recommend: Act 5; Act 4 establishes the Antiquarian rep needed to start.)

---

## §8.8 — Piracy (Act 3+)

**Hook.** Routes can be raided by pirate factions. The player can also turn pirate.

**State.** Nothing built. Manifest exists at `trade_empire_art_prompts__pirate_portrait.csv`.

**Rules.**

- **Raid conditions.** A route is raidable when `runCount ≥ 10` OR `saturation ≥ 120`. Per tick (5min), each raidable route rolls against a per-pirate-faction probability table:
  - **Free Lance** (broad, opportunistic): 8% per tick on routes through Free Ports adjacency.
  - **Dredges** (organized, anti-Authority): 12% on routes through `trade_nexus`.
  - **Spore Picks** (Thought Virus aligned): 15% on routes through `viral_wastes` adjacency.
- **Raid resolution.** A raid takes one in-game day. Resolution:
  - **Defend.** If player has §8.5 fleet commander assigned, runs a defense sub-roll (success = trait-based: Patch +0%, Zephyr-9 +30%, Little One +60%).
  - **Pay tribute.** Player can pay 25% of route's accumulated mission value to wave off; pirate faction gains rep with player.
  - **Lose cargo.** Default. Route's next 3 mission completions yield 0 reward; pirate faction gains "raided" public flag.
- **Player-as-pirate.** Once player has rep ≥ 50 with a pirate faction, unlock `playerInitiateRaid` mutation: target a rival's route, accept the rival's faction's enmity, gain pirate-faction rep.

**Data shapes.** New table `tradePirateRaids` (id, userId, routeKey, pirateFaction, raidStartAt, status: pending|defended|paid|lost, resolvedAt). New shared module `apps/shared/tradeEmpire/pirateFactions.ts` with the 3-faction registry + per-faction probability table + 6 captain portraits keyed.

**UX surface.** Map tab — new "Raids" sub-panel. Active raids show a 24h countdown + Defend / Pay / Concede buttons. Court tab feed posts `route_raided` events.

**Wire-in.** `seasonTickService.runSeasonTick` adds `runRaidRolls()` per tick. `tradeEmpire.ts` adds 3 new mutations: `defendRoute`, `payTribute`, `playerInitiateRaid`.

**Acceptance.**

- Vitest: raid roll for a route with `runCount=10` and `saturation=0` uses the runCount path; `runCount=5, saturation=120` uses the saturation path.
- Vitest: paying tribute ends the raid, debits route's accumulated value, posts the pirate-faction rep event.
- Source-scan: 6 captain portraits keyed in `pirateFactions.ts`.

**Open questions.** Is player-as-pirate available in Act 3 (recommend: yes, with steep rep cost) or gated to Act 4 (writers' call)? Does losing a fleet (§8.5 commander attached) trigger the recovery quest, or just morale? (Recommend: morale only at Act 3; recovery quest at Act 4 once stakes are higher.)

---

## §8.9 — Edicts

**Hook.** Sub-houses issue edicts — temporary policy interventions that bend the rules in their territory for a season.

**State.** `apps/shared/tradeEmpire/edicts.ts` has typed registry stub (Phase D). `tradeCourt.ts` exposes `myActiveEdict`/`issueEdict` procedures; no mechanics behind them.

**Rules.**

- **Edict catalog.** ~15 edicts across 8 factions. Each edict has: `edictKey`, `issuingHouseKey`, `targetScope` (own_sector | own_faction | global), `effectKind`, `durationTicks`, `costToIssue: AgendaCounterCost`, `counterEdictKey` (optional rival edict that nullifies it).
- **Effect kinds:**
  - `price_cap`: capped commodity prices in target scope.
  - `mission_bonus`: +N% reward modifier for missions issued by this sub-house.
  - `faction_tax`: -N credits per mission completion in target scope.
  - `contract_restriction`: certain contract types refuse to sign in target scope.
- **Counter-edicts.** A counter-edict, if issued, nullifies the original. Costs at least as much as the original.
- **One per house per season.** A sub-house can hold at most one active edict at a time. Issuing a new one ends the prior.
- **Public.** Every issued edict posts a `edict_issued` public-knowledge event with full text.

**Data shapes.** New table `tradeEdicts` (id, issuingHouseKey, edictKey, scope, effectKind, durationTicks, issuedAt, resolvedAt, status). Existing `edicts.ts` registry expanded.

**UX surface.** Court tab — Edicts panel shows currently active edicts (per-sub-house) with text + remaining ticks. If player has rep ≥ 50 with a sub-house, they can suggest an edict (server returns a non-binding nudge to the agenda engine).

**Wire-in.** `seasonTickService.runSeasonTick` decrements active-edict timers; expires when 0. `tradeEmpire.ts:completeMission` reward calc reads active edicts via `applyEdictModifier(activeEdicts, baseReward)` (modeled on `applyDeclarationModifier`).

**Acceptance.**

- Source-scan: 15+ edicts across 8 factions in `edicts.ts`.
- Vitest: edict timer decrements correctly across season ticks.
- Vitest: counter-edict nullification math is correct.
- Integration: a price-cap edict caps a commodity in the target sector during its duration.

**Open questions.** Are sub-houses NPC-issuing edicts on their own, or only player-suggested? (Recommend: NPC-issued via the agenda engine — every running phase, the highest-rep sub-house has a 25% chance of issuing one.) The 15-edict catalog needs writers; data shape is locked.

---

## §8.10 — Frontier Rotation

**Hook.** Some sectors are "frontier" — they rotate every season. Last season's frontier becomes consolidated; a new frontier opens elsewhere.

**State.** `apps/shared/tradeEmpire/frontier.ts` (2.3KB) has `FRONTIER_CANDIDATES` (8 sectors) + rotation picker. `seasonTickService` does not call it.

**Rules.**

- **Rotation cadence.** Every season's `interregnum → prologue` transition. Two frontier sectors flip in; two flip out.
- **Selection.** Of the 8 candidate sectors, pick 2 that are NOT currently frontier and NOT been frontier in the past 2 seasons. Tie-break: lowest current `tradeRouteSaturation`.
- **Frontier modifier.** Frontier sectors apply: +50% mission rewards (high-risk-high-reward), +25% saturation per mission completion (the rush floods them), -1 control-level cap (you can never fully consolidate a frontier).
- **Rotation transition narrative.** Ex-frontier sectors keep their accumulated rep but their +50% modifier disappears. Public-knowledge event: `frontier_rotated` with the in/out sector list.

**Data shapes.** Extend `seasonClockState` with `frontierSectorIds: string[]` (length 2). `apps/shared/tradeEmpire/frontier.ts` adds `pickRotation(state, history)` returning the new frontier list.

**UX surface.** Map tab — frontier sectors render with a banner overlay ("FRONTIER" in stencilled type). Convergence tab — small "Frontier This Season" line shows current 2.

**Wire-in.** `seasonTickService.runSeasonTick` on phase transition `interregnum → prologue` calls `frontier.pickRotation()` and persists. `tradeEmpire.ts:completeMission` reward calc applies the +50% if `mission.sectorId` is in the active frontier list.

**Acceptance.**

- Vitest: across 5 seasons, every frontier candidate gets at least one rotation.
- Vitest: a sector that was frontier in season N cannot be re-frontier until season N+3.
- Source-scan: 8 candidates ship in `FRONTIER_CANDIDATES`.
- Integration: a mission completed in a frontier sector pays 1.5x normal reward.

**Open questions.** Does the Convergence Climax force-freeze the rotation? (Recommend: yes — when phase=open or resolved, no rotation fires. The galaxy is otherwise occupied.) Should ex-frontier sectors lose accumulated reputation? (Recommend: no — accumulation is the player's reward for visiting; frontier modifier was the bonus.)

---

## How these compose

The 10 improvements are mostly orthogonal but share three pieces of infrastructure:

1. **Public-knowledge feed** (§8.6 Gossip is the spine; §8.1 Narrative Sectors, §8.2 Diplomacy outcomes, §8.8 raids, and §8.9 edicts all emit into it).
2. **Season clock** (§8.4 NPC drift, §8.9 edict timers, and §8.10 frontier rotation all tick from `seasonTickService`).
3. **Cross-system feedback** (the Wave 0 wiring already merged: §8.4 reads declarations; §8.9 edicts use the same modifier-application pattern as declarations; §8.10 frontier modifier composes with declaration modifier).

Recommended build order:

1. §8.10 Frontier Rotation (smallest, all infra exists).
2. §8.9 Edicts (extends the modifier-application pattern; 15 edicts is a content sprint).
3. §8.4 Living Sector Economies (NPC drift; depends on edict + frontier modifiers stacking).
4. §8.6 Sector Memory + Gossip Line (extends the existing public-knowledge service).
5. §8.1 Narrative Sectors (data + flag wiring; tiny code, story-team content).
6. §8.5 Trade Fleets as Companions (new table, integrates with crew system).
7. §8.3 Infiltration Paths (extends spy covers).
8. §8.8 Piracy (depends on §8.5 fleet defense).
9. §8.7 Dreamer's Shield mystery (story-team narrative chain; small code).
10. §8.2 Table Diplomacy (largest single feature; whole new minigame).

This ordering keeps each step under ~1 sprint of engineering and front-loads the items that other items depend on.
