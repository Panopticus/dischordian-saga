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
 * Eligibility excludes:
 *   - **Tokens** (id prefix `tok_` / `token_`) — spawned by summon
 *     ops, not played from hand; their stat budget is shaped by the
 *     summoning card's cost, not their own (which is always 0).
 *   - **Reserved cards** (`reserved: true`) — retroactive deliveries
 *     never enter the deck-builder pool.
 *   - **Warlord-only cards** (`warlord_only: true`) — scripted opponent
 *     decks only; balance is shaped by the §5.5 lockout mechanic, not
 *     the standard curve.
 *
 * "Declared" = the eligible-set count.
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

function isToken(id: string): boolean {
  return id.startsWith("tok_") || id.startsWith("token_");
}

export function checkCardStatBudgetCoverage(): RawParityCount {
  const offenders: string[] = [];
  let declared = 0;

  for (const card of ALL_CARD_DEFINITIONS) {
    if (card.cardType !== "unit" && card.cardType !== "structure") continue;
    if (!card.baseStats) continue;
    if (isToken(card.id)) continue;
    if (card.reserved) continue;
    if (card.warlord_only) continue;
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
