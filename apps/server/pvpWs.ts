/* ═══════════════════════════════════════════════════════
   PVP WEBSOCKET SERVER — Matchmaking, battles, spectator
   ═══════════════════════════════════════════════════════ */
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { z } from "zod";
import { initPvpBattle, processPvpAction, getPlayerView, calculateEloChange, getRankTier, type PvpBattleState, type PvpAction, type DeckCard } from "@shared/pvpBattle";
import { getDb } from "./db";
import { pvpMatches, pvpLeaderboard, pvpSeasons, pvpSeasonRecords } from "../db/schema";
import { classifyDeck, getArchetypeAdvantage } from "@shared/cardArchetypes";
import { canSendEmote, recordEmoteSend, validateEmote, ALL_EMOTES, type EmoteRateState } from "@shared/pvpEmotes";
import { filterMessage } from "@shared/moderation/profanityFilter";
import { eq, and } from "drizzle-orm";
import { trackPvpResult } from "./achievementTracker";
import { recordMatchStart, recordMatchEnd } from "./matchLengthMonitor";
import { randomUUID } from "crypto";
import { checkWsRateLimit, sendRateLimitError, storeDisconnectedSession, recoverSession } from "./wsRateLimit";
import { logger } from "./logger";

/* ─── ZOD MESSAGE SCHEMAS ─── */
const DeckCardSchema = z.object({
  cardId: z.string(),
  name: z.string(),
  type: z.string(),
  rarity: z.string(),
  attack: z.number(),
  defense: z.number(),
  cost: z.number(),
  ability: z.string(),
}).passthrough();

const PvpActionSchema = z.union([
  z.object({ type: z.literal("PLAY_CARD"), cardInstanceId: z.string() }),
  z.object({ type: z.literal("ATTACK"), attackerInstanceId: z.string(), targetInstanceId: z.string() }),
  z.object({ type: z.literal("END_TURN") }),
  z.object({ type: z.literal("USE_ABILITY"), cardInstanceId: z.string(), targetInstanceId: z.string().optional() }),
]);

const ClientMessageSchema = z.union([
  z.object({ type: z.literal("JOIN_QUEUE"), userId: z.number(), userName: z.string(), deck: z.array(DeckCardSchema), token: z.string().optional(), faction: z.string().optional(), companionId: z.string().optional() }),
  z.object({ type: z.literal("LEAVE_QUEUE") }),
  z.object({ type: z.literal("GAME_ACTION"), action: PvpActionSchema }),
  z.object({ type: z.literal("SURRENDER") }),
  z.object({ type: z.literal("SEND_EMOTE"), emoteId: z.string() }),
  z.object({
    type: z.literal("SPECTATE"),
    matchId: z.string(),
    spectatorName: z.string().max(64).optional(),
  }),
  z.object({ type: z.literal("STOP_SPECTATING") }),
  z.object({
    type: z.literal("SEND_SPECTATOR_CHAT"),
    text: z.string().min(1).max(200),
  }),
  z.object({ type: z.literal("PING") }),
]);

/* ─── TYPES ─── */
/* ─── PLACEMENT MATCH CONSTANTS ─── */
const PLACEMENT_MATCHES_REQUIRED = 5;
const PLACEMENT_K_FACTOR = 64; // Doubled from normal K=32
const NORMAL_K_FACTOR = 32;

interface ConnectedPlayer {
  ws: WebSocket;
  userId: number;
  userName: string;
  deck: DeckCard[];
  elo: number;
  matchId: string | null;
  /** Number of ranked matches played (for placement detection) */
  placementMatchesPlayed: number;
  /** Faction for emote filtering */
  faction: string;
  /** Companion ID for emote filtering */
  companionId?: string;
  /** Emote rate limit state */
  emoteRateState: EmoteRateState;
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
  /** Deck archetype classifications */
  player1Archetype: string;
  player2Archetype: string;
}

type ClientMessage =
  | { type: "JOIN_QUEUE"; userId: number; userName: string; deck: DeckCard[]; token?: string; faction?: string; companionId?: string }
  | { type: "LEAVE_QUEUE" }
  | { type: "GAME_ACTION"; action: PvpAction }
  | { type: "SURRENDER" }
  | { type: "SEND_EMOTE"; emoteId: string }
  | { type: "SPECTATE"; matchId: string; spectatorName?: string }
  | { type: "STOP_SPECTATING" }
  | { type: "SEND_SPECTATOR_CHAT"; text: string }
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
  | { type: "SPECTATOR_CHAT"; spectatorName: string; text: string; timestamp: number }
  | { type: "SPECTATOR_CHAT_RATE_LIMITED"; cooldownSeconds: number }
  | { type: "ACTIVE_MATCHES"; matches: Array<{ matchId: string; player1Name: string; player2Name: string; player1Elo: number; player2Elo: number; turnNumber: number; spectatorCount: number }> }
  | { type: "EMOTE"; playerId: number; playerName: string; emoteId: string; emoteText: string }
  | { type: "EMOTE_RATE_LIMITED"; cooldownSeconds: number }
  | { type: "PLACEMENT_STATUS"; matchNumber: number; totalRequired: number; isPlacement: boolean }
  | { type: "PLACEMENT_COMPLETE"; initialRank: string; finalElo: number; wins: number }
  | { type: "ERROR"; message: string }
  | { type: "PONG" };

/* ─── STATE ─── */
const matchmakingQueue: ConnectedPlayer[] = [];
const activeMatches = new Map<string, ActiveMatch>();
const playerConnections = new Map<number, ConnectedPlayer>();
const spectatorConnections = new Map<WebSocket, string>(); // ws -> matchId
/** Spectator display name keyed by websocket so chat can attribute messages. */
const spectatorNames = new Map<WebSocket, string>();
/** Rolling timestamps of recent spectator chat sends for rate limiting. */
const spectatorChatRate = new Map<WebSocket, number[]>();
const SPECTATOR_CHAT_WINDOW_MS = 10_000;
const SPECTATOR_CHAT_MAX_PER_WINDOW = 3;

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

async function getOrCreateLeaderboard(userId: number, userName: string): Promise<{ elo: number; matchesPlayed: number }> {
  const db = await getDb();
  if (!db) return { elo: 1000, matchesPlayed: 0 };

  const rows = await db.select().from(pvpLeaderboard).where(eq(pvpLeaderboard.userId, userId)).limit(1);
  if (rows.length > 0) {
    const row = rows[0];
    return { elo: row.elo, matchesPlayed: (row.wins || 0) + (row.losses || 0) };
  }

  await db.insert(pvpLeaderboard).values({ userId, userName, elo: 1000 });
  return { elo: 1000, matchesPlayed: 0 };
}

/** Determine if a player is in placement phase */
function isInPlacement(matchesPlayed: number): boolean {
  return matchesPlayed < PLACEMENT_MATCHES_REQUIRED;
}

/** Get the appropriate K-factor based on placement status */
function getKFactor(matchesPlayed: number): number {
  return isInPlacement(matchesPlayed) ? PLACEMENT_K_FACTOR : NORMAL_K_FACTOR;
}

/** Determine initial rank after placement based on wins */
function getPlacementRank(wins: number): { tier: string; elo: number } {
  if (wins >= 5) return { tier: "gold", elo: 1400 };
  if (wins >= 3) return { tier: "silver", elo: 1200 };
  return { tier: "bronze", elo: 1000 };
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
  recordMatchStart(matchId);

  const state = initPvpBattle(
    matchId,
    { id: p1.userId, name: p1.userName, deck: p1.deck },
    { id: p2.userId, name: p2.userName, deck: p2.deck }
  );

  // Classify deck archetypes for matchup analysis
  const p1Archetype = classifyDeck(p1.deck.map(c => c.cardId));
  const p2Archetype = classifyDeck(p2.deck.map(c => c.cardId));

  const match: ActiveMatch = {
    matchId,
    state,
    player1: p1,
    player2: p2,
    spectators: new Set(),
    turnTimeout: null,
    dbId: null,
    player1Archetype: p1Archetype,
    player2Archetype: p2Archetype,
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

  // Send placement status if applicable
  for (const p of [p1, p2]) {
    if (isInPlacement(p.placementMatchesPlayed)) {
      send(p.ws, {
        type: "PLACEMENT_STATUS",
        matchNumber: p.placementMatchesPlayed + 1,
        totalRequired: PLACEMENT_MATCHES_REQUIRED,
        isPlacement: true,
      });
    }
  }

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

  // #88 Telemetry — record wall-clock match length for the admin
  // dashboard. Records BEFORE the early-return on missing winner so
  // disconnect-driven endings (where state.winner is null) still get
  // counted in `pvp` p50/p95/p99.
  recordMatchEnd(match.matchId, "pvp", match.state.winner ? "normal" : "incomplete");

  const winnerId = match.state.winner;
  if (!winnerId) return;

  const loserId = winnerId === match.player1.userId ? match.player2.userId : match.player1.userId;
  const winnerPlayer = winnerId === match.player1.userId ? match.player1 : match.player2;
  const loserPlayer = winnerId === match.player1.userId ? match.player2 : match.player1;

  // Determine K-factor based on placement status (doubled during placement)
  const winnerK = getKFactor(winnerPlayer.placementMatchesPlayed);
  const loserK = getKFactor(loserPlayer.placementMatchesPlayed);
  const effectiveK = Math.max(winnerK, loserK); // Use higher K if either is in placement

  // Calculate base ELO change
  const { winnerChange: baseWinnerChange, loserChange: baseLoserChange } = calculateEloChange(winnerPlayer.elo, loserPlayer.elo);

  // Apply K-factor scaling (calculateEloChange uses K=32 internally)
  const kScale = effectiveK / NORMAL_K_FACTOR;
  let winnerChange = Math.round(baseWinnerChange * kScale);
  let loserChange = Math.round(baseLoserChange * kScale);

  // Apply archetype matchup adjustment
  const winnerArchetype = winnerId === match.player1.userId ? match.player1Archetype : match.player2Archetype;
  const loserArchetype = winnerId === match.player1.userId ? match.player2Archetype : match.player1Archetype;
  const archetypeAdj = getArchetypeAdvantage(winnerArchetype, loserArchetype);
  winnerChange = Math.round(winnerChange * (1 + archetypeAdj));
  loserChange = Math.round(loserChange * (1 - archetypeAdj));

  // Track placement progression
  winnerPlayer.placementMatchesPlayed++;
  loserPlayer.placementMatchesPlayed++;

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
            rankTier: newTier,
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

  // Check for placement completion (player just finished their 5th match)
  for (const [player, won] of [
    [winnerPlayer, true] as const,
    [loserPlayer, false] as const,
  ]) {
    if (player.placementMatchesPlayed === PLACEMENT_MATCHES_REQUIRED) {
      try {
        const db = await getDb();
        if (db) {
          const rows = await db.select().from(pvpLeaderboard).where(eq(pvpLeaderboard.userId, player.userId)).limit(1);
          if (rows.length > 0) {
            const totalWins = rows[0].wins;
            const { tier, elo } = getPlacementRank(totalWins);
            // Set the player to their placement rank if it's higher than current
            const finalElo = Math.max(rows[0].elo, elo);
            await db.update(pvpLeaderboard).set({
              elo: finalElo,
              rankTier: getRankTier(finalElo),
            }).where(eq(pvpLeaderboard.userId, player.userId));

            send(player.ws, {
              type: "PLACEMENT_COMPLETE",
              initialRank: tier,
              finalElo,
              wins: totalWins,
            });
          }
        }
      } catch (e) {
        logger.error("[PvP] Placement completion error:", e);
      }
    }
  }

  // Award class mastery XP
  import("./classMasteryHelper").then(({ awardClassXp }) => {
    awardClassXp(winnerId, "win_pvp").catch(e => logger.error("[PvP] Class XP award failed:", e));
    awardClassXp(loserId, "play_pvp").catch(e => logger.error("[PvP] Class XP award failed:", e));
  }).catch(e => logger.error("[PvP] Class mastery import failed:", e));

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
        peakTier: getRankTier(newPeakElo),
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
        peakTier: getRankTier(newElo),
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

      // Store session for reconnection within grace period
      storeDisconnectedSession(player.userId, player.matchId, {
        side: match.player1.userId === player.userId ? "player1" : "player2",
        deck: player.deck,
        userName: player.userName,
        elo: player.elo,
      });

      setTimeout(() => {
        if (match.state.winner) return;
        // Check if player reconnected during grace period
        if (playerConnections.has(player.userId)) return;
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
  spectatorNames.delete(ws);
  spectatorChatRate.delete(ws);
}

/** Expose live matchmaking status for the REST API */
export function getMatchmakingStatus() {
  return {
    playersInQueue: matchmakingQueue.length,
    activeMatches: activeMatches.size,
  };
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

    ws.on("message", async (raw) => {
      let msg: ClientMessage;
      try {
        const parsed = JSON.parse(raw.toString());
        const result = ClientMessageSchema.safeParse(parsed);
        if (!result.success) {
          send(ws, { type: "ERROR", message: `Invalid message: ${result.error.issues[0]?.message || "validation failed"}` });
          return;
        }
        msg = result.data as ClientMessage;
      } catch {
        send(ws, { type: "ERROR", message: "Invalid JSON" });
        return;
      }

      // Rate limiting — check per-user if identified, per-connection otherwise
      const rateLimitKey = player?.userId ?? ws.url ?? "anon";
      if (!checkWsRateLimit(rateLimitKey)) {
        sendRateLimitError(ws);
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

          getOrCreateLeaderboard(msg.userId, msg.userName).then(({ elo, matchesPlayed }) => {
            player = {
              ws,
              userId: msg.userId,
              userName: msg.userName,
              deck: msg.deck,
              elo,
              matchId: null,
              placementMatchesPlayed: matchesPlayed,
              faction: msg.faction || "neutral",
              companionId: msg.companionId,
              emoteRateState: { timestamps: [] },
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

        case "SEND_EMOTE": {
          if (!player || !player.matchId) {
            send(ws, { type: "ERROR", message: "Not in a match" });
            return;
          }

          const emoteMatch = activeMatches.get(player.matchId);
          if (!emoteMatch) {
            send(ws, { type: "ERROR", message: "Match not found" });
            return;
          }

          // Validate the emote is allowed for this player
          const validation = validateEmote(msg.emoteId, player.faction, player.companionId);
          if (!validation.valid) {
            send(ws, { type: "ERROR", message: validation.error || "Invalid emote" });
            return;
          }

          // Check rate limit
          if (!canSendEmote(player.emoteRateState)) {
            const { getEmoteCooldownSeconds } = await import("@shared/pvpEmotes");
            const cooldown = getEmoteCooldownSeconds(player.emoteRateState);
            send(ws, { type: "EMOTE_RATE_LIMITED", cooldownSeconds: cooldown });
            return;
          }

          // Record the emote send
          player.emoteRateState = recordEmoteSend(player.emoteRateState);

          // Find the emote text
          const emote = ALL_EMOTES.find(e => e.id === msg.emoteId);
          if (!emote) {
            send(ws, { type: "ERROR", message: "Unknown emote" });
            return;
          }

          // Broadcast to both players and spectators
          const emoteMsg: ServerMessage = {
            type: "EMOTE",
            playerId: player.userId,
            playerName: player.userName,
            emoteId: msg.emoteId,
            emoteText: emote.text,
          };
          send(emoteMatch.player1.ws, emoteMsg);
          send(emoteMatch.player2.ws, emoteMsg);
          broadcastToSpectators(emoteMatch, emoteMsg);
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
          // Sanitize the requested display name and fall back to
          // "Spectator". Names are only used for chat attribution.
          const rawName = (msg.spectatorName ?? "").toString().trim();
          const safeName = rawName.length > 0
            // eslint-disable-next-line no-control-regex -- intentional: strip ASCII control chars from user chat input
            ? rawName.slice(0, 32).replace(/[\u0000-\u001f]/g, "")
            : "Spectator";
          spectatorNames.set(ws, safeName);

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

        case "SEND_SPECTATOR_CHAT": {
          // Must currently be spectating a match to send chat.
          const chatMatchId = spectatorConnections.get(ws);
          if (!chatMatchId) {
            send(ws, { type: "ERROR", message: "You must be spectating a match to chat" });
            return;
          }
          const chatMatch = activeMatches.get(chatMatchId);
          if (!chatMatch) {
            send(ws, { type: "ERROR", message: "Match has ended" });
            return;
          }

          // Rate limit: at most N messages per window.
          const now = Date.now();
          const history = (spectatorChatRate.get(ws) ?? [])
            .filter(t => now - t < SPECTATOR_CHAT_WINDOW_MS);
          if (history.length >= SPECTATOR_CHAT_MAX_PER_WINDOW) {
            const oldest = history[0];
            const cooldownSeconds = Math.ceil(
              (SPECTATOR_CHAT_WINDOW_MS - (now - oldest)) / 1000,
            );
            send(ws, { type: "SPECTATOR_CHAT_RATE_LIMITED", cooldownSeconds });
            return;
          }
          history.push(now);
          spectatorChatRate.set(ws, history);

          // Basic sanitation: strip control chars, collapse whitespace, trim.
          const cleanedText = msg.text
            // eslint-disable-next-line no-control-regex -- intentional: strip ASCII control chars from user chat input
            .replace(/[\u0000-\u001f]/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 200);
          if (cleanedText.length === 0) return;

          // Moderation filter — same shared `filterMessage` that
          // gates guild chat. Block list short-circuits the broadcast
          // entirely; mask/caps/spam normalisations flow through to
          // the broadcast text. The rate-limit history was already
          // recorded above, so a blocked attempt still counts toward
          // the burst budget — intentional, otherwise a player could
          // probe slurs at unlimited rate.
          const verdict = filterMessage(cleanedText);
          if (verdict.blocked) {
            send(ws, {
              type: "ERROR",
              message: "Your message was blocked by chat moderation.",
            });
            return;
          }

          const chatMsg: ServerMessage = {
            type: "SPECTATOR_CHAT",
            spectatorName: spectatorNames.get(ws) ?? "Spectator",
            text: verdict.sanitized,
            timestamp: now,
          };
          // Broadcast to all spectators of the same match (sender included
          // so their own client renders the message confirmation).
          Array.from(chatMatch.spectators).forEach(specWs => {
            send(specWs, chatMsg);
          });
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
