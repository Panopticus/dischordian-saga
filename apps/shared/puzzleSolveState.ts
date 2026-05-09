/* ═══════════════════════════════════════════════════════
   PUZZLE SOLVE STATE — per-season, per-player seeding.

   audit/16 PR 28 (finding AR8 — ARG persona).

   Pre-audit, riddle / cipher / sequence puzzles ship with
   hardcoded answers in apps/client/src/components/
   PuzzleSystem.tsx. The shipping `acceptableAnswers` array
   means the same answer works for every player every
   season — so a community wiki publishes the answer once
   and replayability collapses.

   This module ships the substrate that splits puzzle
   content along the audit's recommended axis:

     authoredNarration (static)
        ↳ title, description, riddle text, hint, lore link.
          Same for every player every season; that's the
          authoring surface.

     solveState (per-player, per-season)
        ↳ which acceptable answer is the CANONICAL answer
          for THIS run. Seeded deterministically from
          (puzzleId, playerId, seasonKey) so the same
          player on the same season always gets the same
          answer; different seasons rotate.

   The runtime answer-check then becomes:
     - Read solveState for (puzzle, player, season)
     - Compare player input to the seeded canonical answer
     - Optionally also accept any pool entry as a
       "valid-but-not-canonical" answer (for accessibility
       — the audit'd intent isn't to make puzzles harder,
       just to make community-published answers stop
       working across seasons).

   Schema-only ship. The PuzzleSystem runtime that consumes
   the seeded canonical answer is the consumer follow-up;
   this PR ships the helpers + invariants.
   ═══════════════════════════════════════════════════════ */

/** Authored narration block — the part that doesn't rotate. */
export interface AuthoredPuzzleNarration {
  /** Stable puzzle id. */
  puzzleId: string;
  /** Display title. */
  title: string;
  /** Player-facing description. */
  description: string;
  /** Riddle text (cipher / sequence puzzles populate this
   *  with their static prompt). Optional for puzzles that
   *  don't carry a riddle (keycard, power_relay). */
  riddle?: string;
  /** Hint surfaced after N failed attempts. */
  elaraHint?: string;
  /** Lore connection — surfaces in post-solve commentary
   *  (PR #529 Co2 metariddle surface). */
  loreConnection?: string;
}

/** The seeded solve state for ONE (puzzle, player, season).
 *  Persisted by the runtime; produced by deriveSolveState. */
export interface SeasonalSolveState {
  puzzleId: string;
  playerId: string;
  seasonKey: string;
  /** The canonical answer for this run. One of the puzzle's
   *  authored answer pool. */
  canonicalAnswer: string;
  /** All authored pool entries, exposed so the runtime can
   *  optionally accept any pool answer as valid-but-not-
   *  canonical (the audit'd accessibility allowance). */
  answerPool: ReadonlyArray<string>;
}

/**
 * Mulberry32-style deterministic PRNG. Tiny + well-behaved
 * for the small index ranges we draw from. Same seed → same
 * sequence → same canonical answer.
 */
function seedHash(input: string): number {
  // Simple FNV-1a 32-bit; fast + deterministic + adequate
  // for picking 1-of-N from a small pool.
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Pure derivation: given the puzzle's authored answer pool,
 * the player id, the season key, return ONE answer as the
 * canonical for this run. Deterministic — same triple of
 * inputs always returns the same output, so a player who
 * fails-and-retries gets the same canonical answer until the
 * season rolls.
 *
 * Invariants:
 *   - Always returns a string FROM the pool.
 *   - Throws when the pool is empty (puzzle authors must
 *     populate at least one acceptable answer; the audit's
 *     intent is not "no answer," it's "rotated answer").
 *   - Different seasonKeys yield (statistically) different
 *     answers when pool size > 1.
 */
export function deriveCanonicalAnswer(
  puzzleId: string,
  playerId: string,
  seasonKey: string,
  answerPool: ReadonlyArray<string>,
): string {
  if (answerPool.length === 0) {
    throw new Error(
      `Puzzle ${puzzleId} has empty answerPool. Authors must populate at least one acceptable answer.`,
    );
  }
  if (answerPool.length === 1) return answerPool[0]!;
  const hash = seedHash(`${puzzleId}|${playerId}|${seasonKey}`);
  return answerPool[hash % answerPool.length]!;
}

/**
 * Build the full SeasonalSolveState for a (puzzle, player,
 * season) triple. The runtime persists this structure
 * keyed by (puzzleId, playerId, seasonKey).
 */
export function buildSolveState(
  puzzleId: string,
  playerId: string,
  seasonKey: string,
  answerPool: ReadonlyArray<string>,
): SeasonalSolveState {
  return {
    puzzleId,
    playerId,
    seasonKey,
    canonicalAnswer: deriveCanonicalAnswer(puzzleId, playerId, seasonKey, answerPool),
    answerPool,
  };
}

/**
 * Answer comparison. Two modes:
 *   - "strict"   — only the seeded canonical answer counts.
 *                  Community wiki answers from previous
 *                  seasons get rejected.
 *   - "lenient"  — any pool entry counts (back-compat with
 *                  the legacy acceptableAnswers behaviour).
 *                  This is the default during migration so
 *                  no shipping puzzle suddenly becomes
 *                  unsolvable; per-puzzle authoring opts
 *                  into "strict" as seasonal rotation
 *                  matures.
 *
 * Both modes do case-insensitive + trimmed string match.
 */
export type AnswerCheckMode = "strict" | "lenient";

export function isAcceptableSolution(
  playerAnswer: string,
  solveState: SeasonalSolveState,
  mode: AnswerCheckMode = "lenient",
): boolean {
  const norm = (s: string) => s.trim().toLowerCase();
  const player = norm(playerAnswer);
  if (player.length === 0) return false;
  if (mode === "strict") {
    return player === norm(solveState.canonicalAnswer);
  }
  // Lenient — any pool entry passes.
  for (const candidate of solveState.answerPool) {
    if (player === norm(candidate)) return true;
  }
  return false;
}
