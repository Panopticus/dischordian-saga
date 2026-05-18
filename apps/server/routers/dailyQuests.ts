import { z } from "zod";
import { logger } from "../logger";
import { grantCardReward } from "../services/cardRewardService";
import { grantSuitMaterials } from "../services/suitMaterialsService";
import { protectedProcedure, router } from "../_core/trpc";
import { procedureRateLimit } from "../_core/procedureRateLimit";
import { getDb } from "../db";
import { dailyQuests, loginCalendar, dreamBalance, notifications, characterSheets } from "../../db/schema";
import { battlePassXp } from "../services/battlePassXp";
import { eq, and, sql } from "drizzle-orm";
import { fetchCitizenData, resolveQuestBonuses } from "../traitResolver";
import { ripple } from "../services/rippleEngine";
import { getConsequences, getEventDailyQuests } from "../services/universeConsequences";
import { applyPrestigeBonuses } from "../services/prestigeMultiplier";
import { applyDailyOracleBonusToReward } from "./oracleDeck";
import { pickAxisWeightedTemplates } from "@shared/dailyQuestAxisRouter";
import type { PlayerAxis, AxisMagnitude } from "@shared/npcs/types";
// Daily quests don't use CrewMissionTemplate but they DO emit work
// the player completes — the procedural mission factory's tag
// taxonomy unifies the vocabulary so personal-quest sub-tasks can
// gate on faction-tagged dailies the same way they gate on tagged
// crew missions. The tagsForTemplate helper is the canonical surface.
import { tagsForTemplate } from "../../shared/proceduralMissionFactory";

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
  // Minigame dailies — audit 3B gap. Quest ids referenced from
  // ChessPage / HackingPuzzle / SignalDecryptionPage on completion.
  { id: "d_chess_win", title: "Grandmaster's Gambit", description: "Win a chess match", questType: "fight", target: 1, rewardDream: 5, rewardXp: 60, rewardCredits: 0 },
  { id: "d_hack_success", title: "System Infiltrator", description: "Successfully hack a system", questType: "explore", target: 1, rewardDream: 4, rewardXp: 50, rewardCredits: 0 },
  { id: "d_decrypt_signal", title: "Signal Analyst", description: "Decrypt a captured signal", questType: "explore", target: 1, rewardDream: 4, rewardXp: 50, rewardCredits: 0 },

  // audit/16 PR 3 — casino-floor dailies. questType is "social" so
  // the DB enum doesn't have to change; the quest IDs are uniquely
  // prefixed (d_casino_*) and routed via casinoQuestProgressService.
  // Engagement-loop sibling of the harm-reduction work shipped in
  // PR 2 (#521); rewards are intentionally modest — playing IS the
  // payoff; the Dream is just enough to feel earned.
  { id: "d_casino_play_5",     title: "Take a Seat",   description: "Play 5 hands at any casino game",   questType: "social", target: 5, rewardDream: 8,  rewardXp: 60, rewardCredits: 0 },
  { id: "d_casino_win_3",      title: "Lucky Touch",   description: "Win 3 casino games today",          questType: "social", target: 3, rewardDream: 12, rewardXp: 80, rewardCredits: 0 },
  { id: "d_casino_pazaak_win", title: "Pazaak Adept",  description: "Win a hand of Pazaak",              questType: "social", target: 1, rewardDream: 5,  rewardXp: 50, rewardCredits: 0 },
  { id: "d_casino_streak_3",   title: "Hot Streak",    description: "Hit a 3-win casino streak",         questType: "social", target: 1, rewardDream: 10, rewardXp: 70, rewardCredits: 0 },
  { id: "d_casino_high_bet",   title: "Tablestakes",   description: "Place 5 casino bets of ≥100 Dream", questType: "social", target: 5, rewardDream: 10, rewardXp: 60, rewardCredits: 0 },
  { id: "d_casino_jackpot",    title: "Long Shot",     description: "Witness a progressive jackpot",     questType: "social", target: 1, rewardDream: 25, rewardXp: 200, rewardCredits: 0 },
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

  // audit/16 PR 3 — casino weeklies. Three-quest pool drawn into the
  // 5-quest weekly hand alongside the existing 10 weeklies.
  { id: "w_casino_50_plays",   title: "Regular at the Tables", description: "Play 50 casino hands this week",      questType: "social", target: 50, rewardDream: 40, rewardXp: 400, rewardCredits: 0 },
  { id: "w_casino_pazaak_5",   title: "Pazaak Specialist",     description: "Win 5 hands of Pazaak this week",     questType: "social", target: 5,  rewardDream: 30, rewardXp: 350, rewardCredits: 0 },
  { id: "w_casino_streak_5",   title: "On Fire",               description: "Hit a 5-win casino streak this week", questType: "social", target: 1,  rewardDream: 50, rewardXp: 500, rewardCredits: 0, bonusReward: "Casino Cosmetic Token" },
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

  // audit/16 PR 3 — casino epoch (season) quests.
  { id: "e_casino_centurion",     title: "Centurion of the Tables", description: "Win 100 casino games this season",        questType: "social", target: 100, rewardDream: 200, rewardXp: 3000, rewardCredits: 0, bonusReward: "Seasonal Casino Title" },
  { id: "e_casino_tale_collector", title: "Bibliographer of Bets",  description: "Collect 10 Tales of the Tables this season", questType: "social", target: 10,  rewardDream: 150, rewardXp: 2500, rewardCredits: 0, bonusReward: "Loredex: Casino Codex" },
];

/** Map a quest's questType to a faction key for tag emission. */
function factionForQuestType(questType: QuestTemplate["questType"]): string {
  switch (questType) {
    case "fight":
    case "card_battle": return "arena";
    case "trade": return "trader_outpost";
    case "craft": return "forge_collective";
    case "explore": return "outer_perimeter";
    case "social": return "neutral";
  }
}

/** Surface a daily-quest's procedural tags. Allows personal-quest
 *  sub-tasks to gate on a daily completion the same way they gate on
 *  a tagged crew mission completion. */
export function tagsForDailyQuest(template: QuestTemplate): string[] {
  const factionKey = factionForQuestType(template.questType);
  // Daily quests don't have a difficulty band; use "routine" for
  // dailies, "challenging" for weeklies-and-up. The id prefix tells
  // us which list the template came from.
  const difficulty = template.id.startsWith("e_")
    ? "dangerous"
    : template.id.startsWith("w_")
      ? "challenging"
      : "routine";
  return tagsForTemplate({ factionKey, difficulty });
}

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

/**
 * Axis-weighted quest selection (NPC depth #5 wire-in). Same
 * deterministic-seed contract as selectQuests so the player draws the
 * same quests every time the function runs for the same period — but
 * the templates are weighted by the player's 7-axis profile so a
 * strongly-aggressive player draws fight-shaped quests over
 * social-shaped ones at higher probability.
 *
 * Seed derives from `${dateStr}::${userId}` so two players on the same
 * date with different axis profiles see different quest pools, AND
 * each player sees the same pool every time they re-fetch.
 *
 * Callers without axes (or before the derive-axes-from-citizen-traits
 * helper lands) keep using selectQuests.
 */
function selectQuestsAxisWeighted(
  templates: QuestTemplate[],
  dateStr: string,
  userId: number,
  axes: Partial<Record<PlayerAxis, AxisMagnitude>>,
  count: number,
): QuestTemplate[] {
  const seedStr = `${dateStr}::${userId}`;
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = ((seed << 5) - seed + seedStr.charCodeAt(i)) | 0;
  }
  // Mulberry32 derived from the seed — cheap deterministic PRNG.
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  // pickAxisWeightedTemplates expects AxisTaggedQuestTemplate; QuestTemplate's
  // `questType` overlaps cleanly so the type-cast is safe — tagByQuestType
  // applies defaults for any template without explicit `axes` (none today).
  return pickAxisWeightedTemplates(
    templates as ReadonlyArray<QuestTemplate & { axes?: ReadonlyArray<PlayerAxis> }>,
    {
      count,
      axes,
      random,
    },
  );
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
   Server-authoritative 30-day cycle. A reward is defined
   for every day; the streak modulo LOGIN_CYCLE_LENGTH picks
   today's reward. Lookups never fall back to a neighbouring
   day, so each claim grants exactly one reward.
   ═══════════════════════════════════════════════════════ */
const LOGIN_CYCLE_LENGTH = 30;

type LoginRewardType = "credits" | "dream";
interface LoginReward {
  day: number;
  type: LoginRewardType;
  amount: number;
  label: string;
}

const LOGIN_REWARDS: LoginReward[] = [
  { day: 1,  type: "credits", amount: 500,   label: "500 Credits" },
  { day: 2,  type: "dream",   amount: 3,     label: "3 Dream Tokens" },
  { day: 3,  type: "credits", amount: 1000,  label: "1,000 Credits" },
  { day: 4,  type: "dream",   amount: 5,     label: "5 Dream Tokens" },
  { day: 5,  type: "credits", amount: 2000,  label: "2,000 Credits" },
  { day: 6,  type: "dream",   amount: 8,     label: "8 Dream Tokens" },
  { day: 7,  type: "dream",   amount: 15,    label: "Week 1 Bonus — 15 Dream Tokens" },
  { day: 8,  type: "credits", amount: 800,   label: "800 Credits" },
  { day: 9,  type: "dream",   amount: 10,    label: "10 Dream Tokens" },
  { day: 10, type: "credits", amount: 1500,  label: "1,500 Credits" },
  { day: 11, type: "dream",   amount: 12,    label: "12 Dream Tokens" },
  { day: 12, type: "credits", amount: 2500,  label: "2,500 Credits" },
  { day: 13, type: "dream",   amount: 18,    label: "18 Dream Tokens" },
  { day: 14, type: "dream",   amount: 30,    label: "Week 2 Bonus — 30 Dream Tokens" },
  { day: 15, type: "credits", amount: 1200,  label: "1,200 Credits" },
  { day: 16, type: "dream",   amount: 15,    label: "15 Dream Tokens" },
  { day: 17, type: "credits", amount: 2000,  label: "2,000 Credits" },
  { day: 18, type: "dream",   amount: 18,    label: "18 Dream Tokens" },
  { day: 19, type: "credits", amount: 3000,  label: "3,000 Credits" },
  { day: 20, type: "dream",   amount: 22,    label: "22 Dream Tokens" },
  { day: 21, type: "dream",   amount: 50,    label: "Week 3 Bonus — 50 Dream Tokens" },
  { day: 22, type: "credits", amount: 1500,  label: "1,500 Credits" },
  { day: 23, type: "dream",   amount: 20,    label: "20 Dream Tokens" },
  { day: 24, type: "credits", amount: 2500,  label: "2,500 Credits" },
  { day: 25, type: "dream",   amount: 25,    label: "25 Dream Tokens" },
  { day: 26, type: "credits", amount: 3500,  label: "3,500 Credits" },
  { day: 27, type: "dream",   amount: 30,    label: "30 Dream Tokens" },
  { day: 28, type: "dream",   amount: 100,   label: "Week 4 Bonus — 100 Dream Tokens" },
  { day: 29, type: "credits", amount: 5000,  label: "5,000 Credits" },
  { day: 30, type: "dream",   amount: 150,   label: "Monthly Jackpot — 150 Dream Tokens" },
];

/** Map a streak to its reward slot (1..LOGIN_CYCLE_LENGTH). */
function streakToCycleDay(streak: number): number {
  if (streak <= 0) return 1;
  return ((streak - 1) % LOGIN_CYCLE_LENGTH) + 1;
}

function rewardForStreak(streak: number): LoginReward {
  const cycleDay = streakToCycleDay(streak);
  return LOGIN_REWARDS.find(r => r.day === cycleDay) ?? LOGIN_REWARDS[0];
}

/** Helper: generate quests for a period if they don't exist yet.
 *  Returns `{ rows, freshlyMinted }`; `freshlyMinted` is true the first
 *  time the player's quest pool is generated for this period (the
 *  natural "your daily reset just happened" boundary). */
async function ensureQuestsExist(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number,
  templates: QuestTemplate[],
  periodStr: string,
  count: number,
): Promise<{ rows: typeof dailyQuests.$inferSelect[]; freshlyMinted: boolean }> {
  const existing = await db.select().from(dailyQuests)
    .where(and(eq(dailyQuests.userId, userId), eq(dailyQuests.questDate, periodStr)));

  if (existing.length > 0) return { rows: existing, freshlyMinted: false };

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
    const rows = await db.select().from(dailyQuests)
      .where(and(eq(dailyQuests.userId, userId), eq(dailyQuests.questDate, periodStr)));
    return { rows, freshlyMinted: true };
  }
  return { rows: [], freshlyMinted: false };
}

export const dailyQuestsRouter = router({
  /* ─── Get all quests (daily + weekly + epoch) ─── */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { daily: [], weekly: [], epoch: [], today: getTodayStr(), week: getWeekStr(), epoch_period: getEpochStr() };

    const today = getTodayStr();
    const week = getWeekStr();
    const epoch = getEpochStr();

    const [dailyRes, weeklyRes, epochRes] = await Promise.all([
      ensureQuestsExist(db, ctx.user.id, DAILY_TEMPLATES, today, 5),
      ensureQuestsExist(db, ctx.user.id, WEEKLY_TEMPLATES, week, 5),
      ensureQuestsExist(db, ctx.user.id, EPOCH_TEMPLATES, epoch, 5),
    ]);
    const daily = dailyRes.rows;
    const weekly = weeklyRes.rows;
    const epochQuests = epochRes.rows;

    // Daily-reset notification: fires once per player when the daily
    // quest pool first rolls to a new day. Idempotent because
    // freshlyMinted is only true on the insert path; subsequent
    // getAll calls inside the same UTC day return existing rows.
    if (dailyRes.freshlyMinted) {
      db.insert(notifications).values({
        userId: ctx.user.id,
        type: "daily_reset",
        title: "Daily Reset",
        message: `New daily quests are available for ${today}.`,
        actionUrl: "/quests",
        metadata: { questDate: today },
      }).catch(e => logger.error("[DailyQuests] daily_reset notification failed:", e));
    }

    // Append Living Universe event quests to the daily pool
    const fx = await getConsequences();
    const eventQuests = getEventDailyQuests(fx.activeEventIds);
    const eventQuestRows = eventQuests.map(eq => ({
      id: 0,
      userId: ctx.user.id,
      questId: eq.questId,
      title: eq.title,
      description: `[EVENT] ${eq.title}`,
      questType: eq.type,
      targetCount: eq.targetCount,
      currentCount: 0,
      rewardDream: eq.rewardDream,
      rewardXp: eq.rewardXp,
      rewardCredits: 0,
      bonusReward: null,
      claimed: false,
      questDate: today,
      createdAt: new Date(),
      completed: false,
      isEvent: true,
    }));

    return {
      daily: [
        ...daily.map(q => ({ ...q, completed: q.currentCount >= q.targetCount })),
        ...eventQuestRows,
      ],
      weekly: weekly.map(q => ({ ...q, completed: q.currentCount >= q.targetCount })),
      epoch: epochQuests.map(q => ({ ...q, completed: q.currentCount >= q.targetCount })),
      today,
      week,
      epoch_period: epoch,
    };
  }),

  /* ─── Update quest progress ─── */
  updateProgress: protectedProcedure
    // Balance F1 — this procedure is client-trusted (no server-side
    // event proof that the underlying gameplay happened). Until
    // progress is driven by trusted in-engine emitters, two hard
    // bounds keep it from being an unbounded reward faucet: a small
    // per-call `increment` cap (a real gameplay event advances a
    // quest by a handful at most) and a per-minute rate limit. The
    // claimReward path still gates on currentCount >= targetCount,
    // so this bounds the mint rate to roughly target/cap calls
    // spread across the rate window rather than a single RPC.
    .use(procedureRateLimit({ windowMs: 60_000, max: 30 }))
    .input(z.object({
      questId: z.string(),
      increment: z.number().int().min(1).max(100).default(1),
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

        // Tier-specific notification on top of the generic
        // quest_complete. Tier prefix is the canonical tier marker
        // baked into questId (`d_*` daily, `w_*` weekly, `e_*`
        // epoch — see DAILY_TEMPLATES / WEEKLY_TEMPLATES /
        // EPOCH_TEMPLATES). Daily completions stay under
        // `quest_complete` to avoid notification spam.
        if (record.questId.startsWith("w_")) {
          db.insert(notifications).values({
            userId: ctx.user.id,
            type: "weekly_quest",
            title: `Weekly Quest Complete: ${record.title}`,
            message: `You finished the weekly "${record.title}". Claim your reward.`,
            actionUrl: "/quests",
            metadata: { questId: record.questId, bonusReward: record.bonusReward ?? null },
          }).catch(e => logger.error("[DailyQuests] weekly_quest notification failed:", e));
        } else if (record.questId.startsWith("e_")) {
          db.insert(notifications).values({
            userId: ctx.user.id,
            type: "epoch_quest",
            title: `Epoch Quest Complete: ${record.title}`,
            message: `You finished the epoch "${record.title}". Claim your reward.`,
            actionUrl: "/quests",
            metadata: { questId: record.questId, bonusReward: record.bonusReward ?? null },
          }).catch(e => logger.error("[DailyQuests] epoch_quest notification failed:", e));
        }

        // Battle pass XP: daily quest completion
        battlePassXp.award(ctx.user.id, "daily_quest").catch(() => {});
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

      // Fetch citizen trait bonuses for quest rewards
      const questCitizen = await fetchCitizenData(ctx.user.id);
      const questTb = resolveQuestBonuses(questCitizen);

      // Apply trait multipliers to quest rewards
      const traitDream = Math.round(record[0].rewardDream * questTb.rewardMultiplier);
      const traitXp = Math.round(record[0].rewardXp * questTb.rewardMultiplier + questTb.completionXpBonus);
      const traitCredits = Math.round(record[0].rewardCredits * questTb.rewardMultiplier);

      // Apply prestige multipliers on top of trait multipliers. Non-prestiged
      // players get the same numbers back and `tier: 0`.
      const prestige = await applyPrestigeBonuses(ctx.user.id, {
        xp: traitXp,
        resource: traitDream,
      });
      const prestigedDream = prestige.resource;
      const adjustedXp = prestige.xp;
      // Credits use the resource multiplier too, since "resource" is the
      // generic non-XP scalar in the shared prestige spec.
      const adjustedCredits = Math.round(traitCredits * prestige.multipliers.resource);

      // Apply the player's active daily Oracle reading bonus. Only
      // cards with a dream_token_bonus effect modify quest rewards
      // (e.g. The Hierophant, which carries "Forbidden Tuition +10%").
      // A no-op if no reading was cast today or the active card is
      // one of the match-scoped effects like extra_mana.
      const oracleAdjusted = await applyDailyOracleBonusToReward(
        db,
        ctx.user.id,
        prestigedDream,
      );
      const adjustedDream = oracleAdjusted.adjustedAmount;

      // Grant Dream reward (with trait bonus)
      if (adjustedDream > 0) {
        // Wrap balance read + write in a transaction so a partial
        // failure between the read and the write rolls back. Plan §C3.
        await db.transaction(async (tx) => {
          const existing = await tx.select().from(dreamBalance)
            .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
          if (existing[0]) {
            await tx.update(dreamBalance)
              .set({ dreamTokens: sql`${dreamBalance.dreamTokens} + ${adjustedDream}` })
              .where(eq(dreamBalance.userId, ctx.user.id));
          } else {
            await tx.insert(dreamBalance).values({
              userId: ctx.user.id, dreamTokens: adjustedDream, soulBoundDream: 0,
            });
          }
        });
      }

      // Build trait source labels for frontend toast
      const traitSources: string[] = [];
      if (questCitizen?.species) traitSources.push(`${questCitizen.species} Species`);
      if (questCitizen?.characterClass) traitSources.push(`${questCitizen.characterClass} Class`);
      if (questCitizen?.element) traitSources.push(`${questCitizen.element} Element`);
      if (oracleAdjusted.oracleLabel) traitSources.push(oracleAdjusted.oracleLabel);

      // Award class mastery XP for quest completion
      const { awardClassXp } = await import("../classMasteryHelper");
      const classXpResult = await awardClassXp(ctx.user.id, "complete_quest");

      // Award civil skill XP (endurance + lore)
      const { awardCivilXp } = await import("../civilSkillHelper");
      awardCivilXp(ctx.user.id, "complete_quest").catch(e => logger.error("[DailyQuests] Civil XP award failed:", e));

      // Suit-material drop: every claimed quest grants 1 brass-plate
      // so the suit-craft pouch stays topped up over time. Crafting
      // quests grant an extra brass-plate (the "Forge Worker"
      // questType: "craft" entries become a small pipeline). Routed
      // through the shared service so the suit-craft mutation reads
      // a consistent pouch shape.
      const suitGrant = record[0].questId === "d_craft_item" ||
        record[0].questId === "d_gather_materials"
        ? 2
        : 1;
      grantSuitMaterials(ctx.user.id, [
        { materialId: "brass-plate", count: suitGrant },
      ]).catch((e) =>
        logger.error("[DailyQuests] Suit-material grant failed:", e),
      );

      await ripple.emit("daily_quest_complete", { userId: ctx.user.id });

      return {
        success: true,
        rewardDream: adjustedDream,
        rewardXp: adjustedXp,
        rewardCredits: adjustedCredits,
        bonusReward: record[0].bonusReward,
        traitMultiplier: questTb.rewardMultiplier,
        traitSources,
        traitBonuses: {
          rewardMultiplier: questTb.rewardMultiplier,
          battlePassXpMultiplier: questTb.battlePassXpMultiplier,
          completionXpBonus: questTb.completionXpBonus,
        },
        prestigeBonus: prestige.tier > 0 ? {
          tier: prestige.tier,
          xpMultiplier: prestige.multipliers.xp,
          resourceMultiplier: prestige.multipliers.resource,
        } : null,
        classXpResult,
      };
    }),

  /* ─── Login Calendar ─── */
  getLoginCalendar: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const today = getTodayStr();

    const emptyState = {
      streak: 0,
      totalDays: 0,
      claimedToday: false,
      rewards: LOGIN_REWARDS,
      lastLoginDate: null as string | null,
      monthClaims: [] as number[],
      cycleLength: LOGIN_CYCLE_LENGTH,
      // What the NEXT claim will award (streak 1 for a brand-new user).
      nextClaimDay: 1,
      nextReward: rewardForStreak(1),
    };

    if (!db) return emptyState;

    const record = await db.select().from(loginCalendar)
      .where(eq(loginCalendar.userId, ctx.user.id))
      .limit(1);

    const row = record[0];

    if (!row) return emptyState;

    // Compute what the NEXT claim's streak would be. If the player already
    // claimed today, the "next" preview is tomorrow (streak + 1). Otherwise
    // it's today (streak + 1 if they claimed yesterday, else 1 after reset).
    const claimedToday = row.lastLoginDate === today;
    let nextClaimStreak: number;
    if (claimedToday) {
      nextClaimStreak = row.currentStreak + 1;
    } else if (row.lastLoginDate) {
      const lastDate = new Date(row.lastLoginDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / 86400000);
      nextClaimStreak = diffDays === 1 ? row.currentStreak + 1 : 1;
    } else {
      nextClaimStreak = 1;
    }

    return {
      streak: row.currentStreak,
      totalDays: row.totalDays,
      claimedToday,
      rewards: LOGIN_REWARDS,
      lastLoginDate: row.lastLoginDate,
      monthClaims: row.monthClaims ?? [],
      cycleLength: LOGIN_CYCLE_LENGTH,
      nextClaimDay: streakToCycleDay(nextClaimStreak),
      nextReward: rewardForStreak(nextClaimStreak),
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

    // Find reward tier — cycles through the 30-day table by streak.
    const reward = rewardForStreak(newStreak);

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

    // Grant reward. The server — not the client — decides the amount and type.
    if (reward.type === "dream") {
      const bal = await db.select().from(dreamBalance)
        .where(eq(dreamBalance.userId, ctx.user.id)).limit(1);
      if (bal[0]) {
        await db.update(dreamBalance)
          .set({
            dreamTokens: sql`${dreamBalance.dreamTokens} + ${reward.amount}`,
            totalDreamEarned: sql`${dreamBalance.totalDreamEarned} + ${reward.amount}`,
          })
          .where(eq(dreamBalance.userId, ctx.user.id));
      } else {
        await db.insert(dreamBalance).values({
          userId: ctx.user.id,
          dreamTokens: reward.amount,
          soulBoundDream: 0,
          totalDreamEarned: reward.amount,
        });
      }
    } else if (reward.type === "credits") {
      await db.update(characterSheets)
        .set({ credits: sql`${characterSheets.credits} + ${reward.amount}` })
        .where(eq(characterSheets.userId, ctx.user.id));
    }

    // Send notification
    await db.insert(notifications).values({
      userId: ctx.user.id,
      type: "daily_login",
      title: `Day ${newStreak} Login Reward!`,
      message: `You received ${reward.label}. Keep your streak going!`,
    });

    // Emit streak milestone ripple for key thresholds
    if ([3, 7, 14, 30].includes(newStreak)) {
      await ripple.emit("daily_streak_milestone", { userId: ctx.user.id, streak: newStreak });
    }

    // Grant card reward on 7-day login streak
    if (newStreak === 7) {
      try {
        await grantCardReward(ctx.user.id, "daily_quests_streak");
      } catch (e) {
        logger.warn("Failed to grant daily quests streak card reward", e);
      }
    }

    return {
      success: true,
      streak: newStreak,
      cycleDay: streakToCycleDay(newStreak),
      rewardType: reward.type,
      rewardAmount: reward.amount,
      rewardLabel: reward.label,
    };
  }),
});
