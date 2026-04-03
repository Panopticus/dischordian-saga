/**
 * Stockfish Engine Wrapper
 *
 * Runs Stockfish WASM in a Web Worker for zero-latency AI chess moves.
 * Each character maps to specific UCI parameters that shape play style.
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
      contempt = 50; // Aggressively plays for the win, avoids draws
      depthBonus = 1;
      break;
    case "defensive":
      contempt = -20; // More willing to accept solid positions/draws
      depthBonus = 1;
      timeBonus = 200;
      break;
    case "positional":
      contempt = 10; // Slight preference for complex positions
      depthBonus = 2; // Thinks deeper (positional play needs foresight)
      timeBonus = 300;
      break;
    case "tactical":
      contempt = 40; // Sharp, aggressive
      depthBonus = 0; // Relies on tactical vision, not raw depth
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

  // Depth scales with difficulty: 2 at easiest, 18 at hardest
  const baseDepth = Math.max(2, Math.min(18, Math.round(difficulty * 1.8) + depthBonus));

  // Move time: faster at low difficulty, more time at high difficulty
  const baseMoveTimeMs = 200 + difficulty * 150 + timeBonus;

  return {
    skillLevel: Math.min(20, Math.max(0, baseSkill)),
    depth: baseDepth,
    contempt: Math.min(100, Math.max(-100, contempt)),
    moveTimeMs: Math.min(5000, baseMoveTimeMs),
  };
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
        // stockfish npm package provides a WASM-based JS file
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

        // Initialize UCI protocol
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
    // Look for "bestmove" response
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

      // Set position
      this.send(`position fen ${fen}`);

      // Search with depth and time limits (whichever hits first)
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
