/* ═══════════════════════════════════════════════════════
   THE ARCHITECT'S GAMBIT — Strategic Chess Game
   Characters have unique play styles. Ranked ladder with ELO.
   Game Master boss at the top. Rewards feed into economy.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { logger } from "../logger";
import { eq, and, desc, sql, gte, ne } from "drizzle-orm";
import { protectedProcedure, adminProcedure, router } from "../_core/trpc";
import { getDb, type DrizzleDb } from "../db";
import {
  chessGames, chessRankings, chessTournaments,
  chessPuzzleProgress, chessTournamentParticipants, chessTournamentPairings,
  chessNarrativeState, chessOpponentImprints,
  dreamBalance, notifications,
} from "../../db/schema";
import { pressureService } from "../services/pressureService";
import {
  createDefaultPlayerModel,
  updatePlayerModel,
  toMoveBias,
  type PlayerModel,
} from "@shared/chessPlayerModel";
import { fetchCitizenData, fetchPotentialNftData, resolveChessBonuses } from "../traitResolver";
import { ripple } from "../services/rippleEngine";
import { checkFeatureFlag } from "../middleware/featureFlag";
import { getConsequences } from "../services/universeConsequences";
import { mapDifficultyToChessElo } from "@shared/dynamicDifficulty";
import {
  CHESS_PUZZLES,
  getDailyPuzzle as getDailyPuzzleImpl,
  validateSolution,
  getPuzzlesByDifficulty,
  type ChessPuzzle,
} from "@shared/chessPuzzles";
import type { PlayerModelBias } from "@shared/chessPlayerModel";

// chess.js v1.4 — dynamic import to avoid ESM/CJS mismatch
type ChessInstance = import("chess.js").Chess;
let Chess: typeof import("chess.js").Chess;
const chessReady = import("chess.js").then(m => { Chess = m.Chess; });

const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/* ─── CHARACTER PLAY STYLES ─── */
interface CharacterStyle {
  name: string;
  loreTitle: string;
  eloBonus: number;       // bonus ELO for AI when playing as this character
  style: "aggressive" | "positional" | "tactical" | "defensive" | "endgame" | "universal";
  openingPreference: string;
  description: string;
  unlockRequirement: string;
}

const CHESS_CHARACTERS: Record<string, CharacterStyle> = {
  the_architect: {
    name: "The Architect",
    loreTitle: "Grand Strategist",
    eloBonus: 200,
    style: "positional",
    openingPreference: "queen_gambit",
    description: "Plays deep positional chess. Controls the center, builds slow crushing pressure. Never rushes.",
    unlockRequirement: "default",
  },
  the_enigma: {
    name: "The Enigma",
    loreTitle: "The Unpredictable",
    eloBonus: 100,
    style: "tactical",
    openingPreference: "sicilian",
    description: "Wild sacrifices and brilliant combinations. Thrives in chaos and complex positions.",
    unlockRequirement: "default",
  },
  the_oracle: {
    name: "The Oracle",
    loreTitle: "Seer of Moves",
    eloBonus: 150,
    style: "endgame",
    openingPreference: "ruy_lopez",
    description: "Sees 10 moves ahead. Simplifies into winning endgames with surgical precision.",
    unlockRequirement: "default",
  },
  the_collector: {
    name: "The Collector",
    loreTitle: "Material Hunter",
    eloBonus: 80,
    style: "defensive",
    openingPreference: "caro_kann",
    description: "Hoards material advantage. Trades down to winning endgames. Patient and methodical.",
    unlockRequirement: "default",
  },
  the_warlord: {
    name: "The Warlord",
    loreTitle: "Blitz Commander",
    eloBonus: 120,
    style: "aggressive",
    openingPreference: "kings_gambit",
    description: "Attacks relentlessly from move 1. Sacrifices pawns for initiative. Lives for checkmate.",
    unlockRequirement: "default",
  },
  iron_lion: {
    name: "Iron Lion",
    loreTitle: "The Fortress",
    eloBonus: 100,
    style: "defensive",
    openingPreference: "london_system",
    description: "Impenetrable defense. Builds a fortress and waits for opponent mistakes.",
    unlockRequirement: "default",
  },
  the_necromancer: {
    name: "The Necromancer",
    loreTitle: "Piece Resurrector",
    eloBonus: 130,
    style: "tactical",
    openingPreference: "french_defense",
    description: "Sacrifices pieces only to bring devastating counterattacks from the dead position.",
    unlockRequirement: "Win 10 ranked games",
  },
  the_human: {
    name: "The Human",
    loreTitle: "The Balanced",
    eloBonus: 60,
    style: "universal",
    openingPreference: "italian_game",
    description: "Adapts to any position. No weaknesses, no extreme strengths. Pure chess fundamentals.",
    unlockRequirement: "default",
  },
  agent_zero: {
    name: "Agent Zero",
    loreTitle: "The Calculator",
    eloBonus: 170,
    style: "tactical",
    openingPreference: "najdorf",
    description: "Calculates every variation. Finds computer-like moves in complex positions.",
    unlockRequirement: "Reach Gold tier",
  },
  the_programmer: {
    name: "The Programmer",
    loreTitle: "Pattern Matcher",
    eloBonus: 140,
    style: "positional",
    openingPreference: "english_opening",
    description: "Recognizes patterns from millions of games. Plays the statistically optimal move.",
    unlockRequirement: "Reach Silver tier",
  },
  the_source: {
    name: "The Source",
    loreTitle: "Reality Bender",
    eloBonus: 250,
    style: "universal",
    openingPreference: "kings_indian",
    description: "Transcends normal chess. Creates positions that shouldn't exist. The ultimate challenge before the Game Master.",
    unlockRequirement: "Reach Diamond tier",
  },
  game_master: {
    name: "The Game Master",
    loreTitle: "Magnus Carlsen Level",
    eloBonus: 600,
    style: "universal",
    openingPreference: "any",
    description: "The final boss. Plays at 2800+ ELO. Only the greatest can challenge the Game Master.",
    unlockRequirement: "Reach Grandmaster tier (2400+ ELO)",
  },
};

/* ─── OPENING BOOKS — Signature opening lines per character ─── */
const OPENING_BOOKS: Record<string, Array<{ name: string; moves: string[]; description: string }>> = {
  queen_gambit: [
    { name: "Queen's Gambit Declined", moves: ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "Bg5"], description: "Classical positional play — slow squeeze" },
    { name: "Queen's Gambit Accepted", moves: ["d4", "d5", "c4", "dxc4", "e4", "e5", "Nf3"], description: "Seize the center after accepting the gambit" },
    { name: "Catalan Opening", moves: ["d4", "Nf6", "c4", "e6", "g3", "d5", "Bg2"], description: "Fianchetto bishop controls the long diagonal" },
  ],
  sicilian: [
    { name: "Sicilian Dragon", moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"], description: "Fire-breathing counterattack" },
    { name: "Sicilian Najdorf", moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"], description: "The sharpest Sicilian — maximum complexity" },
    { name: "Sicilian Scheveningen", moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "e6"], description: "Flexible pawn structure for counterplay" },
  ],
  ruy_lopez: [
    { name: "Ruy Lopez Morphy Defense", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6"], description: "Classical Spanish — centuries of theory" },
    { name: "Ruy Lopez Berlin Defense", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6"], description: "The Berlin Wall — solid endgame play" },
    { name: "Ruy Lopez Marshall Attack", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O", "Be7", "Re1", "b5", "Bb3", "O-O", "c3", "d5"], description: "Explosive sacrifice for the initiative" },
  ],
  caro_kann: [
    { name: "Caro-Kann Classical", moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5"], description: "Solid development — no weaknesses" },
    { name: "Caro-Kann Advance", moves: ["e4", "c6", "d4", "d5", "e5", "Bf5", "Nf3", "e6"], description: "Space advantage but Black is solid" },
  ],
  kings_gambit: [
    { name: "King's Gambit Accepted", moves: ["e4", "e5", "f4", "exf4", "Nf3", "g5", "h4"], description: "Romantic chess — all-out attack" },
    { name: "King's Gambit Declined", moves: ["e4", "e5", "f4", "Bc5", "Nf3", "d6"], description: "Declined but White keeps initiative" },
  ],
  london_system: [
    { name: "London System", moves: ["d4", "d5", "Bf4", "Nf6", "e3", "e6", "Nf3", "c5", "c3"], description: "The fortress setup — safe and solid" },
    { name: "London Jobava", moves: ["d4", "Nf6", "Bf4", "d5", "Nc3", "e6", "e3"], description: "Aggressive London with Nc3" },
  ],
  french_defense: [
    { name: "French Winawer", moves: ["e4", "e6", "d4", "d5", "Nc3", "Bb4"], description: "Sharp counterattack — pins the knight" },
    { name: "French Advance", moves: ["e4", "e6", "d4", "d5", "e5", "c5", "c3", "Nc6", "Nf3"], description: "Space advantage with pawn chain" },
  ],
  italian_game: [
    { name: "Italian Game Giuoco Piano", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4"], description: "Classical development — balanced play" },
    { name: "Italian Game Evans Gambit", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "b4"], description: "Pawn sacrifice for rapid development" },
  ],
  najdorf: [
    { name: "Najdorf Poisoned Pawn", moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6", "Bg5", "e6", "f4", "Qb6"], description: "The most analyzed line in chess" },
    { name: "Najdorf English Attack", moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6", "Be3", "e5", "Nb3"], description: "Modern approach — kingside attack" },
  ],
  english_opening: [
    { name: "English Opening Symmetrical", moves: ["c4", "c5", "Nc3", "Nc6", "g3", "g6", "Bg2", "Bg7"], description: "Mirror positions — deep strategy" },
    { name: "English Opening Reversed Sicilian", moves: ["c4", "e5", "Nc3", "Nf6", "Nf3", "Nc6", "g3"], description: "White plays a Sicilian with extra tempo" },
  ],
  kings_indian: [
    { name: "King's Indian Classical", moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6", "Nf3", "O-O", "Be2", "e5"], description: "Hypermodern counterattack — strike from the flanks" },
    { name: "King's Indian Sämisch", moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6", "f3"], description: "White builds a massive center" },
  ],
  any: [
    { name: "Ruy Lopez", moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"], description: "The Game Master knows everything" },
    { name: "Queen's Gambit", moves: ["d4", "d5", "c4"], description: "Classical positional mastery" },
    { name: "Sicilian Najdorf", moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"], description: "Sharp tactical play" },
  ],
};

/* ─── ELO CALCULATION ─── */
export function calculateElo(playerElo: number, opponentElo: number, result: 1 | 0 | 0.5, k = 32): number {
  const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  return Math.round(k * (result - expected));
}

export function getTier(elo: number): string {
  if (elo >= 2400) return "grandmaster";
  if (elo >= 2200) return "master";
  if (elo >= 2000) return "diamond";
  if (elo >= 1800) return "platinum";
  if (elo >= 1600) return "gold";
  if (elo >= 1400) return "silver";
  return "bronze";
}

/* ─── AI MOVE GENERATION ─────────────────────────────────
   Heuristic-based move picker. There is no Stockfish here —
   a real engine would take a deeper look at the resulting
   position. Instead each move is scored from a few signals:
     - terminal evaluation (mate, stalemate, draw)
     - material delta after the move (1-pawn = 100 cp etc.)
     - king-safety: detect "hanging" pieces and self-checks
     - piece activity: development + central control
     - style preferences from CHARACTER_AI_TIER
   The result is then rank-blended with randomness based on
   difficulty so weak AIs play loose moves and strong AIs
   stick close to the top of the score list. */

const PIECE_VALUE: Record<string, number> = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 20_000,
};

/** Net material balance for the side that just moved (positive = good). */
function materialBalance(game: ChessInstance, sideJustMoved: "w" | "b"): number {
  const board = game.board();
  let score = 0;
  for (const row of board) {
    for (const cell of row) {
      if (!cell) continue;
      const v = PIECE_VALUE[cell.type] ?? 0;
      score += cell.color === sideJustMoved ? v : -v;
    }
  }
  return score;
}

/** Static Exchange Evaluation (SEE) of an extended capture sequence
 *  on `toSquare`. Simulates alternating captures with the cheapest
 *  attacker on each side and returns how much material is *lost* by
 *  the side that owns the piece on `toSquare` after both sides play
 *  optimally. If there's no realisable loss, returns 0.
 *
 *  This replaces the previous 1-ply heuristic which only saw the
 *  first capture. The new version walks the full exchange so trades
 *  like "I capture, you recapture, I recapture" are valued correctly.
 *  We use SAN history simulation rather than a custom attacker map so
 *  the result respects all chess.js legality rules (pins, discovered
 *  checks, etc.). */
function hangingPenalty(game: ChessInstance, toSquare: string): number {
  type Square = Parameters<ChessInstance["get"]>[0];
  const sq = toSquare as Square;
  const initialPiece = game.get(sq);
  if (!initialPiece) return 0;

  // Walk the exchange. At each ply, the side to move tries to capture
  // on `toSquare` with their cheapest legal attacker. We track running
  // material (gain[]) using the standard SEE swap-list construction.
  const gain: number[] = [];
  let depth = 0;
  let onSquareValue = PIECE_VALUE[initialPiece.type] ?? 0;
  let position = new Chess(game.fen());

  // Sanity cap so a pathological position can't loop forever.
  const MAX_PLIES = 16;
  while (depth < MAX_PLIES) {
    const mover = position.turn();
    const attackers = (position.moves({ verbose: true }) as Array<{
      to: string; from: string; flags: string; san: string; piece: string; captured?: string;
    }>).filter(m => m.to === toSquare && m.flags.includes("c"));
    if (attackers.length === 0) break;
    // Pick cheapest attacker (lowest piece value).
    attackers.sort((a, b) => (PIECE_VALUE[a.piece] ?? 0) - (PIECE_VALUE[b.piece] ?? 0));
    const cheapest = attackers[0];
    // The capturing side gains the value of the piece currently on the
    // square; the captured piece (their own moving piece) becomes the
    // new occupant for the next ply.
    gain.push((depth === 0 ? -onSquareValue : -(gain[depth - 1] ?? 0) - onSquareValue));
    // chess.js makes the move, advances turn.
    const result = position.move({ from: cheapest.from, to: cheapest.to });
    if (!result) break;
    onSquareValue = PIECE_VALUE[cheapest.piece] ?? 0;
    depth += 1;
    // Optional optimisation: stop if there's nothing left to capture.
    void mover;
  }

  if (gain.length === 0) return 0;

  // Standard SEE backwards pass: each side picks the better of
  // continuing the exchange or stopping.
  for (let i = gain.length - 2; i >= 0; i--) {
    gain[i] = -Math.max(-gain[i], gain[i + 1]);
  }
  // gain[0] is negative when the moving side loses material on the
  // exchange. Penalty is the magnitude of that loss; otherwise zero.
  return gain[0] < 0 ? -gain[0] : 0;
}

export function getAiMove(
  game: ChessInstance,
  difficulty: number,
  style: string,
  /** Optional learning-AI bias from a PlayerModel → PlayerModelBias derivation.
   *  When present, shifts move scoring toward counters of the player's
   *  observed tendencies. See apps/shared/chessPlayerModel.ts. */
  bias?: PlayerModelBias | null,
): string {
  const moves = game.moves({ verbose: true }) as Array<{
    san: string; from: string; to: string; flags: string; piece: string; captured?: string; promotion?: string;
  }>;
  if (moves.length === 0) return "";

  const sideToMove = game.turn();
  // Very high difficulty mostly trusts the heuristic; low difficulty injects more noise.
  const noise = Math.max(5, 120 - difficulty * 12);

  // Are we in the opening (first ~8 half-moves)? Used by bias to
  // prefer counter-openings only while they're still relevant.
  const ply = game.history().length;
  const inOpening = ply < 8;

  // Pre-compute the squares where the *opponent's* (player's) favourite
  // piece currently sits. Moves that capture those pieces — or land
  // adjacent to them, potentially restricting their mobility — get a
  // bias bonus.
  const opponentColor: "w" | "b" = sideToMove === "w" ? "b" : "w";
  const restrictTargets: Array<{ file: number; rank: number }> = [];
  if (bias?.restrictPiece) {
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = board[r][c];
        if (cell && cell.type === bias.restrictPiece && cell.color === opponentColor) {
          restrictTargets.push({ file: c, rank: 8 - r });
        }
      }
    }
  }

  const scored = moves.map(mv => {
    const testGame = new Chess(game.fen());
    // Use from/to/promotion rather than SAN — chess.js v1.4 sometimes
    // refuses to parse SANs with mate (#) or check (+) suffixes.
    const result = testGame.move({ from: mv.from, to: mv.to, promotion: mv.promotion });
    if (!result) return { move: mv.san, score: -Infinity };

    // Terminal positions trump everything else.
    if (testGame.isCheckmate()) return { move: mv.san, score: 100_000 };
    if (testGame.isStalemate() || testGame.isDraw()) {
      // Draws are good if we're losing material, bad if we're winning.
      const matBefore = materialBalance(game, sideToMove);
      return { move: mv.san, score: matBefore < -200 ? 800 : -800 };
    }

    // Material delta after the move (positive = we gained material).
    const after = materialBalance(testGame, sideToMove);
    let score = after / 4; // 1-pawn capture = +25 base score

    // Checks are tactically valuable.
    if (testGame.isCheck()) score += 20 + difficulty * 3;

    // Capture bonuses (in addition to material delta) bias toward action.
    if (mv.captured) {
      score += 15 + (PIECE_VALUE[mv.captured] ?? 0) / 25;
    }

    // Promotion: prefer queen, but reward under-promotion if it gives check
    // or wins material (e.g. knight check + skewer).
    if (mv.promotion) {
      const baseValue = PIECE_VALUE[mv.promotion] ?? 0;
      score += (baseValue - PIECE_VALUE.p) / 8;
      if (mv.promotion === "q") score += 60;
      if (mv.promotion === "n" && testGame.isCheck()) score += 40;
    }

    // King safety: penalise moves that leave a piece hanging.
    const hangs = hangingPenalty(testGame, mv.to);
    score -= hangs / 3;

    // Activity: development + central control.
    const PIECE_LETTERS: Record<string, string> = { n: "N", b: "B", r: "R", q: "Q", k: "K", p: "" };
    const pieceLetter = PIECE_LETTERS[mv.piece] || "";
    if (pieceLetter && (mv.to[0] === "d" || mv.to[0] === "e") && (mv.to[1] === "4" || mv.to[1] === "5")) {
      score += 15;
    }
    if (mv.flags.includes("k") || mv.flags.includes("q")) {
      score += 35; // castling
    }

    // Style-based preferences.
    switch (style) {
      case "aggressive":
        if (mv.captured || testGame.isCheck()) score += 30;
        if (mv.flags.includes("k") || mv.flags.includes("q")) score += 20;
        if (mv.piece === "p" && (mv.to[1] === "4" || mv.to[1] === "5")) score += 15;
        break;
      case "defensive":
        if (mv.flags.includes("k") || mv.flags.includes("q")) score += 50;
        if (!mv.captured) score += 10;
        // Penalise risky tactical attacks; defensive AIs prefer quiet moves.
        if (hangs > 0) score -= 25;
        break;
      case "positional":
        if (pieceLetter && (mv.to[0] === "c" || mv.to[0] === "f") && (mv.to[1] === "4" || mv.to[1] === "5")) score += 12;
        if (mv.flags.includes("k") || mv.flags.includes("q")) score += 35;
        // Slow squeeze: rewards developing moves over captures.
        if (pieceLetter === "N" || pieceLetter === "B") score += 8;
        break;
      case "tactical": {
        if (mv.captured || testGame.isCheck()) score += 35;
        // Tactical AIs love forks: bonus if the moved piece attacks 2+
        // enemy pieces simultaneously.
        const followUps = (testGame.moves({ verbose: true }) as Array<{ to: string; captured?: string }>)
          .filter(m => m.captured);
        if (followUps.length >= 2) score += 30;
        break;
      }
      case "endgame": {
        const ply = game.history().length;
        if (ply > 30) {
          if (mv.piece === "k") score += 20;
          if (mv.piece === "p" && (mv.to[1] === "7" || mv.to[1] === "2")) score += 30;
        }
        break;
      }
      case "universal":
        if (mv.flags.includes("k") || mv.flags.includes("q")) score += 25;
        if (pieceLetter === "N" || pieceLetter === "B") score += 10;
        break;
    }

    // Player-model bias — the "learning AI" nudge that makes the
    // imprint play as if it remembers how the user plays.
    if (bias && bias.confidence > 0) {
      // Counter-opening: if we're still in the opening phase AND the
      // player's last move is one of their tracked favourites, reward
      // classical central moves that restrict that opening.
      if (inOpening && bias.counterOpeningMoves.length > 0) {
        const lastMoveSan = game.history().slice(-1)[0];
        if (lastMoveSan && bias.counterOpeningMoves.includes(lastMoveSan)) {
          // Reward central-occupying responses — these are the classical
          // "book" replies without us carrying an opening book.
          const toFile = mv.to[0];
          const toRank = mv.to[1];
          if ((toFile === "d" || toFile === "e") && (toRank === "4" || toRank === "5")) {
            score += 18 * bias.confidence;
          }
          // Knight development to c3/f3/c6/f6 also rewarded.
          if (mv.piece === "n" && (mv.to === "c3" || mv.to === "f3" || mv.to === "c6" || mv.to === "f6")) {
            score += 14 * bias.confidence;
          }
        }
      }

      // baitBonus: against aggressive capture-happy players, we're
      // willing to leave a piece hanging if it baits them into a
      // position we can punish. We undo part of the hanging penalty
      // instead of rewarding hanging directly — nets out to a "looser"
      // defence without making the AI randomly sacrifice.
      if (bias.baitBonus > 0 && hangs > 0) {
        score += Math.min(hangs / 3, bias.baitBonus);
      }

      // solidityBonus: against speculative sacrificers, reward quiet
      // moves (non-capture, non-check) that don't open lines.
      if (bias.solidityBonus > 0 && !mv.captured && !testGame.isCheck()) {
        score += bias.solidityBonus;
      }

      // kingSafetyBonus: against attacking players, reward castling
      // and moves that keep our king off the half-open files.
      if (bias.kingSafetyBonus > 0) {
        if (mv.flags.includes("k") || mv.flags.includes("q")) {
          score += bias.kingSafetyBonus;
        }
        // Pawn shield preservation: penalise moving pawns on the king's
        // side (rough proxy — assumes short castling).
        if (mv.piece === "p" && (mv.from[0] === "f" || mv.from[0] === "g" || mv.from[0] === "h")) {
          score -= Math.round(bias.kingSafetyBonus / 2);
        }
      }

      // restrictPiece: reward captures of the player's favourite piece,
      // and small bonus for moves landing adjacent to it.
      if (restrictTargets.length > 0) {
        if (mv.captured === bias.restrictPiece) {
          score += 25 * bias.confidence;
        }
        const toFileIdx = mv.to.charCodeAt(0) - "a".charCodeAt(0);
        const toRankIdx = parseInt(mv.to[1], 10);
        for (const t of restrictTargets) {
          const df = Math.abs(toFileIdx - t.file);
          const dr = Math.abs(toRankIdx - t.rank);
          if (df <= 1 && dr <= 1 && !(df === 0 && dr === 0)) {
            score += 6 * bias.confidence;
            break;
          }
        }
      }
    }

    // Difficulty-based noise. Weak AIs are erratic; strong AIs play steady.
    score += (Math.random() - 0.5) * noise;
    return { move: mv.san, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Weak AIs sometimes wander away from the top of the list. At
  // difficulty 10 the AI is deterministic: it always picks the top
  // scored move so mate-in-1 and free captures are reliable.
  const fraction = Math.max(0, 1 - difficulty / 9.5);
  const topN = Math.max(1, Math.ceil(moves.length * fraction));
  const pick = scored[Math.floor(Math.random() * Math.min(topN, scored.length))];
  return pick.move;
}

/* ─── REWARD CALCULATION ─── */
function calculateRewards(mode: string, difficulty: number, won: boolean, eloChange: number) {
  if (!won) return { dream: 0, materials: {} };

  const baseDream = mode === "game_master" ? 500
    : mode === "ranked" ? 50 + Math.max(0, eloChange) * 2
    : mode === "story" ? 30 + difficulty * 10
    : mode === "tournament" ? 100
    : 15 + difficulty * 5; // casual

  const materials: Record<string, number> = {};
  // Higher difficulty = better material drops
  if (difficulty >= 3) materials["quantum_dust"] = Math.floor(Math.random() * 3) + 1;
  if (difficulty >= 5) materials["neural_thread"] = Math.floor(Math.random() * 2) + 1;
  if (difficulty >= 7) materials["void_crystal"] = Math.floor(Math.random() * 2) + 1;
  if (difficulty >= 9) materials["architect_sigil"] = 1;
  if (mode === "game_master") {
    materials["game_master_trophy"] = 1;
    materials["reality_shard"] = Math.floor(Math.random() * 3) + 2;
  }

  return { dream: baseDream, materials };
}

// Ensure chess.js is loaded before router is used
chessReady.catch(e => console.error("[Chess] Failed to load chess.js:", e));

export const chessRouter = router({
  /** Get available characters and their styles */
  getCharacters: protectedProcedure.use(checkFeatureFlag("chess")).query(async ({ ctx }) => {
    await chessReady;
    const db = (await getDb())!;
    const ranking = await db.select().from(chessRankings)
      .where(eq(chessRankings.userId, ctx.user.id)).limit(1);
    const unlocked = ranking[0]?.unlockedCharacters || [];
    const playerElo = ranking[0]?.elo || 1200;
    const tier = getTier(playerElo);

    return Object.entries(CHESS_CHARACTERS).map(([id, char]) => {
      const isUnlocked = char.unlockRequirement === "default"
        || unlocked.includes(id)
        || (id === "the_necromancer" && (ranking[0]?.wins || 0) >= 10)
        || (id === "the_programmer" && ["silver", "gold", "platinum", "diamond", "master", "grandmaster"].includes(tier))
        || (id === "agent_zero" && ["gold", "platinum", "diamond", "master", "grandmaster"].includes(tier))
        || (id === "the_source" && ["diamond", "master", "grandmaster"].includes(tier))
        || (id === "game_master" && tier === "grandmaster");
      return { id, ...char, isUnlocked };
    });
  }),

  /** Get player's chess ranking */
  getMyRanking: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const ranking = await db.select().from(chessRankings)
      .where(eq(chessRankings.userId, ctx.user.id)).limit(1);
    if (!ranking[0]) {
      return { elo: 1200, peakElo: 1200, tier: "bronze", gamesPlayed: 0, wins: 0, losses: 0, draws: 0, winStreak: 0, bestWinStreak: 0, defeatedGameMaster: false, storyProgress: 0 };
    }
    return { ...ranking[0], tier: getTier(ranking[0].elo) };
  }),

  /** Get the ranked leaderboard */
  getLeaderboard: protectedProcedure.query(async () => {
    const db = (await getDb())!;
    const leaders = await db.select().from(chessRankings)
      .orderBy(desc(chessRankings.elo))
      .limit(50);
    return leaders.map(r => ({ ...r, tier: getTier(r.elo) }));
  }),

  /** Start a new game against AI */
  startGame: protectedProcedure
    .input(z.object({
      mode: z.enum(["casual", "ranked", "story", "game_master"]).default("casual"),
      characterId: z.string(),
      opponentCharacterId: z.string().optional(),
      timeControl: z.number().min(60).max(3600).default(600),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
      await chessReady;
      const db = (await getDb())!;
      const character = CHESS_CHARACTERS[input.characterId];
      if (!character) throw new Error("Invalid character");

      // For story mode, pick opponent based on story progress
      let opponentId = input.opponentCharacterId;
      const storyOrder = ["the_human", "the_collector", "iron_lion", "the_enigma", "the_warlord", "the_oracle", "the_necromancer", "the_programmer", "agent_zero", "the_source", "game_master"];

      if (input.mode === "story") {
        const ranking = await db.select().from(chessRankings)
          .where(eq(chessRankings.userId, ctx.user.id)).limit(1);
        const progress = ranking[0]?.storyProgress || 0;
        opponentId = storyOrder[Math.min(progress, storyOrder.length - 1)];
      }

      if (input.mode === "game_master") {
        opponentId = "game_master";
      }

      const opponent = CHESS_CHARACTERS[opponentId || "the_human"];
      if (!opponent) throw new Error("Invalid opponent");

      // Calculate AI difficulty based on character + mode + dynamic difficulty
      let aiDifficulty = 3; // casual default
      if (input.mode === "ranked") {
        const ranking = await db.select().from(chessRankings)
          .where(eq(chessRankings.userId, ctx.user.id)).limit(1);
        const playerElo = ranking[0]?.elo || 1200;
        // Use dynamic difficulty mapping for Stockfish level: convert normalized
        // difficulty (0-1) from player ELO to a target ELO, then scale to 1-10
        const normalizedDifficulty = Math.min(1, Math.max(0, (playerElo - 400) / 1800));
        const targetElo = mapDifficultyToChessElo(normalizedDifficulty) + opponent.eloBonus;
        aiDifficulty = Math.min(10, Math.max(1, Math.floor(targetElo / 300)));
      } else if (input.mode === "story") {
        const ranking = await db.select().from(chessRankings)
          .where(eq(chessRankings.userId, ctx.user.id)).limit(1);
        aiDifficulty = Math.min(10, (ranking[0]?.storyProgress || 0) + 2);
      } else if (input.mode === "game_master") {
        aiDifficulty = 10;
      }

      // Fetch citizen trait bonuses for chess
      const [chessCitizen, chessNft] = await Promise.all([
        fetchCitizenData(ctx.user.id),
        fetchPotentialNftData(ctx.user.id),
      ]);
      const chessTb = resolveChessBonuses(chessCitizen, chessNft);

      // Apply time bonus from traits
      const adjustedTimeMs = (input.timeControl * 1000) + (chessTb.timeBonus * 1000);

      // Player is always white (for now)
      const result = await db.insert(chessGames).values({
        whitePlayerId: ctx.user.id,
        blackPlayerId: null,
        whiteCharacter: input.characterId,
        blackCharacter: opponentId || "the_human",
        mode: input.mode,
        aiDifficulty,
        fen: STARTING_FEN,
        pgn: "",
        status: "active",
        timeControl: input.timeControl,
        whiteTimeMs: adjustedTimeMs,
        blackTimeMs: input.timeControl * 1000,
        startedAt: new Date(),
      });

      // Include opening book lines so the client can play character-specific openings
      const openings = (OPENING_BOOKS as Record<string, any[]>)[opponent.openingPreference] || [];

      return {
        gameId: Number(result[0].insertId),
        fen: STARTING_FEN,
        playerColor: "white",
        opponent: { id: opponentId, ...opponent, openings },
        aiDifficulty,
        traitBonuses: chessTb,
      };
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        const errStack = err instanceof Error ? err.stack : undefined;
        console.error("[Chess] startGame error:", errMsg, errStack);
        throw err;
      }
    }),

  /** Make a move and optionally get AI response */
  makeMove: protectedProcedure
    .input(z.object({
      gameId: z.number(),
      from: z.string(),
      to: z.string(),
      promotion: z.string().optional(),
      useClientAi: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await chessReady;
      const db = (await getDb())!;
      const game = await db.select().from(chessGames)
        .where(and(eq(chessGames.id, input.gameId), eq(chessGames.whitePlayerId, ctx.user.id)))
        .limit(1);
      if (!game[0]) throw new Error("Game not found");
      if (game[0].status !== "active") throw new Error("Game is not active");

      const chess = new Chess(game[0].fen || STARTING_FEN);

      // Validate and make player move
      const playerMove = chess.move({
        from: input.from,
        to: input.to,
        promotion: input.promotion || undefined,
      });
      if (!playerMove) throw new Error("Invalid move");

      let status: string = "active";
      let aiMoveResult = null;
      let winnerId = null;

      // Check if game ended after player move
      if (chess.isCheckmate()) {
        status = "checkmate";
        winnerId = ctx.user.id;
      } else if (chess.isStalemate()) {
        status = "stalemate";
      } else if (chess.isDraw()) {
        status = "draw";
      }

      // AI responds server-side ONLY if client is not handling AI
      if (status === "active" && !input.useClientAi) {
        const opponentChar = CHESS_CHARACTERS[game[0].blackCharacter || "the_human"];
        // Story-mode bias: look up the per-user-per-opponent imprint
        // and derive a PlayerModelBias from its stored player model.
        // For non-story games (casual/ranked/game_master) bias is null —
        // those modes use the plain heuristic.
        let storyBias = null;
        if (game[0].mode === "story" && game[0].blackCharacter) {
          const imprint = await db.select().from(chessOpponentImprints)
            .where(and(
              eq(chessOpponentImprints.userId, ctx.user.id),
              eq(chessOpponentImprints.opponentId, game[0].blackCharacter),
            )).limit(1);
          if (imprint[0]?.playerModel) {
            storyBias = toMoveBias(imprint[0].playerModel as PlayerModel);
          }
        }
        const aiMove = getAiMove(chess, game[0].aiDifficulty || 3, opponentChar?.style || "universal", storyBias);
        if (aiMove) {
          const result = chess.move(aiMove);
          aiMoveResult = result;

          // Check if AI won
          if (chess.isCheckmate()) {
            status = "checkmate";
            winnerId = -1; // AI wins
          } else if (chess.isStalemate()) {
            status = "stalemate";
          } else if (chess.isDraw()) {
            status = "draw";
          }
        }
      }

      const moveCount = chess.history().length;

      // Update game state
      await db.update(chessGames)
        .set({
          fen: chess.fen(),
          pgn: chess.pgn(),
          status: status as any,
          moveCount,
          winnerId: winnerId === -1 ? null : winnerId,
          ...(status !== "active" ? { endedAt: new Date() } : {}),
        })
        .where(eq(chessGames.id, input.gameId));

      // Process game end
      let rewards = null;
      let eloChange = 0;
      if (status !== "active") {
        const result = await processGameEnd(db, ctx.user.id, game[0], status, winnerId);
        rewards = result.rewards;
        eloChange = result.eloChange;
        await ripple.emit("chess_result", { userId: ctx.user.id, won: winnerId === ctx.user.id });
      }

      return {
        fen: chess.fen(),
        pgn: chess.pgn(),
        playerMove: { from: playerMove.from, to: playerMove.to, san: playerMove.san },
        aiMove: aiMoveResult ? { from: aiMoveResult.from, to: aiMoveResult.to, san: aiMoveResult.san } : null,
        status,
        moveCount,
        isCheck: chess.isCheck(),
        rewards,
        eloChange,
      };
    }),

  /** Submit a client-side AI move (from Stockfish WASM or opening book) */
  submitAiMove: protectedProcedure
    .input(z.object({
      gameId: z.number(),
      move: z.string(), // UCI format "e7e5" or SAN format "Nf6"
      format: z.enum(["uci", "san"]).default("uci"),
    }))
    .mutation(async ({ ctx, input }) => {
      await chessReady;
      const db = (await getDb())!;
      const game = await db.select().from(chessGames)
        .where(and(eq(chessGames.id, input.gameId), eq(chessGames.whitePlayerId, ctx.user.id)))
        .limit(1);
      if (!game[0]) throw new Error("Game not found");
      if (game[0].status !== "active") throw new Error("Game is not active");

      const chess = new Chess(game[0].fen || STARTING_FEN);

      // It should be black's (AI's) turn
      if (chess.turn() !== "b") throw new Error("Not AI's turn");

      let aiMoveResult;
      if (input.format === "san") {
        // SAN format from opening book (e.g., "Nf6", "d5", "O-O")
        aiMoveResult = chess.move(input.move);
      } else {
        // UCI format from Stockfish (e.g., "e7e5" or "e7e8q")
        const from = input.move.slice(0, 2);
        const to = input.move.slice(2, 4);
        const promotion = input.move.length > 4 ? input.move[4] : undefined;
        aiMoveResult = chess.move({ from, to, promotion });
      }
      if (!aiMoveResult) throw new Error("Invalid AI move");

      let status: string = "active";
      let winnerId = null;

      if (chess.isCheckmate()) {
        status = "checkmate";
        winnerId = -1; // AI wins
      } else if (chess.isStalemate()) {
        status = "stalemate";
      } else if (chess.isDraw()) {
        status = "draw";
      }

      const moveCount = chess.history().length;

      await db.update(chessGames)
        .set({
          fen: chess.fen(),
          pgn: chess.pgn(),
          status: status as any,
          moveCount,
          winnerId: winnerId === -1 ? null : winnerId,
          ...(status !== "active" ? { endedAt: new Date() } : {}),
        })
        .where(eq(chessGames.id, input.gameId));

      // Process game end
      let rewards = null;
      let eloChange = 0;
      if (status !== "active") {
        const result = await processGameEnd(db, ctx.user.id, game[0], status, winnerId);
        rewards = result.rewards;
        eloChange = result.eloChange;
        await ripple.emit("chess_result", { userId: ctx.user.id, won: winnerId === ctx.user.id });
      }

      return {
        fen: chess.fen(),
        pgn: chess.pgn(),
        aiMove: { from: aiMoveResult.from, to: aiMoveResult.to, san: aiMoveResult.san },
        status,
        moveCount,
        isCheck: chess.isCheck(),
        rewards,
        eloChange,
      };
    }),

  /** Resign a game */
  resign: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const game = await db.select().from(chessGames)
        .where(and(eq(chessGames.id, input.gameId), eq(chessGames.whitePlayerId, ctx.user.id)))
        .limit(1);
      if (!game[0] || game[0].status !== "active") throw new Error("Game not found or not active");

      await db.update(chessGames)
        .set({ status: "resigned", endedAt: new Date() })
        .where(eq(chessGames.id, input.gameId));

      const result = await processGameEnd(db, ctx.user.id, game[0], "resigned", null);
      await ripple.emit("chess_result", { userId: ctx.user.id, won: false });
      return { success: true, eloChange: result.eloChange };
    }),

  /** Get game history */
  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const games = await db.select().from(chessGames)
        .where(eq(chessGames.whitePlayerId, ctx.user.id))
        .orderBy(desc(chessGames.createdAt))
        .limit(input.limit);
      return games.map(g => ({
        ...g,
        whiteCharacterName: CHESS_CHARACTERS[g.whiteCharacter || ""]?.name || "Unknown",
        blackCharacterName: CHESS_CHARACTERS[g.blackCharacter || ""]?.name || "Unknown",
      }));
    }),

  /** Get active game (resume) */
  getActiveGame: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const game = await db.select().from(chessGames)
      .where(and(eq(chessGames.whitePlayerId, ctx.user.id), eq(chessGames.status, "active")))
      .orderBy(desc(chessGames.createdAt))
      .limit(1);
    if (!game[0]) return null;
    return {
      ...game[0],
      opponent: { id: game[0].blackCharacter || "the_human", ...CHESS_CHARACTERS[game[0].blackCharacter || "the_human"] },
    };
  }),

  /** Read-only snapshot of in-flight PvP matches for the lobby live-games
   *  panel. Reads directly from the chess WS server's in-memory map so
   *  it stays consistent with what spectators see. */
  listActiveMpMatches: protectedProcedure.query(async () => {
    // Lazy import so the chess router doesn't pull in the WS server
    // (and its `ws` dep) at module load — important for the
    // chess-behaviors test which mocks `./db` and avoids the WS path.
    const { listActiveChessMatches } = await import("../chessWs");
    return { matches: listActiveChessMatches() };
  }),

  /** Get legal moves for current position */
  getLegalMoves: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ ctx, input }) => {
      await chessReady;
      const db = (await getDb())!;
      const game = await db.select().from(chessGames)
        .where(and(eq(chessGames.id, input.gameId), eq(chessGames.whitePlayerId, ctx.user.id)))
        .limit(1);
      if (!game[0]) return [];
      const chess = new Chess(game[0].fen || STARTING_FEN);
      return chess.moves({ verbose: true });
    }),

  /* ══════════════════════════════════════════════════
     SPECTATOR MODE — Watch active chess games live
     ══════════════════════════════════════════════════ */

  /** Get all active chess games available for spectating */
  getActiveGames: protectedProcedure.query(async ({ ctx }) => {
    await chessReady;
    const db = (await getDb())!;
    const games = await db.select().from(chessGames)
      .where(eq(chessGames.status, "active"))
      .orderBy(desc(chessGames.createdAt))
      .limit(20);

    return games.map(g => {
      const whiteChar = CHESS_CHARACTERS[g.whiteCharacter || "the_human"];
      const blackChar = CHESS_CHARACTERS[g.blackCharacter || "the_human"];
      const chess = new Chess(g.fen || STARTING_FEN);
      const moveCount = g.pgn ? g.pgn.split(" ").filter((m: string) => !m.includes(".")).length : 0;

      return {
        id: g.id,
        mode: g.mode,
        whiteCharacter: g.whiteCharacter,
        blackCharacter: g.blackCharacter,
        whiteCharacterName: whiteChar?.name || "Unknown",
        blackCharacterName: blackChar?.name || "AI",
        moveCount,
        isCheck: chess.isCheck(),
        turn: chess.turn() === "w" ? "white" : "black",
        createdAt: g.createdAt,
        isVsAI: !g.blackPlayerId,
        featured: g.mode === "game_master" || g.mode === "tournament" || moveCount > 30,
      };
    });
  }),

  /** Get spectator view of a specific chess game (no cheating — shows board only) */
  spectateGame: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ ctx, input }) => {
      await chessReady;
      const db = (await getDb())!;
      const game = await db.select().from(chessGames)
        .where(eq(chessGames.id, input.gameId))
        .limit(1);
      if (!game[0]) throw new Error("Game not found");

      const g = game[0];
      const whiteChar = CHESS_CHARACTERS[g.whiteCharacter || "the_human"];
      const blackChar = CHESS_CHARACTERS[g.blackCharacter || "the_human"];
      const chess = new Chess(g.fen || STARTING_FEN);
      const history = chess.history({ verbose: true }) as any[];

      // Get player rankings for display
      let whiteElo = 1200;
      let blackElo = 1200;
      if (g.whitePlayerId) {
        const wr = await db.select().from(chessRankings).where(eq(chessRankings.userId, g.whitePlayerId)).limit(1);
        if (wr[0]) whiteElo = wr[0].elo;
      }
      if (g.blackPlayerId) {
        const br = await db.select().from(chessRankings).where(eq(chessRankings.userId, g.blackPlayerId)).limit(1);
        if (br[0]) blackElo = br[0].elo;
      }

      return {
        id: g.id,
        fen: g.fen || STARTING_FEN,
        pgn: g.pgn || "",
        status: g.status,
        mode: g.mode,
        turn: chess.turn() === "w" ? "white" : "black",
        isCheck: chess.isCheck(),
        isCheckmate: chess.isCheckmate(),
        isStalemate: chess.isStalemate(),
        isDraw: chess.isDraw(),
        moveCount: history.length,
        lastMove: history.length > 0 ? history[history.length - 1] : null,
        recentMoves: history.slice(-10).map((m: { san: string }) => m.san),
        whiteCharacter: { id: g.whiteCharacter, ...whiteChar, elo: whiteElo },
        blackCharacter: { id: g.blackCharacter, ...blackChar, elo: blackElo },
        isVsAI: !g.blackPlayerId,
        aiDifficulty: g.aiDifficulty,
        winnerId: g.winnerId,
        createdAt: g.createdAt,
      };
    }),

  /** Get featured/notable games for the spectator lobby */
  getFeaturedGames: protectedProcedure.query(async ({ ctx }) => {
    await chessReady;
    const db = (await getDb())!;

    // Get recently completed notable games (game_master, tournament, or long games)
    const recentGames = await db.select().from(chessGames)
      .where(and(
        ne(chessGames.status, "waiting"),
        ne(chessGames.status, "abandoned"),
      ))
      .orderBy(desc(chessGames.createdAt))
      .limit(10);

    return recentGames.map(g => {
      const whiteChar = CHESS_CHARACTERS[g.whiteCharacter || "the_human"];
      const blackChar = CHESS_CHARACTERS[g.blackCharacter || "the_human"];
      return {
        id: g.id,
        mode: g.mode,
        status: g.status,
        whiteCharacterName: whiteChar?.name || "Unknown",
        blackCharacterName: blackChar?.name || "AI",
        winnerId: g.winnerId,
        createdAt: g.createdAt,
        featured: g.mode === "game_master" || g.mode === "tournament",
      };
    });
  }),

  /** Get opening book data for display */
  getOpeningBooks: protectedProcedure.query(async () => {
    return Object.entries(CHESS_CHARACTERS).map(([id, char]) => ({
      characterId: id,
      characterName: char.name,
      loreTitle: char.loreTitle,
      style: char.style,
      openingPreference: char.openingPreference,
      openings: (OPENING_BOOKS as Record<string, any[]>)[char.openingPreference] || [],
    }));
  }),

  /**
   * Cross-game progression: report fight game achievements to unlock chess content.
   * Called from the fight game when the player wins fights.
   */
  reportFightProgress: protectedProcedure
    .input(z.object({
      totalFightWins: z.number(),
      highestDifficulty: z.string(),
      perfectWins: z.number().default(0),
      defeatedFighters: z.array(z.string()).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;

      // Get or create chess ranking
      let ranking = await db.select().from(chessRankings)
        .where(eq(chessRankings.userId, ctx.user.id)).limit(1);
      if (!ranking[0]) {
        await db.insert(chessRankings).values({ userId: ctx.user.id, elo: 1200, peakElo: 1200 });
        ranking = await db.select().from(chessRankings)
          .where(eq(chessRankings.userId, ctx.user.id)).limit(1);
      }

      const currentUnlocks: string[] = ranking[0]?.unlockedCharacters || [];
      const newUnlocks: string[] = [];

      // Fight milestones unlock chess characters
      // 5 fight wins → unlock The Necromancer in chess (the undead strategist)
      if (input.totalFightWins >= 5 && !currentUnlocks.includes("the_necromancer")) {
        newUnlocks.push("the_necromancer");
      }
      // 15 fight wins → unlock The Programmer (tactical mind)
      if (input.totalFightWins >= 15 && !currentUnlocks.includes("the_programmer")) {
        newUnlocks.push("the_programmer");
      }
      // Beat veteran difficulty → unlock Agent Zero
      if ((input.highestDifficulty === "veteran" || input.highestDifficulty === "archon") &&
          !currentUnlocks.includes("agent_zero")) {
        newUnlocks.push("agent_zero");
      }
      // 3+ perfect fight wins → unlock The Source
      if (input.perfectWins >= 3 && !currentUnlocks.includes("the_source")) {
        newUnlocks.push("the_source");
      }

      if (newUnlocks.length > 0) {
        const combined = [...new Set([...currentUnlocks, ...newUnlocks])];
        await db.update(chessRankings)
          .set({ unlockedCharacters: combined })
          .where(eq(chessRankings.userId, ctx.user.id));

        // Notify player about new unlocks
        for (const charId of newUnlocks) {
          const char = CHESS_CHARACTERS[charId];
          if (char) {
            await db.insert(notifications).values({
              userId: ctx.user.id,
              type: "achievement",
              title: `Chess Character Unlocked: ${char.name}`,
              message: `Your fighting prowess has earned you access to ${char.name} in The Architect's Gambit! "${char.description}"`,
              actionUrl: "/chess",
            });
          }
        }
      }

      return { newUnlocks, totalUnlocks: [...new Set([...currentUnlocks, ...newUnlocks])] };
    }),

  /**
   * Cross-game progression: get fight game unlocks earned from chess achievements.
   * The fight game calls this to check what fighters should be unlocked.
   */
  getFightUnlocksFromChess: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const ranking = await db.select().from(chessRankings)
      .where(eq(chessRankings.userId, ctx.user.id)).limit(1);

    if (!ranking[0]) return { unlockedFighters: [] };

    const unlockedFighters: string[] = [];
    const r = ranking[0];

    // Chess milestones unlock fight game characters
    // Silver tier → unlock "oracle" (chess mind = prophetic fighter)
    if (["silver", "gold", "platinum", "diamond", "master", "grandmaster"].includes(r.tier)) {
      unlockedFighters.push("oracle");
    }
    // Gold tier → unlock "engineer" (strategic thinker)
    if (["gold", "platinum", "diamond", "master", "grandmaster"].includes(r.tier)) {
      unlockedFighters.push("engineer");
    }
    // 10+ chess wins → unlock "watcher" (patience and observation)
    if (r.wins >= 10) {
      unlockedFighters.push("watcher");
    }
    // Beat the Game Master → unlock "architect" as a fighter
    if (r.defeatedGameMaster) {
      unlockedFighters.push("architect");
    }
    // Diamond+ → unlock "source" as a fighter
    if (["diamond", "master", "grandmaster"].includes(r.tier)) {
      unlockedFighters.push("source");
    }

    return { unlockedFighters };
  }),

  /* ─── PUZZLE / TRAINING MODE ─────────────────────────────
     Lichess-style tactical training backed by the shared
     CHESS_PUZZLES catalog. Per-user solve history is persisted
     in chess_puzzle_progress, so first-solve rewards are durable
     across server restarts. */

  /** Get today's daily puzzle (solution stripped). */
  getDailyPuzzle: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / 86_400_000);
    const puzzle = getDailyPuzzleImpl(dayOfYear);
    return {
      ...stripSolution(puzzle),
      date: now.toISOString().slice(0, 10),
      alreadySolved: await hasSolvedPuzzle(ctx.user.id, puzzle.id),
    };
  }),

  /** List puzzles, optionally filtered by difficulty / category / theme. */
  listPuzzles: protectedProcedure
    .input(z.object({
      difficulty: z.tuple([z.number().int().min(1).max(5), z.number().int().min(1).max(5)]).optional(),
      category: z.enum(["tactics", "endgame", "opening_traps"]).optional(),
      theme: z.enum(["mate_in_1", "mate_in_2", "fork", "pin", "skewer"]).optional(),
      limit: z.number().int().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      let pool: ChessPuzzle[] = CHESS_PUZZLES;
      if (input.difficulty) {
        pool = getPuzzlesByDifficulty(input.difficulty[0], input.difficulty[1]);
      }
      if (input.category) {
        pool = pool.filter(p => p.category === input.category);
      }
      if (input.theme) {
        pool = pool.filter(p => p.theme === input.theme);
      }
      const solvedSet = await getSolvedPuzzleIds(ctx.user.id);
      return {
        puzzles: pool.slice(0, input.limit).map(p => ({
          ...stripSolution(p),
          alreadySolved: solvedSet.has(p.id),
        })),
        total: pool.length,
      };
    }),

  /** Get a single puzzle by ID (solution stripped). */
  getPuzzleById: protectedProcedure
    .input(z.object({ puzzleId: z.string() }))
    .query(async ({ ctx, input }) => {
      const puzzle = CHESS_PUZZLES.find(p => p.id === input.puzzleId);
      if (!puzzle) throw new Error("Puzzle not found");
      return {
        ...stripSolution(puzzle),
        alreadySolved: await hasSolvedPuzzle(ctx.user.id, puzzle.id),
      };
    }),

  /** Validate a puzzle solution and award rewards on first solve. */
  solvePuzzle: protectedProcedure
    .input(z.object({
      puzzleId: z.string(),
      moves: z.array(z.string()).min(1).max(10),
    }))
    .mutation(async ({ ctx, input }) => {
      const puzzle = CHESS_PUZZLES.find(p => p.id === input.puzzleId);
      if (!puzzle) throw new Error("Puzzle not found");
      const db = (await getDb())!;

      const correct = validateSolution(input.puzzleId, input.moves);
      if (!correct) {
        // Count the attempt but don't award rewards.
        const existing = await db.select().from(chessPuzzleProgress)
          .where(and(
            eq(chessPuzzleProgress.userId, ctx.user.id),
            eq(chessPuzzleProgress.puzzleId, puzzle.id),
          )).limit(1);
        if (existing[0]) {
          await db.update(chessPuzzleProgress)
            .set({ attempts: sql`${chessPuzzleProgress.attempts} + 1` })
            .where(eq(chessPuzzleProgress.id, existing[0].id));
        }
        return {
          correct: false,
          hint: puzzle.hint,
          expectedLength: puzzle.solutionMoves.length,
          awarded: 0,
        };
      }

      const existing = await db.select().from(chessPuzzleProgress)
        .where(and(
          eq(chessPuzzleProgress.userId, ctx.user.id),
          eq(chessPuzzleProgress.puzzleId, puzzle.id),
        )).limit(1);
      const alreadySolved = !!existing[0];

      // Record the solve (upsert semantics).
      if (alreadySolved) {
        await db.update(chessPuzzleProgress)
          .set({ attempts: sql`${chessPuzzleProgress.attempts} + 1` })
          .where(eq(chessPuzzleProgress.id, existing[0].id));
      } else {
        await db.insert(chessPuzzleProgress).values({
          userId: ctx.user.id,
          puzzleId: puzzle.id,
          attempts: 1,
        });
      }

      // Only reward first-time solves so there's no farming loop.
      let awarded = 0;
      if (!alreadySolved) {
        awarded = puzzle.xpReward;

        // Award Dream tokens equal to the puzzle's XP reward.
        const bal = await db.select().from(dreamBalance)
          .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        if (bal[0]) {
          await db.update(dreamBalance)
            .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${awarded}` })
            .where(eq(dreamBalance.userId, ctx.user.id));
        } else {
          await db.insert(dreamBalance).values({
            userId: ctx.user.id,
            dreamTokens: awarded,
            soulBoundDream: 0,
          });
        }

        // Award civil skill XP (tactics training counts as chess study).
        const { awardCivilXp } = await import("../civilSkillHelper");
        awardCivilXp(ctx.user.id, "chess_puzzle_solved")
          .catch(e => logger.error("[ChessPuzzle] Civil XP award failed:", e));
      }

      return {
        correct: true,
        alreadySolved,
        awarded,
        solutionMoves: puzzle.solutionMoves,
        title: puzzle.title,
      };
    }),

  /** Return how many puzzles the current user has solved (persistent). */
  getPuzzleStats: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const rows = await db.select({ puzzleId: chessPuzzleProgress.puzzleId })
      .from(chessPuzzleProgress)
      .where(eq(chessPuzzleProgress.userId, ctx.user.id));
    return {
      solvedCount: rows.length,
      totalPuzzles: CHESS_PUZZLES.length,
      solvedIds: rows.map(r => r.puzzleId),
    };
  }),

  /* ─── TOURNAMENTS ────────────────────────────────────────
     DB-backed Swiss / elimination tournament runtime. Metadata
     lives in chess_tournaments, participants in
     chess_tournament_participants, and pairings in
     chess_tournament_pairings with optional links to the real
     chess_games row that resolved them. Scores are stored as
     2x the actual point value (int storage, no MySQL decimals). */

  listTournaments: protectedProcedure
    .input(z.object({
      status: z.enum(["registration", "active", "completed"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = (await getDb())!;
      const filter = input?.status
        ? eq(chessTournaments.status, input.status)
        : undefined;
      const rows = filter
        ? await db.select().from(chessTournaments).where(filter).orderBy(desc(chessTournaments.startsAt))
        : await db.select().from(chessTournaments).orderBy(desc(chessTournaments.startsAt));

      const counts = await db.select({
        tournamentId: chessTournamentParticipants.tournamentId,
        count: sql<number>`count(*)`.as("count"),
      })
        .from(chessTournamentParticipants)
        .where(eq(chessTournamentParticipants.active, true))
        .groupBy(chessTournamentParticipants.tournamentId);
      const countMap = new Map(counts.map(c => [c.tournamentId, Number(c.count)]));

      return rows.map(t => ({
        ...t,
        registeredPlayers: countMap.get(t.id) ?? 0,
        isActive: t.status === "active",
      }));
    }),

  getTournament: protectedProcedure
    .input(z.object({ tournamentId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const rows = await db.select().from(chessTournaments)
        .where(eq(chessTournaments.id, input.tournamentId)).limit(1);
      const row = rows[0];
      if (!row) throw new Error("Tournament not found");

      const participants = await db.select().from(chessTournamentParticipants)
        .where(eq(chessTournamentParticipants.tournamentId, row.id));
      const pairings = await db.select().from(chessTournamentPairings)
        .where(eq(chessTournamentPairings.tournamentId, row.id))
        .orderBy(desc(chessTournamentPairings.round));

      const youAreIn = participants.some(p => p.userId === ctx.user.id);
      const standings = [...participants]
        .sort((a, b) => b.score - a.score || b.tieBreak - a.tieBreak)
        .map((p, i) => ({
          rank: i + 1,
          userId: p.userId,
          userName: p.userName,
          score: p.score / 2,
          tieBreak: p.tieBreak / 2,
          active: p.active,
        }));

      return {
        tournament: row,
        standings,
        currentPairings: pairings
          .filter(p => p.round === row.currentRound)
          .map(toPairingDTO),
        allPairings: pairings.map(toPairingDTO),
        youAreIn,
        participantCount: participants.length,
      };
    }),

  /** Admin creates a new tournament. */
  createTournament: adminProcedure
    .input(z.object({
      name: z.string().min(3).max(128),
      format: z.enum(["swiss", "elimination", "round_robin"]).default("swiss"),
      maxPlayers: z.number().int().min(2).max(64).default(16),
      entryFee: z.number().int().min(0).default(0),
      prizePool: z.number().int().min(0).default(0),
      timeControl: z.number().int().min(60).max(10_800).default(600),
      totalRounds: z.number().int().min(1).max(10).default(4),
      startsAt: z.date().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = (await getDb())!;
      const result = await db.insert(chessTournaments).values({
        name: input.name,
        format: input.format,
        maxPlayers: input.maxPlayers,
        entryFee: input.entryFee,
        prizePool: input.prizePool,
        timeControl: input.timeControl,
        totalRounds: input.totalRounds,
        startsAt: input.startsAt || new Date(Date.now() + 3600_000),
        status: "registration",
      });
      const id = Number((result as any)[0].insertId);
      return { id };
    }),

  joinTournament: protectedProcedure
    .input(z.object({ tournamentId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const rows = await db.select().from(chessTournaments)
        .where(eq(chessTournaments.id, input.tournamentId)).limit(1);
      const t = rows[0];
      if (!t) throw new Error("Tournament not found");
      if (t.status !== "registration") {
        throw new Error("Tournament is no longer accepting registrations");
      }

      const existing = await db.select().from(chessTournamentParticipants)
        .where(and(
          eq(chessTournamentParticipants.tournamentId, t.id),
          eq(chessTournamentParticipants.userId, ctx.user.id),
        )).limit(1);
      if (existing[0]) {
        return { ok: true, alreadyJoined: true };
      }

      const countRows = await db.select({ count: sql<number>`count(*)` })
        .from(chessTournamentParticipants)
        .where(eq(chessTournamentParticipants.tournamentId, t.id));
      const current = Number(countRows[0]?.count ?? 0);
      if (current >= t.maxPlayers) {
        throw new Error("Tournament is full");
      }

      // Charge entry fee from Dream tokens if any.
      if (t.entryFee > 0) {
        const bal = await db.select().from(dreamBalance)
          .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        if (!bal[0] || bal[0].dreamTokens < t.entryFee) {
          throw new Error("Insufficient Dream tokens for entry fee");
        }
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} - ${t.entryFee}` })
          .where(eq(dreamBalance.userId, ctx.user.id));
      }

      await db.insert(chessTournamentParticipants).values({
        tournamentId: t.id,
        userId: ctx.user.id,
        userName: ctx.user.name || `Player ${ctx.user.id}`,
        score: 0,
        tieBreak: 0,
        active: true,
      });

      await db.update(chessTournaments)
        .set({ currentPlayers: current + 1 })
        .where(eq(chessTournaments.id, t.id));

      return { ok: true, alreadyJoined: false };
    }),

  leaveTournament: protectedProcedure
    .input(z.object({ tournamentId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const rows = await db.select().from(chessTournaments)
        .where(eq(chessTournaments.id, input.tournamentId)).limit(1);
      const t = rows[0];
      if (!t) throw new Error("Tournament not found");

      if (t.status === "registration") {
        await db.delete(chessTournamentParticipants)
          .where(and(
            eq(chessTournamentParticipants.tournamentId, t.id),
            eq(chessTournamentParticipants.userId, ctx.user.id),
          ));
      } else if (t.status === "active") {
        await db.update(chessTournamentParticipants)
          .set({ active: false })
          .where(and(
            eq(chessTournamentParticipants.tournamentId, t.id),
            eq(chessTournamentParticipants.userId, ctx.user.id),
          ));
      }

      const countRows = await db.select({ count: sql<number>`count(*)` })
        .from(chessTournamentParticipants)
        .where(and(
          eq(chessTournamentParticipants.tournamentId, t.id),
          eq(chessTournamentParticipants.active, true),
        ));
      await db.update(chessTournaments)
        .set({ currentPlayers: Number(countRows[0]?.count ?? 0) })
        .where(eq(chessTournaments.id, t.id));
      return { ok: true };
    }),

  /** Admin starts the tournament — generates round-1 pairings. */
  startTournament: adminProcedure
    .input(z.object({ tournamentId: z.number().int() }))
    .mutation(async ({ input }) => {
      const db = (await getDb())!;
      const rows = await db.select().from(chessTournaments)
        .where(eq(chessTournaments.id, input.tournamentId)).limit(1);
      const t = rows[0];
      if (!t) throw new Error("Tournament not found");
      if (t.status !== "registration") {
        throw new Error("Tournament has already started");
      }

      const participants = await db.select().from(chessTournamentParticipants)
        .where(eq(chessTournamentParticipants.tournamentId, t.id));
      if (participants.length < 2) {
        throw new Error("Need at least 2 participants to start");
      }

      const priorPairings: ChessPairingRow[] = [];
      const pairings = generatePairingsFor(
        t.format,
        participants,
        priorPairings,
        /*round*/ 1,
      );
      const deadline = new Date(Date.now() + roundDeadlineMs(t.timeControl));
      for (const p of pairings) {
        await db.insert(chessTournamentPairings).values({
          tournamentId: t.id,
          round: 1,
          whiteId: p.whiteId,
          blackId: p.blackId,
          deadlineAt: deadline,
        });
      }
      // Apply bye scoring (if any) directly to the DB.
      for (const bye of collectByes(t.format, participants, priorPairings)) {
        await db.update(chessTournamentParticipants)
          .set({ score: sql`${chessTournamentParticipants.score} + 2` })
          .where(and(
            eq(chessTournamentParticipants.tournamentId, t.id),
            eq(chessTournamentParticipants.userId, bye),
          ));
      }

      await db.update(chessTournaments)
        .set({ status: "active", currentRound: 1 })
        .where(eq(chessTournaments.id, t.id));

      scheduleRoundAutoForfeit(t.id, 1, deadline.getTime());
      return { ok: true, round: 1, pairingsCount: pairings.length };
    }),

  /** A player reports the result of their current pairing. */
  reportTournamentResult: protectedProcedure
    .input(z.object({
      tournamentId: z.number().int(),
      result: z.enum(["win", "loss", "draw"]),
      gameId: z.number().int().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const rows = await db.select().from(chessTournaments)
        .where(eq(chessTournaments.id, input.tournamentId)).limit(1);
      const t = rows[0];
      if (!t) throw new Error("Tournament not found");
      if (t.status !== "active") {
        throw new Error("Tournament is not in an active round");
      }

      const [pairing] = await db.select().from(chessTournamentPairings)
        .where(and(
          eq(chessTournamentPairings.tournamentId, t.id),
          eq(chessTournamentPairings.round, t.currentRound),
          eq(chessTournamentPairings.reported, false),
        ));
      const mine = pairing && (pairing.whiteId === ctx.user.id || pairing.blackId === ctx.user.id)
        ? pairing
        : (await db.select().from(chessTournamentPairings)
            .where(and(
              eq(chessTournamentPairings.tournamentId, t.id),
              eq(chessTournamentPairings.round, t.currentRound),
              eq(chessTournamentPairings.reported, false),
            ))).find(p => p.whiteId === ctx.user.id || p.blackId === ctx.user.id);
      if (!mine) throw new Error("No active pairing for you this round");

      const isWhite = mine.whiteId === ctx.user.id;
      const whiteResult: "win" | "loss" | "draw" =
        input.result === "draw" ? "draw"
        : (input.result === "win") === isWhite ? "win" : "loss";

      // Verify gameId (if given) actually resolves to this pairing.
      if (input.gameId) {
        const [game] = await db.select().from(chessGames)
          .where(eq(chessGames.id, input.gameId)).limit(1);
        if (!game) throw new Error("Game not found");
        const gameIsBetweenPair =
          (game.whitePlayerId === mine.whiteId && game.blackPlayerId === mine.blackId) ||
          (game.whitePlayerId === mine.blackId && game.blackPlayerId === mine.whiteId);
        if (!gameIsBetweenPair) {
          throw new Error("Game does not match the tournament pairing");
        }
        // Reject games that started before the pairing was issued —
        // otherwise a player could replay an old game between the same
        // opponents and report it as the round result. We compare
        // game.startedAt (or createdAt as a fallback) against the
        // pairing.createdAt timestamp.
        const gameStart = game.startedAt ?? game.createdAt;
        if (gameStart && mine.createdAt && gameStart < mine.createdAt) {
          throw new Error("Game predates the tournament pairing");
        }
        // Reject games that haven't actually finished yet.
        if (game.status === "active" || game.status === "waiting") {
          throw new Error("Game is still in progress");
        }
        // Prefer server-authoritative result over user claim.
        if (game.status === "checkmate" && game.winnerId) {
          const serverWhiteResult = game.winnerId === mine.whiteId ? "win" : "loss";
          if (serverWhiteResult !== whiteResult) {
            throw new Error("Reported result does not match the game outcome");
          }
        } else if (game.status === "stalemate" || game.status === "draw") {
          if (whiteResult !== "draw") {
            throw new Error("Reported result does not match the game outcome");
          }
        }
      }

      await db.update(chessTournamentPairings)
        .set({ whiteResult, reported: true, gameId: input.gameId ?? null })
        .where(eq(chessTournamentPairings.id, mine.id));

      // Apply scores (2x) + Buchholz-lite tie-break.
      if (whiteResult === "win") {
        await db.update(chessTournamentParticipants)
          .set({ score: sql`${chessTournamentParticipants.score} + 2` })
          .where(and(
            eq(chessTournamentParticipants.tournamentId, t.id),
            eq(chessTournamentParticipants.userId, mine.whiteId),
          ));
        await db.update(chessTournamentParticipants)
          .set({ tieBreak: sql`${chessTournamentParticipants.tieBreak} + 1` })
          .where(and(
            eq(chessTournamentParticipants.tournamentId, t.id),
            eq(chessTournamentParticipants.userId, mine.blackId),
          ));
      } else if (whiteResult === "loss") {
        await db.update(chessTournamentParticipants)
          .set({ score: sql`${chessTournamentParticipants.score} + 2` })
          .where(and(
            eq(chessTournamentParticipants.tournamentId, t.id),
            eq(chessTournamentParticipants.userId, mine.blackId),
          ));
        await db.update(chessTournamentParticipants)
          .set({ tieBreak: sql`${chessTournamentParticipants.tieBreak} + 1` })
          .where(and(
            eq(chessTournamentParticipants.tournamentId, t.id),
            eq(chessTournamentParticipants.userId, mine.whiteId),
          ));
      } else {
        await db.update(chessTournamentParticipants)
          .set({ score: sql`${chessTournamentParticipants.score} + 1` })
          .where(and(
            eq(chessTournamentParticipants.tournamentId, t.id),
            eq(chessTournamentParticipants.userId, mine.whiteId),
          ));
        await db.update(chessTournamentParticipants)
          .set({ score: sql`${chessTournamentParticipants.score} + 1` })
          .where(and(
            eq(chessTournamentParticipants.tournamentId, t.id),
            eq(chessTournamentParticipants.userId, mine.blackId),
          ));
      }

      // Elimination: mark loser inactive.
      if (t.format === "elimination" && whiteResult !== "draw") {
        const loserId = whiteResult === "win" ? mine.blackId : mine.whiteId;
        await db.update(chessTournamentParticipants)
          .set({ active: false })
          .where(and(
            eq(chessTournamentParticipants.tournamentId, t.id),
            eq(chessTournamentParticipants.userId, loserId),
          ));
      }

      await maybeAdvanceRound(t.id);

      return { ok: true, whiteResult };
    }),

  /** What tournament am I currently competing in, if any? */
  getMyActiveTournament: protectedProcedure.query(async ({ ctx }) => {
    const db = (await getDb())!;
    const rows = await db.select().from(chessTournaments)
      .where(ne(chessTournaments.status, "completed"));
    for (const t of rows) {
      const me = (await db.select().from(chessTournamentParticipants)
        .where(and(
          eq(chessTournamentParticipants.tournamentId, t.id),
          eq(chessTournamentParticipants.userId, ctx.user.id),
          eq(chessTournamentParticipants.active, true),
        )).limit(1))[0];
      if (me) {
        const allParts = await db.select().from(chessTournamentParticipants)
          .where(eq(chessTournamentParticipants.tournamentId, t.id));
        const myRank = [...allParts]
          .sort((a, b) => b.score - a.score || b.tieBreak - a.tieBreak)
          .findIndex(p => p.userId === ctx.user.id) + 1;

        const [currentPairing] = await db.select().from(chessTournamentPairings)
          .where(and(
            eq(chessTournamentPairings.tournamentId, t.id),
            eq(chessTournamentPairings.round, t.currentRound),
            eq(chessTournamentPairings.reported, false),
          ));
        const isMine = currentPairing && (
          currentPairing.whiteId === ctx.user.id || currentPairing.blackId === ctx.user.id
        );

        return {
          tournament: t,
          myScore: me.score / 2,
          myRank,
          currentPairing: isMine && currentPairing ? toPairingDTO(currentPairing) : null,
        };
      }
    }
    return null;
  }),

  /* ─── "THE GAME MASTER'S GAMBIT" — Story mode narrative state ───
     Phase 1 procedures for the 12-act opponent-imprint gauntlet.
     These are read-only for Phase 1 except for recordChoicePoint;
     the actual opponent challenge flow still goes through startGame
     with mode: "story", and processGameEnd folds the game result
     into the imprint row (see updateOpponentImprint below). */

  /** Fetch (or seed) the user's chess narrative meta-state. */
  getChessStoryState: protectedProcedure
    .use(checkFeatureFlag("chess"))
    .query(async ({ ctx }) => {
      const db = (await getDb())!;
      const existing = await db.select().from(chessNarrativeState)
        .where(eq(chessNarrativeState.userId, ctx.user.id)).limit(1);
      if (existing[0]) {
        return {
          currentAct: existing[0].currentAct,
          revealTier: existing[0].revealTier,
          completedActs: (existing[0].completedActs as number[] | null) ?? [],
          loreFlags: (existing[0].loreFlags as string[] | null) ?? [],
          inventorEncountered: existing[0].inventorEncountered,
          knowledgeEncountered: existing[0].knowledgeEncountered,
          epilogueUnlocked: existing[0].epilogueUnlocked,
        };
      }
      // Implicit default — no row means the user hasn't played any
      // story game yet. Return a fresh shape without writing to the DB;
      // the row is materialised on the first act completion.
      return {
        currentAct: 1,
        revealTier: 0,
        completedActs: [] as number[],
        loreFlags: [] as string[],
        inventorEncountered: false,
        knowledgeEncountered: false,
        epilogueUnlocked: false,
      };
    }),

  /** Return all opponent-imprint rows for the user, one per opponent
   *  they've encountered at least once. Unplayed opponents are NOT
   *  returned — the client should merge this with the CHESS_CHARACTERS
   *  roster to compute which are still locked. */
  getOpponentImprints: protectedProcedure
    .use(checkFeatureFlag("chess"))
    .query(async ({ ctx }) => {
      const db = (await getDb())!;
      const rows = await db.select().from(chessOpponentImprints)
        .where(eq(chessOpponentImprints.userId, ctx.user.id));
      return rows.map(r => ({
        opponentId: r.opponentId,
        unlocked: r.unlocked,
        difficultyTier: r.difficultyTier,
        gamesPlayed: r.gamesPlayed,
        wins: r.wins,
        losses: r.losses,
        draws: r.draws,
        lastResult: r.lastResult,
        lastEncounteredAt: r.lastEncounteredAt,
        relationshipScore: r.relationshipScore,
        relationshipFlags: (r.relationshipFlags as string[] | null) ?? [],
        dialogSeenIds: (r.dialogSeenIds as string[] | null) ?? [],
        // playerModel is intentionally NOT returned — it's server-side
        // state used by getAiMove, not a client concern.
      }));
    }),

  /** Return a single opponent imprint by opponentId, or null if the
   *  user has never played against them. */
  getOpponentImprint: protectedProcedure
    .use(checkFeatureFlag("chess"))
    .input(z.object({ opponentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const row = await db.select().from(chessOpponentImprints)
        .where(and(
          eq(chessOpponentImprints.userId, ctx.user.id),
          eq(chessOpponentImprints.opponentId, input.opponentId),
        )).limit(1);
      if (!row[0]) return null;
      return {
        opponentId: row[0].opponentId,
        unlocked: row[0].unlocked,
        difficultyTier: row[0].difficultyTier,
        gamesPlayed: row[0].gamesPlayed,
        wins: row[0].wins,
        losses: row[0].losses,
        draws: row[0].draws,
        lastResult: row[0].lastResult,
        lastEncounteredAt: row[0].lastEncounteredAt,
        relationshipScore: row[0].relationshipScore,
        relationshipFlags: (row[0].relationshipFlags as string[] | null) ?? [],
        dialogSeenIds: (row[0].dialogSeenIds as string[] | null) ?? [],
      };
    }),

  /** Record a choice point's outcome: sets a relationship flag on the
   *  imprint row and adjusts the relationship score. The client calls
   *  this when the user picks a choice in `ChessChoicePointDialog`.
   *  Idempotent — re-sending the same flag is a no-op. */
  recordChoicePoint: protectedProcedure
    .use(checkFeatureFlag("chess"))
    .input(z.object({
      opponentId: z.string(),
      flag: z.string().min(1).max(128),
      relationshipDelta: z.number().int().min(-5).max(5).default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = (await getDb())!;
      const existing = await db.select().from(chessOpponentImprints)
        .where(and(
          eq(chessOpponentImprints.userId, ctx.user.id),
          eq(chessOpponentImprints.opponentId, input.opponentId),
        )).limit(1);
      if (!existing[0]) {
        throw new Error("No imprint found — play the opponent at least once before recording a choice.");
      }
      const flags = (existing[0].relationshipFlags as string[] | null) ?? [];
      if (flags.includes(input.flag)) {
        // Already set — no-op.
        return {
          relationshipFlags: flags,
          relationshipScore: existing[0].relationshipScore,
        };
      }
      const nextFlags = [...flags, input.flag];
      const nextScore = Math.max(-10, Math.min(10, existing[0].relationshipScore + input.relationshipDelta));
      await db.update(chessOpponentImprints)
        .set({
          relationshipFlags: nextFlags,
          relationshipScore: nextScore,
        })
        .where(eq(chessOpponentImprints.id, existing[0].id));
      return { relationshipFlags: nextFlags, relationshipScore: nextScore };
    }),
});

/* ─── PUZZLE STATE (DB-backed) ──────────────────────────── */
async function hasSolvedPuzzle(userId: number, puzzleId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const row = await db.select({ id: chessPuzzleProgress.id })
    .from(chessPuzzleProgress)
    .where(and(
      eq(chessPuzzleProgress.userId, userId),
      eq(chessPuzzleProgress.puzzleId, puzzleId),
    ))
    .limit(1);
  return !!row[0];
}

async function getSolvedPuzzleIds(userId: number): Promise<Set<string>> {
  const db = await getDb();
  if (!db) return new Set();
  const rows = await db.select({ puzzleId: chessPuzzleProgress.puzzleId })
    .from(chessPuzzleProgress)
    .where(eq(chessPuzzleProgress.userId, userId));
  return new Set(rows.map(r => r.puzzleId));
}

function stripSolution(puzzle: ChessPuzzle) {
  const { solutionMoves: _s, ...rest } = puzzle;
  return rest;
}

/* ─── TOURNAMENT HELPERS (DB-backed) ─────────────────────
   Pairing runs on plain rows from chess_tournament_participants.
   `priorPairings` is the full history from chess_tournament_pairings
   for this tournament — the Swiss pairer uses it to avoid rematches
   and to balance white/black counts. */

type ChessParticipantRow = typeof chessTournamentParticipants.$inferSelect;
type ChessPairingRow = typeof chessTournamentPairings.$inferSelect;

interface PairingPlan {
  whiteId: number;
  blackId: number;
}

function toPairingDTO(p: ChessPairingRow) {
  return {
    id: p.id,
    round: p.round,
    whiteId: p.whiteId,
    blackId: p.blackId,
    whiteResult: p.whiteResult,
    reported: p.reported,
    gameId: p.gameId,
    deadlineAt: p.deadlineAt,
  };
}

function roundDeadlineMs(timeControl: number): number {
  // Give players 3x the time control, with a 10-minute floor, to finish
  // their round before auto-forfeit kicks in.
  return Math.max(600_000, timeControl * 3_000);
}

/** Dispatch by format. Returns the list of pairings (the bye, if any,
 *  is separate — see collectByes). */
export function generatePairingsFor(
  format: "swiss" | "elimination" | "round_robin",
  participants: ChessParticipantRow[],
  priorPairings: ChessPairingRow[],
  round: number,
): PairingPlan[] {
  const active = participants.filter(p => p.active);
  if (format === "elimination") {
    return pairEliminationBracket(active, priorPairings, round);
  }
  if (format === "round_robin") {
    return pairRoundRobin(active, priorPairings, round);
  }
  return pairSwiss(active, priorPairings, round);
}

/** Return user IDs that get a bye this round (auto +1 point). */
export function collectByes(
  format: "swiss" | "elimination" | "round_robin",
  participants: ChessParticipantRow[],
  priorPairings: ChessPairingRow[],
): number[] {
  const active = participants.filter(p => p.active);
  if (active.length % 2 === 0) return [];
  if (format === "elimination") {
    // Odd-player-out in elimination gets a free pass to next round.
    const sorted = [...active].sort((a, b) => b.score - a.score || b.tieBreak - a.tieBreak);
    // Prefer a player who hasn't had a bye yet.
    const byeReceivers = new Set<number>();
    for (const p of priorPairings) {
      if (p.whiteId === p.blackId) byeReceivers.add(p.whiteId);
    }
    const noBye = sorted.find(p => !byeReceivers.has(p.userId));
    return [(noBye ?? sorted[sorted.length - 1]).userId];
  }
  if (format === "round_robin") {
    // Round robin assigns byes based on the circular schedule (handled by pairRoundRobin).
    return [];
  }
  // Swiss: lowest-scored player who has not received a bye yet.
  const byePrior = new Set<number>();
  for (const p of priorPairings) if (p.whiteId === p.blackId) byePrior.add(p.whiteId);
  const sorted = [...active].sort((a, b) => a.score - b.score || a.tieBreak - b.tieBreak);
  const noBye = sorted.find(p => !byePrior.has(p.userId));
  return [(noBye ?? sorted[0]).userId];
}

/** Swiss pairing with rematch avoidance + color balance.
 *
 *  Groups players by score, pairs within groups using a simple backtracking
 *  search that skips previous opponents. Color is chosen per pair to
 *  minimise the difference in previous white/black counts (Dutch-style
 *  rather than "always alternate by round"). Odd count: lowest-scoring
 *  player is floated down (a bye is handled separately via collectByes). */
export function pairSwiss(
  active: ChessParticipantRow[],
  priorPairings: ChessPairingRow[],
  _round: number,
): PairingPlan[] {
  if (active.length < 2) return [];

  // Build opponent history + color counts.
  const playedWith = new Map<number, Set<number>>();
  const whiteCount = new Map<number, number>();
  const blackCount = new Map<number, number>();
  for (const p of active) {
    playedWith.set(p.userId, new Set());
    whiteCount.set(p.userId, 0);
    blackCount.set(p.userId, 0);
  }
  for (const prev of priorPairings) {
    if (prev.whiteId === prev.blackId) continue; // bye
    playedWith.get(prev.whiteId)?.add(prev.blackId);
    playedWith.get(prev.blackId)?.add(prev.whiteId);
    whiteCount.set(prev.whiteId, (whiteCount.get(prev.whiteId) ?? 0) + 1);
    blackCount.set(prev.blackId, (blackCount.get(prev.blackId) ?? 0) + 1);
  }

  // Sort by score desc (tiebreak desc). If odd count, the lowest is the
  // bye — pull them out and pair the rest.
  const sorted = [...active].sort((a, b) => b.score - a.score || b.tieBreak - a.tieBreak);
  const pool = sorted.length % 2 === 1 ? sorted.slice(0, -1) : sorted;

  // Backtracking pairer.
  const used = new Set<number>();
  const result: PairingPlan[] = [];
  const byId = new Map(pool.map(p => [p.userId, p]));

  function tryPair(i: number): boolean {
    // Advance past already-paired players.
    while (i < pool.length && used.has(pool[i].userId)) i++;
    if (i >= pool.length) return true;

    const anchor = pool[i];
    used.add(anchor.userId);
    const anchorDiff = (whiteCount.get(anchor.userId) ?? 0) - (blackCount.get(anchor.userId) ?? 0);

    // Score candidates by how well they balance the anchor's color counts.
    // Prefer candidates whose own color preference is opposite to the
    // anchor's, so the resulting pair zeroes out both diffs.
    const candidates: Array<{ idx: number; balanceCost: number }> = [];
    for (let j = i + 1; j < pool.length; j++) {
      const cand = pool[j];
      if (used.has(cand.userId)) continue;
      if (playedWith.get(anchor.userId)?.has(cand.userId)) continue;
      const candDiff = (whiteCount.get(cand.userId) ?? 0) - (blackCount.get(cand.userId) ?? 0);
      // Lower balanceCost = better (we'd ideally pair +1/-1 over +1/+1).
      const balanceCost = Math.abs(anchorDiff + candDiff);
      candidates.push({ idx: j, balanceCost });
    }
    candidates.sort((a, b) => a.balanceCost - b.balanceCost);

    for (const { idx: j } of candidates) {
      const cand = pool[j];
      used.add(cand.userId);
      const candDiff = (whiteCount.get(cand.userId) ?? 0) - (blackCount.get(cand.userId) ?? 0);
      // Whoever has played fewer whites should be white now.
      const anchorIsWhite = anchorDiff < candDiff
        ? true
        : anchorDiff > candDiff
          ? false
          : (anchor.userId < cand.userId); // deterministic tiebreak
      result.push({
        whiteId: anchorIsWhite ? anchor.userId : cand.userId,
        blackId: anchorIsWhite ? cand.userId : anchor.userId,
      });
      if (tryPair(i + 1)) return true;
      result.pop();
      used.delete(cand.userId);
    }
    used.delete(anchor.userId);
    return false;
  }

  if (!tryPair(0)) {
    // Rematch avoidance impossible — fall back to adjacent score pairing,
    // ignoring history. Happens in small tournaments late in the schedule.
    result.length = 0;
    used.clear();
    for (let i = 0; i + 1 < pool.length; i += 2) {
      const a = pool[i];
      const b = pool[i + 1];
      const aDiff = (whiteCount.get(a.userId) ?? 0) - (blackCount.get(a.userId) ?? 0);
      const bDiff = (whiteCount.get(b.userId) ?? 0) - (blackCount.get(b.userId) ?? 0);
      const aIsWhite = aDiff <= bDiff;
      result.push({
        whiteId: aIsWhite ? a.userId : b.userId,
        blackId: aIsWhite ? b.userId : a.userId,
      });
    }
  }
  // Safety: suppress type-checker "declared but not used" if a future edit drops it.
  void byId;
  return result;
}

/** Elimination: pair adjacent winners of the previous round. Round 1 is
 *  seeded by score desc (typically all zero, so registration order). */
function pairEliminationBracket(
  active: ChessParticipantRow[],
  priorPairings: ChessPairingRow[],
  round: number,
): PairingPlan[] {
  const sorted = [...active].sort((a, b) => b.score - a.score || b.tieBreak - a.tieBreak);
  const pool = sorted.length % 2 === 1 ? sorted.slice(0, -1) : sorted;
  const pairings: PairingPlan[] = [];
  for (let i = 0; i + 1 < pool.length; i += 2) {
    // Alternate who plays white based on seed parity so #1 alternates.
    const aIsWhite = (i + round) % 2 === 0;
    pairings.push({
      whiteId: aIsWhite ? pool[i].userId : pool[i + 1].userId,
      blackId: aIsWhite ? pool[i + 1].userId : pool[i].userId,
    });
  }
  // Suppress "unused" warning on priorPairings; future rematch-check may use it.
  void priorPairings;
  return pairings;
}

/** Simple round-robin: fixed schedule (all-play-all) over n-1 rounds. */
function pairRoundRobin(
  active: ChessParticipantRow[],
  _priorPairings: ChessPairingRow[],
  round: number,
): PairingPlan[] {
  // Circle method: fix player 0, rotate the rest.
  const players = [...active];
  if (players.length % 2 === 1) players.push({ ...players[0], id: -1, userId: -1 });
  const n = players.length;
  const halfN = n / 2;

  // Rotate (round - 1) times.
  const rotated = [players[0]];
  const rest = players.slice(1);
  for (let i = 0; i < (round - 1) % (n - 1); i++) {
    rest.unshift(rest.pop()!);
  }
  rotated.push(...rest);

  const pairings: PairingPlan[] = [];
  for (let i = 0; i < halfN; i++) {
    const a = rotated[i];
    const b = rotated[n - 1 - i];
    if (a.userId === -1 || b.userId === -1) continue; // the bye
    const aIsWhite = (i + round) % 2 === 0;
    pairings.push({
      whiteId: aIsWhite ? a.userId : b.userId,
      blackId: aIsWhite ? b.userId : a.userId,
    });
  }
  return pairings;
}

/** After a result is reported, check if the current round is complete
 *  and either generate next-round pairings or close out the tournament. */
async function maybeAdvanceRound(tournamentId: number): Promise<void> {
  const db = (await getDb())!;
  const [t] = await db.select().from(chessTournaments)
    .where(eq(chessTournaments.id, tournamentId)).limit(1);
  if (!t || t.status !== "active") return;

  const roundPairings = await db.select().from(chessTournamentPairings)
    .where(and(
      eq(chessTournamentPairings.tournamentId, t.id),
      eq(chessTournamentPairings.round, t.currentRound),
    ));
  if (roundPairings.some(p => !p.reported)) return;

  // All reported — advance or close out.
  if (t.format === "elimination") {
    const activeCount = (await db.select({ count: sql<number>`count(*)` })
      .from(chessTournamentParticipants)
      .where(and(
        eq(chessTournamentParticipants.tournamentId, t.id),
        eq(chessTournamentParticipants.active, true),
      )))[0]?.count ?? 0;
    if (Number(activeCount) <= 1) {
      await finalizeTournament(t.id);
      return;
    }
  } else if (t.currentRound >= t.totalRounds) {
    await finalizeTournament(t.id);
    return;
  }

  const participants = await db.select().from(chessTournamentParticipants)
    .where(eq(chessTournamentParticipants.tournamentId, t.id));
  const allPrior = await db.select().from(chessTournamentPairings)
    .where(eq(chessTournamentPairings.tournamentId, t.id));

  const nextRound = t.currentRound + 1;
  const plans = generatePairingsFor(t.format, participants, allPrior, nextRound);
  const deadline = new Date(Date.now() + roundDeadlineMs(t.timeControl));
  for (const p of plans) {
    await db.insert(chessTournamentPairings).values({
      tournamentId: t.id,
      round: nextRound,
      whiteId: p.whiteId,
      blackId: p.blackId,
      deadlineAt: deadline,
    });
  }
  for (const byeId of collectByes(t.format, participants, allPrior)) {
    await db.update(chessTournamentParticipants)
      .set({ score: sql`${chessTournamentParticipants.score} + 2` })
      .where(and(
        eq(chessTournamentParticipants.tournamentId, t.id),
        eq(chessTournamentParticipants.userId, byeId),
      ));
  }

  await db.update(chessTournaments)
    .set({ currentRound: nextRound })
    .where(eq(chessTournaments.id, t.id));

  scheduleRoundAutoForfeit(t.id, nextRound, deadline.getTime());
}

/** Close out the tournament: mark completed + distribute prize pool. */
async function finalizeTournament(tournamentId: number): Promise<void> {
  const db = (await getDb())!;
  const [t] = await db.select().from(chessTournaments)
    .where(eq(chessTournaments.id, tournamentId)).limit(1);
  if (!t) return;

  await db.update(chessTournaments)
    .set({ status: "completed" })
    .where(eq(chessTournaments.id, t.id));

  if (t.prizePool > 0) {
    const parts = await db.select().from(chessTournamentParticipants)
      .where(eq(chessTournamentParticipants.tournamentId, t.id));
    const ranked = [...parts].sort((a, b) => b.score - a.score || b.tieBreak - a.tieBreak);
    const splits = [0.6, 0.25, 0.15];
    for (let i = 0; i < Math.min(3, ranked.length); i++) {
      const prize = Math.floor(t.prizePool * splits[i]);
      if (prize <= 0) continue;
      await db.update(dreamBalance)
        .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${prize}` })
        .where(eq(dreamBalance.userId, ranked[i].userId));
      await db.insert(notifications).values({
        userId: ranked[i].userId,
        type: "achievement",
        title: `Tournament Finish: ${t.name}`,
        message: `You placed #${i + 1} and earned ${prize} Dream tokens.`,
        actionUrl: "/chess",
      });
    }
  }
}

/** Process-local auto-forfeit timers. Persistent scheduling is out of
 *  scope here (would need a job queue); we re-arm on server restart via
 *  rehydrateAutoForfeitTimers() below.
 *
 *  @internal Exported for unit tests that need to verify a timer was
 *  scheduled (or clean up between test runs). */
export const autoForfeitTimers = new Map<string, ReturnType<typeof setTimeout>>();

function scheduleRoundAutoForfeit(tournamentId: number, round: number, deadlineMs: number) {
  const key = `${tournamentId}:${round}`;
  const existing = autoForfeitTimers.get(key);
  if (existing) clearTimeout(existing);
  const delay = Math.max(0, deadlineMs - Date.now());
  const timer = setTimeout(() => {
    autoForfeitTimers.delete(key);
    runRoundAutoForfeit(tournamentId, round).catch(e =>
      logger.error("[Chess] auto-forfeit failed:", e),
    );
  }, delay);
  autoForfeitTimers.set(key, timer);
}

/** @internal Exported for unit tests. The tRPC layer schedules this
 *  via `scheduleRoundAutoForfeit`; production code should not invoke
 *  it directly. */
export async function runRoundAutoForfeit(tournamentId: number, round: number) {
  const db = (await getDb())!;
  const unreported = await db.select().from(chessTournamentPairings)
    .where(and(
      eq(chessTournamentPairings.tournamentId, tournamentId),
      eq(chessTournamentPairings.round, round),
      eq(chessTournamentPairings.reported, false),
    ));
  if (unreported.length === 0) return;

  // Any pairing still unreported is scored as a double-forfeit draw.
  for (const p of unreported) {
    await db.update(chessTournamentPairings)
      .set({ whiteResult: "draw", reported: true })
      .where(eq(chessTournamentPairings.id, p.id));
    await db.update(chessTournamentParticipants)
      .set({ score: sql`${chessTournamentParticipants.score} + 1` })
      .where(and(
        eq(chessTournamentParticipants.tournamentId, tournamentId),
        eq(chessTournamentParticipants.userId, p.whiteId),
      ));
    await db.update(chessTournamentParticipants)
      .set({ score: sql`${chessTournamentParticipants.score} + 1` })
      .where(and(
        eq(chessTournamentParticipants.tournamentId, tournamentId),
        eq(chessTournamentParticipants.userId, p.blackId),
      ));
  }
  await maybeAdvanceRound(tournamentId);
}

/** Called at server startup to re-arm auto-forfeit timers for active
 *  tournaments whose current round has a pending deadline. */
export async function rehydrateChessTournamentTimers(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const active = await db.select().from(chessTournaments)
    .where(eq(chessTournaments.status, "active"));
  for (const t of active) {
    const pending = await db.select().from(chessTournamentPairings)
      .where(and(
        eq(chessTournamentPairings.tournamentId, t.id),
        eq(chessTournamentPairings.round, t.currentRound),
        eq(chessTournamentPairings.reported, false),
      ));
    const deadline = pending.find(p => p.deadlineAt)?.deadlineAt;
    if (deadline) {
      scheduleRoundAutoForfeit(t.id, t.currentRound, new Date(deadline).getTime());
    }
  }
}

/** Process game end — update ELO, give rewards, advance story */
async function processGameEnd(
  db: DrizzleDb, playerId: number, game: typeof chessGames.$inferSelect, status: string, winnerId: number | null
) {
  const playerWon = winnerId === playerId;
  const isDraw = status === "stalemate" || status === "draw";

  // Get or create ranking
  let ranking = await db.select().from(chessRankings)
    .where(eq(chessRankings.userId, playerId)).limit(1);
  if (!ranking[0]) {
    await db.insert(chessRankings).values({ userId: playerId, elo: 1200, peakElo: 1200 });
    ranking = await db.select().from(chessRankings)
      .where(eq(chessRankings.userId, playerId)).limit(1);
  }

  const currentElo = ranking[0].elo;
  const opponentChar = CHESS_CHARACTERS[game.blackCharacter || "the_human"];
  const opponentElo = 1200 + (opponentChar?.eloBonus || 0) + (game.aiDifficulty || 3) * 50;

  // Calculate ELO change (only for ranked/story/game_master)
  let eloChange = 0;
  if (game.mode === "ranked" || game.mode === "story" || game.mode === "game_master") {
    const result = playerWon ? 1 : isDraw ? 0.5 : 0;
    eloChange = calculateElo(currentElo, opponentElo, result as 1 | 0 | 0.5);
  }

  const newElo = Math.max(100, currentElo + eloChange);
  const newPeakElo = Math.max(ranking[0].peakElo, newElo);
  const newWinStreak = playerWon ? ranking[0].winStreak + 1 : 0;
  const newBestWinStreak = Math.max(ranking[0].bestWinStreak, newWinStreak);

  // Update ranking
  await db.update(chessRankings)
    .set({
      elo: newElo,
      peakElo: newPeakElo,
      tier: getTier(newElo) as any,
      gamesPlayed: sql`${chessRankings.gamesPlayed} + 1`,
      wins: playerWon ? sql`${chessRankings.wins} + 1` : ranking[0].wins,
      losses: !playerWon && !isDraw ? sql`${chessRankings.losses} + 1` : ranking[0].losses,
      draws: isDraw ? sql`${chessRankings.draws} + 1` : ranking[0].draws,
      winStreak: newWinStreak,
      bestWinStreak: newBestWinStreak,
      defeatedGameMaster: playerWon && game.mode === "game_master" ? true : ranking[0].defeatedGameMaster,
      storyProgress: playerWon && game.mode === "story"
        ? sql`${chessRankings.storyProgress} + 1`
        : ranking[0].storyProgress,
    })
    .where(eq(chessRankings.userId, playerId));

  // Update game with ELO change
  await db.update(chessGames)
    .set({ whiteEloChange: eloChange, rewardsDream: 0 })
    .where(eq(chessGames.id, game.id));

  // Calculate and give rewards — apply trait bonuses
  const [endCitizen, endNft] = await Promise.all([
    fetchCitizenData(playerId),
    fetchPotentialNftData(playerId),
  ]);
  const endChessTb = resolveChessBonuses(endCitizen, endNft);
  const baseRewards = calculateRewards(game.mode, game.aiDifficulty || 3, playerWon, eloChange);
  const rewards = { ...baseRewards } as typeof baseRewards & { traitMultiplier: number; traitSources: string[] };
  const combinedMultiplier = endChessTb.rewardMultiplier * endChessTb.dreamMultiplier;
  // Apply Living Universe XP multiplier to chess rewards
  const fx = await getConsequences();
  const chessXpMult = fx.xpMultipliers["fight"] ?? 1;
  rewards.dream = Math.round(baseRewards.dream * combinedMultiplier * chessXpMult);
  // Attach trait info for frontend bonus toast
  rewards.traitMultiplier = combinedMultiplier;
  const traitSources: string[] = [];
  if (endCitizen?.species) traitSources.push(`${endCitizen.species} Species`);
  if (endCitizen?.characterClass) traitSources.push(`${endCitizen.characterClass} Class`);
  if (endCitizen?.element) traitSources.push(`${endCitizen.element} Element`);
  rewards.traitSources = traitSources;
  if (rewards.dream > 0) {
    const bal = await db.select().from(dreamBalance)
      .where(eq(dreamBalance.userId, playerId)).limit(1);
    if (bal[0]) {
      await db.update(dreamBalance)
        .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${rewards.dream}` })
        .where(eq(dreamBalance.userId, playerId));
    } else {
      await db.insert(dreamBalance).values({ userId: playerId, dreamTokens: rewards.dream, soulBoundDream: 0 });
    }

    await db.update(chessGames)
      .set({ rewardsDream: rewards.dream, rewardsMaterials: rewards.materials })
      .where(eq(chessGames.id, game.id));
  }

  // Notify on special achievements
  if (playerWon && game.mode === "game_master") {
    await db.insert(notifications).values({
      userId: playerId,
      type: "achievement",
      title: "GAME MASTER DEFEATED!",
      message: "You have defeated The Game Master! You are the ultimate chess champion of the Dischordian Saga!",
      actionUrl: "/chess",
    });
  }

  // Award class mastery XP
  const { awardClassXp } = await import("../classMasteryHelper");
  const classXpAction = playerWon ? "win_chess" : undefined;
  let classXpResult = null;
  if (classXpAction) {
    classXpResult = await awardClassXp(playerId, classXpAction);
    // Extra XP for checkmate wins
    if (playerWon && game.pgn?.includes("#")) {
      await awardClassXp(playerId, "chess_checkmate");
    }
  }

  // Award civil skill XP (tactics)
  const { awardCivilXp } = await import("../civilSkillHelper");
  if (playerWon) {
    awardCivilXp(playerId, "win_chess").catch(e => logger.error("[Chess] Civil XP award failed:", e));
    if (game.pgn?.includes("#")) {
      awardCivilXp(playerId, "chess_checkmate").catch(e => logger.error("[Chess] Civil XP award failed:", e));
    }
  }

  // Story-mode narrative integration: update the per-opponent imprint
  // state (difficulty tier, W/L record, player model, last result) and
  // emit Living Universe pressure on act completion.
  if (game.mode === "story" && game.blackCharacter) {
    await updateOpponentImprint(db, playerId, game, status, winnerId).catch(e => {
      logger.error("[Chess] updateOpponentImprint failed:", e);
    });
  }

  return { eloChange, rewards, classXpResult };
}

/** Update the per-user-per-opponent "imprint" row after a story-mode
 *  game ends. Maintains the learning AI state, the difficulty tier,
 *  and the win/loss/draw record that drives rematch dialog branches.
 *  Also emits Living Universe pressure and unlocks the next act in the
 *  user's narrative state on a first win. */
async function updateOpponentImprint(
  db: DrizzleDb,
  playerId: number,
  game: typeof chessGames.$inferSelect,
  status: string,
  winnerId: number | null,
): Promise<void> {
  const opponentId = game.blackCharacter;
  if (!opponentId) return;

  const playerWon = winnerId === playerId;
  const isDraw = status === "stalemate" || status === "draw";
  const isLoss = !playerWon && !isDraw;

  // Parse the finished game into a SAN move list for the player model.
  const sanMoves = parseSanHistoryFromPgn(game.pgn || "");

  // Fetch (or seed) the imprint row for this opponent.
  const existing = await db.select().from(chessOpponentImprints)
    .where(and(
      eq(chessOpponentImprints.userId, playerId),
      eq(chessOpponentImprints.opponentId, opponentId),
    )).limit(1);

  const prevModel = (existing[0]?.playerModel as PlayerModel | null) ?? createDefaultPlayerModel();
  const nextModel = updatePlayerModel(prevModel, sanMoves, "w");

  const prevTier = existing[0]?.difficultyTier ?? 0;
  // Bump tier on win, capped at 5; first-win also flips `unlocked`.
  const nextTier = playerWon ? Math.min(5, prevTier + 1) : prevTier;
  const wasFirstWin = playerWon && (existing[0]?.wins ?? 0) === 0;

  const lastResult: "win" | "loss" | "draw" = playerWon ? "win" : isDraw ? "draw" : "loss";

  if (!existing[0]) {
    await db.insert(chessOpponentImprints).values({
      userId: playerId,
      opponentId,
      unlocked: true,
      difficultyTier: nextTier,
      gamesPlayed: 1,
      wins: playerWon ? 1 : 0,
      losses: isLoss ? 1 : 0,
      draws: isDraw ? 1 : 0,
      lastResult,
      lastEncounteredAt: new Date(),
      playerModel: nextModel,
      relationshipFlags: [],
      relationshipScore: 0,
      dialogSeenIds: [],
    });
  } else {
    await db.update(chessOpponentImprints)
      .set({
        unlocked: true,
        difficultyTier: nextTier,
        gamesPlayed: sql`${chessOpponentImprints.gamesPlayed} + 1`,
        wins: playerWon ? sql`${chessOpponentImprints.wins} + 1` : existing[0].wins,
        losses: isLoss ? sql`${chessOpponentImprints.losses} + 1` : existing[0].losses,
        draws: isDraw ? sql`${chessOpponentImprints.draws} + 1` : existing[0].draws,
        lastResult,
        lastEncounteredAt: new Date(),
        playerModel: nextModel,
      })
      .where(eq(chessOpponentImprints.id, existing[0].id));
  }

  // On first win, unlock the next opponent in the canonical story order
  // and bump the user's `chessNarrativeState.currentAct`.
  if (wasFirstWin) {
    await advanceNarrativeStateOnFirstWin(db, playerId, opponentId);
  }

  // Living Universe pressure: wins feed loreDiscoveries, losses feed a
  // tiny bit of deaths pressure (fiction: a piece of you died in the
  // Matrix). Winning the first time against any imprint emits extra
  // loreDiscoveries because the reveal tier ratchets.
  if (playerWon) {
    await pressureService.increment(playerId, "loreDiscoveries", 15, `chess_imprint_${opponentId}_win`);
    if (wasFirstWin) {
      await pressureService.increment(playerId, "loreDiscoveries", 10, `chess_imprint_${opponentId}_first_win`);
    }
  } else if (isLoss) {
    await pressureService.increment(playerId, "deaths", 2, `chess_imprint_${opponentId}_loss`);
  }
}

/** Fetch-or-create the user's chessNarrativeState row and, on first
 *  win against a specific opponent, bump `currentAct` + record the act
 *  in `completedActs`. */
async function advanceNarrativeStateOnFirstWin(
  db: DrizzleDb,
  playerId: number,
  opponentId: string,
): Promise<void> {
  const STORY_ORDER = [
    "the_human", "the_collector", "iron_lion", "the_enigma", "the_warlord",
    "the_oracle", "the_necromancer", "the_programmer", "agent_zero",
    "the_source", "game_master",
  ];
  const actNumber = STORY_ORDER.indexOf(opponentId) + 1;
  if (actNumber === 0) return;

  const existing = await db.select().from(chessNarrativeState)
    .where(eq(chessNarrativeState.userId, playerId)).limit(1);

  if (!existing[0]) {
    await db.insert(chessNarrativeState).values({
      userId: playerId,
      currentAct: Math.min(12, actNumber + 1),
      revealTier: Math.min(5, Math.floor(actNumber / 2)),
      completedActs: [actNumber],
      loreFlags: [],
      inventorEncountered: false,
      knowledgeEncountered: false,
      epilogueUnlocked: actNumber >= 11,
    });
    return;
  }

  const completedActs = (existing[0].completedActs as number[] | null) ?? [];
  if (completedActs.includes(actNumber)) return; // idempotent
  const nextCompleted = [...completedActs, actNumber].sort((a, b) => a - b);
  const nextCurrentAct = Math.max(existing[0].currentAct, Math.min(12, actNumber + 1));
  const nextRevealTier = Math.max(existing[0].revealTier, Math.min(5, Math.floor(actNumber / 2)));
  const nextEpilogue = existing[0].epilogueUnlocked || actNumber >= 11;

  await db.update(chessNarrativeState)
    .set({
      currentAct: nextCurrentAct,
      revealTier: nextRevealTier,
      completedActs: nextCompleted,
      epilogueUnlocked: nextEpilogue,
      updatedAt: new Date(),
    })
    .where(eq(chessNarrativeState.userId, playerId));
}

/** Parse a PGN's move text into an ordered list of SAN moves.
 *  Strips move numbers, result tokens, and any annotation glyphs so
 *  the chessPlayerModel helpers can walk the history cleanly. */
function parseSanHistoryFromPgn(pgn: string): string[] {
  if (!pgn) return [];
  // Strip PGN tag pairs ([Event "..."] etc.)
  const bodyStart = pgn.lastIndexOf("]");
  const body = bodyStart >= 0 ? pgn.slice(bodyStart + 1) : pgn;
  // Remove comments { ... } and variations ( ... ) — chess.js pgn()
  // output typically has neither, but we're defensive.
  const cleaned = body.replace(/\{[^}]*\}/g, " ").replace(/\([^)]*\)/g, " ");
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  const moves: string[] = [];
  for (const tok of tokens) {
    // Skip move numbers like "1." or "23..."
    if (/^\d+\.+$/.test(tok)) continue;
    // Skip result tokens.
    if (tok === "1-0" || tok === "0-1" || tok === "1/2-1/2" || tok === "*") continue;
    // Strip trailing annotation glyphs (! ? !! ?? !? ?!)
    const clean = tok.replace(/[!?]+$/, "");
    if (clean.length > 0) moves.push(clean);
  }
  return moves;
}
