/* ═══════════════════════════════════════════════════════
   CARD GAME ACHIEVEMENTS ROUTER — Track milestones, claim rewards
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { cardGameAchievements, dreamBalance, userCards } from "../../drizzle/schema";

/* ─── ACHIEVEMENT DEFINITIONS ─── */
export interface CardAchievementDef {
  key: string;
  title: string;
  description: string;
  icon: string;
  category: "pvp" | "collection" | "crafting" | "draft" | "trading" | "general";
  tier: "bronze" | "silver" | "gold" | "diamond" | "legendary";
  target: number;
  dreamReward: number;
  cardReward?: string; // card ID to grant
}

export const CARD_ACHIEVEMENTS: CardAchievementDef[] = [
  // ─── PVP ───
  { key: "first_blood", title: "First Blood", description: "Win your first PvP match", icon: "⚔️", category: "pvp", tier: "bronze", target: 1, dreamReward: 5 },
  { key: "pvp_wins_10", title: "Warrior", description: "Win 10 PvP matches", icon: "🗡️", category: "pvp", tier: "silver", target: 10, dreamReward: 15 },
  { key: "pvp_wins_50", title: "Gladiator", description: "Win 50 PvP matches", icon: "🏛️", category: "pvp", tier: "gold", target: 50, dreamReward: 50 },
  { key: "pvp_wins_100", title: "Warlord", description: "Win 100 PvP matches", icon: "👑", category: "pvp", tier: "diamond", target: 100, dreamReward: 100 },
  { key: "pvp_wins_500", title: "Conqueror", description: "Win 500 PvP matches", icon: "🌟", category: "pvp", tier: "legendary", target: 500, dreamReward: 250 },
  { key: "win_streak_3", title: "Hot Streak", description: "Win 3 PvP matches in a row", icon: "🔥", category: "pvp", tier: "bronze", target: 3, dreamReward: 10 },
  { key: "win_streak_5", title: "Unstoppable", description: "Win 5 PvP matches in a row", icon: "💥", category: "pvp", tier: "silver", target: 5, dreamReward: 25 },
  { key: "win_streak_10", title: "Legendary Streak", description: "Win 10 PvP matches in a row", icon: "⚡", category: "pvp", tier: "gold", target: 10, dreamReward: 75 },
  { key: "reach_silver", title: "Silver Rank", description: "Reach Silver rank in PvP", icon: "🥈", category: "pvp", tier: "bronze", target: 1, dreamReward: 10 },
  { key: "reach_gold", title: "Gold Rank", description: "Reach Gold rank in PvP", icon: "🥇", category: "pvp", tier: "silver", target: 1, dreamReward: 25 },
  { key: "reach_diamond", title: "Diamond Rank", description: "Reach Diamond rank in PvP", icon: "💎", category: "pvp", tier: "gold", target: 1, dreamReward: 50 },
  { key: "reach_master", title: "Master Rank", description: "Reach Master rank in PvP", icon: "🏆", category: "pvp", tier: "diamond", target: 1, dreamReward: 100 },
  { key: "reach_grandmaster", title: "Grandmaster", description: "Reach Grandmaster rank in PvP", icon: "👁️", category: "pvp", tier: "legendary", target: 1, dreamReward: 250 },

  // ─── COLLECTION ───
  { key: "collect_10", title: "Collector", description: "Collect 10 unique cards", icon: "📦", category: "collection", tier: "bronze", target: 10, dreamReward: 5 },
  { key: "collect_50", title: "Curator", description: "Collect 50 unique cards", icon: "🗄️", category: "collection", tier: "silver", target: 50, dreamReward: 20 },
  { key: "collect_100", title: "Archivist", description: "Collect 100 unique cards", icon: "📚", category: "collection", tier: "gold", target: 100, dreamReward: 50 },
  { key: "collect_all", title: "Completionist", description: "Collect every card in the database", icon: "🌌", category: "collection", tier: "legendary", target: 178, dreamReward: 500 },
  { key: "collect_all_legendary", title: "Legend Keeper", description: "Collect all Legendary rarity cards", icon: "✨", category: "collection", tier: "diamond", target: 1, dreamReward: 100 },
  { key: "faction_order_complete", title: "Order's Archive", description: "Collect all Order-aligned cards", icon: "⚖️", category: "collection", tier: "gold", target: 1, dreamReward: 75 },
  { key: "faction_chaos_complete", title: "Chaos Manifest", description: "Collect all Chaos-aligned cards", icon: "🌀", category: "collection", tier: "gold", target: 1, dreamReward: 75 },

  // ─── CRAFTING ───
  { key: "first_craft", title: "Apprentice Crafter", description: "Craft your first card", icon: "🔨", category: "crafting", tier: "bronze", target: 1, dreamReward: 5 },
  { key: "craft_10", title: "Journeyman Crafter", description: "Craft 10 cards", icon: "⚒️", category: "crafting", tier: "silver", target: 10, dreamReward: 15 },
  { key: "craft_legendary", title: "Legendary Smith", description: "Craft a Legendary card", icon: "🌠", category: "crafting", tier: "gold", target: 1, dreamReward: 50 },
  { key: "disenchant_50", title: "Essence Harvester", description: "Disenchant 50 cards", icon: "💀", category: "crafting", tier: "silver", target: 50, dreamReward: 20 },

  // ─── DRAFT ───
  { key: "first_draft", title: "Draft Rookie", description: "Complete your first draft tournament", icon: "🎲", category: "draft", tier: "bronze", target: 1, dreamReward: 10 },
  { key: "draft_wins_5", title: "Draft Expert", description: "Win 5 draft tournaments", icon: "🎯", category: "draft", tier: "silver", target: 5, dreamReward: 30 },
  { key: "draft_wins_20", title: "Draft Champion", description: "Win 20 draft tournaments", icon: "🏅", category: "draft", tier: "gold", target: 20, dreamReward: 75 },
  { key: "draft_perfect", title: "Perfect Draft", description: "Win a draft tournament without losing a match", icon: "💯", category: "draft", tier: "diamond", target: 1, dreamReward: 100 },

  // ─── TRADING ───
  { key: "first_trade", title: "Merchant", description: "Complete your first trade", icon: "🤝", category: "trading", tier: "bronze", target: 1, dreamReward: 5 },
  { key: "trades_10", title: "Broker", description: "Complete 10 trades", icon: "📊", category: "trading", tier: "silver", target: 10, dreamReward: 20 },
  { key: "trades_50", title: "Trade Baron", description: "Complete 50 trades", icon: "💰", category: "trading", tier: "gold", target: 50, dreamReward: 50 },

  // ─── GENERAL ───
  { key: "play_100_games", title: "Veteran", description: "Play 100 card game matches (PvP or AI)", icon: "🎮", category: "general", tier: "silver", target: 100, dreamReward: 25 },
  { key: "play_500_games", title: "Dedicated", description: "Play 500 card game matches", icon: "🕹️", category: "general", tier: "gold", target: 500, dreamReward: 75 },
  { key: "first_ai_win", title: "AI Slayer", description: "Win your first AI battle", icon: "🤖", category: "general", tier: "bronze", target: 1, dreamReward: 5 },
  { key: "defeat_all_ai", title: "Machine Breaker", description: "Defeat every AI opponent", icon: "💻", category: "general", tier: "gold", target: 1, dreamReward: 50 },
];

export const cardAchievementsRouter = router({
  /** Get all achievements with user progress */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const userProgress = await db.select().from(cardGameAchievements)
      .where(eq(cardGameAchievements.userId, ctx.user.id));

    const progressMap = new Map(userProgress.map(p => [p.achievementKey, p]));

    return CARD_ACHIEVEMENTS.map(def => {
      const progress = progressMap.get(def.key);
      return {
        ...def,
        progress: progress?.progress || 0,
        completed: progress?.completed === 1,
        rewardClaimed: progress?.rewardClaimed === 1,
        completedAt: progress?.completedAt || null,
      };
    });
  }),

  /** Increment progress for an achievement */
  incrementProgress: protectedProcedure
    .input(z.object({ achievementKey: z.string(), amount: z.number().min(1).default(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const def = CARD_ACHIEVEMENTS.find(a => a.key === input.achievementKey);
      if (!def) return { success: false, error: "Unknown achievement" };

      const [existing] = await db.select().from(cardGameAchievements)
        .where(and(
          eq(cardGameAchievements.userId, ctx.user.id),
          eq(cardGameAchievements.achievementKey, input.achievementKey),
        )).limit(1);

      if (existing) {
        if (existing.completed === 1) return { success: true, alreadyComplete: true };
        const newProgress = Math.min(existing.progress + input.amount, def.target);
        const nowComplete = newProgress >= def.target;
        await db.update(cardGameAchievements)
          .set({
            progress: newProgress,
            completed: nowComplete ? 1 : 0,
            completedAt: nowComplete ? new Date() : null,
          })
          .where(eq(cardGameAchievements.id, existing.id));
        return { success: true, progress: newProgress, completed: nowComplete, newlyCompleted: nowComplete };
      } else {
        const progress = Math.min(input.amount, def.target);
        const completed = progress >= def.target;
        await db.insert(cardGameAchievements).values({
          userId: ctx.user.id,
          achievementKey: input.achievementKey,
          progress,
          target: def.target,
          completed: completed ? 1 : 0,
          completedAt: completed ? new Date() : null,
        });
        return { success: true, progress, completed, newlyCompleted: completed };
      }
    }),

  /** Set progress to an absolute value (for rank achievements, collection counts) */
  setProgress: protectedProcedure
    .input(z.object({ achievementKey: z.string(), value: z.number().min(0) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      const def = CARD_ACHIEVEMENTS.find(a => a.key === input.achievementKey);
      if (!def) return { success: false, error: "Unknown achievement" };

      const completed = input.value >= def.target;

      const [existing] = await db.select().from(cardGameAchievements)
        .where(and(
          eq(cardGameAchievements.userId, ctx.user.id),
          eq(cardGameAchievements.achievementKey, input.achievementKey),
        )).limit(1);

      if (existing) {
        if (existing.completed === 1) return { success: true, alreadyComplete: true };
        await db.update(cardGameAchievements)
          .set({
            progress: input.value,
            completed: completed ? 1 : 0,
            completedAt: completed ? new Date() : null,
          })
          .where(eq(cardGameAchievements.id, existing.id));
      } else {
        await db.insert(cardGameAchievements).values({
          userId: ctx.user.id,
          achievementKey: input.achievementKey,
          progress: input.value,
          target: def.target,
          completed: completed ? 1 : 0,
          completedAt: completed ? new Date() : null,
        });
      }

      return { success: true, progress: input.value, completed };
    }),

  /** Claim reward for a completed achievement */
  claimReward: protectedProcedure
    .input(z.object({ achievementKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, error: "DB unavailable" };

      const def = CARD_ACHIEVEMENTS.find(a => a.key === input.achievementKey);
      if (!def) return { success: false, error: "Unknown achievement" };

      const [existing] = await db.select().from(cardGameAchievements)
        .where(and(
          eq(cardGameAchievements.userId, ctx.user.id),
          eq(cardGameAchievements.achievementKey, input.achievementKey),
        )).limit(1);

      if (!existing || existing.completed !== 1) return { success: false, error: "Achievement not completed" };
      if (existing.rewardClaimed === 1) return { success: false, error: "Reward already claimed" };

      // Grant Dream tokens
      if (def.dreamReward > 0) {
        const [bal] = await db.select().from(dreamBalance).where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        if (bal) {
          await db.update(dreamBalance)
            .set({ dreamTokens: sql`dreamTokens + ${def.dreamReward}` })
            .where(eq(dreamBalance.userId, ctx.user.id));
        } else {
          await db.insert(dreamBalance).values({ userId: ctx.user.id, dreamTokens: def.dreamReward, soulBoundDream: 0 });
        }
      }

      // Grant card reward if applicable
      if (def.cardReward) {
        const [existing2] = await db.select().from(userCards)
          .where(and(eq(userCards.userId, ctx.user.id), eq(userCards.cardId, def.cardReward))).limit(1);
        if (existing2) {
          await db.update(userCards)
            .set({ quantity: sql`quantity + 1` })
            .where(eq(userCards.id, existing2.id));
        } else {
          await db.insert(userCards).values({
            userId: ctx.user.id, cardId: def.cardReward, quantity: 1, obtainedVia: "achievement",
          });
        }
      }

      // Mark reward as claimed
      await db.update(cardGameAchievements)
        .set({ rewardClaimed: 1 })
        .where(eq(cardGameAchievements.id, existing.id));

      return { success: true, dreamReward: def.dreamReward, cardReward: def.cardReward };
    }),

  /** Get summary stats */
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { total: 0, completed: 0, claimed: 0, totalDreamEarned: 0 };

    const all = await db.select().from(cardGameAchievements)
      .where(eq(cardGameAchievements.userId, ctx.user.id));

    const completed = all.filter(a => a.completed === 1).length;
    const claimed = all.filter(a => a.rewardClaimed === 1).length;
    const claimedKeys = new Set(all.filter(a => a.rewardClaimed === 1).map(a => a.achievementKey));
    const totalDreamEarned = CARD_ACHIEVEMENTS
      .filter(d => claimedKeys.has(d.key))
      .reduce((sum, d) => sum + d.dreamReward, 0);

    return { total: CARD_ACHIEVEMENTS.length, completed, claimed, totalDreamEarned };
  }),
});
