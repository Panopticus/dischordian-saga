/* ═══════════════════════════════════════════════════════
   CHESS ENGINE — UCI-style facade
   Originally Stockfish (GPL-3.0); audit/15.R1 swapped to a
   permissively-licensed pure-TS engine. Class names + methods
   preserved so callers don't change.
   ═══════════════════════════════════════════════════════ */

import { PermissiveChessEngine } from "./permissiveChessEngine";

export interface StockfishConfig {
  depth: number; // Search depth (1-25)
  skillLevel: number; // Skill 0-20 (0 = weakest)
  moveTime?: number; // Max time per move in ms
  threads?: number; // Number of threads (1 for single)
  contempt?: number; // Contempt factor (-100 to 100)
}

/** AI personality presets for Dischordian Saga characters. The depth
 *  ceiling is now ~6 (pure-TS engine performance) but the skill curve
 *  + contempt + moveTime values still differentiate characters. */
export const AI_PRESETS: Record<string, StockfishConfig> = {
  // ─── THE NEYONS (Beginner/Intermediate) ───
  neyon_spark: { depth: 3, skillLevel: 2, moveTime: 500, contempt: 0 },
  neyon_echo: { depth: 5, skillLevel: 5, moveTime: 800, contempt: 0 },
  neyon_flux: { depth: 6, skillLevel: 8, moveTime: 1000, contempt: 10 },

  // ─── THE ARCHONS (Advanced) ───
  archon_sentinel: { depth: 6, skillLevel: 12, moveTime: 2000, contempt: 20 },
  archon_warden: { depth: 6, skillLevel: 14, moveTime: 3000, contempt: 30 },
  archon_sovereign: { depth: 6, skillLevel: 16, moveTime: 4000, contempt: 40 },

  // ─── THE ARCHITECT (max permissive-engine strength) ───
  the_architect: { depth: 6, skillLevel: 20, moveTime: 5000, contempt: 50 },

  // ─── Quick play presets ───
  easy: { depth: 3, skillLevel: 1, moveTime: 300 },
  medium: { depth: 5, skillLevel: 10, moveTime: 1500 },
  hard: { depth: 6, skillLevel: 16, moveTime: 3000 },
  maximum: { depth: 6, skillLevel: 20, moveTime: 8000 },
};

/**
 * StockfishEngine — name preserved for caller compatibility. Backed
 * by the permissive pure-TS engine; the previous CDN-loaded WASM
 * Worker bring-up is now a no-op (the search runs in the request
 * thread, bounded by config.moveTime).
 */
export class StockfishEngine {
  private engine = new PermissiveChessEngine();
  private currentConfig: StockfishConfig = AI_PRESETS.medium;

  constructor() {
    // Boot is synchronous now; preserve a microtask boundary so the
    // existing `await engine.waitReady()` calls keep working.
    void this.engine.init();
  }

  async waitReady(): Promise<void> {
    if (!this.engine.isReady) await this.engine.init();
  }

  configure(config: StockfishConfig) {
    this.currentConfig = config;
  }

  setPosition(_fen?: string, _moves?: string[]) {
    // The pure-TS engine takes FEN per call; setPosition is a no-op
    // here. The next getBestMove / evaluatePosition supplies the FEN
    // directly (matches existing call patterns in chess.ts /
    // ChessPostGameReview / mind-game eval).
  }

  async getBestMove(
    fen: string,
  ): Promise<{ bestMove: string; evaluation?: number; ponder?: string }> {
    await this.waitReady();
    const cfg = this.currentConfig;
    const move = await this.engine.getBestMove(fen, {
      skillLevel: cfg.skillLevel,
      depth: cfg.depth,
      contempt: cfg.contempt ?? 0,
      moveTimeMs: cfg.moveTime ?? 1500,
    });
    // Provide an evaluation for callers that expect the second field
    // (previously parsed from Stockfish's `info score cp` lines).
    const { evalCp } = await this.engine.evaluatePosition(fen, {
      depth: Math.min(4, cfg.depth),
      moveTime: 600,
    });
    return { bestMove: move, evaluation: evalCp / 100 };
  }

  stop() {
    // Permissive engine has no streaming search; nothing to stop.
  }

  async evaluatePosition(
    fen: string,
    opts: { depth?: number; moveTime?: number } = {},
  ) {
    await this.waitReady();
    return this.engine.evaluatePosition(fen, opts);
  }

  async evaluatePositionMultiPv(
    fen: string,
    opts: { depth?: number; multiPv?: number; moveTime?: number } = {},
  ) {
    await this.waitReady();
    return this.engine.evaluatePositionMultiPv(fen, opts);
  }

  async postGameAnalyze(
    startFen: string,
    moves: readonly string[],
    opts: { depth?: number; onProgress?: (ply: number) => void } = {},
  ) {
    await this.waitReady();
    return this.engine.postGameAnalyze(startFen, moves, opts);
  }

  async postGameAnalyzeWithBrilliancies(
    startFen: string,
    moves: readonly string[],
    opts: { depth?: number; onProgress?: (ply: number) => void } = {},
  ) {
    await this.waitReady();
    return this.engine.postGameAnalyzeWithBrilliancies(startFen, moves, opts);
  }

  newGame() {
    // No persistent state in the permissive engine.
  }

  destroy() {
    this.engine.dispose();
  }

  isReady(): boolean {
    return this.engine.isReady;
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
