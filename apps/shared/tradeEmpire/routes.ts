// apps/shared/tradeEmpire/routes.ts
//
// Trade Empire route + milestone helpers — Phase 2.1b.
//
// Per the plan §Trade Empire deliverable §3:
//   "Route-completion ceremonies: at 5 / 10 / 25 / 50 runs of the
//    same custom route. NPC acknowledgment lines per faction."
//
// Routes are canonical-keyed by (fromSectorId, toSectorId,
// cargoCategory?). Run count drives canonical-tier-crossings;
// engine canonically fires route_milestone ripple ONLY on
// canonical-tier-crossing (idempotent, append-only via
// tradeRouteMilestones uniq index).

import type { CargoCategory } from "./cargo";

// --- Canonical milestone tiers ----------------------------------------

/**
 * Canonical 4 milestone tiers per the plan §3:
 *   5 — first canonical-rhythm; canonical-Independent-trader nod
 *   10 — canonical-Locke calculation begins
 *   25 — canonical-Antiquarian shelf-categorisation per Seer §4.6
 *        "Programmer's shelf" canon
 *   50 — canonical-saga-tier route; canonical-route-completion
 *        ceremony fires
 */
export type RouteMilestoneTier = 5 | 10 | 25 | 50;

/**
 * Canonical milestone tiers in canonical-ascending order.
 * Engine canonically scans this list to determine canonical-next-tier.
 */
export const ROUTE_MILESTONE_TIERS: ReadonlyArray<RouteMilestoneTier> = [
  5,
  10,
  25,
  50,
];

// --- Route key derivation ---------------------------------------------

/**
 * Canonical-stable route key derived from
 * (fromSectorId, toSectorId, cargoCategory?). Used as the canonical
 * primary unique index in tradeRoutes (along with userId).
 *
 * Format: `{from}__{to}` (cargo-flexible) or
 *         `{from}__{to}__{cargo}` (cargo-constrained).
 *
 * NB: Routes are canonically-directional — `route(A, B)` is canonical-
 * distinct from `route(B, A)`. This matches canonical-Trade-Empire
 * canonical-trader-experience: a canonical-Bombadil → Pyralion run
 * is canonical-different from a canonical-Pyralion → Bombadil run
 * (different cargo, different counterparties, different reputation
 * deltas).
 */
export function makeRouteKey(
  fromSectorId: string,
  toSectorId: string,
  cargoCategory?: CargoCategory,
): string {
  if (cargoCategory) {
    return `${fromSectorId}__${toSectorId}__${cargoCategory}`;
  }
  return `${fromSectorId}__${toSectorId}`;
}

/**
 * Canonical-decompose a route key into its components. Returns
 * `null` if the key is canonical-malformed (shouldn't happen — keys
 * are canonical-deterministically generated).
 */
export function parseRouteKey(routeKey: string): {
  fromSectorId: string;
  toSectorId: string;
  cargoCategory: CargoCategory | undefined;
} | null {
  const parts = routeKey.split("__");
  if (parts.length < 2 || parts.length > 3) return null;
  const [fromSectorId, toSectorId, cargoCategory] = parts;
  if (!fromSectorId || !toSectorId) return null;
  return {
    fromSectorId,
    toSectorId,
    cargoCategory: (cargoCategory as CargoCategory) || undefined,
  };
}

// --- Milestone-tier helpers -------------------------------------------

/**
 * Canonical-next-tier resolver. Given the canonical-current
 * milestone-tier already reached, returns the canonical-next tier
 * the player is canonically working toward (or null if 50 already
 * reached — canonical-saga-tier is canonical-terminal).
 */
export function nextMilestoneTier(
  currentTier: number,
): RouteMilestoneTier | null {
  for (const tier of ROUTE_MILESTONE_TIERS) {
    if (tier > currentTier) return tier;
  }
  return null;
}

/**
 * Canonical-tier-crossing detector. Given a canonical-prior runCount
 * and a canonical-new runCount (after a canonical-completed run),
 * returns the canonical-list of milestone-tiers canonically crossed
 * during this canonical-run. Almost always returns [] or [tier] —
 * but a single canonical-run can in canonical-principle cross
 * multiple tiers (e.g., a canonical-back-fill of an existing route's
 * counter would canonical-cross all earlier tiers).
 */
export function milestoneTiersCrossedBy(
  priorRunCount: number,
  newRunCount: number,
): ReadonlyArray<RouteMilestoneTier> {
  if (newRunCount <= priorRunCount) return [];
  return ROUTE_MILESTONE_TIERS.filter(
    (tier) => priorRunCount < tier && tier <= newRunCount,
  );
}

/**
 * Canonical-fraction toward next tier. Returns 0.0–1.0 (or null if
 * canonical-saga-tier 50 already reached). Drives canonical-progress-
 * bar canonical-rendering in the canonical-route panel.
 */
export function progressTowardNextTier(
  currentRunCount: number,
): number | null {
  const next = nextMilestoneTier(currentRunCount);
  if (next === null) return null;
  // canonical-prior-tier baseline (or 0 if no canonical-prior tier reached)
  const priorTiers = ROUTE_MILESTONE_TIERS.filter((t) => t < next);
  const priorBaseline =
    priorTiers.length > 0 ? priorTiers[priorTiers.length - 1]! : 0;
  if (currentRunCount <= priorBaseline) return 0.0;
  return Math.min(
    1.0,
    (currentRunCount - priorBaseline) / (next - priorBaseline),
  );
}

// --- Canonical milestone-tier metadata --------------------------------

/**
 * Canonical metadata per milestone-tier — drives canonical-NPC-
 * acknowledgment-line selection at canonical-tier-crossings.
 */
export interface MilestoneTierCanon {
  tier: RouteMilestoneTier;
  /** Canonical name for the canonical-tier ("First Rhythm" etc.). */
  canonicalName: string;
  /** Canonical NPC acknowledgments fired at this canonical-tier-crossing. */
  canonicalAcknowledgers: ReadonlyArray<{
    npcKey: string;
    /**
     * Canonical-acknowledgment style per the plan §3:
     *   "Independent trader" / "Locke calculation" / "Antiquarian
     *    shelf-categorisation per Seer §4.6 *Programmer's shelf*"
     */
    canon: string;
  }>;
}

export const MILESTONE_TIER_CANON: Readonly<
  Record<RouteMilestoneTier, MilestoneTierCanon>
> = {
  5: {
    tier: 5,
    canonicalName: "First Rhythm",
    canonicalAcknowledgers: [
      {
        npcKey: "broker_independent_freeport",
        canon:
          "Canonical Independent-trader nod — canonical-recognition of " +
          "canonical-rhythm; canonical-faction-neutral.",
      },
    ],
  },
  10: {
    tier: 10,
    canonicalName: "Filed Pattern",
    canonicalAcknowledgers: [
      {
        npcKey: "adjudicator_locke",
        canon:
          "Canonical-Locke begins canonical-calculation — the canonical-" +
          "pattern is canonical-now canonical-on-file. Canonical-Adjudicator " +
          "register: 'I file canonical-routes that canonical-repeat. Yours " +
          "canonical-repeats.'",
      },
    ],
  },
  25: {
    tier: 25,
    canonicalName: "Shelf Categorisation",
    canonicalAcknowledgers: [
      {
        npcKey: "the_antiquarian",
        canon:
          "Canonical-Antiquarian shelf-categorisation per Seer §4.6 " +
          "'Programmer's shelf' canon. The canonical-route is canonical-" +
          "now a canonical-shelf-entry; canonical-attribution-archive " +
          "canonical-permanent.",
      },
      {
        npcKey: "the_seer",
        canon:
          "Canonical-Seer canonical-pre-recorded a canonical-25-tier " +
          "acknowledgment for canonical-routes that canonical-reach this " +
          "canonical-frequency. The canonical-recording canonical-arrives " +
          "at canonical-the canonical-tier-crossing.",
      },
    ],
  },
  50: {
    tier: 50,
    canonicalName: "Saga-Tier Route",
    canonicalAcknowledgers: [
      {
        npcKey: "adjudicator_locke",
        canon:
          "Canonical-Locke canonical-Authority-register acknowledgment: " +
          "the canonical-route is canonical-now canonical-saga-load-bearing. " +
          "Canonical-Authority canonical-files canonical-saga-tier routes " +
          "at canonical-permanent canonical-archive-grade.",
      },
      {
        npcKey: "the_antiquarian",
        canon:
          "Canonical-Antiquarian canonical-shelf-keeper acknowledgment — " +
          "canonical-saga-tier routes canonical-graduate to canonical-named " +
          "canonical-shelves. Canonical-naming is canonical-Antiquarian's " +
          "canonical-prerogative.",
      },
      {
        npcKey: "broker_independent_freeport",
        canon:
          "Canonical-Independent-trader canonical-ceremony — canonical-" +
          "saga-tier routes canonical-earn canonical-broker-comp at the " +
          "canonical-Freeport. Canonical-trader canonical-buys canonical-" +
          "the canonical-drinks.",
      },
    ],
  },
};
