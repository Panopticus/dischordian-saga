// apps/shared/tradeEmpire/routeMarkets.ts
//
// Route commodity markets — Phase D.5 of the Lore-Aligned Galactic-
// Empire Overhaul. Pure helpers that turn route saturation into a
// reward-multiplier curve. The trade empire router consumes these
// when crediting mission rewards.
//
// Saturation increases each time a route runs to a sector; decays
// over real time. Beyond a threshold (oversupply), reward is
// progressively penalised so the player must diversify routes.

/** Saturation point at which oversupply begins (no penalty below). */
export const SATURATION_OVERSUPPLY_THRESHOLD = 100;
/** Maximum saturation before saturation tops out. */
export const SATURATION_CEILING = 200;
/** Saturation added per single mission delivered to a sector. */
export const SATURATION_PER_MISSION = 8;
/** Saturation decay per real day idle. */
export const SATURATION_DECAY_PER_DAY = 30;

/**
 * Compute the current reward multiplier for a delivery to a sector
 * with the given saturation. Below threshold = 1x; above threshold,
 * linear decay down to 0.4x at SATURATION_CEILING.
 */
export function rewardMultiplierForSaturation(saturation: number): number {
  if (saturation <= SATURATION_OVERSUPPLY_THRESHOLD) return 1;
  if (saturation >= SATURATION_CEILING) return 0.4;
  const overflow = saturation - SATURATION_OVERSUPPLY_THRESHOLD;
  const range = SATURATION_CEILING - SATURATION_OVERSUPPLY_THRESHOLD;
  // Linear from 1.0 at threshold down to 0.4 at ceiling.
  return 1 - (overflow / range) * 0.6;
}

/**
 * Project the next saturation value given the current value, the
 * elapsed real-time since last update, and an optional add-on for
 * a freshly-delivered mission.
 */
export function nextSaturation(args: {
  currentSaturation: number;
  msSinceLastUpdate: number;
  addOnDelivery?: number;
}): number {
  const { currentSaturation, msSinceLastUpdate } = args;
  const days = msSinceLastUpdate / 86_400_000;
  const decayed = Math.max(
    0,
    currentSaturation - days * SATURATION_DECAY_PER_DAY,
  );
  const next = decayed + (args.addOnDelivery ?? SATURATION_PER_MISSION);
  return Math.min(SATURATION_CEILING, Math.max(0, Math.round(next)));
}

/** Human-readable label for the current saturation state. */
export function saturationLabel(saturation: number): string {
  if (saturation <= 25) return "frontier-fresh";
  if (saturation <= SATURATION_OVERSUPPLY_THRESHOLD) return "well-supplied";
  if (saturation <= 150) return "oversupplied";
  return "glutted";
}
