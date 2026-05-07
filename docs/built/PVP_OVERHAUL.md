# PvP Overhaul — Reference

Status: shipping
Last updated: 2026-05-01

This document indexes the PvP overhaul systems (Tiers 1–7 + integration
follow-ups). For lore and design intent, see the plan file at
`/root/.claude/plans/do-an-analysis-of-vivid-pudding.md`. For day-to-day
contributor entry-points, start with the file paths in each tier's
section below.

## Architecture overview

The overhaul layers eight cohesive systems on top of the existing PvP +
chess + co-op + narrative substrate. Each tier is event-driven —
match-end paths, raid clears, conspiracy clue collection, and quest
progression all flow through small idempotent services.

```
   ┌─ pvpWs / chessWs / coopRaids ─┐
   │     match-end events          │
   ├──────────┬──────────┬─────────┤
   ▼          ▼          ▼         ▼
 titleService competitive  conspiracy  guildQuest
 (T1)         Ratings(T2A) Service(T2B) Service(T4)
   │            │           │           │
   └────┬───────┴───────────┴───────────┘
        ▼
  Title grants, ratings mirroring, clue drops, quest progress —
  all idempotent on (userId, …) unique indexes.
```

## Tier 1 — Lore-tiered Title System

- **Spec**: SWTOR-styled multi-tier progressions rooted in LOREDEX entities
- **Schema**: `title_definitions`, `user_titles`, `user_cosmetic_loadout`
- **Registry**: `apps/shared/titles/titleDefinitions.ts` (22+ progressions, 8 categories)
- **Evaluator**: `apps/shared/titles/titleUnlockService.ts` — pure-function
  `evaluateTitleUnlock`, mirrors the `expansionUnlockService` pattern
- **Service**: `apps/server/services/titleService.ts` — `awardEligibleTitles`,
  `buildTitleSnapshot`
- **Router**: `apps/server/routers/titles.ts` — `getCatalog`, `getMyTitles`,
  `equipTitle`, `unequipTitle`, `claimNewlyUnlocked`, `getTitleProgression`,
  `resolveEquippedTitles`
- **UI**: `/titles` — category tabs, per-progression progress bars, equip flow
- **Display**: `apps/client/src/components/TitlePill.tsx` — wired into
  `PvpArenaPage`, `PlayerProfilePage`, `ChessPage` (opponent), post-match
  summary

### Title condition kinds

```ts
| pvp_rank_reached | pvp_wins_total | pvp_team_wins | pvp_ffa_wins
| pvp_season_finish_at | coop_raid_clears | coop_role_mastery
| coop_party_continuity | coop_card_wins | loredex_discovered
| loredex_alignment_threshold | act_completed | secret_revealed
| mystery_solve_first | mystery_solve_any | kael_fragment_unlocked
| cross_game_dual_rank | guild_war_won | guild_skirmish_won
| guild_hall_tier | apprentice_trial_attended | apprentice_trial_graduated
| level_reached | prestige_reached | entitlement_held
```

### Lore-rooted progression examples

- **Warlord** (entity_10): Skirmisher → Warlord → Conqueror of the Nexus
- **Antiquarian** (entity_66): Chronicler → Antiquarian → Queen of Truth
  (hidden, requires being first-discoverer of Project Celebration)
- **Hierophant** (entity_58): Seeker of Balance → Hierophant → Voice of Thaloria
  (gated on card co-op clears — the "Two Witnesses" lore archetype)

## Tier 2A — Cross-game Ratings

- **Schema**: `competitive_ratings` keyed by `(userId, gameType)`
- **Mirror**: `apps/server/services/competitiveRatingsService.ts` —
  `mirrorRating()` called from every match-end path (pvpWs, chessWs, Tier 5
  variants, td raids)
- **Backfill**: `runCompetitiveRatingsBackfillOnce` runs at boot to populate
  from legacy `pvp_leaderboard` and `chess_rankings`. Marker in
  `competitive_ratings_backfill` keeps it idempotent.
- **Router**: `apps/server/routers/competitive.ts` — `getMyRatings`,
  `getLeaderboard(gameType)`, `getProfileFeed(userId)`, `backfillRatings`
- **Game types**: `card_1v1 | card_2v2 | card_ffa | card_coop | chess
  | circuit_1v1 | trade_oracle_duel | cades_async_1v1 | td_raid | guild_skirmish`

## Tier 2B — Witnessing Discovery Race

- **Spec**: 5 lore-rooted Conspiracy Boards. First guild to assemble all
  clues triggers a server-wide reveal that flips secret-act flags for
  every player.
- **Schema**: `discovery_events`, `conspiracy_boards`, `user_clue_progress`,
  `guild_clue_progress`
- **Boards**: `apps/shared/conspiracyBoards/definitions.ts` — Thought Virus,
  Project Celebration, Kael's Revenge, Watcher Infiltration, Recruiter
  Defection
- **Drop tables**: `apps/shared/conspiracyBoards/clueDrops.ts` — 8 sources,
  30+ clue keys, tunable rates
- **Service**: `apps/server/services/conspiracyService.ts` —
  `processClueDropEvent`, `attemptSolveForUser` (unique-key insert as
  first-discoverer synchronisation primitive)
- **Router**: `apps/server/routers/conspiracy.ts` — `getCatalog`,
  `getMyBoards`, `getGuildBoards`, `attemptSolve`,
  `getServerWideRevealHistory`, `oraclePoolPeek` (T4 hall-tier-4 perk —
  pay 50 Dream to peek rival guild progress)
- **UI**: `/conspiracy` — mine/guild/history tabs, per-board clue
  checklist, first-discoverer chips

## Tier 3 — Engine Foundation

Additive types only. The full N-player engine refactor is a separate
multi-week project (gated on RULES_VERSION bump + replay determinism
tests).

- **Types**: `apps/shared/tcg-core/types/Teams.ts` — `MatchPlayerSlot`,
  `Team`, `TeamId`, `TurnOrder`, `MatchShape`. Adapter helpers
  (`sideToSlot`, `slotToSide`) preserve 1v1 backwards-compat.
- **Targeting**: `apps/shared/tcg-core/types/TeamTargeting.ts` —
  `resolveTeamSelector`, `isAllyOf`, `isEnemyOf`, `filterByController`.
  Selectors that 2v2 / co-op / FFA card definitions can reference safely
  (`ally_general`, `all_allies`, `enemy_team_generals`, `all_enemies`,
  `self_or_allies`).
- **Constructors**: `teams1v1`, `teams2v2`, `teamsCoop2v1` (Witnesses
  vs AI boss), `teamsFfa4`
- **Turn orders**: `TURN_ORDER_1V1`, `TURN_ORDER_2V2_ALTERNATING`
  (T1A→T2A→T1B→T2B), `TURN_ORDER_FFA_4`, `TURN_ORDER_COOP_2V1`

## Tier 4 — Guild Expansion

- **Schema**: `guild_perks`, `guild_unlocked_perks`,
  `guild_quest_definitions`, `guild_quest_progress`, `guild_cosmetics`,
  `guild_stash`, `guild_stash_log`
- **Perks** (12): `apps/shared/guildPerks/perkDefinitions.ts` — Panopticon
  Relay, Iron Lion's Drill, Antiquarian's Library (+5% clue drops),
  Trade Caravan Escort, Oracle's Blessing (+1 starting card draw),
  Necromancer's Pact, Architect's Workshop, Raid Efficiency, Enigma
  Vault Resilience, Source Nexus Attunement, Iron Lion Citadel,
  Panopticon Core Command. Hall tiers 1–5.
- **Quests** (14): `apps/shared/guildQuests/questDefinitions.ts` —
  daily skirmishes, weekly Trinity Forged, weekly Solve the Cipher,
  seasonal Forge a Champion, seasonal Standard Bearer
- **Banners** (13): `apps/shared/guildCosmetics/bannerCatalog.ts` —
  starter, quest rewards, war territory rewards, conspiracy first-solve
  banners
- **Quest service**: `apps/server/services/guildQuestService.ts` —
  `recordQuestEvent` (12-event union), `runQuestResetTick` (hourly cron
  resets daily/weekly/seasonal anchors). Seasonal anchor aligns to the
  active `pvp_seasons.startsAt` when present.
- **Router**: `apps/server/routers/guildExpansion.ts` — perks (catalog,
  unlock), quests (list, claim), cosmetics (banner equip, motto with
  profanity validation), stash (deposit/withdraw/log)
- **UI**: `/guild-hall` — 4 tabs (Perks / Quests / Banners / Stash)

## Tier 5 — PvP Variants for Other Modes

Five new competitive surfaces, each riding the unified rating layer +
title hooks + clue drops:

- **5A. Circuit Rival Run** — synchronous shared-seed races,
  `single_race` or `survival_wars_3` best-of-3
- **5B. Trade Empire** — Sector Control (weekly Sector Lord) + Oracle
  Futures Duel (24h paired call/put settlement)
- **5C. CADES async time trial** — shared scenarioSeed, score
  reconciliation
- **5D. TD Live Siege** — synchronous defender placement during raid
- **5E. Guild Skirmish** — best-of-4 mode-mix bracket: card duel +
  chess + TD live + CADES. Title grants for every member of the
  winning guild.

- **Schema**: `circuit_pvp_matches`, `trade_sector_control`,
  `trade_oracle_duels`, `cades_pvp_matches`, `td_live_sieges`,
  `guild_war_skirmishes`, `guild_war_skirmish_matches`
- **Router**: `apps/server/routers/tier5Pvp.ts` — sub-routers
  `circuit`, `trade`, `cades`, `tdLiveSiege`, `guildSkirmish`
- **UI**: `/pvp-variants` — 5 tabs

## Apprentice Trial Completions

Server-side record of every cohort survived or graduated. Cohort
simulation itself runs client-side (`apps/shared/pvpCohorts.ts`).
Client posts to `recordCompletion` on cohort conclusion.

- **Schema**: `apprentice_trial_completions`
- **Router**: `apps/server/routers/apprenticeTrial.ts` —
  `recordCompletion`, `getMyCompletions`, `getMyStats`
- **Title progression** (`celebrant`): Apprentice Aboard → Survivor
  of the Palimpsest → The Sole Graduate (hidden, requires 3
  graduations)
- **Client wiring**: `apps/client/src/pages/CohortPage.tsx` — fires
  recordCompletion when `cohort.status === "concluded"`. Idempotent
  client-side via `dischordian:cohort_reported` localStorage set;
  server idempotent on `(userId, cohortNumber)` unique index.

## Moderation

- **Schema**: `pvp_moderation_reports`
- **Router**: `apps/server/routers/pvpModeration.ts`
- **Player-facing**: `fileReport(targetKind, targetId, reason, details?)`,
  `getMyReports`. `targetKind ∈ {motto, banner, title, guild_name}`.
- **Admin-facing**: `getOpenReports`, `resolveReport(outcome,
  applyAction?, notes?)`, `getRevealAuditLog`, `getModerationStats`
- **applyAction** auto-reverts: motto → empty, banner → starter,
  title → unequipped. Guild rename is sensitive; logged but not
  auto-applied.

## Telemetry

- **Router**: `apps/server/routers/pvpTelemetry.ts` (admin-only,
  except `getPublicGrantSummary` and `resolveTitle`)
- **Endpoints**: `getTitleFunnels` (per-rootKey tier counts to find
  drop-off), `getRatingDistribution` (gameType × rankTier bucket
  counts), `getConspiracyTelemetry` (boards + reveals),
  `getGuildQuestStats`, `getGuildPerkStats`, `getApprenticeTrialStats`

## Migrations

- **0061_pvp_overhaul.sql** — hand-written migration for all 25 new
  tables. `IF NOT EXISTS` everywhere so re-runs are no-ops.
- **Auto-backfill** (legacy data): runs at boot, idempotent via marker
  rows in `competitive_ratings_backfill` (also serves as a generic
  one-shot migration ledger):
  - `runCompetitiveRatingsBackfillOnce` — `pvp_leaderboard` +
    `chess_rankings` → `competitive_ratings`
  - `runLegacyTitleBackfillOnce` — `userProgress.title` (free text) →
    `user_cosmetic_loadout.equippedTitleKey`

## Verification

- `pnpm check` — full TS typecheck
- `pnpm test` — Vitest unit suite (~10,000 tests)
- `pnpm test:e2e` — Playwright (`apps/e2e/pvp-overhaul.spec.ts` +
  others). Auth-gated flows are documented as `test.skip` until
  storageState fixtures are wired.

## Related plans

- `/root/.claude/plans/do-an-analysis-of-vivid-pudding.md` — original
  multi-tier design plan
- Future work: full Tier 3 engine refactor (RULES_VERSION bump,
  replay-pinning, party/2v2/co-op queue + UI). Real-time CADES FPS
  PvP scaffolding lives in `games/cades-fps/` (in-codebase) — Godot
  client + server signaling WS — and is documented separately in
  `docs/built/CADES_PVP.md`. The WebRTC `RTCPeerConnection`
  lifecycle is the remaining work; see CADES_PVP.md "What's NOT
  done" for the explicit punch list.
