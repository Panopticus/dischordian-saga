/* ═══════════════════════════════════════════════════════
   EIDOLON BOND ROUTER — Soul Bond, Memorial & Community
   Tracks Eidolon companion bonds, memorial wall, and
   community-wide statistics.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { eidolonBonds, eidolonMemorial, dreamBalance } from "../../drizzle/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export const eidolonBondRouter = router({
  /* ─── GET MY BOND (protected) ─── */
  getMyBond: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const rows = await db
      .select()
      .from(eidolonBonds)
      .where(
        and(
          eq(eidolonBonds.userId, ctx.user.id),
          eq(eidolonBonds.isSoulBound, true),
        ),
      )
      .limit(1);

    return rows[0] ?? null;
  }),

  /* ─── INTERACT (protected) — daily interaction ─── */
  interact: protectedProcedure
    .input(
      z.object({
        action: z.enum(["feed", "talk", "train", "gift", "meditate"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      // Find the user's soul-bound Eidolon
      const rows = await db
        .select()
        .from(eidolonBonds)
        .where(
          and(
            eq(eidolonBonds.userId, ctx.user.id),
            eq(eidolonBonds.isSoulBound, true),
          ),
        )
        .limit(1);

      const bond = rows[0];
      if (!bond) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No soul-bound Eidolon found",
        });
      }

      if (bond.health === "dead") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your Eidolon has perished. Visit the memorial.",
        });
      }

      // Each action grants different bond/xp
      const rewards: Record<string, { bond: number; xp: number }> = {
        feed: { bond: 2, xp: 10 },
        talk: { bond: 3, xp: 5 },
        train: { bond: 1, xp: 20 },
        gift: { bond: 5, xp: 8 },
        meditate: { bond: 4, xp: 15 },
      };

      const reward = rewards[input.action];

      await db
        .update(eidolonBonds)
        .set({
          bond: sql`${eidolonBonds.bond} + ${reward.bond}`,
          xp: sql`${eidolonBonds.xp} + ${reward.xp}`,
          lastInteraction: new Date(),
          lastFed: input.action === "feed" ? new Date() : bond.lastFed,
        })
        .where(eq(eidolonBonds.id, bond.id));

      return {
        success: true,
        action: input.action,
        bondGained: reward.bond,
        xpGained: reward.xp,
      };
    }),

  /* ─── GET MEMORIAL (public) — paginated memorial wall ─── */
  getMemorial: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(20),
          offset: z.number().min(0).default(0),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { entries: [], total: 0 };

      const limit = input?.limit ?? 20;
      const offset = input?.offset ?? 0;

      const entries = await db
        .select()
        .from(eidolonMemorial)
        .orderBy(desc(eidolonMemorial.daysActive))
        .limit(limit)
        .offset(offset);

      const countRows = await db
        .select({ count: sql<number>`count(*)` })
        .from(eidolonMemorial);

      return {
        entries,
        total: countRows[0]?.count ?? 0,
      };
    }),

  /* ─── ADD FLOWER (protected) — costs 1 Dream ─── */
  addFlower: protectedProcedure
    .input(z.object({ memorialId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database unavailable",
        });

      // Check memorial exists
      const memRows = await db
        .select()
        .from(eidolonMemorial)
        .where(eq(eidolonMemorial.id, input.memorialId))
        .limit(1);

      if (!memRows[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Memorial entry not found",
        });
      }

      // Check user has at least 1 Dream
      const balanceRows = await db
        .select()
        .from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id))
        .limit(1);

      const balance = balanceRows[0];
      if (!balance || balance.dreamTokens < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You need at least 1 Dream to leave a flower",
        });
      }

      // Deduct 1 Dream and add flower
      await db
        .update(dreamBalance)
        .set({
          dreamTokens: sql`${dreamBalance.dreamTokens} - 1`,
        })
        .where(eq(dreamBalance.userId, ctx.user.id));

      await db
        .update(eidolonMemorial)
        .set({
          flowers: sql`${eidolonMemorial.flowers} + 1`,
        })
        .where(eq(eidolonMemorial.id, input.memorialId));

      return { success: true };
    }),

  /* ─── GET COMMUNITY STATS (public) ─── */
  getCommunityStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db)
      return {
        totalBonds: 0,
        totalDeaths: 0,
        longestActiveDays: 0,
        mostFlowers: 0,
      };

    const bondStats = await db
      .select({
        totalBonds: sql<number>`count(*)`,
        totalDeaths: sql<number>`sum(${eidolonBonds.deathCount})`,
      })
      .from(eidolonBonds);

    const longestRows = await db
      .select({ daysActive: eidolonMemorial.daysActive })
      .from(eidolonMemorial)
      .orderBy(desc(eidolonMemorial.daysActive))
      .limit(1);

    const flowerRows = await db
      .select({ flowers: eidolonMemorial.flowers })
      .from(eidolonMemorial)
      .orderBy(desc(eidolonMemorial.flowers))
      .limit(1);

    return {
      totalBonds: bondStats[0]?.totalBonds ?? 0,
      totalDeaths: bondStats[0]?.totalDeaths ?? 0,
      longestActiveDays: longestRows[0]?.daysActive ?? 0,
      mostFlowers: flowerRows[0]?.flowers ?? 0,
    };
  }),

  /* ─── GET BOND TITLES (protected) — titles earned by bond duration ─── */
  getBondTitles: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { titles: [], currentTitle: null };

    const rows = await db
      .select()
      .from(eidolonBonds)
      .where(
        and(
          eq(eidolonBonds.userId, ctx.user.id),
          eq(eidolonBonds.isSoulBound, true),
        ),
      )
      .limit(1);

    const bond = rows[0];
    if (!bond) return { titles: [], currentTitle: null };

    // Calculate days since binding
    const daysBound = Math.floor(
      (Date.now() - new Date(bond.boundAt).getTime()) / (1000 * 60 * 60 * 24),
    );

    const titleThresholds = [
      { days: 1, title: "Bonded" },
      { days: 7, title: "Kindred Spirit" },
      { days: 30, title: "Soul Keeper" },
      { days: 90, title: "Eternal Guardian" },
      { days: 180, title: "Mythic Resonance" },
      { days: 365, title: "Transcendent Bond" },
    ];

    const earned = titleThresholds.filter((t) => daysBound >= t.days);
    const currentTitle = earned.length > 0 ? earned[earned.length - 1].title : null;

    return {
      titles: earned.map((t) => t.title),
      currentTitle,
      daysBound,
    };
  }),
});
