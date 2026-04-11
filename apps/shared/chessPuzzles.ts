/* ═══════════════════════════════════════════════════════
   CHESS PUZZLES — Daily Tactical Training
   20 curated puzzles: mate-in-1, mate-in-2, forks,
   pins, skewers. Deterministic daily selection.
   ═══════════════════════════════════════════════════════ */

export type PuzzleCategory = "tactics" | "endgame" | "opening_traps";
export type PuzzleTheme = "mate_in_1" | "mate_in_2" | "fork" | "pin" | "skewer";

export interface ChessPuzzle {
  id: string;
  fen: string;
  solutionMoves: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  xpReward: number;
  hint: string;
  category: PuzzleCategory;
  theme: PuzzleTheme;
  title: string;
}

export const CHESS_PUZZLES: ChessPuzzle[] = [
  // ── MATE IN 1 ──
  {
    id: "p01",
    title: "Scholar's Finish",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    solutionMoves: ["Qxf7#"],
    difficulty: 1,
    xpReward: 10,
    hint: "The f7 square is only defended by the king.",
    category: "opening_traps",
    theme: "mate_in_1",
  },
  {
    id: "p02",
    title: "Back Rank Blunder",
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    solutionMoves: ["Re8#"],
    difficulty: 1,
    xpReward: 10,
    hint: "The king has no escape squares on the back rank.",
    category: "endgame",
    theme: "mate_in_1",
  },
  {
    id: "p03",
    title: "Queen's Kiss",
    fen: "r1b1k2r/ppppqppp/2n5/2b1p3/2B1P3/3Q1N2/PPPP1PPP/RNB1K2R w KQkq - 0 1",
    solutionMoves: ["Qxf7#"],
    difficulty: 1,
    xpReward: 10,
    hint: "The queen can deliver checkmate with support from the bishop.",
    category: "tactics",
    theme: "mate_in_1",
  },
  {
    id: "p04",
    title: "Rook Roller",
    fen: "6k1/8/6K1/8/8/8/8/7R w - - 0 1",
    solutionMoves: ["Rh8#"],
    difficulty: 1,
    xpReward: 10,
    hint: "Push the king to the edge and deliver the final blow.",
    category: "endgame",
    theme: "mate_in_1",
  },

  // ── MATE IN 2 ──
  {
    id: "p05",
    title: "Anastasia's Mate",
    fen: "5rk1/4Nppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    solutionMoves: ["Nf5", "Kh8", "Re8"],
    difficulty: 3,
    xpReward: 30,
    hint: "The knight restricts the king, then the rook delivers mate.",
    category: "tactics",
    theme: "mate_in_2",
  },
  {
    id: "p06",
    title: "Smothered Mate",
    fen: "r1b3kr/ppp2pNp/8/8/8/2P5/PP3PPP/R3KB1R w KQ - 0 1",
    solutionMoves: ["Nh5+", "Kg8", "Nf6#"],
    difficulty: 3,
    xpReward: 30,
    hint: "The knight dances around the smothered king.",
    category: "tactics",
    theme: "mate_in_2",
  },
  {
    id: "p07",
    title: "Double Check Doom",
    fen: "r1bqk2r/pppp1Bpp/2n2n2/2b1N3/4P3/8/PPPP1PPP/RNBQK2R w KQkq - 0 1",
    solutionMoves: ["Bxg8", "Rxg8", "Nxc6"],
    difficulty: 4,
    xpReward: 40,
    hint: "Sacrifice to expose the king, then fork with the knight.",
    category: "opening_traps",
    theme: "mate_in_2",
  },
  {
    id: "p08",
    title: "Arabian Mate Setup",
    fen: "7k/R7/5N2/8/8/8/8/6K1 w - - 0 1",
    solutionMoves: ["Rh7+", "Kg8", "Rh8#"],
    difficulty: 2,
    xpReward: 20,
    hint: "Drive the king into the corner with check.",
    category: "endgame",
    theme: "mate_in_2",
  },

  // ── FORK ──
  {
    id: "p09",
    title: "Knight Fork Royale",
    fen: "r1bqkb1r/pppppppp/2n2n2/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 1",
    solutionMoves: ["Nxc6", "bxc6"],
    difficulty: 2,
    xpReward: 20,
    hint: "The knight can attack two pieces at once.",
    category: "tactics",
    theme: "fork",
  },
  {
    id: "p10",
    title: "Royal Fork",
    fen: "r3k2r/ppp2ppp/2nqbn2/3pp3/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 1",
    solutionMoves: ["Ng5"],
    difficulty: 3,
    xpReward: 30,
    hint: "Find the square where the knight attacks queen and bishop.",
    category: "tactics",
    theme: "fork",
  },
  {
    id: "p11",
    title: "Pawn Fork Surprise",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2",
    solutionMoves: ["exd5"],
    difficulty: 1,
    xpReward: 10,
    hint: "Capture to create threats on both sides.",
    category: "opening_traps",
    theme: "fork",
  },
  {
    id: "p12",
    title: "Queen Fork Trap",
    fen: "r1b1kbnr/pppp1ppp/2n5/4p3/2B1P1q1/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
    solutionMoves: ["Bxf7+", "Ke7", "Qxg4"],
    difficulty: 4,
    xpReward: 40,
    hint: "A sacrifice opens the path to win the queen.",
    category: "tactics",
    theme: "fork",
  },

  // ── PIN ──
  {
    id: "p13",
    title: "Absolute Pin",
    fen: "rnb1kbnr/pppp1ppp/8/4p3/4P1q1/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
    solutionMoves: ["Be2"],
    difficulty: 2,
    xpReward: 20,
    hint: "Pin the queen to the king with a quiet developing move.",
    category: "tactics",
    theme: "pin",
  },
  {
    id: "p14",
    title: "Bishop Pin Crusher",
    fen: "rn1qkbnr/ppp1pppp/8/3p4/4P1b1/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
    solutionMoves: ["Bb5+"],
    difficulty: 2,
    xpReward: 20,
    hint: "Check the king while pinning a piece on the diagonal.",
    category: "tactics",
    theme: "pin",
  },
  {
    id: "p15",
    title: "Rook Pin Stack",
    fen: "r2qk2r/ppp2ppp/2n1bn2/3pp3/8/2N2N2/PPPPPPPP/R1BQKB1R w KQkq - 0 1",
    solutionMoves: ["Bb5"],
    difficulty: 3,
    xpReward: 30,
    hint: "Pin the knight to the king through the c6 square.",
    category: "tactics",
    theme: "pin",
  },
  {
    id: "p16",
    title: "Queen Pin Gambit",
    fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq - 0 4",
    solutionMoves: ["Bxb4"],
    difficulty: 3,
    xpReward: 30,
    hint: "Take the pawn — the pin protects you.",
    category: "opening_traps",
    theme: "pin",
  },

  // ── SKEWER ──
  {
    id: "p17",
    title: "Bishop Skewer",
    fen: "8/8/4k3/8/8/2B5/8/4K3 w - - 0 1",
    solutionMoves: ["Bb4+"],
    difficulty: 2,
    xpReward: 20,
    hint: "Attack the king, win what's behind it.",
    category: "endgame",
    theme: "skewer",
  },
  {
    id: "p18",
    title: "Rook Skewer Line",
    fen: "4k3/8/8/4q3/8/8/8/4R1K1 w - - 0 1",
    solutionMoves: ["Re8+"],
    difficulty: 2,
    xpReward: 20,
    hint: "Check the king and win the queen behind it.",
    category: "endgame",
    theme: "skewer",
  },
  {
    id: "p19",
    title: "Queen Skewer Trap",
    fen: "r1b1k2r/pppp1ppp/2n2n2/2b1p3/2BqP3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 1",
    solutionMoves: ["Bxf7+", "Kf8", "Bb3"],
    difficulty: 4,
    xpReward: 40,
    hint: "Sacrifice to check, then skewer queen and rook.",
    category: "tactics",
    theme: "skewer",
  },
  {
    id: "p20",
    title: "Endgame Skewer Master",
    fen: "6k1/8/8/8/3q4/8/8/4R1K1 w - - 0 1",
    solutionMoves: ["Re8+", "Kf7", "Re4"],
    difficulty: 5,
    xpReward: 50,
    hint: "Check first, then skewer the queen on the file.",
    category: "endgame",
    theme: "skewer",
  },
];

/**
 * Get the daily puzzle based on day of year (1-366).
 * Deterministic — same day always returns the same puzzle.
 */
export function getDailyPuzzle(dayOfYear: number): ChessPuzzle {
  const index = ((dayOfYear - 1) % CHESS_PUZZLES.length + CHESS_PUZZLES.length) % CHESS_PUZZLES.length;
  return CHESS_PUZZLES[index];
}

/**
 * Validate a player's solution for a given puzzle.
 * Moves must match the expected solution exactly (algebraic notation).
 */
export function validateSolution(puzzleId: string, moves: string[]): boolean {
  const puzzle = CHESS_PUZZLES.find(p => p.id === puzzleId);
  if (!puzzle) return false;
  if (moves.length !== puzzle.solutionMoves.length) return false;

  return puzzle.solutionMoves.every(
    (expected, i) => moves[i]?.trim() === expected,
  );
}

/**
 * Get puzzles filtered by category.
 */
export function getPuzzlesByCategory(category: PuzzleCategory): ChessPuzzle[] {
  return CHESS_PUZZLES.filter(p => p.category === category);
}

/**
 * Get puzzles filtered by theme.
 */
export function getPuzzlesByTheme(theme: PuzzleTheme): ChessPuzzle[] {
  return CHESS_PUZZLES.filter(p => p.theme === theme);
}

/**
 * Get puzzles filtered by difficulty range.
 */
export function getPuzzlesByDifficulty(min: number, max: number): ChessPuzzle[] {
  return CHESS_PUZZLES.filter(p => p.difficulty >= min && p.difficulty <= max);
}
