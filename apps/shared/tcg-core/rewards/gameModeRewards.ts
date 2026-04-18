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

  /* ── Tutorial — 6 gates, fixed per gate (audit backfill expanded 4→6) ── */
  ...Array.from({ length: 6 }, (_, i): GameModeReward => ({
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

  /* ─── Companion System ─── */
  { id: "companion_human", gameMode: "companion", trigger: "Max relationship with The Human", rewardType: "fixed", fixedCardDefId: "s1_reward_companion_human", description: "Earned by reaching max bond with The Human.", rarity: "rare" },
  { id: "companion_elara", gameMode: "companion", trigger: "Max bond with Elara ship AI", rewardType: "fixed", fixedCardDefId: "s1_reward_companion_elara", description: "Earned by reaching max bond with Elara.", rarity: "uncommon" },
  { id: "companion_zero", gameMode: "companion", trigger: "Max bond with Agent Zero", rewardType: "fixed", fixedCardDefId: "s1_reward_companion_zero", description: "Earned by reaching max bond with Agent Zero.", rarity: "rare" },
  { id: "companion_kael", gameMode: "companion", trigger: "Max bond with Kael (pre-infection)", rewardType: "fixed", fixedCardDefId: "s1_reward_companion_kael", description: "Earned by uncovering Kael's pre-infection memories.", rarity: "rare" },
  { id: "companion_locke", gameMode: "companion", trigger: "Max bond with Adjudicator Locke", rewardType: "fixed", fixedCardDefId: "s1_reward_companion_locke", description: "Earned by reaching max bond with Locke.", rarity: "uncommon" },

  /* ─── Crew System ─── */
  { id: "crew_bloodline", gameMode: "crew", trigger: "Complete a bloodline chain", rewardType: "fixed", fixedCardDefId: "s1_reward_crew_bloodline", description: "Earned by completing a crew bloodline.", rarity: "rare" },
  { id: "crew_clone", gameMode: "crew", trigger: "Successfully clone a crew member", rewardType: "fixed", fixedCardDefId: "s1_reward_crew_clone", description: "Earned by successful cloning.", rarity: "uncommon" },
  { id: "crew_incubator", gameMode: "crew", trigger: "Complete 10 incubation cycles", rewardType: "fixed", fixedCardDefId: "s1_reward_crew_incubator", description: "Earned by operating the incubator.", rarity: "uncommon" },
  { id: "crew_mission", gameMode: "crew", trigger: "Complete 25 crew missions", rewardType: "fixed", fixedCardDefId: "s1_reward_crew_mission", description: "Earned by completing crew missions.", rarity: "rare" },
  { id: "crew_sacrifice", gameMode: "crew", trigger: "Sacrifice during Outbreak", rewardType: "fixed", fixedCardDefId: "s1_reward_crew_sacrifice", description: "Earned from apprentice sacrifice.", rarity: "epic" },

  /* ─── Prestige System ─── */
  { id: "prestige_tier_1", gameMode: "prestige", trigger: "Reach Prestige Tier 1", rewardType: "fixed", fixedCardDefId: "s1_reward_prestige_t1", description: "First Ascension.", rarity: "uncommon" },
  { id: "prestige_tier_3", gameMode: "prestige", trigger: "Reach Prestige Tier 3", rewardType: "fixed", fixedCardDefId: "s1_reward_prestige_t3", description: "Threefold Reborn.", rarity: "rare" },
  { id: "prestige_tier_5", gameMode: "prestige", trigger: "Reach Prestige Tier 5", rewardType: "fixed", fixedCardDefId: "s1_reward_prestige_t5", description: "Quintessence Guardian.", rarity: "epic" },
  { id: "prestige_tier_7", gameMode: "prestige", trigger: "Reach Prestige Tier 7", rewardType: "fixed", fixedCardDefId: "s1_reward_prestige_t7", description: "Transcended One.", rarity: "legendary" },

  /* ─── Class Mastery ─── */
  { id: "class_mastery_spy", gameMode: "class_mastery", trigger: "Master spy class", rewardType: "fixed", fixedCardDefId: "s1_reward_class_spy", description: "Master Spy.", rarity: "rare" },
  { id: "class_mastery_oracle", gameMode: "class_mastery", trigger: "Master oracle class", rewardType: "fixed", fixedCardDefId: "s1_reward_class_oracle", description: "Master Oracle.", rarity: "rare" },
  { id: "class_mastery_assassin", gameMode: "class_mastery", trigger: "Master assassin class", rewardType: "fixed", fixedCardDefId: "s1_reward_class_assassin", description: "Master Assassin.", rarity: "rare" },
  { id: "class_mastery_engineer", gameMode: "class_mastery", trigger: "Master engineer class", rewardType: "fixed", fixedCardDefId: "s1_reward_class_engineer", description: "Master Engineer.", rarity: "rare" },
  { id: "class_mastery_soldier", gameMode: "class_mastery", trigger: "Master soldier class", rewardType: "fixed", fixedCardDefId: "s1_reward_class_soldier", description: "Master Soldier.", rarity: "rare" },
  { id: "class_mastery_neyon", gameMode: "class_mastery", trigger: "Master all classes", rewardType: "fixed", fixedCardDefId: "s1_reward_class_neyon", description: "Awakened Ne-Yon.", rarity: "legendary" },

  /* ─── Coop Raids ─── */
  { id: "raid_boss_defeat", gameMode: "coop_raids", trigger: "Defeat a raid boss", rewardType: "fixed", fixedCardDefId: "s1_reward_raid_boss", description: "Raid Champion.", rarity: "rare" },
  { id: "raid_top_contrib", gameMode: "coop_raids", trigger: "Top contribution in 5 raids", rewardType: "fixed", fixedCardDefId: "s1_reward_raid_contrib", description: "Rally the Warband.", rarity: "uncommon" },
  { id: "raid_perfect", gameMode: "coop_raids", trigger: "Zero-casualty raid", rewardType: "fixed", fixedCardDefId: "s1_reward_raid_perfect", description: "Unscathed Victor.", rarity: "legendary" },

  /* ─── Boss Mastery ─── */
  { id: "boss_mastery_collector", gameMode: "boss_mastery", trigger: "Master The Collector", rewardType: "fixed", fixedCardDefId: "s1_reward_boss_collector", description: "Collector's Trophy.", rarity: "epic" },
  { id: "boss_mastery_source", gameMode: "boss_mastery", trigger: "Master The Source", rewardType: "fixed", fixedCardDefId: "s1_reward_boss_source", description: "Source Fragment.", rarity: "legendary" },
  { id: "boss_mastery_architect", gameMode: "boss_mastery", trigger: "Master The Architect", rewardType: "fixed", fixedCardDefId: "s1_reward_boss_architect", description: "Architect's Schematic.", rarity: "epic" },

  /* ─── Space Station ─── */
  { id: "station_complete", gameMode: "space_station", trigger: "Complete station construction", rewardType: "fixed", fixedCardDefId: "s1_reward_station_complete", description: "Station Commander.", rarity: "epic" },
  { id: "station_modules", gameMode: "space_station", trigger: "Install 10 modules", rewardType: "fixed", fixedCardDefId: "s1_reward_station_module", description: "Module Integration.", rarity: "rare" },

  /* ─── Syndicate World ─── */
  { id: "syndicate_build", gameMode: "syndicate_world", trigger: "Build 20 structures", rewardType: "fixed", fixedCardDefId: "s1_reward_syndicate_build", description: "Syndicate Foreman.", rarity: "rare" },
  { id: "syndicate_empire", gameMode: "syndicate_world", trigger: "Control 5 worlds", rewardType: "fixed", fixedCardDefId: "s1_reward_syndicate_empire", description: "Syndicate Overlord.", rarity: "epic" },

  /* ─── Terminus Swarm ─── */
  { id: "swarm_wave25", gameMode: "terminus_swarm", trigger: "Survive wave 25", rewardType: "fixed", fixedCardDefId: "s1_reward_swarm_survive", description: "Swarm Survivor.", rarity: "rare" },
  { id: "swarm_wave50", gameMode: "terminus_swarm", trigger: "Survive wave 50+", rewardType: "fixed", fixedCardDefId: "s1_reward_swarm_champion", description: "Terminus Protocol.", rarity: "epic" },

  /* ─── Vortex Incursion ─── */
  { id: "vortex_close_10", gameMode: "vortex_incursion", trigger: "Close 10 incursions", rewardType: "fixed", fixedCardDefId: "s1_reward_vortex_close", description: "Vortex Seal.", rarity: "rare" },
  { id: "vortex_close_50", gameMode: "vortex_incursion", trigger: "Close 50 incursions", rewardType: "fixed", fixedCardDefId: "s1_reward_vortex_master", description: "Vortex Walker.", rarity: "epic" },

  /* ─── Palimpsest ─── */
  { id: "palimpsest_signal", gameMode: "palimpsest", trigger: "Max signal", rewardType: "fixed", fixedCardDefId: "s1_reward_palimpsest_signal", description: "Signal Bearer.", rarity: "rare" },
  { id: "palimpsest_noise", gameMode: "palimpsest", trigger: "Max noise", rewardType: "fixed", fixedCardDefId: "s1_reward_palimpsest_noise", description: "Noise Agent.", rarity: "rare" },

  /* ─── Graduate Legion ─── */
  { id: "graduate_deploy_10", gameMode: "graduate_legion", trigger: "Deploy 10 graduates", rewardType: "fixed", fixedCardDefId: "s1_reward_graduate_deploy", description: "Graduated Operative.", rarity: "rare" },
  { id: "graduate_all_academies", gameMode: "graduate_legion", trigger: "Graduate all academies", rewardType: "fixed", fixedCardDefId: "s1_reward_graduate_master", description: "Legion's Wisdom.", rarity: "epic" },

  /* ─── Friendly Challenges ─── */
  { id: "challenge_streak_10", gameMode: "friendly_challenges", trigger: "Win 10 friendly challenges", rewardType: "fixed", fixedCardDefId: "s1_reward_challenge_streak", description: "Honored Rival.", rarity: "rare" },

  /* ─── Bonus Objectives ─── */
  { id: "bonus_complete_25", gameMode: "bonus_objectives", trigger: "Complete 25 objectives", rewardType: "fixed", fixedCardDefId: "s1_reward_bonus_complete", description: "Objective Secured.", rarity: "uncommon" },

  /* ─── Casino Expanded ─── */
  { id: "casino_slots_jackpot3", gameMode: "casino", trigger: "3 jackpots in Void Slots", rewardType: "fixed", fixedCardDefId: "s1_reward_casino_slots", description: "Lucky Spinner.", rarity: "uncommon" },
  { id: "casino_poker_10", gameMode: "casino", trigger: "Win 10 Nebula Poker hands", rewardType: "fixed", fixedCardDefId: "s1_reward_casino_poker", description: "Nebula Shark.", rarity: "rare" },
  { id: "casino_dice_7", gameMode: "casino", trigger: "Roll 7 on Entropy Dice 10 times", rewardType: "fixed", fixedCardDefId: "s1_reward_casino_dice", description: "Entropy Roll.", rarity: "uncommon" },
  { id: "casino_pazaak_25", gameMode: "casino", trigger: "Win 25 Pazaak 21 games", rewardType: "fixed", fixedCardDefId: "s1_reward_casino_pazaak", description: "Pazaak Champion.", rarity: "rare" },
  { id: "casino_vip", gameMode: "casino", trigger: "Reach VIP status", rewardType: "fixed", fixedCardDefId: "s1_reward_casino_vip", description: "Casino Mogul.", rarity: "legendary" },

  /* ─── Guild Expanded ─── */
  { id: "guild_founder", gameMode: "guild", trigger: "Found a guild", rewardType: "fixed", fixedCardDefId: "s1_reward_guild_founder", description: "Guild Founder.", rarity: "epic" },
  { id: "guild_officer", gameMode: "guild", trigger: "Reach officer rank", rewardType: "fixed", fixedCardDefId: "s1_reward_guild_officer", description: "Guild Officer.", rarity: "rare" },
  { id: "guild_hall_max", gameMode: "guild", trigger: "Max guild hall level", rewardType: "fixed", fixedCardDefId: "s1_reward_guild_hall", description: "Hall's Blessing.", rarity: "rare" },
  { id: "guild_recruit_10", gameMode: "guild", trigger: "Recruit 10 members", rewardType: "fixed", fixedCardDefId: "s1_reward_guild_recruit", description: "Fresh Recruit.", rarity: "uncommon" },

  /* ─── Trade Empire Expanded ─── */
  { id: "trade_act1", gameMode: "trade_empire", trigger: "Complete Act 1", rewardType: "fixed", fixedCardDefId: "s1_reward_trade_act1", description: "Trade Scout.", rarity: "uncommon" },
  { id: "trade_act2", gameMode: "trade_empire", trigger: "Complete Act 2", rewardType: "fixed", fixedCardDefId: "s1_reward_trade_act2", description: "Trade Captain.", rarity: "rare" },
  { id: "trade_tycoon", gameMode: "trade_empire", trigger: "Earn 1M credits", rewardType: "fixed", fixedCardDefId: "s1_reward_trade_tycoon", description: "Galactic Tycoon.", rarity: "legendary" },

  /* ─── Draft Tournament ─── */
  { id: "draft_winner", gameMode: "draft", trigger: "Win 5 draft tournaments", rewardType: "fixed", fixedCardDefId: "s1_reward_draft_winner", description: "Draft Master.", rarity: "rare" },
  { id: "draft_perfect", gameMode: "draft", trigger: "Go undefeated in a draft", rewardType: "fixed", fixedCardDefId: "s1_reward_draft_perfect", description: "Undefeated Drafter.", rarity: "legendary" },

  /* ─── Eidolon Expanded ─── */
  { id: "eidolon_bond_echo", gameMode: "eidolon_bond", trigger: "Max bond with Echo", rewardType: "fixed", fixedCardDefId: "s1_reward_eidolon_echo", description: "Echo, the Resonance.", rarity: "rare" },
  { id: "eidolon_bond_auros", gameMode: "eidolon_bond", trigger: "Max bond with Auros", rewardType: "fixed", fixedCardDefId: "s1_reward_eidolon_auros", description: "Auros, the Honor.", rarity: "rare" },

  /* ─── Christmas in July ─── */
  { id: "xmas_gift", gameMode: "christmas_in_july", trigger: "Gift exchange", rewardType: "fixed", fixedCardDefId: "s1_reward_xmas_gift", description: "Holiday Surprise.", rarity: "common" },
  { id: "xmas_charity", gameMode: "christmas_in_july", trigger: "Donate to charity pool", rewardType: "fixed", fixedCardDefId: "s1_reward_xmas_charity", description: "Charitable Spirit.", rarity: "uncommon" },

  /* ─── RPG Systems ─── */
  { id: "rpg_quest_50", gameMode: "rpg_systems", trigger: "Complete 50 RPG quests", rewardType: "fixed", fixedCardDefId: "s1_reward_rpg_quest", description: "Questmaster.", rarity: "rare" },

  /* ─── Discovery ─── */
  { id: "discovery_all", gameMode: "discovery", trigger: "Discover all loredex entries", rewardType: "fixed", fixedCardDefId: "s1_reward_discovery_all", description: "Complete Archive.", rarity: "legendary" },
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
