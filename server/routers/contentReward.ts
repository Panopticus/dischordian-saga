/* ═══════════════════════════════════════════════════════
   CONTENT REWARD ROUTER — Card unlocking through content participation
   Watching episodes, completing CoNexus games, solving quizzes → rewards
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { contentParticipation, contentRewards, userCards, dreamBalance, cards } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

// ═══ REWARD DEFINITIONS (in-code for fast access) ═══
// These define what rewards are given for each content type
const CONTENT_REWARD_MAP: Record<string, {
  dreamTokens: number;
  xp: number;
  cardPool?: string; // rarity pool for random card reward
  guaranteedCards?: string[]; // specific card IDs always awarded
}> = {
  // Watching an episode → small reward
  episode: { dreamTokens: 5, xp: 25, cardPool: "common" },
  // Completing a CoNexus game → medium reward
  conexus_game: { dreamTokens: 15, xp: 75, cardPool: "uncommon" },
  // Solving a lore quiz → small reward
  quiz: { dreamTokens: 10, xp: 50, cardPool: "common" },
  // Listening to a full album → medium reward
  album: { dreamTokens: 20, xp: 100, cardPool: "rare" },
  // Completing a boss fight → large reward (handled separately in fight system)
  boss_fight: { dreamTokens: 50, xp: 200, cardPool: "epic" },
  // Fight game victory → card drop
  fight_victory: { dreamTokens: 10, xp: 30, cardPool: "uncommon" },
  // Fight game invasion boss → rare cards
  fight_invasion: { dreamTokens: 30, xp: 150, cardPool: "rare" },
};

// Milestone thresholds for bonus rewards
const MILESTONES = [
  { threshold: 5, reward: "uncommon", dream: 50, label: "5 completions" },
  { threshold: 10, reward: "rare", dream: 100, label: "10 completions" },
  { threshold: 25, reward: "epic", dream: 250, label: "25 completions" },
  { threshold: 50, reward: "legendary", dream: 500, label: "50 completions" },
  { threshold: 100, reward: "mythic", dream: 1000, label: "100 completions" },
];

async function grantRandomCard(db: any, userId: number, rarityPool: string): Promise<string | null> {
  // Pick a random card from the pool
  const pool = await db.select()
    .from(cards)
    .where(and(eq(cards.rarity, rarityPool as any), eq(cards.isActive, 1)))
    .limit(50);

  if (pool.length === 0) return null;
  const randomCard = pool[Math.floor(Math.random() * pool.length)];

  // Grant the card
  const existing = await db.select()
    .from(userCards)
    .where(and(eq(userCards.userId, userId), eq(userCards.cardId, randomCard.cardId)))
    .limit(1);

  if (existing.length > 0) {
    await db.update(userCards)
      .set({ quantity: sql`${userCards.quantity} + 1` })
      .where(and(eq(userCards.userId, userId), eq(userCards.cardId, randomCard.cardId)));
  } else {
    await db.insert(userCards).values({
      userId,
      cardId: randomCard.cardId,
      quantity: 1,
      isFoil: 0,
      cardLevel: 1,
      obtainedVia: "content",
    });
  }

  return randomCard.cardId;
}

async function grantDream(db: any, userId: number, amount: number) {
  const existing = await db.select()
    .from(dreamBalance)
    .where(eq(dreamBalance.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    await db.update(dreamBalance)
      .set({
        dreamTokens: sql`${dreamBalance.dreamTokens} + ${amount}`,
        totalDreamEarned: sql`${dreamBalance.totalDreamEarned} + ${amount}`,
      })
      .where(eq(dreamBalance.userId, userId));
  } else {
    await db.insert(dreamBalance).values({
      userId,
      dreamTokens: amount,
      totalDreamEarned: amount,
      soulBoundDream: 0,
      dnaCode: 0,
    });
  }
}

export const contentRewardRouter = router({
  // ═══ RECORD CONTENT PARTICIPATION ═══
  recordParticipation: protectedProcedure
    .input(z.object({
      contentType: z.string(),
      contentId: z.string(),
      completed: z.boolean().default(false),
      progress: z.number().min(0).max(100).default(0),
      metadata: z.record(z.string(), z.unknown()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, rewards: null };

      // Check if already participated
      const existing = await db.select()
        .from(contentParticipation)
        .where(and(
          eq(contentParticipation.userId, ctx.user.id),
          eq(contentParticipation.contentType, input.contentType),
          eq(contentParticipation.contentId, input.contentId),
        ))
        .limit(1);

      const alreadyCompleted = existing.length > 0 && existing[0].completed === 1;

      if (existing.length > 0) {
        // Update existing participation
        await db.update(contentParticipation)
          .set({
            completed: input.completed ? 1 : existing[0].completed,
            progress: Math.max(existing[0].progress, input.progress),
            metadata: input.metadata || existing[0].metadata,
          })
          .where(eq(contentParticipation.id, existing[0].id));
      } else {
        // Create new participation
        await db.insert(contentParticipation).values({
          userId: ctx.user.id,
          contentType: input.contentType,
          contentId: input.contentId,
          completed: input.completed ? 1 : 0,
          progress: input.progress,
          metadata: input.metadata || {},
        });
      }

      // Grant rewards if newly completed
      if (input.completed && !alreadyCompleted) {
        const rewardDef = CONTENT_REWARD_MAP[input.contentType];
        if (!rewardDef) return { success: true, rewards: null };

        const rewards: { type: string; value: string; quantity: number }[] = [];

        // Grant Dream tokens
        if (rewardDef.dreamTokens > 0) {
          await grantDream(db, ctx.user.id, rewardDef.dreamTokens);
          rewards.push({ type: "dream", value: String(rewardDef.dreamTokens), quantity: rewardDef.dreamTokens });
        }

        // Grant random card from pool
        if (rewardDef.cardPool) {
          const cardId = await grantRandomCard(db, ctx.user.id, rewardDef.cardPool);
          if (cardId) {
            rewards.push({ type: "card", value: cardId, quantity: 1 });
          }
        }

        // Grant specific cards
        if (rewardDef.guaranteedCards) {
          for (const cardId of rewardDef.guaranteedCards) {
            const ex = await db.select()
              .from(userCards)
              .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, cardId)))
              .limit(1);
            if (ex.length > 0) {
              await db.update(userCards)
                .set({ quantity: sql`${userCards.quantity} + 1` })
                .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, cardId)));
            } else {
              await db.insert(userCards).values({
                userId: ctx.user.id,
                cardId,
                quantity: 1,
                isFoil: 0,
                cardLevel: 1,
                obtainedVia: "content",
              });
            }
            rewards.push({ type: "card", value: cardId, quantity: 1 });
          }
        }

        // Mark rewards as claimed
        await db.update(contentParticipation)
          .set({ rewardsClaimed: 1 })
          .where(and(
            eq(contentParticipation.userId, ctx.user.id),
            eq(contentParticipation.contentType, input.contentType),
            eq(contentParticipation.contentId, input.contentId),
          ));

        // Check milestones
        const [totalCompleted] = await db.select({ count: sql<number>`COUNT(*)` })
          .from(contentParticipation)
          .where(and(
            eq(contentParticipation.userId, ctx.user.id),
            eq(contentParticipation.completed, 1),
          ));
        const total = Number(totalCompleted?.count ?? 0);

        const milestone = MILESTONES.find(m => m.threshold === total);
        if (milestone) {
          const milestoneCard = await grantRandomCard(db, ctx.user.id, milestone.reward);
          if (milestoneCard) {
            rewards.push({ type: "milestone_card", value: milestoneCard, quantity: 1 });
          }
          await grantDream(db, ctx.user.id, milestone.dream);
          rewards.push({ type: "milestone_dream", value: String(milestone.dream), quantity: milestone.dream });
        }

        return { success: true, rewards };
      }

      return { success: true, rewards: null };
    }),

  // ═══ GET MY PARTICIPATION HISTORY ═══
  myParticipation: protectedProcedure
    .input(z.object({
      contentType: z.string().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [eq(contentParticipation.userId, ctx.user.id)];
      if (input?.contentType) {
        conditions.push(eq(contentParticipation.contentType, input.contentType));
      }

      return db.select()
        .from(contentParticipation)
        .where(and(...conditions))
        .orderBy(sql`${contentParticipation.updatedAt} DESC`);
    }),

  // ═══ CHECK IF CONTENT IS COMPLETED ═══
  isCompleted: protectedProcedure
    .input(z.object({
      contentType: z.string(),
      contentId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return false;

      const existing = await db.select()
        .from(contentParticipation)
        .where(and(
          eq(contentParticipation.userId, ctx.user.id),
          eq(contentParticipation.contentType, input.contentType),
          eq(contentParticipation.contentId, input.contentId),
          eq(contentParticipation.completed, 1),
        ))
        .limit(1);

      return existing.length > 0;
    }),

  // ═══ GET COMPLETION STATS ═══
  stats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { total: 0, completed: 0, byType: {} };

    const [total] = await db.select({ count: sql<number>`COUNT(*)` })
      .from(contentParticipation)
      .where(eq(contentParticipation.userId, ctx.user.id));

    const [completed] = await db.select({ count: sql<number>`COUNT(*)` })
      .from(contentParticipation)
      .where(and(
        eq(contentParticipation.userId, ctx.user.id),
        eq(contentParticipation.completed, 1),
      ));

    const byType = await db.select({
      contentType: contentParticipation.contentType,
      count: sql<number>`COUNT(*)`,
      completedCount: sql<number>`SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END)`,
    })
      .from(contentParticipation)
      .where(eq(contentParticipation.userId, ctx.user.id))
      .groupBy(contentParticipation.contentType);

    return {
      total: Number(total?.count ?? 0),
      completed: Number(completed?.count ?? 0),
      byType: Object.fromEntries(byType.map(r => [
        r.contentType,
        { total: Number(r.count), completed: Number(r.completedCount) },
      ])),
    };
  }),

  // ═══ REWARD DEFINITIONS (public) ═══
  getRewardInfo: publicProcedure.query(() => {
    return {
      rewards: CONTENT_REWARD_MAP,
      milestones: MILESTONES,
    };
  }),
});
