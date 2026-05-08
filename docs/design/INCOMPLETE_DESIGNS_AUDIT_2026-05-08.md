# Dischordian Saga — Incomplete-Designs Audit (2026-05-08)

> Compiled from four parallel sweeps of the canonical ship-check gate, the
> design-doc corpus (`docs/design/`, `docs/production/`), in-source
> TODO/FIXME/stub markers, and the live DB schema. Companion to
> `FULL-PROJECT-AUDIT.md` (which is the prior holistic audit) and to the
> `pnpm ship:check` parity gate (the canonical mechanical oracle per
> CLAUDE.md).

---

## TL;DR

1. **The mechanical gate is green.** `pnpm ship:check` reports **16 PASS / 0 RATCHET / 0 FAIL** — every declared engine surface (effect ops, triggers, keywords, FK coverage, economic transactions, observability, mobile, asset prefetch, lore drift, etc.) has a matching runtime. The CLAUDE.md sample table is documentation prose; it predates the trial-category and `drain` keyword backfills.
2. **The unfinished work has migrated to the design layer.** Three large designs (Soul Stones, Trade Empire mission loop, Governance Hub votes) are documented and partially scaffolded but not playable. Two production briefs (Living Character Sheet, Pet/Specimen Breeding) describe systems with **zero runtime presence** in `apps/`.
3. **Schema is ahead of code in one cluster only.** Phase D.5 trade-empire mechanics (`tradeRouteSaturation`, `tradeResearchRaces`, `convergenceClimaxState`) landed without consumers, by design. Outside that cluster, schema/code parity is tight.
4. **Content stubs are mostly media-blocked, not design-blocked.** The remaining `// TODO` / `placeholder` markers in the engine and content modules trace to pending VO / CDN frames / album art rather than missing designs.
5. **The last mile from `FULL-PROJECT-AUDIT.md` is still real.** Trade Empire game loop, Governance vote router, full-coverage Shadow Tongue mystery rooms, and the global Light/Dark meter from `NARRATIVE_ARCHITECTURE.md §0` remain unimplemented.

---

## §1 — Ship-check gate (live numbers)

`pnpm ship:check` against `apps/shared/_completeness/registry.ts`:

| Subsystem | Declared | Implemented | Gap |
|---|---:|---:|---:|
| effect.op handlers | 28 | 28 | 0 |
| Condition.kind handlers | 9 | 9 | 0 |
| Trigger.kind dispatchers | 15 | 15 | 0 |
| Keyword combat behaviors | 31 | 31 | 0 |
| CardUnlockCondition UI surfaces | 7 | 7 | 0 |
| Card stat-budget compliance | 1117 | 1117 | 0 |
| Narrative→TCG flag bridge | 14 | 14 | 0 |
| trial_categories coverage | 1283 | 1283 | 0 |
| DB foreign-key coverage | 306 | 306 | 0 |
| Economic surfaces are transactional | 13 | 13 | 0 |
| Per-procedure rate limits | 5 | 5 | 0 |
| Observability wiring | 6 | 6 | 0 |
| Native-mobile wiring | 9 | 9 | 0 |
| List virtualization adoption | 1 | 1 | 0 |
| Asset prefetch manifest | 3 | 3 | 0 |
| LORE_BIBLE.md drift | 1 | 1 | 0 |

Zero gaps. The eight ratcheted entries in `apps/shared/_completeness/ratchet-state.json` all sit at `target: 0` and have closed. Notable closures since the CLAUDE.md sample:

- `secret_act_N_revealed` writers exist for N=1..7 (narrative-flag bridge full).
- `bloodline_threshold` and `dlc_chapter_completion` UI shipped in `apps/client/src/lib/cardUnlockDisplay.ts` and `apps/client/src/pages/DlcChaptersPage.tsx`.
- `passive_aura` continuous-evaluation pass wired in `apps/shared/tcg-core/engine/stateBasedActions.ts`; `TRIGGER_DISPATCH_EXEMPT` allowlist (`apps/shared/_completeness/checks/triggerKindCoverage.ts:65`) is empty.
- `drain` keyword has runtime in `apps/shared/tcg-core/engine/combat.ts:272`.

**Implication: incomplete designs are now entirely outside the gate's coverage.** What follows are the systems no parity check is yet defined for.

---

## §2 — Design docs vs runtime

Classification: SHIPPED (runtime + DB + tests) / PARTIAL / SCAFFOLDED (data-only) / UNBUILT.

### SHIPPED

- **Psychological Profile System** (`docs/design/PSYCHOLOGICAL_PROFILE_SYSTEM.md`). 7-axis player model. Full stack: `apps/shared/playerProfile*.ts`, DB tables `player_profile` + `player_profile_events` (`apps/db/schema.ts:5273`), tRPC `apps/server/routers/playerProfile.ts`, consumed by `npc.ts`, `chessClimb.ts`, `architectDossier.ts`.
- **Cross-Game Narrative Threads** (`docs/design/AUTHORING_CROSS_GAME_THREADS.md`). Authoring landing pad shipped exactly as designed: `apps/shared/crossGameNarrativeThreads.ts` + baseline.json + tests.
- **Morality/Trust/Act Variants** (`docs/design/AUTHORING_MORALITY_VARIANTS.md`). Resolver in `apps/shared/moralityTrustActVariants.ts` + tests.
- **Void Energy ratchet** (`docs/design/VOID_ENERGY_ADOPTION_ROADMAP.md`). Enforcement and migration tooling shipped (`pnpm lint:void-energy`, `.void-energy-adopted`). Adoption itself remains incomplete — the roadmap's own audit and `FULL-PROJECT-AUDIT.md` (Tier 3A) report ~5% of pages migrated.

### PARTIAL — design's reach exceeds its runtime

- **Streamed Prism Mystery Engine** (`docs/design/STREAMED_PRISM_MYSTERY_ENGINE.md`). Shadow Tongue uncorruption loop ships — DB column `activeEdits` at `apps/db/schema.ts:3989`, `shadowTongueEdits.ts` + tests, `roomMysteries/shadowVault.ts`. **17 of 26 rooms have no mystery module; only 4 have multi-stage art.** Phases B–E unbuilt.
- **Canon Rev 7 — Vex/Engineer Zero Reveal** (`docs/design/CANON_REV_7_ORACLE_VEX_EXPANSION.md`). Reveal cadence framework ships (`apps/shared/vexRevealStage.ts`, `vexSoleneCommissions.ts`, `engagement.ts` router); card defs live for Oracle/Iron Lion expansions. **No `vex_coda_trust` column or `coda_faction_standing` enum.** Trade Empire Coda mission loop that delivers the reveals is not wired.
- **Mobile Narrator + Witnessing Layer** (`docs/design/NARRATIVE_ARCHITECTURE.md`, `WITNESSING_NARRATIVE_PROPOSAL.md`). Yin/Yang Elara+Human runtime exists — `apps/shared/mobileNarratorDialog.ts` (495 lines), `MobileNarratorSlot.tsx` (303 lines), `witnessingIntegrations.ts` + tests + `witnessingYearOne.test.ts`. **Only `ArkExplorerPage.tsx` consumes it.** The global Light/Dark meter from §0 of the doc has no `globalAlignment` / `lightDarkMeter` table — morality is per-player only.
- **Year-One Events Calendar** (`docs/design/YEAR_ONE_EVENTS_CALENDAR_V2.md`). Architect-Triggered Events backend ships in full (`apps/server/routers/architectConsole.ts`, 2244 lines, admin/moderator procedures) and `ArchitectConsolePage.tsx` exists. **Player-facing `GovernanceHubPage.tsx` is still on `MOCK_ACTIVE_VOTE`** with no router wiring (matches `FULL-PROJECT-AUDIT.md` 2E). Community-driven lore is one-way.
- **Architecture Proposal — progressive room unlock** (`docs/design/ARCHITECTURE_PROPOSAL.md`). Rooms + unlocks exist (`preludeRoomGate.ts`, `awakeningProtocol.ts`, `characterCreationImpact.ts`), but the strict Cryo Bay → Bridge → War Room gating tree from the proposal is not the shipped flow.
- **Animated Cutscenes** (`docs/design/ANIMATED_CUTSCENES.md`). `CutsceneOverlay.tsx` + `GuildCutscenePlayer.tsx` ship. The five named Three.js+Pixi cutscenes (Awakening, First Human Contact, etc.) are not present as individual components; only `CompanionHubPage` consumes the overlay.

### SCAFFOLDED (data/types only, no game loop)

- **Soul Stones System** (`docs/design/SOUL_STONES_SYSTEM.md`). Dual-path corruption/purification economy. **Zero hits** for `SoulStone` in `apps/`. Not in DB schema, no router, no card op. Pure design doc — **largest design-vs-code delta in the repo.**
- **Expansion Bible card content beyond cards themselves**. Card defs landed (Oracle/Vex/Iron Lion in `s2_hierarchy`, `s2_professors`, expansion folders). The surrounding **Coda Agency mission system** described in `EXPANSION_BIBLE.md` did not.

### UNBUILT (production briefs with no runtime)

- **Pet/Specimen Breeding** (`docs/production/BREEDING_SYSTEM_ART_PROMPTS.md`). No `petBreeding` / `breedingPair` table. `crewBreeding.ts` + test exists but is roster lineage logic, not the breeding mechanic the brief describes; `bloodClassification.ts` is lore-only. Listed in `featureRoadmap.ts`.
- **Living Character Sheet** (`docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md`). **Zero hits** for `livingCharacterSheet` / `LivingCharacterSheet` anywhere in `apps/`. Pure art brief.
- **Dead Man's Circuit** (`docs/production/DEAD_MANS_CIRCUIT_PRODUCTION.md`). Lives as an external Godot project under `games/dead-mans-circuit/`. Only bridges (`apps/shared/crewDmcBridge.ts`, `crossGameNarrativeThreads.ts`) exist in this monorepo — by design, but flagging it for audit completeness.

---

## §3 — DB schema vs runtime

`apps/db/schema.ts` — 7066 lines, 265 tables. Spot checks:

### Tables with no production references — Phase D.5 cluster (3)

All three tagged `audit-allow: pending-feature (Phase D.5)` in their own doc-comments. Schema landed ahead of consumers, intentionally.

- `tradeRouteSaturation` (`apps/db/schema.ts:6978`) — per-sector oversupply score 0..200 for price-crash penalties. No decay loop yet.
- `tradeResearchRaces` (`apps/db/schema.ts:6997`) — NPC racer rolled when player starts a tech. Status enum `pending|player_won|rival_won`. No tick loop.
- `convergenceClimaxState` (`apps/db/schema.ts:7052`) — singleton "doom clock" 0..100 with `dormant|open|resolved` phases and a 72h auto-close. Type-imported by `tradeContracts` / `tradeCourt` for forward compat; no read/write callers.

### Single-consumer tables (low fan-in, structural risk)

The Tier 5 PvP cluster — `circuitPvpMatches`, `tradeSectorControl`, `tradeOracleDuels`, `cadesPvpMatches`, `tdLiveSieges`, `guildWarSkirmishes/Matches` (`apps/db/schema.ts:6290-6403`) — all have exactly one consumer: `apps/server/routers/tier5Pvp.ts`. Same pattern for the trade-empire data cluster (`tradeOracleFutures`, `tradeCompletedMissions`, `tradeAgendaProgress`, `tradeDemands`, `tradeAnomalies`, `tradeAlliances`, `tradeDynasty`, `tradeEdicts`, `tradeBlockades`, `tradeEspionageOps`) and the seasonal Christmas-in-July cluster. These are *shipped* but their entire feature surface depends on one file.

### Orphan columns inside live tables

- `cards.nftTokenId` and `cards.nftPerks` (`apps/db/schema.ts:333-334`) — 0 references. NFT linkage scoped, never read.
- `characterSheets.avatarUrl` (`apps/db/schema.ts:477`) — 0 references.
- `cards.loredexEntryId` (`apps/db/schema.ts:325`) — only 3 file refs; loredex link mostly declared, lightly honored.

### Declared-but-unproduced enum variants

In `notifications.type` (`apps/db/schema.ts:1777`):

- `pvp_challenge` — 0 producers (every other PvP notification kind is wired).
- `epoch_quest` — 0 producers.
- `syndicate_quest` — 0 producers.

Engine knows how to display these; nothing emits them.

### Migrations & commented blocks

70 migrations (`0000`..`0070`). Spot checks of late migrations (`0058_pvp_ratings`, `0059_mystery_engine`, `0067_indexes_and_fks`, `0070_user_cohort_columns`) all have runtime consumers. No commented-out `export const` table blocks anywhere in the schema.

---

## §4 — In-source TODO / FIXME / stub markers

Filtered to design-significant signals (excludes style nits and refactor TODOs). ~30 most signal-rich markers:

### Card engine

- `apps/shared/tcg-core/story/chapters.ts:346` — Boss deck is a placeholder pending a curated Warlord deck pass.

### Narrative content

- `apps/shared/act3EyesBiography.ts:4` — §7 is the largest unimplemented section in the Witnessing Narrative Proposal; story shell exists, gameplay wire-up pending.
- `apps/shared/dreamerVisions.ts:19` — Visions 2–4 stubbed; require Albums 2–5 frames not yet on CDN. Vision 1 fully built.
- `apps/shared/transmissions.ts:1140-1142` — Architect Transmission "First Contact — Calibration" pending production (videoUrl + `architect_first_contact_001` VO null until media lands).
- `apps/shared/hierarchyOfTheDamned.ts` — 3 of 4 Hierarchy Lords marked `stub_with_reactions` (Master of R'lyeh, Pale Emissary, Reckoning Daughter). Lore + reactions exist; engine surfaces (cards/VO) not fully wired.
- `apps/shared/assetRegistry.ts` — Asset registry currently in-memory; will back with DB table for production.
- `apps/shared/featureRoadmap.ts` — 46 feature unlocks. "Necromancer Returns" and "Alliance Wars" server-wide events marked endgame; implementation status unclear.
- `apps/shared/narrativeValidator.ts:466` — Info-tier `pending production` validator for transmissions without `videoUrl` or `driveFileId`. Non-blocking gate.

### Server routers

- `apps/server/routers/guildContracts.ts:20` — Guild contract cinematic checks stubbed.
- `apps/server/coopBattleSpawner.ts:10` — Co-op encounter deck generation builds stubbed `DeckCards`; full encounter logic pending.
- `apps/server/routers/architectConsole.ts:2199` — Unimplemented moderator actions fail loudly (defensive, awaiting spec).

### Client UI

- `apps/client/src/components/SpriteCharacter.tsx:158` — Lip-sync override pending wawa-lipsync integration.
- `apps/client/src/game/CasinoGamePanels.tsx:3` — Stubbed casino games; user-bet logic to wire per panel.

**Pattern:** most stubs are blocked on **media production** (CDN frames, VO generation), not on design. The §7 Eyes narrative is a data shell awaiting Trade Empire gameplay rewrites — i.e. the same Trade Empire mission loop that blocks the Vex reveal.

---

## §5 — New ship-check entries (LANDED 2026-05-08)

Eight new entries added to `apps/shared/_completeness/registry.ts` and seeded
in `ratchet-state.json`. Live results below — the gate now reports
**18 PASS / 6 RATCHET / 0 FAIL** (was 16 PASS / 0 RATCHET / 0 FAIL).

| Entry id | Declared | Implemented | Gap | Status |
|---|---:|---:|---:|---|
| `narrative.global_alignment_meter` | 4 | 0 | 4 | RATCHET |
| `narrative.mobile_narrator_adoption` | 6 | 1 | 5 | RATCHET |
| `narrative.shadow_tongue_room_coverage` | 32 | 32 | 0 | **PASS** |
| `narrative.cutscene_components` | 5 | 0 | 5 | RATCHET |
| `design.declared_subsystem_runtime` | 11 | 3 | 8 | RATCHET |
| `server.governance_router_present` | 5 | 5 | 0 | **PASS** |
| `schema.no_orphan_columns` | 3 | 0 | 3 | RATCHET |
| `schema.notification_enum_producers` | 58 | 44 | 14 | RATCHET |

Two of the proposed checks (Shadow Tongue rooms, Governance Hub) came back PASS — the audit's prose findings were stale relative to the live tree.

### §5.1 — Every single missing item, enumerated

These are the 39 specific gaps the gate now tracks. Each line is what
the runtime would need to grow to drop the count by 1.

**`narrative.global_alignment_meter` (gap 4)**
- `schema:global_alignment_table` — schema column or table named `global_alignment` / `globalAlignment` / `lightDarkMeter` / `alignment_meter` in `apps/db/schema.ts`.
- `server:aggregate_writer` — server function recomputing the aggregate (`recomputeGlobalAlignment` / `updateLightDarkMeter` / `aggregateAlignment`).
- `server:trpc_reader` — tRPC procedure exposing the aggregate (e.g. `globalAlignment.get` / `lightDarkMeter.get` / `alignment.global`).
- `client:meter_component` — client component rendering the meter (`GlobalAlignmentMeter` / `LightDarkMeter` / `GlobalMoralityMeter`).

**`narrative.mobile_narrator_adoption` (gap 5)**
- `apps/client/src/pages/CompanionHubPage.tsx` — needs `MobileNarratorSlot` import (Yin/Yang dialog routes companion banter through the slot, NARRATIVE_ARCHITECTURE.md §2).
- `apps/client/src/pages/AwakeningPage.tsx` — needs `MobileNarratorSlot` import (first-contact moment, §1.4 beat 3).
- `apps/client/src/pages/MemorialCorridorPage.tsx` — page does not exist yet (trust-40 memorial unlock, §1.5).
- `apps/client/src/pages/PetGardenPage.tsx` — page does not exist yet (post-Prelude pet-bond arc, §2.5).
- `apps/client/src/pages/CharacterCreationPage.tsx` — page does not exist yet (psych-profile emergence beats, WITNESSING_NARRATIVE_PROPOSAL §0).

**`narrative.cutscene_components` (gap 5)**
- Cutscene 1 *Awakening* — needs `AwakeningCutscene` / `CutsceneAwakening` component or `cutscene_awakening` registry literal.
- Cutscene 2 *First Human Contact* — needs `FirstHumanContactCutscene` component or `cutscene_first_human_contact` literal.
- Cutscene 3 *Elara's Memory Recovery* — needs `ElaraMemoryRecoveryCutscene` component or `cutscene_elara_memory_recovery` literal.
- Cutscene 4 *The Breaking Point* — needs `BreakingPointCutscene` component or `cutscene_breaking_point` literal.
- Cutscene 5 *The Thought Virus Manifests* — needs `ThoughtVirusManifestCutscene` component or `cutscene_thought_virus_manifests` literal.

**`design.declared_subsystem_runtime` (gap 8)**

*Soul Stones (4 missing)*
- `schema:soul_stones_table` — schema table tracking per-player counts by state (red / violet / gold), SOUL_STONES_SYSTEM.md §1.1.
- `server:soul_stones_router` — tRPC router (`collect` / `purify` / `corrupt` / `summon`).
- `client:soul_stones_ui` — UI for the corrupt/purify choice (`SoulStoneChoice` / `PurifyStoneDialog` / `SoulStonesPanel`).
- `design:demon_pet_summoning` — Demon-Pet summoning surface tied to red Soul Stones, §1.3 Path A.

*Pet/Specimen Breeding (3 missing)*
- `schema:breeding_pairs` — schema table for pairs and offspring (`petBreeding` / `breedingPair` / `specimenBreeding`).
- `server:breeding_router` — tRPC router (`start` / `complete` / `cancel`).
- `client:breeding_ui` — pair selector (`BreedingPanel` / `PetBreedingDialog`).

*Living Character Sheet (1 missing)*
- `client:living_sheet_component` — `LivingCharacterSheet` / `LivingCharSheet` component.

(`shared:purification_module` and `shared:breeding_logic` shipped — incidental matches in `economySimulator.ts` / `crewBreeding.ts` clear those artifacts, which is why implemented = 3.)

**`schema.no_orphan_columns` (gap 1, was 3)**
- `characterSheets.avatarUrl` — portrait URL, no consumer in client or server.

*(Closed 2026-05-08: `cards.nftTokenId` and `cards.nftPerks` deleted entirely along with the residual NFT plumbing — `apps/db/0071_drop_nft_card_columns.sql`, 26 source files touched, 221 references removed, ship-check ratchet tightened 3 → 1.)*

**`schema.notification_enum_producers` (gap 14)** — variants declared in `notifications.type` enum (`apps/db/schema.ts:1777`) with no `type: "<variant>"` writer in `apps/server/`:
- `battle_pass_reward`
- `boss_mastery`
- `daily_reset`
- `deep_trust`
- `epoch_quest`
- `faction_war`
- `pet_acquired`
- `pvp_challenge`
- `pvp_result`
- `recruitment`
- `syndicate_quest`
- `system`
- `trade_declined`
- `weekly_quest`

### §5.2 — Why two proposed checks came back PASS

- **`narrative.shadow_tongue_room_coverage`** — `STREAMED_PRISM_MYSTERY_ENGINE.md §1` says "9 of 26 rooms have authored mystery modules"; that planning doc was written before Phase B and Phase C closures. The live `ROOM_MYSTERY_REGISTRY` has 26 universal + 6 species-exclusive entries, every entry resolves to a non-empty source module. The gate will surface a future regression (e.g. a new room added to the design but no module shipped) but the current state is clean.
- **`server.governance_router_present`** — the prior FULL-PROJECT-AUDIT 2E claim that `GovernanceHubPage.tsx` is on `MOCK_ACTIVE_VOTE` is also stale. The page now consumes `trpc.architectConsole.getActiveVotes.useQuery` and `trpc.architectConsole.submitVote.useMutation`, and the matching procedures exist on the router. The gate now freezes that closure.

### §5.3 — Closing each gap

The mechanical recipe is: build the missing artifact (or rename an existing one to match the check's identifier patterns), then run `pnpm ship:check --update-ratchet` to record the tightened ceiling. The gate enforces monotonicity from there — the gap can shrink, never grow.

---

## §6 — Prioritized backlog

Severity ranks design impact, not engineering size.

| Rank | Item | Severity | Ship-check coverage today |
|---:|---|---|---|
| 1 | Trade Empire mission loop (also unblocks Vex reveal + Eyes §7) | High | None |
| 2 | Governance Hub player vote router (replaces `MOCK_ACTIVE_VOTE`) | High | None |
| 3 | Soul Stones system — DB / router / engine ops | High | None |
| 4 | Shadow Tongue room coverage (17 rooms have no module) | Medium | None |
| 5 | Global Light/Dark alignment meter (`NARRATIVE_ARCHITECTURE.md §0`) | Medium | None |
| 6 | Mobile Narrator adoption beyond `ArkExplorerPage.tsx` | Medium | None |
| 7 | Hierarchy Lords engine surfaces (3 lords still `stub_with_reactions`) | Medium | None |
| 8 | Five named cutscene components | Medium | None |
| 9 | Pet/Specimen Breeding runtime | Low (premium feature) | None |
| 10 | Living Character Sheet runtime | Low | None |
| 11 | Notification enum producers (`pvp_challenge`, `epoch_quest`, `syndicate_quest`) | Low | None |
| 12 | Orphan columns (`cards.nftTokenId/nftPerks`, `characterSheets.avatarUrl`) | Low | None |
| 13 | Phase D.5 trade tables decay/tick loops | Low (intentional schema-first) | None |

Items 11–13 are cheap wins. Items 1–3 are the actual unfinished ambitions of the codebase.
