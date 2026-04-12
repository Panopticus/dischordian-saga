/* ═══════════════════════════════════════════════════════
   CHESS PLAYER MODEL — Learning AI state

   Phase 1 of "The Game Master's Gambit" lore reskin.

   Each row in `chess_opponent_imprints` carries a small
   JSON "player model" — a coarse stat sheet of how THIS
   user plays against THIS opponent. It's updated after
   every game and fed into `getAiMove` on the next match
   so the imprint's move selection is biased toward
   counters of the player's tendencies.

   This is NOT a neural net. It's a handful of weighted
   moving averages. The goal is the *felt* experience
   that the imprint "remembers how you play" — not an
   actual ML model.

   Fields:
     topOpeningMoves  — the 3 SAN moves the user plays
                        most often on their first move
                        (exponentially weighted toward
                        recent games). Used to pre-bias
                        early-game evaluation.
     captureRate      — fraction of user moves that are
                        captures. High values → player
                        is aggressive; AI prefers trap
                        moves that leave bait.
     sacrificeRate    — fraction of player captures that
                        lead to being recaptured. High
                        values → player is speculative;
                        AI prefers solid refutations.
     avgCheckRate     — fraction of moves that deliver
                        check. High values → player
                        attacks kings; AI prefers safer
                        king positions.
     favoritePiece    — the piece (lowercase) the player
                        moves most often. The AI biases
                        toward restricting that piece.
     sampleSize       — total moves this model has seen.
                        Used to weight blended updates.

   All functions here are pure. Consumers:
     * server/processGameEnd  — calls updatePlayerModel
     * server/getAiMove       — reads the model as bias
   ═══════════════════════════════════════════════════════ */

import { analyzeChessGame, parseSan, type Piece, type Side } from "./chessEventAnalyzer";

export interface PlayerModel {
  topOpeningMoves: string[];
  captureRate: number;
  sacrificeRate: number;
  avgCheckRate: number;
  favoritePiece: Piece;
  sampleSize: number;
}

/** A fresh, neutral model. Used for a user's first encounter with
 *  an opponent — all fields are "unknown". */
export function createDefaultPlayerModel(): PlayerModel {
  return {
    topOpeningMoves: [],
    captureRate: 0,
    sacrificeRate: 0,
    avgCheckRate: 0,
    favoritePiece: "p",
    sampleSize: 0,
  };
}

/** Per-game stats extracted from one game's SAN history — the raw
 *  signal we then fold into the running model. */
interface GameStats {
  firstMove: string | null;
  captureRate: number;
  sacrificeRate: number;
  checkRate: number;
  pieceCounts: Record<Piece, number>;
  moveCount: number;
}

function extractGameStats(sanMoves: string[], playerSide: Side): GameStats {
  const pieceCounts: Record<Piece, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
  let captures = 0;
  let checks = 0;
  let playerMoves = 0;
  let firstMove: string | null = null;

  for (let i = 0; i < sanMoves.length; i++) {
    const moverIsPlayer = (i % 2 === 0) === (playerSide === "w");
    if (!moverIsPlayer) continue;
    const parsed = parseSan(sanMoves[i]);
    if (!parsed) continue;
    playerMoves += 1;
    if (firstMove === null) firstMove = sanMoves[i];
    pieceCounts[parsed.piece] += 1;
    if (parsed.isCapture) captures += 1;
    if (parsed.isCheck) checks += 1;
  }

  // Sacrifice rate: fraction of player captures that are recaptured
  // on the next ply.
  const analyzed = analyzeChessGame({
    sanMoves,
    playerSide,
    result: "draw", // result doesn't matter for sacrifice detection
  });
  const playerCaptureCount = analyzed.playerCaptures.length;
  const sacrificeRate = playerCaptureCount > 0
    ? analyzed.sacrifices.length / playerCaptureCount
    : 0;

  return {
    firstMove,
    captureRate: playerMoves > 0 ? captures / playerMoves : 0,
    sacrificeRate,
    checkRate: playerMoves > 0 ? checks / playerMoves : 0,
    pieceCounts,
    moveCount: playerMoves,
  };
}

/** Pick the dominant (most-moved) non-pawn piece as the favourite,
 *  falling back to pawn if nothing else dominates. */
function dominantPiece(counts: Record<Piece, number>): Piece {
  const candidates: Piece[] = ["q", "n", "b", "r", "k"];
  let best: Piece = "p";
  let bestCount = counts.p;
  for (const c of candidates) {
    if (counts[c] > bestCount) {
      best = c;
      bestCount = counts[c];
    }
  }
  return best;
}

/** Merge a fresh game's stats into the running player model.
 *
 *  Strategy: weighted blend by sample size, capped at 200 moves so
 *  the model keeps responding to recent play even after many games.
 *  topOpeningMoves uses a recency-weighted frequency count. */
export function updatePlayerModel(
  prev: PlayerModel | null,
  sanMoves: string[],
  playerSide: Side,
): PlayerModel {
  const base = prev ?? createDefaultPlayerModel();
  const g = extractGameStats(sanMoves, playerSide);
  if (g.moveCount === 0) return base;

  // Cap old sample size so recent games always get some weight.
  const oldN = Math.min(base.sampleSize, 200);
  const newN = g.moveCount;
  const totalN = oldN + newN;
  const blend = (oldV: number, newV: number) =>
    totalN === 0 ? 0 : (oldV * oldN + newV * newN) / totalN;

  // Opening moves: maintain a top-3 list weighted by count, with
  // recent first-moves receiving a bonus.
  const openingTally = new Map<string, number>();
  for (const m of base.topOpeningMoves) {
    // Existing entries retain a base weight proportional to their
    // position (first is strongest).
    const idx = base.topOpeningMoves.indexOf(m);
    openingTally.set(m, 3 - idx);
  }
  if (g.firstMove) {
    openingTally.set(g.firstMove, (openingTally.get(g.firstMove) ?? 0) + 2);
  }
  const topOpeningMoves = [...openingTally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([m]) => m);

  // Favourite piece: blend piece counts. We keep a simple policy of
  // recomputing from the fresh game when it's dominant enough,
  // otherwise inherit the previous favourite.
  const totalPieceMoves = Object.values(g.pieceCounts).reduce((a, b) => a + b, 0);
  const pieceDominanceRatio = totalPieceMoves > 0
    ? Math.max(...Object.values(g.pieceCounts)) / totalPieceMoves
    : 0;
  const favoritePiece: Piece = pieceDominanceRatio >= 0.35
    ? dominantPiece(g.pieceCounts)
    : base.favoritePiece;

  return {
    topOpeningMoves,
    captureRate: blend(base.captureRate, g.captureRate),
    sacrificeRate: blend(base.sacrificeRate, g.sacrificeRate),
    avgCheckRate: blend(base.avgCheckRate, g.checkRate),
    favoritePiece,
    sampleSize: base.sampleSize + newN,
  };
}

/* ───────────────────────────────────────────────────────
   Player model → AI move biasing

   `playerModelBias` is the small bundle of numbers the
   AI's evaluation function uses to nudge move scores.
   Derived from a PlayerModel via `toMoveBias`.
   ─────────────────────────────────────────────────────── */

export interface PlayerModelBias {
  /** SAN moves the player plays as opening; the AI wants to
   *  counter these. +N to scores of moves that transpose into
   *  a known anti-line. */
  counterOpeningMoves: string[];
  /** Score bonus for moves that leave a capture opportunity
   *  on the board — used against aggressive players. 0-20. */
  baitBonus: number;
  /** Score bonus for solid positional moves over tactical ones
   *  — used against speculative players. 0-15. */
  solidityBonus: number;
  /** Score bonus for moves that keep the king safe — used
   *  against attacking players. 0-15. */
  kingSafetyBonus: number;
  /** Piece whose mobility the AI wants to restrict. */
  restrictPiece: Piece | null;
  /** How confident the bias is (0-1), based on sample size. */
  confidence: number;
}

export function toMoveBias(model: PlayerModel | null): PlayerModelBias {
  if (!model || model.sampleSize < 10) {
    return {
      counterOpeningMoves: [],
      baitBonus: 0,
      solidityBonus: 0,
      kingSafetyBonus: 0,
      restrictPiece: null,
      confidence: 0,
    };
  }
  // Confidence ramps up with sample size, saturating around 150 moves.
  const confidence = Math.min(1, model.sampleSize / 150);

  // Aggressive players (captureRate > 0.25) get baited.
  const baitBonus = Math.round(Math.max(0, model.captureRate - 0.2) * 80 * confidence);

  // Speculative players (sacrificeRate > 0.15) get refuted solidly.
  const solidityBonus = Math.round(Math.max(0, model.sacrificeRate - 0.1) * 80 * confidence);

  // Attacking players (checkRate > 0.08) get king-safety boost.
  const kingSafetyBonus = Math.round(Math.max(0, model.avgCheckRate - 0.06) * 150 * confidence);

  return {
    counterOpeningMoves: model.topOpeningMoves.slice(0, 3),
    baitBonus: Math.min(20, baitBonus),
    solidityBonus: Math.min(15, solidityBonus),
    kingSafetyBonus: Math.min(15, kingSafetyBonus),
    restrictPiece: model.favoritePiece === "p" ? null : model.favoritePiece,
    confidence,
  };
}
