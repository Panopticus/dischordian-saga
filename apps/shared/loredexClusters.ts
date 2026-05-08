/* ═══════════════════════════════════════════════════════
   LOREDEX CLUSTER TAXONOMY — audit/14.F1

   Canonical labels + ordering for the five thematic clusters
   tagged into loredex-data.json. Imported by the SearchPage
   cluster-filter UI; kept as a separate module so ship-check /
   tests can validate the taxonomy without dragging React in.
   ═══════════════════════════════════════════════════════ */

export type LoredexClusterId =
  | "imprint_mechanics"
  | "witnessing_doctrine"
  | "audit_discipline"
  | "seer_method"
  | "lionism_ethics";

export const LOREDEX_CLUSTER_LABELS: Readonly<Record<LoredexClusterId, string>> = {
  seer_method: "Seer Method",
  audit_discipline: "Audit",
  lionism_ethics: "Lionism",
  imprint_mechanics: "Imprint",
  witnessing_doctrine: "Witnessing",
};

/** Display order — most-populous-first per the post-sprint
 *  tagging tally. UI iterates this list so ordering is stable
 *  across renders. */
export const LOREDEX_CLUSTER_ORDER: readonly LoredexClusterId[] = [
  "seer_method",
  "audit_discipline",
  "lionism_ethics",
  "imprint_mechanics",
  "witnessing_doctrine",
];

interface ClusterableEntry {
  type?: string;
  cluster?: string;
}

/**
 * Tally concept entries by cluster. Non-concept entries and
 * entries without a cluster are skipped. Pure / synchronous /
 * dependency-free so unit tests can exercise it without a
 * React render harness.
 */
export function tallyConceptClusters(
  entries: readonly ClusterableEntry[],
): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const e of entries) {
    if (e.type !== "concept") continue;
    const c = e.cluster ?? "";
    if (!c) continue;
    counts[c] = (counts[c] ?? 0) + 1;
  }
  return counts;
}
