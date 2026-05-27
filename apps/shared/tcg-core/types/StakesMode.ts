/* ═══════════════════════════════════════════════════════
   STAKES MODE — per-encounter multi-axis stakes config

   Plan §"Stakes Stream engine generalization".

   Declarative companion to the per-card `stakes_deltas`
   field (Card.ts). Each encounter that wants multi-axis
   stakes tracking declares one `StakesModeConfig`; the
   reducer (landing in a follow-up slice) walks card-play
   events + dialog-choice `stakesAxisDelta` outcomes
   (apps/shared/npcs/dialogTrees/types.ts) and updates the
   live `state.stakes` map within the encounter's clip
   ranges.

   Today the type lands without the reducer — encounter
   authors can declare a stakesMode and the type system
   will surface it, but the engine does not yet move state
   based on it. This is intentional: the type stabilizes
   the encounter authoring surface so when the reducer
   arrives, no encounter manifest needs to change.
   ═══════════════════════════════════════════════════════ */

import type { StakesAxis } from "../engine/stakesResolver";

export interface StakesAxisConfig {
  /** Initial value the encounter starts at. */
  initial: number;
  /** Lower clip — accumulated value never goes below this. */
  min: number;
  /** Upper clip — accumulated value never goes above this. */
  max: number;
  /** Short human-readable label for UI surfacing
   *  (e.g., "Trial Balance", "Public Witness", "Doctrine Purity"). */
  label: string;
}

/**
 * Per-encounter declaration of which stakes axes the encounter
 * tracks. Encounters opt in only to the axes they care about; the
 * reducer ignores card / dialog deltas for axes not declared here.
 *
 * Example (the §5.8 Authority Trial would declare):
 *
 *   {
 *     axes: {
 *       verdict:        { initial: 0, min: -10, max: 10, label: "Verdict" },
 *       public_witness: { initial: 0, min: -10, max: 10, label: "Public Witness" },
 *     },
 *   }
 */
export interface StakesModeConfig {
  axes: Partial<Record<StakesAxis, StakesAxisConfig>>;
}

/**
 * Live per-encounter stakes state, initialized from
 * `StakesModeConfig.axes` at match start (engine/init.ts) and
 * mutated by the reducer (engine/stakesReducer.ts) on each
 * authored card play.
 *
 * Only contains the axes the encounter's `stakesMode` declared —
 * deltas for axes not declared here are dropped on the floor.
 * Values are always clipped to the declaring `StakesAxisConfig`'s
 * [min, max] range, so consumers can read them without re-bounds-
 * checking.
 */
export interface StakesState {
  /** Live per-axis values, clipped to each declaring config's
   *  [min, max] range. */
  axes: Partial<Record<StakesAxis, number>>;
  /** Per-axis configs, copied from `StakesModeConfig` at match
   *  init. Carried inside the state so the reducer is pure-state
   *  (no need to thread the original `MatchConfig.stakesMode`
   *  through every call site). */
  config: Partial<Record<StakesAxis, StakesAxisConfig>>;
}
