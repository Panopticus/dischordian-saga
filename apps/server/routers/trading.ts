/* ═══════════════════════════════════════════════════════
   CARD TRADING ROUTER — Create, accept, decline trades
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { logger } from "../logger";
import { eq, and, or, desc, sql } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { procedureRateLimit } from "../_core/procedureRateLimit";
import { getDb } from "../db";
import { trackTradeComplete, trackCollectionSize } from "../achievementTracker";
import { cardTrades, userCards, dreamBalance, users, notifications } from "../../db/schema";
import { ripple } from "../services/rippleEngine";

const tradeCardSchema = z.object({ cardId: z.string(), quantity: z.number().min(1).max(10) });

export const tradingRouter = router({
  /** Create a trade offer */
  createOffer: protectedProcedure
    .use(procedureRateLimit({ windowMs: 60_000, max: 20 }))
    .input(z.object({
      receiverId: z.number(),
      senderCards: z.array(tradeCardSchema).min(0),
      receiverCards: z.array(tradeCardSchema).min(0),
      senderDream: z.number().min(0).max(10000).default(0),
      receiverDream: z.number().min(0).max(10000).default(0),
      message: z.string().max(256).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };
      if (ctx.user.id === input.receiverId) return { success: false, error: "Cannot trade with yourself" };
      if (input.senderCards.length === 0 && input.receiverCards.length === 0 && input.senderDream === 0 && input.receiverDream === 0) {
        return { success: false, error: "Trade must include at least one item" };
      }

      // Verify sender owns the offered cards
      for (const card of input.senderCards) {
        const [owned] = await db.select().from(userCards)
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, card.cardId))).limit(1);
        if (!owned || owned.quantity < card.quantity) {
          return { success: false, error: `You don't own enough copies of ${card.cardId}` };
        }
      }

      // Verify sender has enough Dream
      if (input.senderDream > 0) {
        const [bal] = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        const total = (bal?.dreamTokens || 0) + (bal?.soulBoundDream || 0);
        if (total < input.senderDream) return { success: false, error: "Not enough Dream tokens" };
      }

      const [result] = await db.insert(cardTrades).values({
        senderId: ctx.user.id,
        receiverId: input.receiverId,
        senderCards: input.senderCards,
        receiverCards: input.receiverCards,
        senderDream: input.senderDream,
        receiverDream: input.receiverDream,
        message: input.message || null,
      });

      // Notify receiver about the trade offer
      db.insert(notifications).values({
        userId: input.receiverId,
        type: "trade_offer",
        title: "New Trade Offer",
        message: `${ctx.user.name || "An operative"} sent you a trade offer.`,
        actionUrl: "/trading",
      }).catch(e => logger.error("[Trading] Notification send failed:", e));
      return { success: true, tradeId: Number(result.insertId) };
    }),
  /** Accept a trade offer */
  acceptTrade: protectedProcedure
    .use(procedureRateLimit({ windowMs: 60_000, max: 30 }))
    .input(z.object({ tradeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [trade] = await db.select().from(cardTrades).where(eq(cardTrades.id, input.tradeId)).limit(1);
      if (!trade) return { success: false, error: "Trade not found" };
      if (trade.receiverId !== ctx.user.id) return { success: false, error: "Not your trade to accept" };
      if (trade.status !== "pending") return { success: false, error: "Trade is no longer pending" };

      // Verify receiver owns the requested cards
      for (const card of trade.receiverCards) {
        const [owned] = await db.select().from(userCards)
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, card.cardId))).limit(1);
        if (!owned || owned.quantity < card.quantity) {
          return { success: false, error: `You don't own enough copies of ${card.cardId}` };
        }
      }

      // Verify receiver Dream balance
      if (trade.receiverDream > 0) {
        const [bal] = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        const total = (bal?.dreamTokens || 0) + (bal?.soulBoundDream || 0);
        if (total < trade.receiverDream) return { success: false, error: "Not enough Dream tokens" };
      }

      // Execute the trade in a transaction for atomicity
      await db.transaction(async (tx) => {
        // Sender cards → Receiver
        for (const card of trade.senderCards) {
          await tx.update(userCards)
            .set({ quantity: sql`GREATEST(0, quantity - ${card.quantity})` })
            .where(and(eq(userCards.userId, trade.senderId), eq(userCards.cardId, card.cardId)));
          const [existing] = await tx.select().from(userCards)
            .where(and(eq(userCards.userId, trade.receiverId), eq(userCards.cardId, card.cardId))).limit(1);
          if (existing) {
            await tx.update(userCards)
              .set({ quantity: sql`quantity + ${card.quantity}` })
              .where(eq(userCards.id, existing.id));
          } else {
            await tx.insert(userCards).values({
              userId: trade.receiverId, cardId: card.cardId, quantity: card.quantity, obtainedVia: "trade",
            });
          }
        }

        // Receiver cards → Sender
        for (const card of trade.receiverCards) {
          await tx.update(userCards)
            .set({ quantity: sql`GREATEST(0, quantity - ${card.quantity})` })
            .where(and(eq(userCards.userId, trade.receiverId), eq(userCards.cardId, card.cardId)));
          const [existing] = await tx.select().from(userCards)
            .where(and(eq(userCards.userId, trade.senderId), eq(userCards.cardId, card.cardId))).limit(1);
          if (existing) {
            await tx.update(userCards)
              .set({ quantity: sql`quantity + ${card.quantity}` })
              .where(eq(userCards.id, existing.id));
          } else {
            await tx.insert(userCards).values({
              userId: trade.senderId, cardId: card.cardId, quantity: card.quantity, obtainedVia: "trade",
            });
          }
        }

        // Transfer Dream tokens
        if (trade.senderDream > 0) {
          await tx.update(dreamBalance)
            .set({ dreamTokens: sql`GREATEST(0, dreamTokens - ${trade.senderDream})` })
            .where(eq(dreamBalance.userId, trade.senderId));
          await tx.update(dreamBalance)
            .set({ dreamTokens: sql`dreamTokens + ${trade.senderDream}` })
            .where(eq(dreamBalance.userId, trade.receiverId));
        }
        if (trade.receiverDream > 0) {
          await tx.update(dreamBalance)
            .set({ dreamTokens: sql`GREATEST(0, dreamTokens - ${trade.receiverDream})` })
            .where(eq(dreamBalance.userId, trade.receiverId));
          await tx.update(dreamBalance)
            .set({ dreamTokens: sql`dreamTokens + ${trade.receiverDream}` })
            .where(eq(dreamBalance.userId, trade.senderId));
        }

        // Mark trade as accepted
        await tx.update(cardTrades).set({ status: "accepted" }).where(eq(cardTrades.id, input.tradeId));
      });

      // Notify sender that their trade was accepted
      db.insert(notifications).values({
        userId: trade.senderId,
        type: "trade_accepted",
        title: "Trade Accepted!",
        message: `Your trade offer was accepted by ${ctx.user.name || "another operative"}.`,
        actionUrl: "/trading",
      }).catch(e => logger.error("[Trading] Notification send failed:", e));
      // Achievement auto-tracking for both parties (outside transaction)
      trackTradeComplete(trade.senderId).catch(e => console.error("[Trading] Achievement error:", e));
      trackTradeComplete(ctx.user.id).catch(e => console.error("[Trading] Achievement error:", e));
      trackCollectionSize(trade.senderId).catch(e => console.error("[Trading] Collection tracking error:", e));
      trackCollectionSize(ctx.user.id).catch(e => console.error("[Trading] Collection tracking error:", e));

      // Award class mastery XP for trading
      const { awardClassXp } = await import("../classMasteryHelper");
      awardClassXp(trade.senderId, "trade_card").catch(e => logger.error("[Trading] Class XP award failed:", e));
      awardClassXp(ctx.user.id, "trade_card").catch(e => logger.error("[Trading] Class XP award failed:", e));

      // Award civil skill XP for completed trade (negotiation + diplomacy)
      const { awardCivilXp } = await import("../civilSkillHelper");
      awardCivilXp(trade.senderId, "complete_trade").catch(e => logger.error("[Trading] Civil XP award failed:", e));
      awardCivilXp(ctx.user.id, "complete_trade").catch(e => logger.error("[Trading] Civil XP award failed:", e));

      await ripple.emit("card_trade_complete", { userId: ctx.user.id, partnerId: trade.senderId });

      return { success: true };
    }),

  /**
   * Counter a pending trade offer with modified terms. Declines the
   * original offer and creates a new trade in the reverse direction
   * (the original receiver becomes the new sender, proposing revised
   * terms back). Preserves a `counterOf` breadcrumb via the message
   * field so the UI can render the negotiation chain.
   */
  counterOffer: protectedProcedure
    .use(procedureRateLimit({ windowMs: 60_000, max: 30 }))
    .input(z.object({
      tradeId: z.number(),
      senderCards: z.array(tradeCardSchema).min(0),
      receiverCards: z.array(tradeCardSchema).min(0),
      senderDream: z.number().min(0).max(10000).default(0),
      receiverDream: z.number().min(0).max(10000).default(0),
      message: z.string().max(200).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [original] = await db.select().from(cardTrades)
        .where(eq(cardTrades.id, input.tradeId)).limit(1);
      if (!original) return { success: false, error: "Trade not found" };
      if (original.status !== "pending") {
        return { success: false, error: "Trade is no longer pending" };
      }
      if (original.receiverId !== ctx.user.id) {
        return { success: false, error: "Only the receiver can counter a trade" };
      }
      if (input.senderCards.length === 0 && input.receiverCards.length === 0 && input.senderDream === 0 && input.receiverDream === 0) {
        return { success: false, error: "Counter-offer must include at least one item" };
      }

      // Verify the new sender (ctx.user = original receiver) owns what they're offering.
      for (const card of input.senderCards) {
        const [owned] = await db.select().from(userCards)
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, card.cardId))).limit(1);
        if (!owned || owned.quantity < card.quantity) {
          return { success: false, error: `You don't own enough copies of ${card.cardId}` };
        }
      }
      if (input.senderDream > 0) {
        const [bal] = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        const total = (bal?.dreamTokens || 0) + (bal?.soulBoundDream || 0);
        if (total < input.senderDream) return { success: false, error: "Not enough Dream tokens" };
      }

      // Decline the original offer.
      await db.update(cardTrades)
        .set({ status: "declined" })
        .where(eq(cardTrades.id, input.tradeId));

      // Insert the counter-offer with flipped direction. Keep a short
      // breadcrumb so the receiver sees this is a counter, not a cold
      // trade proposal.
      const counterMessage = `[Counter to #${input.tradeId}] ${input.message ?? ""}`.slice(0, 256);
      const [result] = await db.insert(cardTrades).values({
        senderId: ctx.user.id,
        receiverId: original.senderId,
        senderCards: input.senderCards,
        receiverCards: input.receiverCards,
        senderDream: input.senderDream,
        receiverDream: input.receiverDream,
        message: counterMessage,
      });

      // Notify the original sender that their trade has a counter.
      db.insert(notifications).values({
        userId: original.senderId,
        type: "trade_offer",
        title: "Counter-Offer Received",
        message: `${ctx.user.name || "An operative"} sent a counter to your trade offer.`,
        actionUrl: "/trading",
      }).catch(e => logger.error("[Trading] Notification send failed:", e));

      return {
        success: true,
        counterTradeId: Number(result.insertId),
        originalTradeId: input.tradeId,
      };
    }),

  /** Decline a trade offer */
  declineTrade: protectedProcedure
    .use(procedureRateLimit({ windowMs: 60_000, max: 30 }))
    .input(z.object({ tradeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const [trade] = await db.select().from(cardTrades).where(eq(cardTrades.id, input.tradeId)).limit(1);
      if (!trade) return { success: false, error: "Trade not found" };
      if (trade.receiverId !== ctx.user.id && trade.senderId !== ctx.user.id) {
        return { success: false, error: "Not your trade" };
      }
      if (trade.status !== "pending") return { success: false, error: "Trade is no longer pending" };

      const newStatus = trade.senderId === ctx.user.id ? "cancelled" : "declined";
      await db.update(cardTrades).set({ status: newStatus as any }).where(eq(cardTrades.id, input.tradeId));

      return { success: true };
    }),

  /** Get my pending trades (sent and received) */
  getMyTrades: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { sent: [], received: [] };

    const sent = await db.select().from(cardTrades)
      .where(eq(cardTrades.senderId, ctx.user.id))
      .orderBy(desc(cardTrades.createdAt))
      .limit(50);

    const received = await db.select().from(cardTrades)
      .where(eq(cardTrades.receiverId, ctx.user.id))
      .orderBy(desc(cardTrades.createdAt))
      .limit(50);

    // Enrich with user names
    const enrichTrade = async (trade: typeof sent[0]) => {
      const [sender] = await db.select({ name: users.name }).from(users).where(eq(users.id, trade.senderId)).limit(1);
      const [receiver] = await db.select({ name: users.name }).from(users).where(eq(users.id, trade.receiverId)).limit(1);
      return { ...trade, senderName: sender?.name || "Unknown", receiverName: receiver?.name || "Unknown" };
    };

    return {
      sent: await Promise.all(sent.map(enrichTrade)),
      received: await Promise.all(received.map(enrichTrade)),
    };
  }),

  /**
   * Compute a user's trade reputation score derived from the cardTrades
   * table. No schema migration — reputation is simply:
   *
   *   +5 per accepted trade the user participated in
   *   -1 per declined trade they initiated
   *
   * A minimum of 0 is enforced so cancelled/declined-heavy accounts
   * don't go negative. The query returns totals + the raw score so the
   * UI can show "3 deals completed" alongside the reputation badge.
   */
  getTradeReputation: protectedProcedure
    .input(z.object({ userId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { score: 0, completed: 0, declined: 0 };

      const targetId = input?.userId ?? ctx.user.id;

      const [completedResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(cardTrades)
        .where(and(
          eq(cardTrades.status, "accepted"),
          or(eq(cardTrades.senderId, targetId), eq(cardTrades.receiverId, targetId)),
        ));
      const completed = Number(completedResult?.count ?? 0);

      const [declinedResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(cardTrades)
        .where(and(
          eq(cardTrades.status, "declined"),
          eq(cardTrades.senderId, targetId),
        ));
      const declined = Number(declinedResult?.count ?? 0);

      const score = Math.max(0, completed * 5 - declined);
      const badge =
        score >= 200 ? "legendary_trader" :
        score >= 100 ? "master_trader" :
        score >= 50 ? "veteran_trader" :
        score >= 20 ? "trusted_trader" :
        score >= 5 ? "novice_trader" :
        "unverified";

      return { score, completed, declined, badge };
    }),

  /** Search for players to trade with */
  searchPlayers: protectedProcedure
    .input(z.object({ query: z.string().min(1).max(100) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const results = await db.select({ id: users.id, name: users.name })
        .from(users)
        .where(sql`${users.name} LIKE ${`%${input.query}%`} AND ${users.id} != ${ctx.user.id}`)
        .limit(10);

      return results;
    }),

  /** Get trade history (completed trades) with cursor-based pagination */
  getTradeHistory: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(20),
      cursor: z.number().optional(), // trade ID cursor
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { items: [], nextCursor: null };

      const limit = input?.limit ?? 20;
      const cursor = input?.cursor;

      const query = db.select().from(cardTrades)
        .where(and(
          or(eq(cardTrades.senderId, ctx.user.id), eq(cardTrades.receiverId, ctx.user.id)),
          eq(cardTrades.status, "accepted"),
          cursor ? sql`${cardTrades.id} < ${cursor}` : undefined,
        ))
        .orderBy(desc(cardTrades.id))
        .limit(limit + 1);

      const results = await query;
      const hasMore = results.length > limit;
      const items = hasMore ? results.slice(0, limit) : results;
      const nextCursor = hasMore ? items[items.length - 1]?.id : null;

      return { items, nextCursor };
    }),
});
