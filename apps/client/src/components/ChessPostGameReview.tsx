/**
 * Post-Game Review — displays the top 3 mistakes from a completed
 * chess game with the Celebration Game Master's narration.
 *
 * Expects the caller to have already:
 *   - run the PGN through Stockfish at depth 18
 *   - classified each significant eval drop into a MistakeType
 *   - produced a stable PGN hash for seeding
 *
 * This component is pure UI. The mistake detection + Stockfish
 * plumbing lives in `apps/client/src/lib/stockfishWorker.ts`
 * (extended in a later chunk with `postGameAnalyze`).
 */
import {
  pickReviewNarration,
  type MistakeType,
} from "@shared/tcg-core/story/chessReviewNarration";

export interface ReviewMistake {
  moveNumber: number;
  side: "white" | "black";
  type: MistakeType;
  /** Stockfish eval delta in centipawns — how much the move
   *  cost. Used for display ordering. */
  centipawnLoss: number;
  /** Optional variables for substitution into the narration
   *  line (square, moveCount for mate-in-N, etc.). */
  substitutions?: Record<string, string | number>;
}

export interface ChessPostGameReviewProps {
  /** Stable hash of the PGN — used as the narration seed so the
   *  same game reviewed twice produces identical narration. */
  seed: number;
  mistakes: readonly ReviewMistake[];
  /** Optional — the player's side in the game. Affects whose
   *  mistakes are highlighted as the teaching target. */
  playerSide?: "white" | "black";
}

export default function ChessPostGameReview({
  seed,
  mistakes,
  playerSide,
}: ChessPostGameReviewProps) {
  if (mistakes.length === 0) {
    return (
      <section className="p-4 border border-void-text-accent/40 rounded bg-void-bg/40">
        <h3 className="text-void-text-accent">No significant mistakes.</h3>
        <p className="text-sm text-void-text-muted mt-2 italic">
          The Game Master nods. "Clean game. The kind I don't have to comment
          on. Come back next one."
        </p>
      </section>
    );
  }

  const mine = playerSide
    ? mistakes.filter((m) => m.side === playerSide)
    : mistakes;
  const topThree = [...mine]
    .sort((a, b) => b.centipawnLoss - a.centipawnLoss)
    .slice(0, 3);

  return (
    <section className="p-4 border border-void-border/40 rounded bg-void-bg/40 space-y-4">
      <header>
        <h3 className="text-void-text">Post-game review</h3>
        <p className="text-xs text-void-text-muted italic mt-1">
          The Celebration Game Master, in voice, on your top three mistakes.
        </p>
      </header>
      {topThree.map((mistake, i) => (
        <article
          key={i}
          className="border-t border-void-border/20 pt-3 first:border-t-0 first:pt-0"
        >
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-void-text-accent">
              Move {mistake.moveNumber} ({mistake.side})
            </span>
            <span className="text-[10px] uppercase tracking-wider text-void-text-muted">
              {mistake.type.replace(/_/g, " ")} · −{Math.round(mistake.centipawnLoss)}
              cp
            </span>
          </div>
          <p className="text-sm text-void-text italic mt-2">
            {pickReviewNarration(
              mistake.type,
              seed + mistake.moveNumber,
              { moveNumber: mistake.moveNumber, ...mistake.substitutions },
            )}
          </p>
        </article>
      ))}
    </section>
  );
}
