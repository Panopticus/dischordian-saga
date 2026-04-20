/* ═══════════════════════════════════════════════════════
   CHESS SUIT ADAPTER (plan §G.11)

   Chess is deterministic — no combat hook. Suits only
   deliver cosmetic skins + a Probability-gated take-back.
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { piecesEquippedForSet, suitOnly } from "./_shared";

export interface ChessModifiers {
  /** Cosmetic board/piece skin id. null = engine default. */
  cosmeticBoardSkinId: string | null;
  /** One take-back per game (Dicewright 10pc). */
  takeBacksPerGame: number;
}

export function toChessModifiers(
  bonuses: readonly AggregatedBonus[],
): ChessModifiers {
  const s = suitOnly(bonuses);
  const dicewright = piecesEquippedForSet(s, "dicewrights-motley");
  return {
    cosmeticBoardSkinId: dicewright >= 10 ? "dicewrights-motley" : null,
    takeBacksPerGame: dicewright >= 10 ? 1 : 0,
  };
}
