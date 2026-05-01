/**
 * Weekly guild contract templates — the 8 contracts that auto-unlock
 * Monday tarot-flip per the Bible's F.2.1 design. Each contract maps
 * to one of the existing guildWars.contribute source enums so the
 * progress-counter wiring is mechanical when the content team ships
 * the per-player tracking surface.
 *
 * Authoring contract:
 *   - Exactly 8 contracts per week — the cs_contract_unlock cinematic
 *     (8-card tarot fan) is hard-coded against this count.
 *   - Each contract has a distinct `source` so a player can advance
 *     all 8 in parallel by playing the breadth of game loops.
 *   - `targetCount` is the threshold to fire cs_contract_complete.
 *   - Rewards split between Dream (treasury) and guild XP; the
 *     reward distribution itself is wired in completeContract once
 *     the per-player progress tracker lands.
 */

export type ContractSource =
  | "fight_win"
  | "pvp_win"
  | "trade_volume"
  | "quest_complete"
  | "card_battle_win"
  | "chess_win"
  | "terminus_wave"
  | "terminus_boss_kill"
  | "terminus_pvp_star"
  | "terminus_defense"
  | "guild_donation";

export interface GuildContractTemplate {
  /** Stable id used by completeContract validation + cinematic id slot. */
  id: string;
  /** Player-facing card title shown on the F.2 contract board. */
  title: string;
  /** One-line description with the spec'd target count substituted. */
  description: string;
  /** Game-event source that increments this contract's progress counter. */
  source: ContractSource;
  /** Number of `source` events needed to mark the contract complete. */
  targetCount: number;
  rewards: {
    dream?: number;
    guildXp?: number;
  };
}

/** The canonical 8 weekly contracts. Order matters — the
 *  cs_contract_unlock cinematic's tarot fan dealing animation
 *  uses array index as fan position. */
export const WEEKLY_CONTRACTS: readonly GuildContractTemplate[] = [
  {
    id: "wc_mess_hall_roster",
    title: "The Mess Hall Roster",
    description: "Win 5 fights with any squad member. The Mess Hall keeps record.",
    source: "fight_win",
    targetCount: 5,
    rewards: { dream: 200, guildXp: 50 },
  },
  {
    id: "wc_arena_day",
    title: "Arena Day",
    description: "Take 3 PvP matches. The Architect's logs prefer winners.",
    source: "pvp_win",
    targetCount: 3,
    rewards: { dream: 300, guildXp: 75 },
  },
  {
    id: "wc_trade_caravan",
    title: "Trade Caravan",
    description: "Move 5,000 credits through the markets. Velocity matters.",
    source: "trade_volume",
    targetCount: 5000,
    rewards: { dream: 250, guildXp: 50 },
  },
  {
    id: "wc_quest_loop",
    title: "The Quest Loop",
    description: "Close out 5 quests. Story progress feeds the treasury.",
    source: "quest_complete",
    targetCount: 5,
    rewards: { dream: 250, guildXp: 75 },
  },
  {
    id: "wc_card_mastery",
    title: "Card Mastery",
    description: "Win 4 card battles. The deck remembers what works.",
    source: "card_battle_win",
    targetCount: 4,
    rewards: { dream: 250, guildXp: 75 },
  },
  {
    id: "wc_long_game",
    title: "The Long Game",
    description: "Win 2 chess matches. Slow is correct more often than fast.",
    source: "chess_win",
    targetCount: 2,
    rewards: { dream: 300, guildXp: 100 },
  },
  {
    id: "wc_hold_the_line",
    title: "Hold the Line",
    description: "Survive 8 Terminus waves. The swarm tests every resource.",
    source: "terminus_wave",
    targetCount: 8,
    rewards: { dream: 350, guildXp: 100 },
  },
  {
    id: "wc_architects_approval",
    title: "The Architect's Approval",
    description: "Donate 1,000 Dream to the treasury. Every contribution noted.",
    source: "guild_donation",
    targetCount: 1000,
    rewards: { dream: 0, guildXp: 200 },
  },
];

/** Total count assertion used by the contract router + tests. */
export const WEEKLY_CONTRACT_COUNT = WEEKLY_CONTRACTS.length;

/** Lookup helper for completeContract validation. */
const BY_ID = new Map(WEEKLY_CONTRACTS.map((c) => [c.id, c] as const));
export function getContractTemplate(id: string): GuildContractTemplate | undefined {
  return BY_ID.get(id);
}
