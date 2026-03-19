/* ═══════════════════════════════════════════════════════
   PVP ROUTER — Decks, Leaderboard, Seasons, Spectator
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  pvpMatches, pvpLeaderboard, pvpDecks, pvpSeasons, pvpSeasonRecords, users,
} from "../../drizzle/schema";
import { eq, desc, and, or, sql, asc } from "drizzle-orm";
import { getRankTier } from "@shared/pvpBattle";

/* ─── DECK RULES ─── */
const MAX_DECK_SIZE = 30;
const MIN_DECK_SIZE = 15;
const MAX_COPIES_PER_CARD = 2;
const MAX_LEGENDARY = 4;
const MAX_EPIC = 8;
const MAX_SAVED_DECKS = 10;

/* ─── TIER THRESHOLDS (for progress bars) ─── */
const TIER_THRESHOLDS: Record<string, { min: number; max: number }> = {
  bronze: { min: 0, max: 1199 },
  silver: { min: 1200, max: 1399 },
  gold: { min: 1400, max: 1599 },
  platinum: { min: 1600, max: 1799 },
  diamond: { min: 1800, max: 1999 },
  master: { min: 2000, max: 2199 },
  grandmaster: { min: 2200, max: 9999 },
};

export const pvpRouter = router({
  /* ═══ LEADERBOARD ═══ */
  getLeaderboard: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(pvpLeaderboard)
      .orderBy(desc(pvpLeaderboard.elo))
      .limit(50);
  }),

  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(pvpLeaderboard)
      .where(eq(pvpLeaderboard.userId, ctx.user.id))
      .limit(1);
    if (!rows[0]) return null;
    const row = rows[0];
    const tier = row.rankTier;
    const thresholds = TIER_THRESHOLDS[tier] || TIER_THRESHOLDS.bronze;
    const progressInTier = Math.min(1, Math.max(0, (row.elo - thresholds.min) / (thresholds.max - thresholds.min + 1)));
    return { ...row, progressInTier, nextTier: getNextTier(tier), eloToNextTier: Math.max(0, thresholds.max + 1 - row.elo) };
  }),

  getMatchHistory: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const limit = input?.limit ?? 20;
      const matches = await db
        .select()
        .from(pvpMatches)
        .where(or(eq(pvpMatches.player1Id, ctx.user.id), eq(pvpMatches.player2Id, ctx.user.id)))
        .orderBy(desc(pvpMatches.startedAt))
        .limit(limit);

      const enriched = await Promise.all(
        matches.map(async (match) => {
          const opponentId = match.player1Id === ctx.user.id ? match.player2Id : match.player1Id;
          let opponentName = "Unknown";
          if (opponentId) {
            const userRows = await db.select({ name: users.name }).from(users).where(eq(users.id, opponentId)).limit(1);
            if (userRows[0]) opponentName = userRows[0].name || "Unknown";
          }
          const isPlayer1 = match.player1Id === ctx.user.id;
          return {
            ...match,
            opponentName,
            won: match.winnerId === ctx.user.id,
            eloChange: isPlayer1 ? match.player1EloChange : match.player2EloChange,
          };
        })
      );
      return enriched;
    }),

  getQueueStatus: publicProcedure.query(async () => {
    return { playersInQueue: 0, activeMatches: 0 };
  }),

  /* ═══ PVP DECK BUILDER ═══ */
  getMyDecks: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(pvpDecks)
      .where(eq(pvpDecks.userId, ctx.user.id))
      .orderBy(desc(pvpDecks.updatedAt));
  }),

  getActiveDeck: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(pvpDecks)
      .where(and(eq(pvpDecks.userId, ctx.user.id), eq(pvpDecks.isActive, 1)))
      .limit(1);
    return rows[0] || null;
  }),

  saveDeck: protectedProcedure
    .input(z.object({
      id: z.number().optional(), // If provided, update existing
      name: z.string().min(1).max(64),
      faction: z.enum(["architect", "dreamer"]),
      cardIds: z.array(z.string()).min(MIN_DECK_SIZE).max(MAX_DECK_SIZE),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database unavailable" };

      // Validate deck rules
      const cardCounts = new Map<string, number>();
      let legendaryCount = 0;
      let epicCount = 0;

      // We'd need card data to validate rarity — for now just check copy limits
      for (const cardId of input.cardIds) {
        cardCounts.set(cardId, (cardCounts.get(cardId) || 0) + 1);
        if ((cardCounts.get(cardId) || 0) > MAX_COPIES_PER_CARD) {
          return { success: false, error: `Too many copies of card ${cardId} (max ${MAX_COPIES_PER_CARD})` };
        }
      }

      if (input.id) {
        // Update existing deck
        const existing = await db.select().from(pvpDecks)
          .where(and(eq(pvpDecks.id, input.id), eq(pvpDecks.userId, ctx.user.id)))
          .limit(1);
        if (!existing[0]) return { success: false, error: "Deck not found" };

        await db.update(pvpDecks).set({
          name: input.name,
          faction: input.faction,
          cardIds: input.cardIds,
          cardCount: input.cardIds.length,
        }).where(eq(pvpDecks.id, input.id));

        return { success: true, deckId: input.id };
      } else {
        // Check deck limit
        const deckCount = await db.select({ count: sql<number>`count(*)` }).from(pvpDecks)
          .where(eq(pvpDecks.userId, ctx.user.id));
        if ((deckCount[0]?.count || 0) >= MAX_SAVED_DECKS) {
          return { success: false, error: `Maximum ${MAX_SAVED_DECKS} decks allowed` };
        }

        const result = await db.insert(pvpDecks).values({
          userId: ctx.user.id,
          name: input.name,
          faction: input.faction,
          cardIds: input.cardIds,
          cardCount: input.cardIds.length,
        });

        return { success: true, deckId: Number(result[0].insertId) };
      }
    }),

  deleteDeck: protectedProcedure
    .input(z.object({ deckId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      await db.delete(pvpDecks).where(and(eq(pvpDecks.id, input.deckId), eq(pvpDecks.userId, ctx.user.id)));
      return { success: true };
    }),

  setActiveDeck: protectedProcedure
    .input(z.object({ deckId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      // Deactivate all
      await db.update(pvpDecks).set({ isActive: 0 }).where(eq(pvpDecks.userId, ctx.user.id));
      // Activate selected
      await db.update(pvpDecks).set({ isActive: 1 }).where(and(eq(pvpDecks.id, input.deckId), eq(pvpDecks.userId, ctx.user.id)));
      return { success: true };
    }),

  getDeckRules: publicProcedure.query(() => ({
    minSize: MIN_DECK_SIZE,
    maxSize: MAX_DECK_SIZE,
    maxCopies: MAX_COPIES_PER_CARD,
    maxLegendary: MAX_LEGENDARY,
    maxEpic: MAX_EPIC,
    maxSavedDecks: MAX_SAVED_DECKS,
  })),

  /* ═══ RANKED SEASONS ═══ */
  getCurrentSeason: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(pvpSeasons)
      .where(eq(pvpSeasons.isActive, 1))
      .limit(1);
    if (!rows[0]) {
      // Return a default season if none exists
      return {
        id: 0,
        seasonNumber: 1,
        name: "Season 1: Dischordian Dawn",
        startsAt: new Date("2026-03-01"),
        endsAt: new Date("2026-06-01"),
        isActive: 1,
        rewards: {
          bronze: { cardPacks: 1, title: "Bronze Operative", badge: "bronze_shield" },
          silver: { cardPacks: 2, title: "Silver Sentinel", badge: "silver_shield" },
          gold: { cardPacks: 3, title: "Gold Commander", badge: "gold_shield" },
          platinum: { cardPacks: 5, title: "Platinum Archon", badge: "platinum_shield" },
          diamond: { cardPacks: 8, title: "Diamond Sovereign", badge: "diamond_shield" },
          master: { cardPacks: 12, title: "Master Strategist", badge: "master_crown" },
          grandmaster: { cardPacks: 20, title: "Grandmaster of the Panopticon", badge: "grandmaster_flame" },
        },
        createdAt: new Date(),
      };
    }
    return rows[0];
  }),

  getMySeasonRecord: protectedProcedure
    .input(z.object({ seasonId: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      let seasonId = input?.seasonId;
      if (!seasonId) {
        const active = await db.select().from(pvpSeasons).where(eq(pvpSeasons.isActive, 1)).limit(1);
        seasonId = active[0]?.id;
      }
      if (!seasonId) return null;

      const rows = await db
        .select()
        .from(pvpSeasonRecords)
        .where(and(eq(pvpSeasonRecords.userId, ctx.user.id), eq(pvpSeasonRecords.seasonId, seasonId)))
        .limit(1);
      return rows[0] || null;
    }),

  getSeasonLeaderboard: publicProcedure
    .input(z.object({ seasonId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      let seasonId = input?.seasonId;
      if (!seasonId) {
        const active = await db.select().from(pvpSeasons).where(eq(pvpSeasons.isActive, 1)).limit(1);
        seasonId = active[0]?.id;
      }
      if (!seasonId) return [];

      return db
        .select()
        .from(pvpSeasonRecords)
        .where(eq(pvpSeasonRecords.seasonId, seasonId))
        .orderBy(desc(pvpSeasonRecords.peakElo))
        .limit(50);
    }),

  getPastSeasons: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(pvpSeasons)
      .where(eq(pvpSeasons.isActive, 0))
      .orderBy(desc(pvpSeasons.seasonNumber));
  }),

  claimSeasonRewards: protectedProcedure
    .input(z.object({ seasonId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "Database unavailable" };

      const record = await db.select().from(pvpSeasonRecords)
        .where(and(eq(pvpSeasonRecords.userId, ctx.user.id), eq(pvpSeasonRecords.seasonId, input.seasonId)))
        .limit(1);

      if (!record[0]) return { success: false, error: "No season record found" };
      if (record[0].rewardsClaimed) return { success: false, error: "Rewards already claimed" };

      // Get season rewards
      const season = await db.select().from(pvpSeasons).where(eq(pvpSeasons.id, input.seasonId)).limit(1);
      if (!season[0]) return { success: false, error: "Season not found" };

      const rewards = season[0].rewards as Record<string, { cardPacks: number; title: string; badge: string }> | null;
      const tierReward = rewards?.[record[0].peakTier];

      // Mark as claimed
      await db.update(pvpSeasonRecords).set({ rewardsClaimed: 1 })
        .where(eq(pvpSeasonRecords.id, record[0].id));

      return {
        success: true,
        reward: tierReward || { cardPacks: 1, title: "Participant", badge: "participation" },
      };
    }),

  /* ═══ SPECTATOR ═══ */
  getActiveMatches: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const matches = await db
      .select({
        matchId: pvpMatches.matchId,
        player1Id: pvpMatches.player1Id,
        player2Id: pvpMatches.player2Id,
        startedAt: pvpMatches.startedAt,
        totalTurns: pvpMatches.totalTurns,
      })
      .from(pvpMatches)
      .where(eq(pvpMatches.status, "active"))
      .orderBy(desc(pvpMatches.startedAt))
      .limit(20);

    // Enrich with player names and ELOs
    const enriched = await Promise.all(
      matches.map(async (match) => {
        let p1Name = "Unknown", p2Name = "Unknown";
        let p1Elo = 1000, p2Elo = 1000;

        const p1User = await db.select({ name: users.name }).from(users).where(eq(users.id, match.player1Id)).limit(1);
        if (p1User[0]) p1Name = p1User[0].name || "Unknown";

        if (match.player2Id) {
          const p2User = await db.select({ name: users.name }).from(users).where(eq(users.id, match.player2Id)).limit(1);
          if (p2User[0]) p2Name = p2User[0].name || "Unknown";
        }

        const p1Lb = await db.select({ elo: pvpLeaderboard.elo, rankTier: pvpLeaderboard.rankTier }).from(pvpLeaderboard).where(eq(pvpLeaderboard.userId, match.player1Id)).limit(1);
        if (p1Lb[0]) p1Elo = p1Lb[0].elo;

        if (match.player2Id) {
          const p2Lb = await db.select({ elo: pvpLeaderboard.elo, rankTier: pvpLeaderboard.rankTier }).from(pvpLeaderboard).where(eq(pvpLeaderboard.userId, match.player2Id)).limit(1);
          if (p2Lb[0]) p2Elo = p2Lb[0].elo;
        }

        return {
          ...match,
          player1Name: p1Name,
          player2Name: p2Name,
          player1Elo: p1Elo,
          player2Elo: p2Elo,
        };
      })
    );

    return enriched;
  }),
});

/* ─── HELPERS ─── */
function getNextTier(tier: string): string | null {
  const order = ["bronze", "silver", "gold", "platinum", "diamond", "master", "grandmaster"];
  const idx = order.indexOf(tier);
  if (idx === -1 || idx >= order.length - 1) return null;
  return order[idx + 1];
}
