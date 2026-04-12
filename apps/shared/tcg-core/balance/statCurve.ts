export interface StatCurvePoint {
  cost: number;
  expectedTotalStats: number;
  tolerance: number;
}

export const KEYWORD_TAX = 1; // each keyword costs ~1 stat point

export const STAT_CURVE: readonly StatCurvePoint[] = [
  { cost: 0, expectedTotalStats: 1, tolerance: 0.50 },
  { cost: 1, expectedTotalStats: 3, tolerance: 0.25 },
  { cost: 2, expectedTotalStats: 5, tolerance: 0.20 },
  { cost: 3, expectedTotalStats: 7, tolerance: 0.15 },
  { cost: 4, expectedTotalStats: 9, tolerance: 0.15 },
  { cost: 5, expectedTotalStats: 11, tolerance: 0.15 },
  { cost: 6, expectedTotalStats: 14, tolerance: 0.15 },
  { cost: 7, expectedTotalStats: 17, tolerance: 0.15 },
  { cost: 8, expectedTotalStats: 20, tolerance: 0.15 },
  { cost: 9, expectedTotalStats: 23, tolerance: 0.15 },
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
