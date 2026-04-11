/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY — Event tRPC router (server-authoritative)

   Exposes all mutations that actually mutate event state:
     • spin the wheel of wonders
     • roll soul stone craps
     • send/claim gifts
     • claim daily challenge rewards
     • donate to the community charity pool
     • fetch global charity progress + milestones

   Everything is feature-flag-gated via `christmas_in_july`
   and time-gated to the July 1-14 window (override with
   the `xmas_july_testing` flag for QA).
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { getDb, type DrizzleDb } from "../db";
import { checkFeatureFlag } from "../middleware/featureFlag";

/** Accepts either the top-level db handle or an in-progress tx handle. */
type DbLike = DrizzleDb | Parameters<Parameters<DrizzleDb["transaction"]>[0]>[0];
import { checkEventWindow, CHRISTMAS_IN_JULY_WINDOW } from "../middleware/eventWindow";
import {
  xmasJulyProgress, xmasJulyGifts, xmasJulyCharityPool,
  xmasJulyCrapsRolls, xmasJulyWheelSpins, notifications, users,
} from "../../db/schema";
import { eq, and, desc, sql, or, like, ne } from "drizzle-orm";
import { createRng, randomSeed, rollCraps, spinWheel } from "../../shared/casinoGames";
import {
  CHRISTMAS_EVENT_CONFIG, CHRISTMAS_EVENT_KEY,
  CHRISTMAS_WHEEL_PRIZES, CHRISTMAS_MILESTONES, CHRISTMAS_DAILY_CHALLENGES,
  GIFT_TYPES, type GiftType,
} from "../../shared/christmasInJuly";

function todayString(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function currentEventDay(): number {
  const start = new Date(CHRISTMAS_EVENT_CONFIG.startDate).getTime();
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const day = Math.floor((now - start) / dayMs) + 1;
  return Math.max(1, Math.min(CHRISTMAS_EVENT_CONFIG.durationDays, day));
}

/** Reset `giftsSentToday` / `tokensSpentToday` when the UTC date changes. */
async function ensureProgress(db: DbLike, userId: number) {
  const [existing] = await db
    .select()
    .from(xmasJulyProgress)
    .where(eq(xmasJulyProgress.userId, userId))
    .limit(1);
  if (existing) {
    const today = todayString();
    if (existing.giftCounterDate !== today) {
      await db
        .update(xmasJulyProgress)
        .set({
          giftsSentToday: 0,
          tokensSpentToday: 0,
          giftCounterDate: today,
        })
        .where(eq(xmasJulyProgress.userId, userId));
      return {
        ...existing,
        giftsSentToday: 0,
        tokensSpentToday: 0,
        giftCounterDate: today,
      };
    }
    return existing;
  }
  await db.insert(xmasJulyProgress).values({
    userId,
    festiveTokens: 0,
    giftCounterDate: todayString(),
  });
  const [fresh] = await db
    .select()
    .from(xmasJulyProgress)
    .where(eq(xmasJulyProgress.userId, userId))
    .limit(1);
  return fresh!;
}

/** Daily gift send cap — anti-farm. */
const DAILY_GIFT_CAP = 50;

async function ensureCharityPool(
  db: DbLike,
) {
  const [existing] = await db
    .select()
    .from(xmasJulyCharityPool)
    .where(eq(xmasJulyCharityPool.eventKey, CHRISTMAS_EVENT_KEY))
    .limit(1);
  if (existing) return existing;
  await db.insert(xmasJulyCharityPool).values({
    eventKey: CHRISTMAS_EVENT_KEY,
    totalGifts: 0,
    totalTokensDonated: 0,
    communityPool: 0,
    milestonesReached: [],
  });
  const [fresh] = await db
    .select()
    .from(xmasJulyCharityPool)
    .where(eq(xmasJulyCharityPool.eventKey, CHRISTMAS_EVENT_KEY))
    .limit(1);
  return fresh!;
}

/** Broadcast a system notification to all participants when a milestone is hit. */
async function broadcastMilestone(
  db: DbLike,
  milestoneId: string,
  milestoneName: string,
  reward: string,
) {
  // Find every user who has an xmas_july_progress row — those are the
  // participants. Batch insert notifications in chunks.
  const participants = await db
    .select({ userId: xmasJulyProgress.userId })
    .from(xmasJulyProgress);
  if (participants.length === 0) return;
  const rows = participants.map(p => ({
    userId: p.userId,
    type: "seasonal_event" as const,
    title: `Christmas in July — ${milestoneName}`,
    message: `The community reached the ${milestoneName} milestone! Reward: ${reward}`,
    actionUrl: "/events/christmas-in-july",
    metadata: { eventKey: CHRISTMAS_EVENT_KEY, milestoneId },
  }));
  // MySQL can handle ~1000 rows in one insert comfortably.
  const chunk = 500;
  for (let i = 0; i < rows.length; i += chunk) {
    await db.insert(notifications).values(rows.slice(i, i + chunk));
  }
}

/** After a gift is sent or charity contribution is made, re-check milestones. */
async function checkMilestones(
  db: DbLike,
) {
  const pool = await ensureCharityPool(db);
  const reached = new Set(pool.milestonesReached ?? []);
  const newlyReached: typeof CHRISTMAS_MILESTONES = [];
  for (const milestone of CHRISTMAS_MILESTONES) {
    if (!reached.has(milestone.id) && pool.totalGifts >= milestone.threshold) {
      reached.add(milestone.id);
      newlyReached.push(milestone);
    }
  }
  if (newlyReached.length > 0) {
    await db
      .update(xmasJulyCharityPool)
      .set({ milestonesReached: Array.from(reached) })
      .where(eq(xmasJulyCharityPool.eventKey, CHRISTMAS_EVENT_KEY));
    for (const milestone of newlyReached) {
      await broadcastMilestone(db, milestone.id, milestone.name, milestone.inGameReward);
    }
  }
  return newlyReached;
}

export const christmasInJulyRouter = router({
  /** Event configuration (dates, costs, rewards) — public. */
  getConfig: publicProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(() => ({
      config: CHRISTMAS_EVENT_CONFIG,
      milestones: CHRISTMAS_MILESTONES,
      wheelPrizes: CHRISTMAS_WHEEL_PRIZES,
      dailyChallenges: CHRISTMAS_DAILY_CHALLENGES,
      currentDay: currentEventDay(),
    })),

  /** Global charity pool progress — public. */
  getCharityPool: publicProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(async () => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return ensureCharityPool(db);
    }),

  /** Per-user event progress. */
  getMyProgress: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return ensureProgress(db, ctx.user.id);
    }),

  /** Claim the daily free 10 tokens (once per UTC day). */
  claimDailyTokens: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);
        const today = todayString();
        if (progress.lastDailyTokenClaim === today) {
          throw new Error("Daily tokens already claimed today.");
        }
        await tx
          .update(xmasJulyProgress)
          .set({
            festiveTokens: progress.festiveTokens + CHRISTMAS_EVENT_CONFIG.freeTokensPerDay,
            lastDailyTokenClaim: today,
          })
          .where(eq(xmasJulyProgress.userId, ctx.user.id));
        return {
          claimed: CHRISTMAS_EVENT_CONFIG.freeTokensPerDay,
          festiveTokens: progress.festiveTokens + CHRISTMAS_EVENT_CONFIG.freeTokensPerDay,
        };
      });
    }),

  /** Spin the Wheel of Wonders. Costs 5 festive tokens (0 if free spin). */
  spinWheel: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .input(z.object({ useFreeSpin: z.boolean().default(false) }).optional())
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);
        const cost = input?.useFreeSpin ? 0 : CHRISTMAS_EVENT_CONFIG.wheelSpinCost;
        if (progress.festiveTokens < cost) {
          throw new Error("Not enough Festive Tokens.");
        }
        const seed = randomSeed();
        const rng = createRng(seed);
        const prize = spinWheel(CHRISTMAS_WHEEL_PRIZES, rng);

        const updates: Partial<typeof progress> = {
          festiveTokens: progress.festiveTokens - cost,
          tokensSpent: progress.tokensSpent + cost,
          tokensSpentToday: progress.tokensSpentToday + cost,
        };

        // Apply prize effects
        if (prize.prizeType === "tokens") {
          updates.festiveTokens = (updates.festiveTokens ?? progress.festiveTokens) + prize.amount;
        } else if (prize.prizeType === "gift_box") {
          updates.giftBoxesOwned = progress.giftBoxesOwned + 1;
        } else if (prize.prizeType === "soul_stone") {
          updates.snowflakeStones = progress.snowflakeStones + 1;
        } else if (prize.prizeType === "charity_multiplier") {
          updates.charityMultiplierRemaining = progress.charityMultiplierRemaining + 100;
        } else if (prize.prizeType === "jackpot") {
          updates.festiveTokens = (updates.festiveTokens ?? progress.festiveTokens) + prize.amount;
          const rewards = [...(progress.unlockedRewards ?? []), "title_high_roller"];
          updates.unlockedRewards = rewards;
        }

        await tx
          .update(xmasJulyProgress)
          .set(updates)
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        await tx.insert(xmasJulyWheelSpins).values({
          userId: ctx.user.id,
          prizeId: prize.id,
          prizeType: prize.prizeType,
          amount: prize.amount,
          rarity: prize.rarity,
        });

        return {
          prize,
          seed,
          progress: { ...progress, ...updates },
        };
      });
    }),

  /** Roll Soul Stone Craps. Consumes 1 soul stone on the client; server
   *  records the outcome and returns instructions for client-side state. */
  rollCraps: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .input(z.object({ stoneId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);
        const seed = randomSeed();
        const rng = createRng(seed);
        const roll = rollCraps(rng);

        const updates: Partial<typeof progress> = {
          stonesWagered: progress.stonesWagered + 1,
          festiveTokens: progress.festiveTokens + roll.bonusFestiveTokens,
          giftBoxesOwned: progress.giftBoxesOwned + roll.bonusGiftBoxes,
          snowflakeStones: progress.snowflakeStones + roll.bonusSoulStones,
        };

        if (roll.outcome === "win" || roll.outcome === "miracle" || roll.outcome === "blessed") {
          updates.stonesWon = progress.stonesWon + 1;
        }
        if (roll.outcome === "blessed") {
          updates.blessedPurifications = progress.blessedPurifications + 1;
        }

        await tx
          .update(xmasJulyProgress)
          .set(updates)
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        await tx.insert(xmasJulyCrapsRolls).values({
          userId: ctx.user.id,
          total: roll.total,
          die1: roll.die1,
          die2: roll.die2,
          outcome: roll.outcome,
          stoneId: input.stoneId,
        });

        // Losing rolls contribute to the community pool; miracles pull from it.
        const pool = await ensureCharityPool(tx);
        if (roll.outcome === "hierarchy_claims" || roll.outcome === "loss_to_pool") {
          await tx
            .update(xmasJulyCharityPool)
            .set({ communityPool: pool.communityPool + 1 })
            .where(eq(xmasJulyCharityPool.eventKey, CHRISTMAS_EVENT_KEY));
        }

        return {
          roll,
          seed,
          progress: { ...progress, ...updates },
          /**
           * Tells the client what to do to the wagered soul stone:
           *  - "consumed" = remove from store (lost to pool)
           *  - "corrupted" = flip to red (hierarchy claims)
           *  - "purified" = flip to gold (blessed)
           *  - "returned" = leave as-is (win/miracle)
           */
          stoneAction:
            roll.outcome === "hierarchy_claims" ? "corrupted" :
            roll.outcome === "loss_to_pool"     ? "consumed" :
            roll.outcome === "blessed"          ? "purified" :
            "returned" as const,
        };
      });
    }),

  /** Send a gift to another player. Costs 5 tokens (gift_box craft). */
  sendGift: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .input(z.object({
      recipientId: z.number().int().positive(),
      giftType: z.enum(GIFT_TYPES),
      message: z.string().max(280).optional(),
      useInventory: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.recipientId === ctx.user.id) {
        throw new Error("You can't send a gift to yourself.");
      }
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);

        // Rate limit: max DAILY_GIFT_CAP gifts per user per UTC day
        if (progress.giftsSentToday >= DAILY_GIFT_CAP) {
          throw new Error(`Daily gift limit reached (${DAILY_GIFT_CAP}/day).`);
        }

        // Verify recipient exists
        const [recipient] = await tx.select({ id: users.id }).from(users).where(eq(users.id, input.recipientId)).limit(1);
        if (!recipient) throw new Error("Recipient not found.");

        // Either consume an inventory gift box or charge festive tokens
        let cost = 0;
        if (input.useInventory) {
          if (progress.giftBoxesOwned < 1) throw new Error("No gift boxes in inventory.");
          await tx
            .update(xmasJulyProgress)
            .set({ giftBoxesOwned: progress.giftBoxesOwned - 1 })
            .where(eq(xmasJulyProgress.userId, ctx.user.id));
        } else {
          cost = CHRISTMAS_EVENT_CONFIG.giftBoxCraftCost;
          if (progress.festiveTokens < cost) throw new Error("Not enough Festive Tokens.");
        }

        const tokensEarned = CHRISTMAS_EVENT_CONFIG.tokensPerGiftSent;
        await tx
          .update(xmasJulyProgress)
          .set({
            festiveTokens: progress.festiveTokens - cost + tokensEarned,
            giftsSent: progress.giftsSent + 1,
            giftsSentToday: progress.giftsSentToday + 1,
            tokensSpent: progress.tokensSpent + cost,
            tokensSpentToday: progress.tokensSpentToday + cost,
          })
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        // Insert gift row
        const [insertResult] = await tx
          .insert(xmasJulyGifts)
          .values({
            senderId: ctx.user.id,
            recipientId: input.recipientId,
            giftType: input.giftType as GiftType,
            message: input.message,
          });
        const giftId = Number(insertResult.insertId);

        // Update community charity pool
        const pool = await ensureCharityPool(tx);
        await tx
          .update(xmasJulyCharityPool)
          .set({ totalGifts: pool.totalGifts + 1 })
          .where(eq(xmasJulyCharityPool.eventKey, CHRISTMAS_EVENT_KEY));

        // Notify recipient
        await tx.insert(notifications).values({
          userId: input.recipientId,
          type: "seasonal_event",
          title: "You received a Christmas in July gift!",
          message: `${ctx.user.name ?? "A mysterious benefactor"} sent you a ${input.giftType.replace("_", " ")}.`,
          actionUrl: "/events/christmas-in-july",
          metadata: { eventKey: CHRISTMAS_EVENT_KEY, giftId, giftType: input.giftType },
        });

        // Milestone check (after pool updates)
        const newMilestones = await checkMilestones(tx);

        return {
          sent: true,
          giftId,
          tokensEarned,
          newMilestonesReached: newMilestones.map(m => m.id),
        };
      });
    }),

  /** Claim a received gift — marks it claimed and applies its reward. */
  claimGift: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .input(z.object({ giftId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const [gift] = await tx
          .select()
          .from(xmasJulyGifts)
          .where(and(eq(xmasJulyGifts.id, input.giftId), eq(xmasJulyGifts.recipientId, ctx.user.id)))
          .limit(1);
        if (!gift) throw new Error("Gift not found.");
        if (gift.claimed) throw new Error("Gift already claimed.");

        const progress = await ensureProgress(tx, ctx.user.id);
        const tokensEarned = CHRISTMAS_EVENT_CONFIG.tokensPerGiftReceived;

        await tx
          .update(xmasJulyGifts)
          .set({ claimed: true, claimedAt: new Date() })
          .where(eq(xmasJulyGifts.id, input.giftId));

        const updates: Partial<typeof progress> = {
          festiveTokens: progress.festiveTokens + tokensEarned,
          giftsReceived: progress.giftsReceived + 1,
        };
        if (gift.giftType === "gift_box") {
          updates.giftBoxesOwned = progress.giftBoxesOwned + 1;
        } else if (gift.giftType === "snowflake_fragment") {
          updates.snowflakeStones = progress.snowflakeStones + 1;
        }
        await tx
          .update(xmasJulyProgress)
          .set(updates)
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        return { claimed: true, tokensEarned, giftType: gift.giftType };
      });
    }),

  /** List gifts this user has received (unclaimed first). */
  myGifts: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db
        .select()
        .from(xmasJulyGifts)
        .where(
          or(
            eq(xmasJulyGifts.senderId, ctx.user.id),
            eq(xmasJulyGifts.recipientId, ctx.user.id),
          ),
        )
        .orderBy(desc(xmasJulyGifts.sentAt))
        .limit(50);
    }),

  /** Claim a completed daily challenge reward. */
  claimDailyChallenge: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .input(z.object({ day: z.number().int().min(1).max(14) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);
        const challenge = CHRISTMAS_DAILY_CHALLENGES.find(c => c.day === input.day);
        if (!challenge) throw new Error("Invalid day.");
        const today = currentEventDay();
        if (input.day > today) throw new Error("That day hasn't started yet.");
        const completed = new Set(progress.completedDays ?? []);
        if (completed.has(input.day)) throw new Error("Already claimed.");

        // Verify the requirement
        const req = challenge.requirement;
        const satisfied =
          req.type === "login" ? true :
          req.type === "gifts_sent" ? progress.giftsSent >= req.amount :
          req.type === "gifts_received" ? progress.giftsReceived >= req.amount :
          req.type === "wheel_spins" ? await (async () => {
            const [row] = await tx
              .select({ c: sql<number>`count(*)` })
              .from(xmasJulyWheelSpins)
              .where(eq(xmasJulyWheelSpins.userId, ctx.user.id));
            return (row?.c ?? 0) >= req.amount;
          })() :
          req.type === "craps_rolls" ? await (async () => {
            const [row] = await tx
              .select({ c: sql<number>`count(*)` })
              .from(xmasJulyCrapsRolls)
              .where(eq(xmasJulyCrapsRolls.userId, ctx.user.id));
            return (row?.c ?? 0) >= req.amount;
          })() :
          req.type === "gifts_sent_today" ? progress.giftsSentToday >= req.amount :
          req.type === "tokens_spent" ? progress.tokensSpent >= req.amount :
          false;

        if (!satisfied) throw new Error("Challenge requirement not met.");

        completed.add(input.day);
        const streak = progress.lastDayClaimed === input.day - 1 ? progress.streak + 1 : 1;
        const tokenReward = challenge.rewardTokens;
        const rewards = [...(progress.unlockedRewards ?? [])];
        if (challenge.rewardBadge) rewards.push(`badge_${challenge.rewardBadge}`);
        if (challenge.rewardItem) rewards.push(`item_${challenge.rewardItem}`);

        await tx
          .update(xmasJulyProgress)
          .set({
            completedDays: Array.from(completed),
            streak,
            lastDayClaimed: input.day,
            festiveTokens: progress.festiveTokens + tokenReward,
            unlockedRewards: rewards,
          })
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        return { claimed: true, day: input.day, tokenReward, streak, rewards };
      });
    }),

  /** Donate festive tokens directly to the charity pool (voluntary). */
  donateToCharity: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .use(checkEventWindow(CHRISTMAS_IN_JULY_WINDOW))
    .input(z.object({ amount: z.number().int().min(1).max(10000) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      return db.transaction(async (tx) => {
        const progress = await ensureProgress(tx, ctx.user.id);
        if (progress.festiveTokens < input.amount) throw new Error("Not enough Festive Tokens.");
        const multiplier = progress.charityMultiplierRemaining > 0 ? 2 : 1;
        await tx
          .update(xmasJulyProgress)
          .set({
            festiveTokens: progress.festiveTokens - input.amount,
            charityMultiplierRemaining: Math.max(0, progress.charityMultiplierRemaining - input.amount),
            tokensSpent: progress.tokensSpent + input.amount,
            tokensSpentToday: progress.tokensSpentToday + input.amount,
          })
          .where(eq(xmasJulyProgress.userId, ctx.user.id));

        const pool = await ensureCharityPool(tx);
        await tx
          .update(xmasJulyCharityPool)
          .set({
            totalTokensDonated: pool.totalTokensDonated + input.amount * multiplier,
            // Donating counts as 1 gift per 5 tokens toward milestones
            totalGifts: pool.totalGifts + Math.floor(input.amount / 5),
          })
          .where(eq(xmasJulyCharityPool.eventKey, CHRISTMAS_EVENT_KEY));

        const newMilestones = await checkMilestones(tx);
        return {
          donated: input.amount,
          multiplier,
          newMilestonesReached: newMilestones.map(m => m.id),
        };
      });
    }),

  /** Search for users to gift by name prefix. Excludes self. */
  searchGiftRecipients: protectedProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .input(z.object({ query: z.string().min(1).max(64) }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db
        .select({ id: users.id, name: users.name })
        .from(users)
        .where(and(
          like(users.name, `${input.query}%`),
          ne(users.id, ctx.user.id),
        ))
        .limit(10);
      return rows;
    }),

  /** Leaderboard of top gift senders. */
  topGifters: publicProcedure
    .use(checkFeatureFlag("christmas_in_july"))
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select({
          userId: xmasJulyProgress.userId,
          giftsSent: xmasJulyProgress.giftsSent,
          festiveTokens: xmasJulyProgress.festiveTokens,
        })
        .from(xmasJulyProgress)
        .orderBy(desc(xmasJulyProgress.giftsSent))
        .limit(input?.limit ?? 10);
    }),
});
