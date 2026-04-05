/* ═══════════════════════════════════════════════════════
   STOCKFISH ENGINE WORKER — UCI Protocol Interface
   Wraps Stockfish WASM in a Web Worker for non-blocking AI.
   Supports configurable difficulty via depth, skill level,
   and move time limits for distinct AI personalities.
   ═══════════════════════════════════════════════════════ */

const STOCKFISH_JS_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/stockfish-18-lite-single_6ceefd43.js";

export interface StockfishConfig {
  depth: number;         // Search depth (1-25)
  skillLevel: number;    // Stockfish Skill Level (0-20)
  moveTime?: number;     // Max time per move in ms
  threads?: number;      // Number of threads (1 for single)
  contempt?: number;     // Contempt factor (-100 to 100)
}

/** AI personality presets for Dischordian Saga characters */
export const AI_PRESETS: Record<string, StockfishConfig> = {
  // ─── THE NEYONS (Beginner/Intermediate) ───
  neyon_spark: {
    depth: 3,
    skillLevel: 2,
    moveTime: 500,
    contempt: 0,
  },
  neyon_echo: {
    depth: 5,
    skillLevel: 5,
    moveTime: 800,
    contempt: 0,
  },
  neyon_flux: {
    depth: 7,
    skillLevel: 8,
    moveTime: 1000,
    contempt: 10,
  },

  // ─── THE ARCHONS (Advanced) ───
  archon_sentinel: {
    depth: 10,
    skillLevel: 12,
    moveTime: 2000,
    contempt: 20,
  },
  archon_warden: {
    depth: 12,
    skillLevel: 14,
    moveTime: 3000,
    contempt: 30,
  },
  archon_sovereign: {
    depth: 14,
    skillLevel: 16,
    moveTime: 4000,
    contempt: 40,
  },

  // ─── THE ARCHITECT (Grandmaster) ───
  the_architect: {
    depth: 20,
    skillLevel: 20,
    moveTime: 5000,
    contempt: 50,
  },

  // ─── Quick play presets ───
  easy: { depth: 3, skillLevel: 1, moveTime: 300 },
  medium: { depth: 8, skillLevel: 10, moveTime: 1500 },
  hard: { depth: 14, skillLevel: 16, moveTime: 3000 },
  maximum: { depth: 22, skillLevel: 20, moveTime: 8000 },
};

type MessageHandler = (data: string) => void;

export class StockfishEngine {
  private worker: Worker | null = null;
  private ready = false;
  private readyPromise: Promise<void>;
  private readyResolve!: () => void;
  private messageHandlers: MessageHandler[] = [];
  private currentConfig: StockfishConfig = AI_PRESETS.medium;

  constructor() {
    this.readyPromise = new Promise((resolve) => {
      this.readyResolve = resolve;
    });
    this.init();
  }

  private async init() {
    try {
      // Create a blob worker that loads Stockfish from CDN
      const workerCode = `
        importScripts("${STOCKFISH_JS_URL}");
      `;
      const blob = new Blob([workerCode], { type: "application/javascript" });
      this.worker = new Worker(URL.createObjectURL(blob));

      this.worker.onmessage = (e) => {
        const data = typeof e.data === "string" ? e.data : String(e.data);
        
        if (data.includes("uciok")) {
          this.ready = true;
          this.readyResolve();
        }

        for (const handler of this.messageHandlers) {
          handler(data);
        }
      };

      this.worker.onerror = (e) => {
        console.error("[Stockfish] Worker error:", e);
      };

      // Initialize UCI protocol
      this.send("uci");
    } catch (err) {
      console.error("[Stockfish] Failed to initialize:", err);
    }
  }

  private send(command: string) {
    if (this.worker) {
      this.worker.postMessage(command);
    }
  }

  private onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  async waitReady(): Promise<void> {
    await this.readyPromise;
  }

  /** Configure engine for a specific AI personality */
  configure(config: StockfishConfig) {
    this.currentConfig = config;
    this.send("setoption name Skill Level value " + config.skillLevel);
    this.send("setoption name Threads value " + (config.threads || 1));
    if (config.contempt !== undefined) {
      this.send("setoption name Contempt value " + config.contempt);
    }
  }

  /** Set position from FEN or moves */
  setPosition(fen?: string, moves?: string[]) {
    if (fen) {
      const cmd = moves && moves.length > 0
        ? `position fen ${fen} moves ${moves.join(" ")}`
        : `position fen ${fen}`;
      this.send(cmd);
    } else {
      this.send("position startpos");
    }
  }

  /** Get the best move for the current position */
  async getBestMove(fen: string): Promise<{ bestMove: string; evaluation?: number; ponder?: string }> {
    await this.waitReady();

    return new Promise((resolve) => {
      this.setPosition(fen);

      let evaluation: number | undefined;

      const cleanup = this.onMessage((data) => {
        // Parse evaluation from info lines
        if (data.includes("info") && data.includes("score cp")) {
          const match = data.match(/score cp (-?\d+)/);
          if (match) {
            evaluation = parseInt(match[1]) / 100; // Convert centipawns to pawns
          }
        }
        if (data.includes("score mate")) {
          const match = data.match(/score mate (-?\d+)/);
          if (match) {
            evaluation = parseInt(match[1]) > 0 ? 999 : -999;
          }
        }

        // Parse bestmove
        if (data.startsWith("bestmove")) {
          cleanup();
          const parts = data.split(" ");
          resolve({
            bestMove: parts[1],
            evaluation,
            ponder: parts[3] || undefined,
          });
        }
      });

      // Build go command based on config
      const cfg = this.currentConfig;
      let goCmd = "go";
      if (cfg.depth) goCmd += ` depth ${cfg.depth}`;
      if (cfg.moveTime) goCmd += ` movetime ${cfg.moveTime}`;
      this.send(goCmd);
    });
  }

  /** Stop current search */
  stop() {
    this.send("stop");
  }

  /** Start a new game */
  newGame() {
    this.send("ucinewgame");
    this.send("isready");
  }

  /** Clean up the worker */
  destroy() {
    if (this.worker) {
      this.send("quit");
      this.worker.terminate();
      this.worker = null;
    }
  }

  /** Check if engine is ready */
  isReady(): boolean {
    return this.ready;
  }
}

/** Singleton engine instance */
let engineInstance: StockfishEngine | null = null;

export function getStockfishEngine(): StockfishEngine {
  if (!engineInstance) {
    engineInstance = new StockfishEngine();
  }
  return engineInstance;
}

export function destroyStockfishEngine() {
  if (engineInstance) {
    engineInstance.destroy();
    engineInstance = null;
  }
}
