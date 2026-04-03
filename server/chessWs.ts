/* ═══════════════════════════════════════════════════════
   CHESS PVP WEBSOCKET SERVER — Real-time multiplayer chess
   Follows the same architecture as pvpWs.ts (card battle PvP).
   ELO-based matchmaking, spectator mode, time controls.
   ═══════════════════════════════════════════════════════ */
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { getDb } from "./db";
import { chessGames, chessRankings } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

/* ─── TYPES ─── */
interface ChessPlayer {
  ws: WebSocket;
  userId: number;
  userName: string;
  characterId: string;
  elo: number;
  matchId: string | null;
}

interface ActiveChessMatch {
  matchId: string;
  fen: string;
  pgn: string;
  moves: string[];  // SAN move history
  white: ChessPlayer;
  black: ChessPlayer;
  turn: "w" | "b";
  status: "active" | "checkmate" | "stalemate" | "draw" | "resigned" | "timeout";
  winnerId: number | null;
  spectators: Set<WebSocket>;
  turnTimeout: ReturnType<typeof setTimeout> | null;
  timeControl: number; // seconds per player
  whiteTimeMs: number;
  blackTimeMs: number;
  lastMoveTime: number; // timestamp of last move
  moveCount: number;
  dbId: number | null;
}

type ChessClientMessage =
  | { type: "JOIN_QUEUE"; userId: number; userName: string; characterId: string }
  | { type: "LEAVE_QUEUE" }
  | { type: "MOVE"; from: string; to: string; promotion?: string }
  | { type: "RESIGN" }
  | { type: "OFFER_DRAW" }
  | { type: "ACCEPT_DRAW" }
  | { type: "DECLINE_DRAW" }
  | { type: "SPECTATE"; matchId: string }
  | { type: "STOP_SPECTATING" }
  | { type: "PING" };

type ChessServerMessage =
  | { type: "QUEUE_JOINED"; position: number }
  | { type: "QUEUE_UPDATE"; position: number; playersInQueue: number }
  | { type: "MATCH_FOUND"; matchId: string; color: "white" | "black"; opponentName: string; opponentElo: number; opponentCharacter: string; timeControl: number }
  | { type: "GAME_STATE"; fen: string; lastMove: { from: string; to: string; san: string } | null; whiteTimeMs: number; blackTimeMs: number; turn: "w" | "b"; moveCount: number; isCheck: boolean }
  | { type: "GAME_OVER"; winner: "white" | "black" | "draw"; reason: string; eloChange: number; newElo: number }
  | { type: "DRAW_OFFERED" }
  | { type: "DRAW_DECLINED" }
  | { type: "OPPONENT_DISCONNECTED" }
  | { type: "MOVE_ERROR"; message: string }
  | { type: "SPECTATE_JOINED"; matchId: string; whiteName: string; blackName: string; whiteElo: number; blackElo: number; fen: string }
  | { type: "SPECTATE_UPDATE"; fen: string; lastMove: { from: string; to: string; san: string } | null; turn: "w" | "b"; moveCount: number }
  | { type: "SPECTATE_ENDED"; reason: string }
  | { type: "ACTIVE_MATCHES"; matches: Array<{ matchId: string; whiteName: string; blackName: string; whiteElo: number; blackElo: number; moveCount: number; spectatorCount: number }> }
  | { type: "ERROR"; message: string }
  | { type: "PONG" };

/* ─── CONSTANTS ─── */
const MATCHMAKING_INTERVAL_MS = 3000;
const DEFAULT_TIME_CONTROL = 600; // 10 minutes per side
const TURN_TIMEOUT_MS = 120_000; // 2 minutes per move maximum
const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/* ─── STATE ─── */
const matchmakingQueue: ChessPlayer[] = [];
const activeMatches = new Map<string, ActiveChessMatch>();
const playerConnections = new Map<number, ChessPlayer>();
const spectatorConnections = new Map<WebSocket, string>();

/* ─── CHESS.JS DYNAMIC IMPORT ─── */
let Chess: any;
const chessReady = import("chess.js").then(m => {
  Chess = m.Chess;
}).catch(() => {
  // Fallback: try default export
  return import("chess.js").then(m => { Chess = (m as any).default?.Chess || m.Chess; });
});

/* ─── HELPERS ─── */
function send(ws: WebSocket, msg: ChessServerMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

function calculateElo(playerElo: number, opponentElo: number, result: 1 | 0 | 0.5, k = 32): number {
  const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  return Math.round(k * (result - expected));
}

function getTier(elo: number): string {
  if (elo >= 2400) return "grandmaster";
  if (elo >= 2200) return "master";
  if (elo >= 2000) return "diamond";
  if (elo >= 1800) return "platinum";
  if (elo >= 1600) return "gold";
  if (elo >= 1400) return "silver";
  return "bronze";
}

/* ─── MATCHMAKING ─── */
function runMatchmaking() {
  if (matchmakingQueue.length < 2) return;

  // Sort by ELO and pair closest players
  matchmakingQueue.sort((a, b) => a.elo - b.elo);

  let bestPair: [number, number] | null = null;
  let bestDiff = Infinity;

  for (let i = 0; i < matchmakingQueue.length - 1; i++) {
    const diff = Math.abs(matchmakingQueue[i].elo - matchmakingQueue[i + 1].elo);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestPair = [i, i + 1];
    }
  }

  if (bestPair) {
    const [i, j] = bestPair;
    const p1 = matchmakingQueue[j]; // Remove higher index first
    const p2 = matchmakingQueue[i];
    matchmakingQueue.splice(j, 1);
    matchmakingQueue.splice(i, 1);
    startMatch(p1, p2);
  }
}

async function startMatch(p1: ChessPlayer, p2: ChessPlayer) {
  await chessReady;

  const matchId = randomUUID().slice(0, 12);

  // Randomly assign colors
  const isP1White = Math.random() < 0.5;
  const white = isP1White ? p1 : p2;
  const black = isP1White ? p2 : p1;

  const match: ActiveChessMatch = {
    matchId,
    fen: STARTING_FEN,
    pgn: "",
    moves: [],
    white,
    black,
    turn: "w",
    status: "active",
    winnerId: null,
    spectators: new Set(),
    turnTimeout: null,
    timeControl: DEFAULT_TIME_CONTROL,
    whiteTimeMs: DEFAULT_TIME_CONTROL * 1000,
    blackTimeMs: DEFAULT_TIME_CONTROL * 1000,
    lastMoveTime: Date.now(),
    moveCount: 0,
    dbId: null,
  };

  white.matchId = matchId;
  black.matchId = matchId;
  activeMatches.set(matchId, match);

  // Save to database
  try {
    const db = await getDb();
    if (db) {
      const result = await db.insert(chessGames).values({
        whitePlayerId: white.userId,
        blackPlayerId: black.userId,
        whiteCharacter: white.characterId,
        blackCharacter: black.characterId,
        mode: "pvp",
        aiDifficulty: 0,
        fen: STARTING_FEN,
        pgn: "",
        status: "active",
        timeControl: DEFAULT_TIME_CONTROL,
        whiteTimeMs: DEFAULT_TIME_CONTROL * 1000,
        blackTimeMs: DEFAULT_TIME_CONTROL * 1000,
        startedAt: new Date(),
      });
      match.dbId = Number(result[0].insertId);
    }
  } catch (e) {
    console.error("[ChessPvP] Failed to save match to DB:", e);
  }

  // Notify both players
  send(white.ws, {
    type: "MATCH_FOUND",
    matchId,
    color: "white",
    opponentName: black.userName,
    opponentElo: black.elo,
    opponentCharacter: black.characterId,
    timeControl: DEFAULT_TIME_CONTROL,
  });

  send(black.ws, {
    type: "MATCH_FOUND",
    matchId,
    color: "black",
    opponentName: white.userName,
    opponentElo: white.elo,
    opponentCharacter: white.characterId,
    timeControl: DEFAULT_TIME_CONTROL,
  });

  // Send initial game state
  const gameState: ChessServerMessage = {
    type: "GAME_STATE",
    fen: STARTING_FEN,
    lastMove: null,
    whiteTimeMs: match.whiteTimeMs,
    blackTimeMs: match.blackTimeMs,
    turn: "w",
    moveCount: 0,
    isCheck: false,
  };
  send(white.ws, gameState);
  send(black.ws, gameState);

  // Start turn timer
  startTurnTimer(match);
}

function startTurnTimer(match: ActiveChessMatch) {
  if (match.turnTimeout) clearTimeout(match.turnTimeout);

  match.turnTimeout = setTimeout(() => {
    // Time out: current player loses
    const loserId = match.turn === "w" ? match.white.userId : match.black.userId;
    const winnerId = match.turn === "w" ? match.black.userId : match.white.userId;
    endMatch(match, winnerId, "timeout");
  }, TURN_TIMEOUT_MS);
}

/* ─── MOVE HANDLING ─── */
async function handleMove(
  player: ChessPlayer,
  match: ActiveChessMatch,
  from: string, to: string, promotion?: string,
) {
  await chessReady;

  // Verify it's this player's turn
  const isWhite = player.userId === match.white.userId;
  if ((match.turn === "w" && !isWhite) || (match.turn === "b" && isWhite)) {
    send(player.ws, { type: "MOVE_ERROR", message: "Not your turn" });
    return;
  }

  // Validate move using chess.js
  const chess = new Chess(match.fen);
  const moveResult = chess.move({ from, to, promotion });

  if (!moveResult) {
    send(player.ws, { type: "MOVE_ERROR", message: "Invalid move" });
    return;
  }

  // Update time
  const now = Date.now();
  const elapsed = now - match.lastMoveTime;
  if (match.turn === "w") {
    match.whiteTimeMs = Math.max(0, match.whiteTimeMs - elapsed);
  } else {
    match.blackTimeMs = Math.max(0, match.blackTimeMs - elapsed);
  }
  match.lastMoveTime = now;

  // Update match state
  match.fen = chess.fen();
  match.pgn = chess.pgn();
  match.moves.push(moveResult.san);
  match.turn = chess.turn() as "w" | "b";
  match.moveCount = chess.history().length;

  // Check for game end
  if (chess.isCheckmate()) {
    const winnerId = player.userId;
    endMatch(match, winnerId, "checkmate");
    return;
  }
  if (chess.isStalemate()) {
    endMatch(match, null, "stalemate");
    return;
  }
  if (chess.isDraw()) {
    endMatch(match, null, "draw");
    return;
  }

  // Check time forfeit
  if (match.whiteTimeMs <= 0) {
    endMatch(match, match.black.userId, "timeout");
    return;
  }
  if (match.blackTimeMs <= 0) {
    endMatch(match, match.white.userId, "timeout");
    return;
  }

  // Send updated state to both players
  const gameState: ChessServerMessage = {
    type: "GAME_STATE",
    fen: match.fen,
    lastMove: { from: moveResult.from, to: moveResult.to, san: moveResult.san },
    whiteTimeMs: match.whiteTimeMs,
    blackTimeMs: match.blackTimeMs,
    turn: match.turn,
    moveCount: match.moveCount,
    isCheck: chess.isCheck(),
  };
  send(match.white.ws, gameState);
  send(match.black.ws, gameState);

  // Notify spectators
  for (const spec of match.spectators) {
    send(spec, {
      type: "SPECTATE_UPDATE",
      fen: match.fen,
      lastMove: { from: moveResult.from, to: moveResult.to, san: moveResult.san },
      turn: match.turn,
      moveCount: match.moveCount,
    });
  }

  // Restart turn timer
  startTurnTimer(match);
}

/* ─── MATCH END ─── */
async function endMatch(match: ActiveChessMatch, winnerId: number | null, reason: string) {
  match.status = reason as any;
  match.winnerId = winnerId;

  if (match.turnTimeout) {
    clearTimeout(match.turnTimeout);
    match.turnTimeout = null;
  }

  // Calculate ELO changes
  const whiteResult = winnerId === match.white.userId ? 1 : winnerId === null ? 0.5 : 0;
  const whiteEloChange = calculateElo(match.white.elo, match.black.elo, whiteResult as 1 | 0 | 0.5);
  const blackEloChange = calculateElo(match.black.elo, match.white.elo, (1 - whiteResult) as 1 | 0 | 0.5);

  // Notify players
  const winnerColor = winnerId === match.white.userId ? "white" : winnerId === match.black.userId ? "black" : "draw";

  send(match.white.ws, {
    type: "GAME_OVER",
    winner: winnerColor,
    reason,
    eloChange: whiteEloChange,
    newElo: match.white.elo + whiteEloChange,
  });

  send(match.black.ws, {
    type: "GAME_OVER",
    winner: winnerColor,
    reason,
    eloChange: blackEloChange,
    newElo: match.black.elo + blackEloChange,
  });

  // Notify spectators
  for (const spec of match.spectators) {
    send(spec, { type: "SPECTATE_ENDED", reason: `Game over: ${reason}` });
  }

  // Update database
  try {
    const db = await getDb();
    if (db && match.dbId) {
      await db.update(chessGames)
        .set({
          fen: match.fen,
          pgn: match.pgn,
          status: match.status as any,
          moveCount: match.moveCount,
          winnerId: winnerId,
          whiteEloChange,
          blackEloChange: blackEloChange,
          whiteTimeMs: match.whiteTimeMs,
          blackTimeMs: match.blackTimeMs,
          endedAt: new Date(),
        })
        .where(eq(chessGames.id, match.dbId));

      // Update both players' rankings
      for (const [player, eloChange] of [[match.white, whiteEloChange], [match.black, blackEloChange]] as const) {
        const r = await db.select().from(chessRankings)
          .where(eq(chessRankings.userId, player.userId)).limit(1);
        if (r[0]) {
          const newElo = Math.max(100, r[0].elo + eloChange);
          const won = winnerId === player.userId;
          await db.update(chessRankings).set({
            elo: newElo,
            peakElo: Math.max(r[0].peakElo, newElo),
            tier: getTier(newElo) as any,
            gamesPlayed: r[0].gamesPlayed + 1,
            wins: won ? r[0].wins + 1 : r[0].wins,
            losses: !won && winnerId !== null ? r[0].losses + 1 : r[0].losses,
            draws: winnerId === null ? r[0].draws + 1 : r[0].draws,
            winStreak: won ? r[0].winStreak + 1 : 0,
            bestWinStreak: Math.max(r[0].bestWinStreak, won ? r[0].winStreak + 1 : 0),
          }).where(eq(chessRankings.userId, player.userId));
        }
      }
    }
  } catch (e) {
    console.error("[ChessPvP] Failed to update DB:", e);
  }

  // Cleanup
  match.white.matchId = null;
  match.black.matchId = null;
  activeMatches.delete(match.matchId);
}

/* ─── WEBSOCKET SERVER SETUP ─── */
export function setupChessPvpWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  // Handle upgrade for /api/chess-pvp path
  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/api/chess-pvp") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", async (data) => {
      try {
        const msg: ChessClientMessage = JSON.parse(data.toString());

        switch (msg.type) {
          case "PING":
            send(ws, { type: "PONG" });
            break;

          case "JOIN_QUEUE": {
            // Prevent duplicate connections
            if (playerConnections.has(msg.userId)) {
              const existing = playerConnections.get(msg.userId)!;
              send(existing.ws, { type: "ERROR", message: "Connected from another session" });
              existing.ws.close();
              playerConnections.delete(msg.userId);
            }

            // Get player ELO
            let elo = 1200;
            try {
              const db = await getDb();
              if (db) {
                const r = await db.select().from(chessRankings)
                  .where(eq(chessRankings.userId, msg.userId)).limit(1);
                if (r[0]) elo = r[0].elo;
              }
            } catch (e) { /* use default */ }

            const player: ChessPlayer = {
              ws,
              userId: msg.userId,
              userName: msg.userName,
              characterId: msg.characterId,
              elo,
              matchId: null,
            };
            playerConnections.set(msg.userId, player);
            matchmakingQueue.push(player);

            send(ws, { type: "QUEUE_JOINED", position: matchmakingQueue.length });

            // Notify all in queue
            matchmakingQueue.forEach((p, i) => {
              send(p.ws, { type: "QUEUE_UPDATE", position: i + 1, playersInQueue: matchmakingQueue.length });
            });
            break;
          }

          case "LEAVE_QUEUE": {
            const player = [...playerConnections.values()].find(p => p.ws === ws);
            if (player) {
              const idx = matchmakingQueue.indexOf(player);
              if (idx >= 0) matchmakingQueue.splice(idx, 1);
              playerConnections.delete(player.userId);
            }
            break;
          }

          case "MOVE": {
            const player = [...playerConnections.values()].find(p => p.ws === ws);
            if (!player?.matchId) {
              send(ws, { type: "MOVE_ERROR", message: "Not in a game" });
              break;
            }
            const match = activeMatches.get(player.matchId);
            if (!match) {
              send(ws, { type: "MOVE_ERROR", message: "Match not found" });
              break;
            }
            await handleMove(player, match, msg.from, msg.to, msg.promotion);
            break;
          }

          case "RESIGN": {
            const player = [...playerConnections.values()].find(p => p.ws === ws);
            if (!player?.matchId) break;
            const match = activeMatches.get(player.matchId);
            if (!match) break;
            const winnerId = player.userId === match.white.userId
              ? match.black.userId : match.white.userId;
            await endMatch(match, winnerId, "resigned");
            break;
          }

          case "OFFER_DRAW": {
            const player = [...playerConnections.values()].find(p => p.ws === ws);
            if (!player?.matchId) break;
            const match = activeMatches.get(player.matchId);
            if (!match) break;
            const opponent = player.userId === match.white.userId ? match.black : match.white;
            send(opponent.ws, { type: "DRAW_OFFERED" });
            break;
          }

          case "ACCEPT_DRAW": {
            const player = [...playerConnections.values()].find(p => p.ws === ws);
            if (!player?.matchId) break;
            const match = activeMatches.get(player.matchId);
            if (!match) break;
            await endMatch(match, null, "draw");
            break;
          }

          case "DECLINE_DRAW": {
            const player = [...playerConnections.values()].find(p => p.ws === ws);
            if (!player?.matchId) break;
            const match = activeMatches.get(player.matchId);
            if (!match) break;
            const opponent = player.userId === match.white.userId ? match.black : match.white;
            send(opponent.ws, { type: "DRAW_DECLINED" });
            break;
          }

          case "SPECTATE": {
            const match = activeMatches.get(msg.matchId);
            if (!match) {
              send(ws, { type: "ERROR", message: "Match not found" });
              break;
            }
            match.spectators.add(ws);
            spectatorConnections.set(ws, msg.matchId);
            send(ws, {
              type: "SPECTATE_JOINED",
              matchId: msg.matchId,
              whiteName: match.white.userName,
              blackName: match.black.userName,
              whiteElo: match.white.elo,
              blackElo: match.black.elo,
              fen: match.fen,
            });
            break;
          }

          case "STOP_SPECTATING": {
            const specMatchId = spectatorConnections.get(ws);
            if (specMatchId) {
              const match = activeMatches.get(specMatchId);
              match?.spectators.delete(ws);
              spectatorConnections.delete(ws);
            }
            break;
          }
        }
      } catch (e) {
        console.error("[ChessPvP] Message error:", e);
        send(ws, { type: "ERROR", message: "Invalid message" });
      }
    });

    ws.on("close", () => {
      // Handle disconnection
      const player = [...playerConnections.values()].find(p => p.ws === ws);
      if (player) {
        // Remove from queue
        const idx = matchmakingQueue.indexOf(player);
        if (idx >= 0) matchmakingQueue.splice(idx, 1);

        // Handle in-match disconnect
        if (player.matchId) {
          const match = activeMatches.get(player.matchId);
          if (match && match.status === "active") {
            const opponent = player.userId === match.white.userId ? match.black : match.white;
            send(opponent.ws, { type: "OPPONENT_DISCONNECTED" });
            // Give 30 seconds to reconnect, then forfeit
            setTimeout(() => {
              if (match.status === "active" && !playerConnections.has(player.userId)) {
                const winnerId = opponent.userId;
                endMatch(match, winnerId, "disconnect");
              }
            }, 30_000);
          }
        }

        playerConnections.delete(player.userId);
      }

      // Handle spectator disconnect
      const specMatchId = spectatorConnections.get(ws);
      if (specMatchId) {
        const match = activeMatches.get(specMatchId);
        match?.spectators.delete(ws);
        spectatorConnections.delete(ws);
      }
    });
  });

  // Run matchmaking every 3 seconds
  setInterval(runMatchmaking, MATCHMAKING_INTERVAL_MS);

  console.log("[ChessPvP] WebSocket server ready on /api/chess-pvp");
}
