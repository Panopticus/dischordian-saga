/* ═══════════════════════════════════════════════════════
   BONUS OBJECTIVES — "Just One More" Mechanic
   After daily quests are complete, generate 1-3 bonus
   objectives with smaller rewards. Refreshes every 2 hours.
   ═══════════════════════════════════════════════════════ */

export type BonusRewardType = "dream" | "xp" | "influence" | "salvage";

export interface BonusObjective {
  id: string;
  description: string;
  rewardType: BonusRewardType;
  rewardAmount: number;
  category:
    | "combat"
    | "lore"
    | "chess"
    | "social"
    | "exploration"
    | "narrator_callback";
  completed: boolean;
  /** If set, this objective's reward is unlocking a §13 dialog line. */
  narratorCallback?: {
    narratorId: "elara" | "the_human";
    roomId: string;
    tier: number;
  };
}

/* ─── OBJECTIVE TEMPLATES ─── */

interface ObjectiveTemplate {
  description: string;
  rewardType: BonusRewardType;
  baseReward: number;
  category: BonusObjective["category"];
}

const OBJECTIVE_TEMPLATES: ObjectiveTemplate[] = [
  // Combat
  { description: "Win one more fight for {reward} bonus Dream", rewardType: "dream", baseReward: 25, category: "combat" },
  { description: "Win a PvP match for {reward} bonus Dream", rewardType: "dream", baseReward: 30, category: "combat" },
  { description: "Defeat an opponent without losing HP for {reward} bonus XP", rewardType: "xp", baseReward: 40, category: "combat" },
  { description: "Use a special ability in combat for {reward} bonus XP", rewardType: "xp", baseReward: 20, category: "combat" },

  // Lore
  { description: "Discover a new lore entry for {reward} bonus XP", rewardType: "xp", baseReward: 50, category: "lore" },
  { description: "Read a transmission log for {reward} bonus XP", rewardType: "xp", baseReward: 25, category: "lore" },
  { description: "Visit a new room on the ship for {reward} bonus Dream", rewardType: "dream", baseReward: 20, category: "lore" },

  // Chess
  { description: "Play a chess game for {reward} bonus Influence", rewardType: "influence", baseReward: 15, category: "chess" },
  { description: "Solve today's chess puzzle for {reward} bonus XP", rewardType: "xp", baseReward: 35, category: "chess" },
  { description: "Win a chess match for {reward} bonus Influence", rewardType: "influence", baseReward: 25, category: "chess" },

  // Social
  { description: "Send a gift to an NPC for {reward} bonus Dream", rewardType: "dream", baseReward: 20, category: "social" },
  { description: "Complete a friendly challenge for {reward} bonus XP", rewardType: "xp", baseReward: 30, category: "social" },
  { description: "Trade with another player for {reward} bonus Salvage", rewardType: "salvage", baseReward: 20, category: "social" },

  // Exploration
  { description: "Visit the Void Bazaar for {reward} bonus Dream", rewardType: "dream", baseReward: 15, category: "exploration" },
  { description: "Collect a resource node for {reward} bonus Salvage", rewardType: "salvage", baseReward: 25, category: "exploration" },
  { description: "Complete a tower defense wave for {reward} bonus XP", rewardType: "xp", baseReward: 30, category: "exploration" },
];

/* ─── §13 NARRATOR CALLBACK OBJECTIVES (Appendix A.3) ───
   Separate pool: the 2h refresh cycle becomes the delivery
   channel for companion callback objectives. Each template
   references a room + narrator; when completed, the reward
   is unlocking a higher-tier dialog line from the §13 matrix
   rather than a resource drop. Consumers read
   `narratorCallback` on the returned BonusObjective and call
   into the dialog registry to surface the unlocked line. */

export interface NarratorCallbackTemplate {
  id: string;
  narratorId: "elara" | "the_human";
  roomId: string;
  tier: number;
  description: string;
}

export const NARRATOR_CALLBACK_TEMPLATES: readonly NarratorCallbackTemplate[] = [
  {
    id: "elara_memorial_corridor",
    narratorId: "elara",
    roomId: "trophy_room",
    tier: 2,
    description:
      "Elara asked you yesterday about the Memorial Corridor. Visit it in the next 2 hours to hear her thoughts.",
  },
  {
    id: "human_comms_array",
    narratorId: "the_human",
    roomId: "comms_array",
    tier: 2,
    description:
      "The Human has been listening to something in the Comms Array. Return in the next 2 hours and he'll tell you what.",
  },
  {
    id: "elara_archives",
    narratorId: "elara",
    roomId: "archives",
    tier: 3,
    description:
      "Elara wants to show you something in the Archives. Go in the next 2 hours.",
  },
  {
    id: "human_observation_deck",
    narratorId: "the_human",
    roomId: "observation_deck",
    tier: 3,
    description:
      "The Human has been stargazing. Join him in the next 2 hours to hear what he saw.",
  },
  {
    id: "elara_bridge",
    narratorId: "elara",
    roomId: "bridge",
    tier: 4,
    description:
      "Elara has been plotting something on the conspiracy board. Visit the Bridge in the next 2 hours.",
  },
  {
    id: "human_engineering",
    narratorId: "the_human",
    roomId: "engineering",
    tier: 4,
    description:
      "The Human is in Engineering, holding a part he will not explain. Go to him in the next 2 hours.",
  },
  {
    id: "elara_cryo_bay",
    narratorId: "elara",
    roomId: "cryo_bay",
    tier: 2,
    description:
      "Elara is running a diagnostic on Pod 7 she won't explain. Visit the Cryo Bay in the next 2 hours.",
  },
  {
    id: "human_medical_bay",
    narratorId: "the_human",
    roomId: "medical_bay",
    tier: 3,
    description:
      "The Human is sitting in Medical Bay with a file nobody authorized him to pull. Find him in the next 2 hours.",
  },
  {
    id: "elara_trade_hub",
    narratorId: "elara",
    roomId: "trade_hub",
    tier: 3,
    description:
      "Elara noticed a pricing anomaly on a single commodity in the Trade Hub. Ask her about it in the next 2 hours.",
  },
  {
    id: "human_captains_quarters",
    narratorId: "the_human",
    roomId: "captains_quarters",
    tier: 5,
    description:
      "The Human is in the Captain's Quarters. He has not been here before. Something is wrong. Go.",
  },
];

/**
 * Given a deterministic seed and the template pool, return a
 * single narrator_callback bonus objective. This is called by
 * the bonus-refresh path IFF the player is out of daily quests
 * AND has at least one active narrator (Elara or The Human).
 *
 * @param playerId - Player's ID (seed input)
 * @param refreshSlot - Current 2h slot since daily reset
 */
export function generateNarratorCallbackObjective(
  playerId: number,
  refreshSlot: number,
): BonusObjective | null {
  if (NARRATOR_CALLBACK_TEMPLATES.length === 0) return null;
  const seed = playerId * 10000 + refreshSlot * 31 + 7;
  const rng = seededRandom(seed);
  const pick =
    NARRATOR_CALLBACK_TEMPLATES[
      Math.floor(rng() * NARRATOR_CALLBACK_TEMPLATES.length)
    ];
  return {
    id: `bonus_narrator_${playerId}_${refreshSlot}_${pick.id}`,
    description: pick.description,
    rewardType: "xp",
    rewardAmount: 0, // Reward is the dialog line, not resources.
    category: "narrator_callback",
    completed: false,
    narratorCallback: {
      narratorId: pick.narratorId,
      roomId: pick.roomId,
      tier: pick.tier,
    },
  };
}

/* ─── CONSTANTS ─── */

/** Bonus objectives refresh every 2 hours (in ms) */
export const REFRESH_INTERVAL_MS = 2 * 60 * 60 * 1000;

/** Rewards are 25-50% of daily quest rewards */
const REWARD_SCALE_MIN = 0.25;
const REWARD_SCALE_MAX = 0.50;

/* ─── FUNCTIONS ─── */

/**
 * Simple deterministic seed-based random number generator.
 */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s >>> 0) / 4294967296;
  };
}

/**
 * Generate bonus objectives for a player after daily quests are done.
 * Returns 1-3 objectives with scaled-down rewards.
 *
 * @param playerId - Player's ID (used for deterministic selection)
 * @param refreshSlot - Which 2-hour slot since daily reset (0, 1, 2, ...)
 * @param dailyQuestRewardAvg - Average reward of the player's daily quests (for scaling)
 */
export function generateBonusObjectives(
  playerId: number,
  refreshSlot: number,
  dailyQuestRewardAvg: number = 100,
): BonusObjective[] {
  const seed = playerId * 10000 + refreshSlot * 31;
  const rng = seededRandom(seed);

  // 1-3 objectives
  const count = 1 + Math.floor(rng() * 3);

  // Shuffle templates deterministically
  const shuffled = [...OBJECTIVE_TEMPLATES]
    .map(t => ({ t, sort: rng() }))
    .sort((a, b) => a.sort - b.sort)
    .map(x => x.t);

  const objectives: BonusObjective[] = [];

  for (let i = 0; i < count && i < shuffled.length; i++) {
    const template = shuffled[i];
    const scale = REWARD_SCALE_MIN + rng() * (REWARD_SCALE_MAX - REWARD_SCALE_MIN);
    const reward = Math.max(
      5,
      Math.round(dailyQuestRewardAvg * scale),
    );

    // Use template base reward as a floor
    const finalReward = Math.max(template.baseReward, reward);

    objectives.push({
      id: `bonus_${playerId}_${refreshSlot}_${i}`,
      description: template.description.replace("{reward}", String(finalReward)),
      rewardType: template.rewardType,
      rewardAmount: finalReward,
      category: template.category,
      completed: false,
    });
  }

  return objectives;
}

/**
 * Calculate which refresh slot we're in based on time since daily reset.
 * Daily reset is assumed to be midnight UTC.
 */
export function getCurrentRefreshSlot(now: Date): number {
  const hoursSinceReset = now.getUTCHours();
  return Math.floor(hoursSinceReset / 2);
}

/**
 * Get the time remaining until the next bonus objective refresh.
 */
export function getTimeUntilRefresh(now: Date): number {
  const currentSlot = getCurrentRefreshSlot(now);
  const nextSlotHour = (currentSlot + 1) * 2;
  const nextRefresh = new Date(now);
  nextRefresh.setUTCHours(nextSlotHour, 0, 0, 0);
  return Math.max(0, nextRefresh.getTime() - now.getTime());
}
