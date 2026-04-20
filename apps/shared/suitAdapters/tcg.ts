/* ═══════════════════════════════════════════════════════
   TCG SUIT ADAPTER (plan §G.11)

   Translates suit bonuses into pre-match modifiers the
   story encounter reducer threads into the match. Modest
   integer deltas so the engine's existing clamps handle it.
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { piecesEquippedForSet, suitOnly } from "./_shared";

export interface TcgPreMatchModifiers {
  /** +extra card in opening hand (clamp 0..2 — engine limit). */
  extraCards: number;
  /** +extra mana on turn 1 (clamp 0..3 — engine limit). */
  extraMana: number;
  /** +extra general HP (clamp 0..10 — engine limit). */
  extraGeneralHp: number;
  /** Can preview top of encounter deck this encounter (Oracle 4pc). */
  canForesee: boolean;
}

export function toTcgPreMatchModifiers(
  bonuses: readonly AggregatedBonus[],
): TcgPreMatchModifiers {
  const s = suitOnly(bonuses);
  const oracle = piecesEquippedForSet(s, "regalia-of-the-seeing-stylus");
  const bulwark = piecesEquippedForSet(s, "bulwark-of-the-eighth-column");
  const exoframe = piecesEquippedForSet(s, "clockwork-exoframe");
  return {
    extraCards: oracle >= 2 ? 1 : 0,
    extraMana: 0,
    extraGeneralHp: bulwark >= 4 ? 3 : exoframe >= 4 ? 1 : 0,
    canForesee: oracle >= 4,
  };
}
