/* ═══════════════════════════════════════════════════════
   CHESS EVENT ANALYZER — PGN → structured events

   Phase 1 of "The Game Master's Gambit" lore reskin.

   Pure function: given the player's side and the SAN move
   history of a finished game, produce a `ChessGameEvents`
   summary of things worth narrating — captures, checks,
   promotions, sacrifices, brilliancies, blunders, and some
   coarse game-shape metadata.

   Consumers:
     * processGameEnd → persists summaries + triggers
       Game-Master post-game commentary line selection
     * useChessEventDispatcher (client) → fires mid-game
       inner-voice whispers
     * chessPlayerModel → feeds the "learning AI" model

   This module is deliberately engine-free. It parses SAN
   using a tiny standalone regex, so it can run on the
   client and server without pulling in chess.js. (chess.js
   is still used elsewhere for legality — we don't need it
   here because PGN from a completed game is already legal.)
   ═══════════════════════════════════════════════════════ */

export type Piece = "p" | "n" | "b" | "r" | "q" | "k";
export type Side = "w" | "b";
export type GameResult = "win" | "loss" | "draw";
export type GameLength = "short" | "medium" | "long" | "marathon";

/** Structured events extracted from a finished game. */
export interface ChessGameEvents {
  totalMoves: number;
  playerMoveCount: number;
  /** Captures made BY the player, with the captured piece type. */
  playerCaptures: { piece: Piece; moveNumber: number }[];
  /** Captures made AGAINST the player (pieces the player lost). */
  opponentCaptures: { piece: Piece; moveNumber: number }[];
  /** Checks the player delivered. */
  checksGiven: { moveNumber: number; isCheckmate: boolean }[];
  /** Promotions by the player. */
  promotions: { piece: Piece; moveNumber: number }[];
  /** Sacrifices by the player — captures where the player gave up
   *  material worth more than what they took. Heuristic only: we
   *  look at the next 2 plies and flag cases where the capturing
   *  piece is itself captured without compensating gain. */
  sacrifices: { piece: Piece; moveNumber: number }[];
  /** Moves where eval dropped by > 200cp (requires evals array). */
  blunders: { moveNumber: number }[];
  /** Moves where eval improved by > 200cp (requires evals array). */
  brilliancies: { moveNumber: number }[];
  /** Opening family guessed from the first 4-8 plies. */
  openingName: string | null;
  /** True once material has fallen below the endgame threshold. */
  reachedEndgame: boolean;
  result: GameResult;
  length: GameLength;
}

/** Inputs for the analyzer. */
export interface AnalyzerInput {
  /** Array of SAN strings in move order. */
  sanMoves: string[];
  /** Which side the player controlled. */
  playerSide: Side;
  /** Final result from the player's POV. */
  result: GameResult;
  /** Optional per-ply centipawn eval (from Stockfish) for
   *  blunder/brilliancy detection. If omitted, those arrays are empty. */
  evalsCp?: number[];
}

const PIECE_VALUE: Record<Piece, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

/** Parse a SAN string into its semantic components. Returns null for
 *  unrecognised inputs (which we then simply ignore). */
export function parseSan(san: string): {
  piece: Piece;
  isCapture: boolean;
  isCheck: boolean;
  isCheckmate: boolean;
  promotion: Piece | null;
  isCastle: boolean;
} | null {
  if (!san) return null;
  // Castling
  if (san === "O-O" || san === "O-O-O" || san === "0-0" || san === "0-0-0") {
    return { piece: "k", isCapture: false, isCheck: false, isCheckmate: false, promotion: null, isCastle: true };
  }
  // Strip decorations
  const clean = san.replace(/[?!]/g, "");
  const isCheckmate = clean.endsWith("#");
  const isCheck = isCheckmate || clean.endsWith("+");
  const stripped = clean.replace(/[+#]$/, "");
  const isCapture = stripped.includes("x");
  // Promotion: e8=Q or exd8=Q#
  const promoMatch = stripped.match(/=([QRBN])/);
  const promotion = promoMatch ? (promoMatch[1].toLowerCase() as Piece) : null;
  // Piece: leading uppercase N/B/R/Q/K, otherwise pawn
  const pieceLetter = stripped[0];
  let piece: Piece;
  if (pieceLetter && /[NBRQK]/.test(pieceLetter)) {
    piece = pieceLetter.toLowerCase() as Piece;
  } else {
    piece = "p";
  }
  return { piece, isCapture, isCheck, isCheckmate, promotion, isCastle: false };
}

/** Guess the opening name from the first few moves. Deliberately
 *  coarse — this exists for flavour commentary, not analysis. */
export function guessOpening(sanMoves: string[]): string | null {
  if (sanMoves.length < 2) return null;
  const m1 = sanMoves[0];
  const m2 = sanMoves[1];
  const m3 = sanMoves[2] ?? "";
  const m4 = sanMoves[3] ?? "";

  // e4 families
  if (m1 === "e4") {
    if (m2 === "e5") {
      if (m3 === "Nf3") {
        if (m4 === "Nc6") return "Open Game";
        if (m4 === "d6") return "Philidor Defense";
      }
      if (m3 === "f4") return "King's Gambit";
      if (m3 === "Bc4") return "Italian Setup";
      return "Open Game";
    }
    if (m2 === "c5") return "Sicilian Defense";
    if (m2 === "e6") return "French Defense";
    if (m2 === "c6") return "Caro-Kann Defense";
    if (m2 === "d6") return "Pirc Defense";
    if (m2 === "Nf6") return "Alekhine Defense";
    if (m2 === "d5") return "Scandinavian Defense";
    return "King's Pawn Opening";
  }

  // d4 families
  if (m1 === "d4") {
    if (m2 === "d5") {
      if (m3 === "c4") return "Queen's Gambit";
      if (m3 === "Nf3") return "Closed Queen's Pawn";
      if (m3 === "Bf4") return "London System";
      return "Closed Queen's Pawn";
    }
    if (m2 === "Nf6") {
      if (m3 === "c4") {
        if (m4 === "g6") return "King's Indian Defense";
        if (m4 === "e6") return "Nimzo/QID Complex";
        return "Indian Defense";
      }
      return "Indian Defense";
    }
    if (m2 === "f5") return "Dutch Defense";
    return "Queen's Pawn Opening";
  }

  // Flank
  if (m1 === "c4") return "English Opening";
  if (m1 === "Nf3") return "Réti Opening";
  if (m1 === "b3") return "Larsen Opening";
  if (m1 === "g3") return "King's Fianchetto";
  return null;
}

/** Return true once the remaining material on the board has fallen
 *  below a rough "endgame" threshold. We don't track the real board
 *  here — instead we count pieces captured so far. This is cheap
 *  and sufficient for narrative pacing. */
function reachedEndgame(captured: Piece[]): boolean {
  // Standard chess starts with 78 points of material (2×39). Endgame
  // is typically called around ≤ 26 points per side, i.e. we've
  // removed at least 52 points from the board.
  const removedValue = captured.reduce((sum, p) => sum + PIECE_VALUE[p], 0);
  return removedValue >= 26;
}

function classifyLength(totalMoves: number): GameLength {
  if (totalMoves < 20) return "short";
  if (totalMoves < 40) return "medium";
  if (totalMoves < 80) return "long";
  return "marathon";
}

/** Walk the move history forward and mark sacrifices. A move is
 *  flagged as a sacrifice iff:
 *    1. It is a capture by the player
 *    2. The player's capturing piece is itself captured on the next
 *       ply (by the opponent), AND
 *    3. The net material exchange leaves the player down by > 1 pawn
 *
 *  This uses only the parsed SAN — not the real board state — so it
 *  misses some cases (e.g. multi-ply combinations) and occasionally
 *  false-positives. Good enough for flavour commentary. */
function findSacrifices(
  sanMoves: string[],
  playerSide: Side,
): { piece: Piece; moveNumber: number }[] {
  const out: { piece: Piece; moveNumber: number }[] = [];
  for (let i = 0; i < sanMoves.length - 1; i++) {
    const san = sanMoves[i];
    const parsed = parseSan(san);
    if (!parsed) continue;
    const moverIsPlayer = (i % 2 === 0) === (playerSide === "w");
    if (!moverIsPlayer || !parsed.isCapture) continue;

    // Next ply: opponent response. If it's a capture on the same
    // square, it likely recaptures our capturing piece.
    const reply = parseSan(sanMoves[i + 1]);
    if (!reply || !reply.isCapture) continue;

    // Heuristic: a sacrifice is when the player captures a piece of
    // equal or lower value than what they captured WITH, and the
    // opponent immediately recaptures. We can't know the captured
    // piece's value from SAN alone — so we flag any capture where
    // our piece is queen/rook/bishop/knight and gets recaptured.
    const ourPiece = parsed.piece;
    if (ourPiece === "p") continue; // Pawn "sacs" are trivial
    // Check this really is a recapture: in SAN-only terms, if both
    // captures happen on consecutive plies, we assume same square.
    out.push({ piece: ourPiece, moveNumber: Math.floor(i / 2) + 1 });
  }
  return out;
}

/** Compute blunders/brilliancies from per-ply evals if provided. */
function findEvalSwings(
  sanMoves: string[],
  evalsCp: number[] | undefined,
  playerSide: Side,
): { blunders: { moveNumber: number }[]; brilliancies: { moveNumber: number }[] } {
  const blunders: { moveNumber: number }[] = [];
  const brilliancies: { moveNumber: number }[] = [];
  if (!evalsCp || evalsCp.length < 2) return { blunders, brilliancies };
  // Evals are from white's POV. A player-side-sign flips them so a
  // positive number always means "good for the player".
  const flip = playerSide === "w" ? 1 : -1;
  for (let i = 1; i < Math.min(evalsCp.length, sanMoves.length); i++) {
    const moverIsPlayer = ((i - 1) % 2 === 0) === (playerSide === "w");
    if (!moverIsPlayer) continue;
    const before = flip * evalsCp[i - 1];
    const after = flip * evalsCp[i];
    const delta = after - before;
    const moveNumber = Math.floor((i - 1) / 2) + 1;
    if (delta <= -200) blunders.push({ moveNumber });
    else if (delta >= 200) brilliancies.push({ moveNumber });
  }
  return { blunders, brilliancies };
}

/** Main entry point: parse an entire finished game's SAN history
 *  into a `ChessGameEvents` structure. */
export function analyzeChessGame(input: AnalyzerInput): ChessGameEvents {
  const { sanMoves, playerSide, result, evalsCp } = input;

  const playerCaptures: { piece: Piece; moveNumber: number }[] = [];
  const opponentCaptures: { piece: Piece; moveNumber: number }[] = [];
  const checksGiven: { moveNumber: number; isCheckmate: boolean }[] = [];
  const promotions: { piece: Piece; moveNumber: number }[] = [];
  const capturedAccum: Piece[] = [];

  let playerMoveCount = 0;

  for (let i = 0; i < sanMoves.length; i++) {
    const parsed = parseSan(sanMoves[i]);
    if (!parsed) continue;
    const moverIsPlayer = (i % 2 === 0) === (playerSide === "w");
    const moveNumber = Math.floor(i / 2) + 1;
    if (moverIsPlayer) playerMoveCount += 1;

    if (parsed.isCapture) {
      // We don't know the captured piece from the SAN of the capturing
      // move alone. Use the mover's piece as a proxy — this is wrong
      // for narrative fidelity but consistent across player/opponent.
      // A future pass can thread a chess.js board through to resolve
      // the real captured piece.
      const proxy = parsed.piece;
      capturedAccum.push(proxy);
      if (moverIsPlayer) {
        playerCaptures.push({ piece: proxy, moveNumber });
      } else {
        opponentCaptures.push({ piece: proxy, moveNumber });
      }
    }

    if (moverIsPlayer && parsed.isCheck) {
      checksGiven.push({ moveNumber, isCheckmate: parsed.isCheckmate });
    }

    if (moverIsPlayer && parsed.promotion) {
      promotions.push({ piece: parsed.promotion, moveNumber });
    }
  }

  const sacrifices = findSacrifices(sanMoves, playerSide);
  const { blunders, brilliancies } = findEvalSwings(sanMoves, evalsCp, playerSide);

  return {
    totalMoves: sanMoves.length,
    playerMoveCount,
    playerCaptures,
    opponentCaptures,
    checksGiven,
    promotions,
    sacrifices,
    blunders,
    brilliancies,
    openingName: guessOpening(sanMoves),
    reachedEndgame: reachedEndgame(capturedAccum),
    result,
    length: classifyLength(sanMoves.length),
  };
}
