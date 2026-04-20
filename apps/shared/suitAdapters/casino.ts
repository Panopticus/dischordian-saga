/* ═══════════════════════════════════════════════════════
   DEGEN'S CASINO SUIT ADAPTER (plan §G.11)

   Luck profile stays inside the house-edge envelope (+1 on
   ties, never on raw odds). Full Dicewright set gates the
   VIP room entirely — matches §B progressive disclosure.
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { piecesEquippedForSet, suitOnly } from "./_shared";

export interface CasinoModifiers {
  /** +1 favorable on tied outcomes (bounded — never shifts raw odds). */
  tieBreakFavor: number;
  /** True iff the VIP room is unlocked on the map. */
  vipRoomUnlocked: boolean;
  /** Remove bankroll caps (Dicewright 7pc). */
  bankrollCapUnlocked: boolean;
}

export function toCasinoModifiers(
  bonuses: readonly AggregatedBonus[],
): CasinoModifiers {
  const s = suitOnly(bonuses);
  const dicewright = piecesEquippedForSet(s, "dicewrights-motley");
  return {
    tieBreakFavor: dicewright >= 2 ? 1 : 0,
    vipRoomUnlocked: dicewright >= 10,
    bankrollCapUnlocked: dicewright >= 7,
  };
}
