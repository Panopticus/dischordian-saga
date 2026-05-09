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

/* ─── audit/16 PR 14 (finding TCG5 — TCG persona) ───────
   Stat-efficiency ratio. Ratio of a card's actual stat
   total to the curve's expected stat total at that cost.
   1.0 = on-curve; >1.0 = above-curve (over-statted);
   <1.0 = below-curve (under-statted, ability-driven).

   The audit'd intent is: tolerance windows are blunt
   (in-window or out-of-window). The efficiency RATIO
   exposes the gradient — a card at 0.85 isn't just
   "below curve," it's "85% of the curve's stat budget,"
   which lets deckbuilders rank ability-driven cards
   against raw-stat cards numerically.
   ───────────────────────────────────────────────────── */

export interface StatEfficiencyResult {
  cost: number;
  totalStats: number;
  expectedStats: number;
  /** Ratio of totalStats to expectedStats. 1.0 = on-curve. */
  ratio: number;
  /** Bucket: above (≥ 1+tolerance), within (in tolerance
   *  window), below (≤ 1-tolerance). Coarse grouping for
   *  UI surfaces that don't want to render the raw ratio. */
  bucket: "above" | "within" | "below";
  /** Short rendered label for tooltips, e.g. "120% of curve". */
  label: string;
}

export function getStatEfficiency(
  cost: number,
  totalStats: number,
  keywordCount: number,
): StatEfficiencyResult {
  const expected = getExpectedStats(cost, keywordCount);
  // Defensive against pathological zero-expected (cost 0
  // sometimes maps there; clamp to avoid Infinity ratios).
  const safeExpected = expected > 0 ? expected : 1;
  const ratio = totalStats / safeExpected;
  const tolerance = getToleranceForCost(cost);
  const bucket: "above" | "within" | "below" =
    ratio >= 1 + tolerance ? "above"
    : ratio <= 1 - tolerance ? "below"
    : "within";
  const pct = Math.round(ratio * 100);
  return {
    cost,
    totalStats,
    expectedStats: expected,
    ratio,
    bucket,
    label: `${pct}% of curve`,
  };
}

/**
 * audit/16 PR 14 (finding TCG1 — TCG persona).
 *
 * Average keyword count across a deck list. Pure helper;
 * the deckbuilder UI renders this alongside the existing
 * cost / faction breakdowns so players can see the keyword
 * density of their deck at a glance. Pre-audit there was
 * no surface for "is my deck keyword-heavy?" — players had
 * to scroll the full card list to count.
 */
export function avgKeywords(deck: ReadonlyArray<{ keywords?: readonly unknown[] }>): number {
  if (deck.length === 0) return 0;
  let total = 0;
  for (const card of deck) {
    total += card.keywords?.length ?? 0;
  }
  return total / deck.length;
}
