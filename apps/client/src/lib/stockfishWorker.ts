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

  /**
   * Evaluate a single position at the given depth. Returns the
   * engine's score in centipawns (positive = White better). Used
   * by the live eval stream during mind-game trigger detection
   * and by postGameAnalyze in the post-game review.
   */
  async evaluatePosition(
    fen: string,
    opts: { depth?: number; moveTime?: number } = {},
  ): Promise<{ evalCp: number; mate: number | null; bestMove: string | null }> {
    await this.waitReady();

    return new Promise((resolve) => {
      this.setPosition(fen);
      let evalCp = 0;
      let mate: number | null = null;
      let bestMove: string | null = null;

      const cleanup = this.onMessage((data) => {
        if (data.includes("info") && data.includes("score cp")) {
          const match = data.match(/score cp (-?\d+)/);
          if (match) evalCp = parseInt(match[1], 10);
        }
        if (data.includes("score mate")) {
          const match = data.match(/score mate (-?\d+)/);
          if (match) {
            mate = parseInt(match[1], 10);
            evalCp = mate > 0 ? 10000 : -10000;
          }
        }
        if (data.startsWith("bestmove")) {
          cleanup();
          const parts = data.split(" ");
          bestMove = parts[1] ?? null;
          resolve({ evalCp, mate, bestMove });
        }
      });

      const depth = opts.depth ?? 12;
      const moveTime = opts.moveTime;
      let goCmd = `go depth ${depth}`;
      if (moveTime) goCmd += ` movetime ${moveTime}`;
      this.send(goCmd);
    });
  }

  /**
   * Evaluate a position and return the top N candidate moves.
   * Used by the brilliancy detector — when the player's move was
   * the engine's top choice AND that choice was significantly
   * better than the second-best, the move is a brilliancy.
   *
   * Returns lines sorted by quality (best first). Each line carries
   * the eval (in centipawns from White's POV) and the UCI move.
   */
  async evaluatePositionMultiPv(
    fen: string,
    opts: { depth?: number; multiPv?: number; moveTime?: number } = {},
  ): Promise<ReadonlyArray<{ multipv: number; evalCp: number; mate: number | null; uciMove: string | null }>> {
    await this.waitReady();
    const multiPv = opts.multiPv ?? 2;
    this.send(`setoption name MultiPV value ${multiPv}`);

    return new Promise((resolve) => {
      this.setPosition(fen);
      // Track the latest reported eval per multipv index.
      const latest = new Map<number, { evalCp: number; mate: number | null; uciMove: string | null }>();

      const cleanup = this.onMessage((data) => {
        if (data.includes("info") && data.includes("multipv")) {
          const mpvMatch = data.match(/multipv (\d+)/);
          if (!mpvMatch) return;
          const mpv = parseInt(mpvMatch[1], 10);
          let evalCp = 0;
          let mate: number | null = null;
          const cpMatch = data.match(/score cp (-?\d+)/);
          if (cpMatch) evalCp = parseInt(cpMatch[1], 10);
          const mateMatch = data.match(/score mate (-?\d+)/);
          if (mateMatch) {
            mate = parseInt(mateMatch[1], 10);
            evalCp = mate > 0 ? 10000 : -10000;
          }
          // First move of the principal variation is the candidate.
          const pvMatch = data.match(/ pv (\S+)/);
          const uciMove = pvMatch?.[1] ?? null;
          latest.set(mpv, { evalCp, mate, uciMove });
        }
        if (data.startsWith("bestmove")) {
          cleanup();
          // Reset multipv to 1 for any subsequent default-mode call.
          this.send("setoption name MultiPV value 1");
          const lines = [...latest.entries()]
            .sort((a, b) => a[0] - b[0])
            .map(([multipv, v]) => ({
              multipv,
              evalCp: v.evalCp,
              mate: v.mate,
              uciMove: v.uciMove,
            }));
          resolve(lines);
        }
      });

      const depth = opts.depth ?? 12;
      const moveTime = opts.moveTime;
      let goCmd = `go depth ${depth}`;
      if (moveTime) goCmd += ` movetime ${moveTime}`;
      this.send(goCmd);
    });
  }

  /**
   * Analyze a finished game move-by-move at the given depth.
   * Returns a per-ply eval array. The caller bucket-sorts these
   * into mistake types for the ChessPostGameReview component.
   *
   * `moves` is the SAN move list from the start position.
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
    // Import chess.js dynamically so the worker module stays
    // compatible with callers that don't use this feature.
    const { Chess } = await import("chess.js");
    const game = new Chess(startFen);
    const out: Array<{
      ply: number;
      fenBefore: string;
      fenAfter: string;
      evalBeforeCp: number;
      evalAfterCp: number;
      deltaCp: number;
    }> = [];

    let { evalCp: evalBefore } = await this.evaluatePosition(game.fen(), {
      depth: opts.depth ?? 18,
    });

    for (let i = 0; i < moves.length; i++) {
      const fenBefore = game.fen();
      const legalMove = game.move(moves[i]);
      if (!legalMove) {
        throw new Error(
          `postGameAnalyze: illegal move "${moves[i]}" at ply ${i + 1}`,
        );
      }
      const fenAfter = game.fen();
      const { evalCp: evalAfter } = await this.evaluatePosition(fenAfter, {
        depth: opts.depth ?? 18,
      });
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

  /**
   * Analyze a finished game move-by-move at the given depth, AND
   * collect the engine's top-2 candidate moves at every position.
   * The extra information lets the caller flag brilliancies — moves
   * the player found that matched the engine's top choice when the
   * top choice was significantly better than the second-best.
   *
   * Slower than `postGameAnalyze` (two evaluations per ply instead
   * of one). Use only when brilliancy detection is wanted.
   */
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
      /** UCI move the player actually played (e.g. "e2e4"). */
      playedUci: string;
      /** Engine's first-best move at this position (UCI). */
      bestUci: string | null;
      /** Engine's first-best eval (centipawns, White POV). */
      bestEvalCp: number | null;
      /** Engine's second-best eval (centipawns, White POV). Null
       *  when the position has no legal alternative or the engine
       *  did not return a multipv 2 line. */
      secondBestEvalCp: number | null;
    }>
  > {
    const { Chess } = await import("chess.js");
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

    let { evalCp: evalBefore } = await this.evaluatePosition(game.fen(), {
      depth: opts.depth ?? 18,
    });

    for (let i = 0; i < moves.length; i++) {
      const fenBefore = game.fen();
      // Multipv-2 evaluation BEFORE the move is played.
      const lines = await this.evaluatePositionMultiPv(fenBefore, {
        depth: opts.depth ?? 14,
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
      const { evalCp: evalAfter } = await this.evaluatePosition(fenAfter, {
        depth: opts.depth ?? 18,
      });
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
