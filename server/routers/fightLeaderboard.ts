/* ═══════════════════════════════════════════════════════
   FIGHT LEADERBOARD ROUTER — Online ranked ladder
   ELO ratings, match history, ranked tiers, and stats
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { fightLeaderboard, fightMatches, users } from "../../drizzle/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";
import { fetchCitizenData, fetchPotentialNftData, resolveFightGameBonuses, nftLevelMultiplier } from "../traitResolver";

/* ─── ELO Calculation ─── */
function calculateElo(playerElo: number, opponentElo: number, won: boolean, kFactor = 32): number {
  const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const score = won ? 1 : 0;
  return Math.round(playerElo + kFactor * (score - expected));
}

/* ─── Rank Tier Calculation ─── */
function getRankTier(elo: number): "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "grandmaster" {
  if (elo >= 2200) return "grandmaster";
  if (elo >= 1900) return "master";
  if (elo >= 1600) return "diamond";
  if (elo >= 1400) return "platinum";
  if (elo >= 1200) return "gold";
  if (elo >= 1000) return "silver";
  return "bronze";
}

/* ─── Difficulty ELO Modifiers ─── */
const DIFFICULTY_ELO: Record<string, number> = {
  easy: 800,
  normal: 1000,
  hard: 1300,
  nightmare: 1700,
};

export const fightLeaderboardRouter = router({
  /* ─── Get leaderboard (top players) ─── */
  getLeaderboard: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { entries: [], total: 0 };
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;

      const entries = await db
        .select()
        .from(fightLeaderboard)
        .orderBy(desc(fightLeaderboard.elo))
        .limit(limit)
        .offset(offset);

      const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(fightLeaderboard);

      return {
        entries: entries.map((e, i) => ({
          ...e,
          rank: offset + i + 1,
          winRate: e.wins + e.losses > 0
            ? Math.round((e.wins / (e.wins + e.losses)) * 100)
            : 0,
        })),
        total: total[0]?.count ?? 0,
      };
    }),

  /* ─── Get my stats ─── */
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const userId = ctx.user.id;

    // Get or create leaderboard entry
    let [entry] = await db
      .select()
      .from(fightLeaderboard)
      .where(eq(fightLeaderboard.userId, userId));

    if (!entry) {
      await db.insert(fightLeaderboard).values({
        userId,
        userName: ctx.user.name ?? "Unknown Operative",
        elo: 1000,
      });
      [entry] = await db
        .select()
        .from(fightLeaderboard)
        .where(eq(fightLeaderboard.userId, userId));
    }

    // Get rank position
    const [rankResult] = await db
      .select({ rank: sql<number>`count(*)` })
      .from(fightLeaderboard)
      .where(gte(fightLeaderboard.elo, entry.elo));

    // Get recent matches
    const recentMatches = await db
      .select()
      .from(fightMatches)
      .where(eq(fightMatches.userId, userId))
      .orderBy(desc(fightMatches.playedAt))
      .limit(20);

    // Fighter usage stats
    const fighterStats = await db
      .select({
        fighter: fightMatches.playerFighter,
        count: sql<number>`count(*)`,
        wins: sql<number>`sum(${fightMatches.won})`,
      })
      .from(fightMatches)
      .where(eq(fightMatches.userId, userId))
      .groupBy(fightMatches.playerFighter)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    return {
      ...entry,
      rank: rankResult?.rank ?? 0,
      winRate: entry.wins + entry.losses > 0
        ? Math.round((entry.wins / (entry.wins + entry.losses)) * 100)
        : 0,
      recentMatches,
      topFighters: fighterStats.map(f => ({
        fighter: f.fighter,
        matches: f.count,
        wins: f.wins ?? 0,
        winRate: f.count > 0 ? Math.round(((f.wins ?? 0) / f.count) * 100) : 0,
      })),
    };
  }),

  /* ─── Record a match result ─── */
  recordMatch: protectedProcedure
    .input(z.object({
      playerFighter: z.string(),
      opponentFighter: z.string(),
      difficulty: z.string(),
      arena: z.string(),
      won: z.boolean(),
      perfect: z.boolean().default(false),
      bestCombo: z.number().default(0),
      pointsEarned: z.number().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { eloChange: 0, newElo: 1000, newTier: 'bronze' as const, newStreak: 0, bestStreak: 0, tierChanged: false, previousTier: 'bronze' as const };
      const userId = ctx.user.id;

      // Get or create leaderboard entry
      let [entry] = await db
        .select()
        .from(fightLeaderboard)
        .where(eq(fightLeaderboard.userId, userId));

      if (!entry) {
        await db.insert(fightLeaderboard).values({
          userId,
          userName: ctx.user.name ?? "Unknown Operative",
          elo: 1000,
        });
        [entry] = await db
          .select()
          .from(fightLeaderboard)
          .where(eq(fightLeaderboard.userId, userId));
      }

      // Calculate ELO change — citizen traits give bonus ELO on wins
      const [fightCitizen, fightNft] = await Promise.all([
        fetchCitizenData(ctx.user.id),
        fetchPotentialNftData(ctx.user.id),
      ]);
      const fightTb = resolveFightGameBonuses(fightCitizen, fightNft);
      const nftMult = nftLevelMultiplier(fightNft);
      // Higher citizen level + NFT level = slightly higher K-factor (more ELO gained/lost)
      const traitKBonus = Math.floor(fightTb.speedBonus / 2) + Math.floor((nftMult - 1) * 8);
      const adjustedK = 32 + traitKBonus;
      const opponentElo = DIFFICULTY_ELO[input.difficulty] ?? 1000;
      const newElo = calculateElo(entry.elo, opponentElo, input.won, adjustedK);
      const eloChange = newElo - entry.elo;

      // Update streak
      const newStreak = input.won ? entry.winStreak + 1 : 0;
      const bestStreak = Math.max(entry.bestStreak, newStreak);

      // Update rank tier
      const newTier = getRankTier(newElo);

      // Record the match
      await db.insert(fightMatches).values({
        userId,
        playerFighter: input.playerFighter,
        opponentFighter: input.opponentFighter,
        difficulty: input.difficulty,
        arena: input.arena,
        won: input.won ? 1 : 0,
        perfect: input.perfect ? 1 : 0,
        bestCombo: input.bestCombo,
        eloChange,
        pointsEarned: input.pointsEarned,
      });

      // Update leaderboard entry
      await db
        .update(fightLeaderboard)
        .set({
          elo: newElo,
          wins: input.won ? entry.wins + 1 : entry.wins,
          losses: input.won ? entry.losses : entry.losses + 1,
          winStreak: newStreak,
          bestStreak,
          totalKOs: entry.totalKOs + (input.won ? 1 : 0),
          perfectWins: input.perfect ? entry.perfectWins + 1 : entry.perfectWins,
          bestCombo: Math.max(entry.bestCombo, input.bestCombo),
          mainFighter: input.playerFighter, // simplified: last used
          rankTier: newTier,
          lastFightAt: new Date(),
        })
        .where(eq(fightLeaderboard.userId, userId));

      return {
        eloChange,
        newElo,
        newTier,
        newStreak,
        bestStreak,
        tierChanged: newTier !== entry.rankTier,
        previousTier: entry.rankTier,
      };
    }),

  /* ─── Get rank distribution ─── */
  getRankDistribution: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const distribution = await db
      .select({
        tier: fightLeaderboard.rankTier,
        count: sql<number>`count(*)`,
      })
      .from(fightLeaderboard)
      .groupBy(fightLeaderboard.rankTier);

    return distribution;
  }),

  /* ─── Get match history for a user ─── */
  getMatchHistory: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { matches: [], total: 0 };
      const limit = input?.limit ?? 20;
      const offset = input?.offset ?? 0;

      const matches = await db
        .select()
        .from(fightMatches)
        .where(eq(fightMatches.userId, ctx.user.id))
        .orderBy(desc(fightMatches.playedAt))
        .limit(limit)
        .offset(offset);

      const [total] = await db
        .select({ count: sql<number>`count(*)` })
        .from(fightMatches)
        .where(eq(fightMatches.userId, ctx.user.id));

      return {
        matches,
        total: total?.count ?? 0,
      };
    }),
});
