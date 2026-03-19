/* ═══════════════════════════════════════════════════════
   PVP WEBSOCKET SERVER — Matchmaking, battles, spectator
   ═══════════════════════════════════════════════════════ */
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { initPvpBattle, processPvpAction, getPlayerView, calculateEloChange, getRankTier, type PvpBattleState, type PvpAction, type DeckCard } from "@shared/pvpBattle";
import { getDb } from "./db";
import { pvpMatches, pvpLeaderboard, pvpSeasons, pvpSeasonRecords } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { trackPvpResult } from "./achievementTracker";
import { randomUUID } from "crypto";

/* ─── TYPES ─── */
interface ConnectedPlayer {
  ws: WebSocket;
  userId: number;
  userName: string;
  deck: DeckCard[];
  elo: number;
  matchId: string | null;
}

interface Spectator {
  ws: WebSocket;
  matchId: string;
}

interface ActiveMatch {
  matchId: string;
  state: PvpBattleState;
  player1: ConnectedPlayer;
  player2: ConnectedPlayer;
  spectators: Set<WebSocket>;
  turnTimeout: ReturnType<typeof setTimeout> | null;
  dbId: number | null;
}

type ClientMessage =
  | { type: "JOIN_QUEUE"; userId: number; userName: string; deck: DeckCard[]; token?: string }
  | { type: "LEAVE_QUEUE" }
  | { type: "GAME_ACTION"; action: PvpAction }
  | { type: "SURRENDER" }
  | { type: "SPECTATE"; matchId: string }
  | { type: "STOP_SPECTATING" }
  | { type: "PING" };

type ServerMessage =
  | { type: "QUEUE_JOINED"; position: number }
  | { type: "QUEUE_UPDATE"; position: number; playersInQueue: number }
  | { type: "MATCH_FOUND"; matchId: string; opponentName: string; opponentElo: number; yourSide: "player1" | "player2" }
  | { type: "GAME_STATE"; state: PvpBattleState }
  | { type: "ACTION_RESULT"; success: boolean; error?: string }
  | { type: "GAME_OVER"; winnerId: number; eloChange: number; newElo: number }
  | { type: "OPPONENT_DISCONNECTED" }
  | { type: "SPECTATE_JOINED"; matchId: string; player1Name: string; player2Name: string; player1Elo: number; player2Elo: number }
  | { type: "SPECTATE_STATE"; state: PvpBattleState }
  | { type: "SPECTATE_ENDED"; reason: string }
  | { type: "ACTIVE_MATCHES"; matches: Array<{ matchId: string; player1Name: string; player2Name: string; player1Elo: number; player2Elo: number; turnNumber: number; spectatorCount: number }> }
  | { type: "ERROR"; message: string }
  | { type: "PONG" };

/* ─── STATE ─── */
const matchmakingQueue: ConnectedPlayer[] = [];
const activeMatches = new Map<string, ActiveMatch>();
const playerConnections = new Map<number, ConnectedPlayer>();
const spectatorConnections = new Map<WebSocket, string>(); // ws -> matchId

const TURN_TIMEOUT_SECONDS = 75;
const MATCHMAKING_INTERVAL_MS = 3000;

/* ─── HELPERS ─── */
function send(ws: WebSocket, msg: ServerMessage) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

function broadcastToSpectators(match: ActiveMatch, msg: ServerMessage) {
  Array.from(match.spectators).forEach(specWs => {
    send(specWs, msg);
  });
}

/** Get a spectator-safe view of the game state (no hidden info) */
function getSpectatorView(state: PvpBattleState): PvpBattleState {
  const view = JSON.parse(JSON.stringify(state)) as PvpBattleState;
  // Hide both players' hands from spectators (delayed reveal)
  for (const player of [view.player1, view.player2]) {
    player.hand = player.hand.map(c => ({
      ...c,
      name: "???",
      ability: "???",
      imageUrl: "",
      cardId: "hidden",
    }));
    player.deck = new Array(player.deck.length).fill(null).map((_, i) => ({
      instanceId: `hidden-${i}`,
      cardId: "hidden",
      name: "???",
      type: "unit" as const,
      rarity: "common",
      attack: 0,
      defense: 0,
      cost: 0,
      ability: "",
      imageUrl: "",
      currentHP: 0,
      hasAttacked: false,
      justDeployed: false,
      tempAttackMod: 0,
      tempDefenseMod: 0,
    }));
  }
  return view;
}

/** Get list of active matches for spectator lobby */
function getActiveMatchesList() {
  const list: Array<{ matchId: string; player1Name: string; player2Name: string; player1Elo: number; player2Elo: number; turnNumber: number; spectatorCount: number }> = [];
  Array.from(activeMatches.values()).forEach(match => {
    list.push({
      matchId: match.matchId,
      player1Name: match.player1.userName,
      player2Name: match.player2.userName,
      player1Elo: match.player1.elo,
      player2Elo: match.player2.elo,
      turnNumber: match.state.turnNumber,
      spectatorCount: match.spectators.size,
    });
  });
  return list;
}

async function getOrCreateLeaderboard(userId: number, userName: string): Promise<{ elo: number }> {
  const db = await getDb();
  if (!db) return { elo: 1000 };

  const rows = await db.select().from(pvpLeaderboard).where(eq(pvpLeaderboard.userId, userId)).limit(1);
  if (rows.length > 0) return { elo: rows[0].elo };

  await db.insert(pvpLeaderboard).values({ userId, userName, elo: 1000 });
  return { elo: 1000 };
}

/* ─── MATCHMAKING ─── */
function tryMatchPlayers() {
  if (matchmakingQueue.length < 2) return;

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

  if (!bestPair) return;

  const [i1, i2] = bestPair;
  const p2 = matchmakingQueue.splice(i2, 1)[0];
  const p1 = matchmakingQueue.splice(i1, 1)[0];

  startMatch(p1, p2);
}

async function startMatch(p1: ConnectedPlayer, p2: ConnectedPlayer) {
  const matchId = randomUUID().slice(0, 12);

  const state = initPvpBattle(
    matchId,
    { id: p1.userId, name: p1.userName, deck: p1.deck },
    { id: p2.userId, name: p2.userName, deck: p2.deck }
  );

  const match: ActiveMatch = {
    matchId,
    state,
    player1: p1,
    player2: p2,
    spectators: new Set(),
    turnTimeout: null,
    dbId: null,
  };

  p1.matchId = matchId;
  p2.matchId = matchId;
  activeMatches.set(matchId, match);

  // Save match to DB
  try {
    const db = await getDb();
    if (db) {
      const result = await db.insert(pvpMatches).values({
        matchId,
        player1Id: p1.userId,
        player2Id: p2.userId,
        status: "active",
        player1Deck: p1.deck.map(c => c.cardId),
        player2Deck: p2.deck.map(c => c.cardId),
      });
      match.dbId = Number(result[0].insertId);
    }
  } catch (e) {
    console.error("[PvP] Failed to save match:", e);
  }

  // Notify players
  send(p1.ws, { type: "MATCH_FOUND", matchId, opponentName: p2.userName, opponentElo: p2.elo, yourSide: "player1" });
  send(p2.ws, { type: "MATCH_FOUND", matchId, opponentName: p1.userName, opponentElo: p1.elo, yourSide: "player2" });

  // Send initial game state
  send(p1.ws, { type: "GAME_STATE", state: getPlayerView(state, p1.userId) });
  send(p2.ws, { type: "GAME_STATE", state: getPlayerView(state, p2.userId) });

  // Notify spectators of new match
  broadcastToSpectators(match, { type: "SPECTATE_STATE", state: getSpectatorView(state) });

  startTurnTimer(match);
}

function startTurnTimer(match: ActiveMatch) {
  if (match.turnTimeout) clearTimeout(match.turnTimeout);

  match.turnTimeout = setTimeout(() => {
    const result = processPvpAction(match.state, match.state.currentTurn, { type: "END_TURN" });
    match.state = result.state;

    send(match.player1.ws, { type: "GAME_STATE", state: getPlayerView(match.state, match.player1.userId) });
    send(match.player2.ws, { type: "GAME_STATE", state: getPlayerView(match.state, match.player2.userId) });
    broadcastToSpectators(match, { type: "SPECTATE_STATE", state: getSpectatorView(match.state) });

    if (match.state.winner) {
      endMatch(match);
    } else {
      startTurnTimer(match);
    }
  }, TURN_TIMEOUT_SECONDS * 1000);
}

async function endMatch(match: ActiveMatch) {
  if (match.turnTimeout) {
    clearTimeout(match.turnTimeout);
    match.turnTimeout = null;
  }

  const winnerId = match.state.winner;
  if (!winnerId) return;

  const loserId = winnerId === match.player1.userId ? match.player2.userId : match.player1.userId;
  const winnerPlayer = winnerId === match.player1.userId ? match.player1 : match.player2;
  const loserPlayer = winnerId === match.player1.userId ? match.player2 : match.player1;

  const { winnerChange, loserChange } = calculateEloChange(winnerPlayer.elo, loserPlayer.elo);

  // Update DB
  try {
    const db = await getDb();
    if (db) {
      if (match.dbId) {
        await db.update(pvpMatches).set({
          status: "completed",
          winnerId,
          totalTurns: match.state.turnNumber,
          player1EloChange: winnerId === match.player1.userId ? winnerChange : loserChange,
          player2EloChange: winnerId === match.player2.userId ? winnerChange : loserChange,
          endedAt: new Date(),
        }).where(eq(pvpMatches.id, match.dbId));
      }

      // Update leaderboards
      for (const [player, change, won] of [
        [winnerPlayer, winnerChange, true] as const,
        [loserPlayer, loserChange, false] as const,
      ]) {
        const rows = await db.select().from(pvpLeaderboard).where(eq(pvpLeaderboard.userId, player.userId)).limit(1);
        if (rows.length > 0) {
          const row = rows[0];
          const newElo = Math.max(0, row.elo + change);
          const newStreak = won ? row.winStreak + 1 : 0;
          const newTier = getRankTier(newElo);
          await db.update(pvpLeaderboard).set({
            elo: newElo,
            wins: won ? row.wins + 1 : row.wins,
            losses: won ? row.losses : row.losses + 1,
            winStreak: newStreak,
            bestStreak: Math.max(row.bestStreak, newStreak),
            rankTier: newTier as any,
            lastMatchAt: new Date(),
          }).where(eq(pvpLeaderboard.userId, player.userId));

          // Achievement auto-tracking
          const totalWins = won ? row.wins + 1 : row.wins;
          trackPvpResult(player.userId, won, newStreak, newTier, totalWins)
            .catch(e => console.error("[PvP] Achievement tracking error:", e));
        }
      }

      // Update season records
      await updateSeasonRecords(db, winnerPlayer.userId, winnerPlayer.elo + winnerChange, true);
      await updateSeasonRecords(db, loserPlayer.userId, loserPlayer.elo + loserChange, false);
    }
  } catch (e) {
    console.error("[PvP] Failed to update match results:", e);
  }

  // Notify players
  send(winnerPlayer.ws, { type: "GAME_OVER", winnerId, eloChange: winnerChange, newElo: winnerPlayer.elo + winnerChange });
  send(loserPlayer.ws, { type: "GAME_OVER", winnerId, eloChange: loserChange, newElo: loserPlayer.elo + loserChange });

  // Notify spectators
  broadcastToSpectators(match, { type: "SPECTATE_ENDED", reason: `${winnerPlayer.userName} wins!` });

  // Clean up spectators
  Array.from(match.spectators).forEach(specWs => {
    spectatorConnections.delete(specWs);
  });
  match.spectators.clear();

  // Cleanup
  match.player1.matchId = null;
  match.player2.matchId = null;
  activeMatches.delete(match.matchId);
}

/** Update season records after a match */
async function updateSeasonRecords(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number, newElo: number, won: boolean) {
  try {
    const activeSeason = await db.select().from(pvpSeasons).where(eq(pvpSeasons.isActive, 1)).limit(1);
    if (!activeSeason[0]) return;

    const seasonId = activeSeason[0].id;
    const existing = await db.select().from(pvpSeasonRecords)
      .where(and(eq(pvpSeasonRecords.userId, userId), eq(pvpSeasonRecords.seasonId, seasonId)))
      .limit(1);

    if (existing[0]) {
      const record = existing[0];
      const newPeakElo = Math.max(record.peakElo, newElo);
      const newStreak = won ? (record.bestStreak + 1) : 0;
      await db.update(pvpSeasonRecords).set({
        peakElo: newPeakElo,
        finalElo: newElo,
        peakTier: getRankTier(newPeakElo) as any,
        seasonWins: won ? record.seasonWins + 1 : record.seasonWins,
        seasonLosses: won ? record.seasonLosses : record.seasonLosses + 1,
        bestStreak: Math.max(record.bestStreak, newStreak),
      }).where(eq(pvpSeasonRecords.id, record.id));
    } else {
      await db.insert(pvpSeasonRecords).values({
        userId,
        seasonId,
        peakElo: newElo,
        finalElo: newElo,
        peakTier: getRankTier(newElo) as any,
        seasonWins: won ? 1 : 0,
        seasonLosses: won ? 0 : 1,
        bestStreak: won ? 1 : 0,
      });
    }
  } catch (e) {
    console.error("[PvP] Failed to update season records:", e);
  }
}

function handleSurrender(player: ConnectedPlayer) {
  if (!player.matchId) return;
  const match = activeMatches.get(player.matchId);
  if (!match) return;

  const opponent = match.player1.userId === player.userId ? match.player2 : match.player1;
  match.state.winner = opponent.userId;
  match.state.phase = "GAME_OVER";

  endMatch(match);
}

function handleDisconnect(player: ConnectedPlayer) {
  const qIdx = matchmakingQueue.findIndex(p => p.userId === player.userId);
  if (qIdx !== -1) matchmakingQueue.splice(qIdx, 1);

  if (player.matchId) {
    const match = activeMatches.get(player.matchId);
    if (match && !match.state.winner) {
      const opponent = match.player1.userId === player.userId ? match.player2 : match.player1;
      send(opponent.ws, { type: "OPPONENT_DISCONNECTED" });

      setTimeout(() => {
        if (match.state.winner) return;
        match.state.winner = opponent.userId;
        match.state.phase = "GAME_OVER";
        endMatch(match);
      }, 30000);
    }
  }

  playerConnections.delete(player.userId);
}

function handleSpectatorDisconnect(ws: WebSocket) {
  const matchId = spectatorConnections.get(ws);
  if (matchId) {
    const match = activeMatches.get(matchId);
    if (match) {
      match.spectators.delete(ws);
    }
    spectatorConnections.delete(ws);
  }
}

/* ─── WEBSOCKET SERVER ─── */
export function setupPvpWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/api/pvp" });

  console.log("[PvP] WebSocket server initialized on /api/pvp");

  // Matchmaking loop
  setInterval(() => {
    tryMatchPlayers();
    matchmakingQueue.forEach((p, i) => {
      send(p.ws, { type: "QUEUE_UPDATE", position: i + 1, playersInQueue: matchmakingQueue.length });
    });
  }, MATCHMAKING_INTERVAL_MS);

  wss.on("connection", (ws) => {
    let player: ConnectedPlayer | null = null;
    let isSpectator = false;

    ws.on("message", (raw) => {
      let msg: ClientMessage;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        send(ws, { type: "ERROR", message: "Invalid JSON" });
        return;
      }

      switch (msg.type) {
        case "PING":
          send(ws, { type: "PONG" });
          break;

        case "JOIN_QUEUE": {
          if (player) {
            send(ws, { type: "ERROR", message: "Already in queue or match" });
            return;
          }

          if (!msg.deck || msg.deck.length < 5) {
            send(ws, { type: "ERROR", message: "Deck must have at least 5 cards" });
            return;
          }

          const existing = playerConnections.get(msg.userId);
          if (existing) {
            send(existing.ws, { type: "ERROR", message: "Connected from another session" });
            existing.ws.close();
            playerConnections.delete(msg.userId);
          }

          getOrCreateLeaderboard(msg.userId, msg.userName).then(({ elo }) => {
            player = {
              ws,
              userId: msg.userId,
              userName: msg.userName,
              deck: msg.deck,
              elo,
              matchId: null,
            };

            playerConnections.set(msg.userId, player);
            matchmakingQueue.push(player);

            send(ws, { type: "QUEUE_JOINED", position: matchmakingQueue.length });
            tryMatchPlayers();
          });
          break;
        }

        case "LEAVE_QUEUE": {
          if (player) {
            const idx = matchmakingQueue.findIndex(p => p.userId === player!.userId);
            if (idx !== -1) matchmakingQueue.splice(idx, 1);
          }
          break;
        }

        case "GAME_ACTION": {
          if (!player || !player.matchId) {
            send(ws, { type: "ERROR", message: "Not in a match" });
            return;
          }

          const match = activeMatches.get(player.matchId);
          if (!match) {
            send(ws, { type: "ERROR", message: "Match not found" });
            return;
          }

          const result = processPvpAction(match.state, player.userId, msg.action);
          match.state = result.state;

          send(ws, { type: "ACTION_RESULT", success: result.success, error: result.error });

          // Send updated state to both players
          send(match.player1.ws, { type: "GAME_STATE", state: getPlayerView(match.state, match.player1.userId) });
          send(match.player2.ws, { type: "GAME_STATE", state: getPlayerView(match.state, match.player2.userId) });

          // Send to spectators
          broadcastToSpectators(match, { type: "SPECTATE_STATE", state: getSpectatorView(match.state) });

          if (match.state.winner) {
            endMatch(match);
          } else if (msg.action.type === "END_TURN") {
            startTurnTimer(match);
          }
          break;
        }

        case "SURRENDER": {
          if (player) handleSurrender(player);
          break;
        }

        case "SPECTATE": {
          const matchToWatch = activeMatches.get(msg.matchId);
          if (!matchToWatch) {
            send(ws, { type: "ERROR", message: "Match not found or already ended" });
            // Send active matches list
            send(ws, { type: "ACTIVE_MATCHES", matches: getActiveMatchesList() });
            return;
          }

          // Remove from any previous spectating
          handleSpectatorDisconnect(ws);

          isSpectator = true;
          matchToWatch.spectators.add(ws);
          spectatorConnections.set(ws, msg.matchId);

          // Send join confirmation
          send(ws, {
            type: "SPECTATE_JOINED",
            matchId: msg.matchId,
            player1Name: matchToWatch.player1.userName,
            player2Name: matchToWatch.player2.userName,
            player1Elo: matchToWatch.player1.elo,
            player2Elo: matchToWatch.player2.elo,
          });

          // Send current game state
          send(ws, { type: "SPECTATE_STATE", state: getSpectatorView(matchToWatch.state) });
          break;
        }

        case "STOP_SPECTATING": {
          handleSpectatorDisconnect(ws);
          isSpectator = false;
          // Send active matches list
          send(ws, { type: "ACTIVE_MATCHES", matches: getActiveMatchesList() });
          break;
        }
      }
    });

    ws.on("close", () => {
      if (player) handleDisconnect(player);
      if (isSpectator) handleSpectatorDisconnect(ws);
    });

    ws.on("error", () => {
      if (player) handleDisconnect(player);
      if (isSpectator) handleSpectatorDisconnect(ws);
    });
  });

  return wss;
}
