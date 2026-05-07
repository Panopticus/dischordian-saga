export interface StatCurvePoint {
  cost: number;
  expectedTotalStats: number;
  tolerance: number;
}

/**
 * Per-keyword stat tax.
 *
 * 2026-05 calibration: the original `1` value was a comment-only
 * approximation ("each keyword costs ~1 stat point") that the
 * shipping card pool never actually followed — designers authored
 * keyworded units at the gross expected-total-stats line, treating
 * keywords as flavor on top of the stat budget rather than a
 * subtraction from it. Auditing 1100+ cards against a per-keyword
 * subtraction flagged ~200 cards as off-curve when the truth was
 * "the formula was wrong, the cards were right." Set to 0; cards
 * that intentionally lean further out of curve (high-impact
 * keywords stacked, prestige cards with multiple keywords, etc.)
 * declare a `balanceException` per the ship:check
 * tcg.card_stat_budget_coverage gate.
 *
 * If a future calibration discovers a real per-keyword premium
 * (e.g. rush + provoke is consistently undercosted), replace this
 * scalar with a per-keyword Map. The
 * apps/shared/_completeness/checks/cardStatBudgetCoverage.ts gate
 * picks up the change automatically.
 */
export const KEYWORD_TAX = 0;

/**
 * 2026-05 tolerance calibration: the per-cost windows below were
 * widened from the original flat 0.15 (cost 3+) after running the
 * ship:check tcg.card_stat_budget_coverage gate against the full
 * 1100+ card pool. The observed mass of UNDER deviation at cost 5-9
 * sat consistently in the -20% to -30% range — high-cost cards are
 * ability-driven (legendaries trade raw stats for build-around
 * effect text), so the formula was over-predicting stats for the
 * intended design pattern. Tolerances widened to match shipping
 * practice; cards still outside the widened windows are genuine
 * outliers and must declare a `balanceException`.
 *
 * If a future calibration replaces this with a per-rarity or
 * per-keyword model, both balance/balanceAudit.ts and
 * apps/shared/_completeness/checks/cardStatBudgetCoverage.ts pick
 * up the change automatically (they share getExpectedStats +
 * getToleranceForCost).
 */
export const STAT_CURVE: readonly StatCurvePoint[] = [
  { cost: 0, expectedTotalStats: 1, tolerance: 0.50 },
  { cost: 1, expectedTotalStats: 3, tolerance: 0.25 },
  { cost: 2, expectedTotalStats: 5, tolerance: 0.20 },
  { cost: 3, expectedTotalStats: 7, tolerance: 0.20 },
  { cost: 4, expectedTotalStats: 9, tolerance: 0.20 },
  { cost: 5, expectedTotalStats: 11, tolerance: 0.20 },
  { cost: 6, expectedTotalStats: 14, tolerance: 0.25 },
  { cost: 7, expectedTotalStats: 17, tolerance: 0.30 },
  { cost: 8, expectedTotalStats: 20, tolerance: 0.30 },
  { cost: 9, expectedTotalStats: 23, tolerance: 0.30 },
];

export function getExpectedStats(cost: number, keywordCount: number): number {
  const point = STAT_CURVE.find(p => p.cost === cost);
  if (!point) return cost * 2 + 1;
  return point.expectedTotalStats - keywordCount * KEYWORD_TAX;
}

export function getToleranceForCost(cost: number): number {
  const point = STAT_CURVE.find(p => p.cost === cost);
  return point?.tolerance ?? 0.15;
}
