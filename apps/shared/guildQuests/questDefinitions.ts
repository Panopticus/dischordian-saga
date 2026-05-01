/**
 * Guild quest definitions — Tier 4B.
 *
 * Daily / weekly / seasonal objectives that members work toward
 * collectively. Reset by cron on the appropriate cadence.
 *
 * Conditions are interpreted by the quest progression service which
 * subscribes to the same event bus that grants titles.
 */

export type GuildQuestScope = "daily" | "weekly" | "seasonal";

export type GuildQuestCondition =
  | { kind: "pvp_wins_total"; gameType?: string; count: number }
  | { kind: "card_duels_played"; count: number }
  | { kind: "chess_wins"; count: number }
  | { kind: "raid_clears"; count: number }
  | { kind: "td_raid_wins"; count: number }
  | { kind: "td_defenses"; count: number }
  | { kind: "circuit_races"; count: number }
  | { kind: "trade_missions_complete"; count: number }
  | { kind: "conspiracy_clues_collected"; count: number }
  | { kind: "conspiracy_board_solved"; boardKey?: string }
  | { kind: "member_reaches_tier"; gameType?: string; tier: number; count: number }
  | { kind: "guild_war_contribution"; points: number }
  | { kind: "any_pvp_match"; count: number };

export interface GuildQuestRewards {
  readonly guildXp?: number;
  readonly treasuryDream?: number;
  readonly treasuryCredits?: number;
  /** Banner key (optional unlock). */
  readonly bannerKey?: string;
  /** Title-grant for every member who contributed. */
  readonly titleKey?: string;
}

export interface GuildQuestDef {
  readonly questKey: string;
  readonly scope: GuildQuestScope;
  readonly name: string;
  readonly description: string;
  readonly condition: GuildQuestCondition;
  readonly rewards: GuildQuestRewards;
  readonly iconKey: string;
}

export const GUILD_QUESTS: readonly GuildQuestDef[] = [
  /* ─── DAILY (reset 00:00 UTC) ─── */
  {
    questKey: "daily_pvp_wins_5",
    scope: "daily",
    name: "Daily Skirmishes",
    description: "Win 5 PvP card duels across all members.",
    condition: { kind: "pvp_wins_total", gameType: "card_1v1", count: 5 },
    rewards: { guildXp: 50, treasuryDream: 100 },
    iconKey: "Swords",
  },
  {
    questKey: "daily_chess_wins_3",
    scope: "daily",
    name: "The Game Master Watches",
    description: "Win 3 chess matches across all members.",
    condition: { kind: "chess_wins", count: 3 },
    rewards: { guildXp: 50, treasuryDream: 100 },
    iconKey: "Gamepad2",
  },
  {
    questKey: "daily_clues_3",
    scope: "daily",
    name: "Whispers in the Vault",
    description: "Collect 3 conspiracy clues across all members.",
    condition: { kind: "conspiracy_clues_collected", count: 3 },
    rewards: { guildXp: 75, treasuryDream: 150 },
    iconKey: "BookOpen",
  },
  {
    questKey: "daily_any_pvp_10",
    scope: "daily",
    name: "Pulse of the Arena",
    description: "Play 10 PvP matches in any gameType.",
    condition: { kind: "any_pvp_match", count: 10 },
    rewards: { guildXp: 40 },
    iconKey: "Crosshair",
  },

  /* ─── WEEKLY (reset Mon 00:00 UTC) ─── */
  {
    questKey: "weekly_pvp_wins_50",
    scope: "weekly",
    name: "Battle-Hardened",
    description: "Win 50 PvP card duels.",
    condition: { kind: "pvp_wins_total", gameType: "card_1v1", count: 50 },
    rewards: { guildXp: 500, treasuryDream: 1000, bannerKey: "banner_warlord_pennant" },
    iconKey: "Swords",
  },
  {
    questKey: "weekly_raid_clears_10",
    scope: "weekly",
    name: "Trinity Forged",
    description: "Clear 10 co-op raids together.",
    condition: { kind: "raid_clears", count: 10 },
    rewards: { guildXp: 600, treasuryDream: 1200, bannerKey: "banner_witnesses" },
    iconKey: "Heart",
  },
  {
    questKey: "weekly_td_raids_25",
    scope: "weekly",
    name: "Crown Crushers",
    description: "Win 25 Tower Defense raids.",
    condition: { kind: "td_raid_wins", count: 25 },
    rewards: { guildXp: 500, treasuryDream: 800 },
    iconKey: "Shield",
  },
  {
    questKey: "weekly_td_defenses_25",
    scope: "weekly",
    name: "Unbroken Wall",
    description: "Successfully defend your bases 25 times.",
    condition: { kind: "td_defenses", count: 25 },
    rewards: { guildXp: 500, treasuryDream: 800 },
    iconKey: "Shield",
  },
  {
    questKey: "weekly_circuit_races_15",
    scope: "weekly",
    name: "Bone Track Tour",
    description: "Race 15 Dead Man's Circuit clones.",
    condition: { kind: "circuit_races", count: 15 },
    rewards: { guildXp: 400 },
    iconKey: "Crosshair",
  },
  {
    questKey: "weekly_trade_missions_20",
    scope: "weekly",
    name: "Caravan Profits",
    description: "Complete 20 Trade Empire missions.",
    condition: { kind: "trade_missions_complete", count: 20 },
    rewards: { guildXp: 400, treasuryCredits: 5000 },
    iconKey: "Compass",
  },
  {
    questKey: "weekly_conspiracy_solve",
    scope: "weekly",
    name: "Solve the Cipher",
    description: "Solve any Conspiracy Board.",
    condition: { kind: "conspiracy_board_solved" },
    rewards: { guildXp: 1000, treasuryDream: 2000, bannerKey: "banner_antiquarian" },
    iconKey: "BookOpen",
  },

  /* ─── SEASONAL (reset on pvpSeason boundaries) ─── */
  {
    questKey: "seasonal_member_diamond",
    scope: "seasonal",
    name: "Forge a Champion",
    description: "Have a member reach Diamond+ in any gameType.",
    condition: { kind: "member_reaches_tier", tier: 4, count: 1 },
    rewards: { guildXp: 5000, treasuryDream: 10000, bannerKey: "banner_seasonal_champion", titleKey: "iron_lion_t1" },
    iconKey: "Crown",
  },
  {
    questKey: "seasonal_war_contribution_10000",
    scope: "seasonal",
    name: "Standard Bearer",
    description: "Contribute 10,000 points to a Guild War.",
    condition: { kind: "guild_war_contribution", points: 10000 },
    rewards: { guildXp: 8000, bannerKey: "banner_standard_bearer", titleKey: "recruiter_t2" },
    iconKey: "Flag",
  },
  {
    questKey: "seasonal_pvp_wins_500",
    scope: "seasonal",
    name: "Legion of the Loredex",
    description: "Win 500 PvP card duels.",
    condition: { kind: "pvp_wins_total", gameType: "card_1v1", count: 500 },
    rewards: { guildXp: 10000, treasuryDream: 25000, bannerKey: "banner_legion" },
    iconKey: "Swords",
  },
];

const QUEST_BY_KEY = new Map<string, GuildQuestDef>(
  GUILD_QUESTS.map((q) => [q.questKey, q]),
);

export function getGuildQuest(questKey: string): GuildQuestDef | undefined {
  return QUEST_BY_KEY.get(questKey);
}

export function getGuildQuestsByScope(scope: GuildQuestScope): readonly GuildQuestDef[] {
  return GUILD_QUESTS.filter((q) => q.scope === scope);
}

/** Compute the numeric target for a quest condition. */
export function questTarget(cond: GuildQuestCondition): number {
  switch (cond.kind) {
    case "pvp_wins_total":
    case "card_duels_played":
    case "chess_wins":
    case "raid_clears":
    case "td_raid_wins":
    case "td_defenses":
    case "circuit_races":
    case "trade_missions_complete":
    case "conspiracy_clues_collected":
    case "any_pvp_match":
      return cond.count;
    case "conspiracy_board_solved":
      return 1;
    case "member_reaches_tier":
      return cond.count;
    case "guild_war_contribution":
      return cond.points;
  }
}
