/**
 * Colony Commerce — discovery-gate Phase B trade-empire extension.
 *
 * The Inception Ark seeds colony worlds from mature bloodlines; the
 * Trade Empire underwrites the founding voyages and books the
 * ongoing exports. This file is the canonical type + economics
 * surface; the runtime lives in apps/server/routers/colonyCommerce.ts
 * and the panel ships with TradeEmpirePage on the client.
 *
 * Two-stage handoff (per MECHANIC_SYSTEM_TUTORS):
 *   1. Elara introduces breeding at Act 3 (mech_breeding_tutor_seen)
 *   2. Veska commercializes mature bloodlines into colony lanes
 *      once trade_empire_unlocked is also set
 *
 * Veska's tutor copy frames the economics as a contract:
 *   - Founding voyage tariff is half what a Core run pays
 *   - First export starts at generation 2 (~30 cycles)
 *   - Founder reputation compounds across the colony's lifetime;
 *     three founded colonies tilt every tariff in seeded sectors
 */

/* ─── Vessel classes ─── */

/**
 * Three vessel classes ordered by capacity and voyage duration.
 * basic / arkforge / panoptic mirror the trade-empire vessel-tier
 * progression that already exists for cargo runs, with longer
 * durations on the colony surface (colony ships are slower than
 * cargo by canon — Veska's tutor line: "slower than the cargo
 * runs, but the harbor's tariff on a founding voyage is half").
 */
export type ColonyVesselClass =
  | "colony_ship_basic"
  | "colony_ship_arkforge"
  | "colony_ship_panoptic";

export interface ColonyVesselSpec {
  id: ColonyVesselClass;
  /** UI label (Veska says these names out loud). */
  displayName: string;
  /** Voyage duration in milliseconds. Calibrated against tradeEmpire mission durations. */
  voyageDurationMs: number;
  /** Base tariff in Dream tokens, BEFORE the 50% founding discount. */
  baseTariffDream: number;
  /** Required founder tier to charter (0 = open, 1 = first colony, etc.). */
  requiredFounderTier: number;
}

export const COLONY_VESSEL_SPECS: Readonly<Record<ColonyVesselClass, ColonyVesselSpec>> = Object.freeze({
  colony_ship_basic: {
    id: "colony_ship_basic",
    displayName: "Hauler-class Colony Ship",
    voyageDurationMs: 6 * 60 * 60 * 1000, // 6h
    baseTariffDream: 200,
    requiredFounderTier: 0,
  },
  colony_ship_arkforge: {
    id: "colony_ship_arkforge",
    displayName: "Arkforge-class Colony Ship",
    voyageDurationMs: 12 * 60 * 60 * 1000, // 12h
    baseTariffDream: 600,
    requiredFounderTier: 1,
  },
  colony_ship_panoptic: {
    id: "colony_ship_panoptic",
    displayName: "Panoptic-class Colony Ship",
    voyageDurationMs: 24 * 60 * 60 * 1000, // 24h
    baseTariffDream: 1500,
    requiredFounderTier: 3,
  },
});

/* ─── Eligible sectors ─── */

/**
 * Colony lanes are restricted to frontier-band sectors. Core is the
 * Hierarchy's seat and won't license colony charters; Whisper and
 * Reach are gated for canonical reasons (per Veska's trade-empire
 * tutor line: "Most captains skip those two."). The remaining five
 * are the canonical colony bands.
 */
export const COLONY_ELIGIBLE_SECTORS: readonly string[] = Object.freeze([
  "fringe",
  "reef",
  "verdant",
  "ash",
  "crystal",
]);

export function isColonyEligibleSector(sectorId: string): boolean {
  return COLONY_ELIGIBLE_SECTORS.includes(sectorId);
}

/* ─── Maturity ─── */

/**
 * Bloodline maturity threshold. A bloodline must have reached at
 * least this generation count before it can seed a colony. Matches
 * the third DLC chapter ("advocate_body_coordinates") which gates
 * its S2 unlock on 5 PURE generations — seeding sits one tier below.
 *
 * Generation 1 is the founding pod; Gen 3 is the earliest a
 * bloodline has measurably stabilized. Gating below this lets
 * inexperienced players over-commit a bloodline they haven't tested.
 */
export const BLOODLINE_MATURITY_GEN = 3;

/* ─── Economics ─── */

/**
 * Founding tariff is half the base — Veska's harbor incentive to
 * push captains toward seeding rather than running the same Core
 * lap forever. Expressed as a percentage of base; 50 = "half off."
 */
export const FOUNDING_TARIFF_DISCOUNT_PCT = 50;

/**
 * Founder discount in basis points per founded colony. Caps at
 * FOUNDER_DISCOUNT_CAP_BPS so a player who has seeded 20 colonies
 * doesn't trade for free.
 */
export const FOUNDER_DISCOUNT_PER_COLONY_BPS = 50;
export const FOUNDER_DISCOUNT_CAP_BPS = 500;

/**
 * Founder milestone tiers. Crossing each threshold updates
 * colonyFounderProgress.founderTier and unlocks the next vessel
 * class on the charter list.
 */
export const FOUNDING_MILESTONE_TIERS: readonly number[] = Object.freeze([1, 3, 5, 10]);

/**
 * Generation at which a colony begins exporting. Below this, the
 * colony is consuming the founding subsidy and producing no return.
 */
export const FIRST_EXPORT_GENERATION = 2;

/**
 * Per-generation export value (in Dream tokens) credited to the
 * founder when a colony's generation ticks past FIRST_EXPORT_GENERATION.
 * Tuned so a Generation-5 mature colony pays back the basic vessel's
 * founding tariff (~5 generations × 50 = 250, vs 100 founding cost).
 */
export const PER_GENERATION_EXPORT_VALUE = 50;

/* ─── Helpers ─── */

/**
 * Compute the actual tariff a captain pays for a founding voyage,
 * given the vessel's base tariff and the captain's current founder
 * discount (in bps).
 */
export function computeFoundingTariff(
  vessel: ColonyVesselSpec,
  founderDiscountBps: number,
): number {
  // Step 1: founding-voyage discount (50% off baseline).
  const afterFoundingDiscount =
    (vessel.baseTariffDream * (100 - FOUNDING_TARIFF_DISCOUNT_PCT)) / 100;
  // Step 2: founder reputation multiplier (in bps; 100 bps = 1%).
  const cappedFounderBps = Math.min(founderDiscountBps, FOUNDER_DISCOUNT_CAP_BPS);
  const founderMultiplier = (10000 - cappedFounderBps) / 10000;
  return Math.max(0, Math.round(afterFoundingDiscount * founderMultiplier));
}

/**
 * Resolve the founder tier from a count of founded colonies. Returns
 * the highest tier whose threshold has been reached.
 *
 *   0 colonies → tier 0
 *   1 colony   → tier 1
 *   3 colonies → tier 2
 *   5 colonies → tier 3
 *   10+ colonies → tier 4
 */
export function resolveFounderTier(totalColoniesFounded: number): number {
  let tier = 0;
  for (const threshold of FOUNDING_MILESTONE_TIERS) {
    if (totalColoniesFounded >= threshold) tier++;
  }
  return tier;
}

/**
 * Returns true if `prevCount`→`newCount` crosses any milestone tier.
 * Useful for "did this arrival fire a milestone?" branches in the
 * recordColonyArrival mutation.
 */
export function crossedMilestone(prevCount: number, newCount: number): boolean {
  return resolveFounderTier(newCount) > resolveFounderTier(prevCount);
}

/**
 * Founder discount in bps for the given founded-colony count.
 * Capped at FOUNDER_DISCOUNT_CAP_BPS.
 */
export function founderDiscountBps(totalColoniesFounded: number): number {
  return Math.min(
    totalColoniesFounded * FOUNDER_DISCOUNT_PER_COLONY_BPS,
    FOUNDER_DISCOUNT_CAP_BPS,
  );
}

/* ─── Runtime types ─── */

export type ColonyLaneStatus = "in_voyage" | "arrived" | "abandoned";

export interface ColonyLaneState {
  laneId: string;
  sectorId: string;
  vesselClass: ColonyVesselClass;
  bloodlineKey: string;
  signedAt: number;
  durationMs: number;
  tariffPaid: number;
  status: ColonyLaneStatus;
}

export interface ColonyWorldState {
  colonyId: string;
  sectorId: string;
  bloodlineKey: string;
  name: string;
  foundedAt: number;
  currentGeneration: number;
  lastExportAt: number | null;
  totalExportValue: number;
}

export interface FounderProgressState {
  totalColoniesFounded: number;
  founderTier: number;
  founderDiscountBps: number;
}

export interface ColonyCommerceState {
  founderProgress: FounderProgressState;
  activeLanes: ColonyLaneState[];
  colonies: ColonyWorldState[];
}
