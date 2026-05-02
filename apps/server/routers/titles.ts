/* ═══════════════════════════════════════════════════════
   TITLES ROUTER — Catalog, Equip, Progression, Claim
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  userTitles,
  userCosmeticLoadout,
  userProgress,
} from "../../db/schema";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  TITLE_DEFINITIONS,
  getTitleDef,
  getAllRootKeys,
} from "@shared/titles/titleDefinitions";
import {
  describeRootProgression,
  isTitleUnlocked,
} from "@shared/titles/titleUnlockService";
import {
  awardEligibleTitles,
  buildTitleSnapshot,
  getEarnedTitleKeys,
} from "../services/titleService";
import { logger } from "../logger";

export const titlesRouter = router({
  /**
   * Public catalog — every title definition. Hidden titles are still
   * returned but flagged so the UI can render a locked "???" card.
   */
  getCatalog: publicProcedure.query(() => {
    return TITLE_DEFINITIONS.map((t) => ({
      titleKey: t.titleKey,
      rootKey: t.rootKey,
      tier: t.tier,
      name: t.hidden ? "???" : t.name,
      description: t.hidden ? "Hidden title — unlock to reveal." : t.description,
      flavorText: t.hidden ? undefined : t.flavorText,
      rarity: t.rarity,
      category: t.category,
      loredexEntityId: t.loredexEntityId,
      iconKey: t.iconKey,
      hidden: t.hidden ?? false,
      purchasable: t.purchasable,
    }));
  }),

  /** Every title the current user has earned (with definition payloads). */
  getMyTitles: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select()
      .from(userTitles)
      .where(eq(userTitles.userId, ctx.user.id))
      .orderBy(desc(userTitles.earnedAt));
    return rows.map((row) => {
      const def = getTitleDef(row.titleKey);
      return {
        titleKey: row.titleKey,
        earnedAt: row.earnedAt,
        seasonNumber: row.seasonNumber,
        discoveryRank: row.discoveryRank,
        definition: def
          ? {
              name: def.name,
              description: def.description,
              flavorText: def.flavorText,
              rarity: def.rarity,
              category: def.category,
              loredexEntityId: def.loredexEntityId,
              iconKey: def.iconKey,
              rootKey: def.rootKey,
              tier: def.tier,
            }
          : null,
      };
    });
  }),

  /** Currently equipped title/badge/frame for the current user. */
  getMyLoadout: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(userCosmeticLoadout)
      .where(eq(userCosmeticLoadout.userId, ctx.user.id))
      .limit(1);
    if (!rows[0]) return { equippedTitleKey: null, equippedBadgeKey: null, equippedFrameKey: null };
    return {
      equippedTitleKey: rows[0].equippedTitleKey,
      equippedBadgeKey: rows[0].equippedBadgeKey,
      equippedFrameKey: rows[0].equippedFrameKey,
    };
  }),

  /** Equip a title — must be owned by the current user. */
  equipTitle: protectedProcedure
    .input(z.object({ titleKey: z.string().min(1).max(96) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const def = getTitleDef(input.titleKey);
      if (!def) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Unknown title" });
      }
      const owned = await db
        .select({ id: userTitles.id })
        .from(userTitles)
        .where(and(eq(userTitles.userId, ctx.user.id), eq(userTitles.titleKey, input.titleKey)))
        .limit(1);
      if (!owned[0]) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Title not owned" });
      }
      await db
        .insert(userCosmeticLoadout)
        .values({
          userId: ctx.user.id,
          equippedTitleKey: input.titleKey,
        })
        .onDuplicateKeyUpdate({ set: { equippedTitleKey: input.titleKey } });

      // Mirror to legacy `userProgress.title` so existing surfaces
      // that still read the free-text field render the new value.
      await db
        .update(userProgress)
        .set({ title: def.name })
        .where(eq(userProgress.userId, ctx.user.id));
      return { ok: true, equippedTitleKey: input.titleKey };
    }),

  unequipTitle: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    await db
      .insert(userCosmeticLoadout)
      .values({ userId: ctx.user.id, equippedTitleKey: null })
      .onDuplicateKeyUpdate({ set: { equippedTitleKey: null } });
    await db
      .update(userProgress)
      .set({ title: "Recruit" })
      .where(eq(userProgress.userId, ctx.user.id));
    return { ok: true };
  }),

  /**
   * Re-evaluate eligibility and grant any newly-earned titles. Cheap
   * to call after content drops or as a manual nudge from the UI;
   * idempotent because of the (userId, titleKey) unique index.
   */
  claimNewlyUnlocked: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const granted = await awardEligibleTitles(ctx.user.id);
      return { granted };
    } catch (err) {
      logger.warn(
        "claimNewlyUnlocked_failed",
        "titlesRouter",
        { userId: ctx.user.id, error: String(err) },
      );
      return { granted: [] };
    }
  }),

  /**
   * Per-root progression view: highest tier earned + next tier's progress
   * fraction. Used by the Title Progressions UI to render multi-stage cards.
   */
  getTitleProgression: protectedProcedure
    .input(z.object({ rootKey: z.string().min(1).max(64) }).optional())
    .query(async ({ ctx, input }) => {
      const [snapshot, earned] = await Promise.all([
        buildTitleSnapshot(ctx.user.id),
        getEarnedTitleKeys(ctx.user.id),
      ]);
      const roots = input?.rootKey ? [input.rootKey] : getAllRootKeys();
      return roots.map((rk) => describeRootProgression(rk, snapshot, earned));
    }),

  /**
   * Resolve a list of users → their equipped title (for opponent /
   * spectator name plates). Public so the lobby can render names of
   * users we don't have a session for.
   */
  resolveEquippedTitles: publicProcedure
    .input(z.object({ userIds: z.array(z.number().int()).max(100) }))
    .query(async ({ input }) => {
      const result: Record<number, { titleKey: string; name: string } | null> = {};
      for (const id of input.userIds) result[id] = null;
      const db = await getDb();
      if (!db || input.userIds.length === 0) return result;
      const rows = await db
        .select({
          userId: userCosmeticLoadout.userId,
          equippedTitleKey: userCosmeticLoadout.equippedTitleKey,
        })
        .from(userCosmeticLoadout)
        .where(inArray(userCosmeticLoadout.userId, input.userIds));
      for (const row of rows) {
        if (row.equippedTitleKey) {
          const def = getTitleDef(row.equippedTitleKey);
          result[row.userId] = def
            ? { titleKey: row.equippedTitleKey, name: def.name }
            : null;
        }
      }
      return result;
    }),

  /**
   * Poll for unseen title grants — used by the global Title Toast
   * hook on the client. Returns every title earned in the last 30
   * minutes that hasn't been polled yet for this user. Idempotent
   * via a localStorage cursor on the client; server returns "all
   * recent" and the client filters.
   */
  pollRecentGrants: protectedProcedure
    .input(z.object({ sinceTimestamp: z.number().int().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const since = input?.sinceTimestamp
        ? new Date(input.sinceTimestamp)
        : new Date(Date.now() - 30 * 60_000);
      const rows = await db
        .select()
        .from(userTitles)
        .where(
          and(
            eq(userTitles.userId, ctx.user.id),
            sql`${userTitles.earnedAt} >= ${since}`,
          ),
        )
        .orderBy(desc(userTitles.earnedAt))
        .limit(20);
      return rows.map((r) => ({
        titleKey: r.titleKey,
        earnedAt: r.earnedAt,
      }));
    }),

  /** Snapshot of the title evaluator state — useful for debugging. */
  getMyProgressSnapshot: protectedProcedure.query(async ({ ctx }) => {
    const snapshot = await buildTitleSnapshot(ctx.user.id);
    return {
      level: snapshot.level,
      totalWins: snapshot.totalWins,
      totalRaidClears: snapshot.totalRaidClears,
      rankTiers: Object.fromEntries(snapshot.rankTiers),
      winsByGameType: Object.fromEntries(snapshot.winsByGameType),
      coopRoleMastery: Object.fromEntries(snapshot.coopRoleMastery),
      completedActs: [...snapshot.completedActs],
      secretActsRevealed: [...snapshot.secretActsRevealed],
      loredexDiscovered: [...snapshot.loredexDiscovered],
      mysterySolved: [...snapshot.mysterySolved],
      mysteryFirstSolved: [...snapshot.mysteryFirstSolved],
      kaelFragmentsUnlocked: [...snapshot.kaelFragmentsUnlocked],
      guildHallTier: snapshot.guildHallTier,
    };
  }),
});

// Re-export for hooks that want the helper without creating a cycle.
export { isTitleUnlocked };
