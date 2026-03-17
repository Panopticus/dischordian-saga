/* ═══════════════════════════════════════════════════════
   ADMIN ROUTER — Content management for site owner
   Role-gated: only admin users can access these procedures.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { users, cards, userCards, userProgress, contentRewards, contentParticipation } from "../../drizzle/schema";
import { eq, sql, desc, like, and } from "drizzle-orm";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const adminRouter = router({
  // ═══ DASHBOARD STATS ═══
  dashboardStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;

    const [userCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(users);
    const [cardCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(cards);
    const [activeUsers] = await db.select({ count: sql<number>`COUNT(*)` }).from(userProgress);
    const [participationCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(contentParticipation);

    return {
      totalUsers: Number(userCount?.count ?? 0),
      totalCards: Number(cardCount?.count ?? 0),
      activeGamePlayers: Number(activeUsers?.count ?? 0),
      contentParticipations: Number(participationCount?.count ?? 0),
    };
  }),

  // ═══ USER MANAGEMENT ═══
  listUsers: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(25),
      search: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { users: [], total: 0 };
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 25;
      const offset = (page - 1) * limit;

      const conditions: any[] = [];
      if (input?.search) {
        conditions.push(like(users.name, `%${input.search}%`));
      }
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [results, countResult] = await Promise.all([
        db.select().from(users).where(whereClause).orderBy(desc(users.createdAt)).limit(limit).offset(offset),
        db.select({ count: sql<number>`COUNT(*)` }).from(users).where(whereClause),
      ]);

      return {
        users: results.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          loginMethod: u.loginMethod,
          createdAt: u.createdAt?.toISOString(),
          lastSignedIn: u.lastSignedIn?.toISOString(),
        })),
        total: Number(countResult[0]?.count ?? 0),
      };
    }),

  updateUserRole: adminProcedure
    .input(z.object({
      userId: z.number(),
      role: z.enum(["user", "admin"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  // ═══ CARD MANAGEMENT ═══
  listCards: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(25),
      search: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { cards: [], total: 0 };
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 25;
      const offset = (page - 1) * limit;

      const conditions: any[] = [];
      if (input?.search) {
        conditions.push(like(cards.name, `%${input.search}%`));
      }
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [results, countResult] = await Promise.all([
        db.select().from(cards).where(whereClause).orderBy(desc(cards.createdAt)).limit(limit).offset(offset),
        db.select({ count: sql<number>`COUNT(*)` }).from(cards).where(whereClause),
      ]);

      return {
        cards: results,
        total: Number(countResult[0]?.count ?? 0),
      };
    }),

  updateCard: adminProcedure
    .input(z.object({
      cardId: z.string(),
      name: z.string().optional(),
      abilityText: z.string().optional(),
      flavorText: z.string().optional(),
      power: z.number().optional(),
      health: z.number().optional(),
      cost: z.number().optional(),
      isActive: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      const { cardId, ...updates } = input;
      const setObj: Record<string, unknown> = {};
      if (updates.name !== undefined) setObj.name = updates.name;
      if (updates.abilityText !== undefined) setObj.abilityText = updates.abilityText;
      if (updates.flavorText !== undefined) setObj.flavorText = updates.flavorText;
      if (updates.power !== undefined) setObj.power = updates.power;
      if (updates.health !== undefined) setObj.health = updates.health;
      if (updates.cost !== undefined) setObj.cost = updates.cost;
      if (updates.isActive !== undefined) setObj.isActive = updates.isActive;

      await db.update(cards).set(setObj).where(eq(cards.cardId, cardId));
      return { success: true };
    }),

  // ═══ GRANT CARD TO USER ═══
  grantCard: adminProcedure
    .input(z.object({
      userId: z.number(),
      cardId: z.string(),
      quantity: z.number().min(1).max(10).default(1),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      // Check if user already has this card
      const existing = await db.select()
        .from(userCards)
        .where(and(eq(userCards.userId, input.userId), eq(userCards.cardId, input.cardId)))
        .limit(1);

      if (existing.length > 0) {
        await db.update(userCards)
          .set({ quantity: sql`${userCards.quantity} + ${input.quantity}` })
          .where(and(eq(userCards.userId, input.userId), eq(userCards.cardId, input.cardId)));
      } else {
        await db.insert(userCards).values({
          userId: input.userId,
          cardId: input.cardId,
          quantity: input.quantity,
          isFoil: 0,
          cardLevel: 1,
          obtainedVia: "admin",
        });
      }
      return { success: true };
    }),

  // ═══ CONTENT REWARD MANAGEMENT ═══
  listContentRewards: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(contentRewards).orderBy(desc(contentRewards.createdAt));
  }),

  createContentReward: adminProcedure
    .input(z.object({
      contentType: z.string(),
      contentId: z.string(),
      rewardType: z.string(),
      rewardValue: z.string(),
      quantity: z.number().min(1).default(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      await db.insert(contentRewards).values(input);
      return { success: true };
    }),

  deleteContentReward: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      await db.delete(contentRewards).where(eq(contentRewards.id, input.id));
      return { success: true };
    }),
});
