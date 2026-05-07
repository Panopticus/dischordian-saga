/**
 * B5 — Card stat-budget coverage parity check.
 *
 * Every unit / structure card whose `power + health` falls outside
 * the per-cost tolerance window in
 * `apps/shared/tcg-core/balance/statCurve.ts` must carry an explicit
 * `balanceException: { reason, reviewer }` field. The exception puts
 * designer intent on record — "this card breaks the curve on
 * purpose, here is who approved it." Without the exception, the
 * card is a silent power-curve outlier.
 *
 * "Declared" = number of unit/structure cards with baseStats.
 * "Implemented" = the count that are either within tolerance OR
 * carry a `balanceException`.
 *
 * Reuses {@link STAT_CURVE} + {@link getExpectedStats} +
 * {@link getToleranceForCost} so the gate and the existing
 * balance/balanceAudit.ts reporter compute the same numbers.
 */
import { ALL_CARD_DEFINITIONS } from "../../tcg-core/cards/index";
import {
  getExpectedStats,
  getToleranceForCost,
} from "../../tcg-core/balance/statCurve";
import type { RawParityCount } from "../types";

export function checkCardStatBudgetCoverage(): RawParityCount {
  const offenders: string[] = [];
  let declared = 0;

  for (const card of ALL_CARD_DEFINITIONS) {
    if (card.cardType !== "unit" && card.cardType !== "structure") continue;
    if (!card.baseStats) continue;
    declared++;

    const total = card.baseStats.power + card.baseStats.health;
    const expected = getExpectedStats(card.cost, card.keywords.length);
    const tolerance = getToleranceForCost(card.cost);
    const deviation = expected === 0 ? 0 : (total - expected) / expected;
    const offBudget =
      deviation > tolerance || deviation < -tolerance;
    if (!offBudget) continue;

    if (card.balanceException) continue; // exception on file → counts as implemented

    const dev = Math.round(deviation * 100);
    const sign = dev > 0 ? "+" : "";
    offenders.push(
      `${card.id} (${card.name}): cost ${card.cost} ${card.baseStats.power}/${card.baseStats.health} ` +
        `(${total} stats vs expected ${expected}, ${sign}${dev}%) — add balanceException or rebalance`,
    );
  }

  return {
    declared,
    implemented: declared - offenders.length,
    missing: offenders,
  };
}
