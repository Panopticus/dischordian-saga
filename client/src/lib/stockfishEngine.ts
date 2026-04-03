/**
 * Stockfish Engine Wrapper
 *
 * Runs Stockfish WASM in a Web Worker for zero-latency AI chess moves.
 * Each character maps to specific UCI parameters that shape play style.
 * Characters play their signature opening lines before Stockfish takes over.
 */

/** Character personality mapped to Stockfish UCI parameters */
export interface StockfishPersonality {
  /** Stockfish Skill Level 0-20 (0 = weakest, 20 = strongest) */
  skillLevel: number;
  /** Search depth limit (1-20). Lower = faster but weaker */
  depth: number;
  /** Contempt factor (-100 to 100). Positive = plays for win, negative = draws ok */
  contempt: number;
  /** Move time limit in milliseconds */
  moveTimeMs: number;
}

/** Opening book line: a named sequence of SAN moves */
export interface OpeningLine {
  name: string;
  moves: string[];
  description: string;
}

/** Map game difficulty (1-10) and character style to Stockfish parameters */
export function getStockfishPersonality(
  difficulty: number,
  style: string,
): StockfishPersonality {
  // Base skill level: difficulty 1 → skill 0, difficulty 10 → skill 20
  const baseSkill = Math.round((difficulty - 1) * (20 / 9));

  // Style modifiers
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
 * Opening Book Manager
 *
 * Each character has signature openings. The AI plays book moves for the
 * opening phase, then Stockfish takes over for the middlegame/endgame.
 * This makes each character feel distinct from move 1.
 */
export class OpeningBookManager {
  private bookLine: string[] = [];
  private moveIndex = 0;

  /**
   * Set the opening lines for this game.
   * Randomly picks one of the character's signature openings.
   */
  setOpenings(lines: OpeningLine[]) {
    if (!lines || lines.length === 0) {
      this.bookLine = [];
      return;
    }
    // Pick a random opening line
    const line = lines[Math.floor(Math.random() * lines.length)];
    this.bookLine = line.moves;
    this.moveIndex = 0;
  }

  /**
   * Get the next book move (SAN format) if we're still in the opening.
   * Returns null if the book is exhausted or the position diverged.
   * @param moveNumber - The current half-move number (0-based)
   */
  getBookMove(moveNumber: number): string | null {
    if (moveNumber >= this.bookLine.length) return null;
    // Book moves alternate: even = white, odd = black
    // AI plays as black, so only return moves at odd indices
    if (moveNumber % 2 === 0) return null; // It's white's (player's) turn
    return this.bookLine[moveNumber] || null;
  }

  /** Reset for a new game */
  reset() {
    this.bookLine = [];
    this.moveIndex = 0;
  }

  get isInBook(): boolean {
    return this.moveIndex < this.bookLine.length;
  }
}

/**
 * Stockfish Web Worker engine manager.
 * Communicates with Stockfish via UCI protocol through postMessage.
 */
export class StockfishEngine {
  private worker: Worker | null = null;
  private ready = false;
  private pendingResolve: ((move: string) => void) | null = null;

  /** Initialize the Stockfish Web Worker */
  async init(): Promise<void> {
    if (this.worker) return;

    return new Promise<void>((resolve, reject) => {
      try {
        this.worker = new Worker(
          new URL("stockfish/bin/stockfish-18-single.js", import.meta.url),
          { type: "classic" }
        );

        this.worker.onmessage = (e: MessageEvent) => {
          const line = typeof e.data === "string" ? e.data : String(e.data);
          this.handleMessage(line);

          if (line.includes("uciok")) {
            this.ready = true;
            resolve();
          }
        };

        this.worker.onerror = (e) => {
          console.error("[Stockfish] Worker error:", e);
          reject(e);
        };

        this.send("uci");
      } catch (err) {
        console.error("[Stockfish] Failed to create worker:", err);
        reject(err);
      }
    });
  }

  private send(cmd: string) {
    this.worker?.postMessage(cmd);
  }

  private handleMessage(line: string) {
    if (line.startsWith("bestmove")) {
      const parts = line.split(" ");
      const move = parts[1] || "";
      if (this.pendingResolve) {
        this.pendingResolve(move);
        this.pendingResolve = null;
      }
    }
  }

  /** Configure engine with character personality */
  setPersonality(personality: StockfishPersonality) {
    if (!this.worker) return;
    this.send(`setoption name Skill Level value ${personality.skillLevel}`);
    this.send(`setoption name Contempt value ${personality.contempt}`);
  }

  /**
   * Get the best move for a position.
   * @param fen - Current board position in FEN notation
   * @param personality - Character personality parameters
   * @returns Best move in UCI format (e.g., "e2e4")
   */
  async getBestMove(fen: string, personality: StockfishPersonality): Promise<string> {
    if (!this.worker || !this.ready) {
      throw new Error("Stockfish not initialized");
    }

    return new Promise<string>((resolve) => {
      this.pendingResolve = resolve;
      this.send(`position fen ${fen}`);
      this.send(`go depth ${personality.depth} movetime ${personality.moveTimeMs}`);
    });
  }

  /** Clean up the worker */
  dispose() {
    if (this.worker) {
      this.send("quit");
      this.worker.terminate();
      this.worker = null;
      this.ready = false;
    }
  }

  get isReady() {
    return this.ready;
  }
}
