/* ═══════════════════════════════════════════════════════
   §6.3 ZEPHYR-9 CLASSROOM — tier-based unlock readers

   Small helpers that read `chessDepth` (or the equivalent tier
   flags `zephyr_classroom_tier_N_crossed`) and answer yes/no
   questions the Dischordia battle UI cares about:

     - canPeekTopCard()       — depth 3
     - canUndoOnePerMatch()   — depth 5
     - hasEngineersOpening()  — depth 8

   The tier flags are written by the classroom watcher in
   useNarrativeIntegration.ts (Phase B). Consumers should prefer
   reading the helpers here so the depth numbers stay in one
   place (act2Interlude.ts ZEPHYR_9_CLASSROOM). Pure module.
   ═══════════════════════════════════════════════════════ */
import { ZEPHYR_9_CLASSROOM } from "./act2Interlude";

/**
 * True when the player has crossed the given classroom tier. Reads
 * from either the flag set (preferred — survives save-load round
 * trips) or the live `chessDepth` counter as a fallback.
 */
export function hasCrossedClassroomTier(
  tierDepth: number,
  input: {
    chessDepth?: number | null;
    flags?: Record<string, unknown> | null;
  },
): boolean {
  const flag = `zephyr_classroom_tier_${tierDepth}_crossed`;
  if (input.flags && input.flags[flag]) return true;
  const depth = typeof input.chessDepth === "number" ? input.chessDepth : 0;
  return depth >= tierDepth;
}

/** depth 3 — peek top card in Dischordia. */
export function canPeekTopCard(input: {
  chessDepth?: number | null;
  flags?: Record<string, unknown> | null;
}): boolean {
  return hasCrossedClassroomTier(3, input);
}

/** depth 5 — one undo per Dischordia match. */
export function canUndoOnePerMatch(input: {
  chessDepth?: number | null;
  flags?: Record<string, unknown> | null;
}): boolean {
  return hasCrossedClassroomTier(5, input);
}

/** depth 8 — Engineer's Opening unlocked in deck builder. */
export function hasEngineersOpening(input: {
  chessDepth?: number | null;
  flags?: Record<string, unknown> | null;
}): boolean {
  return hasCrossedClassroomTier(8, input);
}

/** Tier the player is currently at (the highest crossed). 0 = below tier 1. */
export function currentClassroomTier(input: {
  chessDepth?: number | null;
  flags?: Record<string, unknown> | null;
}): number {
  let highest = 0;
  for (const tier of ZEPHYR_9_CLASSROOM) {
    if (hasCrossedClassroomTier(tier.depth, input)) {
      highest = tier.depth;
    }
  }
  return highest;
}

/** Next tier the player is working toward. null if max tier crossed. */
export function nextClassroomTier(input: {
  chessDepth?: number | null;
  flags?: Record<string, unknown> | null;
}): (typeof ZEPHYR_9_CLASSROOM)[number] | null {
  for (const tier of ZEPHYR_9_CLASSROOM) {
    if (!hasCrossedClassroomTier(tier.depth, input)) return tier;
  }
  return null;
}
