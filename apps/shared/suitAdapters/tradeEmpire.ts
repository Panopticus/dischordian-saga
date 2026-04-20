/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE SUIT ADAPTER (plan §G.11)

   Trade Empire has no per-character stat model yet. This
   adapter creates one small concept — a dealmaking
   multiplier bundle — that the dealmaking UI can consume.
   Faction simulation stays deterministic (suits never
   touch the tick); only player-facing deals scale.
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";
import { hasSetBonus, piecesEquippedForSet, suitOnly } from "./_shared";

export interface TradeEmpireDealModifiers {
  /** Extra faction tiles visible on the map (Spy 4pc). */
  extraVisibleTiles: number;
  /** Leverage multiplier on human-faction negotiations (Mourner's Coat 7pc). */
  humanLeverageMult: number;
  /** Discount applied to same-set vendor lines (any 2pc). */
  sameSetDiscountPct: number;
  /** Free deal-reveal budget per act (Null-Weaver 10pc). */
  freeDealReveals: number;
}

export function toTradeEmpireDealModifiers(
  bonuses: readonly AggregatedBonus[],
): TradeEmpireDealModifiers {
  const s = suitOnly(bonuses);
  const spy = piecesEquippedForSet(s, "low-profile-tailoring");
  const mourner = piecesEquippedForSet(s, "the-mourners-coat");
  const nullWeaver = piecesEquippedForSet(s, "null-weaver-mantle");
  // any 2pc → same-set discount; conservative flat 5%.
  const anyPartial = hasSetBonus(s, "low-profile-tailoring") ||
    hasSetBonus(s, "the-mourners-coat") ||
    hasSetBonus(s, "regalia-of-the-seeing-stylus");
  return {
    extraVisibleTiles: spy >= 4 ? 1 : 0,
    humanLeverageMult: mourner >= 7 ? 1.15 : 1,
    sameSetDiscountPct: anyPartial ? 0.05 : 0,
    freeDealReveals: nullWeaver >= 10 ? 1 : 0,
  };
}
