/**
 * Post-Game Mistake Classifier — coarse first pass.
 *
 * Takes the per-ply eval samples produced by
 * `stockfishWorker.postGameAnalyze` and buckets each MOVE made by
 * the player's side into a `MistakeType` from
 * `chessReviewNarration`. This is the data ChessPostGameReview
 * renders.
 *
 * Coarse rules (intentionally simple — a smarter classifier that
 * distinguishes hung pieces from missed tactics from positional
 * blunders is its own future workstream):
 *
 *   eval drop ≥ 300 cp   → hung_piece     (catastrophic)
 *   eval drop 100..299cp → missed_tactic  (significant mistake)
 *   eval drop  < 100 cp  → ignored        (inaccuracy band)
 *
 * The renderer caps to top 3 by centipawn loss, so we just emit
 * every qualifying move and let the component sort.
 */
import type {
  ReviewMistake,
} from "@/components/ChessPostGameReview";

/** A single sample as produced by `stockfishWorker.postGameAnalyze`. */
export interface PostGameSample {
  ply: number;
  evalBeforeCp: number;
  evalAfterCp: number;
  deltaCp: number;
}

/** Coarse threshold bands (centipawns). Symmetric around zero from
 *  the moving side's perspective — i.e. these numbers describe how
 *  much the MOVING PLAYER lost on their own turn. */
const HUNG_PIECE_THRESHOLD_CP = 300;
const MISSED_TACTIC_THRESHOLD_CP = 100;

/** Classify a list of post-game samples into `ReviewMistake[]` for
 *  the player's side. Pure function — no side effects, no
 *  dependencies on chess.js. */
export function classifyDeltas(
  samples: readonly PostGameSample[],
  playerSide: "white" | "black",
): ReviewMistake[] {
  const out: ReviewMistake[] = [];
  for (const s of samples) {
    // Ply 1 = white, ply 2 = black, etc.
    const moverSide: "white" | "black" = s.ply % 2 === 1 ? "white" : "black";
    if (moverSide !== playerSide) continue;

    // deltaCp is from White's perspective. Flip for Black so a
    // positive number always means the mover's eval improved.
    const moverDelta = moverSide === "white" ? s.deltaCp : -s.deltaCp;
    if (moverDelta >= 0) continue;
    const lossCp = -moverDelta;
    if (lossCp < MISSED_TACTIC_THRESHOLD_CP) continue;

    const type = lossCp >= HUNG_PIECE_THRESHOLD_CP ? "hung_piece" : "missed_tactic";
    // Move number = ceil(ply/2) — both sides share a move number,
    // matching standard PGN notation.
    const moveNumber = Math.ceil(s.ply / 2);
    out.push({
      moveNumber,
      side: moverSide,
      type,
      centipawnLoss: lossCp,
    });
  }
  return out;
}
