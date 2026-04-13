/**
 * Vote-branching card rewards — Governance Hub (WS-D).
 *
 * When a major governance vote resolves, every participant earns a card
 * whose *variant* depends on which option won. These are purely
 * cosmetic / lore variants — same stats, different art and flavor text.
 *
 * Pure data — no server wiring.
 */

import type { VoteBranch } from "./cardRewardRegistry";

/* ─── Types ─── */

export interface VoteRewardConfig {
  voteId: string;
  voteName: string;
  branches: VoteBranch[];
}

/* ─── Vote reward data ─── */

export const VOTE_REWARD_CONFIGS: readonly VoteRewardConfig[] = Object.freeze([
  /* 1 — Resurrection Protocol */
  {
    voteId: "vote_resurrection_protocol",
    voteName: "Resurrection Protocol Vote",
    branches: [
      { optionNumber: 1, cardDefId: "s1_reward_vote_resurrection_mercy",   variantName: "Mercy" },
      { optionNumber: 2, cardDefId: "s1_reward_vote_resurrection_purge",   variantName: "Purge" },
      { optionNumber: 3, cardDefId: "s1_reward_vote_resurrection_delay",   variantName: "Delay" },
    ],
  },

  /* 2 — Terminus Quarantine */
  {
    voteId: "vote_terminus_quarantine",
    voteName: "Terminus Quarantine Vote",
    branches: [
      { optionNumber: 1, cardDefId: "s1_reward_vote_terminus_seal",      variantName: "Seal the Gates" },
      { optionNumber: 2, cardDefId: "s1_reward_vote_terminus_breach",    variantName: "Breach Protocol" },
      { optionNumber: 3, cardDefId: "s1_reward_vote_terminus_negotiate", variantName: "Negotiate" },
    ],
  },

  /* 3 — Memory Purge */
  {
    voteId: "vote_memory_purge",
    voteName: "Memory Purge Vote",
    branches: [
      { optionNumber: 1, cardDefId: "s1_reward_vote_memory_preserve",  variantName: "Preserve All" },
      { optionNumber: 2, cardDefId: "s1_reward_vote_memory_selective",  variantName: "Selective Wipe" },
      { optionNumber: 3, cardDefId: "s1_reward_vote_memory_total",     variantName: "Total Purge" },
      { optionNumber: 4, cardDefId: "s1_reward_vote_memory_encrypt",   variantName: "Encrypt & Archive" },
    ],
  },

  /* 4 — Grid Sovereignty */
  {
    voteId: "vote_grid_sovereignty",
    voteName: "Grid Sovereignty Vote",
    branches: [
      { optionNumber: 1, cardDefId: "s1_reward_vote_grid_centralize",  variantName: "Centralize" },
      { optionNumber: 2, cardDefId: "s1_reward_vote_grid_decentralize", variantName: "Decentralize" },
      { optionNumber: 3, cardDefId: "s1_reward_vote_grid_partition",   variantName: "Partition" },
    ],
  },

  /* 5 — Eidolon Emancipation */
  {
    voteId: "vote_eidolon_emancipation",
    voteName: "Eidolon Emancipation Vote",
    branches: [
      { optionNumber: 1, cardDefId: "s1_reward_vote_eidolon_free",     variantName: "Emancipate" },
      { optionNumber: 2, cardDefId: "s1_reward_vote_eidolon_regulate", variantName: "Regulate" },
      { optionNumber: 3, cardDefId: "s1_reward_vote_eidolon_bind",     variantName: "Bind Deeper" },
      { optionNumber: 4, cardDefId: "s1_reward_vote_eidolon_merge",    variantName: "Merge Consciousness" },
    ],
  },
]);

/**
 * Quick lookup: voteId → VoteRewardConfig.
 */
export const VOTE_REWARD_MAP: Record<string, VoteRewardConfig> = Object.freeze(
  Object.fromEntries(VOTE_REWARD_CONFIGS.map((v) => [v.voteId, v])),
) as Record<string, VoteRewardConfig>;
