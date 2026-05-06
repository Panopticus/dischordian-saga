// apps/shared/tradeEmpire/travel.ts
//
// Travel cost helpers — Phase B of the Lore-Aligned Galactic-Empire
// Overhaul. Pure functions; the trade empire router calls these to
// charge / discount fuel costs when a mission targets a far sector.
//
// Galactic exploration today is "instant warp to anywhere" — the
// player can target a sector 6 hops away with no cost differential
// vs. an adjacent one. This module adds a *fuel cost* (in materials)
// scaled by hop distance, plus discounts for fast-travel networks
// (Antiquarian pocket → free; spy network → discounted).

/** Base fuel cost per hop beyond the free-travel radius. */
export const BASE_FUEL_COST_PER_HOP = 5;

/** Number of hops the player can travel for free. */
export const FREE_TRAVEL_RADIUS = 2;

export type FastTravelNetwork =
  | "antiquarian_pocket"
  | "spy_network"
  | "thaloria_revival_corridor";

/**
 * Fast-travel multipliers. 0 = free. Higher means more expensive
 * (e.g. an adversarial network).
 */
const NETWORK_MULTIPLIER: Readonly<Record<FastTravelNetwork, number>> = {
  antiquarian_pocket: 0,
  spy_network: 0.5,
  thaloria_revival_corridor: 0.3,
};

export interface TravelCostInputs {
  hopDistance: number;
  /** Optional fast-travel network the player has access to. */
  fastTravelNetwork?: FastTravelNetwork;
}

export interface TravelCostResult {
  materialsCost: number;
  discountReason: string | null;
}

/**
 * Compute the materials cost for a single mission dispatch given the
 * hop distance to the target sector and any fast-travel network the
 * player has access to.
 */
export function computeTravelCost(inputs: TravelCostInputs): TravelCostResult {
  const billableHops = Math.max(0, inputs.hopDistance - FREE_TRAVEL_RADIUS);
  if (billableHops === 0) {
    return { materialsCost: 0, discountReason: null };
  }
  const baseCost = billableHops * BASE_FUEL_COST_PER_HOP;
  if (!inputs.fastTravelNetwork) {
    return { materialsCost: baseCost, discountReason: null };
  }
  const mult = NETWORK_MULTIPLIER[inputs.fastTravelNetwork];
  const discounted = Math.round(baseCost * mult);
  return {
    materialsCost: discounted,
    discountReason:
      mult === 0
        ? `${inputs.fastTravelNetwork} (free pass-through)`
        : `${inputs.fastTravelNetwork} (${Math.round((1 - mult) * 100)}% discount)`,
  };
}

/**
 * Compute hop distance between two sectors via BFS over the adjacency
 * graph. Caller supplies the adjacency map (from GALACTIC_MAP). Returns
 * Infinity if unreachable.
 */
export function computeHopDistance(
  fromSectorId: string,
  toSectorId: string,
  adjacency: ReadonlyMap<string, ReadonlyArray<string>>,
): number {
  if (fromSectorId === toSectorId) return 0;
  const visited = new Set<string>([fromSectorId]);
  let frontier: string[] = [fromSectorId];
  let depth = 0;
  while (frontier.length > 0) {
    depth += 1;
    const next: string[] = [];
    for (const sec of frontier) {
      const neighbors = adjacency.get(sec) ?? [];
      for (const n of neighbors) {
        if (n === toSectorId) return depth;
        if (visited.has(n)) continue;
        visited.add(n);
        next.push(n);
      }
    }
    frontier = next;
    if (depth > 32) break; // safety guard — galaxy graph is small
  }
  return Infinity;
}
