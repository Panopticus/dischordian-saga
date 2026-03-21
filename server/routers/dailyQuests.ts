import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { dailyQuests, loginCalendar, dreamBalance, notifications } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";

/* ═══════════════════════════════════════════════════════
   QUEST TEMPLATES — Daily, Weekly, Epoch (Season)
   ═══════════════════════════════════════════════════════ */

interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  questType: "fight" | "card_battle" | "trade" | "craft" | "explore" | "social";
  target: number;
  rewardDream: number;
  rewardXp: number;
  rewardCredits: number;
  bonusReward?: string;
}

const DAILY_TEMPLATES: QuestTemplate[] = [
  { id: "d_win_fight", title: "Champion's Path", description: "Win a fight in the arena", questType: "fight", target: 1, rewardDream: 5, rewardXp: 50, rewardCredits: 0 },
  { id: "d_win_3_fights", title: "Undefeated", description: "Win 3 fights", questType: "fight", target: 3, rewardDream: 15, rewardXp: 100, rewardCredits: 0 },
  { id: "d_play_card_battle", title: "Arena Combatant", description: "Win a card battle", questType: "card_battle", target: 1, rewardDream: 5, rewardXp: 50, rewardCredits: 0 },
  { id: "d_play_3_battles", title: "Battle Veteran", description: "Complete 3 card battles", questType: "card_battle", target: 3, rewardDream: 15, rewardXp: 100, rewardCredits: 0 },
  { id: "d_complete_trade", title: "Merchant's Profit", description: "Complete a profitable trade run", questType: "trade", target: 1, rewardDream: 0, rewardXp: 75, rewardCredits: 1000 },
  { id: "d_explore_sector", title: "Sector Scout", description: "Explore 2 new sectors", questType: "explore", target: 2, rewardDream: 8, rewardXp: 80, rewardCredits: 0 },
  { id: "d_craft_item", title: "Forge Worker", description: "Craft an item at the Forge", questType: "craft", target: 1, rewardDream: 5, rewardXp: 60, rewardCredits: 0 },
  { id: "d_gather_materials", title: "Material Hunter", description: "Collect 5 crafting materials", questType: "craft", target: 5, rewardDream: 0, rewardXp: 70, rewardCredits: 400 },
  { id: "d_send_trade", title: "Trade Diplomat", description: "Send a card trade offer", questType: "social", target: 1, rewardDream: 0, rewardXp: 40, rewardCredits: 300 },
  { id: "d_gift_companion", title: "Generous Operative", description: "Give a gift to a companion", questType: "social", target: 1, rewardDream: 5, rewardXp: 50, rewardCredits: 0 },
  { id: "d_discover_entity", title: "Intelligence Gatherer", description: "Discover a new entity in the Loredex", questType: "explore", target: 1, rewardDream: 3, rewardXp: 40, rewardCredits: 0 },
  { id: "d_complete_quiz", title: "Lore Scholar", description: "Score 80%+ on a lore quiz", questType: "explore", target: 1, rewardDream: 10, rewardXp: 120, rewardCredits: 0 },
  { id: "d_list_marketplace", title: "Market Vendor", description: "List an item on the marketplace", questType: "trade", target: 1, rewardDream: 0, rewardXp: 30, rewardCredits: 200 },
  { id: "d_buy_marketplace", title: "Smart Shopper", description: "Purchase from the marketplace", questType: "trade", target: 1, rewardDream: 3, rewardXp: 30, rewardCredits: 0 },
  { id: "d_earn_credits", title: "Credit Mogul", description: "Earn 5,000 credits from trading", questType: "trade", target: 5000, rewardDream: 10, rewardXp: 100, rewardCredits: 0 },
  { id: "d_use_special", title: "Special Forces", description: "Use 3 special moves in fights", questType: "fight", target: 3, rewardDream: 0, rewardXp: 60, rewardCredits: 300 },
];

const WEEKLY_TEMPLATES: QuestTemplate[] = [
  { id: "w_win_10_fights", title: "Arena Dominator", description: "Win 10 fights this week", questType: "fight", target: 10, rewardDream: 50, rewardXp: 500, rewardCredits: 0, bonusReward: "Rare Card Pack" },
  { id: "w_win_10_battles", title: "Card Warlord", description: "Win 10 card battles this week", questType: "card_battle", target: 10, rewardDream: 50, rewardXp: 500, rewardCredits: 0, bonusReward: "Rare Card Pack" },
  { id: "w_trade_50k", title: "Trade Baron", description: "Earn 50,000 credits from trade runs", questType: "trade", target: 50000, rewardDream: 30, rewardXp: 400, rewardCredits: 5000, bonusReward: "5 Crafting Materials" },
  { id: "w_craft_5", title: "Master Forger", description: "Craft 5 items at the Forge", questType: "craft", target: 5, rewardDream: 25, rewardXp: 350, rewardCredits: 0, bonusReward: "Rare Material" },
  { id: "w_explore_10", title: "Deep Space Pioneer", description: "Explore 10 sectors", questType: "explore", target: 10, rewardDream: 30, rewardXp: 400, rewardCredits: 2000 },
  { id: "w_discover_5", title: "Intelligence Operative", description: "Discover 5 new Loredex entries", questType: "explore", target: 5, rewardDream: 20, rewardXp: 300, rewardCredits: 0 },
  { id: "w_social_10", title: "Networker", description: "Complete 10 social interactions", questType: "social", target: 10, rewardDream: 25, rewardXp: 300, rewardCredits: 1000 },
  { id: "w_marketplace_5", title: "Market Mogul", description: "Complete 5 marketplace transactions", questType: "trade", target: 5, rewardDream: 20, rewardXp: 250, rewardCredits: 3000, bonusReward: "Market Fee Discount" },
  { id: "w_pvp_5", title: "PvP Gladiator", description: "Win 5 PvP matches", questType: "fight", target: 5, rewardDream: 40, rewardXp: 450, rewardCredits: 0, bonusReward: "PvP Title Token" },
  { id: "w_complete_dailies", title: "Dedicated Operative", description: "Complete all daily quests 5 days", questType: "explore", target: 5, rewardDream: 40, rewardXp: 500, rewardCredits: 0, bonusReward: "Loyalty Badge" },
];

const EPOCH_TEMPLATES: QuestTemplate[] = [
  { id: "e_win_100_fights", title: "Legendary Champion", description: "Win 100 fights this season", questType: "fight", target: 100, rewardDream: 200, rewardXp: 3000, rewardCredits: 0, bonusReward: "Legendary Fighter Skin" },
  { id: "e_win_100_battles", title: "Grand Strategist", description: "Win 100 card battles this season", questType: "card_battle", target: 100, rewardDream: 200, rewardXp: 3000, rewardCredits: 0, bonusReward: "Mythic Card Pack" },
  { id: "e_trade_500k", title: "Galactic Tycoon", description: "Earn 500,000 credits from trading", questType: "trade", target: 500000, rewardDream: 150, rewardXp: 2500, rewardCredits: 50000, bonusReward: "Exclusive Ship Skin" },
  { id: "e_craft_50", title: "Forge Grandmaster", description: "Craft 50 items this season", questType: "craft", target: 50, rewardDream: 100, rewardXp: 2000, rewardCredits: 0, bonusReward: "Legendary Recipe Unlock" },
  { id: "e_discover_all", title: "Omniscient Archivist", description: "Discover 50 Loredex entries", questType: "explore", target: 50, rewardDream: 150, rewardXp: 2500, rewardCredits: 0, bonusReward: "Archivist Title + Frame" },
  { id: "e_marketplace_100", title: "Market Emperor", description: "Complete 100 marketplace transactions", questType: "trade", target: 100, rewardDream: 100, rewardXp: 2000, rewardCredits: 25000, bonusReward: "0% Market Fee for 1 Week" },
  { id: "e_social_master", title: "Panopticon Influencer", description: "Max relationship with 3 companions", questType: "social", target: 3, rewardDream: 100, rewardXp: 2000, rewardCredits: 0, bonusReward: "Exclusive Companion Dialogue" },
  { id: "e_pvp_champion", title: "Epoch Champion", description: "Reach top 10 in PvP rankings", questType: "fight", target: 1, rewardDream: 300, rewardXp: 5000, rewardCredits: 0, bonusReward: "Champion Title + Animated Frame" },
  { id: "e_complete_weeklies", title: "Iron Will", description: "Complete all weekly quests 4 times", questType: "explore", target: 4, rewardDream: 200, rewardXp: 3000, rewardCredits: 10000, bonusReward: "Season Badge" },
  { id: "e_guild_glory", title: "Syndicate Legend", description: "Contribute 10,000 XP to your Syndicate", questType: "social", target: 10000, rewardDream: 150, rewardXp: 2500, rewardCredits: 0, bonusReward: "Syndicate Banner Upgrade" },
];

/** Deterministic quest selection based on date seed */
function selectQuests(templates: QuestTemplate[], dateStr: string, count: number): QuestTemplate[] {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  const shuffled = [...templates].sort((a, b) => {
    const ha = ((hash * 31 + a.id.charCodeAt(0)) | 0) % 1000;
    const hb = ((hash * 31 + b.id.charCodeAt(0)) | 0) % 1000;
    return ha - hb;
  });
  // Pick from different types first
  const picked: QuestTemplate[] = [];
  const usedTypes = new Set<string>();
  for (const q of shuffled) {
    if (picked.length >= count) break;
    if (!usedTypes.has(q.questType)) {
      picked.push(q);
      usedTypes.add(q.questType);
    }
  }
  for (const q of shuffled) {
    if (picked.length >= count) break;
    if (!picked.includes(q)) picked.push(q);
  }
  return picked;
}

function getTodayStr() { return new Date().toISOString().split("T")[0]; }
function getWeekStr() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}
function getEpochStr() {
  const d = new Date();
  const month = d.getMonth();
  const season = month < 3 ? "winter" : month < 6 ? "spring" : month < 9 ? "summer" : "fall";
  return `${d.getFullYear()}-${season}`;
}

/* ═══════════════════════════════════════════════════════
   LOGIN CALENDAR REWARDS
   ═══════════════════════════════════════════════════════ */
const LOGIN_REWARDS = [
  { day: 1, type: "credits", amount: 500, label: "500 Credits" },
  { day: 2, type: "dream", amount: 3, label: "3 Dream Tokens" },
  { day: 3, type: "credits", amount: 1000, label: "1,000 Credits" },
  { day: 4, type: "dream", amount: 5, label: "5 Dream Tokens" },
  { day: 5, type: "credits", amount: 2000, label: "2,000 Credits" },
  { day: 6, type: "dream", amount: 8, label: "8 Dream Tokens" },
  { day: 7, type: "dream", amount: 15, label: "15 Dream Tokens" },
  { day: 14, type: "dream", amount: 30, label: "30 Dream Tokens" },
  { day: 21, type: "dream", amount: 50, label: "50 Dream Tokens" },
  { day: 28, type: "dream", amount: 100, label: "100 Dream Tokens + Title" },
];

/** Helper: generate quests for a period if they don't exist yet */
async function ensureQuestsExist(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
  templates: QuestTemplate[],
  periodStr: string,
  count: number,
) {
  const existing = await db.select().from(dailyQuests)
    .where(and(eq(dailyQuests.userId, userId), eq(dailyQuests.questDate, periodStr)));

  if (existing.length > 0) return existing;

  const selected = selectQuests(templates, periodStr, count);
  const toInsert = selected.map(t => ({
    userId,
    questId: t.id,
    title: t.title,
    description: t.description,
    questType: t.questType,
    targetCount: t.target,
    currentCount: 0,
    rewardDream: t.rewardDream,
    rewardXp: t.rewardXp,
    rewardCredits: t.rewardCredits,
    bonusReward: t.bonusReward ?? null,
    claimed: false,
    questDate: periodStr,
  }));

  if (toInsert.length > 0) {
    await db.insert(dailyQuests).values(toInsert);
    return db.select().from(dailyQuests)
      .where(and(eq(dailyQuests.userId, userId), eq(dailyQuests.questDate, periodStr)));
  }
  return [];
}

export const dailyQuestsRouter = router({
  /* ─── Get all quests (daily + weekly + epoch) ─── */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { daily: [], weekly: [], epoch: [], today: getTodayStr(), week: getWeekStr(), epoch_period: getEpochStr() };

    const today = getTodayStr();
    const week = getWeekStr();
    const epoch = getEpochStr();

    const [daily, weekly, epochQuests] = await Promise.all([
      ensureQuestsExist(db, ctx.user.id, DAILY_TEMPLATES, today, 5),
      ensureQuestsExist(db, ctx.user.id, WEEKLY_TEMPLATES, week, 5),
      ensureQuestsExist(db, ctx.user.id, EPOCH_TEMPLATES, epoch, 5),
    ]);

    return {
      daily: daily.map(q => ({ ...q, completed: q.currentCount >= q.targetCount })),
      weekly: weekly.map(q => ({ ...q, completed: q.currentCount >= q.targetCount })),
      epoch: epochQuests.map(q => ({ ...q, completed: q.currentCount >= q.targetCount })),
      today,
      week,
      epoch_period: epoch,
    };
  }),

  /* ─── Update quest progress ─── */
  updateProgress: protectedProcedure
    .input(z.object({
      questId: z.string(),
      increment: z.number().min(1).default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      // Find the quest record for this user
      const records = await db.select().from(dailyQuests)
        .where(and(
          eq(dailyQuests.userId, ctx.user.id),
          eq(dailyQuests.questId, input.questId),
        ));

      // Get the most recent one (daily/weekly/epoch)
      const record = records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      if (!record) return { success: false, error: "Quest not found" };

      if (record.currentCount >= record.targetCount) {
        return { success: true, alreadyComplete: true };
      }

      const newCount = Math.min(record.currentCount + input.increment, record.targetCount);
      const completed = newCount >= record.targetCount;

      await db.update(dailyQuests)
        .set({ currentCount: newCount })
        .where(eq(dailyQuests.id, record.id));

      if (completed) {
        await db.insert(notifications).values({
          userId: ctx.user.id,
          type: "quest_complete",
          title: `Quest Complete: ${record.title}`,
          message: `You completed "${record.title}"! Claim your reward.`,
        });
      }

      return { success: true, currentCount: newCount, completed };
    }),

  /* ─── Claim quest reward ─── */
  claimReward: protectedProcedure
    .input(z.object({ questId: z.string(), questDate: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");

      const record = await db.select().from(dailyQuests)
        .where(and(
          eq(dailyQuests.userId, ctx.user.id),
          eq(dailyQuests.questId, input.questId),
          eq(dailyQuests.questDate, input.questDate),
        ))
        .limit(1);

      if (!record[0]) throw new Error("Quest not found");
      if (record[0].currentCount < record[0].targetCount) throw new Error("Quest not completed");
      if (record[0].claimed) throw new Error("Already claimed");

      await db.update(dailyQuests)
        .set({ claimed: true })
        .where(eq(dailyQuests.id, record[0].id));

      // Grant Dream reward
      if (record[0].rewardDream > 0) {
        const existing = await db.select().from(dreamBalance)
          .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
        if (existing[0]) {
          await db.update(dreamBalance)
            .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${record[0].rewardDream}` })
            .where(eq(dreamBalance.userId, ctx.user.id));
        } else {
          await db.insert(dreamBalance).values({
            userId: ctx.user.id, dreamTokens: record[0].rewardDream, soulBoundDream: 0,
          });
        }
      }

      return {
        success: true,
        rewardDream: record[0].rewardDream,
        rewardXp: record[0].rewardXp,
        rewardCredits: record[0].rewardCredits,
        bonusReward: record[0].bonusReward,
      };
    }),

  /* ─── Login Calendar ─── */
  getLoginCalendar: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { streak: 0, totalDays: 0, claimedToday: false, rewards: LOGIN_REWARDS, lastLoginDate: null, monthClaims: [] as number[] };

    const record = await db.select().from(loginCalendar)
      .where(eq(loginCalendar.userId, ctx.user.id))
      .limit(1);

    const today = getTodayStr();
    const row = record[0];

    if (!row) {
      return {
        streak: 0,
        totalDays: 0,
        claimedToday: false,
        rewards: LOGIN_REWARDS,
        lastLoginDate: null,
        monthClaims: [] as number[],
      };
    }

    return {
      streak: row.currentStreak,
      totalDays: row.totalDays,
      claimedToday: row.lastLoginDate === today,
      rewards: LOGIN_REWARDS,
      lastLoginDate: row.lastLoginDate,
      monthClaims: row.monthClaims ?? [],
    };
  }),

  /* ─── Claim daily login reward ─── */
  claimLogin: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database unavailable");

    const today = getTodayStr();
    const currentMonth = today.slice(0, 7); // YYYY-MM
    const dayOfMonth = new Date().getDate();

    const existing = await db.select().from(loginCalendar)
      .where(eq(loginCalendar.userId, ctx.user.id))
      .limit(1);

    const row = existing[0];

    if (row?.lastLoginDate === today) throw new Error("Already claimed today");

    // Calculate streak
    let newStreak = 1;
    if (row?.lastLoginDate) {
      const lastDate = new Date(row.lastLoginDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / 86400000);
      if (diffDays === 1) {
        newStreak = row.currentStreak + 1;
      } else if (diffDays > 1) {
        newStreak = 1; // Streak broken
      }
    }

    const newTotalDays = (row?.totalDays ?? 0) + 1;
    const longestStreak = Math.max(row?.longestStreak ?? 0, newStreak);

    // Month claims tracking
    let monthClaims: number[] = [];
    if (row?.currentMonth === currentMonth && row.monthClaims) {
      monthClaims = [...row.monthClaims, dayOfMonth];
    } else {
      monthClaims = [dayOfMonth];
    }

    // Find reward tier
    const reward = [...LOGIN_REWARDS].reverse().find(r => newStreak >= r.day) || LOGIN_REWARDS[0];

    if (row) {
      await db.update(loginCalendar)
        .set({
          currentStreak: newStreak,
          longestStreak,
          lastLoginDate: today,
          totalDays: newTotalDays,
          monthClaims,
          currentMonth,
        })
        .where(eq(loginCalendar.id, row.id));
    } else {
      await db.insert(loginCalendar).values({
        userId: ctx.user.id,
        currentStreak: newStreak,
        longestStreak: newStreak,
        lastLoginDate: today,
        totalDays: 1,
        monthClaims,
        currentMonth,
      });
    }

    // Grant reward
    if (reward.type === "dream") {
      const bal = await db.select().from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
      if (bal[0]) {
        await db.update(dreamBalance)
          .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${reward.amount}` })
          .where(eq(dreamBalance.userId, ctx.user.id));
      } else {
        await db.insert(dreamBalance).values({
          userId: ctx.user.id, dreamTokens: reward.amount, soulBoundDream: 0,
        });
      }
    }

    // Send notification
    await db.insert(notifications).values({
      userId: ctx.user.id,
      type: "daily_login",
      title: `Day ${newStreak} Login Reward!`,
      message: `You received ${reward.label}. Keep your streak going!`,
    });

    return {
      success: true,
      streak: newStreak,
      rewardType: reward.type,
      rewardAmount: reward.amount,
      rewardLabel: reward.label,
    };
  }),
});
