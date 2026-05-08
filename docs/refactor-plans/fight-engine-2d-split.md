# Refactor plan — `FightEngine2D.ts` god-class split

Current: `apps/client/src/game/FightEngine2D.ts` is **4,558 lines** with a 3,500-line class doing simulation, rendering, audio, AI, HUD, and input — flagged by the staff-engineer audit as the worst architectural offender in the client.

This document is the splitting plan, sized to land incrementally without breaking the running game (which has only thin test coverage and would need manual smoke at each step).

## Target shape

Six files, each under 1,500 LOC:

```
apps/client/src/game/fight-engine-2d/
├── index.ts                  re-exports the public surface
├── FightEngine2D.ts          ~1,200 LOC — orchestrator class only
├── fightTypes.ts             ~300 LOC  — types + enums + constants
├── fightFrameData.ts         ~600 LOC  — pure functions: hurtboxes,
│                                          AABB, buildMoveData,
│                                          buildSpecialMoveData,
│                                          stateToPose
├── fightSimulation.ts        ~1,000 LOC — physics + collision + state
│                                          machine (no rendering)
├── fightRenderer.ts          ~1,200 LOC — canvas draw calls only
└── fightAi.ts                ~700 LOC   — AIDifficultyProfile + AI
                                            decision tree
```

## Why this shape

- **Pure functions first** (`fightFrameData.ts`) — extracting them carries zero behavior risk. These are referentially-transparent helpers.
- **Sim and render separate** — the existing class interleaves them. Separating means the sim can be tested headlessly and the renderer can be replaced (e.g. for instant-replay screenshots) without touching game logic.
- **AI in its own file** — already has a clean boundary via `AIDifficultyProfile`.

## Incremental commit plan

Each commit is verifiable independently. Land one per PR; manually smoke the fight scene in dev between each.

### Commit 1 — Extract types (~30 min, ~300 LOC moved)

Cut **lines 32-211 + line 32 (`FightPhase2D` etc.)** + the late-file types (`PoseKey`, `Camera2D`, etc.) into `fightTypes.ts`. Re-export from `FightEngine2D.ts` so callers aren't disturbed:

```ts
// FightEngine2D.ts
export type { FightPhase2D, FighterState2D, /* ... */ } from "./fightTypes";
```

**Smoke**: load `/fight`, verify both fighters render and the round timer starts.

### Commit 2 — Extract pure frame data (~45 min, ~447 LOC moved)

Cut **lines 213-560** (`getStandingHurtBoxes`, `getCrouchingHurtBoxes`, `getAirHurtBoxes`, `aabbOverlap`, `toWorld`, `buildMoveData`, `buildSpecialMoveData`, `stateToPose`) into `fightFrameData.ts`. Update imports.

**Smoke**: throw a punch, confirm a hit registers and damage flashes.

### Commit 3 — Extract AI (~1 hour, ~700 LOC moved)

Cut all AI methods (`updateAi`, `chooseAiAction`, etc.) and `AIDifficultyProfile` into `fightAi.ts`. The AI module exposes `decideNextAction(fighter, opponent, profile, frame)` returning an action enum; the engine class's `update()` loop calls it.

**Smoke**: fight an AI opponent, confirm it still attacks and blocks.

### Commit 4 — Extract renderer (~2 hours, ~1,200 LOC moved)

Cut all `private draw*` methods into a `FightRenderer2D` class in `fightRenderer.ts`. The engine instantiates one and calls `render(ctx, state)` once per frame.

**Smoke**: this is the riskiest commit; verify particles, hitsplashes, damage numbers, screen flash, hitstop, and HUD all still render.

### Commit 5 — Extract simulation (~2 hours, ~1,000 LOC moved)

Cut state-mutation methods (`applyHit`, `advancePhase`, `processProjectiles`) into a `FightSimulation` class. The orchestrator now reads like:

```ts
update() {
  this.sim.tick(this.input);
  this.ai.maybeAct(this.sim.state);
}
render() {
  this.renderer.draw(this.ctx, this.sim.state);
}
```

**Smoke**: full match end-to-end, both rounds, both fighters.

### Commit 6 — Move + re-barrel (~30 min)

Move every file into `apps/client/src/game/fight-engine-2d/` and add `index.ts`. Update the one call site (`FightPage.tsx`).

**Smoke**: typecheck + run a full match.

## Why this isn't done in one shot

- **Test coverage on FightEngine2D is near-zero** (audit C-09). A 4,558-line refactor with no tests = silent breakage.
- **Manual smoke is the only signal** between commits; it costs human time and concentration.
- **Each step rolls back cleanly.** A 6-step rollout with `git revert` per step is much safer than a single mega-commit.

## What the audit Wave 3.1 commit landed

The audit pass landed the analysis + plan only. Actual extraction is reserved for a sequence of focused PRs because doing them in the audit branch would mean either skipping the manual smoke step or batching too many risky moves.

The audit pass *does* set up the conditions for safe extraction:
- Wave 2.3 added an integration-test harness so `fightSimulation.ts`'s state machine can grow proper tests.
- Wave 1.3's barrel-coverage CI guard catches a category of "I forgot to add this to a registry" errors that the renderer split would otherwise be vulnerable to.
- Wave 7's `useMemo` on `GameContext` dropped a major source of mid-fight re-renders that would have masked behavioral regressions during a renderer extraction.

When the team is ready, follow the 6-commit plan.
