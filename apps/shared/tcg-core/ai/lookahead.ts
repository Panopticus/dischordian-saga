/* ═══════════════════════════════════════════════════════
   1-PLY LOOKAHEAD AI — eval-driven card pick

   Plan §C2. The current AI picks cards heuristically; this
   module is a one-ply search that scores the resulting board
   after each candidate play and picks the one with the
   highest evaluation. No tree depth (yet) — just one move
   ahead, with a hand-tuned evaluation:

     boardPower(self) - boardPower(opponent)
       + 0.5 * (handSize(self) - handSize(opponent))
       + 1.0 * (generalHp(self) - generalHp(opponent))

   Pure helpers — no DB, no mutation. The TCG engine wraps
   this in its existing turn loop by calling pickBestPlay()
   per turn against the current state and a list of
   candidate plays. (Generation of candidate plays still
   lives in the engine; this module only scores them.)
   ═══════════════════════════════════════════════════════ */

/** Minimal projection of the engine state the evaluator
 *  needs. Decoupling here so the AI module doesn't depend
 *  on the full GameState type and tests stay tight. */
export interface AIEvalState {
  selfBoardPower: number;
  opponentBoardPower: number;
  selfHandSize: number;
  opponentHandSize: number;
  selfGeneralHp: number;
  opponentGeneralHp: number;
}

export interface CandidatePlay<P = unknown> {
  /** Stable id for tie-breaking + telemetry. */
  id: string;
  /** The post-play state projection. The caller (engine)
   *  builds this once per candidate by simulating the play
   *  in a draft. */
  projectedState: AIEvalState;
  /** Opaque payload the engine uses to actually execute the
   *  pick — could be a card id, a position, an action enum. */
  payload: P;
}

export const EVAL_WEIGHTS = {
  boardPower: 1.0,
  handSize: 0.5,
  generalHp: 1.0,
} as const;

/** Pure evaluator. Higher = better for self. */
export function evaluateState(state: AIEvalState): number {
  const board = state.selfBoardPower - state.opponentBoardPower;
  const hand = state.selfHandSize - state.opponentHandSize;
  const general = state.selfGeneralHp - state.opponentGeneralHp;
  return (
    EVAL_WEIGHTS.boardPower * board +
    EVAL_WEIGHTS.handSize * hand +
    EVAL_WEIGHTS.generalHp * general
  );
}

/** Score every candidate play, return them sorted by score
 *  descending. Stable ties broken by id for determinism. */
export function scoreCandidates<P>(
  candidates: ReadonlyArray<CandidatePlay<P>>,
): { candidate: CandidatePlay<P>; score: number }[] {
  const scored = candidates.map((c) => ({
    candidate: c,
    score: evaluateState(c.projectedState),
  }));
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.candidate.id.localeCompare(b.candidate.id);
  });
  return scored;
}

/** Pick the candidate with the highest evaluation. Returns
 *  null when there are no candidates. */
export function pickBestPlay<P>(
  candidates: ReadonlyArray<CandidatePlay<P>>,
): CandidatePlay<P> | null {
  if (candidates.length === 0) return null;
  return scoreCandidates(candidates)[0]?.candidate ?? null;
}

/** Epsilon-greedy pick. `rng` is required: pass an Rng from the engine's
 *  seeded RNG (engine/rng.ts) so AI decisions are reproducible from
 *  (seed, action log). Math.random was previously the default — that
 *  silently escaped the determinism contract. */
export function pickEpsilonGreedy<P>(
  candidates: ReadonlyArray<CandidatePlay<P>>,
  epsilon: number,
  rng: () => number,
): CandidatePlay<P> | null {
  if (candidates.length === 0) return null;
  if (rng() < epsilon) {
    const idx = Math.floor(rng() * candidates.length);
    return candidates[idx] ?? null;
  }
  return pickBestPlay(candidates);
}
