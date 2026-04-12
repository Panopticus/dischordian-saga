/**
 * Game-mode card rewards — comprehensive cross-mode mapping (WS-D).
 *
 * Every game mode in the Dischordian Saga that can award cards is listed
 * here with its trigger condition, reward type, and placeholder card
 * IDs. This is the authoritative "what can I earn and where?" registry.
 *
 * Pure data — no server wiring.
 */

import type { RewardType, MoralityBranch } from "./cardRewardRegistry";

/* ─── Types ─── */

export interface GameModeReward {
  id: string;
  gameMode: string;
  trigger: string;
  rewardType: RewardType;
  fixedCardDefId?: string;
  pool?: Array<{ cardDefId: string; weight: number }>;
  moralityBranches?: MoralityBranch[];
  description: string;
  rarity: string;
}

/* ─── Helpers ─── */

const MORAL_AXES = ["truth", "defiance", "empathy", "acceptance", "balanced"] as const;

function moralBranches(prefix: string, reason: string): MoralityBranch[] {
  return MORAL_AXES.map((axis) => ({
    dominantAxis: axis,
    cardDefId: `${prefix}_${axis}`,
    flavorReason: `${reason} — ${axis} path.`,
  }));
}

/* ═══════════════════════════════════════════════════════
   ALL GAME MODE REWARDS
   ═══════════════════════════════════════════════════════ */

export const ALL_GAME_MODE_REWARDS: readonly GameModeReward[] = Object.freeze([

  /* ── Campaign — 14 chapters, fixed card per chapter ── */
  ...Array.from({ length: 14 }, (_, i): GameModeReward => ({
    id: `campaign_ch${i + 1}`,
    gameMode: "campaign",
    trigger: `Complete campaign chapter ${i + 1}`,
    rewardType: "fixed",
    fixedCardDefId: `s1_reward_campaign_ch${i + 1}`,
    description: `Unique card earned by completing chapter ${i + 1} of the Season 1 campaign.`,
    rarity: i < 4 ? "common" : i < 10 ? "rare" : "epic",
  })),

  /* ── Tutorial — 4 gates, fixed per gate ── */
  ...Array.from({ length: 4 }, (_, i): GameModeReward => ({
    id: `tutorial_gate${i + 1}`,
    gameMode: "tutorial",
    trigger: `Complete tutorial gate ${i + 1}`,
    rewardType: "fixed",
    fixedCardDefId: `s1_reward_tutorial_gate${i + 1}`,
    description: `Starter card granted upon clearing tutorial gate ${i + 1}.`,
    rarity: "common",
  })),

  /* ── PvP Ranked — season end, pool by tier ── */
  {
    id: "pvp_ranked_bronze",
    gameMode: "pvp_ranked",
    trigger: "Finish ranked season in Bronze tier",
    rewardType: "random_pool",
    pool: [
      { cardDefId: "s1_reward_pvp_bronze_a", weight: 50 },
      { cardDefId: "s1_reward_pvp_bronze_b", weight: 50 },
    ],
    description: "Bronze-tier season reward — common card from a small pool.",
    rarity: "common",
  },
  {
    id: "pvp_ranked_silver",
    gameMode: "pvp_ranked",
    trigger: "Finish ranked season in Silver tier",
    rewardType: "random_pool",
    pool: [
      { cardDefId: "s1_reward_pvp_silver_a", weight: 50 },
      { cardDefId: "s1_reward_pvp_silver_b", weight: 50 },
    ],
    description: "Silver-tier season reward.",
    rarity: "uncommon",
  },
  {
    id: "pvp_ranked_gold",
    gameMode: "pvp_ranked",
    trigger: "Finish ranked season in Gold tier",
    rewardType: "random_pool",
    pool: [
      { cardDefId: "s1_reward_pvp_gold_a", weight: 40 },
      { cardDefId: "s1_reward_pvp_gold_b", weight: 35 },
      { cardDefId: "s1_reward_pvp_gold_c", weight: 25 },
    ],
    description: "Gold-tier season reward — rare pool.",
    rarity: "rare",
  },
  {
    id: "pvp_ranked_diamond",
    gameMode: "pvp_ranked",
    trigger: "Finish ranked season in Diamond tier",
    rewardType: "random_pool",
    pool: [
      { cardDefId: "s1_reward_pvp_diamond_a", weight: 40 },
      { cardDefId: "s1_reward_pvp_diamond_b", weight: 35 },
      { cardDefId: "s1_reward_pvp_diamond_c", weight: 25 },
    ],
    description: "Diamond-tier season reward — epic pool.",
    rarity: "epic",
  },
  {
    id: "pvp_ranked_master",
    gameMode: "pvp_ranked",
    trigger: "Finish ranked season in Master tier",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_pvp_master",
    description: "Master-tier exclusive season reward.",
    rarity: "epic",
  },
  {
    id: "pvp_ranked_legend",
    gameMode: "pvp_ranked",
    trigger: "Finish ranked season in Legend tier",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_pvp_legend",
    description: "Legend-tier exclusive season reward — the rarest ranked card.",
    rarity: "legendary",
  },

  /* ── Trade Empire — Act 3, fixed per path ── */
  {
    id: "trade_empire_merchant",
    gameMode: "trade_empire",
    trigger: "Complete Trade Empire Act 3 via Merchant path",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_trade_merchant",
    description: "Card earned by completing Trade Empire as a Merchant.",
    rarity: "rare",
  },
  {
    id: "trade_empire_smuggler",
    gameMode: "trade_empire",
    trigger: "Complete Trade Empire Act 3 via Smuggler path",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_trade_smuggler",
    description: "Card earned by completing Trade Empire as a Smuggler.",
    rarity: "rare",
  },
  {
    id: "trade_empire_magnate",
    gameMode: "trade_empire",
    trigger: "Complete Trade Empire Act 3 via Magnate path",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_trade_magnate",
    description: "Card earned by completing Trade Empire as a Magnate.",
    rarity: "epic",
  },

  /* ── Chess — tournament win ── */
  {
    id: "chess_tournament_win",
    gameMode: "chess",
    trigger: "Win a chess tournament",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_chess_tourney",
    description: "Card earned by winning a chess tournament.",
    rarity: "rare",
  },

  /* ── Pet Battles — 5-win streak ── */
  {
    id: "pet_battles_5_streak",
    gameMode: "pet_battles",
    trigger: "Achieve a 5-win streak in Pet Battles",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_pet_streak5",
    description: "Card earned from a 5-win streak in Pet Battles.",
    rarity: "rare",
  },

  /* ── Dead Man's Circuit — 1st place ── */
  {
    id: "dead_mans_circuit_first",
    gameMode: "dead_mans_circuit",
    trigger: "Finish 1st place in Dead Man's Circuit",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_dmc_first",
    description: "Card earned by placing 1st in Dead Man's Circuit.",
    rarity: "epic",
  },

  /* ── Guild Wars — territory capture ── */
  {
    id: "guild_wars_territory",
    gameMode: "guild_wars",
    trigger: "Capture a territory in Guild Wars",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_guild_territory",
    description: "Card earned by capturing a Guild Wars territory.",
    rarity: "rare",
  },

  /* ── Casino — jackpot ── */
  {
    id: "casino_jackpot",
    gameMode: "casino",
    trigger: "Hit the casino jackpot",
    rewardType: "random_pool",
    pool: [
      { cardDefId: "s1_reward_casino_silver", weight: 50 },
      { cardDefId: "s1_reward_casino_gold", weight: 35 },
      { cardDefId: "s1_reward_casino_jackpot", weight: 15 },
    ],
    description: "Random card from the casino jackpot pool.",
    rarity: "varies",
  },

  /* ── Tower Defense — wave 50+ ── */
  {
    id: "tower_defense_wave50",
    gameMode: "tower_defense",
    trigger: "Survive past wave 50 in Tower Defense",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_tower_wave50",
    description: "Card earned by surviving wave 50+ in Tower Defense.",
    rarity: "epic",
  },

  /* ── Eidolon Bond — max bond, 5 eidolons ── */
  ...["pyra", "shade", "echo", "drift", "lumen"].map(
    (eidolon): GameModeReward => ({
      id: `eidolon_bond_max_${eidolon}`,
      gameMode: "eidolon_bond",
      trigger: `Reach max bond level with Eidolon ${eidolon}`,
      rewardType: "fixed",
      fixedCardDefId: `s1_reward_eidolon_${eidolon}`,
      description: `Card earned by reaching max bond with ${eidolon}.`,
      rarity: "epic",
    }),
  ),

  /* ── Companion — max relationship ── */
  {
    id: "companion_max_relationship",
    gameMode: "companion",
    trigger: "Reach max relationship level with any companion",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_companion_max",
    description: "Card earned by maxing out a companion relationship.",
    rarity: "rare",
  },

  /* ── Outbreak — protocol completion, morality-branching ── */
  {
    id: "outbreak_protocol_complete",
    gameMode: "outbreak",
    trigger: "Complete an Outbreak protocol",
    rewardType: "morality_branching",
    moralityBranches: moralBranches(
      "s1_reward_outbreak",
      "Outbreak survival shaped by your moral compass",
    ),
    description: "Morality-branching card earned by completing an Outbreak protocol.",
    rarity: "epic",
  },

  /* ── Dischordia Cycle — energy peak, light/dark variants ── */
  {
    id: "dischordia_cycle_light",
    gameMode: "dischordia_cycle",
    trigger: "Reach energy peak during Light phase of Dischordia Cycle",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_dischordia_light",
    description: "Light variant card earned at Dischordia Cycle energy peak.",
    rarity: "rare",
  },
  {
    id: "dischordia_cycle_dark",
    gameMode: "dischordia_cycle",
    trigger: "Reach energy peak during Dark phase of Dischordia Cycle",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_dischordia_dark",
    description: "Dark variant card earned at Dischordia Cycle energy peak.",
    rarity: "rare",
  },

  /* ── Seasonal Events — milestone ── */
  {
    id: "seasonal_event_milestone",
    gameMode: "seasonal_events",
    trigger: "Reach the seasonal event milestone",
    rewardType: "random_pool",
    pool: [
      { cardDefId: "s1_reward_seasonal_common", weight: 40 },
      { cardDefId: "s1_reward_seasonal_rare", weight: 35 },
      { cardDefId: "s1_reward_seasonal_epic", weight: 20 },
      { cardDefId: "s1_reward_seasonal_legendary", weight: 5 },
    ],
    description: "Seasonal event milestone reward — rarity varies by luck.",
    rarity: "varies",
  },

  /* ── Daily Quests — 7-day streak ── */
  {
    id: "daily_quests_7day_streak",
    gameMode: "daily_quests",
    trigger: "Complete a 7-day daily quest streak",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_daily_streak7",
    description: "Card earned by completing 7 consecutive daily quests.",
    rarity: "uncommon",
  },

  /* ── Lore Journal — 10 entries ── */
  {
    id: "lore_journal_10_entries",
    gameMode: "lore_journal",
    trigger: "Collect 10 Lore Journal entries",
    rewardType: "fixed",
    fixedCardDefId: "s1_reward_lore_journal10",
    description: "Card earned by collecting 10 Lore Journal entries.",
    rarity: "rare",
  },

  /* ── Governance Hub — every 4 votes, morality-branching ── */
  ...Array.from({ length: 5 }, (_, i): GameModeReward => ({
    id: `governance_morality_t${i + 1}`,
    gameMode: "governance_hub",
    trigger: `Cast ${(i + 1) * 4} governance votes (tier ${i + 1} milestone)`,
    rewardType: "morality_branching",
    moralityBranches: MORAL_AXES.map((axis) => ({
      dominantAxis: axis,
      cardDefId: `s1_reward_morality_t${i + 1}_${axis}`,
      flavorReason: `Governance tier ${i + 1} reward for ${axis}-dominant players.`,
    })),
    description: `Morality-branching card reward at governance vote milestone ${(i + 1) * 4}.`,
    rarity: i < 3 ? "rare" : "epic",
  })),
]);

/* ─── Quick-lookup by id ─── */

export const GAME_MODE_REWARD_MAP: Record<string, GameModeReward> = Object.freeze(
  Object.fromEntries(ALL_GAME_MODE_REWARDS.map((r) => [r.id, r])),
) as Record<string, GameModeReward>;

/* ─── Lookup by game mode ─── */

export const REWARDS_BY_MODE: Record<string, readonly GameModeReward[]> = Object.freeze(
  ALL_GAME_MODE_REWARDS.reduce<Record<string, GameModeReward[]>>((acc, r) => {
    (acc[r.gameMode] ??= []).push(r);
    return acc;
  }, {}),
) as Record<string, readonly GameModeReward[]>;
