/**
 * Guild Perk definitions — Tier 4A.
 *
 * Passive bonuses that apply to every member of a guild that has
 * unlocked the perk. Tied to the 8 lore-flavored territories from
 * guildWars + new perks for clue drops, placement-match XP, etc.
 *
 * Definitions seed `guild_perks` at app start. Per-guild unlocks
 * live in `guild_unlocked_perks` keyed on (guildId, perkKey).
 */

export type GuildPerkBonusType =
  | "dream_pct"
  | "credits_pct"
  | "card_draw"
  | "xp_pct"
  | "craft_pct"
  | "rare_drop_pct"
  | "pvp_dmg_taken_pct"
  | "clue_drop_rate_pct"
  | "placement_xp_pct"
  | "raid_loot_pct"
  | "guild_war_score_pct";

export interface GuildPerkDef {
  readonly perkKey: string;
  readonly name: string;
  readonly description: string;
  readonly bonusType: GuildPerkBonusType;
  /** Magnitude — % for *_pct bonuses, flat for card_draw. */
  readonly magnitude: number;
  readonly requiredHallTier: number;
  readonly requiredXp: number;
  readonly factionAlignment?: "empire" | "insurgency" | "neutral";
  readonly iconKey: string;
  /** Lore-anchored flavor text. */
  readonly flavorText?: string;
}

export const GUILD_PERKS: readonly GuildPerkDef[] = [
  /* ─── Tier 1 hall (always-on starter perks) ─── */
  {
    perkKey: "panopticon_relay",
    name: "Panopticon Relay",
    description: "+5% Dream tokens earned by guild members.",
    bonusType: "dream_pct",
    magnitude: 5,
    requiredHallTier: 1,
    requiredXp: 0,
    iconKey: "Eye",
    flavorText: "The watchers watch each other now.",
  },
  {
    perkKey: "iron_lions_drill",
    name: "Iron Lion's Drill",
    description: "+10% PvP placement-match XP for the first 5 ranked games.",
    bonusType: "placement_xp_pct",
    magnitude: 10,
    requiredHallTier: 1,
    requiredXp: 0,
    factionAlignment: "insurgency",
    iconKey: "Shield",
    flavorText: "Year 632. Mechronis. The drill remains.",
  },
  /* ─── Tier 2 hall ─── */
  {
    perkKey: "antiquarians_library",
    name: "Antiquarian's Library",
    description: "+5% Conspiracy clue drop rate from every PvP source.",
    bonusType: "clue_drop_rate_pct",
    magnitude: 5,
    requiredHallTier: 2,
    requiredXp: 1000,
    iconKey: "BookOpen",
    flavorText: "Forty-three names. Every night.",
  },
  {
    perkKey: "trade_caravan_escort",
    name: "Trade Caravan Escort",
    description: "+15% credits earned from Trade Empire missions.",
    bonusType: "credits_pct",
    magnitude: 15,
    requiredHallTier: 2,
    requiredXp: 1500,
    iconKey: "Compass",
  },
  {
    perkKey: "oracles_blessing",
    name: "Oracle's Blessing",
    description: "+1 starting card draw in every PvP card duel.",
    bonusType: "card_draw",
    magnitude: 1,
    requiredHallTier: 2,
    requiredXp: 2000,
    factionAlignment: "neutral",
    iconKey: "Sparkles",
    flavorText: "What you see, you see first.",
  },
  /* ─── Tier 3 hall ─── */
  {
    perkKey: "necromancers_pact",
    name: "Necromancer's Pact",
    description: "+10% damage in card duels.",
    bonusType: "rare_drop_pct",
    magnitude: 10,
    requiredHallTier: 3,
    requiredXp: 4000,
    iconKey: "Heart",
  },
  {
    perkKey: "architects_workshop",
    name: "Architect's Workshop",
    description: "+15% craft bonus for guild members.",
    bonusType: "craft_pct",
    magnitude: 15,
    requiredHallTier: 3,
    requiredXp: 4500,
    factionAlignment: "empire",
    iconKey: "Building",
  },
  {
    perkKey: "raid_efficiency",
    name: "Raid Efficiency",
    description: "+10% loot from co-op raid clears.",
    bonusType: "raid_loot_pct",
    magnitude: 10,
    requiredHallTier: 3,
    requiredXp: 5000,
    iconKey: "Heart",
  },
  /* ─── Tier 4 hall ─── */
  {
    perkKey: "enigma_vault_resilience",
    name: "Enigma Vault Resilience",
    description: "-10% PvP damage taken on the first turn of every match.",
    bonusType: "pvp_dmg_taken_pct",
    magnitude: -10,
    requiredHallTier: 4,
    requiredXp: 8000,
    iconKey: "Lock",
  },
  {
    perkKey: "source_nexus_attunement",
    name: "Source Nexus Attunement",
    description: "+10% rare drop rate across every gameType.",
    bonusType: "rare_drop_pct",
    magnitude: 10,
    requiredHallTier: 4,
    requiredXp: 9000,
    iconKey: "Zap",
  },
  /* ─── Tier 5 hall (legendary) ─── */
  {
    perkKey: "iron_lion_citadel",
    name: "Iron Lion Citadel",
    description: "+20% XP and +1 guild-war contribution multiplier.",
    bonusType: "xp_pct",
    magnitude: 20,
    requiredHallTier: 5,
    requiredXp: 15000,
    factionAlignment: "insurgency",
    iconKey: "Crown",
    flavorText: "Defiant of empires. Heart of the resistance.",
  },
  {
    perkKey: "panopticon_core_command",
    name: "Panopticon Core Command",
    description: "+25% Guild War contribution score across all activities.",
    bonusType: "guild_war_score_pct",
    magnitude: 25,
    requiredHallTier: 5,
    requiredXp: 18000,
    factionAlignment: "empire",
    iconKey: "Eye",
    flavorText: "Every breath. Every heartbeat. Every move.",
  },
];

const PERK_BY_KEY = new Map<string, GuildPerkDef>(
  GUILD_PERKS.map((p) => [p.perkKey, p]),
);

export function getGuildPerk(perkKey: string): GuildPerkDef | undefined {
  return PERK_BY_KEY.get(perkKey);
}

/** Apply a list of unlocked perks to a base amount. Returns the
 *  modified amount (never below zero). Used by every reward path. */
export function applyGuildPerks(
  baseAmount: number,
  bonusType: GuildPerkBonusType,
  unlockedPerkKeys: readonly string[],
): number {
  let pctMod = 0;
  let flatMod = 0;
  for (const key of unlockedPerkKeys) {
    const perk = PERK_BY_KEY.get(key);
    if (!perk || perk.bonusType !== bonusType) continue;
    if (perk.bonusType === "card_draw") {
      flatMod += perk.magnitude;
    } else {
      pctMod += perk.magnitude;
    }
  }
  const result = baseAmount * (1 + pctMod / 100) + flatMod;
  return Math.max(0, Math.round(result));
}

/** Get every perk a guild qualifies for at a given hall tier + XP. */
export function getQualifyingPerks(
  hallTier: number,
  guildXp: number,
  factionAlignment?: "empire" | "insurgency" | "neutral",
): readonly GuildPerkDef[] {
  return GUILD_PERKS.filter((p) => {
    if (p.requiredHallTier > hallTier) return false;
    if (p.requiredXp > guildXp) return false;
    if (p.factionAlignment && factionAlignment && p.factionAlignment !== factionAlignment) {
      return false;
    }
    return true;
  });
}
