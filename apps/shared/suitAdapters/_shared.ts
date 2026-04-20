/* ═══════════════════════════════════════════════════════
   SUIT ADAPTER SHARED HELPERS (plan §G.11)

   Common shape + filters so every per-mode adapter stays
   tiny and unit-testable in isolation.
   ═══════════════════════════════════════════════════════ */

import type { AggregatedBonus } from "@/game/passiveBonusAggregator";

/** Keep only the suit-set bonuses from the aggregator's flat list. */
export function suitOnly(
  bonuses: readonly AggregatedBonus[],
): readonly AggregatedBonus[] {
  return bonuses.filter((b) => b.sourceCategory === "suit_set");
}

/** Sum every bonus whose label matches a fuzzy substring. */
export function sumByLabelMatch(
  bonuses: readonly AggregatedBonus[],
  needle: string,
): number {
  const n = needle.toLowerCase();
  let total = 0;
  for (const b of bonuses) {
    if (b.label.toLowerCase().includes(n)) total += b.value;
  }
  return total;
}

/** Return true if ANY bonus's source is the given set id. */
export function hasSetBonus(
  bonuses: readonly AggregatedBonus[],
  setId: string,
): boolean {
  const src = `suit-set:${setId}`;
  return bonuses.some((b) => b.source === src);
}

/**
 * Parse the piece-count out of a suit-bonus label of the shape
 * `<setId> (<N>pc): <rest>`. Returns null if not parsable.
 */
export function pieceCountOfLabel(label: string): number | null {
  const m = /\((\d+)pc\)/.exec(label);
  return m ? Number(m[1]) : null;
}

/** Highest piece-count seen for the given set id across the list. */
export function piecesEquippedForSet(
  bonuses: readonly AggregatedBonus[],
  setId: string,
): number {
  const src = `suit-set:${setId}`;
  let max = 0;
  for (const b of bonuses) {
    if (b.source !== src) continue;
    const n = pieceCountOfLabel(b.label);
    if (n && n > max) max = n;
  }
  return max;
}
