/* ═══════════════════════════════════════════════════════
   ACT 2 CLIMB BRIDGE — §6.3 + Chess Climb reconciliation

   The chess Climb (apps/shared/chessClimbTiers.ts) is the
   server-authoritative mechanical progression. Zephyr-9's
   classroom (act2Interlude.ts ZEPHYR_9_CLASSROOM) is the
   narrative framing that gates Dischordia card mechanics.

   They describe the same player journey from two angles:
     - Climb Tier 0 cleared → depth 1 (basic chess access)
     - Climb Tier 1 cleared → depth 3 (peek top card)
     - Climb Tier 2 cleared → depth 5 (undo once)
     - Climb Tier 3 cleared → depth 8 (Engineer's Opening)

   The hook in useNarrativeIntegration.ts reads the Climb
   state and uses climbRankToClassroomDepth() to derive an
   effective classroom depth that drives the existing tier
   flag loop. Nothing in the Climb router cares about these
   flags — the bridge is a one-way client projection.
   ═══════════════════════════════════════════════════════ */

/**
 * Map the server's highestClearedRank (-1 if nothing cleared;
 * 0–3 otherwise) to a classroom depth compatible with the
 * ZEPHYR_9_CLASSROOM table.
 *
 * The mapping was chosen so that clearing every Climb tier
 * lights up every classroom tier in order. The classroom
 * tiers (1/3/5/8) leave gaps because they were authored
 * before the Climb shipped; those gaps are still valid if
 * downstream gameplay ever wants to grant a depth crossing
 * from a non-Climb source (e.g. a scripted tutorial).
 */
export function climbRankToClassroomDepth(highestClearedRank: number): number {
  if (highestClearedRank < 0) return 0;
  if (highestClearedRank === 0) return 1;
  if (highestClearedRank === 1) return 3;
  if (highestClearedRank === 2) return 5;
  return 8; // rank 3 or higher
}

/** Inverse: classroom depth → minimum Climb rank that grants it. */
export function classroomDepthToClimbRank(depth: number): number {
  if (depth >= 8) return 3;
  if (depth >= 5) return 2;
  if (depth >= 3) return 1;
  if (depth >= 1) return 0;
  return -1;
}

/** Climb-tier companion trigger name for a given rank (0–3). */
export function climbTierCompanionTrigger(rank: number): string | null {
  if (rank < 0 || rank > 3) return null;
  return `chess_climb_tier_${rank}_won`;
}

/** Climb-tier narrative flag that gates the companion trigger's
 *  one-shot firing. Set alongside the `highestClearedRank` bridge. */
export function climbTierClearedFlag(rank: number): string | null {
  if (rank < 0 || rank > 3) return null;
  return `chess_climb_tier_${rank}_cleared`;
}
