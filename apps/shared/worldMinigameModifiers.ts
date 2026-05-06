/* ═══════════════════════════════════════════════════════
   WORLD → MINIGAME MODIFIERS

   Plan §C7. Today the Living Universe is one-way: minigame
   actions feed pressure, but the world doesn't feed back into
   the minigames. This module closes the loop — the current
   pressure / cycle state grants temporary modifiers in each
   minigame surface.

     "Light energy high → +5% tower damage this week."
     "Vortex proximity > 75 → +1 maximum mana in card battles."

   Pure data + helper. The minigame entry points (TowerDefense
   page, CardBattle page, etc.) call computeMinigameModifiers
   and apply the output to their per-run base values.
   ═══════════════════════════════════════════════════════ */

import type { PressureSnapshot } from "./tradePriceDrift";

export interface MinigameModifierBundle {
  /** Card battle: % multiplier on the player's general HP. */
  cardGeneralHp: number;
  /** Card battle: flat bonus to starting hand size at 0 mana. */
  cardStartingHandBonus: number;
  /** Tower defense: % bonus on tower base damage. */
  towerDamageBonus: number;
  /** Pet battle: % bonus on the player's pet starting energy. */
  petStartingEnergyBonus: number;
  /** Chess climb: flat tier-difficulty offset (negative = easier). */
  chessClimbDifficultyDelta: number;
  /** Trade Empire: flat bonus to the player's daily passive credits. */
  tradeDailyCreditsBonus: number;
  /** Human-readable provenance — which pressure dimension drove the
   *  largest single modifier. Useful for the UI tooltip. */
  drivenBy: string;
}

export const NEUTRAL_MODIFIERS: MinigameModifierBundle = {
  cardGeneralHp: 1,
  cardStartingHandBonus: 0,
  towerDamageBonus: 1,
  petStartingEnergyBonus: 1,
  chessClimbDifficultyDelta: 0,
  tradeDailyCreditsBonus: 0,
  drivenBy: "neutral",
};

/** Derive minigame modifiers from current pressure state. */
export function computeMinigameModifiers(p: PressureSnapshot): MinigameModifierBundle {
  const cycle = p.cycleNet ?? 0;
  const deaths = p.deaths ?? 0;
  const truth = p.truthRevealed ?? 0;
  const explor = p.exploration ?? 0;

  // Light high → defensive bonuses (HP up, towers stronger)
  // Dark high → aggressive bonuses (extra hand size, +1 energy)
  const cardGeneralHp = clamp(1 + 0.003 * cycle, 0.85, 1.15);
  const towerDamageBonus = clamp(1 + 0.0025 * cycle, 0.9, 1.1);
  const cardStartingHandBonus = cycle <= -50 ? 1 : 0;
  const petStartingEnergyBonus = clamp(1 + 0.002 * Math.abs(cycle), 1, 1.08);

  // Truth revealed makes chess climb easier (player has the
  // pattern); deaths make it harder (the world is louder).
  const chessClimbDifficultyDelta = Math.round(-0.05 * truth + 0.04 * deaths);

  // Exploration grants a small daily-credits bonus — frontier
  // money flows back to settled trade lanes.
  const tradeDailyCreditsBonus = Math.max(0, Math.round(2 * explor));

  // Provenance: which dimension dominates this snapshot
  const dominance: [string, number][] = [
    ["light_energy", Math.max(0, cycle)],
    ["dark_energy", Math.max(0, -cycle)],
    ["deaths", deaths],
    ["truth_revealed", truth],
    ["exploration", explor],
  ];
  dominance.sort((a, b) => b[1] - a[1]);
  const drivenBy = dominance[0]?.[1] && dominance[0][1] > 0 ? dominance[0][0] : "neutral";

  return {
    cardGeneralHp,
    cardStartingHandBonus,
    towerDamageBonus,
    petStartingEnergyBonus,
    chessClimbDifficultyDelta,
    tradeDailyCreditsBonus,
    drivenBy,
  };
}

function clamp(x: number, lo: number, hi: number): number {
  if (x < lo) return lo;
  if (x > hi) return hi;
  return Math.round(x * 100) / 100;
}
