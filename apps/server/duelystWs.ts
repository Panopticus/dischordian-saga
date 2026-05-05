/* ═══════════════════════════════════════════════════════
   DUELYST MULTIPLAYER WEBSOCKET SERVER
   Real-time PvP for the Dischordia tactical card game.
   Follows the same architecture as pvpWs.ts.

   STATUS (2026-05-05): backend-complete, awaiting client connector.
   The WS is mounted at /api/duelyst-pvp and exercised by 6+ tests
   (heatWiring, replayProducer, replayVerification, task4-resilience,
   matchLengthMonitor, pvpRanking) but no client opens a socket here
   yet — DuelystPage is currently single-player. Do NOT delete; this
   is the multiplayer surface for when the client connector lands.
   See docs/HIDDEN_SYSTEMS_AUDIT_2026-05.md §2.3.

   Protocol:
   Client → Server: JOIN_QUEUE, GAME_ACTION, SURRENDER, PING
   Server → Client: QUEUE_JOINED, MATCH_FOUND, GAME_STATE,
                     OPPONENT_DISCONNECTED, MATCH_RESULT, PONG

   State management: the authoritative GameState lives inside the
   tcg-core reducer (apps/shared/tcg-core). This file is a thin
   WebSocket wrapper that parses messages, routes them through the
   matchCore helpers, applies reduce(), and broadcasts the new state.
   Zero game rules live here — all rules are in tcg-core.
   ═══════════════════════════════════════════════════════ */
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { checkWsRateLimit, sendRateLimitError, storeDisconnectedSession, recoverSession } from "./wsRateLimit";
import { recordMatchStart, recordMatchEnd } from "./matchLengthMonitor";
import { reduce, hashState, type GameState, type Action } from "../shared/tcg-core";
import { persistFinishedMatch } from "./services/replayPersistence";
import {
  buildMatchConfig,
  createServerMatchState,
  translateClientAction,
  serializeForClient,
  endReasonFromWinReason,
  serverCardRegistry,
} from "./tcg/matchCore";

/* ─── TYPES ─── */

interface DuelystPlayer {
  ws: WebSocket;
  userId: number;
  userName: string;
  faction: string;
  deckCardIds: string[];
  /** Heat modifier ids the player locked in (#1). [] = Heat-0 run. */
  heatModifiers: readonly string[];
  elo: number;
  matchId: string | null;
}

interface DuelystMatch {
  matchId: string;
  player1: DuelystPlayer;
  player2: DuelystPlayer;
  /** Authoritative game state from the tcg-core reducer. */
  gameState: GameState;
  /** Monotonic action sequence counter — assigned by the server on
   *  every accepted action. Replay dedup depends on this. */
  nextSeq: number;
  /** Accumulated accepted actions for replay persistence. */
  actionLog: Action[];
  turnTimeout: ReturnType<typeof setTimeout> | null;
  startedAt: number;
}

type ClientMessage =
  | {
      type: "JOIN_QUEUE";
      userId: number;
      userName: string;
      faction: string;
      deckCardIds: string[];
      /** Heat modifier ids the player locked in for this run (#1).
       *  Optional + ignored when absent so legacy clients still match.
       *  Both players' heat sets are unioned at queue-pair time below. */
      heatModifiers?: string[];
    }
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

/** Union the two queue lock-ins into the single per-match modifier
 *  set. Currently a simple "either-side-on" union with duplicates
 *  dropped — both players see every active modifier. Phase-3 will
 *  add a UI "negotiate down to common subset" path; until then both
 *  players get the harder run, which is the conservative default. */
export function mergeHeatModifiers(
  p1: readonly string[],
  p2: readonly string[],
): readonly string[] {
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const id of [...p1, ...p2]) {
    if (!seen.has(id)) {
      seen.add(id);
      merged.push(id);
    }
  }
  return merged;
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

  // Build validated MatchConfigs before locking the players in. If
  // either player's faction + deck fails validation, send them an
  // error and return them both to the queue.
  // skipValidation: true until the full 216-card set is authored.
  // Once all cards are in the registry, remove this flag so the PvP
  // queue enforces STANDARD_S1 deck legality.
  const p1Config = buildMatchConfig({
    userId: p1.userId,
    faction: p1.faction,
    deckCardIds: p1.deckCardIds,
  }, { skipValidation: true });
  const p2Config = buildMatchConfig({
    userId: p2.userId,
    faction: p2.faction,
    deckCardIds: p2.deckCardIds,
  }, { skipValidation: true });
  if (p1Config.error || p2Config.error) {
    if (p1Config.error) {
      send(p1.ws, { type: "ERROR", message: `invalid queue config: ${p1Config.error}` });
    }
    if (p2Config.error) {
      send(p2.ws, { type: "ERROR", message: `invalid queue config: ${p2Config.error}` });
    }
    // Return any valid player to the queue so they don't lose their slot.
    if (!p1Config.error) queue.unshift(p1);
    if (!p2Config.error) queue.unshift(p2);
    return;
  }

  const matchId = generateMatchId();
  p1.matchId = matchId;
  p2.matchId = matchId;
  recordMatchStart(matchId);

  // Initialize the authoritative GameState via the real tcg-core reducer.
  // Seed is derived deterministically from (matchId, playerIds) so
  // replays stored under the same matchId reproduce perfectly.
  //
  // Heat modifiers (#1): the queue pair's lock-ins are unioned (with
  // duplicates dropped) and validated at createMatchState. A typo'd
  // or over-cap stack throws, which we catch + return both players to
  // queue with an error so a misconfigured client can't strand the
  // pair in a half-built match.
  const heatModifiers = mergeHeatModifiers(p1.heatModifiers, p2.heatModifiers);
  let gameState;
  try {
    gameState = createServerMatchState({
      matchId,
      p1: p1Config.config!,
      p2: p2Config.config!,
      heatModifiers,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    send(p1.ws, { type: "ERROR", message: `heat config invalid: ${msg}` });
    send(p2.ws, { type: "ERROR", message: `heat config invalid: ${msg}` });
    p1.matchId = null;
    p2.matchId = null;
    return;
  }

  const match: DuelystMatch = {
    matchId,
    player1: p1,
    player2: p2,
    gameState,
    nextSeq: 1,
    actionLog: [],
    turnTimeout: null,
    startedAt: Date.now(),
  };

  activeMatches.set(matchId, match);

  send(p1.ws, { type: "MATCH_FOUND", matchId, opponentName: p2.userName, opponentFaction: p2.faction, yourSide: 0 });
  send(p2.ws, { type: "MATCH_FOUND", matchId, opponentName: p1.userName, opponentFaction: p1.faction, yourSide: 1 });

  // Send initial game state to both players. serializeForClient
  // derives isYourTurn from the actual state.currentPlayer, not a
  // hardcoded boolean.
  const p1View = serializeForClient(gameState, 0);
  const p2View = serializeForClient(gameState, 1);
  send(p1.ws, { type: "GAME_STATE", state: p1View.state, isYourTurn: p1View.isYourTurn });
  send(p2.ws, { type: "GAME_STATE", state: p2View.state, isYourTurn: p2View.isYourTurn });

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
  // #88 Telemetry — record wall-clock duration for the admin
  // dashboard's match-length p50/p95/p99. Tagged with the engine's
  // own end reason so admins can spot disconnect / surrender clusters.
  recordMatchEnd(match.matchId, "duelyst", reason);

  const winner = winnerSide === 0 ? match.player1 : match.player2;
  const loser = winnerSide === 0 ? match.player2 : match.player1;

  send(winner.ws, { type: "MATCH_RESULT", result: "win", eloChange: 15 });
  send(loser.ws, { type: "MATCH_RESULT", result: "loss", eloChange: -10 });

  // Persist replay data so the deterministic reducer can reproduce
  // the entire match from a /replay/<shareToken> URL (#6 / #46).
  // The action log + seed + rulesVersion + final-state hash are
  // enough to reconstruct every board state. Fire-and-forget — a DB
  // failure must not block the WS post-match flow (we already sent
  // MATCH_RESULT to both clients above). The persistence helper
  // logs success/failure on its own.
  void persistFinishedMatch({
    gameType: "duelyst",
    startedAt: match.startedAt,
    player1: { userId: match.player1.userId, userName: match.player1.userName },
    player2: { userId: match.player2.userId, userName: match.player2.userName },
    winnerSide,
    gameState: match.gameState,
    actionLog: match.actionLog,
    p1Config: { faction: match.player1.faction, deckCardIds: match.player1.deckCardIds },
    p2Config: { faction: match.player2.faction, deckCardIds: match.player2.deckCardIds },
    tags: [reason],
  });

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
      try { msg = JSON.parse(raw.toString()); } catch {
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
            heatModifiers: Array.isArray(msg.heatModifiers) ? msg.heatModifiers : [],
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

          // Which side is the sender?
          const mySide: 0 | 1 = match.player1.userId === player.userId ? 0 : 1;
          const opponent = mySide === 0 ? match.player2 : match.player1;

          // Translate the legacy client action payload into the reducer's
          // Action shape. Rejections are structured errors we surface to
          // the client.
          const translated = translateClientAction(msg.action, mySide, match.nextSeq);
          if (!translated.ok) {
            send(ws, { type: "ERROR", message: `malformed action: ${translated.error}` });
            break;
          }

          // Apply the reducer. Reducer is pure + total — it never throws
          // on validation failures, it returns a structured error.
          const result = reduce(match.gameState, translated.action, serverCardRegistry);
          if (result.error) {
            // Action was rejected by the engine (wrong turn, insufficient
            // mana, illegal target, etc.). Send the error back to the
            // offending client. Do NOT advance seq.
            send(ws, { type: "ERROR", message: `${result.error.code}: ${result.error.message}` });
            break;
          }

          // Accepted. Advance seq, log the action, replace state.
          match.gameState = result.state;
          match.actionLog.push(translated.action);
          match.nextSeq += 1;

          // Broadcast the new state to both players.
          const myView = serializeForClient(match.gameState, mySide);
          const oppView = serializeForClient(match.gameState, mySide === 0 ? 1 : 0);
          send(player.ws, { type: "GAME_STATE", state: myView.state, isYourTurn: myView.isYourTurn });
          send(opponent.ws, { type: "GAME_STATE", state: oppView.state, isYourTurn: oppView.isYourTurn });

          // Check for game over via the canonical phase/winner fields.
          if (match.gameState.phase === "ended") {
            const winnerSide = match.gameState.winner ?? 0;
            endMatch(match, winnerSide, endReasonFromWinReason(match.gameState.winReason));
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
