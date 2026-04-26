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
  ReviewBrilliancy,
} from "@/components/ChessPostGameReview";
import type { BrilliancyType } from "@shared/tcg-core/story/chessReviewNarration";

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

/** A sample from `postGameAnalyzeWithBrilliancies` — adds the
 *  played UCI move and the engine's top-2 candidate evals. */
export interface PostGameBrilliancySample extends PostGameSample {
  playedUci: string;
  bestUci: string | null;
  bestEvalCp: number | null;
  secondBestEvalCp: number | null;
}

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

/* ═══════════════════════════════════════════════════════
   BRILLIANCY CLASSIFICATION

   A move is a brilliancy if:
     1. The player played the engine's top choice, AND
     2. That top choice was significantly better than the
        second-best choice from the moving side's POV.

   The "significantly better" gap is what makes the move HARD to
   find — easy positions have many comparable options. Hard
   positions force a unique winning response.
   ═══════════════════════════════════════════════════════ */

/** Minimum gap (centipawns) between the engine's top choice and
 *  the second-best choice for the played move to qualify. The
 *  move ALSO has to match the engine's top choice. */
const BRILLIANCY_GAP_CP = 80;
/** Gap above which we classify as a deep_sacrifice/tactical_blow
 *  rather than a quiet_killer. Big-gap positions usually involve
 *  forcing tactics; small-gap positions are positional. */
const TACTICAL_BLOW_GAP_CP = 200;

function classifyBrilliancyType(
  gapCp: number,
  playedUci: string,
): BrilliancyType {
  // Heuristic categorization — the UCI string carries enough hint
  // to distinguish a few common shapes without a full move parse.
  // Promotion → opening_novelty fallback only fires later in
  // games, so promotions are typically endgame_precision.
  const promotion = playedUci.length > 4;
  if (promotion) return "endgame_precision";
  if (gapCp >= TACTICAL_BLOW_GAP_CP) {
    // Deep tactical blow — likely a sacrifice or forcing line.
    return "tactical_blow";
  }
  // Otherwise a quiet killer or prophylactic move.
  return "quiet_killer";
}

/** Classify brilliancy samples into ReviewBrilliancy[] for the
 *  player's side. The gap (top - second-best) is the centipawnGain
 *  reported to the renderer.
 *
 *  Skips:
 *    - moves where the engine had no second-best (single legal
 *      move, e.g. forced recapture) — gap is undefined
 *    - moves where the played move did not match the engine top
 *    - moves where the gap is below BRILLIANCY_GAP_CP
 *    - opening moves before ply 6 (book moves are not brilliancies) */
export function classifyBrilliancies(
  samples: readonly PostGameBrilliancySample[],
  playerSide: "white" | "black",
): ReviewBrilliancy[] {
  const out: ReviewBrilliancy[] = [];
  for (const s of samples) {
    if (s.ply < 6) continue;
    const moverSide: "white" | "black" = s.ply % 2 === 1 ? "white" : "black";
    if (moverSide !== playerSide) continue;
    if (!s.bestUci || s.playedUci !== s.bestUci) continue;
    if (s.bestEvalCp === null || s.secondBestEvalCp === null) continue;

    // Both evals are from White's POV. Flip so a positive gap
    // always means the played-move's-side benefitted relative to
    // the alternative.
    const sideSign = moverSide === "white" ? 1 : -1;
    const gapCp = sideSign * (s.bestEvalCp - s.secondBestEvalCp);
    if (gapCp < BRILLIANCY_GAP_CP) continue;

    out.push({
      moveNumber: Math.ceil(s.ply / 2),
      side: moverSide,
      type: classifyBrilliancyType(gapCp, s.playedUci),
      centipawnGain: gapCp,
    });
  }
  return out;
}
