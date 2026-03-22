import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { battlePassSeasons, battlePassProgress } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { fetchCitizenData, fetchPotentialNftData, resolveQuestBonuses } from "../traitResolver";

/* ═══ DEFAULT SEASON 1 TIER REWARDS ═══ */
const SEASON_1_REWARDS: Record<string, { free?: Record<string, unknown>; premium?: Record<string, unknown> }> = {};
for (let i = 1; i <= 50; i++) {
  const free: Record<string, unknown> = {};
  const premium: Record<string, unknown> = {};

  // Free track rewards every 5 tiers
  if (i % 5 === 0) {
    free.credits = i * 100;
    if (i % 10 === 0) free.cardPack = i >= 30 ? "rare" : "common";
    if (i === 25) free.title = "Operative";
    if (i === 50) free.title = "Veteran Operative";
  }
  if (i % 2 === 0) free.xp = 50;

  // Premium track — better rewards
  premium.dream = Math.floor(i * 5);
  if (i % 5 === 0) {
    premium.cardPack = i >= 30 ? "legendary" : "rare";
    premium.materials = { type: i >= 40 ? "void_crystal" : "star_dust", amount: i };
  }
  if (i === 10) premium.title = "Shadow Agent";
  if (i === 20) premium.emblem = "gold_star";
  if (i === 30) premium.title = "Elite Operative";
  if (i === 40) premium.fighter = "shadow_agent";
  if (i === 50) {
    premium.title = "Panopticon Ascendant";
    premium.emblem = "panopticon_sigil";
    premium.cardPack = "mythic";
  }

  SEASON_1_REWARDS[String(i)] = { free: Object.keys(free).length > 0 ? free : undefined, premium };
}

export const battlePassRouter = router({
  /* ─── Get current active season ─── */
  currentSeason: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;

    const seasons = await db.select().from(battlePassSeasons)
      .where(eq(battlePassSeasons.status, "active"))
      .orderBy(desc(battlePassSeasons.seasonNumber))
      .limit(1);

    return seasons[0] || null;
  }),

  /* ─── Get player's progress for current season ─── */
  myProgress: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    const season = await db.select().from(battlePassSeasons)
      .where(eq(battlePassSeasons.status, "active"))
      .limit(1);
    if (!season[0]) return null;

    const progress = await db.select().from(battlePassProgress)
      .where(and(
        eq(battlePassProgress.userId, ctx.user.id),
        eq(battlePassProgress.seasonId, season[0].id),
      ))
      .limit(1);

    if (!progress[0]) {
      // Auto-create progress record
      await db.insert(battlePassProgress).values({
        userId: ctx.user.id,
        seasonId: season[0].id,
        currentXp: 0,
        currentTier: 0,
        isPremium: false,
        claimedFreeTiers: [],
        claimedPremiumTiers: [],
      });
      return {
        season: season[0],
        progress: {
          currentXp: 0, currentTier: 0, isPremium: false,
          claimedFreeTiers: [] as number[], claimedPremiumTiers: [] as number[],
        },
      };
    }

    return { season: season[0], progress: progress[0] };
  }),

  /* ─── Add XP to battle pass ─── */
  addXp: protectedProcedure
    .input(z.object({ xp: z.number().min(1).max(10000) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const season = await db.select().from(battlePassSeasons)
        .where(eq(battlePassSeasons.status, "active"))
        .limit(1);
      if (!season[0]) return { success: false, message: "No active season" };

      let progress = await db.select().from(battlePassProgress)
        .where(and(
          eq(battlePassProgress.userId, ctx.user.id),
          eq(battlePassProgress.seasonId, season[0].id),
        ))
        .limit(1);

      if (!progress[0]) {
        await db.insert(battlePassProgress).values({
          userId: ctx.user.id,
          seasonId: season[0].id,
          currentXp: 0,
          currentTier: 0,
          isPremium: false,
          claimedFreeTiers: [],
          claimedPremiumTiers: [],
        });
        progress = await db.select().from(battlePassProgress)
          .where(and(
            eq(battlePassProgress.userId, ctx.user.id),
            eq(battlePassProgress.seasonId, season[0].id),
          ))
          .limit(1);
      }

      const p = progress[0]!;

      // Apply trait XP multiplier to battle pass XP
      const [bpCitizen, bpNft] = await Promise.all([
        fetchCitizenData(ctx.user.id),
        fetchPotentialNftData(ctx.user.id),
      ]);
      const bpTb = resolveQuestBonuses(bpCitizen, bpNft);
      const adjustedXp = Math.round(input.xp * bpTb.battlePassXpMultiplier);

      const newXp = p.currentXp + adjustedXp;
      const xpPerTier = season[0].xpPerTier;
      const newTier = Math.min(Math.floor(newXp / xpPerTier), season[0].totalTiers);
      const tiersGained = newTier - p.currentTier;

      await db.update(battlePassProgress)
        .set({ currentXp: newXp, currentTier: newTier })
        .where(eq(battlePassProgress.id, p.id));

      return { success: true, newXp, newTier, tiersGained };
    }),

  /* ─── Claim tier reward ─── */
  claimReward: protectedProcedure
    .input(z.object({
      tier: z.number().min(1),
      track: z.enum(["free", "premium"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const season = await db.select().from(battlePassSeasons)
        .where(eq(battlePassSeasons.status, "active"))
        .limit(1);
      if (!season[0]) throw new TRPCError({ code: "NOT_FOUND", message: "No active season" });

      const progress = await db.select().from(battlePassProgress)
        .where(and(
          eq(battlePassProgress.userId, ctx.user.id),
          eq(battlePassProgress.seasonId, season[0].id),
        ))
        .limit(1);
      if (!progress[0]) throw new TRPCError({ code: "NOT_FOUND" });

      if (input.tier > progress[0].currentTier) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Tier not yet reached" });
      }

      if (input.track === "premium" && !progress[0].isPremium) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Premium pass required" });
      }

      const claimed = input.track === "free"
        ? (progress[0].claimedFreeTiers || [])
        : (progress[0].claimedPremiumTiers || []);

      if (claimed.includes(input.tier)) {
        throw new TRPCError({ code: "CONFLICT", message: "Already claimed" });
      }

      const newClaimed = [...claimed, input.tier];
      if (input.track === "free") {
        await db.update(battlePassProgress)
          .set({ claimedFreeTiers: newClaimed })
          .where(eq(battlePassProgress.id, progress[0].id));
      } else {
        await db.update(battlePassProgress)
          .set({ claimedPremiumTiers: newClaimed })
          .where(eq(battlePassProgress.id, progress[0].id));
      }

      // Get the reward data
      const rewards = season[0].tierRewards || {};
      const tierReward = rewards[String(input.tier)];
      const reward = input.track === "free" ? tierReward?.free : tierReward?.premium;

      return { success: true, reward: reward || {} };
    }),

  /* ─── Upgrade to premium pass ─── */
  upgradePremium: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const season = await db.select().from(battlePassSeasons)
      .where(eq(battlePassSeasons.status, "active"))
      .limit(1);
    if (!season[0]) throw new TRPCError({ code: "NOT_FOUND" });

    const progress = await db.select().from(battlePassProgress)
      .where(and(
        eq(battlePassProgress.userId, ctx.user.id),
        eq(battlePassProgress.seasonId, season[0].id),
      ))
      .limit(1);
    if (!progress[0]) throw new TRPCError({ code: "NOT_FOUND" });

    if (progress[0].isPremium) {
      throw new TRPCError({ code: "CONFLICT", message: "Already premium" });
    }

    // TODO: Integrate with Dream token deduction or Stripe payment
    await db.update(battlePassProgress)
      .set({ isPremium: true })
      .where(eq(battlePassProgress.id, progress[0].id));

    return { success: true };
  }),

  /* ─── Get tier rewards preview ─── */
  tierRewards: publicProcedure.query(() => SEASON_1_REWARDS),
});
