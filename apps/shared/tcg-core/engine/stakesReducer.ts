/* ═══════════════════════════════════════════════════════
   STAKES REDUCER — multi-axis Stakes Stream engine writer

   Plan §"Stakes Stream engine generalization", second slice
   (the reducer that turns the type-level scaffolding from
   the prior slice into a live encounter-state machine).

   Consumes a card play and, for every axis the encounter's
   `stakesMode.axes` declares, reads the card's authored
   delta via `engine/stakesResolver.ts`, clips to the axis's
   [min, max] range, applies, and emits a `stakes_changed`
   event per axis (in declaration order — deterministic).

   No-op when:
     • the match was not initialized with a `stakesMode`
       config (`state.stakes === undefined`)
     • the card authors no `stakes_deltas` AND no
       `verdict_delta` (resolver returns undefined for
       every declared axis)

   Replay determinism

   Match outcomes for encounters WITHOUT `stakesMode` are
   bit-identical pre + post this slice (state.stakes is
   undefined → reducer is a no-op → no events emitted, no
   state diff). RULES_VERSION stays at 1.1.0.

   For encounters WITH `stakesMode`, this slice is the FIRST
   change to introduce state.stakes — there are no prior
   replays to be incompatible with. The deterministic-
   iteration contract (Object.keys order on a literal-keyed
   record is insertion-order in TC39) is preserved by walking
   STAKES_AXES directly rather than the encounter's axes map
   — see `iterAxes()` below.
   ═══════════════════════════════════════════════════════ */

import type { Draft } from "immer";
import type { CardDefinition } from "../types/Card";
import type { GameEvent } from "../types/Event";
import type { GameState } from "../types/GameState";
import type { Side } from "../types/Ids";
import type {
  StakesAxisConfig,
  StakesModeConfig,
  StakesState,
} from "../types/StakesMode";
import { STAKES_AXES, type StakesAxis, resolveCardStakeDelta } from "./stakesResolver";

/**
 * Iterate axes in canonical STAKES_AXES order — not Object.keys
 * order on the encounter's `axes` record. Encounter authors may
 * declare axes in any order; events must fire in a stable order
 * to keep replay traces deterministic across map-spread refactors.
 */
function* iterAxes(
  axesConfig: Partial<Record<StakesAxis, StakesAxisConfig>>,
): Generator<{ axis: StakesAxis; axisConfig: StakesAxisConfig }> {
  for (const axis of STAKES_AXES) {
    const axisConfig = axesConfig[axis];
    if (axisConfig) yield { axis, axisConfig };
  }
}

/**
 * Build the initial `StakesState` for a match. Each declared
 * axis seeds from its `initial` value, clipped (defensively) to
 * the declared [min, max] range. The per-axis configs are copied
 * into the state so the reducer can stay pure-state. Called from
 * engine/init.ts when `MatchConfig.stakesMode` is set.
 */
export function initStakesState(config: StakesModeConfig): StakesState {
  const axes: Partial<Record<StakesAxis, number>> = {};
  const configCopy: Partial<Record<StakesAxis, StakesAxisConfig>> = {};
  for (const { axis, axisConfig } of iterAxes(config.axes)) {
    axes[axis] = clip(axisConfig.initial, axisConfig);
    configCopy[axis] = axisConfig;
  }
  return { axes, config: configCopy };
}

/**
 * Apply a card play to the encounter's stakes state. No-op when
 * `state.stakes` is undefined (the match was not initialized with
 * a stakesMode config).
 *
 * For each axis declared on the encounter's stakes config:
 *   1. Read `resolveCardStakeDelta(card, axis)` — undefined or 0
 *      means the card authored no movement for that axis; skip.
 *   2. Compute the new value (current + delta), clip to [min, max].
 *   3. If the actual (clipped) delta is non-zero, write it and
 *      emit a `stakes_changed` event with `clipped: true` when
 *      the authored delta was bounded.
 */
export function applyCardPlayToStakes(
  draft: Draft<GameState>,
  card: CardDefinition,
  actor: Side,
  events: GameEvent[],
): void {
  if (!draft.stakes) return;

  for (const { axis, axisConfig } of iterAxes(draft.stakes.config)) {
    const authored = resolveCardStakeDelta(card, axis);
    if (typeof authored !== "number" || authored === 0) continue;

    const current = draft.stakes.axes[axis] ?? axisConfig.initial;
    const target = current + authored;
    const next = clip(target, axisConfig);
    const actualDelta = next - current;
    if (actualDelta === 0) continue;

    draft.stakes.axes[axis] = next;
    events.push({
      type: "stakes_changed",
      axis,
      player: actor,
      cardDefId: String(card.id),
      delta: actualDelta,
      newValue: next,
      clipped: actualDelta !== authored,
    });
  }
}

function clip(v: number, c: StakesAxisConfig): number {
  if (v < c.min) return c.min;
  if (v > c.max) return c.max;
  return v;
}
