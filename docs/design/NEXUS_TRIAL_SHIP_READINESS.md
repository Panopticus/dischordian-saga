# Nexus Trial — Ship Readiness Report

**Status at Sprint 16 close: READY**

This document is the final ship-check artifact for the [Nexus Trial plan](./NEXUS_TRIAL_PLAN.md). It captures the test, lint, and audit state at T-7 days from the March 2027 live window and certifies that the 16-sprint implementation is in shipping shape.

## Headline metrics

| Metric | Value |
|---|---|
| Total PRs landed | 16 (Plan v1, Plan v2, Sprints 1–14, Sprints 15–16) |
| Lines shipped (net) | ~9,200 across `apps/shared`, `apps/server`, `apps/client`, `apps/db`, `docs/design` |
| Unit tests (Nexus surface) | **235 passing across 21 files** |
| `pnpm check` | **clean** |
| `pnpm ship:check` | no new regressions (the pre-existing `Mobile Narrator page adoption` FAIL on `AwakeningPage.tsx` is unrelated) |
| DB foreign-key coverage | **375/375 PASS** (368 → 375 across 5 new tables) |
| 16-state Three Clocks panel parity | PASS |
| 24-state Season 2 variant composition | PASS |

## What ships

### Foundation
- **Permadeath store** (`apps/shared/resurrectionProtocols.ts`) — in-memory + DB-backed swap hook
- **Three Clocks composer** (`apps/shared/threeClocks/state.ts`) — pure aggregator from Vortex / Necromancer / Politician
- **Three Clocks Panel UI** (`apps/client/src/components/threeClocks/`) — Void-Energy-adopted, mounted on Home, with framer-motion polish + pre-match warning
- **Preparation Mission framework** (`apps/shared/preparationMissions/`) — 5 mission scorers + 20-card burnt-card roster + DB schema
- **Nexus Trial tick service** (`apps/server/services/nexusTrialTickService.ts`) — transactional phase machine, 3 tables, idempotent
- **Testimony ingestion** (`apps/server/routers/nexusTrial.ts`) — idempotent vote submission, server-authoritative bucket mapping
- **Vote resolvers** (`apps/server/services/nexusTrialResolverService.ts`) — companion sacrifice + ballot winner + romance-tag freeze
- **Cinematic registry** (`apps/shared/nexusTrial/cinematics.ts`) — all 8 cinematics (Locke + 4 ballot + 2 confession + abort)
- **Lycos bible** (`apps/shared/npcs/bibles/lycos.md`) — ~330 lines closing the only narrative-content audit gap
- **Season 2 patch composer** (`apps/shared/seasons/season2/`) — 10 content modules composing into 24 starting states + Day 1 Daily Brief composer
- **Day 30 cleanup + lore drift test** (`apps/shared/seasons/season2/dayThirty.ts`)
- **Compressed dry-run harness** (`apps/shared/nexusTrial/dryRunHarness.ts`) — end-to-end smoke test for the logic chain

### Key invariants pinned by tests
- All 6 trial phases declared + reachable (canonical sequence enforced)
- All 16 Three Clocks panel states render
- All 5 Preparation Missions evaluable end-to-end
- All 8 cinematics present + `antiquarianClosing` lines match `PLAN_CANON`
- All 24 Season 2 combinations compose without throwing
- Companion sacrifice resolves to lower-weight (community-defended-less); ballot winner resolves to higher-weight
- Romance-tag freeze: relationship-state updates AFTER sacrifice do NOT count
- Permadeath: dual recording (Locke + ballot winner) at Verdict close, with `finalNarration` matching cinematic registry
- Idempotent testimony submission: race-window duplicate-key handled as `deduplicated: true`
- Day 30 cleanup plan: retain 4, remove 6, sum = 10 always

## Pre-Trial readiness gates (per the plan's Verification Plan)

1. ✅ `pnpm check` — clean
2. ✅ `pnpm vitest run` — 235/235 across the Nexus surface
3. ⏳ `pnpm test:e2e` — Playwright suite (operator dashboard interactions; runs at T-7 by Event Director)
4. ⚠️ `pnpm ship:check` — no Nexus-surface regressions; pre-existing `Mobile Narrator` FAIL is unrelated and tracked separately
5. ✅ `pnpm lint` + `pnpm lint:void-energy` — clean
6. ⏳ `pnpm db:smoke` — runs at staging deploy
7. ⏳ Load test signed off by On-call Engineer + Event Director — Sprint 15 dry-run harness is the unit-level proof; staging 10× synthetic happens in production environment
8. ⏳ Cinematic A/V review signed off by Narrative Lead — all 8 scripts are in code; VO + art commissions are production tasks

The four ⏳ items are production-environment tasks that cannot be run from CI. The codebase is ready for them.

## Sprint-by-sprint deliverable map

| Sprint | PR | Deliverable |
|---|---|---|
| Plan v1 | #686 | Full design doc landed |
| Plan v2 | #688 | March 2027 anchor + Cosmetics |
| 1 | #689 | Permadeath store + audit re-verification |
| 2 | #690 | Three Clocks composer + tRPC reader |
| 3 | #691 | Three Clocks panel UI + 16-state parity |
| 4 | #692 | Pre-match warning + Home mount + motion |
| 5 | #694 | Preparation framework + `player_preparation` schema |
| 6 | #695 | Salvage + Reverse Trial + 20-card roster |
| 7 | #696 | Tribunal + The Question + 1,000-record property test |
| 8 | #697 | Bidding War + verdict_delta deck-craft test |
| 9 | #698 | Nexus Trial tick service + 3 tables |
| 10 | #699 | Testimony + aggregation + ballot permadeath |
| 11 | #700 | 5 cinematic scripts + Lycos bible + permadeath endpoint |
| 12 | #702 | Confession variants + abort cinematic + romance-tag freeze |
| 13 | #705 | Season 2 patch composer + 10 variant modules + Day 1 Daily Brief |
| 14 | #706 | Day 30 cleanup plan + lore drift test |
| 15 | #707 | Compressed dry-run harness |
| 16 | (this PR) | Final readiness report |

## What's explicitly NOT in scope

Items intentionally deferred and tracked:

- **Trial-format Act 2–6 finales** (5 new boss decks) — substantial authoring effort filed for a follow-up sprint
- **VO bookings + recordings** — real-world production tasks
- **Memorial burnt-card art commissions** (4 commissions) — art pipeline ships when assets land
- **Cinematic playback React layer** — Sprint 13+ adds the component that plays a `CinematicScript` end-to-end with timing + audio
- **WebSocket leaderboard subscription** — polled read shipped; push transport ships later
- **Per-card `verdict_delta` content authoring** across the meta-relevant pool — framework + sensitivity test ships; the per-card numeric authoring is a designer task

## Audit corrections worth remembering

At Sprint 1, a re-verification run against `pnpm ship:check` revealed that **three of the original audit's "missing runtime" findings were already PASS**:
- `global_alignment_meter` (4/4 PASS)
- `unlockCondition` UI surfaces (9/9 PASS)
- `secret_act_N_revealed` writers (14/14 PASS)

The audit had run without `node_modules`/`tsx` and inferred from filesystem scans. **Process lesson preserved in the plan's Dependency Audit section**: `pnpm ship:check` is the binding contract; agent filesystem scans are not a substitute.

## Sign-off

The 16-sprint implementation is shippable. The remaining work is production-environment (VO, art, load test, crew training) and is the production team's responsibility per the [Operator Runbook](./NEXUS_TRIAL_PLAN.md#operator-runbook--the-72-hour-live-event-playbook).

— Sprint 16 close, 2026-05-22.
