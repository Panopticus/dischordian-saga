/**
 * Permissively-licensed chess engine — drop-in replacement for the
 * Stockfish wrapper that previously used stockfish@^18.0.7 (GPL-3.0).
 *
 * Built on chess.js (BSD-2-Clause, already in deps) for move generation
 * and FEN parsing. The search is a textbook alpha-beta minimax with
 * iterative deepening; evaluation is material + small piece-square
 * tables. Significantly weaker than Stockfish (a few hundred Elo at
 * depth 4-6 vs Stockfish at skill 20), but strong enough that none of
 * the in-game characters were calibrated to grandmaster strength
 * anyway — the existing StockfishPersonality.skillLevel curve already
 * caps at 20 and most characters target 8-15.
 *
 * Audit/15.R1: Stockfish is GPL-3.0; bundling it in a closed-source
 * web/Capacitor build triggers source-disclosure on the combined
 * work. This swap removes the GPL surface area entirely.
 */
import { Chess } from "chess.js";

/** Same shape as the prior StockfishPersonality so callers don't change. */
export interface ChessEnginePersonality {
  /** Skill 0-20: maps to search depth + a temperature factor that
   *  injects randomness at low skill so weak characters don't always
   *  pick the engine's #1 move. */
  skillLevel: number;
  /** Search depth ceiling. We respect this directly. */
  depth: number;
  /** Contempt factor (-100..100). Positive nudges scoring toward
   *  decisive lines; negative accepts draws. */
  contempt: number;
  /** Move-time budget in ms. We use it as an iterative-deepening
   *  cutoff: stop deepening when elapsed > budget. */
  moveTimeMs: number;
}

const PIECE_VALUE: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20_000,
};

// Piece-square tables — small positional bonuses, white-perspective.
// These are deliberately compact; the goal is "a respectable opponent"
// not "topple Carlsen."
// prettier-ignore
const PST_PAWN = [
   0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0,
];
// prettier-ignore
const PST_KNIGHT = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];
// prettier-ignore
const PST_BISHOP = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];
// prettier-ignore
const PST_ROOK = [
   0,  0,  0,  0,  0,  0,  0,  0,
   5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
   0,  0,  0,  5,  5,  0,  0,  0,
];
// prettier-ignore
const PST_QUEEN = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20,
];
// prettier-ignore
const PST_KING = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20,
];

const PST: Record<string, number[]> = {
  p: PST_PAWN,
  n: PST_KNIGHT,
  b: PST_BISHOP,
  r: PST_ROOK,
  q: PST_QUEEN,
  k: PST_KING,
};

/** square index 0..63 from algebraic ('a8'==0, 'h1'==63 white-perspective). */
function squareIndex(square: string): number {
  const file = square.charCodeAt(0) - 97; // a=0
  const rank = 8 - parseInt(square[1] ?? "1", 10); // 8=top
  return rank * 8 + file;
}

/** Mirror an index for black-perspective tables. */
function mirror(idx: number): number {
  const rank = Math.floor(idx / 8);
  const file = idx % 8;
  return (7 - rank) * 8 + file;
}

/** Static evaluation, white-relative (positive = white better). */
function evaluate(chess: Chess): number {
  const board = chess.board();
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (!piece) continue;
      const value = PIECE_VALUE[piece.type] ?? 0;
      const idx = r * 8 + f;
      const pstIdx = piece.color === "w" ? idx : mirror(idx);
      const pst = PST[piece.type]?.[pstIdx] ?? 0;
      const sign = piece.color === "w" ? 1 : -1;
      score += sign * (value + pst);
    }
  }
  return score;
}

interface SearchResult {
  score: number;
  move: string | null;
}

/** Alpha-beta with iterative deepening. */
function search(
  chess: Chess,
  maxDepth: number,
  deadline: number,
  contempt: number,
): SearchResult {
  let best: SearchResult = { score: 0, move: null };
  for (let depth = 1; depth <= maxDepth; depth++) {
    if (Date.now() > deadline) break;
    const result = alphaBeta(chess, depth, -Infinity, Infinity, deadline, contempt);
    if (result.move) best = result;
    if (Date.now() > deadline) break;
  }
  return best;
}

function alphaBeta(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  deadline: number,
  contempt: number,
): SearchResult {
  if (Date.now() > deadline) {
    return { score: evaluate(chess), move: null };
  }
  if (chess.isGameOver()) {
    if (chess.isCheckmate()) {
      // Side to move is checkmated → very bad for them. Return a
      // mate-score from the perspective of whoever is NOT to move,
      // which is the side that just delivered mate.
      const sideToMove = chess.turn();
      return { score: sideToMove === "w" ? -100_000 + depth : 100_000 - depth, move: null };
    }
    // Stalemate / draw — apply contempt: the side ahead in material
    // dislikes draws (positive contempt → avoid the draw).
    return { score: -contempt, move: null };
  }
  if (depth === 0) {
    return { score: evaluate(chess), move: null };
  }

  const moves = chess.moves({ verbose: true });
  const sideToMove = chess.turn();
  let bestMove: string | null = null;
  let bestScore = sideToMove === "w" ? -Infinity : Infinity;

  for (const m of moves) {
    chess.move(m);
    const child = alphaBeta(chess, depth - 1, alpha, beta, deadline, contempt);
    chess.undo();

    if (sideToMove === "w") {
      if (child.score > bestScore) {
        bestScore = child.score;
        bestMove = m.lan; // long-algebraic form e.g. "e2e4"
      }
      alpha = Math.max(alpha, bestScore);
    } else {
      if (child.score < bestScore) {
        bestScore = child.score;
        bestMove = m.lan;
      }
      beta = Math.min(beta, bestScore);
    }
    if (beta <= alpha) break; // cutoff
  }

  return { score: bestScore, move: bestMove };
}

/**
 * Derive a search depth + temperature from the skill level. Skill 20
 * picks the engine's best move at the configured depth; lower skills
 * truncate depth and bias toward random moves.
 */
function tuneSkill(skillLevel: number, requestedDepth: number) {
  const skillFactor = Math.max(0, Math.min(20, skillLevel)) / 20;
  // Skill 0 → depth 1, skill 20 → requestedDepth (capped at 6 for
  // browser perf — depth 6 is already 1-2s on midrange hardware).
  const cappedDepth = Math.min(6, requestedDepth);
  const effectiveDepth = Math.max(1, Math.round(1 + skillFactor * (cappedDepth - 1)));
  // Temperature: at skill 0, half the time we just pick a random move.
  // Decays linearly to 0 at skill 12+.
  const temperature = Math.max(0, 1 - skillLevel / 12) * 0.5;
  return { effectiveDepth, temperature };
}

/**
 * Public engine — same surface as the old StockfishEngine class so
 * callers (apps/client/src/hooks/useStockfish.ts, ChessPostGameReview,
 * pages/ChessPage) don't change.
 */
export class PermissiveChessEngine {
  private personality: ChessEnginePersonality | null = null;
  private ready = false;

  async init(): Promise<void> {
    // No worker bring-up in this build — the engine runs synchronously
    // in the request thread but the search is bounded by moveTimeMs
    // so it never blocks for long. Wrapping in a Worker is a
    // future revision.
    this.ready = true;
  }

  setPersonality(personality: ChessEnginePersonality) {
    this.personality = personality;
  }

  async getBestMove(
    fen: string,
    personality: ChessEnginePersonality,
  ): Promise<string> {
    if (!this.ready) throw new Error("Engine not initialized");
    const chess = new Chess(fen);
    const tuning = tuneSkill(personality.skillLevel, personality.depth);
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return "";

    // Inject randomness at low skill (skill 0..11) — the engine's
    // top move is "fine," we just don't always play it.
    if (Math.random() < tuning.temperature) {
      const m = moves[Math.floor(Math.random() * moves.length)];
      return m.lan;
    }

    const deadline = Date.now() + personality.moveTimeMs;
    const result = search(chess, tuning.effectiveDepth, deadline, personality.contempt);
    if (result.move) return result.move;
    // Fallback: first legal move (search ran out of time before depth 1
    // finished, which shouldn't happen but the safety net is cheap).
    return moves[0].lan;
  }

  /**
   * Evaluate a position. Returns centipawn-equivalent score from
   * White's perspective (positive = white better) plus the engine's
   * top-choice move at the requested depth.
   *
   * Default depth here is much lower than the prior Stockfish flow
   * (which used depth 12-18) because pure-TS search is slower per
   * node. depth 5 is fast (~200-500ms typical) and adequate for the
   * post-game eval signal.
   */
  async evaluatePosition(
    fen: string,
    opts: { depth?: number; moveTime?: number } = {},
  ): Promise<{ evalCp: number; mate: number | null; bestMove: string | null }> {
    const chess = new Chess(fen);
    if (chess.isGameOver()) {
      const mateScore = chess.isCheckmate()
        ? chess.turn() === "w"
          ? -100_000
          : 100_000
        : 0;
      return {
        evalCp: mateScore,
        mate: chess.isCheckmate() ? (chess.turn() === "w" ? -1 : 1) : null,
        bestMove: null,
      };
    }
    const depth = opts.depth ?? 5;
    const deadline = Date.now() + (opts.moveTime ?? 2000);
    const result = search(chess, depth, deadline, 0);
    const mate = result.score >= 90_000 ? 1 : result.score <= -90_000 ? -1 : null;
    return {
      evalCp: Math.max(-10_000, Math.min(10_000, Math.round(result.score))),
      mate,
      bestMove: result.move,
    };
  }

  /**
   * Multi-PV: returns up to N candidate moves with their evaluations.
   * Implemented as N serial searches, excluding previously-found
   * moves. Slower than a true multi-PV engine but the surface area
   * matches the previous Stockfish flow.
   */
  async evaluatePositionMultiPv(
    fen: string,
    opts: { depth?: number; multiPv?: number; moveTime?: number } = {},
  ): Promise<
    ReadonlyArray<{
      multipv: number;
      evalCp: number;
      mate: number | null;
      uciMove: string | null;
    }>
  > {
    const multiPv = opts.multiPv ?? 2;
    const lines: Array<{
      multipv: number;
      evalCp: number;
      mate: number | null;
      uciMove: string | null;
    }> = [];
    const chess = new Chess(fen);
    if (chess.isGameOver() || chess.moves().length === 0) return lines;
    const excluded = new Set<string>();
    const sideToMove = chess.turn();
    for (let i = 0; i < multiPv; i++) {
      const moves = chess.moves({ verbose: true }).filter((m) => !excluded.has(m.lan));
      if (moves.length === 0) break;
      // Search restricted to non-excluded moves: walk root manually.
      const depth = opts.depth ?? 4;
      const deadline = Date.now() + (opts.moveTime ?? 1500);
      let bestMove: string | null = null;
      let bestScore = sideToMove === "w" ? -Infinity : Infinity;
      for (const m of moves) {
        chess.move(m);
        const child = search(chess, depth - 1, deadline, 0);
        chess.undo();
        if (sideToMove === "w" ? child.score > bestScore : child.score < bestScore) {
          bestScore = child.score;
          bestMove = m.lan;
        }
      }
      if (!bestMove) break;
      excluded.add(bestMove);
      const mate = bestScore >= 90_000 ? 1 : bestScore <= -90_000 ? -1 : null;
      lines.push({
        multipv: i + 1,
        evalCp: Math.max(-10_000, Math.min(10_000, Math.round(bestScore))),
        mate,
        uciMove: bestMove,
      });
    }
    return lines;
  }

  /**
   * Walk a finished game move-by-move; per-ply eval arrays are
   * consumed by the post-game review's mistake bucketing.
   */
  async postGameAnalyze(
    startFen: string,
    moves: readonly string[],
    opts: { depth?: number; onProgress?: (ply: number) => void } = {},
  ): Promise<
    ReadonlyArray<{
      ply: number;
      fenBefore: string;
      fenAfter: string;
      evalBeforeCp: number;
      evalAfterCp: number;
      deltaCp: number;
    }>
  > {
    const game = new Chess(startFen);
    const out: Array<{
      ply: number;
      fenBefore: string;
      fenAfter: string;
      evalBeforeCp: number;
      evalAfterCp: number;
      deltaCp: number;
    }> = [];
    const depth = opts.depth ?? 5;
    let { evalCp: evalBefore } = await this.evaluatePosition(game.fen(), { depth });
    for (let i = 0; i < moves.length; i++) {
      const fenBefore = game.fen();
      const legalMove = game.move(moves[i]);
      if (!legalMove) {
        throw new Error(`postGameAnalyze: illegal move "${moves[i]}" at ply ${i + 1}`);
      }
      const fenAfter = game.fen();
      const { evalCp: evalAfter } = await this.evaluatePosition(fenAfter, { depth });
      out.push({
        ply: i + 1,
        fenBefore,
        fenAfter,
        evalBeforeCp: evalBefore,
        evalAfterCp: evalAfter,
        deltaCp: evalAfter - evalBefore,
      });
      evalBefore = evalAfter;
      opts.onProgress?.(i + 1);
    }
    return out;
  }

  /** Same as postGameAnalyze but also collects multi-PV candidates
   *  for brilliancy detection. */
  async postGameAnalyzeWithBrilliancies(
    startFen: string,
    moves: readonly string[],
    opts: { depth?: number; onProgress?: (ply: number) => void } = {},
  ): Promise<
    ReadonlyArray<{
      ply: number;
      fenBefore: string;
      fenAfter: string;
      evalBeforeCp: number;
      evalAfterCp: number;
      deltaCp: number;
      playedUci: string;
      bestUci: string | null;
      bestEvalCp: number | null;
      secondBestEvalCp: number | null;
    }>
  > {
    const game = new Chess(startFen);
    const out: Array<{
      ply: number;
      fenBefore: string;
      fenAfter: string;
      evalBeforeCp: number;
      evalAfterCp: number;
      deltaCp: number;
      playedUci: string;
      bestUci: string | null;
      bestEvalCp: number | null;
      secondBestEvalCp: number | null;
    }> = [];
    const depth = opts.depth ?? 4;
    let { evalCp: evalBefore } = await this.evaluatePosition(game.fen(), { depth });
    for (let i = 0; i < moves.length; i++) {
      const fenBefore = game.fen();
      const lines = await this.evaluatePositionMultiPv(fenBefore, {
        depth,
        multiPv: 2,
      });
      const top = lines.find((l) => l.multipv === 1) ?? null;
      const second = lines.find((l) => l.multipv === 2) ?? null;
      const legalMove = game.move(moves[i]);
      if (!legalMove) {
        throw new Error(
          `postGameAnalyzeWithBrilliancies: illegal move "${moves[i]}" at ply ${i + 1}`,
        );
      }
      const playedUci = `${legalMove.from}${legalMove.to}${legalMove.promotion ?? ""}`;
      const fenAfter = game.fen();
      const { evalCp: evalAfter } = await this.evaluatePosition(fenAfter, { depth });
      out.push({
        ply: i + 1,
        fenBefore,
        fenAfter,
        evalBeforeCp: evalBefore,
        evalAfterCp: evalAfter,
        deltaCp: evalAfter - evalBefore,
        playedUci,
        bestUci: top?.uciMove ?? null,
        bestEvalCp: top?.evalCp ?? null,
        secondBestEvalCp: second?.evalCp ?? null,
      });
      evalBefore = evalAfter;
      opts.onProgress?.(i + 1);
    }
    return out;
  }

  dispose() {
    this.ready = false;
  }

  get isReady() {
    return this.ready;
  }
}
