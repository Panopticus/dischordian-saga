/* ═══════════════════════════════════════════════════════
   PUZZLE ANSWER CHECK — runtime consumer of AR8.

   audit/16 PR 34 (consumer follow-up to PR 28 / finding AR8).

   PR 28 shipped the per-season per-player solve-state
   substrate (`deriveCanonicalAnswer`, `buildSolveState`,
   `isAcceptableSolution`). The PuzzleSystem.tsx
   RiddlePuzzle + CipherPuzzle components had their own
   inline answer-check logic — back-compat with the legacy
   `acceptableAnswers` array.

   This module ships ONE pure helper that:
     - Falls back to legacy behaviour (case-insensitive
       includes-match against `acceptableAnswers` / single
       `answer`) when the puzzle has no `seasonalSolve`.
     - Routes through `isAcceptableSolution(...)` when the
       puzzle declares a `seasonalSolve` block, defaulting
       to lenient mode (any pool entry passes) so no
       shipping puzzle suddenly becomes unsolvable.
     - Honours the audit's "strict" mode when the author
       opts in — only the player-and-season seeded canonical
       answer counts.

   Pure (no I/O, no React) so the component callers (and
   tests) can share one source-of-truth answer-check.
   ═══════════════════════════════════════════════════════ */

import {
  buildSolveState,
  isAcceptableSolution,
  type AnswerCheckMode,
  type SeasonalSolveState,
} from "./puzzleSolveState";

/** Seasonal-solve declaration on a puzzle. When present,
 *  the answer-check routes through the AR8 substrate;
 *  otherwise the legacy `acceptableAnswers` path is used. */
export interface PuzzleSeasonalSolve {
  /** Authored answer pool. The runtime seeds one entry as
   *  the canonical answer per (puzzle, player, season). */
  pool: ReadonlyArray<string>;
  /** Author opt-in. Defaults to "lenient" — any pool entry
   *  is accepted. "strict" rejects everything except the
   *  per-player canonical (the audit'd "community-wiki
   *  kill" mode). */
  mode?: AnswerCheckMode;
}

/** Minimal puzzle shape the answer-check needs. The
 *  component-side `Puzzle` type declares more fields; this
 *  helper only reads what it touches. */
export interface PuzzleAnswerInput {
  id: string;
  /** Legacy single-answer slot. */
  answer?: string;
  /** Legacy multi-answer slot. */
  acceptableAnswers?: ReadonlyArray<string>;
  /** Cipher-specific legacy slot. */
  cipherAnswer?: string;
  /** AR8 seasonal-solve declaration. When set, this wins
   *  over the legacy slots above. */
  seasonalSolve?: PuzzleSeasonalSolve;
}

/** Runtime context for the seasonal-solve path. The
 *  component supplies these from the player's session
 *  (auth user id) and the current season constant. */
export interface PuzzleAnswerContext {
  playerId?: string;
  seasonKey?: string;
}

/** Legacy-path predicate — preserves the existing inline
 *  check semantics from PuzzleSystem.tsx (case-insensitive
 *  + `includes` so a player's answer can be a longer phrase
 *  that contains the canonical word). Exported for tests. */
export function legacyAcceptableAnswer(
  input: string,
  candidates: ReadonlyArray<string>,
): boolean {
  const norm = input.trim().toLowerCase();
  if (norm.length === 0) return false;
  for (const candidate of candidates) {
    if (norm.includes(candidate.toLowerCase())) return true;
  }
  return false;
}

/** Resolve a SeasonalSolveState for a puzzle in the current
 *  player/season context. Returns null when context is
 *  incomplete OR the pool is empty — caller falls back to
 *  the legacy path. */
export function resolveSolveState(
  puzzle: PuzzleAnswerInput,
  ctx: PuzzleAnswerContext,
): SeasonalSolveState | null {
  const seasonal = puzzle.seasonalSolve;
  if (!seasonal || seasonal.pool.length === 0) return null;
  if (!ctx.playerId || !ctx.seasonKey) return null;
  return buildSolveState(puzzle.id, ctx.playerId, ctx.seasonKey, seasonal.pool);
}

/** Single entry-point for the component-side checkAnswer
 *  paths. Returns true iff the player's input is acceptable
 *  for THIS puzzle in the current player/season context.
 *
 *  Decision tree:
 *    1. Empty / whitespace input → false (UX guarantee).
 *    2. Puzzle has `seasonalSolve` AND context has both
 *       playerId + seasonKey → use AR8 isAcceptableSolution
 *       in the puzzle's declared mode (default "lenient").
 *    3. Puzzle has `acceptableAnswers` → legacy includes-match.
 *    4. Puzzle has `answer` (riddle single-answer) →
 *       legacy includes-match against [answer].
 *    5. Puzzle has `cipherAnswer` → exact equality
 *       (case-insensitive + trim) — preserves the existing
 *       cipher behaviour where partial matches don't count.
 *    6. None of the above declared → false. */
export function evaluatePuzzleAnswer(
  rawInput: string,
  puzzle: PuzzleAnswerInput,
  ctx: PuzzleAnswerContext = {},
): boolean {
  const trimmed = rawInput.trim();
  if (trimmed.length === 0) return false;

  const ss = resolveSolveState(puzzle, ctx);
  if (ss) {
    const mode: AnswerCheckMode = puzzle.seasonalSolve?.mode ?? "lenient";
    return isAcceptableSolution(rawInput, ss, mode);
  }

  if (puzzle.acceptableAnswers && puzzle.acceptableAnswers.length > 0) {
    return legacyAcceptableAnswer(rawInput, puzzle.acceptableAnswers);
  }
  if (typeof puzzle.answer === "string" && puzzle.answer.length > 0) {
    return legacyAcceptableAnswer(rawInput, [puzzle.answer]);
  }
  if (typeof puzzle.cipherAnswer === "string" && puzzle.cipherAnswer.length > 0) {
    return rawInput.trim().toLowerCase() === puzzle.cipherAnswer.toLowerCase();
  }
  return false;
}
