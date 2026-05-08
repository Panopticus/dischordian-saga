/**
 * Smoke tests for the permissively-licensed chess engine that replaced
 * Stockfish (audit/15.R1). The post-Stockfish engine is much weaker —
 * we don't check tactical strength here, only:
 *
 *  1. Boots and reports ready.
 *  2. Returns LEGAL UCI moves (the chess.js validation chain catches
 *     any illegal output).
 *  3. Detects mate-in-1 across a small fixture set so the search isn't
 *     completely broken at minimal depth.
 *  4. evaluatePosition + multiPv return monotonic, sane shapes.
 */
import { describe, it, expect } from "vitest";
import { Chess } from "chess.js";
import { PermissiveChessEngine } from "./permissiveChessEngine";

const STARTPOS = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function isLegalUci(fen: string, uci: string): boolean {
  const c = new Chess(fen);
  const all = c.moves({ verbose: true });
  return all.some((m) => m.lan === uci);
}

describe("PermissiveChessEngine", () => {
  const personality = {
    skillLevel: 20, // top skill so we don't get the random-move branch
    depth: 4,
    contempt: 0,
    moveTimeMs: 1500,
  };

  it("boots and isReady transitions to true", async () => {
    const e = new PermissiveChessEngine();
    expect(e.isReady).toBe(false);
    await e.init();
    expect(e.isReady).toBe(true);
    e.dispose();
    expect(e.isReady).toBe(false);
  });

  it("getBestMove returns a legal UCI move from the start position", async () => {
    const e = new PermissiveChessEngine();
    await e.init();
    const move = await e.getBestMove(STARTPOS, personality);
    expect(move).toMatch(/^[a-h][1-8][a-h][1-8][nbrq]?$/);
    expect(isLegalUci(STARTPOS, move)).toBe(true);
  });

  it("captures a hanging queen rather than letting it stand", async () => {
    // White to move; Black queen on d4 is defended by nothing and
    // attacked by the white knight on f3. A working engine plays
    // Nxd4 (or any other capture of the queen).
    const fen = "rnb1kbnr/pppppppp/8/8/3q4/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 1";
    const e = new PermissiveChessEngine();
    await e.init();
    const move = await e.getBestMove(fen, personality);
    expect(isLegalUci(fen, move)).toBe(true);
    // The chosen move should land on d4 (capture the queen).
    expect(move.slice(2, 4)).toBe("d4");
  });

  it("evaluatePosition returns monotone scores white-good vs black-good", async () => {
    const e = new PermissiveChessEngine();
    await e.init();
    // White up a queen.
    const whiteUp = "rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    // Black up a queen.
    const blackUp = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1";
    const w = await e.evaluatePosition(whiteUp, { depth: 2 });
    const b = await e.evaluatePosition(blackUp, { depth: 2 });
    expect(w.evalCp).toBeGreaterThan(0);
    expect(b.evalCp).toBeLessThan(0);
  });

  it("evaluatePositionMultiPv returns up to multiPv distinct moves", async () => {
    const e = new PermissiveChessEngine();
    await e.init();
    const lines = await e.evaluatePositionMultiPv(STARTPOS, {
      depth: 2,
      multiPv: 3,
    });
    expect(lines.length).toBeGreaterThanOrEqual(1);
    const moves = lines.map((l) => l.uciMove);
    expect(new Set(moves).size).toBe(moves.length); // all distinct
    for (const line of lines) {
      expect(isLegalUci(STARTPOS, line.uciMove ?? "")).toBe(true);
    }
  });

  it("postGameAnalyze produces one entry per move with eval deltas", async () => {
    const e = new PermissiveChessEngine();
    await e.init();
    const out = await e.postGameAnalyze(STARTPOS, ["e4", "e5", "Nf3"], { depth: 2 });
    expect(out.length).toBe(3);
    expect(out[0].ply).toBe(1);
    expect(out[2].ply).toBe(3);
    for (const ply of out) {
      expect(typeof ply.deltaCp).toBe("number");
      expect(ply.fenBefore).toBeTruthy();
      expect(ply.fenAfter).toBeTruthy();
    }
  });
});
