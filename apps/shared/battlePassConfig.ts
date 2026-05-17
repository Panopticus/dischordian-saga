/* ═══════════════════════════════════════════════════════
   BATTLE PASS CONFIGURATION — Season Structure

   XP Curve: Variable per tier (not flat)
   - Tiers 1-10:  100 XP each (casual-friendly first week)
   - Tiers 11-25: 200 XP each
   - Tiers 26-40: 350 XP each
   - Tiers 41-49: 500 XP each
   - Tier 50:     750 XP (the final push)
   - Total: 15,750 XP across 50 tiers
   - ~40 days to complete at casual (400 XP/day)
   - Season length: 60 days

   Rewards: Free track (all players) + Premium track (500 Dream)
   Premium = cosmetic only. No stat advantages.

   Seasonal Theme: Driven by Living Universe pressure at season start.
   Highest community pressure determines season aesthetic.

   Integrates with:
   - pressureService (season theme from community behavior)
   - livingUniverseEvents.ts (event names, colors)
   - prestigeSystem.ts (prestige multiplier on XP gains)
   ═══════════════════════════════════════════════════════ */

/* ─── XP CURVE ─── */

/** XP required for each tier (1-indexed) */
export function getXpForTier(tier: number): number {
  if (tier <= 0) return 0;
  if (tier <= 10) return 100;
  if (tier <= 25) return 200;
  if (tier <= 40) return 350;
  if (tier <= 49) return 500;
  if (tier === 50) return 750;
  return 0; // Beyond tier 50
}

/** Cumulative XP needed to reach a given tier */
export function getCumulativeXpForTier(tier: number): number {
  let total = 0;
  for (let i = 1; i <= tier; i++) {
    total += getXpForTier(i);
  }
  return total;
}

/** Calculate tier from cumulative XP */
export function getTierFromXp(totalXp: number): number {
  let cumulative = 0;
  for (let tier = 1; tier <= 50; tier++) {
    cumulative += getXpForTier(tier);
    if (totalXp < cumulative) return tier - 1;
  }
  return 50; // Max tier
}

/** XP progress within current tier */
export function getTierProgress(totalXp: number): { tier: number; xpInTier: number; xpNeeded: number; percentage: number } {
  const tier = getTierFromXp(totalXp);
  if (tier >= 50) return { tier: 50, xpInTier: 0, xpNeeded: 0, percentage: 100 };
  const xpToCurrentTier = getCumulativeXpForTier(tier);
  const xpInTier = totalXp - xpToCurrentTier;
  const xpNeeded = getXpForTier(tier + 1);
  return { tier, xpInTier, xpNeeded, percentage: Math.round((xpInTier / xpNeeded) * 100) };
}

/** Total XP to complete the pass */
export const TOTAL_PASS_XP = getCumulativeXpForTier(50); // 15,750

export const SEASON_LENGTH_DAYS = 60;
export const MAX_TIER = 50;
export const PREMIUM_COST_DREAM = 500;

/* ─── XP SOURCES ─── */

export interface XpSource {
  id: string;
  label: string;
  xp: number;
  category: "daily" | "weekly" | "combat" | "social" | "exploration" | "civic";
  /** Max times per day (null = unlimited) */
  dailyCap?: number;
}

export const XP_SOURCES: XpSource[] = [
  // Daily quests: 3 × 50 = 150/day
  { id: "daily_quest", label: "Daily Quest Complete", xp: 50, category: "daily", dailyCap: 3 },
  // Weekly challenges: 3 × 100 = 300/week (~43/day)
  { id: "weekly_challenge", label: "Weekly Challenge Complete", xp: 100, category: "weekly", dailyCap: 3 },
  // Combat
  { id: "combat_win", label: "Combat Victory", xp: 10, category: "combat", dailyCap: 20 },
  { id: "pet_battle", label: "Pet Battle", xp: 10, category: "combat", dailyCap: 15 },
  // Social
  { id: "gift_sent", label: "Gift Sent to Player", xp: 15, category: "social", dailyCap: 5 },
  // Exploration
  { id: "lore_discovery", label: "New Loredex Entry", xp: 20, category: "exploration" },
  // Civic
  { id: "governance_vote", label: "Governance Vote Cast", xp: 25, category: "civic", dailyCap: 3 },
  // Bonus sources
  { id: "daily_brief_complete", label: "Daily Brief Completed", xp: 30, category: "daily", dailyCap: 1 },
  { id: "prestige_cycle", label: "Prestige Cycle", xp: 500, category: "exploration" },
  { id: "companion_evolution", label: "Companion Evolution", xp: 75, category: "social" },
];

export function getXpSource(id: string): XpSource | undefined {
  return XP_SOURCES.find(s => s.id === id);
}

/** Per-UTC-day XP-source ledger: day → sourceId → award count. */
export type DailyXpLedger = Record<string, Record<string, number>>;

/**
 * Balance F2 — pure daily-cap accounting. Given the persisted
 * ledger, decide whether one more award of `sourceId` on `utcDay`
 * is allowed under the source's declared `dailyCap`, and return the
 * next ledger to persist.
 *
 * The returned ledger is pruned to `utcDay` only — prior days are
 * irrelevant once the UTC day rolls over, so the stored blob stays
 * O(distinct sources today) instead of growing forever.
 *
 * `dailyCap === undefined` ⇒ unlimited source (always allowed); the
 * count is still tracked (cheap, and useful for analytics/UI).
 */
export function consumeDailyXpCap(
  ledger: DailyXpLedger | null | undefined,
  utcDay: string,
  sourceId: string,
  dailyCap: number | undefined,
): { allowed: boolean; ledger: DailyXpLedger } {
  const today: Record<string, number> = { ...(ledger?.[utcDay] ?? {}) };
  const used = today[sourceId] ?? 0;
  if (dailyCap !== undefined && used >= dailyCap) {
    return { allowed: false, ledger: { [utcDay]: today } };
  }
  today[sourceId] = used + 1;
  return { allowed: true, ledger: { [utcDay]: today } };
}

/** UTC calendar day (YYYY-MM-DD) for daily-cap bucketing. */
export function utcDayKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/* ─── REWARD TIERS ─── */

export interface TierReward {
  tier: number;
  free?: RewardItem;
  premium?: RewardItem;
}

export interface RewardItem {
  type: "dream" | "cosmetic" | "title" | "card_back" | "companion_skin" | "pet_accessory" |
        "loading_screen" | "legendary_cosmetic" | "companion" | "eidolon_accessory" | "card_pack";
  id: string;
  name: string;
  description: string;
  amount?: number;
  /** Whether this is a seasonal exclusive (goes away after season) */
  seasonal: boolean;
}

/** Generate reward tiers themed to a season */
export function generateSeasonRewards(seasonTheme: SeasonTheme): Record<string, { free?: Record<string, unknown>; premium?: Record<string, unknown> }> {
  const rewards: Record<string, { free?: Record<string, unknown>; premium?: Record<string, unknown> }> = {};
  const t = seasonTheme;

  for (let tier = 1; tier <= 50; tier++) {
    const free: Record<string, unknown> = {};
    const premium: Record<string, unknown> = {};

    // ─── FREE TRACK ───
    if (tier === 5) { free.dream = 50; free.type = "dream"; free.name = "50 Dream Tokens"; }
    if (tier === 10) { free.type = "loading_screen"; free.id = `season_${t.id}_loading`; free.name = `${t.name} Loading Screen`; free.seasonal = true; }
    if (tier === 15) { free.dream = 100; free.type = "dream"; free.name = "100 Dream Tokens"; }
    if (tier === 20) { free.type = "pet_accessory"; free.id = `season_${t.id}_pet`; free.name = `${t.name} Pet Accessory`; free.seasonal = true; }
    if (tier === 25) { free.dream = 200; free.type = "title"; free.id = `season_${t.id}_title`; free.name = t.freeTitle; free.seasonal = true; }
    if (tier === 30) { free.type = "card_back"; free.id = `season_${t.id}_back`; free.name = `${t.name} Card Back`; free.seasonal = true; }
    if (tier === 35) { free.dream = 300; free.type = "dream"; free.name = "300 Dream Tokens"; }
    if (tier === 40) { free.type = "companion_skin"; free.id = `season_${t.id}_skin`; free.name = `${t.name} Companion Skin`; free.seasonal = true; }
    if (tier === 45) { free.dream = 500; free.type = "dream"; free.name = "500 Dream Tokens"; }
    if (tier === 50) { free.type = "legendary_cosmetic"; free.id = `season_${t.id}_legendary`; free.name = t.legendaryReward; free.seasonal = true; free.title = t.legendaryTitle; }

    // Small XP bonus on even tiers without major rewards
    if (Object.keys(free).length === 0 && tier % 2 === 0) {
      free.xp = 50;
    }

    // ─── PREMIUM TRACK (cosmetic only) ───
    premium.dream = Math.floor(tier * 3); // Passive Dream drip

    if (tier % 5 === 0) {
      premium.type = "cosmetic";
      premium.id = `season_${t.id}_premium_${tier}`;
      premium.name = `${t.name} Premium Cosmetic (Tier ${tier})`;
      premium.seasonal = true;
    }
    if (tier === 25) { premium.type = "companion"; premium.id = `season_${t.id}_companion`; premium.name = t.premiumCompanion; premium.seasonal = true; }
    if (tier === 50) { premium.type = "eidolon_accessory"; premium.id = `season_${t.id}_eidolon`; premium.name = t.premiumEidolonAccessory; premium.seasonal = true; }

    rewards[String(tier)] = {
      free: Object.keys(free).length > 0 ? free : undefined,
      premium,
    };
  }

  return rewards;
}

/* ─── SEASONAL THEMES ─── */

export interface SeasonTheme {
  id: string;
  name: string;
  description: string;
  /** Which Living Universe pressure drove this theme */
  pressureSource: string;
  /** Color palette for UI theming */
  primaryColor: string;
  accentColor: string;
  /** Narrative hook — why this season exists */
  narrativeHook: string;
  /** Free track tier 25 title */
  freeTitle: string;
  /** Free track tier 50 legendary reward name */
  legendaryReward: string;
  /** Free track tier 50 title */
  legendaryTitle: string;
  /** Premium tier 25 companion name */
  premiumCompanion: string;
  /** Premium tier 50 Eidolon accessory name */
  premiumEidolonAccessory: string;
}

/** Season themes tied to Living Universe pressure types */
export const SEASONAL_THEMES: Record<string, SeasonTheme> = {
  necromancer: {
    id: "death_cycle",
    name: "Season of the Dead",
    description: "The community has been dying. The Necromancer stirs. Death-themed rewards and challenges.",
    pressureSource: "deaths",
    primaryColor: "#8b0000",
    accentColor: "#dc143c",
    narrativeHook: "The Resurrection Protocols hum louder. Every death feeds the cycle. This season, death is currency — and the Necromancer is collecting.",
    freeTitle: "Death Walker",
    legendaryReward: "Necromantic Aura",
    legendaryTitle: "Cycle Survivor",
    premiumCompanion: "Shade Wisp",
    premiumEidolonAccessory: "Skull Crown",
  },
  dreamer: {
    id: "hope_rising",
    name: "Season of Hope",
    description: "Community compassion has awakened something. Hope-themed rewards and peaceful challenges.",
    pressureSource: "trustGains",
    primaryColor: "#4a90d9",
    accentColor: "#87ceeb",
    narrativeHook: "The Dreamer stirs in response to your collective compassion. This season, bonds deepen and trust reveals hidden truths.",
    freeTitle: "Dream Keeper",
    legendaryReward: "Dreamer's Radiance",
    legendaryTitle: "Hope Ascendant",
    premiumCompanion: "Lucent Sprite",
    premiumEidolonAccessory: "Crystal Wings",
  },
  terminus: {
    id: "viral_tide",
    name: "Season of the Swarm",
    description: "Terminus pressure rising. Viral-themed survival challenges and contamination events.",
    pressureSource: "viralExposures",
    primaryColor: "#2d5016",
    accentColor: "#39ff14",
    narrativeHook: "The Thought Virus spreads. Terminus grows closer. This season tests your ability to resist — or embrace — the infection.",
    freeTitle: "Swarm Resistant",
    legendaryReward: "Viral Immunity Aura",
    legendaryTitle: "Terminus Defiant",
    premiumCompanion: "Spore Guardian",
    premiumEidolonAccessory: "Bio-Luminescent Shell",
  },
  timelines: {
    id: "convergence",
    name: "Season of Convergence",
    description: "Lore discovery has peaked. Timeline-themed exploration and revelation challenges.",
    pressureSource: "loreDiscoveries",
    primaryColor: "#b8860b",
    accentColor: "#ffd700",
    narrativeHook: "The Antiquarian opens the gates between timelines. This season, every discovery echoes across seven dimensions.",
    freeTitle: "Timeline Walker",
    legendaryReward: "Temporal Echo Aura",
    legendaryTitle: "Seven-Sealed Scholar",
    premiumCompanion: "Chrono Fragment",
    premiumEidolonAccessory: "Hourglass Mantle",
  },
  grand_edit: {
    id: "corruption",
    name: "Season of Shadows",
    description: "Betrayal and corruption rising. Shadow-themed deception and truth challenges.",
    pressureSource: "betrayals",
    primaryColor: "#4b0082",
    accentColor: "#8a2be2",
    narrativeHook: "The Shadow Tongue edits reality. This season, nothing is what it seems. Trust is a weapon — and a target.",
    freeTitle: "Truth Seeker",
    legendaryReward: "Unedited Aura",
    legendaryTitle: "Incorruptible",
    premiumCompanion: "Ink Phantom",
    premiumEidolonAccessory: "Shadow Quill Crown",
  },
};

/**
 * Determine season theme from current community pressure.
 * The highest pressure type drives the season's aesthetic.
 */
export function getSeasonThemeFromPressure(pressure: Record<string, number>): SeasonTheme {
  const mapping: Record<string, string> = {
    deaths: "necromancer",
    trustGains: "dreamer",
    viralExposures: "terminus",
    loreDiscoveries: "timelines",
    betrayals: "grand_edit",
  };

  let highestKey = "dreamer"; // Default to hope
  let highestValue = 0;
  for (const [key, themeKey] of Object.entries(mapping)) {
    const value = pressure[key] ?? 0;
    if (value > highestValue) {
      highestValue = value;
      highestKey = themeKey;
    }
  }

  return SEASONAL_THEMES[highestKey] ?? SEASONAL_THEMES.dreamer;
}
