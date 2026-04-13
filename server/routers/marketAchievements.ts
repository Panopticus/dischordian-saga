import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { achievements, userAchievements, notifications } from "../../drizzle/schema";
import { eq, and, inArray } from "drizzle-orm";

/* ═══════════════════════════════════════════════════════
   ACHIEVEMENT DEFINITIONS — Marketplace + Social + Combat + Exploration
   ═══════════════════════════════════════════════════════ */

interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "marketplace" | "social" | "combat" | "exploration" | "crafting" | "collector" | "economy";
  tier: "bronze" | "silver" | "gold" | "platinum" | "legendary";
  xpReward: number;
  pointsReward: number;
  condition: { type: string; count: number; [key: string]: unknown };
  hidden?: boolean;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  // ═══ MARKETPLACE ACHIEVEMENTS ═══
  { id: "market_first_listing", name: "Open for Business", description: "List your first item on the Intergalactic Market", icon: "store", category: "marketplace", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "market_listings", count: 1 } },
  { id: "market_10_listings", name: "Vendor", description: "List 10 items on the marketplace", icon: "store", category: "marketplace", tier: "silver", xpReward: 150, pointsReward: 300, condition: { type: "market_listings", count: 10 } },
  { id: "market_50_listings", name: "Merchant Prince", description: "List 50 items on the marketplace", icon: "store", category: "marketplace", tier: "gold", xpReward: 400, pointsReward: 800, condition: { type: "market_listings", count: 50 } },
  { id: "market_first_sale", name: "First Blood Money", description: "Sell your first item on the marketplace", icon: "dollar-sign", category: "marketplace", tier: "bronze", xpReward: 75, pointsReward: 150, condition: { type: "market_sales", count: 1 } },
  { id: "market_25_sales", name: "Trusted Dealer", description: "Complete 25 marketplace sales", icon: "dollar-sign", category: "marketplace", tier: "silver", xpReward: 250, pointsReward: 500, condition: { type: "market_sales", count: 25 } },
  { id: "market_100_sales", name: "Trade Magnate", description: "Complete 100 marketplace sales", icon: "dollar-sign", category: "marketplace", tier: "gold", xpReward: 600, pointsReward: 1200, condition: { type: "market_sales", count: 100 } },
  { id: "market_first_purchase", name: "Smart Shopper", description: "Purchase your first item from the marketplace", icon: "shopping-cart", category: "marketplace", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "market_purchases", count: 1 } },
  { id: "market_50_purchases", name: "Compulsive Buyer", description: "Purchase 50 items from the marketplace", icon: "shopping-cart", category: "marketplace", tier: "gold", xpReward: 400, pointsReward: 800, condition: { type: "market_purchases", count: 50 } },
  { id: "market_first_auction", name: "Going Once...", description: "Win your first auction", icon: "gavel", category: "marketplace", tier: "bronze", xpReward: 100, pointsReward: 200, condition: { type: "auctions_won", count: 1 } },
  { id: "market_10_auctions", name: "Auction House Regular", description: "Win 10 auctions", icon: "gavel", category: "marketplace", tier: "silver", xpReward: 300, pointsReward: 600, condition: { type: "auctions_won", count: 10 } },
  { id: "market_whale", name: "Whale Trader", description: "Spend 100,000 Dream tokens on the marketplace", icon: "sparkles", category: "marketplace", tier: "platinum", xpReward: 1000, pointsReward: 2000, condition: { type: "market_dream_spent", count: 100000 } },
  { id: "market_tycoon", name: "Galactic Tycoon", description: "Earn 500,000 credits from marketplace sales", icon: "trending-up", category: "marketplace", tier: "legendary", xpReward: 2000, pointsReward: 5000, condition: { type: "market_credits_earned", count: 500000 } },
  { id: "market_first_buy_order", name: "Standing Order", description: "Place your first buy order", icon: "clipboard", category: "marketplace", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "buy_orders_placed", count: 1 } },
  { id: "market_exchange", name: "Currency Trader", description: "Complete 10 currency exchanges", icon: "arrow-left-right", category: "marketplace", tier: "silver", xpReward: 200, pointsReward: 400, condition: { type: "exchanges_completed", count: 10 } },

  // ═══ SOCIAL ACHIEVEMENTS ═══
  { id: "social_first_trade", name: "Handshake Deal", description: "Complete your first player-to-player trade", icon: "handshake", category: "social", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "p2p_trades", count: 1 } },
  { id: "social_10_trades", name: "Trade Network", description: "Complete 10 player trades", icon: "handshake", category: "social", tier: "silver", xpReward: 200, pointsReward: 400, condition: { type: "p2p_trades", count: 10 } },
  { id: "social_50_trades", name: "Diplomat", description: "Complete 50 player trades", icon: "handshake", category: "social", tier: "gold", xpReward: 500, pointsReward: 1000, condition: { type: "p2p_trades", count: 50 } },
  { id: "social_companion_bond", name: "First Bond", description: "Reach relationship level 25 with any companion", icon: "heart", category: "social", tier: "bronze", xpReward: 100, pointsReward: 200, condition: { type: "companion_relationship", count: 25 } },
  { id: "social_companion_trust", name: "Trusted Ally", description: "Reach relationship level 50 with any companion", icon: "heart", category: "social", tier: "silver", xpReward: 250, pointsReward: 500, condition: { type: "companion_relationship", count: 50 } },
  { id: "social_companion_soulmate", name: "Soulbound", description: "Reach relationship level 100 with any companion", icon: "heart", category: "social", tier: "gold", xpReward: 500, pointsReward: 1000, condition: { type: "companion_relationship", count: 100 } },
  { id: "social_companion_all", name: "Universal Empath", description: "Max relationship with 3 different companions", icon: "users", category: "social", tier: "platinum", xpReward: 1000, pointsReward: 2000, condition: { type: "companions_maxed", count: 3 } },
  { id: "social_gift_giver", name: "Generous Soul", description: "Give 25 gifts to companions", icon: "gift", category: "social", tier: "silver", xpReward: 150, pointsReward: 300, condition: { type: "gifts_given", count: 25 } },
  { id: "social_guild_member", name: "Syndicate Recruit", description: "Join a Syndicate", icon: "shield", category: "social", tier: "bronze", xpReward: 100, pointsReward: 200, condition: { type: "guild_joined", count: 1 } },
  { id: "social_guild_leader", name: "Syndicate Commander", description: "Become a Syndicate leader", icon: "crown", category: "social", tier: "gold", xpReward: 500, pointsReward: 1000, condition: { type: "guild_leader", count: 1 } },
  { id: "social_pvp_friendly", name: "Friendly Rival", description: "Complete 10 PvP matches", icon: "swords", category: "social", tier: "silver", xpReward: 200, pointsReward: 400, condition: { type: "pvp_matches", count: 10 } },
  { id: "social_faction_loyal", name: "Faction Loyalist", description: "Reach max reputation with any faction", icon: "flag", category: "social", tier: "gold", xpReward: 500, pointsReward: 1000, condition: { type: "faction_max_rep", count: 1 } },

  // ═══ COMBAT ACHIEVEMENTS ═══
  { id: "combat_first_win", name: "First Victory", description: "Win your first arena fight", icon: "swords", category: "combat", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "fight_wins", count: 1 } },
  { id: "combat_50_wins", name: "Arena Veteran", description: "Win 50 arena fights", icon: "swords", category: "combat", tier: "silver", xpReward: 300, pointsReward: 600, condition: { type: "fight_wins", count: 50 } },
  { id: "combat_200_wins", name: "Legendary Champion", description: "Win 200 arena fights", icon: "swords", category: "combat", tier: "gold", xpReward: 800, pointsReward: 1600, condition: { type: "fight_wins", count: 200 } },
  { id: "combat_boss_slayer", name: "Boss Slayer", description: "Defeat 5 boss encounters", icon: "skull", category: "combat", tier: "gold", xpReward: 500, pointsReward: 1000, condition: { type: "bosses_defeated", count: 5 } },
  { id: "combat_card_master", name: "Card Battle Master", description: "Win 100 card battles", icon: "shield", category: "combat", tier: "gold", xpReward: 600, pointsReward: 1200, condition: { type: "card_battle_wins", count: 100 } },
  { id: "combat_pvp_champion", name: "PvP Champion", description: "Reach ELO rating 1500", icon: "crown", category: "combat", tier: "platinum", xpReward: 1000, pointsReward: 2000, condition: { type: "elo_rating", count: 1500 } },
  { id: "combat_undefeated", name: "Undefeated Streak", description: "Win 10 fights in a row", icon: "flame", category: "combat", tier: "gold", xpReward: 500, pointsReward: 1000, condition: { type: "win_streak", count: 10 } },

  // ═══ EXPLORATION ACHIEVEMENTS ═══
  { id: "explore_first_entry", name: "Curious Mind", description: "Discover your first Loredex entry", icon: "eye", category: "exploration", tier: "bronze", xpReward: 25, pointsReward: 50, condition: { type: "entries_discovered", count: 1 } },
  { id: "explore_25_entries", name: "Investigator", description: "Discover 25 Loredex entries", icon: "eye", category: "exploration", tier: "silver", xpReward: 200, pointsReward: 400, condition: { type: "entries_discovered", count: 25 } },
  { id: "explore_100_entries", name: "Archivist", description: "Discover 100 Loredex entries", icon: "eye", category: "exploration", tier: "gold", xpReward: 600, pointsReward: 1200, condition: { type: "entries_discovered", count: 100 } },
  { id: "explore_all_entries", name: "Omniscient", description: "Discover all Loredex entries", icon: "eye", category: "exploration", tier: "legendary", xpReward: 2000, pointsReward: 5000, condition: { type: "entries_discovered", count: 999 } },
  { id: "explore_10_sectors", name: "Sector Scout", description: "Explore 10 trade sectors", icon: "map", category: "exploration", tier: "silver", xpReward: 200, pointsReward: 400, condition: { type: "sectors_explored", count: 10 } },
  { id: "explore_timeline", name: "Time Traveler", description: "View the complete timeline", icon: "clock", category: "exploration", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "timeline_viewed", count: 1 } },
  { id: "explore_all_albums", name: "Audiophile", description: "Listen to tracks from all 4 albums", icon: "music", category: "exploration", tier: "silver", xpReward: 200, pointsReward: 400, condition: { type: "albums_listened", count: 4 } },

  // ═══ CRAFTING ACHIEVEMENTS ═══
  { id: "craft_first_item", name: "Apprentice Forger", description: "Craft your first item", icon: "zap", category: "crafting", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "items_crafted", count: 1 } },
  { id: "craft_25_items", name: "Journeyman Forger", description: "Craft 25 items", icon: "zap", category: "crafting", tier: "silver", xpReward: 250, pointsReward: 500, condition: { type: "items_crafted", count: 25 } },
  { id: "craft_legendary", name: "Legendary Forger", description: "Craft a legendary item", icon: "sparkles", category: "crafting", tier: "gold", xpReward: 500, pointsReward: 1000, condition: { type: "legendary_crafted", count: 1 } },
  { id: "craft_disenchant_10", name: "Salvage Expert", description: "Disenchant 10 cards", icon: "scissors", category: "crafting", tier: "silver", xpReward: 150, pointsReward: 300, condition: { type: "cards_disenchanted", count: 10 } },

  // ═══ COLLECTOR ACHIEVEMENTS ═══
  { id: "collect_10_cards", name: "Card Collector", description: "Own 10 unique cards", icon: "layers", category: "collector", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "unique_cards", count: 10 } },
  { id: "collect_50_cards", name: "Avid Collector", description: "Own 50 unique cards", icon: "layers", category: "collector", tier: "silver", xpReward: 250, pointsReward: 500, condition: { type: "unique_cards", count: 50 } },
  { id: "collect_all_common", name: "Common Complete", description: "Own all common cards", icon: "layers", category: "collector", tier: "gold", xpReward: 400, pointsReward: 800, condition: { type: "all_rarity", count: 1, rarity: "common" } },
  { id: "collect_mythic", name: "Mythic Hunter", description: "Own a mythic card", icon: "sparkles", category: "collector", tier: "platinum", xpReward: 1000, pointsReward: 2000, condition: { type: "mythic_owned", count: 1 } },

  // ═══ ECONOMY ACHIEVEMENTS ═══
  { id: "econ_earn_10k", name: "Getting Started", description: "Earn 10,000 credits total", icon: "trending-up", category: "economy", tier: "bronze", xpReward: 50, pointsReward: 100, condition: { type: "total_credits_earned", count: 10000 } },
  { id: "econ_earn_100k", name: "Wealthy Operative", description: "Earn 100,000 credits total", icon: "trending-up", category: "economy", tier: "silver", xpReward: 300, pointsReward: 600, condition: { type: "total_credits_earned", count: 100000 } },
  { id: "econ_earn_1m", name: "Millionaire", description: "Earn 1,000,000 credits total", icon: "trending-up", category: "economy", tier: "gold", xpReward: 800, pointsReward: 1600, condition: { type: "total_credits_earned", count: 1000000 } },
  { id: "econ_dream_100", name: "Dream Weaver", description: "Accumulate 100 Dream tokens", icon: "sparkles", category: "economy", tier: "silver", xpReward: 200, pointsReward: 400, condition: { type: "dream_accumulated", count: 100 } },
  { id: "econ_dream_1000", name: "Dream Lord", description: "Accumulate 1,000 Dream tokens", icon: "sparkles", category: "economy", tier: "gold", xpReward: 600, pointsReward: 1200, condition: { type: "dream_accumulated", count: 1000 } },
  { id: "econ_login_7", name: "Dedicated", description: "Login 7 days in a row", icon: "flame", category: "economy", tier: "bronze", xpReward: 100, pointsReward: 200, condition: { type: "login_streak", count: 7 } },
  { id: "econ_login_30", name: "Iron Will", description: "Login 30 days in a row", icon: "flame", category: "economy", tier: "gold", xpReward: 500, pointsReward: 1000, condition: { type: "login_streak", count: 30 } },
  { id: "econ_quest_complete_all", name: "Completionist", description: "Complete all daily quests in a single day", icon: "check-circle", category: "economy", tier: "silver", xpReward: 200, pointsReward: 400, condition: { type: "daily_quests_all", count: 1 } },
];

export const marketAchievementsRouter = router({
  /* ─── Get all achievement definitions with user progress ─── */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { achievements: ACHIEVEMENT_DEFS.map(a => ({ ...a, earned: false, earnedAt: null as Date | null })), stats: { total: ACHIEVEMENT_DEFS.length, earned: 0, totalXp: 0, totalPoints: 0 } };

    const earned = await db.select().from(userAchievements)
      .where(eq(userAchievements.userId, ctx.user.id));

    const earnedMap = new Map(earned.map(e => [e.achievementId, e.earnedAt]));

    const enriched = ACHIEVEMENT_DEFS.map(a => ({
      ...a,
      earned: earnedMap.has(a.id),
      earnedAt: earnedMap.get(a.id) ?? null,
    }));

    const earnedCount = enriched.filter(a => a.earned).length;
    const totalXp = enriched.filter(a => a.earned).reduce((sum, a) => sum + a.xpReward, 0);
    const totalPoints = enriched.filter(a => a.earned).reduce((sum, a) => sum + a.pointsReward, 0);

    return {
      achievements: enriched,
      stats: { total: ACHIEVEMENT_DEFS.length, earned: earnedCount, totalXp, totalPoints },
    };
  }),

  /* ─── Get achievements by category ─── */
  getByCategory: protectedProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      const filtered = ACHIEVEMENT_DEFS.filter(a => a.category === input.category);
      if (!db) return filtered.map(a => ({ ...a, earned: false, earnedAt: null as Date | null }));

      const earned = await db.select().from(userAchievements)
        .where(eq(userAchievements.userId, ctx.user.id));
      const earnedMap = new Map(earned.map(e => [e.achievementId, e.earnedAt]));

      return filtered.map(a => ({
        ...a,
        earned: earnedMap.has(a.id),
        earnedAt: earnedMap.get(a.id) ?? null,
      }));
    }),

  /* ─── Check and unlock achievements based on current stats ─── */
  checkAndUnlock: protectedProcedure
    .input(z.object({
      stats: z.record(z.string(), z.number()),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { newlyUnlocked: [] };

      // Get already earned
      const earned = await db.select().from(userAchievements)
        .where(eq(userAchievements.userId, ctx.user.id));
      const earnedSet = new Set(earned.map(e => e.achievementId));

      const newlyUnlocked: AchievementDef[] = [];

      for (const ach of ACHIEVEMENT_DEFS) {
        if (earnedSet.has(ach.id)) continue;

        const statValue = input.stats[ach.condition.type] ?? 0;
        if (statValue >= ach.condition.count) {
          // Unlock it
          await db.insert(userAchievements).values({
            userId: ctx.user.id,
            achievementId: ach.id,
          });

          // Send notification
          await db.insert(notifications).values({
            userId: ctx.user.id,
            type: "achievement",
            title: `Achievement Unlocked: ${ach.name}`,
            message: ach.description,
            actionUrl: "/achievements",
          });

          newlyUnlocked.push(ach);
        }
      }

      return { newlyUnlocked };
    }),

  /* ─── Get achievement categories with counts ─── */
  getCategories: publicProcedure.query(() => {
    const categories = new Map<string, { total: number; label: string }>();
    const labels: Record<string, string> = {
      marketplace: "Marketplace", social: "Social", combat: "Combat",
      exploration: "Exploration", crafting: "Crafting", collector: "Collector", economy: "Economy",
    };
    for (const a of ACHIEVEMENT_DEFS) {
      const existing = categories.get(a.category);
      if (existing) {
        existing.total++;
      } else {
        categories.set(a.category, { total: 1, label: labels[a.category] || a.category });
      }
    }
    return Array.from(categories.entries()).map(([id, data]) => ({ id, ...data }));
  }),
});
