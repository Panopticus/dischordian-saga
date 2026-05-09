/* ═══════════════════════════════════════════════════════
   HOTSPOT VISIT TIERS
   audit/16 PR 15 (finding ER8 — Escape Room persona).

   Pre-audit, room visit count was tracked but never used
   by the narrative — the room described itself the same
   way on the first, second, and tenth visit. The audit
   asked for "second visit" (and beyond) lines: the second
   time a player examines the captain's desk, they should
   notice something they missed; the fifth time, the
   narration should acknowledge their thoroughness.

   This module is the schema. Each hotspot can declare a
   list of visit-count tiers; each tier names a minimum
   visit count + an alternate response id. The
   `getVisitTier(visitCount, hotspot)` helper picks the
   highest tier whose threshold the player has crossed.

   Schema-only ship. The `resolveVerbResponse` runtime that
   threads visitCount through the response-resolver and
   serves the alternate text is queued for a content
   follow-up; this PR lands the schema + helper so authors
   can populate per-hotspot tiers today.
   ═══════════════════════════════════════════════════════ */

/** One narrative-tier for a hotspot. */
export interface HotspotVisitTier {
  /** Stable id; pattern: "tier_{hotspot}_{descriptor}". */
  id: string;
  /** Minimum visit count for this tier to apply. Author
   *  invariant: tier list is sorted ascending by this
   *  field; getVisitTier walks back-to-front to find the
   *  highest applicable tier. */
  requiredVisitCount: number;
  /** Optional alternate response/narration id. Consumers
   *  resolve this against their authored response registry
   *  (e.g. `verbResponses[id]`). */
  responseId?: string;
  /** Optional inline text override — useful when authors
   *  want to anchor a tier without registering a new
   *  responseId. */
  textOverride?: string;
}

/** A hotspot's visit-tier configuration. Hotspot authors
 *  add this as an optional `tiers` field on their existing
 *  Hotspot interface. */
export interface HotspotWithTiers {
  tiers?: readonly HotspotVisitTier[];
}

/* ─── Pure helpers ─────────────────────────────────────── */

/** Pick the highest-applicable tier for the player's current
 *  visit count. Returns null when no tier qualifies (caller
 *  falls back to the hotspot's default response). */
export function getVisitTier(
  visitCount: number,
  hotspot: HotspotWithTiers,
): HotspotVisitTier | null {
  const tiers = hotspot.tiers;
  if (!tiers || tiers.length === 0) return null;
  // Walk back-to-front so we return the highest qualifying
  // tier without sorting per-call. Authors are expected to
  // pre-sort by `requiredVisitCount` ascending; if not, the
  // behaviour is undefined for that tier list.
  for (let i = tiers.length - 1; i >= 0; i--) {
    const tier = tiers[i]!;
    if (visitCount >= tier.requiredVisitCount) return tier;
  }
  return null;
}

/** Returns the resolved response id (or text override) for
 *  this visit. Useful for renderers that just want "the
 *  string to show right now" without thinking about tiers. */
export function getVisitResponse(
  visitCount: number,
  hotspot: HotspotWithTiers,
): { responseId?: string; textOverride?: string } | null {
  const tier = getVisitTier(visitCount, hotspot);
  if (!tier) return null;
  return {
    responseId: tier.responseId,
    textOverride: tier.textOverride,
  };
}

/** Author-time validator: returns true iff the tiers list is
 *  sorted ascending by requiredVisitCount with no duplicates.
 *  Wired into ship-check / room-mystery test invariants in a
 *  follow-up. */
export function tiersAreWellFormed(
  tiers: readonly HotspotVisitTier[],
): boolean {
  for (let i = 1; i < tiers.length; i++) {
    if (tiers[i]!.requiredVisitCount <= tiers[i - 1]!.requiredVisitCount) {
      return false;
    }
  }
  return true;
}
