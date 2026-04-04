/* ═══════════════════════════════════════════════════════
   EPOCH PASS — Seasonal Battle Pass System

   50-tier reward track (free + premium) that rotates
   every 4 weeks as an "Epoch Season." Drives daily
   engagement through XP-gated tiers with escalating rewards.

   Inspired by: Fortnite Battle Pass, Genshin Blessing,
   Marvel Snap Season Pass, Clash Royale Pass Royale

   Revenue: Premium pass at $4.99/season (~$60/year)
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export interface EpochSeason {
  id: string;
  name: string;
  subtitle: string;
  /** Season lore — what narrative event does this season represent? */
  loreContext: string;
  /** Start/end dates */
  startsAt: string; // ISO date
  endsAt: string;
  /** Duration in days */
  durationDays: number;
  /** Theme color */
  color: string;
  /** Associated NPC (featured this season) */
  featuredNPC: string;
  /** XP required per tier */
  xpPerTier: number;
  /** Tiers */
  tiers: EpochTier[];
}

export interface EpochTier {
  tier: number;
  /** XP threshold (cumulative) */
  xpRequired: number;
  /** Free track reward */
  freeReward: EpochReward;
  /** Premium track reward (null = free tier only) */
  premiumReward: EpochReward | null;
}

export interface EpochReward {
  type: "dream" | "salvage" | "void_crystals" | "influence" | "card_pack" | "equipment" | "cosmetic" | "title" | "ship_theme" | "xp_boost" | "card" | "materials";
  id?: string;
  amount?: number;
  name: string;
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
  description: string;
}

/* ─── SEASON TEMPLATE ─── */

/**
 * Generate a season's 50-tier reward track.
 * Free track: resources every tier, cards/equipment at milestones.
 * Premium track: cosmetics, exclusive cards, ship themes, titles.
 */
function generateSeasonTiers(xpPerTier: number): EpochTier[] {
  const tiers: EpochTier[] = [];

  for (let i = 1; i <= 50; i++) {
    const xp = i * xpPerTier;

    // Free track — escalating resources with milestone rewards
    let freeReward: EpochReward;
    if (i % 10 === 0) {
      // Milestone tiers: card packs
      freeReward = { type: "card_pack", name: `Epoch Pack (Tier ${i})`, rarity: i >= 40 ? "epic" : i >= 20 ? "rare" : "uncommon", description: `Season milestone card pack` };
    } else if (i % 5 === 0) {
      // Every 5: void crystals
      freeReward = { type: "void_crystals", amount: 5 + Math.floor(i / 10) * 5, name: `${5 + Math.floor(i / 10) * 5} Void Crystals`, description: "Rare endgame material" };
    } else if (i % 3 === 0) {
      // Every 3: salvage
      freeReward = { type: "salvage", amount: 20 + i * 2, name: `${20 + i * 2} Salvage`, description: "Building material" };
    } else {
      // Default: dream tokens
      freeReward = { type: "dream", amount: 10 + i, name: `${10 + i} Dream`, description: "Premium currency" };
    }

    // Premium track — cosmetics and exclusives at key tiers
    let premiumReward: EpochReward | null = null;
    if (i === 1) {
      premiumReward = { type: "xp_boost", amount: 10, name: "Season XP Boost +10%", description: "Earn 10% more XP for the duration of this season" };
    } else if (i === 5) {
      premiumReward = { type: "cosmetic", id: "season_avatar_frame", name: "Season Avatar Frame", rarity: "rare", description: "Exclusive season border for your portrait" };
    } else if (i === 10) {
      premiumReward = { type: "card", id: "season_card_10", name: "Season Character Card", rarity: "rare", description: "Exclusive card featuring this season's NPC" };
    } else if (i === 15) {
      premiumReward = { type: "equipment", id: "season_helm_15", name: "Epoch Helm", rarity: "rare", description: "Season-exclusive helmet with unique visual" };
    } else if (i === 20) {
      premiumReward = { type: "cosmetic", id: "season_emote", name: "Season Emote", rarity: "epic", description: "Exclusive animated emote" };
    } else if (i === 25) {
      premiumReward = { type: "ship_theme", id: "season_theme_25", name: "Season Ship Theme", rarity: "epic", description: "Exclusive ship visual theme for this season" };
    } else if (i === 30) {
      premiumReward = { type: "card", id: "season_card_30", name: "Season Epic Card", rarity: "epic", description: "Powerful exclusive card" };
    } else if (i === 35) {
      premiumReward = { type: "equipment", id: "season_weapon_35", name: "Epoch Blade", rarity: "epic", description: "Season-exclusive weapon" };
    } else if (i === 40) {
      premiumReward = { type: "title", id: "season_title_40", name: "Season Title", description: "Display this season's exclusive title" };
    } else if (i === 45) {
      premiumReward = { type: "card", id: "season_card_45", name: "Season Legendary Card", rarity: "legendary", description: "Ultra-rare season exclusive" };
    } else if (i === 50) {
      premiumReward = { type: "cosmetic", id: "season_skin_50", name: "Season Legendary Skin", rarity: "legendary", description: "The ultimate season reward — exclusive animated character skin" };
    } else if (i % 5 === 0) {
      premiumReward = { type: "dream", amount: 50 + i * 2, name: `${50 + i * 2} Dream (Premium)`, description: "Bonus premium currency" };
    } else if (i % 2 === 0) {
      premiumReward = { type: "materials", amount: 3, name: "Premium Materials Bundle", description: "Crafting materials pack" };
    }

    tiers.push({ tier: i, xpRequired: xp, freeReward, premiumReward });
  }

  return tiers;
}

/* ─── SEASON DEFINITIONS ─── */

export const EPOCH_SEASONS: EpochSeason[] = [
  {
    id: "season_1_fall",
    name: "THE FALL",
    subtitle: "Season 1",
    loreContext: "The Thought Virus spreads. Terminus approaches. The Source calls to every Ark that passes close enough to hear. This season, your choices determine whether the Ark resists or succumbs.",
    startsAt: "2026-04-01",
    endsAt: "2026-04-28",
    durationDays: 28,
    color: "#FF3C40",
    featuredNPC: "the_source",
    xpPerTier: 100,
    tiers: generateSeasonTiers(100),
  },
  {
    id: "season_2_insurgency",
    name: "DEAD SIGNAL",
    subtitle: "Season 2",
    loreContext: "Agent Zero's signal grows stronger. The Insurgency isn't dead — it was hiding. Someone on this Ark is broadcasting on a dead operative's frequency. This season, uncover the truth behind the signal.",
    startsAt: "2026-04-29",
    endsAt: "2026-05-26",
    durationDays: 28,
    color: "#FF6600",
    featuredNPC: "agent_zero",
    xpPerTier: 110,
    tiers: generateSeasonTiers(110),
  },
  {
    id: "season_3_new_babylon",
    name: "THE PRICE",
    subtitle: "Season 3",
    loreContext: "Adjudicator Locke extends New Babylon's reach to Ark 1047. Everything has a price — even freedom. This season, navigate the corrupt trade networks and decide what you're willing to sell.",
    startsAt: "2026-05-27",
    endsAt: "2026-06-23",
    durationDays: 28,
    color: "#E040FB",
    featuredNPC: "adjudicator_locke",
    xpPerTier: 120,
    tiers: generateSeasonTiers(120),
  },
  {
    id: "season_4_hierarchy",
    name: "THE EDITOR",
    subtitle: "Season 4",
    loreContext: "The Shadow Tongue reveals itself. Ship records are rewritten in real-time. Truth becomes indistinguishable from lies. This season, fight for the integrity of reality itself.",
    startsAt: "2026-06-24",
    endsAt: "2026-07-21",
    durationDays: 28,
    color: "#6366F1",
    featuredNPC: "shadow_tongue",
    xpPerTier: 130,
    tiers: generateSeasonTiers(130),
  },
];

/* ─── HELPERS ─── */

export function getCurrentSeason(): EpochSeason | null {
  const now = new Date().toISOString().slice(0, 10);
  return EPOCH_SEASONS.find(s => s.startsAt <= now && s.endsAt >= now) || null;
}

export function getSeasonProgress(totalXp: number, season: EpochSeason): {
  currentTier: number;
  xpIntoTier: number;
  xpNeededForNext: number;
  percentComplete: number;
} {
  let currentTier = 0;
  for (const tier of season.tiers) {
    if (totalXp >= tier.xpRequired) currentTier = tier.tier;
    else break;
  }
  const currentTierXp = currentTier > 0 ? season.tiers[currentTier - 1].xpRequired : 0;
  const nextTierXp = currentTier < 50 ? season.tiers[currentTier].xpRequired : currentTierXp;
  return {
    currentTier,
    xpIntoTier: totalXp - currentTierXp,
    xpNeededForNext: nextTierXp - currentTierXp,
    percentComplete: Math.round((currentTier / 50) * 100),
  };
}

export function getUnclaimedRewards(
  currentTier: number,
  claimedTiers: number[],
  isPremium: boolean,
  season: EpochSeason,
): EpochTier[] {
  return season.tiers.filter(t =>
    t.tier <= currentTier &&
    !claimedTiers.includes(t.tier) &&
    (t.freeReward || (isPremium && t.premiumReward))
  );
}

export function getSeasonTimeRemaining(season: EpochSeason): { days: number; hours: number; expired: boolean } {
  const now = Date.now();
  const end = new Date(season.endsAt).getTime();
  const diff = end - now;
  if (diff <= 0) return { days: 0, hours: 0, expired: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    expired: false,
  };
}
