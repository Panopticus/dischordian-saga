/* ═══════════════════════════════════════════════════════
   DEAD MAN'S CIRCUIT SUIT ADAPTER (plan §G.11)

   Merges suit bonuses into the CIRCUIT_CONFIG.player_clone
   payload. Godot side reads the clone stats directly — no
   Godot code changes required for these specific fields.
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { piecesEquippedForSet, suitOnly } from "./_shared";

/** Matches the Godot-side player_clone shape. */
export interface CircuitPlayerClone {
  neural_sync: number;
  physical_integrity: number;
  velocity_ceiling: number;
  surface_grip: number;
  survival_instinct: number;
}

/**
 * §G.11.1 reconciliation — the TS-side `ClonePrototype` shape
 * (apps/shared/deadMansCircuit.ts) uses `_pct` suffixed field names
 * (velocity_ceiling_pct, surface_grip_pct), but the Godot-side
 * WebBridge dev_mode_config and the crewDmcBridge output both use
 * the bare names (velocity_ceiling, surface_grip). This converter
 * is the single place that bridges the two so the CONFIG post can
 * always ship the Godot-expected shape regardless of which source
 * produced the prototype.
 */
export function normalizeToCircuitPlayerClone(
  src: {
    neural_sync: number;
    physical_integrity: number;
    survival_instinct: number;
    velocity_ceiling?: number;
    velocity_ceiling_pct?: number;
    surface_grip?: number;
    surface_grip_pct?: number;
  },
): CircuitPlayerClone {
  return {
    neural_sync: src.neural_sync,
    physical_integrity: src.physical_integrity,
    velocity_ceiling:
      src.velocity_ceiling ?? src.velocity_ceiling_pct ?? 100,
    surface_grip: src.surface_grip ?? src.surface_grip_pct ?? 65,
    survival_instinct: src.survival_instinct,
  };
}

/**
 * Apply suit bonuses on top of a baseline player_clone. Caller passes
 * the baseline (from character creation / current run state) and gets
 * back the merged stats ready to post into CIRCUIT_CONFIG.
 */
export function mergeCircuitSuitBonuses(
  baseline: CircuitPlayerClone,
  bonuses: readonly AggregatedBonus[],
): CircuitPlayerClone {
  const s = suitOnly(bonuses);
  const engineer = piecesEquippedForSet(s, "pressure-loom-harness");
  const assassin = piecesEquippedForSet(s, "black-crepe-weave");
  const nullWeaver = piecesEquippedForSet(s, "null-weaver-mantle");
  return {
    neural_sync: baseline.neural_sync,
    physical_integrity:
      baseline.physical_integrity + (engineer >= 4 ? 1 : 0),
    velocity_ceiling:
      baseline.velocity_ceiling + (assassin >= 7 ? 1 : 0),
    surface_grip: baseline.surface_grip,
    survival_instinct:
      baseline.survival_instinct + (nullWeaver >= 10 ? 1 : 0),
  };
}
