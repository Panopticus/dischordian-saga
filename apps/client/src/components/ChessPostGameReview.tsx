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
  pickBrilliancyNarration,
  type MistakeType,
  type BrilliancyType,
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

export interface ReviewBrilliancy {
  moveNumber: number;
  side: "white" | "black";
  type: BrilliancyType;
  /** Stockfish eval gain in centipawns — how much the move
   *  improved the position relative to the next-best move.
   *  Used for display ordering (best brilliancies first). */
  centipawnGain: number;
  substitutions?: Record<string, string | number>;
}

export interface ChessPostGameReviewProps {
  /** Stable hash of the PGN — used as the narration seed so the
   *  same game reviewed twice produces identical narration. */
  seed: number;
  mistakes: readonly ReviewMistake[];
  /** Optional brilliancies the analysis pass flagged. Rendered
   *  above the mistakes section in praise mode. */
  brilliancies?: readonly ReviewBrilliancy[];
  /** Optional — the player's side in the game. Affects whose
   *  moves are highlighted as the teaching target. */
  playerSide?: "white" | "black";
}

export default function ChessPostGameReview({
  seed,
  mistakes,
  brilliancies = [],
  playerSide,
}: ChessPostGameReviewProps) {
  const mineMistakes = playerSide
    ? mistakes.filter((m) => m.side === playerSide)
    : mistakes;
  const mineBrilliancies = playerSide
    ? brilliancies.filter((b) => b.side === playerSide)
    : brilliancies;
  const topMistakes = [...mineMistakes]
    .sort((a, b) => b.centipawnLoss - a.centipawnLoss)
    .slice(0, 3);
  const topBrilliancies = [...mineBrilliancies]
    .sort((a, b) => b.centipawnGain - a.centipawnGain)
    .slice(0, 2);

  if (topMistakes.length === 0 && topBrilliancies.length === 0) {
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

  return (
    <section className="p-4 border border-void-border/40 rounded bg-void-bg/40 space-y-4">
      <header>
        <h3 className="text-void-text">Post-game review</h3>
        <p className="text-xs text-void-text-muted italic mt-1">
          The Celebration Game Master, in voice, on the moves that mattered.
        </p>
      </header>
      {topBrilliancies.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-void-text-accent/80">
            Brilliancies
          </h4>
          {topBrilliancies.map((b, i) => (
            <article
              key={`b-${i}`}
              className="border-l-2 border-void-text-accent/60 pl-3"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-void-text-accent">
                  Move {b.moveNumber} ({b.side})
                </span>
                <span className="text-[10px] uppercase tracking-wider text-void-text-muted">
                  {b.type.replace(/_/g, " ")} · +{Math.round(b.centipawnGain)}
                  cp
                </span>
              </div>
              <p className="text-sm text-void-text italic mt-2">
                {pickBrilliancyNarration(
                  b.type,
                  seed + b.moveNumber,
                  { moveNumber: b.moveNumber, ...b.substitutions },
                )}
              </p>
            </article>
          ))}
        </div>
      )}
      {topMistakes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-widest text-void-text-muted">
            Mistakes
          </h4>
          {topMistakes.map((mistake, i) => (
            <article
              key={`m-${i}`}
              className="border-l-2 border-void-border/40 pl-3"
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
        </div>
      )}
    </section>
  );
}
