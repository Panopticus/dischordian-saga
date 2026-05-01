/* ═══════════════════════════════════════════════════════
   PVP TELEMETRY ROUTER — Aggregate read-only stats for the
   new PvP overhaul systems. Powers admin dashboards and
   per-tier funnel views.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, adminProcedure, publicProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  userTitles,
  competitiveRatings,
  userClueProgress,
  guildClueProgress,
  discoveryEvents,
  guildQuestProgress,
  guildUnlockedPerks,
  apprenticeTrialCompletions,
} from "../../db/schema";
import { sql, and, eq } from "drizzle-orm";
import {
  TITLE_DEFINITIONS,
  getTitleDef,
} from "@shared/titles/titleDefinitions";

export const pvpTelemetryRouter = router({
  /**
   * Title funnels: how many users have unlocked each tier of each
   * progression. Tier 1 vs Tier 3 grant counts answer
   * "where do players drop off?"
   */
  getTitleFunnels: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select({
        titleKey: userTitles.titleKey,
        count: sql<number>`COUNT(*)`,
      })
      .from(userTitles)
      .groupBy(userTitles.titleKey);
    const counts = new Map<string, number>(rows.map((r) => [r.titleKey, Number(r.count)]));

    // Group by rootKey for funnel view.
    const byRoot = new Map<string, Array<{ titleKey: string; tier: number; name: string; rarity: string; count: number }>>();
    for (const def of TITLE_DEFINITIONS) {
      const list = byRoot.get(def.rootKey) ?? [];
      list.push({
        titleKey: def.titleKey,
        tier: def.tier,
        name: def.name,
        rarity: def.rarity,
        count: counts.get(def.titleKey) ?? 0,
      });
      byRoot.set(def.rootKey, list);
    }
    const result = [];
    for (const [rootKey, tiers] of byRoot) {
      tiers.sort((a, b) => a.tier - b.tier);
      result.push({ rootKey, tiers });
    }
    return result;
  }),

  /** Public-friendly leaderboard count summary — no PII. */
  getPublicGrantSummary: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalGrants: 0, distinctTitles: 0 };
    const totalRow = await db
      .select({
        count: sql<number>`COUNT(*)`,
        distinct: sql<number>`COUNT(DISTINCT title_key)`,
      })
      .from(userTitles);
    return {
      totalGrants: Number(totalRow[0]?.count ?? 0),
      distinctTitles: Number(totalRow[0]?.distinct ?? 0),
    };
  }),

  /** Competitive ratings distribution by tier per gameType. */
  getRatingDistribution: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select({
        gameType: competitiveRatings.gameType,
        rankTier: competitiveRatings.rankTier,
        count: sql<number>`COUNT(*)`,
      })
      .from(competitiveRatings)
      .groupBy(competitiveRatings.gameType, competitiveRatings.rankTier);
    return rows.map((r) => ({
      gameType: r.gameType,
      rankTier: r.rankTier,
      count: Number(r.count),
    }));
  }),

  /**
   * Conspiracy clue-drop telemetry. Counts unique clues collected
   * per board to identify drop-rate bottlenecks. Also surfaces
   * solve-rate and first-discoverer turnover.
   */
  getConspiracyTelemetry: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { boardStats: [], reveals: [] };

    const userBoardRows = await db
      .select({
        boardKey: userClueProgress.boardKey,
        users: sql<number>`COUNT(DISTINCT user_id)`,
        solved: sql<number>`SUM(CASE WHEN solved_at IS NOT NULL THEN 1 ELSE 0 END)`,
      })
      .from(userClueProgress)
      .groupBy(userClueProgress.boardKey);
    const guildBoardRows = await db
      .select({
        boardKey: guildClueProgress.boardKey,
        guilds: sql<number>`COUNT(DISTINCT guild_id)`,
        solvedGuilds: sql<number>`SUM(CASE WHEN solved_at IS NOT NULL THEN 1 ELSE 0 END)`,
      })
      .from(guildClueProgress)
      .groupBy(guildClueProgress.boardKey);

    const guildByBoard = new Map(guildBoardRows.map((r) => [r.boardKey, r]));
    const boardStats = userBoardRows.map((u) => {
      const g = guildByBoard.get(u.boardKey);
      return {
        boardKey: u.boardKey,
        usersTouched: Number(u.users),
        usersSolved: Number(u.solved ?? 0),
        guildsRacing: Number(g?.guilds ?? 0),
        guildsSolved: Number(g?.solvedGuilds ?? 0),
      };
    });

    const reveals = await db
      .select({
        eventKey: discoveryEvents.eventKey,
        firstDiscovererUserId: discoveryEvents.firstDiscovererUserId,
        firstDiscovererGuildId: discoveryEvents.firstDiscovererGuildId,
        discoveredAt: discoveryEvents.discoveredAt,
      })
      .from(discoveryEvents)
      .orderBy(discoveryEvents.discoveredAt);

    return { boardStats, reveals };
  }),

  /** Guild quest completion rates by scope. */
  getGuildQuestStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select({
        questKey: guildQuestProgress.questKey,
        active: sql<number>`COUNT(*)`,
        completed: sql<number>`SUM(CASE WHEN completed_at IS NOT NULL THEN 1 ELSE 0 END)`,
        claimed: sql<number>`SUM(CASE WHEN reward_claimed = 1 THEN 1 ELSE 0 END)`,
      })
      .from(guildQuestProgress)
      .groupBy(guildQuestProgress.questKey);
    return rows.map((r) => ({
      questKey: r.questKey,
      activeGuilds: Number(r.active),
      completedGuilds: Number(r.completed ?? 0),
      claimedGuilds: Number(r.claimed ?? 0),
    }));
  }),

  /** Guild perk uptake by perkKey. */
  getGuildPerkStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select({
        perkKey: guildUnlockedPerks.perkKey,
        guilds: sql<number>`COUNT(DISTINCT guild_id)`,
      })
      .from(guildUnlockedPerks)
      .groupBy(guildUnlockedPerks.perkKey);
    return rows.map((r) => ({
      perkKey: r.perkKey,
      guildsWithPerk: Number(r.guilds),
    }));
  }),

  /** Apprentice Trial summary — attendance vs graduation. */
  getApprenticeTrialStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { attended: 0, graduated: 0, distinctUsers: 0 };
    const rows = await db
      .select({
        attended: sql<number>`COUNT(*)`,
        graduated: sql<number>`SUM(CASE WHEN graduated = 1 THEN 1 ELSE 0 END)`,
        distinctUsers: sql<number>`COUNT(DISTINCT user_id)`,
      })
      .from(apprenticeTrialCompletions);
    return {
      attended: Number(rows[0]?.attended ?? 0),
      graduated: Number(rows[0]?.graduated ?? 0),
      distinctUsers: Number(rows[0]?.distinctUsers ?? 0),
    };
  }),

  /** Resolve a single titleKey for human-readable display in dashboards. */
  resolveTitle: publicProcedure
    .input(z.object({ titleKey: z.string().min(1).max(96) }))
    .query(({ input }) => {
      const def = getTitleDef(input.titleKey);
      if (!def) return null;
      return {
        titleKey: def.titleKey,
        rootKey: def.rootKey,
        tier: def.tier,
        name: def.name,
        rarity: def.rarity,
        category: def.category,
      };
    }),
});
