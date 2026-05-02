/**
 * Title system core types.
 *
 * Discriminated-union conditions evaluated by titleUnlockService against
 * a `TitleProgressSnapshot`. Mirrors the
 * `expansionUnlockService` pattern: pure / serializable / no I/O.
 */

export type TitleRarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export type TitleCategory =
  | "pvp_rank"
  | "narrative"
  | "mystery"
  | "coop"
  | "faction_guild"
  | "cross_game"
  | "cosmetic_purchase"
  | "seasonal";

/**
 * `gameType` keys recognised across the unified competitive layer.
 * Tier 1 only emits `card_1v1` and `chess` events; later tiers add the rest.
 */
export type GameTypeKey =
  | "card_1v1"
  | "card_2v2"
  | "card_ffa"
  | "card_coop"
  | "chess"
  | "circuit_1v1"
  | "trade_oracle_duel"
  | "cades_async_1v1"
  | "td_raid"
  | "guild_skirmish";

/**
 * Discriminated union of every condition a title can be gated on.
 * Add new kinds as later tiers introduce new event sources; the
 * evaluator handles unknown kinds defensively by returning `false`.
 */
export type TitleUnlockCondition =
  // PvP rank-rooted
  | { kind: "pvp_rank_reached"; gameType: GameTypeKey; minTier: number }
  | { kind: "pvp_wins_total"; gameType?: GameTypeKey; count: number }
  | { kind: "pvp_team_wins"; count: number }
  | { kind: "pvp_ffa_wins"; count: number }
  | { kind: "pvp_season_finish_at"; minTier: number }
  // Co-op (raids and card co-op)
  | { kind: "coop_raid_clears"; bossKey?: string; count: number }
  | { kind: "coop_role_mastery"; role: "dps" | "tank" | "healer"; level: number }
  | { kind: "coop_party_continuity"; partySize: number; runs: number }
  | { kind: "coop_card_wins"; encounterKey?: string; count: number }
  // Narrative + LOREDEX
  | { kind: "loredex_discovered"; entityId: string }
  | { kind: "loredex_alignment_threshold"; alignment: string; threshold: number }
  | { kind: "act_completed"; act: 1 | 2 | 3 | 4 | 5 | 6 | 7 }
  | { kind: "secret_revealed"; act: 1 | 2 | 3 | 4 | 5 | 6 | 7 }
  // Mystery / Witnessing race (Tier 2B)
  | { kind: "mystery_solve_first"; boardKey: string }
  | { kind: "mystery_solve_any"; boardKey: string }
  | { kind: "kael_fragment_unlocked"; fragmentId: string }
  // Cross-game
  | { kind: "cross_game_dual_rank"; minTier: number; gameTypes: readonly GameTypeKey[] }
  // Guild (Tier 4)
  | { kind: "guild_war_won"; territoryKey?: string }
  | { kind: "guild_skirmish_won"; count: number }
  | { kind: "guild_hall_tier"; tier: number }
  // Apprentice Trial
  | { kind: "apprentice_trial_graduated"; count: number }
  | { kind: "apprentice_trial_attended"; count: number }
  // Battle pass (T9.17)
  | { kind: "battle_pass_tier_reached"; minTier: number }
  // Generic gates
  | { kind: "level_reached"; level: number }
  | { kind: "prestige_reached"; prestigeKey: string; level: number }
  | { kind: "entitlement_held"; entitlementKey: string };

export type TitleUnlockConditionKind = TitleUnlockCondition["kind"];

/**
 * Static title definition, declared in `titleDefinitions.ts`. Persists
 * to the `title_definitions` table via a seed at app start.
 */
export interface TitleDef {
  /** Globally unique key (e.g. "warlord_t2"). */
  readonly titleKey: string;
  /** Groups multi-tier progressions ("warlord", "antiquarian"). */
  readonly rootKey: string;
  /** 1, 2, 3 — same root, escalating prestige. */
  readonly tier: 1 | 2 | 3 | 4 | 5;
  /** Display name ("Warlord", "Conqueror of the Nexus"). */
  readonly name: string;
  /** Short description. */
  readonly description: string;
  /** Lore-flavored expanded text. */
  readonly flavorText?: string;
  readonly rarity: TitleRarity;
  readonly category: TitleCategory;
  /** Anchor entity from LOREDEX (DOC4). Optional. */
  readonly loredexEntityId?: string;
  /** Lucide icon key. */
  readonly iconKey: string;
  readonly condition: TitleUnlockCondition;
  /** Hidden until earned (no preview in catalog). */
  readonly hidden?: boolean;
  /**
   * Optional purchase metadata — only set for legacy
   * `cosmeticShop` titles migrated into this registry.
   */
  readonly purchasable?: {
    readonly currency: "dream" | "gems";
    readonly price: number;
    readonly requiredLevel?: number;
  };
}

/**
 * Snapshot consulted by every title-unlock evaluator. Each consumer
 * sources this from its own persistence (server: durable; client:
 * cached over tRPC).
 */
export interface TitleProgressSnapshot {
  readonly userId: number;
  /** Per-gameType current rank tier (0-6). Absent gameTypes default to 0. */
  readonly rankTiers: ReadonlyMap<GameTypeKey, number>;
  /** Per-gameType lifetime wins. Absent gameTypes default to 0. */
  readonly winsByGameType: ReadonlyMap<GameTypeKey, number>;
  /** Lifetime total wins across all gameTypes. */
  readonly totalWins: number;
  /** Best season placement per gameType (0 = unranked). */
  readonly bestSeasonTierByGameType: ReadonlyMap<GameTypeKey, number>;
  /** Co-op raid clears, optionally per-boss. */
  readonly coopRaidClears: ReadonlyMap<string, number>;
  /** Total raid clears regardless of boss. */
  readonly totalRaidClears: number;
  /** Per-role mastery levels (dps/tank/healer). */
  readonly coopRoleMastery: ReadonlyMap<string, number>;
  /** Largest party-continuity run length (consecutive raids with same N players). */
  readonly maxPartyContinuity: number;
  /** Card co-op encounter clears. */
  readonly coopCardWins: ReadonlyMap<string, number>;
  /** Discovered LOREDEX entity ids. */
  readonly loredexDiscovered: ReadonlySet<string>;
  /** Alignment scores per faction/path. */
  readonly alignmentScores: ReadonlyMap<string, number>;
  /** Acts the player has completed. */
  readonly completedActs: ReadonlySet<1 | 2 | 3 | 4 | 5 | 6 | 7>;
  /** Acts whose secret-reveal path the player has triggered. */
  readonly secretActsRevealed: ReadonlySet<1 | 2 | 3 | 4 | 5 | 6 | 7>;
  /** Conspiracy boards the player has solved (anywhere in the order). */
  readonly mysterySolved: ReadonlySet<string>;
  /** Conspiracy boards where the player was a first-discoverer. */
  readonly mysteryFirstSolved: ReadonlySet<string>;
  /** Kael Fragments unlocked. */
  readonly kaelFragmentsUnlocked: ReadonlySet<string>;
  /** Player level. */
  readonly level: number;
  /** Per-prestige-class levels. */
  readonly prestigeLevels: ReadonlyMap<string, number>;
  /** Held entitlements (founding_author, authors_edition_s2, etc). */
  readonly entitlements: ReadonlySet<string>;
  /** Guild context. */
  readonly guildWarsWon: number;
  readonly guildWarTerritoriesHeld: ReadonlySet<string>;
  readonly guildSkirmishWins: number;
  readonly guildHallTier: number;
  /** Apprentice Trial cohorts attended (any outcome). */
  readonly apprenticeTrialsAttended: number;
  /** Apprentice Trial cohorts graduated (sole survivor). */
  readonly apprenticeTrialsGraduated: number;
  /** Highest battle-pass tier reached this season. */
  readonly battlePassTier: number;
}

/** Empty snapshot — useful for tests + unauth flows. */
export const NULL_TITLE_PROGRESS_SNAPSHOT: TitleProgressSnapshot = Object.freeze({
  userId: 0,
  rankTiers: new Map(),
  winsByGameType: new Map(),
  totalWins: 0,
  bestSeasonTierByGameType: new Map(),
  coopRaidClears: new Map(),
  totalRaidClears: 0,
  coopRoleMastery: new Map(),
  maxPartyContinuity: 0,
  coopCardWins: new Map(),
  loredexDiscovered: new Set<string>(),
  alignmentScores: new Map(),
  completedActs: new Set<never>(),
  secretActsRevealed: new Set<never>(),
  mysterySolved: new Set<string>(),
  mysteryFirstSolved: new Set<string>(),
  kaelFragmentsUnlocked: new Set<string>(),
  level: 1,
  prestigeLevels: new Map(),
  entitlements: new Set<string>(),
  guildWarsWon: 0,
  guildWarTerritoriesHeld: new Set<string>(),
  guildSkirmishWins: 0,
  guildHallTier: 0,
  apprenticeTrialsAttended: 0,
  apprenticeTrialsGraduated: 0,
  battlePassTier: 0,
});

/**
 * Event payloads emitted by various PvP / narrative / co-op surfaces.
 * The title service subscribes to these and re-evaluates eligibility.
 * Discriminated by `kind` for exhaustive switch handling.
 */
export type TitleEvent =
  | { kind: "pvp_match_won"; userId: number; gameType: GameTypeKey; newTier: number; totalWins: number; season?: number }
  | { kind: "pvp_match_lost"; userId: number; gameType: GameTypeKey }
  | { kind: "pvp_season_ended"; userId: number; gameType: GameTypeKey; finalTier: number }
  | { kind: "coop_raid_cleared"; userId: number; bossKey: string; role: string; contribution: number; partyHash: string }
  | { kind: "coop_card_cleared"; userId: number; encounterKey: string }
  | { kind: "act_completed"; userId: number; act: 1 | 2 | 3 | 4 | 5 | 6 | 7 }
  | { kind: "secret_revealed"; userId: number; act: 1 | 2 | 3 | 4 | 5 | 6 | 7 }
  | { kind: "loredex_discovered"; userId: number; entityId: string }
  | { kind: "alignment_threshold_crossed"; userId: number; alignment: string; newScore: number }
  | { kind: "mystery_solved"; userId: number; boardKey: string; isFirstDiscoverer: boolean }
  | { kind: "kael_fragment_unlocked"; userId: number; fragmentId: string }
  | { kind: "guild_war_won"; userId: number; territoryKey: string }
  | { kind: "guild_skirmish_won"; userId: number }
  | { kind: "guild_hall_tier_reached"; userId: number; tier: number }
  | { kind: "level_changed"; userId: number; level: number }
  | { kind: "entitlement_granted"; userId: number; entitlementKey: string }
  | { kind: "apprentice_trial_completed"; userId: number; cohortNumber: number; graduated: boolean; daySurvived: number };

export type TitleEventKind = TitleEvent["kind"];
