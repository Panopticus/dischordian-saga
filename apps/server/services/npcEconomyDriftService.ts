/* ═══════════════════════════════════════════════════════
   NPC ECONOMY DRIFT — §8.4 Living Sector Economies.

   Once per season tick, simulates NPC factions trading
   without the player. Each faction injects per-sector
   saturation deltas (positive = oversupplying / crashing
   prices; negative = hoarding / lifting prices). Adjusts
   for the active season declaration:

     - decl.casino.spread_open      — doubles the volatility
                                      (ambient deltas × 2)
     - decl.freeports.barter_season — halves throughput
                                      (ambient deltas × 0.5,
                                      reflecting credit-cleared
                                      paralysis)

   This sits behind the saturation HUD on the Convergence tab
   and behind the price-multiplier readouts on the Map tab.
   No DB additions; uses the existing tradeRouteSaturation
   table via bumpSaturation/decaySaturation.
   ═══════════════════════════════════════════════════════ */

import { logger } from "../logger";
import { bumpSaturation } from "./tradeRouteSaturationService";
import { seasonClockService } from "./seasonClockService";

/**
 * Per-faction ambient flow profile. Each entry: a sector to nudge
 * and the saturation delta applied per tick. Positive deltas
 * accumulate oversupply (price crash); negative deltas withdraw
 * inventory (price lift). Designers can tune freely; tests pin
 * the count + non-zero invariant only.
 */
const NPC_FLOW_PROFILES: ReadonlyArray<{
  factionTag: string;
  sectorId: string;
  delta: number;
  loreNote: string;
}> = [
  // Authority — institutional shipping volume into the trade nexus.
  { factionTag: "nb_authoritys_ledger", sectorId: "trade_nexus", delta: 2,
    loreNote: "Authority bulk freight clears every shift" },
  // Civic Engineers — light supply into the Babylon core (not visible to most).
  { factionTag: "nb_civic_engineers", sectorId: "new_babylon_core", delta: 1,
    loreNote: "Civic supply runs consolidate after-hours" },
  // Hierarchy — clone-economy throughput floods the Trench.
  { factionTag: "hierarchy_severance", sectorId: "the_trench", delta: 3,
    loreNote: "Severance clone-economy scheduled deliveries" },
  // Acquisitions — hostile-takeover volume, smaller but lumpy.
  { factionTag: "hierarchy_acquisitions", sectorId: "the_trench", delta: 1,
    loreNote: "Acquisitions blood-weave delivery cadence" },
  // Antiquarian — hoards, doesn't flood. Negative delta lifts price.
  { factionTag: "antiquarian_shelfmates", sectorId: "antiquarian_archive", delta: -1,
    loreNote: "Shelf-mates retain provenance volume" },
  // Casino — spread-driven; saturation creeps both ways across season.
  { factionTag: "antiquarian_casino", sectorId: "degens_casino", delta: 2,
    loreNote: "Casino Floor liquidity rotates aggressively" },
  // Free Ports — broad small-volume flow across frontier sectors.
  { factionTag: "ind_freeports", sectorId: "free_port_alpha", delta: 2,
    loreNote: "Free Ports barter rotation (alpha)" },
  { factionTag: "ind_freeports", sectorId: "free_port_beta", delta: 2,
    loreNote: "Free Ports barter rotation (beta)" },
  // Thaloria — pacifist economy; no nudge, but kept for symmetry.
  // (Intentionally absent.)
  // Insurgency — context-sensitive; flat 1pt nudge into staging sector.
  { factionTag: "insurgency_zero_doctrine", sectorId: "insurgency_haven", delta: 1,
    loreNote: "Zero Doctrine tradecraft staging" },
];

interface DriftResult {
  applied: number;
  declarationModifier: number;
}

/**
 * Run one tick of NPC ambient flow. Idempotent at the storage layer
 * (saturation values are clamped); this function simply nudges each
 * profile entry's sector by the calibrated delta.
 *
 * Returns a small report for the season tick driver to log.
 */
export async function runNpcDriftTick(): Promise<DriftResult> {
  const declaration = seasonClockService.getState().declaration;
  let modifier = 1.0;
  if (declaration?.declarationKey === "decl.casino.spread_open") {
    modifier = 2.0;
  } else if (declaration?.declarationKey === "decl.freeports.barter_season") {
    modifier = 0.5;
  }

  let applied = 0;
  for (const profile of NPC_FLOW_PROFILES) {
    const delta = Math.round(profile.delta * modifier);
    if (delta === 0) continue;
    try {
      await bumpSaturation(profile.sectorId, delta);
      applied += 1;
    } catch (err) {
      logger.warn("[npcDrift] bump failed:", err);
    }
  }
  return { applied, declarationModifier: modifier };
}

/** Test hook — return the profile registry shape for invariant tests. */
export function _getNpcFlowProfiles() {
  return NPC_FLOW_PROFILES;
}
