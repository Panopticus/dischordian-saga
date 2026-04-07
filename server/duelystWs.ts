/* ═══════════════════════════════════════════════════════
   DUELYST MULTIPLAYER WEBSOCKET SERVER
   Real-time PvP for the Dischordia tactical card game.
   Follows the same architecture as pvpWs.ts.

   Protocol:
   Client → Server: JOIN_QUEUE, GAME_ACTION, SURRENDER, PING
   Server → Client: QUEUE_JOINED, MATCH_FOUND, GAME_STATE,
                     OPPONENT_DISCONNECTED, MATCH_RESULT, PONG
   ═══════════════════════════════════════════════════════ */
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { checkWsRateLimit, sendRateLimitError, storeDisconnectedSession, recoverSession } from "./wsRateLimit";
import { duelystClientMessageSchema } from "./wsSchemas";

/* ─── TYPES ─── */

interface DuelystPlayer {
  ws: WebSocket;
  userId: number;
  userName: string;
  faction: string;
  deckCardIds: string[];
  elo: number;
  matchId: string | null;
}

interface DuelystMatch {
  matchId: string;
  player1: DuelystPlayer;
  player2: DuelystPlayer;
  /** Serialized game state from the Duelyst engine */
  gameState: unknown;
  turnTimeout: ReturnType<typeof setTimeout> | null;
  startedAt: number;
}

type ClientMessage =
  | { type: "JOIN_QUEUE"; userId: number; userName: string; faction: string; deckCardIds: string[] }
  | { type: "LEAVE_QUEUE" }
  | { type: "GAME_ACTION"; action: unknown }
  | { type: "SURRENDER" }
  | { type: "PING" };

type ServerMessage =
  | { type: "QUEUE_JOINED"; position: number }
  | { type: "QUEUE_UPDATE"; position: number; playersInQueue: number }
  | { type: "MATCH_FOUND"; matchId: string; opponentName: string; opponentFaction: string; yourSide: 0 | 1 }
  | { type: "GAME_STATE"; state: unknown; isYourTurn: boolean }
  | { type: "OPPONENT_DISCONNECTED" }
  | { type: "MATCH_RESULT"; result: "win" | "loss" | "draw"; eloChange: number }
  | { type: "ERROR"; message: string }
  | { type: "PONG" };

/* ─── STATE ─── */
const queue: DuelystPlayer[] = [];
const activeMatches = new Map<string, DuelystMatch>();
const playerConnections = new Map<number, DuelystPlayer>();

const TURN_TIMEOUT_MS = 90_000; // 90 seconds per turn
const MATCHMAKING_INTERVAL_MS = 3000;

/* ─── HELPERS ─── */
function send(ws: WebSocket, msg: ServerMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

function generateMatchId(): string {
  return `duel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ─── MATCHMAKING ─── */
function tryMatchPlayers() {
  if (queue.length < 2) return;

  // Simple FIFO matching (can be upgraded to ELO-based later)
  const p1 = queue.shift()!;
  const p2 = queue.shift()!;

  const matchId = generateMatchId();
  p1.matchId = matchId;
  p2.matchId = matchId;

  // Initialize game state using the Duelyst engine
  // The engine runs server-side for authoritative state
  let gameState: unknown;
  try {
    // Dynamic import to avoid circular dependency issues
    // Engine is in shared/ so it's available server-side
    const { createGameState } = require("../shared/duelyst-engine-stub");
    gameState = createGameState(p1.faction, p2.faction, p1.deckCardIds, p2.deckCardIds);
  } catch {
    // Fallback: create minimal placeholder state
    gameState = {
      turn: 0,
      activePlayer: 0,
      players: [
        { userId: p1.userId, faction: p1.faction, hp: 25, mana: 2 },
        { userId: p2.userId, faction: p2.faction, hp: 25, mana: 2 },
      ],
      board: Array(45).fill(null), // 9x5 grid
      status: "active",
    };
  }

  const match: DuelystMatch = {
    matchId,
    player1: p1,
    player2: p2,
    gameState,
    turnTimeout: null,
    startedAt: Date.now(),
  };

  activeMatches.set(matchId, match);

  send(p1.ws, { type: "MATCH_FOUND", matchId, opponentName: p2.userName, opponentFaction: p2.faction, yourSide: 0 });
  send(p2.ws, { type: "MATCH_FOUND", matchId, opponentName: p1.userName, opponentFaction: p1.faction, yourSide: 1 });

  // Send initial game state to both players
  send(p1.ws, { type: "GAME_STATE", state: gameState, isYourTurn: true });
  send(p2.ws, { type: "GAME_STATE", state: gameState, isYourTurn: false });

  console.log(`[Duelyst] Match started: ${p1.userName} (${p1.faction}) vs ${p2.userName} (${p2.faction})`);
}

function handleDisconnect(player: DuelystPlayer) {
  const qIdx = queue.findIndex(p => p.userId === player.userId);
  if (qIdx !== -1) queue.splice(qIdx, 1);

  if (player.matchId) {
    const match = activeMatches.get(player.matchId);
    if (match) {
      const opponent = match.player1.userId === player.userId ? match.player2 : match.player1;
      send(opponent.ws, { type: "OPPONENT_DISCONNECTED" });

      storeDisconnectedSession(player.userId, player.matchId, {
        side: match.player1.userId === player.userId ? 0 : 1,
        faction: player.faction,
      });

      // 30s grace period before forfeit
      setTimeout(() => {
        if (playerConnections.has(player.userId)) return; // Reconnected
        endMatch(match, opponent.userId === match.player1.userId ? 0 : 1, "disconnect");
      }, 30_000);
    }
  }

  playerConnections.delete(player.userId);
}

function endMatch(match: DuelystMatch, winnerSide: 0 | 1, reason: string) {
  const winner = winnerSide === 0 ? match.player1 : match.player2;
  const loser = winnerSide === 0 ? match.player2 : match.player1;

  send(winner.ws, { type: "MATCH_RESULT", result: "win", eloChange: 15 });
  send(loser.ws, { type: "MATCH_RESULT", result: "loss", eloChange: -10 });

  if (match.turnTimeout) clearTimeout(match.turnTimeout);
  activeMatches.delete(match.matchId);
  match.player1.matchId = null;
  match.player2.matchId = null;

  console.log(`[Duelyst] Match ended: ${winner.userName} wins (${reason})`);
}

/* ─── WEBSOCKET SERVER ─── */
export function setupDuelystWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/api/duelyst-pvp" });
  console.log("[Duelyst] WebSocket server initialized on /api/duelyst-pvp");

  // Matchmaking loop
  setInterval(() => {
    tryMatchPlayers();
    queue.forEach((p, i) => {
      send(p.ws, { type: "QUEUE_UPDATE", position: i + 1, playersInQueue: queue.length });
    });
  }, MATCHMAKING_INTERVAL_MS);

  wss.on("connection", (ws) => {
    let player: DuelystPlayer | null = null;

    ws.on("message", (raw) => {
      let msg: ClientMessage;
      try {
        const parsed = JSON.parse(raw.toString());
        const result = duelystClientMessageSchema.safeParse(parsed);
        if (!result.success) {
          send(ws, { type: "ERROR", message: "Invalid message format" });
          return;
        }
        msg = result.data as ClientMessage;
      } catch {
        send(ws, { type: "ERROR", message: "Invalid JSON" });
        return;
      }

      const rateLimitKey = player?.userId ?? "anon";
      if (!checkWsRateLimit(rateLimitKey)) {
        sendRateLimitError(ws);
        return;
      }

      switch (msg.type) {
        case "PING":
          send(ws, { type: "PONG" });
          break;

        case "JOIN_QUEUE": {
          if (player) { send(ws, { type: "ERROR", message: "Already in queue/match" }); break; }
          player = {
            ws, userId: msg.userId, userName: msg.userName,
            faction: msg.faction, deckCardIds: msg.deckCardIds,
            elo: 1200, matchId: null,
          };
          playerConnections.set(msg.userId, player);
          queue.push(player);
          send(ws, { type: "QUEUE_JOINED", position: queue.length });
          console.log(`[Duelyst] ${msg.userName} joined queue (${msg.faction})`);
          break;
        }

        case "LEAVE_QUEUE": {
          if (player) {
            const idx = queue.indexOf(player);
            if (idx !== -1) queue.splice(idx, 1);
          }
          break;
        }

        case "GAME_ACTION": {
          if (!player?.matchId) { send(ws, { type: "ERROR", message: "Not in a match" }); break; }
          const match = activeMatches.get(player.matchId);
          if (!match) break;

          // Process action through Duelyst engine
          // For now, broadcast the action to the opponent and let both clients process
          const opponent = match.player1.userId === player.userId ? match.player2 : match.player1;
          const mySide = match.player1.userId === player.userId ? 0 : 1;

          // Broadcast updated state
          try {
            const { executeAction } = require("../shared/duelyst-engine-stub");
            match.gameState = executeAction(match.gameState, msg.action);
          } catch {
            // Engine not available server-side — relay action to opponent for client-side processing
          }

          send(opponent.ws, { type: "GAME_STATE", state: match.gameState || msg.action, isYourTurn: true });
          send(player.ws, { type: "GAME_STATE", state: match.gameState || msg.action, isYourTurn: false });

          // Check for game over
          const state = match.gameState as any;
          if (state?.winner !== undefined) {
            endMatch(match, state.winner, "game_over");
          }
          break;
        }

        case "SURRENDER": {
          if (!player?.matchId) break;
          const match = activeMatches.get(player.matchId);
          if (!match) break;
          const winnerSide = match.player1.userId === player.userId ? 1 : 0;
          endMatch(match, winnerSide as 0 | 1, "surrender");
          break;
        }
      }
    });

    ws.on("close", () => {
      if (player) handleDisconnect(player);
    });

    ws.on("error", () => {
      if (player) handleDisconnect(player);
    });
  });
}

/** Expose queue status for REST API */
export function getDuelystQueueStatus() {
  return { playersInQueue: queue.length, activeMatches: activeMatches.size };
}
