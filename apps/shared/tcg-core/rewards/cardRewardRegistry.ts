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
]);

/* ─── Quick-lookup map ─── */

export const REWARD_MAP: Record<string, CardRewardSource> = Object.freeze(
  Object.fromEntries(CARD_REWARD_REGISTRY.map((r) => [r.id, r])),
) as Record<string, CardRewardSource>;
