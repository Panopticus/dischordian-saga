/* ═══════════════════════════════════════════════════════
   CHESS LICHESS PORT — Tests
   Tests for Stockfish integration, multiplayer server,
   and ChessPage component structure.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/* ─── STOCKFISH WORKER MODULE ─── */
describe("Stockfish Worker Module", () => {
  const workerPath = path.resolve(__dirname, "../client/src/lib/stockfishWorker.ts");
  const workerContent = fs.readFileSync(workerPath, "utf-8");

  it("exports StockfishEngine class", () => {
    expect(workerContent).toContain("export class StockfishEngine");
  });

  it("exports AI_PRESETS with Dischordian Saga characters", () => {
    expect(workerContent).toContain("export const AI_PRESETS");
    // Neyons (beginner tier)
    expect(workerContent).toContain("neyon_spark");
    expect(workerContent).toContain("neyon_echo");
    expect(workerContent).toContain("neyon_flux");
    // Archons (advanced tier)
    expect(workerContent).toContain("archon_sentinel");
    expect(workerContent).toContain("archon_warden");
    expect(workerContent).toContain("archon_sovereign");
    // The Architect (grandmaster)
    expect(workerContent).toContain("the_architect");
  });

  it("has correct difficulty scaling for AI tiers", () => {
    // Neyons should have low depth/skill
    const neyonSparkMatch = workerContent.match(/neyon_spark:\s*\{[^}]*depth:\s*(\d+)/);
    const architectMatch = workerContent.match(/the_architect:\s*\{[^}]*depth:\s*(\d+)/);
    expect(neyonSparkMatch).toBeTruthy();
    expect(architectMatch).toBeTruthy();
    const neyonDepth = parseInt(neyonSparkMatch![1]);
    const architectDepth = parseInt(architectMatch![1]);
    expect(neyonDepth).toBeLessThan(architectDepth);
    expect(neyonDepth).toBeLessThanOrEqual(5);
    expect(architectDepth).toBeGreaterThanOrEqual(18);
  });

  it("has correct skill levels for AI tiers", () => {
    const neyonSparkSkill = workerContent.match(/neyon_spark:\s*\{[^}]*skillLevel:\s*(\d+)/);
    const architectSkill = workerContent.match(/the_architect:\s*\{[^}]*skillLevel:\s*(\d+)/);
    expect(neyonSparkSkill).toBeTruthy();
    expect(architectSkill).toBeTruthy();
    expect(parseInt(neyonSparkSkill![1])).toBeLessThanOrEqual(5);
    expect(parseInt(architectSkill![1])).toBe(20); // Maximum skill
  });

  it("uses CDN URL for Stockfish WASM", () => {
    expect(workerContent).toContain("cloudfront.net");
    expect(workerContent).toContain("stockfish");
  });

  it("implements UCI protocol commands", () => {
    expect(workerContent).toContain('"uci"');
    expect(workerContent).toContain('"ucinewgame"');
    expect(workerContent).toContain('"isready"');
    expect(workerContent).toContain("position fen");
    expect(workerContent).toContain("bestmove");
  });

  it("exports singleton getter and destroyer", () => {
    expect(workerContent).toContain("export function getStockfishEngine");
    expect(workerContent).toContain("export function destroyStockfishEngine");
  });

  it("parses evaluation from info lines", () => {
    expect(workerContent).toContain("score cp");
    expect(workerContent).toContain("score mate");
  });

  it("has quick play presets", () => {
    expect(workerContent).toContain("easy:");
    expect(workerContent).toContain("medium:");
    expect(workerContent).toContain("hard:");
    expect(workerContent).toContain("maximum:");
  });
});

/* ─── USE STOCKFISH HOOK ─── */
describe("useStockfish Hook", () => {
  const hookPath = path.resolve(__dirname, "../client/src/hooks/useStockfish.ts");
  const hookContent = fs.readFileSync(hookPath, "utf-8");

  it("exports useStockfish function", () => {
    expect(hookContent).toContain("export function useStockfish");
  });

  it("returns isReady, isThinking, evaluation, getBestMove, configure, newGame", () => {
    expect(hookContent).toContain("isReady");
    expect(hookContent).toContain("isThinking");
    expect(hookContent).toContain("evaluation");
    expect(hookContent).toContain("getBestMove");
    expect(hookContent).toContain("configure");
    expect(hookContent).toContain("newGame");
  });

  it("imports from stockfishWorker", () => {
    expect(hookContent).toContain("from \"@/lib/stockfishWorker\"");
  });

  it("uses singleton engine pattern", () => {
    expect(hookContent).toContain("getStockfishEngine");
  });
});

/* ─── CHESS MULTIPLAYER SERVER ─── */
describe("Chess Multiplayer Server", () => {
  const serverPath = path.resolve(__dirname, "chessMultiplayer.ts");
  const serverContent = fs.readFileSync(serverPath, "utf-8");

  it("exports registerChessMultiplayer function", () => {
    expect(serverContent).toContain("export function registerChessMultiplayer");
  });

  it("uses Socket.IO server", () => {
    expect(serverContent).toContain("import { Server as SocketServer } from \"socket.io\"");
  });

  it("listens on /api/chess-ws path", () => {
    expect(serverContent).toContain("/api/chess-ws");
  });

  it("handles authentication", () => {
    expect(serverContent).toContain("socket.on(\"auth\"");
    expect(serverContent).toContain("auth:ok");
  });

  it("handles matchmaking (seek)", () => {
    expect(serverContent).toContain("socket.on(\"seek\"");
    expect(serverContent).toContain("matchmakingQueue");
  });

  it("handles move relay", () => {
    expect(serverContent).toContain("socket.on(\"move\"");
  });

  it("handles game resignation", () => {
    expect(serverContent).toContain("socket.on(\"resign\"");
  });

  it("handles draw offers", () => {
    expect(serverContent).toContain("socket.on(\"draw:offer\"");
    expect(serverContent).toContain("socket.on(\"draw:accept\"");
  });

  it("handles spectating", () => {
    expect(serverContent).toContain("socket.on(\"spectate\"");
  });

  it("supports time controls (bullet, blitz, rapid, classical)", () => {
    expect(serverContent).toContain("bullet");
    expect(serverContent).toContain("blitz");
    expect(serverContent).toContain("rapid");
    expect(serverContent).toContain("classical");
  });

  it("uses chess.js for move validation", () => {
    expect(serverContent).toContain("import { Chess } from \"chess.js\"");
  });

  it("tracks game time with increment", () => {
    expect(serverContent).toContain("whiteTime");
    expect(serverContent).toContain("blackTime");
    expect(serverContent).toContain("increment");
  });

  it("handles disconnection cleanup", () => {
    expect(serverContent).toContain("socket.on(\"disconnect\"");
  });
});

/* ─── CHESS PAGE COMPONENT ─── */
describe("ChessPage Component", () => {
  const pagePath = path.resolve(__dirname, "../client/src/pages/ChessPage.tsx");
  const pageContent = fs.readFileSync(pagePath, "utf-8");

  it("imports useStockfish hook", () => {
    expect(pageContent).toContain("useStockfish");
  });

  it("imports Chessboard from react-chessboard", () => {
    expect(pageContent).toContain("from \"react-chessboard\"");
  });

  it("has AI tier selection (Neyons, Archons, Architect)", () => {
    expect(pageContent).toContain("Neyon");
    expect(pageContent).toContain("Archon");
    expect(pageContent).toContain("Architect");
  });

  it("has multiplayer mode option", () => {
    expect(pageContent).toContain("multiplayer") || expect(pageContent).toContain("Multiplayer");
  });

  it("has evaluation bar display", () => {
    expect(pageContent).toContain("evaluation");
  });

  it("uses Stockfish for AI moves", () => {
    expect(pageContent).toContain("getBestMove");
  });

  it("handles game state (active, checkmate, draw, stalemate)", () => {
    expect(pageContent).toContain("checkmate");
    expect(pageContent).toContain("draw");
    expect(pageContent).toContain("stalemate");
  });

  it("preserves existing arena theming system", () => {
    expect(pageContent).toContain("arena");
    expect(pageContent).toContain("darkSquare");
    expect(pageContent).toContain("lightSquare");
  });

  it("preserves ELO and rewards integration", () => {
    expect(pageContent).toContain("elo");
    expect(pageContent).toContain("rewards");
  });
});

/* ─── CHESS MULTIPLAYER HOOK ─── */
describe("useChessMultiplayer Hook", () => {
  const hookPath = path.resolve(__dirname, "../client/src/hooks/useChessMultiplayer.ts");
  const hookContent = fs.readFileSync(hookPath, "utf-8");

  it("exports useChessMultiplayer function", () => {
    expect(hookContent).toContain("export function useChessMultiplayer");
  });

  it("uses socket.io-client", () => {
    expect(hookContent).toContain("socket.io-client");
  });

  it("connects to /api/chess-ws path", () => {
    expect(hookContent).toContain("/api/chess-ws");
  });

  it("handles seek, move, resign, draw events", () => {
    expect(hookContent).toContain("seek");
    expect(hookContent).toContain("move");
    expect(hookContent).toContain("resign");
    expect(hookContent).toContain("draw");
  });

  it("tracks connection state", () => {
    expect(hookContent).toContain("connected") || expect(hookContent).toContain("isConnected");
  });
});

/* ─── SERVER REGISTRATION ─── */
describe("Server Registration", () => {
  const indexPath = path.resolve(__dirname, "_core/index.ts");
  const indexContent = fs.readFileSync(indexPath, "utf-8");

  it("imports registerChessMultiplayer", () => {
    expect(indexContent).toContain("import { registerChessMultiplayer } from \"../chessMultiplayer\"");
  });

  it("calls registerChessMultiplayer with server", () => {
    expect(indexContent).toContain("registerChessMultiplayer(server)");
  });
});

/* ─── CHESS BOARD COMPONENT ─── */
describe("ChessBoard Component", () => {
  const boardPath = path.resolve(__dirname, "../client/src/components/ChessBoard.tsx");
  
  it("exists as a component file", () => {
    expect(fs.existsSync(boardPath)).toBe(true);
  });

  it("uses chessground library", () => {
    const content = fs.readFileSync(boardPath, "utf-8");
    expect(content).toContain("chessground");
  });
});

/* ─── CHESS CSS STYLES ─── */
describe("Chess CSS Styles", () => {
  const cssPath = path.resolve(__dirname, "../client/src/styles/chess.css");
  
  it("exists as a style file", () => {
    expect(fs.existsSync(cssPath)).toBe(true);
  });

  it("contains Dischordian Saga theming", () => {
    const content = fs.readFileSync(cssPath, "utf-8");
    // Should have custom board colors
    expect(content).toContain("cg-board");
  });
});
