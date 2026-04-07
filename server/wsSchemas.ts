/* ═══════════════════════════════════════════════════════
   ZOD SCHEMAS — WebSocket message validation for all WS handlers
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";

/* ─── PVP SCHEMAS ─── */

const pvpJoinQueue = z.object({
  type: z.literal("JOIN_QUEUE"),
  userId: z.number(),
  userName: z.string(),
  deck: z.array(z.string()),
  token: z.string().optional(),
  faction: z.string().optional(),
  companionId: z.string().optional(),
});

const pvpLeaveQueue = z.object({ type: z.literal("LEAVE_QUEUE") });
const pvpGameAction = z.object({ type: z.literal("GAME_ACTION"), action: z.object({}).passthrough() });
const pvpSurrender = z.object({ type: z.literal("SURRENDER") });
const pvpSendEmote = z.object({ type: z.literal("SEND_EMOTE"), emoteId: z.string() });
const pvpSpectate = z.object({ type: z.literal("SPECTATE"), matchId: z.string() });
const pvpStopSpectating = z.object({ type: z.literal("STOP_SPECTATING") });
const pvpPing = z.object({ type: z.literal("PING") });

export const pvpClientMessageSchema = z.discriminatedUnion("type", [
  pvpJoinQueue,
  pvpLeaveQueue,
  pvpGameAction,
  pvpSurrender,
  pvpSendEmote,
  pvpSpectate,
  pvpStopSpectating,
  pvpPing,
]);

/* ─── CHESS SCHEMAS ─── */

const chessJoinQueue = z.object({
  type: z.literal("JOIN_QUEUE"),
  userId: z.number(),
  userName: z.string(),
  characterId: z.string(),
});

const chessLeaveQueue = z.object({ type: z.literal("LEAVE_QUEUE") });
const chessMove = z.object({ type: z.literal("MOVE"), from: z.string(), to: z.string(), promotion: z.string().optional() });
const chessResign = z.object({ type: z.literal("RESIGN") });
const chessOfferDraw = z.object({ type: z.literal("OFFER_DRAW") });
const chessAcceptDraw = z.object({ type: z.literal("ACCEPT_DRAW") });
const chessDeclineDraw = z.object({ type: z.literal("DECLINE_DRAW") });
const chessSpectate = z.object({ type: z.literal("SPECTATE"), matchId: z.string() });
const chessStopSpectating = z.object({ type: z.literal("STOP_SPECTATING") });
const chessPing = z.object({ type: z.literal("PING") });

export const chessClientMessageSchema = z.discriminatedUnion("type", [
  chessJoinQueue,
  chessLeaveQueue,
  chessMove,
  chessResign,
  chessOfferDraw,
  chessAcceptDraw,
  chessDeclineDraw,
  chessSpectate,
  chessStopSpectating,
  chessPing,
]);

/* ─── DUELYST SCHEMAS ─── */

const duelystJoinQueue = z.object({
  type: z.literal("JOIN_QUEUE"),
  userId: z.number(),
  userName: z.string(),
  faction: z.string(),
  deckCardIds: z.array(z.string()),
});

const duelystLeaveQueue = z.object({ type: z.literal("LEAVE_QUEUE") });
const duelystGameAction = z.object({ type: z.literal("GAME_ACTION"), action: z.unknown() });
const duelystSurrender = z.object({ type: z.literal("SURRENDER") });
const duelystPing = z.object({ type: z.literal("PING") });

export const duelystClientMessageSchema = z.discriminatedUnion("type", [
  duelystJoinQueue,
  duelystLeaveQueue,
  duelystGameAction,
  duelystSurrender,
  duelystPing,
]);

/* ─── TERMINUS SCHEMAS ─── */

const terminusFindRaid = z.object({
  type: z.literal("FIND_RAID"),
  userId: z.number(),
  userName: z.string(),
  trophies: z.number(),
});

const terminusSkipBase = z.object({ type: z.literal("SKIP_BASE"), cost: z.number() });
const terminusStartAttack = z.object({ type: z.literal("START_ATTACK") });
const terminusReportTurretDestroyed = z.object({ type: z.literal("REPORT_TURRET_DESTROYED") });
const terminusReportCoreDestroyed = z.object({ type: z.literal("REPORT_CORE_DESTROYED") });
const terminusEndRaid = z.object({ type: z.literal("END_RAID"), duration: z.number() });
const terminusCancel = z.object({ type: z.literal("CANCEL") });
const terminusPing = z.object({ type: z.literal("PING") });

export const terminusClientMessageSchema = z.discriminatedUnion("type", [
  terminusFindRaid,
  terminusSkipBase,
  terminusStartAttack,
  terminusReportTurretDestroyed,
  terminusReportCoreDestroyed,
  terminusEndRaid,
  terminusCancel,
  terminusPing,
]);
