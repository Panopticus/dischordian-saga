import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { procedureRateLimit } from "../_core/procedureRateLimit";
import { getDb } from "../db";
import { battlePassSeasons, battlePassProgress, dreamBalance, notifications } from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { fetchCitizenData, resolveQuestBonuses } from "../traitResolver";
import { logger } from "../logger";
import {
  getTierFromXp, getTierProgress, getXpSource, MAX_TIER,
  PREMIUM_COST_DREAM, XP_SOURCES, TOTAL_PASS_XP, SEASON_LENGTH_DAYS,
  generateSeasonRewards, getSeasonThemeFromPressure, SEASONAL_THEMES,
  type SeasonTheme,
} from "@shared/battlePassConfig";
import { pressureService } from "../services/pressureService";
import { getPrestigeMultiplier } from "../services/prestigeMultiplier";
import { getConsequences } from "../services/universeConsequences";
import { checkFeatureFlag } from "../middleware/featureFlag";

export const battlePassRouter = router({
  /* ─── Get current active season ─── */
  currentSeason: publicProcedure.use(checkFeatureFlag("battle_pass")).query(async () => {
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
  /**
   * @deprecated Prefer `addXpFromAction` which validates the source via
   * server-side `getXpSource(actionType)`. `addXp` accepts a raw XP value
   * and is therefore exploitable if a rooted/MITM client forges large
   * values — two posts at the previous max=10000 used to finish the entire
   * 15750-XP season pass. The cap is now 200 and the procedure is
   * rate-limited to 5/min/user; remove this handler entirely once all
   * callers migrate to `addXpFromAction`.
   */
  addXp: protectedProcedure
    .use(procedureRateLimit({ windowMs: 60_000, max: 5 }))
    .input(z.object({ xp: z.number().min(1).max(200) }))
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
      const bpCitizen = await fetchCitizenData(ctx.user.id);
      const bpTb = resolveQuestBonuses(bpCitizen);
      const adjustedXp = Math.round(input.xp * bpTb.battlePassXpMultiplier);

      // Apply prestige multiplier on top of trait bonus
      const prestigeMult = await getPrestigeMultiplier(ctx.user.id);
      let finalXp = Math.round(adjustedXp * prestigeMult);

      // Apply Living Universe event XP multiplier
      const fx = await getConsequences();
      const xpMult = fx.xpMultipliers["fight"] ?? fx.xpMultipliers["social"] ?? 1;
      if (xpMult !== 1) {
        finalXp = Math.round(finalXp * xpMult);
      }

      const newXp = p.currentXp + finalXp;
      // Use variable XP curve instead of flat xpPerTier
      const newTier = Math.min(getTierFromXp(newXp), season[0].totalTiers);
      const tiersGained = newTier - p.currentTier;

      await db.update(battlePassProgress)
        .set({ currentXp: newXp, currentTier: newTier })
        .where(eq(battlePassProgress.id, p.id));

      const progress2 = getTierProgress(newXp);

      // Notify on tier-up
      if (tiersGained > 0) {
        await db.insert(notifications).values({
          userId: ctx.user.id,
          type: "battle_pass_tier_up",
          title: `Battle Pass Tier ${newTier}!`,
          message: `You've reached tier ${newTier}. ${newTier < MAX_TIER ? `Next tier: ${progress2.xpNeeded - progress2.xpInTier} XP to go.` : "Maximum tier reached!"}`,
        }).catch(() => {});
      }

      return {
        success: true,
        xpAdded: finalXp,
        newXp,
        newTier,
        tiersGained,
        tierProgress: progress2,
      };
    }),

  /* ─── Add XP from a specific game action (uses XP_SOURCES config) ─── */
  addXpFromAction: protectedProcedure
    .input(z.object({ actionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const source = getXpSource(input.actionId);
      if (!source) return { success: false, message: "Unknown action" };

      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };

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
      if (p.currentTier >= MAX_TIER) return { success: true, maxed: true };

      // Apply prestige multiplier
      const prestigeMult = await getPrestigeMultiplier(ctx.user.id);
      let finalXp = Math.round(source.xp * prestigeMult);

      // Apply Living Universe event XP multiplier
      const fxAction = await getConsequences();
      const actionXpMult = fxAction.xpMultipliers[input.actionId] ?? fxAction.xpMultipliers["fight"] ?? fxAction.xpMultipliers["social"] ?? 1;
      if (actionXpMult !== 1) {
        finalXp = Math.round(finalXp * actionXpMult);
      }

      const newXp = p.currentXp + finalXp;
      const newTier = Math.min(getTierFromXp(newXp), season[0].totalTiers);

      await db.update(battlePassProgress)
        .set({ currentXp: newXp, currentTier: newTier })
        .where(eq(battlePassProgress.id, p.id));

      return { success: true, actionId: input.actionId, xpAdded: finalXp, newXp, newTier };
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

      // Wrap read-check-write in a transaction. The historical pattern
      // — read claimedTiers, push, write — let two parallel claim
      // requests both pass the dedup check and both write, with the
      // second silently overwriting the first's update (single-claim,
      // double-grant on rewards downstream).
      const claimResult = await db.transaction(async (tx) => {
        const season = await tx.select().from(battlePassSeasons)
          .where(eq(battlePassSeasons.status, "active"))
          .limit(1);
        if (!season[0]) throw new TRPCError({ code: "NOT_FOUND", message: "No active season" });

        const progress = await tx.select().from(battlePassProgress)
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
          await tx.update(battlePassProgress)
            .set({ claimedFreeTiers: newClaimed })
            .where(eq(battlePassProgress.id, progress[0].id));
        } else {
          await tx.update(battlePassProgress)
            .set({ claimedPremiumTiers: newClaimed })
            .where(eq(battlePassProgress.id, progress[0].id));
        }

        // Get the reward data inside the tx so we read the same season row.
        const rewards = season[0].tierRewards || {};
        const tierReward = rewards[String(input.tier)];
        const reward = input.track === "free" ? tierReward?.free : tierReward?.premium;
        return { reward };
      });

      const reward = claimResult.reward;

      // Notify the player the tier reward landed in their inventory.
      // Fire-and-forget; reward already wrote inside the transaction.
      db.insert(notifications).values({
        userId: ctx.user.id,
        type: "battle_pass_reward",
        title: `Battle Pass Tier ${input.tier} Reward`,
        message: `You claimed your ${input.track} tier ${input.tier} reward.`,
        actionUrl: "/battle-pass",
        metadata: { tier: input.tier, track: input.track },
      }).catch((e) => logger.error("[BattlePass] reward notification failed:", e));

      // T9.17: if the reward bag includes a `titleKey`, grant the
      // title via the unified user_titles table. Forwards-compat —
      // existing reward bags without titleKey are unaffected.
      const titleKey = (reward as { titleKey?: string } | undefined)?.titleKey;
      if (titleKey) {
        try {
          const { sql } = await import("drizzle-orm");
          const { userTitles } = await import("../../db/schema");
          await db
            .insert(userTitles)
            .values({ userId: ctx.user.id, titleKey })
            .onDuplicateKeyUpdate({ set: { earnedAt: sql`earned_at` } })
            .catch(() => {/* idempotent */});
        } catch {
          /* mirror is best-effort */
        }
      }

      return { success: true, reward: reward || {} };
    }),

  /* ─── Upgrade to premium pass (Dream OR Void Crystals) ───
     The Dream path is the F2P grind option (500 Dream); the VC path
     mirrors the in-game Battle Pass SKU (1000 VC, matching the
     ECONOMY.battlePass.premiumCostVoidCrystals knob). The Stripe
     route — `battle_pass_premium` SKU — flips isPremium directly
     via store.fulfillPurchase. */
  upgradePremium: protectedProcedure
    .input(z.object({
      currency: z.enum(["dream", "void_crystals"]).optional().default("dream"),
    }).optional())
    .mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const currency = input?.currency ?? "dream";

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

    if (currency === "dream") {
      // Atomic conditional UPDATE — the previous select-then-update
      // pattern let two parallel upgrades both succeed because the
      // implied check and the write weren't atomic.
      const r = await db.execute(sql`
        UPDATE dream_balance
        SET dream_tokens = dream_tokens - ${PREMIUM_COST_DREAM}
        WHERE user_id = ${ctx.user.id} AND dream_tokens >= ${PREMIUM_COST_DREAM}
      `);
      const affected = (r as unknown as Array<{ affectedRows?: number }>)[0]?.affectedRows ?? 0;
      if (affected === 0) {
        const dreamRow = await db.select().from(dreamBalance)
          .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        const have = dreamRow[0]?.dreamTokens ?? 0;
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Need ${PREMIUM_COST_DREAM} Dream tokens, have ${have}`,
        });
      }
    } else {
      const PREMIUM_COST_VC = 1000;
      const r = await db.execute(sql`
        UPDATE dream_balance
        SET gems = gems - ${PREMIUM_COST_VC}
        WHERE user_id = ${ctx.user.id} AND gems >= ${PREMIUM_COST_VC}
      `);
      const affected = (r as unknown as Array<{ affectedRows?: number }>)[0]?.affectedRows ?? 0;
      if (affected === 0) {
        const dreamRow = await db.select().from(dreamBalance)
          .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        const have = dreamRow[0]?.gems ?? 0;
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Need ${PREMIUM_COST_VC} Void Crystals, have ${have}`,
        });
      }
    }

    await db.update(battlePassProgress)
      .set({ isPremium: true })
      .where(eq(battlePassProgress.id, progress[0].id));

    return { success: true, currencyUsed: currency };
  }),

  /* ─── Get tier rewards for current season ─── */
  tierRewards: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return {};

    const season = await db.select().from(battlePassSeasons)
      .where(eq(battlePassSeasons.status, "active"))
      .limit(1);

    if (!season[0]?.tierRewards) {
      // Generate default rewards if none stored
      const theme = SEASONAL_THEMES.dreamer;
      return generateSeasonRewards(theme);
    }

    return season[0].tierRewards;
  }),

  /* ─── Get XP sources info for client display ─── */
  xpSources: publicProcedure.query(() => XP_SOURCES),

  /* ─── Generate a new season (admin/automated — themes from community pressure) ─── */
  generateSeason: protectedProcedure
    .input(z.object({
      seasonNumber: z.number().min(1),
      /** Override theme (optional — defaults to community pressure) */
      themeOverride: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Determine theme from Living Universe pressure (or override)
      let theme: SeasonTheme;
      if (input.themeOverride && SEASONAL_THEMES[input.themeOverride]) {
        theme = SEASONAL_THEMES[input.themeOverride];
      } else {
        // Get community pressure from pressureService
        const pressure = await pressureService.getAllPressures();
        theme = getSeasonThemeFromPressure(pressure as unknown as Record<string, number>);
      }

      // Generate rewards based on theme
      const rewards = generateSeasonRewards(theme);

      // End any currently active season
      await db.update(battlePassSeasons)
        .set({ status: "ended" })
        .where(eq(battlePassSeasons.status, "active"));

      const now = new Date();
      const endsAt = new Date(now.getTime() + SEASON_LENGTH_DAYS * 86400000);

      // Create new season
      await db.insert(battlePassSeasons).values({
        seasonNumber: input.seasonNumber,
        name: theme.name,
        description: theme.narrativeHook,
        totalTiers: MAX_TIER,
        xpPerTier: 315, // Average — actual curve is variable via getTierFromXp
        premiumPriceDream: PREMIUM_COST_DREAM,
        tierRewards: rewards,
        status: "active",
        startsAt: now,
        endsAt,
      });

      logger.info(`[BattlePass] Season ${input.seasonNumber} created: ${theme.name} (pressure: ${theme.pressureSource})`);

      return {
        success: true,
        seasonNumber: input.seasonNumber,
        theme: {
          id: theme.id,
          name: theme.name,
          description: theme.description,
          pressureSource: theme.pressureSource,
          primaryColor: theme.primaryColor,
          accentColor: theme.accentColor,
          narrativeHook: theme.narrativeHook,
        },
        startsAt: now.toISOString(),
        endsAt: endsAt.toISOString(),
      };
    }),
});
