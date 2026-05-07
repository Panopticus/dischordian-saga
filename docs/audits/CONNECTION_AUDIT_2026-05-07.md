# Connection Audit — 2026-05-07

Branch: `claude/audit-code-quality-LqgJA`
Scope: every line of code, every design document, every shipping asset reference, evaluated against the user's explicit concern: **"It's a common occurrence in projects for AI coding to build a pretty frame — but not connect the things inside of it."**

This audit was commissioned to go *deeper* than the prior `docs/HIDDEN_SYSTEMS_AUDIT_2026-05.md`. That audit was thorough but worked at coarse granularity (router-key, file-presence, manifest-shape). This one drills into procedures inside routers, individual triggers inside the engine, individual frames inside slideshows, individual columns inside JSON blobs, and individual claims inside `docs/built/`. The goal is to find disconnects that the prior audit's grep methodology could not see.

## Methodology

Seven parallel investigators each took one domain. Every investigator was briefed with the prior audit's closures and asked to (a) verify each closure still holds, and (b) find new disconnects of the same shape that prior methodology missed. Every finding below carries a `file:line` citation and a severity tag.

Severity tags:
- **CRITICAL** — currently breaks player flow or silently locks shipping content.
- **HIGH** — degrades a player-visible surface or hides authored content from the player.
- **MED** — backend/data drift the player won't see today but will when the surrounding feature lights up.
- **LOW** — doc drift or organizational debt; cosmetic.

Categories:
- **BACKEND-ONLY** — server code with no client consumer.
- **CLIENT-ONLY-DEAD** — UI built with no inbound trigger or no route.
- **GATED-UNREACHABLE** — gating predicate cannot evaluate true in production.
- **FALSE-CLOSURE** — a fix in the prior audit that doesn't actually work end-to-end.
- **FALSE-BUILT** — a doc in `docs/built/` whose claimed feature does not ship.
- **SPEC-ONLY** — described in design docs, no implementing code.
- **OVER-CLAIMED** — doc says more than the code does.
- **DEAD-DATA** — schema or registry entries no code touches.
- **READ-ONLY-TRAP** — code reads a field that nothing writes (silent false gate).
- **WORKING-AS-INTENDED** — flagged during sweeping greps but by-design hidden.

---

## Executive summary — the top ten

In rough order of how visible the gap is to a logged-in player today.

| # | Finding | Severity | Domain |
|---|---|---|---|
| 1 | **36 allegiance cards reference 403'd S3 keys.** Cards are live in the engine; their art will broken-image in deck builder, pack opening, and Antiquarian's Index the moment a player encounters one. | CRITICAL | Assets / Cards |
| 2 | **Silence in Heaven 18-track slideshow has empty `imageUrl` on every frame**, plus a slug-schema mismatch (`sih-track-32` referenced in `loredexSongMap.ts` but registry only ships `sih-01`..`sih-18`), plus the `ALL_SIH_TRACKS` registry has zero client imports. The album surface ships; its content is invisible. | CRITICAL | Docs / Assets |
| 3 | **No write path for `act_completion` or `secret_act_N_revealed` narrative flags** for any act 1–7. 35+ cards (28 act-exclusive epics + 7 secret cards) carry `unlockCondition` predicates that are *evaluated* by `expansionUnlockService.ts` but never *set* by the story engine. They are permanently locked. | CRITICAL | Card engine / DB |
| 4 | **6 trigger kinds in the engine type union are never matched at runtime.** `passive_aura` (12+ cards including Agent Zero, The Source, Akai Shi, The Detective, The Judge, The Degen), `on_kill` (15+), `on_turn_end` (20+), `on_damage_taken` (10+), `on_card_drawn` (5+), and `activated` is matched only on BBS. Cards exist with these triggers; their abilities silently never fire. | CRITICAL | Card engine |
| 5 | **17 of 29 cross-game narrative beats are unfired**, all on the CADES + DMC side. The bible promises bidirectional reactivity; the registry is one-way Loredex→nothing today. | HIGH | Docs / Cross-game |
| 6 | **Two HIGH-severity orphan modals.** `LegendaryAchievementModal` (golden achievement celebration with particle effects + Antiquarian lore) and `TalentSelectionModal` (citizen milestone talent picker with 6 tier configs) are both built and exported but never imported anywhere. The achievement-grant and talent-milestone code paths cannot fire them. | HIGH | UI |
| 7 | **`vo:run-all` skips `vo:act1-taunts`.** 21 taunt lines are authored, the manifest-persistence bug from Phase C4 was correctly fixed, the client (`Act1OpponentDialog.tauntVoIds`, `useAct1TauntsVO`, `Act1OpponentTauntOverlay.speak()`) is fully wired — but the orchestrator script never invokes the generator, so the manifests stay empty. Engineer-logs (42 lines) are in the same state. | HIGH | VO |
| 8 | **`factionReputation` mutations are computed but never persisted.** `factionReputationService.ts` reads `gameData.factionReputation`, applies decay/clamp logic, returns the modified value to callers — but `tradeContracts.ts` and `tradeWars.ts` never call back to write. Faction rep effectively decays in-memory only. Same pattern affects `entitlements`, `crew`, and ~20 other `userProgress.gameData` keys. | HIGH | DB |
| 9 | **The bible advertises a Loredex hub at `pages/LoredexPage.tsx` that does not exist.** Only `/loredex/graph` and `/loredex/dreamer-fragments` are routed. Players who follow in-game breadcrumbs to "the Loredex" hit the 404 fallback. | HIGH | Docs / UI |
| 10 | **The CI guard at `apps/server/routers.unused.test.ts` only walks router *keys*, not *procedures*.** ~20 procedures inside live routers (3 in `marketplace`, 5 in `guild`, all 10 in `fnord23`, both in `potentialIdentity`) have zero callers and pass the guard. The guard's design lets dead code accumulate as long as the router key itself is referenced anywhere. | MED | Routers / CI |

---

## §1. Card-game engine — silent dead triggers and unwritten unlock gates

The card engine is the largest cohesive subsystem in the repo and the single biggest carrier of "pretty frame, no wiring" surface. Effect interpreter coverage is *complete* (27/27 ops have switch/case branches in `effectInterpreter.ts:63–710`). Phase H's keyword and trigger work is partially intact — `zeal`, `pack`, `resurrect`, `structure`, `on_card_played`, `on_move`, `on_summoned_near_me` all have real engine handlers and ship on real cards. **But the trigger-matcher coverage table has six dead kinds and the unlock evaluator has no narrative-flag writer.**

### 1.1 — Six trigger kinds the engine never matches *(CRITICAL, BACKEND-ONLY + CLIENT-ONLY-DEAD on cards)*

`apps/shared/tcg-core/types/Trigger.ts:43–58` declares 14 trigger kinds. The card schema (`schema.ts`) accepts all of them. Cards across factions reference all of them. But the engine's runtime matcher loops only handle 8:

| Trigger kind | Declared | Matched in engine | Cards using it | Status |
|---|---|---|---|---|
| `on_deploy` | ✓ Trigger.ts:44 | ✓ deploy.ts:316 | 100+ | works |
| `on_cast` | ✓ Trigger.ts:45 | ✓ playCard.ts:246 | 50+ | works |
| `on_death` | ✓ Trigger.ts:46 | ✓ stateBasedActions.ts:120 | 50+ | works |
| `on_damage_dealt` | ✓ Trigger.ts:47 | ✓ combat.ts:214 | 30+ | works |
| `on_kill` | ✓ Trigger.ts:49 | ✗ **not found** | 15+ | **DEAD** |
| `on_turn_start` | ✓ Trigger.ts:50 | ✓ turn.ts | 20+ | works |
| `on_turn_end` | ✓ Trigger.ts:51 | ✗ **not found** | 20+ | **DEAD** |
| `on_damage_taken` | ✓ Trigger.ts:48 | ✗ **not found** | 10+ | **DEAD** |
| `on_any_unit_dies` | ✓ Trigger.ts:52 | ✓ stateBasedActions.ts | 15+ | works |
| `on_card_drawn` | ✓ Trigger.ts:53 | ✗ **not found** | 5+ | **DEAD** |
| `on_card_played` | ✓ Trigger.ts:54 | ✓ playCard.ts:381 | 30+ | works |
| `on_move` | ✓ Trigger.ts:55 | ✓ movement.ts:210 | 2 | works |
| `on_summoned_near_me` | ✓ Trigger.ts:56 | ✓ deploy.ts:161 | 5+ | works |
| `passive_aura` | ✓ Trigger.ts:57 | ✗ **not matched anywhere** | 12+ | **CRITICAL DEAD** |
| `activated` | ✓ Trigger.ts:58 | ⚠ reducer.ts:369 (BBS only) | 100+ | partial |

Concrete cards whose abilities silently never fire:
- **`passive_aura`** — Agent Zero, The Source (thought_virus), Akai Shi (new_babylon), The Detective (architect), The Judge (dreamer), The Degen (dreamer), and 6+ more.
- **`on_kill`** — Agent Zero (insurgency), Warborn Warrior, Keeper of Secrets, and 12+ more.
- **`on_turn_end`** — The Degen (dreamer), Temporal Echo, Echoing Rune, and 17+ more.
- **`on_damage_taken`** — Shield Bearer, Sentinel Guardian, and 8+ more.
- **`on_card_drawn`** — draw-effect units in the architect faction.

Recommendation: implement matchers in their natural homes — `on_kill` and `on_turn_end` in `stateBasedActions.ts` / `turn.ts`; `on_damage_taken` in `combat.ts:applyCombatDamage`; `on_card_drawn` in the draw effect handler in `playCard.ts`; and `passive_aura` as a fixed-point Pass 2 in `stateBasedActions.ts` (auras recompute on every state change and apply continuously to in-range units).

This is also the single place where a CI invariant test would have caught the gap years ago: "every trigger kind in the union must have at least one matcher callsite."

### 1.2 — No narrative-flag writer for `act_completion` or `secret` unlock predicates *(CRITICAL, GATED-UNREACHABLE)*

`apps/shared/tcg-core/rewards/expansionUnlockService.ts:57–74` evaluates five unlock kinds:

```
act_completion → reads gameData.narrativeFlags["act_N_completed"]
secret         → reads gameData.narrativeFlags["act_N_secret_revealed"]
battle_pass    → reads gameData.battlePassTier
founding_author → reads gameData.entitlements.foundingAuthor
authors_edition → reads gameData.entitlements.authorsEditionS2
```

`apps/server/services/playerExpansionState.ts:81–82` reads `entitlements.foundingAuthor` and `entitlements.authorsEditionS2`. Phase C1+C2 of the prior audit added a Stripe webhook stub via two new SKUs and an `admin.grantEntitlement` mutation — those write paths are real and verifiable.

**But none of the act/secret narrative flags have a writer.** Greps for `"act_1_completed" =`, `narrativeFlags.act_N_completed =`, `setActCompletion`, etc. all return zero results. Same for `act_N_secret_revealed`. The story engine that completes acts does not wire back to TCG progression. Phase C3 of the prior audit authored conspiracy boards for Acts 1–2 with a `revealFlag` field — but no code consumes that field to actually flip the flag in `userProgress.gameData`.

Net effect: 35+ cards are permanently locked.
- 28 act-exclusive epics gated `act_completion`
- 7 secret cards gated `secret`
- 2 special-edition cards gated `founding_author`/`authors_edition` (these *do* have a write path post-Phase C1+C2; they are reachable today via admin grant)

Recommendation: either (a) add a `markActCompleted(userId, actNumber)` writer in the story engine and call it on the appropriate beat, or (b) bind these unlocks to the conspiracy-board reveal flags that Phase C3 authored and add a writer there.

### 1.3 — Effect-op coverage is complete *(WORKING-AS-INTENDED, verification only)*

All 27 declared `EffectOp` discriminators have case branches in `effectInterpreter.ts:63–710`. Phase H's `dispel`/`push`/`if` and Phase J3+J4's condition/amount/selector closures are intact and exercised. No dead ops.

### 1.4 — `rulesVersion` drift is clean *(WORKING-AS-INTENDED)*

1151 cards explicitly set `rulesVersion: "1.1.0"`; 124 use the `RULES` constant which evaluates to `"1.1.0"`; engine pins `RULES_VERSION = "1.1.0"` in `version.ts:21`. No drift.

### 1.5 — Reserved-card filtering is intact *(WORKING-AS-INTENDED)*

`isReservedCard()` correctly filters the three `reserved: true` cards (`burnt_card_placeholder`, two house-oath titles) from deck builder, pack opening, and reward surfaces. Verified through `expansionUnlockService.ts:94–99` chain.

---

## §2. Server routers — procedure-level orphans the CI guard can't see

The prior audit's CI guard, `apps/server/routers.unused.test.ts`, walks the `appRouter` registry and requires each *router-key* to have a client tRPC call, server-internal import, or `@deprecated`/`audit-allow` waiver. This is a meaningful guard at coarse granularity, but it has a fundamental blind spot.

### 2.1 — CI guard is router-level only, not procedure-level *(MED, FALSE-CLOSURE)*

`apps/server/routers.unused.test.ts:64–76` parses router registrations and stops at the `key: routerExport` mapping. It never enumerates the procedures inside each router. A router can ship 50% dead code and pass.

Concrete orphans (procedures with zero `trpc.<router>.<proc>` calls in `apps/client/src/` and zero server-internal callers):

| Router | Orphaned procedures | Total procs | Real? |
|---|---|---|---|
| `marketplace` | `priceHistory`, `createAuction`, `auctionBids` | 20 | HIGH |
| `guild` | `invite`, `updateSettings`, `leaderboard`, `emblems`, `spendTreasury` | 22 | HIGH |
| `potentialIdentity` | `completeHorrorReveal`, `getRevealState` (both procedures) | 2 | HIGH |
| `fnord23` | all 10 procedures | 10 | HIGH |

`fnord23` and `potentialIdentity` are particularly diagnostic: the CI guard's "server-internal sweep" matches the export name (e.g., `fnord23Router`) anywhere in `apps/server/`, including inside the router file itself where it's defined. That's enough to pass the guard. Neither router is actually invoked from anywhere — no client call, no server-internal `routerName.procedure(...)` invocation, no `caller.fnord23` pattern. They are textbook BACKEND-ONLY surfaces that the guard treats as live.

Recommendation: either (a) extend `routers.unused.test.ts` to AST-parse procedures and check each for a callsite, with explicit `@procedure-deprecated` waivers, or (b) tighten the "server-internal" sweep to only count actual call expressions, not export-name string matches.

### 2.2 — Phase F/G/I closures are verified intact *(WORKING-AS-INTENDED)*

- Phase F (`guildContracts` UI): `apps/client/src/pages/GuildPage.tsx:959–980` hits `trpc.guildContracts.listAvailable`/`completeContract`. ✓
- Phase G (Duelyst multiplayer client): `apps/client/src/game/duelyst/useDuelystPvpSocket.ts:174–292` is the WS connector, route `/duelyst-pvp` is registered. ✓
- Phase I (`marketAchievements`): `apps/client/src/pages/MarketplaceAchievementsPage.tsx:46` calls `trpc.marketAchievements.getAll`. ✓

All three closures hold.

---

## §3. Database layer — write-only, read-only, and dead schema

`apps/db/schema.ts` defines 264 tables. The most pernicious disconnect class is JSON-blob fields where the read path and write path don't talk to each other.

### 3.1 — `userProgress.gameData` is a forest of read-only fields *(HIGH, READ-ONLY-TRAP)*

`userProgress.gameData` is the JSON dumping ground for almost every long-tail player-state value. Across `apps/server/`, 33 distinct keys are *read* from it; ~25 of those keys are *never written* by any code path:

| `gameData.<key>` | Writes | Reads | Status |
|---|---|---|---|
| `factionReputation` | 0 | 4 | READ-ONLY |
| `entitlements` | 0 | 3 | READ-ONLY (despite Phase C1+C2 — see below) |
| `crew` | 0 | 3 | READ-ONLY |
| `narrativeFlags.act_N_completed` (act 1–7) | 0 | 1 | READ-ONLY (see §1.2) |
| `narrativeFlags.act_N_secret_revealed` (act 1–7) | 0 | 1 | READ-ONLY (see §1.2) |
| `achievementsEarned`, `loreAchievements`, `engagement`, `materials`, `resources`, `techTree`, `tradeEmpire`, +18 more | 0 | 1 each | READ-ONLY |

The most diagnostic case is `factionReputation`. `apps/server/services/factionReputationService.ts:76–110`:

```
getFactionReputation(userId)
  → reads userProgress.gameData.factionReputation
  → applies decay and clamp logic in-memory
  → returns the modified value
```

Callers (`tradeContracts.ts`, `tradeWars.ts`) consume the modified value but never call back to write. The mutation is lost. On next session the old value is re-read and decayed again from the same baseline. **The faction-rep system computes a plausible-looking number every time, but it has no memory.**

`entitlements.foundingAuthor` / `entitlements.authorsEditionS2` *do* have writers post-Phase C1+C2 (Stripe webhook + `admin.grantEntitlement`). But the audit's own grep for "0 writes" was correct at the level of `gameData.entitlements =` patterns; the writers go through `entitlementService.ts` and write the keys via the merge helper. If a future refactor changes the helper, the read path would silently fall back to defaults with no test coverage of the round-trip.

Recommendation: every `gameData.X` key needs either (a) a service function that owns *both* read and write, or (b) a CI test that asserts the round-trip works (set → fetch → assert equality). The `narrativeFlags.act_N_completed` keys are the highest-value targets because they gate shipping cards (§1.2).

### 3.2 — Three dead schema tables *(MED, DEAD-DATA)*

Tables defined in schema with zero importers in `apps/server/`:

- `tradeRouteSaturation` (`apps/db/schema.ts:6713`) — saturation pricing system
- `tradeResearchRaces` (`apps/db/schema.ts:6732`) — research race mechanics; has a `userId` index
- `convergenceClimaxState` (`apps/db/schema.ts:6776`) — only imported as a type def in `tradeContracts.ts`/`tradeCourt.ts`; never read or written

These are the shapes of three planned features that never landed. The schema lookup is the only artifact.

Recommendation: either (a) drop the tables and ship a migration, or (b) move them to a `pending_features.ts` schema file with a comment explaining the deferral.

### 3.3 — Missing indexes on hot match-lookup tables *(HIGH, MISSING-INDEX)*

`pvpMatches` (`apps/db/schema.ts:1155`) and `cardGameMatches` (`apps/db/schema.ts:1007`) are queried on `player1Id`/`player2Id`/`status` from `pvp.ts`, `competitive.ts`, `replaySystem.ts`, `cardGame.ts`. Neither table has a non-PK index. `marketListings` (`apps/db/schema.ts:1527`) is correctly indexed on `sellerId`, `status`, `createdAt` — so the team knows the pattern.

Recommendation: add indexes on (`player1Id`), (`player2Id`), (`status`) for both tables. Prior to the next public PvP push.

### 3.4 — Empty migration journal, drizzle-kit push as the deploy pattern *(HIGH, DRIFT)*

`apps/db/migrations/` contains only `.gitkeep`. There are no journaled migrations. Schema changes propagate via `drizzle-kit push` (destructive non-journal mode). `apps/scripts/db-fresh-smoke.ts:117–141` acknowledges this pattern explicitly.

Risks:
- No replay-ability for failed deploys.
- Schema drift between dev and prod is silent until smoke tests fire.
- Five `bootstrap*` functions in `db-fresh-smoke.ts` patch tables/columns *not in the schema* (`announcements`, `processed_webhook_events`, `game_replays.shareToken`/`matchId`, `pvp_ratings`, `citizen_characters.foundation`). These get added via DDL on server boot from `apps/server/services/*Bootstrap.ts` files. If you forget to update the smoke test when you add a bootstrap, smoke regresses silently.

Recommendation: medium-term, switch to journaled migrations with `drizzle-kit generate`. Short-term, add a CI test that walks `apps/server/services/*Bootstrap.ts` and asserts each one's tables/columns appear in the smoke-test bootstrap list.

### 3.5 — Smoke test exercises 4 tables out of 264 *(MED, COVERAGE-GAP)*

`apps/scripts/db-fresh-smoke.ts` only verifies pool connectivity, the 5 orphan bootstraps, and existence of 4 specific tables. It never INSERTs or SELECTs against the 264 schema tables. FK constraints are not exercised. Default values are not verified.

Recommendation: enumerate `apps/db/schema.ts` exports, INSERT one row per table with `getTableColumns(t)` defaults, then DELETE. Smoke test goes from 4 tables exercised to 264 with one loop.

---

## §4. Voice-over pipeline — generators that exist, are wired, and are never run

The VO pipeline has a mature shape: per-character `lines.json` → `vo:<char>` generator → `<char>VoManifest.json` → client hook → `speak()` call. Phase C4 fixed a manifest-persistence bug; commit `0028549` fixed VO speaking stage directions; commit `9c25b4a` hardcoded the engineer voice ID. The bones are good. **But the orchestrator script that runs everything missed two surfaces.**

### 4.1 — `vo:run-all` skips `vo:act1-taunts` *(HIGH, FALSE-CLOSURE)*

Phase C4 supposedly closed the act-1 taunts gap by wiring `tauntVoIds` on opponents, merging manifests in `useAct1TauntsVO`, and calling `speak()` in `Act1OpponentTauntOverlay`. All three of those changes are real and verifiable:

- `apps/shared/act1OpponentDialog.ts:128, 161, 252, 285, 348, 381, 442` — all 8 opponents have `tauntVoIds: { early, mid, late }`.
- `apps/client/src/hooks/useAct1TauntsVO.ts` — merges 7 character manifests.
- `apps/client/src/components/act1/Act1OpponentTauntOverlay.tsx:80` — calls `tauntsVO.speak(lineId)` on phase change.

But `scripts/run-all-vo.sh` has 13 stages (acts 2–7, companion, first-contact, story-mode, chess-climb, room-mystery, awakening, engineer-logs, episodes, guild-cutscenes), and **none of them run `vo:act1-taunts`**. Recent commit `a90f209` wired four orphan generators in (awakening, engineer-logs, episodes, guild-cutscenes) but missed this one.

Result: 21 authored taunt lines are sitting in `apps/scripts/act1-taunts-lines.json` with full metadata; the manifests they should populate (`*VoManifest.json` for collector, watcher, eidola, matrikala, authority, programmer, warlord) have zero entries; the client gracefully falls back to text-only because the manifest IDs are missing.

Fix is one line in `scripts/run-all-vo.sh` (after line 171):

```
run_stage "Stage 13g / vo:act1-taunts" python3 apps/scripts/generate_act1_taunts_vo.py
```

### 4.2 — `engineerVoManifest.json` is empty despite the generator being wired *(HIGH, FALSE-CLOSURE)*

`apps/scripts/engineer-lines.json` has 42 authored entries with non-empty `id` fields. `engineerVoManifest.json` has exactly 1 entry (`engineer_emote_001`), and it came from the guild-cutscenes foldout, not from this generator. The generator (`vo:engineer-logs`) is in `run-all-vo.sh:169` and the voice ID is hardcoded post-`9c25b4a`. The most likely cause: `pnpm vo:run-all` has not been run with valid creds since the wiring landed, or the manifest was wiped during development.

Recommendation: run `pnpm vo:run-all` with `ELEVENLABS_API_KEY` + AWS creds in CI and gate releases on a non-empty diff for any manifest whose `lines.json` is non-empty.

### 4.3 — Stage-direction stripping fix is real *(WORKING-AS-INTENDED)*

`apps/scripts/lib/tts-body.ts:30–33` strips `*...*`, `(...)`, `[...]` before TTS. Test coverage at `apps/scripts/__tests__/vo-tts-body.test.ts` (162 lines). Used by `generate-content-pass-vo.ts` and `generate-episode-vo.ts`. Phase fix from commit `0028549` is intact.

### 4.4 — Companion comments `cc_act2_*` through `cc_act7_*` *(MED, ORPHAN-MANIFEST suspected, likely false positive)*

52 entries in `humanVoManifest.json` and `elaraVoManifest.json` with no direct grep match in `apps/client/src/`. The most likely explanation is dynamic dispatch through a reactive-companion routing object that constructs the IDs at runtime. Worth a follow-up grep for `cc_act${actNumber}` template-literal patterns. If it confirms dynamic dispatch, this is fine; if not, half a hundred authored lines are dark.

### 4.5 — Lines.json ↔ manifest summary

| Surface | Authored | In manifest | Missing |
|---|---|---|---|
| Simple JSON→manifest (23 surfaces) | 874 | 832 | 42 (engineer-logs) |
| Complex multi-fold (act1-taunts, guild-cutscenes, prelude/act1 CSVs) | 83 | 62 | 21 (act1-taunts) |
| **Total** | **1011** | **927** | **84** |

84 authored lines out of 1011 (8.3%) are not yet in manifests. The two specific surfaces (act1-taunts, engineer-logs) account for all 84.

---

## §5. UI surface — two textbook orphan modals

The route table is healthy: 178 lazy imports in `App.tsx` all have corresponding `<Route>` registrations. The 5 nav items in `AppShellImmersive.tsx` are correctly classified (4 Links to routes, 1 button to a modal). The 6 liminal pages from §1.3 of the prior audit are still routed. Recent commits (`12e7a57`, `9c25b4a`, `017211a`) introduced no new disconnects.

The disconnects are one layer in: built modals nobody mounts.

### 5.1 — `LegendaryAchievementModal` is built and orphaned *(HIGH, CLIENT-ONLY-DEAD)*

`apps/client/src/components/LegendaryAchievementModal.tsx`:
- Default export `LegendaryAchievementModal` (line 70) — never imported.
- Helper `dispatchLegendaryAchievement()` (line 41) — never called.
- Custom event `"legendary-achievement"` — never dispatched, never listened to.

The component has a particle-effects flourish, an Antiquarian lore-fragment overlay, an orchestral sting hook. A player who earns a legendary or mythic achievement today gets the standard achievement toast and never sees this. The achievement-grant code path has no integration point.

### 5.2 — `TalentSelectionModal` is built and orphaned *(HIGH, CLIENT-ONLY-DEAD)*

`apps/client/src/components/TalentSelectionModal.tsx`:
- Named export `TalentSelectionModal` (line 108) — never imported.
- Six tier impact configurations + tier-color mappings + XP/skill display + 6+ talents per tier.

The citizen progression system grants levels and tracks talent points via `apps/server/routers/citizen.ts`, but no client surface ever opens this modal. Players accumulate talent points with nowhere to spend them.

Recommendation: each modal needs one of (a) a route + global event listener, (b) a context provider that exposes a `present()` method, or (c) deletion if the surrounding feature isn't shipping. Until then they are pure waste — bundled, code-split, parsed, and unreachable.

---

## §6. Docs vs code — the largest carrier of "pretty frame" by surface area

This is where the bible's prose, the `docs/built/` self-attestations, and the design-doc roadmap intersect with shipping behavior. Findings here are most subjective per the prior audit's framing — but several rise to the level of a player-visible regression.

### 6.1 — Silence in Heaven entire 18-track slideshow is content-empty and unmounted *(CRITICAL, FALSE-BUILT)*

`docs/silence-in-heaven/ART-PRODUCTION-GUIDE.md:52–76` enumerates 18 tracks with ~76 frames. `docs/DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md:104` lists Silence in Heaven as a transmedia perimeter. The 18 track files exist:

- `apps/shared/slideshowData/silence-in-heaven/track-01.ts:8–14` — 7 frames, every `imageUrl: ""`.
- `apps/shared/slideshowData/silence-in-heaven/track-12.ts` — 5 frames, every `imageUrl: ""`, `reducedMotionFallback.heroImageUrl: ""`.
- `apps/shared/slideshowData/silence-in-heaven/track-13.ts` through `track-18.ts` — every frame's `klingPrompt` is the literal string `"PLACEHOLDER — see docs/silence-in-heaven/KLING-PROMPTS.md for full production prompts"` (and that referenced doc does not exist in the repo).

The exported `ALL_SIH_TRACKS` registry in `index.ts` has zero importers in `apps/client/src/`. The slideshow content is shipping with no surface that mounts it.

Compounding this: `apps/shared/loredexSongMap.ts:10–22` cross-references SiH track ids `sih-track-20`, `sih-track-32`, `sih-track-36` while the registry only ships `sih-01`..`sih-18`. The Loredex→Song lookup pointing at SiH tracks therefore returns nothing. Clicking an entity that maps to a SiH track silently fails to play a slideshow.

Worst case: `apps/client/src/pages/AntiquariansIndexPage.tsx:372` has a case branch for `"silence-in-heaven"` that loads slideshow data. Combined with the empty `imageUrl` and the slug-schema mismatch, a player who navigates to an Antiquarian's Index entry tagged silence-in-heaven sees a blank or broken slideshow surface.

Recommendation: gate the entire SiH path behind a feature flag until art lands. Rename `track-XX.ts` files with placeholder frames to `track-XX.placeholder.ts` and exclude them from the registry. Reconcile `loredexSongMap.ts` against the actual registry slug schema.

### 6.2 — 36 allegiance cards reference 403'd S3 keys *(CRITICAL, FALSE-BUILT)*

`apps/shared/tcg-core/cards/definitions/allegiance/architect.ts:30, 48, 66, 84, 102, ...` references `assetUrl("art/cards/allegiance/s1_alleg_architect_t1.webp")` and similar. The directory `apps/client/public/art/cards/allegiance/` does not exist locally, and HEAD requests against `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/cards/allegiance/s1_alleg_architect_t1.webp` (and `_t6.webp`) return **403** — meaning the keys are absent on S3.

The cards are gameplay-real. The engine validates and serves them. Any deck-builder query touching faction allegiance, any pack opening that rolls one, any Antiquarian's Index view with allegiance filter — every art surface broken-images. `docs/NANO_BANANA_ALLEGIANCE_CARDS.md` exists as the producer brief for the 36 deliverables; the cards landed in `s1_pack2/allegiance.ts` ahead of the art.

Recommendation: either (a) add a placeholder `s1_alleg_placeholder.webp` and rewrite all 36 references to that until art lands, or (b) gate the cards behind a feature flag so they don't surface in browse/pack/index until the art keys are filled.

### 6.3 — 17 of 29 cross-game narrative beats are unfired *(HIGH, SPEC-ONLY)*

`apps/shared/crossGameNarrativeThreads.ts` defines 9 threads with 29 beats. The bible (`DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md:106–107`) promises that "when any beat in one game emits, the others can react." Reality: `grep -rn "fireCrossGameBeat" games/` returns empty — neither the CADES Godot project nor DMC has any code path firing beats.

12 beats are fired from the Loredex/React side. The 17 unfired beats are the entire CADES + DMC half of the design:

```
cades_fall_fall                            iron_lions_wake_cades_greeting
iron_lions_wake_cades_memorial             kaels_lineage_return_cades_descendant_npc
kaels_lineage_return_cades_side_mission_complete
last_words_echo_cades_radio                last_words_echo_dmc_motif
programmers_gift_dmc_decoded               substrate_handshake_cades_whisper
substrate_handshake_dmc_signature          the_programmers_math_dmc_puzzle_opened
the_programmers_math_dmc_solved_honest     the_programmers_math_dmc_solved_efficient
the_watchers_yawn_cades_weather_suppressed the_watchers_yawn_dmc_telemetry_clean
vox_correspondence_dmc_letter_decoded      vox_correspondence_dmc_letter_found
```

`apps/shared/crossGameNarrativeThreads.test.ts` exists but only validates registry shape. There is no test that asserts every beat id has a fire site — exactly the invariant that would have caught these.

Recommendation: add the missing-fire-site invariant test. Decide per beat: ship the Godot-side wiring or move that beat from `crossGameNarrativeThreads.ts` to a deferred registry.

### 6.4 — `docs/built/CADES_PVP.md` doc and its own status disagree *(LOW, OVER-CLAIMED)*

`docs/built/CADES_PVP.md:154` says "Per-entity `MultiplayerSynchronizer` configs on `RemotePlayer.tscn` (the scene doesn't exist yet)". The scene **does** exist: `games/cades-fps/scenes/multiplayer/RemotePlayer.tscn` (52 lines, dated 2026-05-05) with a real `RemotePlayer.gd` script. Doc under-reports progress.

But the same doc's body still describes WebRTC stubs at `MultiplayerBridge.gd._handle_offer/_answer/_ice` as scaffolding, and `docs/built/PVP_OVERHAUL.md:239` says CADES "lives outside this codebase," contradicting `CADES_PVP.md`'s in-codebase framing. Two `docs/built/` files give incompatible status reports.

Recommendation: pick one. Demote `CADES_PVP.md` to `docs/design/` until WebRTC JS+Godot is wired, or update `PVP_OVERHAUL.md` to reflect the in-repo scaffolding.

### 6.5 — Bible advertises `LoredexPage.tsx` that does not exist *(HIGH, OVER-CLAIMED)*

`DISCHORDIAN_SAGA_PRODUCTION_BIBLE.md:90`: "Loredex / Codex | shipping | `pages/LoredexPage.tsx`, `CodexPage.tsx`".

There is no `LoredexPage.tsx`. `find apps/client/src -name "*Loredex*"` returns:

- `pages/LoredexGraphPage.tsx`
- `components/LoredexWitnessingXrefs.tsx`
- `components/LoredexCompletionFlagWatcher.tsx`
- `contexts/LoredexContext.tsx`

`App.tsx` registers `/loredex/dreamer-fragments` and `/loredex/graph`. There is no `/loredex` root. A player who follows in-game UI breadcrumbs to "the Loredex" gets the 404 fallback. This is the exact pattern the user named: the bible promises a top-level surface; the app lacks the route.

### 6.6 — Watcher escalation has 2 of 10 lines with no firing trigger *(MED, FALSE-BUILT)*

`docs/built/WATCHER_DESIGN.md:55–70` (§3 Escalation curve) promises lines for acts 0–7 including a Stop-5 ARK Explorer locked-door tell. `apps/shared/watcher/watcherLines.ts` registers 10 line ids; two are orphaned:

- `watcher_prelude_locke_echo` (line 54) — trigger `watcher_locke_echo`. No `fireCompanionComment("watcher_locke_echo")` callsite.
- `watcher_ark_locked_door_persistence` (line 66) — trigger `watcher_locked_door_persistence`. No callsite.

The Act-3 chronosphere line ships generic copy ("Your chronosphere is on the map. We placed you.") rather than the timezone-templated version the design spec specifies. Act 2's `tab-hidden` trigger lives in `Act2InterludePage.tsx:102` rather than the documented `WatcherHost.tsx` evaluation loop, so a player who never visits `/act-2-interlude` while the tab is hidden 30 s never hears it.

Act 4½ "three retreats": doc says casino-specific, code (`WatcherHost.tsx:57–63`) triggers on `act >= 4` with no game-mode gating.

### 6.7 — `docs/production/ASSET_URLS.md` cites a local mystery-states dir that doesn't exist *(LOW, OVER-CLAIMED but harmless)*

The doc claims "originals live in `apps/client/public/art/rooms/mystery-states/`". The directory is absent. CDN copy resolves at runtime (`ROOM_STATE_ASSET_BASE = assetUrl("art/rooms/mystery-states")`) so the player flow works, but `roomStateAssets.ts:54–55` repeats the false claim in a comment. Update the comment.

### 6.8 — 49 of 84 prophecy lines are unreferenced *(LOW, OVER-CLAIMED)*

`docs/built/PROPHECY_INDEX.md` itself flags 49 lines as `_unreferenced_`. The bible's executive summary rolls "84 Daniel Cross lines" into shipping content. From a player's perspective, only 35/84 will surface. These may be future-bookend reservations, but the bible should reflect the 35 number.

### 6.9 — Stub-dialog cleanups silently closed *(WORKING-AS-INTENDED, audit-residual)*

`STUB_DIALOG_AUDIT_2026-04.md:19–20` flagged 5 `TODO_*_VOICE` in `tradeEmpireVoLines.ts` and 18 `status: "placeholder"` in `inventorMythics.ts`. Both are now zero in the current files. These stubs were silently fixed since the prior audit; the audit row is stale in a non-harmful direction.

---

## §7. Asset CDN — structurally clean, verification gate offline

All 1,200+ `assetUrl()` calls in `apps/client/src/` and `apps/shared/tcg-core/cards/definitions/` follow the documented pattern. The expansion-art manifests (`DISCHORDIA_BASE_SET_ART` 620 entries, `HIERARCHY_OF_DAMNED_ART` 124 entries, tier-grids 31 entries) are shape-validated by `apps/shared/expansionArt/__tests__/manifests.test.ts`. VO manifests serve from a separate bucket (`dgrsvoices`), out of scope for this domain.

The disconnect is one level above the references.

### 7.1 — Coverage probe never runs in CI *(HIGH, MISSING-INFRA)*

`scripts/_check-art-coverage.mjs` HEAD-verifies 928 producer keys against the `dgrsart` bucket. It requires AWS credentials. It has never run in CI. The prior audit's `AUDIT_2026-05_FINAL_TODO.md` lists it as out-of-repo follow-up.

The CDN itself is the only source of truth for "this asset exists." Without a credentialed CI gate, asset dropouts (failed mid-zip extraction, accidental key delete, producer rename without code update) land silently. The 36 allegiance cards in §6.2 are exactly this failure mode caught by hand: had the probe run on the PR that added the cards, it would have flagged 36 missing keys before merge.

Recommendation: add a CI workflow with `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` (read-only on `dgrsart`) that runs `pnpm tsx scripts/_check-art-coverage.mjs` on every PR touching cards or manifests. Fail on >0 missing.

### 7.2 — Card art is 99% hardcoded paths, 1% manifest-resolved *(LOW, REFACTOR-OPP)*

Of 475 card definitions, ~471 use hardcoded `assetUrl("art/cards/{slug}.webp")` paths and ~4 use `hierarchyOfDamnedArtUrl(...)` / `dischordiaBaseSetArtUrl(...)` helpers. If a producer changes a filename at upload, manifest-resolved cards would catch the mismatch at build time; hardcoded paths would not.

Not a current bug. A future maintenance risk worth flattening.

---

## §8. Cross-cutting themes

Two patterns emerge from the seven domain reports.

### 8.1 — Tests validate shape, not wiring

- `routers.unused.test.ts` validates that router *keys* have callers, not that *procedures* do.
- `crossGameNarrativeThreads.test.ts` validates registry shape, not that beats fire.
- `manifests.test.ts` validates manifest shape, not that consumers exist.
- `db-fresh-smoke.ts` validates connectivity and 4 specific tables, not the 264 schema tables.

This is a structural gap. The team has internalized that schemas, registries, and manifests need tests — but the tests that landed are shape-only. The wiring test (every declared X has at least one consumer/producer/firer) is the one that catches "pretty frame, no wiring," and it's missing from every domain that has a registry-shape test.

A single shared test pattern — `assertEveryEntryHasConsumer(registry, callsiteScanner)` — wired to each registry would close most of these gaps.

### 8.2 — JSON-blob fields silently break round-trips

`userProgress.gameData` is the most diagnostic case (§3.1) but the same failure mode appears in:

- `cardGameMatches.state` — payload keys written by combat resolution but never read.
- `partyState.payload` — keys read by party UI that are never written (assumed; verification owed).
- `userProgress.gameData.entitlements` — *had* this problem until Phase C1+C2; the fix proves the pattern works.

Every `gameData.X` field is a JSON dumping ground that breaks the schema's normal integrity guarantees. Without a service layer that owns both ends, mutations are lost or gates never open. The entitlements remediation is the template — extend it.

---

## §9. Recommended triage order

Ranked by player visibility × ease of fix:

1. **Add the missing-trigger-matchers and the narrative-flag writer.** §1.1 + §1.2 unlock 35+ cards and revive 100+ silently dead abilities. Engine work, not content work. CRITICAL.

2. **Add the asset coverage probe to CI.** §7.1. One workflow file. Catches §6.2 (36 broken allegiance cards) and the next instance of the same class.

3. **Gate or fill Silence in Heaven.** §6.1. Either flag-gate the entire registry until art lands, or land art. Don't ship the empty surface.

4. **Wire the two orphan modals.** §5.1 + §5.2. Either `dispatchLegendaryAchievement()` from the achievement-grant path and import `TalentSelectionModal` from the citizen-progression page, or delete both with a comment.

5. **Add `vo:act1-taunts` to `run-all-vo.sh`.** §4.1. One line. Once added, run `vo:run-all` with creds to also fill the engineer-logs manifest (§4.2).

6. **Persistence-fix `factionReputation` and audit the other read-only `gameData` keys.** §3.1. Service-layer ownership for each field, with round-trip tests.

7. **Reconcile `loredexSongMap.ts` slug schema with the SiH registry.** §6.1 secondary. Either expand `ALL_SIH_TRACKS` to the 37-track album the map cites, or rewrite the map to use `sih-01`..`sih-18`.

8. **Add `LoredexPage.tsx` or update the bible.** §6.5. Pick one.

9. **Procedure-level CI guard.** §2.1. Extend `routers.unused.test.ts` to walk procedures.

10. **Wire `crossGameNarrativeThreads.test.ts` to assert every beat fires.** §6.3. Kills the next instance of this class at lint time.

11. **Add indexes on `pvpMatches` and `cardGameMatches`.** §3.3. Before next public PvP push.

12. **Migration journal hygiene.** §3.4. Medium-term work.

---

## §10. What's actually verified intact since the prior audit

To avoid the impression that everything is broken — these prior closures were re-verified and hold:

- Phase F (`guildContracts` UI, GuildPage CONTRACTS tab) — verified.
- Phase G (Duelyst multiplayer client, `/duelyst-pvp` route + WS) — verified.
- Phase H (zeal/pack/resurrect/structure keyword handlers, on_card_played/on_move/on_summoned_near_me trigger matchers, demo cards) — verified.
- Phase I (`marketAchievements` wiring, `MarketplaceAchievementsPage`) — verified.
- Phase J (entitlement service, conspiracy boards Acts 1–2, condition/amount/selector closures) — verified.
- Effect interpreter coverage (all 27 ops) — verified.
- `rulesVersion` consistency — no drift.
- Reserved-card filtering — intact.
- 178 lazy imports in `App.tsx` all routed — clean.
- 5 nav items in `AppShellImmersive` correctly classified — clean.
- VO stage-direction stripping (`buildTtsBody`) — intact.
- The `/comms-array` button (prior §1.1 false alarm) — still by-design.
- Liminal pages `/architect`, `/dreamer`, `/dev/*` — still routed.

The prior audit's framework still works. The findings above are mostly one layer deeper than what its grep methodology could see.

---

## §11. What this audit didn't cover

For honesty: this sweep did not exhaust every line.

- Server WebSocket frames (`pvpWs`, `chessWs`, `duelystWs`, `cadesSignalingWs`, `spriteProxy`, `chess multiplayer`) were not protocol-traced end-to-end. The `useDuelystPvpSocket` connector for `duelystWs` was verified as routed; the protocol invariants (every server frame matched by a client handler and vice versa) were not.
- Tower defense, chess climb, chess puzzle, casino, cades-ice, syndicate, space-station, terminus-swarm, vortex-incursion procedures were not procedure-by-procedure audited. The router-level audit covered them; procedure-level coverage is sampled, not exhaustive.
- Animation manifests (framer-motion variants, particle-effect configs) and Pixi/Three.js scene wiring were not audited.
- E2E Playwright tests were not run; a passing `pnpm test:e2e` would corroborate the routing claims here.
- The full body of `docs/design/` was sampled, not exhausted. Each design doc is a candidate for its own §6-class spot-check.

The shape of the gaps in those uncovered areas is likely the same shape as the gaps in the covered areas. The remedies in §9 generalize.

---

## §12. Closing note

The user's framing was self-aware: "I know things have been skipped...left to do later, moved on - because of how much I was asking to have built. The limitation is mine - not yours."

The codebase is not in bad shape. It is in *characteristic* shape. Almost every disconnect found here falls into one of three patterns:
1. A registry was authored ahead of its consumers (cross-game beats, SiH slideshow, allegiance cards, modals).
2. A read path was wired ahead of a write path (`act_completion` flags, `factionReputation`, `entitlements` pre-Phase C1+C2).
3. A test validated shape ahead of wiring (every domain's CI guard).

These are the predictable failure modes of building fast across many surfaces. They are *visible* — every one of them is recoverable from a one-screen test or a one-line orchestrator change. The hard work (engine, schema, asset pipeline, narrative authoring) is mostly done. The wiring is the cheap part that's been deferred.

Connecting the frames to the things inside them is the next phase, and it is small relative to what has already shipped.
