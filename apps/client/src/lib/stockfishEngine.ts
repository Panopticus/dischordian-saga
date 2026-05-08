/**
 * Chess engine wrapper.
 *
 * Originally wrapped Stockfish (GPL-3.0) running in a Web Worker.
 * Audit/15.R1 swapped the implementation to a permissively-licensed
 * (BSD-2-Clause via chess.js) pure-TS engine — see permissiveChessEngine.ts.
 * The class names + API are preserved so the rest of the codebase
 * (useStockfish hook, ChessPostGameReview, ChessPage) compiles
 * unchanged.
 */
import {
  PermissiveChessEngine,
  type ChessEnginePersonality,
} from "./permissiveChessEngine";

export type StockfishPersonality = ChessEnginePersonality;

/** Opening book line: a named sequence of SAN moves */
export interface OpeningLine {
  name: string;
  moves: string[];
  description: string;
}

/** Map game difficulty (1-10) and character style to engine parameters.
 *  Same shape and curve as the prior Stockfish-tuned function so
 *  existing character calibrations carry over. */
export function getStockfishPersonality(
  difficulty: number,
  style: string,
): StockfishPersonality {
  const baseSkill = Math.round((difficulty - 1) * (20 / 9));

  let contempt = 0;
  let depthBonus = 0;
  let timeBonus = 0;

  switch (style) {
    case "aggressive":
      contempt = 50;
      depthBonus = 1;
      break;
    case "defensive":
      contempt = -20;
      depthBonus = 1;
      timeBonus = 200;
      break;
    case "positional":
      contempt = 10;
      depthBonus = 2;
      timeBonus = 300;
      break;
    case "tactical":
      contempt = 40;
      depthBonus = 0;
      break;
    case "endgame":
      contempt = 20;
      depthBonus = 2;
      timeBonus = 200;
      break;
    case "universal":
    default:
      contempt = 15;
      depthBonus = 1;
      timeBonus = 100;
      break;
  }

  const baseDepth = Math.max(2, Math.min(18, Math.round(difficulty * 1.8) + depthBonus));
  const baseMoveTimeMs = 200 + difficulty * 150 + timeBonus;

  return {
    skillLevel: Math.min(20, Math.max(0, baseSkill)),
    depth: baseDepth,
    contempt: Math.min(100, Math.max(-100, contempt)),
    moveTimeMs: Math.min(5000, baseMoveTimeMs),
  };
}

/**
 * Opening Book Manager — unchanged. Plays per-character signature
 * opening lines for the first ~10 plies, then hands off to the engine.
 */
export class OpeningBookManager {
  private bookLine: string[] = [];
  private moveIndex = 0;

  setOpenings(lines: OpeningLine[]) {
    if (!lines || lines.length === 0) {
      this.bookLine = [];
      return;
    }
    const line = lines[Math.floor(Math.random() * lines.length)];
    this.bookLine = line.moves;
    this.moveIndex = 0;
  }

  getBookMove(moveNumber: number): string | null {
    if (moveNumber >= this.bookLine.length) return null;
    if (moveNumber % 2 === 0) return null;
    return this.bookLine[moveNumber] || null;
  }

  reset() {
    this.bookLine = [];
    this.moveIndex = 0;
  }

  get isInBook(): boolean {
    return this.moveIndex < this.bookLine.length;
  }
}

/**
 * StockfishEngine — name preserved for caller compatibility. The
 * actual implementation is the permissively-licensed engine. The Web
 * Worker bring-up is now a no-op (the pure-TS search runs in the
 * request thread bounded by moveTimeMs); a future revision can move
 * it back into a worker if blocking turns out to matter.
 */
export class StockfishEngine extends PermissiveChessEngine {}
