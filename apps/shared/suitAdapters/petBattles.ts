/* ═══════════════════════════════════════════════════════
   PET BATTLES SUIT ADAPTER (plan §G.11)

   Pet bonuses inherit a fraction (default 50%) of the
   operative's suit bonuses — "an Oracle's stylus guides
   their familiar."
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { suitOnly, piecesEquippedForSet } from "./_shared";

export interface PetBattleModifiers {
  /** Multiplier applied to pet damage. 1.0 = no change. */
  petDamageMult: number;
  /** Multiplier applied to pet accuracy. 1.0 = no change. */
  petAccuracyMult: number;
  /** Flat HP bonus added to pet max HP. */
  petHpFlat: number;
}

/** Fraction of the operative bonus that propagates to the pet. */
export const PET_INHERIT_FRACTION = 0.5;

export function toPetBattleModifiers(
  bonuses: readonly AggregatedBonus[],
): PetBattleModifiers {
  const s = suitOnly(bonuses);
  const oracle = piecesEquippedForSet(s, "regalia-of-the-seeing-stylus");
  const bulwark = piecesEquippedForSet(s, "bulwark-of-the-eighth-column");
  const ember = piecesEquippedForSet(s, "ember-bellows-array");
  const operatorAccuracy = oracle >= 2 ? 0.1 : 0;
  const operatorDamage = ember >= 7 ? 0.08 : 0;
  const operatorHp = bulwark >= 4 ? 5 : 0;
  return {
    petDamageMult: 1 + operatorDamage * PET_INHERIT_FRACTION,
    petAccuracyMult: 1 + operatorAccuracy * PET_INHERIT_FRACTION,
    petHpFlat: Math.round(operatorHp * PET_INHERIT_FRACTION),
  };
}
