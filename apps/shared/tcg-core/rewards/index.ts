/**
 * Card Rewards barrel — re-exports all reward types, data, and helpers (WS-D).
 */

/* ─── Core registry ─── */
export type {
  RewardType,
  MoralityBranch,
  VoteBranch,
  CardRewardSource,
} from "./cardRewardRegistry";
export { CARD_REWARD_REGISTRY, REWARD_MAP } from "./cardRewardRegistry";

/* ─── Morality-branching rewards ─── */
export type { MoralityRewardTier, MoralAxis } from "./moralityRewards";
export {
  MORALITY_REWARD_TIERS,
  computeDominantAxis,
} from "./moralityRewards";

/* ─── Vote-branching rewards ─── */
export type { VoteRewardConfig } from "./voteRewards";
export { VOTE_REWARD_CONFIGS, VOTE_REWARD_MAP } from "./voteRewards";

/* ─── NPC Imprints (Phase F) ─── */
export type {
  ImprintTier,
  ImprintNpcEntry,
  ImprintFragmentSource,
} from "./imprintRegistry";
export {
  IMPRINT_REGISTRY,
  IMPRINT_REGISTRY_BY_SLUG,
  IMPRINT_TIER_RARITY,
  IMPRINT_THRESHOLDS,
  IMPRINT_FRAGMENT_SOURCES,
  getImprintNpc,
  tierForFragments,
  tieredCardDefIdsFor,
} from "./imprintRegistry";

/* ─── Per-game-mode rewards ─── */
export type { GameModeReward } from "./gameModeRewards";
export {
  ALL_GAME_MODE_REWARDS,
  GAME_MODE_REWARD_MAP,
  REWARDS_BY_MODE,
} from "./gameModeRewards";
