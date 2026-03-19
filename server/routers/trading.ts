/* ═══════════════════════════════════════════════════════
   CARD TRADING ROUTER — Create, accept, decline trades
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq, and, or, desc, sql } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { cardTrades, userCards, dreamBalance, users } from "../../drizzle/schema";

const tradeCardSchema = z.object({ cardId: z.string(), quantity: z.number().min(1).max(10) });

export const tradingRouter = router({
  /** Create a trade offer */
  createOffer: protectedProcedure
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

      return { success: true, tradeId: result.insertId };
    }),

  /** Accept a trade offer */
  acceptTrade: protectedProcedure
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

      // Execute the trade — transfer cards
      // Sender cards → Receiver
      for (const card of trade.senderCards) {
        // Deduct from sender
        await db.update(userCards)
          .set({ quantity: sql`GREATEST(0, quantity - ${card.quantity})` })
          .where(and(eq(userCards.userId, trade.senderId), eq(userCards.cardId, card.cardId)));
        // Add to receiver
        const [existing] = await db.select().from(userCards)
          .where(and(eq(userCards.userId, trade.receiverId), eq(userCards.cardId, card.cardId))).limit(1);
        if (existing) {
          await db.update(userCards)
            .set({ quantity: sql`quantity + ${card.quantity}` })
            .where(eq(userCards.id, existing.id));
        } else {
          await db.insert(userCards).values({
            userId: trade.receiverId, cardId: card.cardId, quantity: card.quantity, obtainedVia: "trade",
          });
        }
      }

      // Receiver cards → Sender
      for (const card of trade.receiverCards) {
        await db.update(userCards)
          .set({ quantity: sql`GREATEST(0, quantity - ${card.quantity})` })
          .where(and(eq(userCards.userId, trade.receiverId), eq(userCards.cardId, card.cardId)));
        const [existing] = await db.select().from(userCards)
          .where(and(eq(userCards.userId, trade.senderId), eq(userCards.cardId, card.cardId))).limit(1);
        if (existing) {
          await db.update(userCards)
            .set({ quantity: sql`quantity + ${card.quantity}` })
            .where(eq(userCards.id, existing.id));
        } else {
          await db.insert(userCards).values({
            userId: trade.senderId, cardId: card.cardId, quantity: card.quantity, obtainedVia: "trade",
          });
        }
      }

      // Transfer Dream tokens
      if (trade.senderDream > 0) {
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`GREATEST(0, dreamTokens - ${trade.senderDream})` })
          .where(eq(dreamBalance.userId, trade.senderId));
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`dreamTokens + ${trade.senderDream}` })
          .where(eq(dreamBalance.userId, trade.receiverId));
      }
      if (trade.receiverDream > 0) {
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`GREATEST(0, dreamTokens - ${trade.receiverDream})` })
          .where(eq(dreamBalance.userId, trade.receiverId));
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`dreamTokens + ${trade.receiverDream}` })
          .where(eq(dreamBalance.userId, trade.senderId));
      }

      // Mark trade as accepted
      await db.update(cardTrades).set({ status: "accepted" }).where(eq(cardTrades.id, input.tradeId));

      return { success: true };
    }),

  /** Decline a trade offer */
  declineTrade: protectedProcedure
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

  /** Get trade history (completed trades) */
  getTradeHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const history = await db.select().from(cardTrades)
      .where(and(
        or(eq(cardTrades.senderId, ctx.user.id), eq(cardTrades.receiverId, ctx.user.id)),
        eq(cardTrades.status, "accepted"),
      ))
      .orderBy(desc(cardTrades.updatedAt))
      .limit(20);

    return history;
  }),
});
