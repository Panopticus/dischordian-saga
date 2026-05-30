/**
 * Card Reward Registry — cross-game-mode reward type definitions (WS-D).
 *
 * Central registry that catalogues every card reward source across the
 * Dischordian Saga. Each entry describes *how* a card is awarded (fixed,
 * morality-branching, vote-branching, or random pool) and what triggers
 * it.
 *
 * No server wiring — pure data/types only.
 */

/* ─── Core reward types ─── */

export type RewardType = "fixed" | "morality_branching" | "vote_branching" | "random_pool";

/* ─── Branch sub-types ─── */

export interface MoralityBranch {
  dominantAxis: "truth" | "defiance" | "empathy" | "acceptance" | "balanced";
  cardDefId: string;
  flavorReason: string;
}

export interface VoteBranch {
  optionNumber: number;
  cardDefId: string;
  variantName: string;
}

/* ─── Reward source definition ─── */

export interface CardRewardSource {
  id: string;
  sourceSystem: string;
  triggerCondition: string;
  rewardType: RewardType;
  fixedCardDefId?: string;
  moralityBranches?: MoralityBranch[];
  voteBranches?: VoteBranch[];
  pool?: Array<{ cardDefId: string; weight: number }>;
  rarity: string;
  description: string;
}

/* ─── Registry data ─── */

/**
 * Master list of all card reward sources. Individual modules (morality,
 * vote, game-mode) define their own typed arrays; this registry rolls
 * every source into one canonical list for iteration / validation.
 *
 * Populated by re-exporting entries from the per-subsystem modules so
 * the registry stays in sync automatically. Placeholder entries below
 * cover the major reward categories; the full per-mode data lives in
 * gameModeRewards.ts, moralityRewards.ts, and voteRewards.ts.
 */
export const CARD_REWARD_REGISTRY: readonly CardRewardSource[] = Object.freeze([
  /* ── Campaign (fixed per chapter) ── */
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `campaign_ch${i + 1}`,
    sourceSystem: "campaign",
    triggerCondition: `Complete chapter ${i + 1}`,
    rewardType: "fixed" as const,
    fixedCardDefId: `s1_reward_campaign_ch${i + 1}`,
    rarity: i < 7 ? "rare" : "epic",
    description: `Card earned by completing campaign chapter ${i + 1}.`,
  })),

  /* ── Tutorial (fixed per gate; 6 gates after audit backfill) ── */
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `tutorial_gate${i + 1}`,
    sourceSystem: "tutorial",
    triggerCondition: `Complete tutorial gate ${i + 1}`,
    rewardType: "fixed" as const,
    fixedCardDefId: `s1_reward_tutorial_gate${i + 1}`,
    rarity: "common",
    description: `Starter card unlocked at tutorial gate ${i + 1}.`,
  })),

  /* ── PvP Ranked (pool by tier) ── */
  {
    id: "pvp_ranked_season_end",
    sourceSystem: "pvp_ranked",
    triggerCondition: "Season end, awarded by final tier",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_reward_pvp_bronze", weight: 40 },
      { cardDefId: "s1_reward_pvp_silver", weight: 30 },
      { cardDefId: "s1_reward_pvp_gold", weight: 15 },
      { cardDefId: "s1_reward_pvp_diamond", weight: 10 },
      { cardDefId: "s1_reward_pvp_master", weight: 4 },
      { cardDefId: "s1_reward_pvp_legend", weight: 1 },
    ],
    rarity: "varies",
    description: "Season-end ranked reward. Pool filtered by player tier.",
  },

  /* ── Governance (morality-branching every 4 votes) ── */
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `governance_morality_t${i + 1}`,
    sourceSystem: "governance_hub",
    triggerCondition: `Every 4th governance vote (tier ${i + 1}, votes ${(i + 1) * 4})`,
    rewardType: "morality_branching" as const,
    moralityBranches: (["truth", "defiance", "empathy", "acceptance", "balanced"] as const).map(
      (axis) => ({
        dominantAxis: axis,
        cardDefId: `s1_reward_morality_t${i + 1}_${axis}`,
        flavorReason: `Tier ${i + 1} reward for ${axis}-dominant players.`,
      }),
    ),
    rarity: i < 3 ? "rare" : "epic",
    description: `Morality-branching card reward at governance vote milestone ${(i + 1) * 4}.`,
  })),

  /* ── Vote-branching (major decisions) ── */
  {
    id: "vote_resurrection_protocol",
    sourceSystem: "governance_hub",
    triggerCondition: "Resurrection Protocol Vote resolved",
    rewardType: "vote_branching" as const,
    voteBranches: [
      { optionNumber: 1, cardDefId: "s1_reward_vote_resurrection_mercy", variantName: "Mercy" },
      { optionNumber: 2, cardDefId: "s1_reward_vote_resurrection_purge", variantName: "Purge" },
      { optionNumber: 3, cardDefId: "s1_reward_vote_resurrection_delay", variantName: "Delay" },
    ],
    rarity: "epic",
    description: "Card variant depends on how the community voted on the Resurrection Protocol.",
  },
  {
    id: "vote_terminus_quarantine",
    sourceSystem: "governance_hub",
    triggerCondition: "Terminus Quarantine Vote resolved",
    rewardType: "vote_branching" as const,
    voteBranches: [
      { optionNumber: 1, cardDefId: "s1_reward_vote_terminus_seal", variantName: "Seal" },
      { optionNumber: 2, cardDefId: "s1_reward_vote_terminus_breach", variantName: "Breach" },
      { optionNumber: 3, cardDefId: "s1_reward_vote_terminus_negotiate", variantName: "Negotiate" },
    ],
    rarity: "epic",
    description: "Card variant depends on how the community voted on the Terminus Quarantine.",
  },

  /* ── Game-mode fixed rewards (representative samples) ── */
  {
    id: "chess_tournament_win",
    sourceSystem: "chess",
    triggerCondition: "Win a chess tournament",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_reward_chess_tourney",
    rarity: "rare",
    description: "Card earned by winning a chess tournament.",
  },
  {
    id: "pet_battles_5_streak",
    sourceSystem: "pet_battles",
    triggerCondition: "Achieve a 5-win streak in pet battles",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_reward_pet_streak5",
    rarity: "rare",
    description: "Card earned from a 5-win pet battle streak.",
  },
  {
    id: "dead_mans_circuit_first",
    sourceSystem: "dead_mans_circuit",
    triggerCondition: "Finish 1st in Dead Man's Circuit",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_reward_dmc_first",
    rarity: "epic",
    description: "Card earned by placing 1st in Dead Man's Circuit.",
  },
  {
    id: "guild_wars_territory",
    sourceSystem: "guild_wars",
    triggerCondition: "Capture a territory in Guild Wars",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_reward_guild_territory",
    rarity: "rare",
    description: "Card earned by capturing a Guild Wars territory.",
  },
  {
    id: "casino_jackpot",
    sourceSystem: "casino",
    triggerCondition: "Hit the casino jackpot",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_reward_casino_silver", weight: 50 },
      { cardDefId: "s1_reward_casino_gold", weight: 35 },
      { cardDefId: "s1_reward_casino_jackpot", weight: 15 },
    ],
    rarity: "varies",
    description: "Random card from the casino jackpot pool.",
  },
  {
    id: "tower_defense_wave50",
    sourceSystem: "tower_defense",
    triggerCondition: "Survive wave 50+ in Tower Defense",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_reward_tower_wave50",
    rarity: "epic",
    description: "Card earned by surviving past wave 50 in Tower Defense.",
  },
  {
    id: "outbreak_protocol",
    sourceSystem: "outbreak",
    triggerCondition: "Complete Outbreak protocol",
    rewardType: "morality_branching" as const,
    moralityBranches: (["truth", "defiance", "empathy", "acceptance", "balanced"] as const).map(
      (axis) => ({
        dominantAxis: axis,
        cardDefId: `s1_reward_outbreak_${axis}`,
        flavorReason: `Outbreak reward shaped by ${axis} choices during the protocol.`,
      }),
    ),
    rarity: "epic",
    description: "Morality-branching card earned by completing an Outbreak protocol.",
  },
  {
    id: "dischordia_cycle_peak",
    sourceSystem: "dischordia_cycle",
    triggerCondition: "Reach energy peak during Dischordia Cycle",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_reward_dischordia_light",
    rarity: "rare",
    description: "Card variant (light/dark) earned at Dischordia Cycle energy peak.",
  },

  /* ── NPC duel rewards (Highlander chain — Phase 2 pilot: the_degen)
   *
   *  Tier scales with how many perspective aspects the player learned
   *  about the NPC before issuing the challenge (npcDuelRewardTier in
   *  apps/shared/npc-decks/buildNpcDeck.ts):
   *    Tier 0 — fixed, single generic memory ("nothing learned")
   *    Tier 1 — random_pool of 3 weighted draws ("scratched the surface")
   *    Tier 2 — random_pool of 6 weighted draws ("most of the way")
   *    Tier 3 — fixed, the NPC's signature card ("full understanding"). The
   *             server dispatcher additionally grants the entire NPC deck
   *             as a memorial collection when tier 3 fires (see
   *             dispatchNpcDuelVictory.ts grantFullMemorialDeck path).
   *
   *  Pool entries are drawn from the_degen.ts coreMemories — the
   *  Degen's lived ledger is what the player inherits. ── */
  {
    id: "defeated_npc_the_degen_tier_0",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_degen with 0 perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_reward_casino_poker",
    rarity: "common",
    description: "A single Casino chit — the Degen barely registered the loss.",
  },
  {
    id: "defeated_npc_the_degen_tier_1",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_degen with some perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_reward_casino_poker", weight: 40 },
      { cardDefId: "s1_reward_casino_vip", weight: 30 },
      { cardDefId: "s1_reward_casino_high_roller", weight: 20 },
      { cardDefId: "s1_reward_casino_dice", weight: 10 },
    ],
    rarity: "rare",
    description: "A handful of memories from the Casino's tray.",
  },
  {
    id: "defeated_npc_the_degen_tier_2",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_degen with most perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_char_025", weight: 20 }, // The Dreamer
      { cardDefId: "s1_char_037", weight: 15 }, // The Knowledge
      { cardDefId: "s1_pack_015", weight: 15 }, // Probability Surge
      { cardDefId: "s1_pack_017", weight: 15 }, // Fate's Edge
      { cardDefId: "s1_pack_019", weight: 10 }, // Oracle's Wrath
      { cardDefId: "s1_reward_casino_vip", weight: 15 },
      { cardDefId: "s1_reward_casino_jackpot", weight: 10 },
    ],
    rarity: "epic",
    description: "A pile from the Degen's tray — the kind of memory he files reluctantly.",
  },
  {
    id: "defeated_npc_the_degen_tier_3",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_degen with all perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_char_023", // The Degen (the signature card)
    rarity: "legendary",
    description:
      "The Degen's own card — the full Highlander memorial, plus the rest of his deck granted by the duel dispatcher.",
  },

  /* ── NPC duel rewards — wraith_calder / the Hierophant ── */
  {
    id: "defeated_npc_wraith_calder_tier_0",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat wraith_calder with 0 perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_curve_009", // Trench Sergeant — a workmanlike trace
    rarity: "common",
    description: "A single workmanlike trace — the Hierophant barely registered.",
  },
  {
    id: "defeated_npc_wraith_calder_tier_1",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat wraith_calder with some perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_curve_004", weight: 35 }, // Cell Decoy
      { cardDefId: "s1_curve_009", weight: 30 }, // Trench Sergeant
      { cardDefId: "s1_char_107", weight: 20 }, // Signal Operative
      { cardDefId: "s1_pack_005", weight: 15 }, // Cell Runner
    ],
    rarity: "rare",
    description: "A handful of names from the lectern's bottom drawer.",
  },
  {
    id: "defeated_npc_wraith_calder_tier_2",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat wraith_calder with most perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_char_002", weight: 18 }, // Agent Zero
      { cardDefId: "s1_char_010", weight: 15 }, // Iron Lion
      { cardDefId: "s1_char_026", weight: 12 }, // The Engineer
      { cardDefId: "s1_char_028", weight: 12 }, // The Eyes
      { cardDefId: "s1_pack_008", weight: 13 }, // Dead Signal Burst
      { cardDefId: "s1_pack_011", weight: 15 }, // Insurgent Commander
      { cardDefId: "s1_pack_014", weight: 15 }, // Agent Zero Reborn
    ],
    rarity: "epic",
    description:
      "Names from higher up the count — Wraith does not part with these casually.",
  },
  {
    id: "defeated_npc_wraith_calder_tier_3",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat wraith_calder with all perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_char_031", // The Hierophant (his post-rite signature)
    rarity: "legendary",
    description:
      "The Hierophant's own card — the full Highlander memorial, plus the rest of the cell's roster granted by the duel dispatcher.",
  },

  /* ── NPC duel rewards — vex_solene / Maestro of the Coda ── */
  {
    id: "defeated_npc_vex_solene_tier_0",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat vex_solene with 0 perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_curve_005", // Compliance Watcher
    rarity: "common",
    description: "A workmanlike trace — the Maestro closed the room politely.",
  },
  {
    id: "defeated_npc_vex_solene_tier_1",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat vex_solene with some perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_curve_005", weight: 30 }, // Compliance Watcher
      { cardDefId: "s1_curve_010", weight: 25 }, // Sector Magistrate
      { cardDefId: "s1_char_082", weight: 25 }, // Spire Assassin
      { cardDefId: "s1_pack_033", weight: 20 }, // Debt Collector
    ],
    rarity: "rare",
    description: "A handful of closed contracts from the Coda's dead-drop.",
  },
  {
    id: "defeated_npc_vex_solene_tier_2",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat vex_solene with most perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_char_001", weight: 15 }, // Adjudicator Locke
      { cardDefId: "s1_char_020", weight: 12 }, // The Authority
      { cardDefId: "s1_char_078", weight: 12 }, // Governor Thane
      { cardDefId: "s1_char_117", weight: 12 }, // Senator Voss
      { cardDefId: "s1_char_120", weight: 13 }, // Crystal Archive Guard
      { cardDefId: "s1_pack_032", weight: 13 }, // Market Crash
      { cardDefId: "s1_pack_034", weight: 23 }, // Locke's Inner Circle (Coda echo)
    ],
    rarity: "epic",
    description:
      "The Maestro folds the contract — deeper paper than she was meant to give.",
  },
  {
    id: "defeated_npc_vex_solene_tier_3",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat vex_solene with all perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_char_061", // Vex herself (the Taskmaster signature)
    rarity: "legendary",
    description:
      "The Maestro's own card — the full Highlander memorial, plus the Coda's commercial layer granted by the duel dispatcher.",
  },

  /* ── NPC duel rewards — the_seer ── */
  {
    id: "defeated_npc_the_seer_tier_0",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_seer with 0 perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_curve_003", // Glimmer Wisp
    rarity: "common",
    description: "A small inheritance from the bench — the lesson was minor.",
  },
  {
    id: "defeated_npc_the_seer_tier_1",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_seer with some perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_curve_003", weight: 35 }, // Glimmer Wisp
      { cardDefId: "s1_curve_008", weight: 30 }, // Vision Anchor
      { cardDefId: "s1_pack_021", weight: 20 }, // Starlight Familiar
      { cardDefId: "s1_pack_006", weight: 15 }, // Dream Choir
    ],
    rarity: "rare",
    description: "A few entries from the probability table — the kinder columns.",
  },
  {
    id: "defeated_npc_the_seer_tier_2",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_seer with most perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_char_025", weight: 18 }, // The Dreamer
      { cardDefId: "s1_char_029", weight: 12 }, // The Forgotten
      { cardDefId: "s1_char_034", weight: 12 }, // The Inventor
      { cardDefId: "s1_char_037", weight: 12 }, // The Knowledge
      { cardDefId: "s1_char_110", weight: 13 }, // Prophecy Keeper
      { cardDefId: "s1_pack_015", weight: 13 }, // Probability Surge
      { cardDefId: "s1_pack_020", weight: 20 }, // Prophecy Incarnate
    ],
    rarity: "epic",
    description:
      "Versions she ranked highest — given without prophecy-overhead.",
  },
  {
    id: "defeated_npc_the_seer_tier_3",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_seer with all perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_char_046", // The Seer (her bench signature)
    rarity: "legendary",
    description:
      "The Seer's own card — the full Highlander memorial, plus the Dreamer roster granted by the duel dispatcher.",
  },

  /* ── NPC duel rewards — akai_shi / the Red Death ── */
  {
    id: "defeated_npc_akai_shi_tier_0",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat akai_shi with 0 perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_curve_005", // Compliance Watcher
    rarity: "common",
    description: "A workmanlike trace — the Red Death classified the loss.",
  },
  {
    id: "defeated_npc_akai_shi_tier_1",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat akai_shi with some perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_curve_005", weight: 30 }, // Compliance Watcher
      { cardDefId: "s1_curve_010", weight: 25 }, // Sector Magistrate
      { cardDefId: "s1_char_080", weight: 25 }, // District Enforcer
      { cardDefId: "s1_char_082", weight: 20 }, // Spire Assassin
    ],
    rarity: "rare",
    description: "A few entries from the operations desk — the lower-class files.",
  },
  {
    id: "defeated_npc_akai_shi_tier_2",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat akai_shi with most perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_char_020", weight: 15 }, // The Authority
      { cardDefId: "s1_char_078", weight: 13 }, // Governor Thane
      { cardDefId: "s1_char_084", weight: 14 }, // Iron Decree
      { cardDefId: "s1_char_085", weight: 13 }, // Sector Warden
      { cardDefId: "s1_char_120", weight: 15 }, // Crystal Archive Guard
      { cardDefId: "s1_pack_030", weight: 15 }, // Syndicate Enforcer
      { cardDefId: "s1_pack_035", weight: 15 }, // Trade Embargo
    ],
    rarity: "epic",
    description:
      "Higher-class files — the strategies that did not work in the prevented timeline.",
  },
  {
    id: "defeated_npc_akai_shi_tier_3",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat akai_shi with all perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_char_003", // Akai Shi (her own card)
    rarity: "legendary",
    description:
      "The Red Death's own card — the full Highlander memorial, plus the operations desk granted by the duel dispatcher.",
  },

  /* ── NPC duel rewards — adjudicator_locke ── */
  {
    id: "defeated_npc_adjudicator_locke_tier_0",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat adjudicator_locke with 0 perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_curve_005",
    rarity: "common",
    description: "A receipt the Authority filed quietly — no monument.",
  },
  {
    id: "defeated_npc_adjudicator_locke_tier_1",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat adjudicator_locke with some perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_curve_005", weight: 30 },
      { cardDefId: "s1_curve_010", weight: 25 },
      { cardDefId: "s1_pack_033", weight: 25 }, // Debt Collector
      { cardDefId: "s1_char_119", weight: 20 }, // Syndicate Broker
    ],
    rarity: "rare",
    description: "A handful of closed accounts from the Authority's ledger.",
  },
  {
    id: "defeated_npc_adjudicator_locke_tier_2",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat adjudicator_locke with most perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_char_020", weight: 18 }, // The Authority
      { cardDefId: "s1_char_078", weight: 13 }, // Governor Thane
      { cardDefId: "s1_char_081", weight: 13 }, // Tribunal Magistrate
      { cardDefId: "s1_char_117", weight: 13 }, // Senator Voss
      { cardDefId: "s1_char_118", weight: 13 }, // Trade Enforcer
      { cardDefId: "s1_char_120", weight: 15 }, // Crystal Archive Guard
      { cardDefId: "s1_pack_032", weight: 15 }, // Market Crash
    ],
    rarity: "epic",
    description: "Higher-order portfolio — the Authority does not part with these casually.",
  },
  {
    id: "defeated_npc_adjudicator_locke_tier_3",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat adjudicator_locke with all perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_char_001", // Adjudicator Locke
    rarity: "legendary",
    description:
      "Locke's own card — the full Highlander memorial, plus the Authority's inner circle granted by the duel dispatcher.",
  },

  /* ── NPC duel rewards — the_meme ── */
  {
    id: "defeated_npc_the_meme_tier_0",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_meme with 0 perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_curve_002",
    rarity: "common",
    description: "A frens-frens trace — the channel barely registered.",
  },
  {
    id: "defeated_npc_the_meme_tier_1",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_meme with some perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_curve_002", weight: 35 }, // Schematic Spark
      { cardDefId: "s1_curve_007", weight: 30 }, // Schematic Bastion
      { cardDefId: "s1_char_101", weight: 20 }, // Panoptic Warden Foucault
      { cardDefId: "s1_char_102", weight: 15 }, // Arena Enforcer
    ],
    rarity: "rare",
    description: "A handful of broadcasts from the channel's overflow.",
  },
  {
    id: "defeated_npc_the_meme_tier_2",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_meme with most perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_char_019", weight: 18 }, // The Architect (parent)
      { cardDefId: "s1_char_022", weight: 13 }, // The Collector
      { cardDefId: "s1_char_030", weight: 12 }, // The Game Master
      { cardDefId: "s1_char_035", weight: 12 }, // The Jailer
      { cardDefId: "s1_char_104", weight: 15 }, // White Oracle (the 11-year mask)
      { cardDefId: "s1_pack_001", weight: 15 }, // Panopticon Override
      { cardDefId: "s1_pack_003", weight: 15 }, // Arena Architect
    ],
    rarity: "epic",
    description: "Bigger broadcasts — the channel concedes higher reach.",
  },
  {
    id: "defeated_npc_the_meme_tier_3",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_meme with all perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_char_038", // The Meme itself
    rarity: "legendary",
    description:
      "The Meme's own card — the full Highlander memorial, plus the Architect roster granted by the duel dispatcher.",
  },

  /* ── NPC duel rewards — the_oracle ── */
  {
    id: "defeated_npc_the_oracle_tier_0",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_oracle with 0 perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_curve_003",
    rarity: "common",
    description: "A trace from the substrate — the vision did not surface.",
  },
  {
    id: "defeated_npc_the_oracle_tier_1",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_oracle with some perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_curve_003", weight: 30 },
      { cardDefId: "s1_curve_008", weight: 25 },
      { cardDefId: "s1_pack_021", weight: 25 },
      { cardDefId: "s1_pack_006", weight: 20 },
    ],
    rarity: "rare",
    description: "Residues the substrate kept on the surface.",
  },
  {
    id: "defeated_npc_the_oracle_tier_2",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_oracle with most perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_char_025", weight: 14 }, // The Dreamer
      { cardDefId: "s1_char_029", weight: 13 }, // The Forgotten
      { cardDefId: "s1_char_046", weight: 13 }, // The Seer
      { cardDefId: "s1_char_110", weight: 14 }, // Prophecy Keeper
      { cardDefId: "s1_char_111", weight: 14 }, // Vision Walker
      { cardDefId: "s1_pack_017", weight: 16 }, // Fate's Edge
      { cardDefId: "s1_pack_020", weight: 16 }, // Prophecy Incarnate
    ],
    rarity: "epic",
    description: "Deeper residues — the substrate releases what it had filed.",
  },
  {
    id: "defeated_npc_the_oracle_tier_3",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat the_oracle with all perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_char_041", // The Oracle
    rarity: "legendary",
    description:
      "The Oracle's own card — the full Highlander memorial, plus the Dreamer roster granted by the duel dispatcher.",
  },

  /* ── NPC duel rewards — lycos ── */
  {
    id: "defeated_npc_lycos_tier_0",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat lycos with 0 perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_char_071",
    rarity: "common",
    description: "A trace from the perimeter — the contract barely registered.",
  },
  {
    id: "defeated_npc_lycos_tier_1",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat lycos with some perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_char_071", weight: 30 }, // Neural Parasite
      { cardDefId: "s1_char_077", weight: 25 }, // Mind Rot Drone
      { cardDefId: "s1_pack_022", weight: 25 }, // Viral Bloom
      { cardDefId: "s1_pack_028", weight: 20 }, // Spore Cloud
    ],
    rarity: "rare",
    description: "A handful of contracts the Wolf closed and did not file.",
  },
  {
    id: "defeated_npc_lycos_tier_2",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat lycos with most perspective aspects learned",
    rewardType: "random_pool" as const,
    pool: [
      { cardDefId: "s1_char_049", weight: 14 }, // The Source
      { cardDefId: "s1_char_070", weight: 14 }, // Patient Zero
      { cardDefId: "s1_char_072", weight: 13 }, // Memetic Carrier
      { cardDefId: "s1_char_115", weight: 13 }, // Consumed Host
      { cardDefId: "s1_char_200", weight: 16 }, // Cortex Ravager
      { cardDefId: "s1_pack_025", weight: 15 }, // Corruption Wave
      { cardDefId: "s1_pack_027", weight: 15 }, // Terminus Dreadnought
    ],
    rarity: "epic",
    description: "Larger contracts — the Wolf parts with these only on the loss.",
  },
  {
    id: "defeated_npc_lycos_tier_3",
    sourceSystem: "npc_duel",
    triggerCondition: "Defeat lycos with all perspective aspects learned",
    rewardType: "fixed" as const,
    fixedCardDefId: "s1_char_032", // The Host (his canonical form)
    rarity: "legendary",
    description:
      "The Wolf's canonical Host-form — the full Highlander memorial, plus the contract roster granted by the duel dispatcher.",
  },
]);

/* ─── Quick-lookup map ─── */

export const REWARD_MAP: Record<string, CardRewardSource> = Object.freeze(
  Object.fromEntries(CARD_REWARD_REGISTRY.map((r) => [r.id, r])),
) as Record<string, CardRewardSource>;
