/**
 * SEASONAL EVENTS SYSTEM
 * ══════════════════════════════════════════════════════════
 * Themed time-limited events with event tokens, event shop,
 * global objectives, and full RPG integration.
 *
 * RPG IMPACT:
 * - Class mastery → contribution multiplier per event type
 * - Species → elemental event bonuses
 * - Civil skills → crafting/gathering event efficiency
 * - Prestige classes → exclusive event tiers & rewards
 * - Talents → event-specific perks
 * - Achievement traits → passive token generation
 * - Morality → Machine vs Humanity event paths
 */

import type { CharacterClass } from "./classMastery";

/* ═══ EVENT TYPES ═══ */
export type EventCategory = "combat" | "gathering" | "crafting" | "exploration" | "lore" | "social";
export type EventRarity = "common" | "rare" | "legendary" | "mythic";

export interface SeasonalEventDef {
  key: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: EventCategory;
  /** Duration in days */
  durationDays: number;
  /** Token currency name for this event */
  tokenName: string;
  tokenIcon: string;
  /** Global objective */
  globalObjective: {
    description: string;
    targetAmount: number;
    rewardAll: { tokenName: string; amount: number };
  };
  /** Individual milestones */
  milestones: EventMilestone[];
  /** Shop items available during event */
  shopItems: EventShopItem[];
  /** Class that gets bonus contribution */
  bonusClass?: CharacterClass;
  /** Element theme */
  element?: string;
  /** Morality path */
  moralityPath?: "machine" | "humanity";
}

export interface EventMilestone {
  threshold: number;
  reward: { type: "token" | "cosmetic" | "card" | "xp" | "dream"; key: string; amount: number };
  label: string;
}

export interface EventShopItem {
  key: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  rarity: EventRarity;
  category: "cosmetic" | "consumable" | "card" | "decoration" | "title";
  /** Limited quantity per player */
  maxPurchases: number;
  /** Prestige class required */
  requiredPrestige?: string;
  /** Civil skill required */
  requiredCivilSkill?: { skill: string; level: number };
}

/* ═══ EVENT DEFINITIONS ═══ */
export const SEASONAL_EVENTS: SeasonalEventDef[] = [
  {
    key: "shadow_convergence",
    name: "The Shadow Convergence",
    description: "Dark energy floods the network. Panopticon agents are on high alert. Contribute shadow fragments to seal the rift before it consumes everything.",
    icon: "Eclipse",
    color: "#6d28d9",
    category: "combat",
    durationDays: 14,
    tokenName: "Shadow Fragment",
    tokenIcon: "Gem",
    bonusClass: "assassin",
    element: "shadow",
    moralityPath: "machine",
    globalObjective: {
      description: "Collect 1,000,000 Shadow Fragments across all operatives",
      targetAmount: 1_000_000,
      rewardAll: { tokenName: "Shadow Fragment", amount: 500 },
    },
    milestones: [
      { threshold: 100, reward: { type: "token", key: "shadow_fragment", amount: 50 }, label: "Shadow Initiate" },
      { threshold: 500, reward: { type: "xp", key: "xp", amount: 2000 }, label: "Rift Walker" },
      { threshold: 1500, reward: { type: "cosmetic", key: "shadow_aura", amount: 1 }, label: "Convergence Master" },
      { threshold: 5000, reward: { type: "card", key: "shadow_convergence_card", amount: 1 }, label: "Shadow Sovereign" },
    ],
    shopItems: [
      { key: "shadow_cloak_skin", name: "Shadow Cloak", description: "A cloak woven from convergence energy", icon: "Shirt", cost: 200, rarity: "rare", category: "cosmetic", maxPurchases: 1 },
      { key: "shadow_boost", name: "Shadow Boost", description: "+50% event contribution for 1 hour", icon: "Zap", cost: 50, rarity: "common", category: "consumable", maxPurchases: 10 },
      { key: "shadow_throne", name: "Shadow Throne", description: "A throne of pure darkness for your quarters", icon: "Crown", cost: 500, rarity: "legendary", category: "decoration", maxPurchases: 1, requiredPrestige: "shadow_broker" },
      { key: "void_walker_title", name: "Void Walker", description: "Exclusive title: Void Walker", icon: "Award", cost: 1000, rarity: "mythic", category: "title", maxPurchases: 1 },
    ],
  },
  {
    key: "chrono_harvest",
    name: "The Chrono Harvest",
    description: "Temporal rifts have scattered Chrono Seeds across all dimensions. Gather them before the timeline collapses.",
    icon: "Timer",
    color: "#0ea5e9",
    category: "gathering",
    durationDays: 10,
    tokenName: "Chrono Seed",
    tokenIcon: "Sprout",
    bonusClass: "oracle",
    element: "time",
    globalObjective: {
      description: "Harvest 500,000 Chrono Seeds before the timeline collapses",
      targetAmount: 500_000,
      rewardAll: { tokenName: "Chrono Seed", amount: 300 },
    },
    milestones: [
      { threshold: 50, reward: { type: "token", key: "chrono_seed", amount: 25 }, label: "Time Tender" },
      { threshold: 300, reward: { type: "xp", key: "xp", amount: 1500 }, label: "Chrono Gardener" },
      { threshold: 1000, reward: { type: "cosmetic", key: "chrono_wings", amount: 1 }, label: "Temporal Harvester" },
      { threshold: 3000, reward: { type: "dream", key: "dream", amount: 100 }, label: "Chrono Archon" },
    ],
    shopItems: [
      { key: "chrono_pet", name: "Temporal Sprite", description: "A tiny time spirit companion", icon: "Ghost", cost: 300, rarity: "rare", category: "cosmetic", maxPurchases: 1 },
      { key: "time_skip_scroll", name: "Time Skip Scroll", description: "Skip 1 hour of build time", icon: "ScrollText", cost: 100, rarity: "common", category: "consumable", maxPurchases: 5 },
      { key: "chrono_fountain", name: "Chrono Fountain", description: "A time-bending fountain for your quarters", icon: "Droplets", cost: 400, rarity: "legendary", category: "decoration", maxPurchases: 1, requiredCivilSkill: { skill: "architecture", level: 3 } },
    ],
  },
  {
    key: "forge_of_nations",
    name: "The Forge of Nations",
    description: "The great forges have been reignited. Craft weapons and armor to arm the resistance against the Panopticon.",
    icon: "Hammer",
    color: "#f59e0b",
    category: "crafting",
    durationDays: 12,
    tokenName: "Forge Ember",
    tokenIcon: "Flame",
    bonusClass: "engineer",
    element: "fire",
    moralityPath: "humanity",
    globalObjective: {
      description: "Forge 750,000 items to arm the resistance",
      targetAmount: 750_000,
      rewardAll: { tokenName: "Forge Ember", amount: 400 },
    },
    milestones: [
      { threshold: 75, reward: { type: "token", key: "forge_ember", amount: 30 }, label: "Apprentice Smith" },
      { threshold: 400, reward: { type: "xp", key: "xp", amount: 1800 }, label: "Master Forger" },
      { threshold: 1200, reward: { type: "cosmetic", key: "forge_hammer", amount: 1 }, label: "Forge Champion" },
      { threshold: 4000, reward: { type: "card", key: "forge_of_nations_card", amount: 1 }, label: "Forge Eternal" },
    ],
    shopItems: [
      { key: "ember_blade_skin", name: "Ember Blade", description: "A sword forged in event fire", icon: "Sword", cost: 250, rarity: "rare", category: "cosmetic", maxPurchases: 1 },
      { key: "forge_boost", name: "Forge Boost", description: "+30% crafting speed for 2 hours", icon: "Zap", cost: 75, rarity: "common", category: "consumable", maxPurchases: 8 },
      { key: "anvil_of_ages", name: "Anvil of Ages", description: "Legendary anvil decoration for quarters", icon: "Anvil", cost: 600, rarity: "legendary", category: "decoration", maxPurchases: 1 },
    ],
  },
  {
    key: "panopticon_infiltration",
    name: "Panopticon Infiltration",
    description: "A rare window has opened. Infiltrate the Panopticon's inner sanctum and extract classified intelligence.",
    icon: "Eye",
    color: "#ef4444",
    category: "exploration",
    durationDays: 7,
    tokenName: "Intel Chip",
    tokenIcon: "Cpu",
    bonusClass: "spy",
    element: "void",
    globalObjective: {
      description: "Extract 250,000 Intel Chips from the Panopticon",
      targetAmount: 250_000,
      rewardAll: { tokenName: "Intel Chip", amount: 200 },
    },
    milestones: [
      { threshold: 30, reward: { type: "token", key: "intel_chip", amount: 20 }, label: "Field Agent" },
      { threshold: 200, reward: { type: "xp", key: "xp", amount: 1200 }, label: "Deep Cover" },
      { threshold: 800, reward: { type: "cosmetic", key: "panopticon_badge", amount: 1 }, label: "Ghost Operative" },
      { threshold: 2500, reward: { type: "card", key: "panopticon_infiltration_card", amount: 1 }, label: "Shadow Director" },
    ],
    shopItems: [
      { key: "stealth_suit", name: "Stealth Suit", description: "Panopticon-grade stealth technology", icon: "Shield", cost: 350, rarity: "legendary", category: "cosmetic", maxPurchases: 1 },
      { key: "intel_decoder", name: "Intel Decoder", description: "+25% intel extraction rate", icon: "Key", cost: 60, rarity: "common", category: "consumable", maxPurchases: 10 },
    ],
  },
  {
    key: "lore_symposium",
    name: "The Lore Symposium",
    description: "Scholars from across dimensions gather to share forbidden knowledge. Write, discuss, and uncover hidden truths.",
    icon: "BookOpen",
    color: "#8b5cf6",
    category: "lore",
    durationDays: 14,
    tokenName: "Lore Scroll",
    tokenIcon: "ScrollText",
    bonusClass: "oracle",
    globalObjective: {
      description: "Write 100,000 words of lore collectively",
      targetAmount: 100_000,
      rewardAll: { tokenName: "Lore Scroll", amount: 250 },
    },
    milestones: [
      { threshold: 50, reward: { type: "token", key: "lore_scroll", amount: 20 }, label: "Scribe" },
      { threshold: 250, reward: { type: "xp", key: "xp", amount: 1500 }, label: "Chronicler" },
      { threshold: 750, reward: { type: "cosmetic", key: "scholar_robe", amount: 1 }, label: "Lore Master" },
      { threshold: 2000, reward: { type: "dream", key: "dream", amount: 150 }, label: "Grand Archivist" },
    ],
    shopItems: [
      { key: "quill_of_truth", name: "Quill of Truth", description: "A magical quill that enhances writing XP", icon: "Pen", cost: 200, rarity: "rare", category: "cosmetic", maxPurchases: 1 },
      { key: "ancient_bookshelf", name: "Ancient Bookshelf", description: "Quarters decoration: towering bookshelf", icon: "Library", cost: 350, rarity: "rare", category: "decoration", maxPurchases: 1 },
    ],
  },
  {
    key: "guild_war_tournament",
    name: "Guild War Tournament",
    description: "Syndicates clash in the ultimate tournament. Rally your guild and fight for supremacy.",
    icon: "Swords",
    color: "#dc2626",
    category: "social",
    durationDays: 7,
    tokenName: "War Medal",
    tokenIcon: "Medal",
    bonusClass: "soldier",
    element: "fire",
    globalObjective: {
      description: "Complete 50,000 guild battles across all syndicates",
      targetAmount: 50_000,
      rewardAll: { tokenName: "War Medal", amount: 150 },
    },
    milestones: [
      { threshold: 20, reward: { type: "token", key: "war_medal", amount: 15 }, label: "Recruit" },
      { threshold: 100, reward: { type: "xp", key: "xp", amount: 1000 }, label: "Veteran" },
      { threshold: 500, reward: { type: "cosmetic", key: "war_banner", amount: 1 }, label: "War Hero" },
      { threshold: 1500, reward: { type: "card", key: "guild_war_card", amount: 1 }, label: "Supreme Commander" },
    ],
    shopItems: [
      { key: "war_banner_deco", name: "War Banner", description: "Display your guild's war banner", icon: "Flag", cost: 300, rarity: "rare", category: "decoration", maxPurchases: 1 },
      { key: "battle_horn", name: "Battle Horn", description: "+20% guild battle contribution", icon: "Megaphone", cost: 80, rarity: "common", category: "consumable", maxPurchases: 5 },
    ],
  },
];

/* ═══ RPG CONTRIBUTION BONUSES ═══ */
const CLASS_EVENT_BONUSES: Record<string, { category: EventCategory; multiplier: number; label: string }> = {
  spy: { category: "exploration", multiplier: 0.30, label: "+30% exploration event contribution" },
  oracle: { category: "lore", multiplier: 0.25, label: "+25% lore event contribution" },
  assassin: { category: "combat", multiplier: 0.30, label: "+30% combat event contribution" },
  engineer: { category: "crafting", multiplier: 0.35, label: "+35% crafting event contribution" },
  soldier: { category: "social", multiplier: 0.25, label: "+25% social/war event contribution" },
};

const SPECIES_EVENT_BONUSES: Record<string, { element: string; multiplier: number }> = {
  quarchon: { element: "fire", multiplier: 0.15 },
  demagi: { element: "shadow", multiplier: 0.15 },
  neyon: { element: "time", multiplier: 0.15 },
  voxari: { element: "void", multiplier: 0.10 },
  human: { element: "fire", multiplier: 0.05 },
};

export interface EventContributionBonuses {
  contributionMultiplier: number;
  tokenBonusMultiplier: number;
  exclusiveShopAccess: boolean;
  sources: { source: string; label: string }[];
}

export function resolveEventBonuses(opts: {
  characterClass?: string;
  classRank?: number;
  species?: string;
  civilSkills?: Record<string, number>;
  talents?: string[];
  prestigeClass?: string;
  achievementTraits?: string[];
  moralityScore?: number;
  eventCategory?: EventCategory;
  eventElement?: string;
}): EventContributionBonuses {
  const b: EventContributionBonuses = {
    contributionMultiplier: 1.0,
    tokenBonusMultiplier: 1.0,
    exclusiveShopAccess: false,
    sources: [],
  };

  // Class bonus
  if (opts.characterClass && opts.classRank && opts.classRank >= 1) {
    const cb = CLASS_EVENT_BONUSES[opts.characterClass];
    if (cb && cb.category === opts.eventCategory) {
      b.contributionMultiplier += cb.multiplier;
      b.sources.push({ source: `${opts.characterClass} Class`, label: cb.label });
    }
  }

  // Species elemental bonus
  if (opts.species && opts.eventElement) {
    const sb = SPECIES_EVENT_BONUSES[opts.species];
    if (sb && sb.element === opts.eventElement) {
      b.contributionMultiplier += sb.multiplier;
      b.sources.push({ source: `${opts.species} Species`, label: `+${sb.multiplier * 100}% ${opts.eventElement} event bonus` });
    }
  }

  // Civil skills
  if (opts.civilSkills) {
    const gatheringLevel = opts.civilSkills["gathering"] || 0;
    if (gatheringLevel >= 3 && opts.eventCategory === "gathering") {
      b.contributionMultiplier += 0.10;
      b.sources.push({ source: "Gathering Skill", label: "+10% gathering event contribution" });
    }
    const craftingLevel = opts.civilSkills["craftsmanship"] || 0;
    if (craftingLevel >= 3 && opts.eventCategory === "crafting") {
      b.contributionMultiplier += 0.10;
      b.sources.push({ source: "Craftsmanship Skill", label: "+10% crafting event contribution" });
    }
    const loreLevel = opts.civilSkills["lore"] || 0;
    if (loreLevel >= 3 && opts.eventCategory === "lore") {
      b.contributionMultiplier += 0.15;
      b.sources.push({ source: "Lore Skill", label: "+15% lore event contribution" });
    }
  }

  // Prestige class
  if (opts.prestigeClass) {
    b.exclusiveShopAccess = true;
    b.tokenBonusMultiplier += 0.10;
    b.sources.push({ source: `${opts.prestigeClass} Prestige`, label: "+10% token bonus, exclusive shop access" });
  }

  // Achievement traits
  if (opts.achievementTraits && opts.achievementTraits.length >= 3) {
    b.contributionMultiplier += 0.05;
    b.sources.push({ source: "Achievement Traits", label: "+5% contribution from trait collection" });
  }

  // Morality path bonus
  if (opts.moralityScore !== undefined) {
    if (opts.moralityScore > 50) {
      b.contributionMultiplier += 0.05;
      b.sources.push({ source: "Humanity Path", label: "+5% contribution (Humanity alignment)" });
    } else if (opts.moralityScore < -50) {
      b.tokenBonusMultiplier += 0.10;
      b.sources.push({ source: "Machine Path", label: "+10% token bonus (Machine alignment)" });
    }
  }

  return b;
}

export function getActiveEvents(currentTime: number): SeasonalEventDef[] {
  // In production, this would check DB for active event windows
  // For now, return all events as available templates
  return SEASONAL_EVENTS;
}

export function getEventShopItems(event: SeasonalEventDef, opts: {
  prestigeClass?: string;
  civilSkills?: Record<string, number>;
}): EventShopItem[] {
  return event.shopItems.filter(item => {
    if (item.requiredPrestige && item.requiredPrestige !== opts.prestigeClass) return false;
    if (item.requiredCivilSkill) {
      const level = opts.civilSkills?.[item.requiredCivilSkill.skill] || 0;
      if (level < item.requiredCivilSkill.level) return false;
    }
    return true;
  });
}
