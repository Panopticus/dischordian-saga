/* ═══════════════════════════════════════════════════════
   DISCOVERY TIERS
   audit/16 PR 15 (finding ER7 — Escape Room persona).

   Pre-audit, Loredex discovery was binary: an entity was
   either in `discoveredIds: Set<string>` or it wasn't.
   Players who glimpsed an NPC across a room, or heard their
   name dropped in passing, gained nothing from the partial
   knowledge.

   The audit asked for a four-tier progression — silhouette
   → name → details → full — so that incidental encounters
   (overhearing a name, glimpsing a portrait through a
   doorway, finding a written reference) seed Loredex
   entries at lower tiers, and the player accumulates
   knowledge through the natural play loop rather than
   binary "discovered or not" gates.

   This module is the schema half. The consumer wiring (the
   LoredexContext extension that adds a parallel
   `discoveryTiers: Map<string, DiscoveryTier>` field
   alongside the existing `discoveredIds: Set<string>`) is
   queued for a follow-up; this PR ships the substrate so
   authors can populate per-entity tier-thresholds today.

   The existing Set<string> stays in place — the new
   Map<string, DiscoveryTier> is additive, so every existing
   `discoveredIds.has(id)` caller keeps working. The sugar
   helper `isDiscoveredAtLeast(id, "name", tiers)` is the
   tier-aware replacement.
   ═══════════════════════════════════════════════════════ */

/** Four canonical discovery tiers, ordered weakest → strongest. */
export type DiscoveryTier = "silhouette" | "name" | "details" | "full";

/** Numeric rank for ordered comparisons. Higher = more known. */
export const DISCOVERY_TIER_RANK: Readonly<Record<DiscoveryTier, number>> = {
  silhouette: 1,
  name: 2,
  details: 3,
  full: 4,
};

/** Ordered for UI surfaces that iterate tiers in progression. */
export const DISCOVERY_TIERS_ORDERED: readonly DiscoveryTier[] = [
  "silhouette",
  "name",
  "details",
  "full",
];

/** Player-facing labels per tier. Authors render these in the
 *  Loredex when an entity surfaces at a partial tier. */
export const DISCOVERY_TIER_LABEL: Readonly<Record<DiscoveryTier, string>> = {
  silhouette: "Silhouette",
  name: "Name Known",
  details: "Details Known",
  full: "Fully Discovered",
};

/* ─── Pure helpers ─────────────────────────────────────── */

/** Compare two tiers — returns -1 / 0 / 1 by rank. */
export function compareDiscoveryTier(
  a: DiscoveryTier,
  b: DiscoveryTier,
): -1 | 0 | 1 {
  const r = DISCOVERY_TIER_RANK[a] - DISCOVERY_TIER_RANK[b];
  return r < 0 ? -1 : r > 0 ? 1 : 0;
}

/** Returns the higher of two tiers. Useful for accumulating
 *  partial discovery — if a player glimpses an NPC's silhouette
 *  in one room and learns their name in another, the canonical
 *  tier should be `name` (the higher of the two). */
export function maxDiscoveryTier(
  a: DiscoveryTier,
  b: DiscoveryTier,
): DiscoveryTier {
  return DISCOVERY_TIER_RANK[a] >= DISCOVERY_TIER_RANK[b] ? a : b;
}

/** True iff the player's current tier is at or above the
 *  required threshold. Drives "show this lore line at
 *  details+" gating. */
export function isDiscoveredAtLeast(
  entityId: string,
  required: DiscoveryTier,
  tiers: ReadonlyMap<string, DiscoveryTier>,
): boolean {
  const current = tiers.get(entityId);
  if (!current) return false;
  return DISCOVERY_TIER_RANK[current] >= DISCOVERY_TIER_RANK[required];
}

/** Promote the player's tier for an entity to at-least-X.
 *  Returns a new Map (immutable update pattern). Idempotent
 *  — promoting to a tier that's already lower-than-current
 *  is a no-op. */
export function promoteDiscoveryTier(
  tiers: ReadonlyMap<string, DiscoveryTier>,
  entityId: string,
  newTier: DiscoveryTier,
): Map<string, DiscoveryTier> {
  const next = new Map(tiers);
  const current = next.get(entityId);
  if (!current) {
    next.set(entityId, newTier);
  } else {
    next.set(entityId, maxDiscoveryTier(current, newTier));
  }
  return next;
}

/** Compute a coverage stat — "how many entities are at
 *  tier X or higher?" — for the Loredex progress UI. */
export function countAtTier(
  tiers: ReadonlyMap<string, DiscoveryTier>,
  threshold: DiscoveryTier,
): number {
  let count = 0;
  for (const tier of tiers.values()) {
    if (DISCOVERY_TIER_RANK[tier] >= DISCOVERY_TIER_RANK[threshold]) count += 1;
  }
  return count;
}
