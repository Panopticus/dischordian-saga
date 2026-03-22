/**
 * SYNDICATE WORLDS — Guild Capital System
 * ────────────────────────────────────────
 * Each guild (syndicate) controls a homeworld that serves as their capital.
 * Buildings generate resources, provide guild-wide bonuses, and can be raided.
 * 
 * RPG INTEGRATION:
 * - Class Mastery: Determines which buildings can be constructed and their efficiency
 * - Species Traits: Provide passive bonuses to specific building types
 * - Citizen Talents: Unlock special building upgrades and capital perks
 * - Civil Skills: Leadership affects build speed, Craftsmanship reduces costs
 * - Prestige Classes: Unlock ultimate capital structures
 * - Elemental Combos: Adjacent elemental buildings create synergy bonuses
 * - Companion Synergies: Stationed companions provide aura effects
 * - Achievement Traits: Passive bonuses to all capital operations
 */

import type { CharacterClass } from "./classMastery";

/* ═══════════════════════════════════════════════════════
   WORLD TYPES — Each faction has a unique world aesthetic
   ═══════════════════════════════════════════════════════ */

export type WorldBiome = "forge_world" | "shadow_realm" | "crystal_spire" | "void_nexus" | "eden_prime";

export interface WorldType {
  key: WorldBiome;
  name: string;
  description: string;
  faction: "empire" | "insurgency" | "neutral";
  icon: string;
  color: string;
  /** Passive resource bonus */
  resourceBonus: { resource: ResourceType; multiplier: number };
  /** Defense terrain modifier */
  defenseModifier: number;
  /** Grid size (NxN) */
  gridSize: number;
  /** Max building slots */
  maxBuildings: number;
}

export const WORLD_TYPES: WorldType[] = [
  {
    key: "forge_world",
    name: "Forge World",
    description: "An industrial powerhouse of molten metal and automated foundries. Empire stronghold.",
    faction: "empire",
    icon: "Factory",
    color: "#dc2626",
    resourceBonus: { resource: "alloy", multiplier: 1.25 },
    defenseModifier: 1.15,
    gridSize: 8,
    maxBuildings: 20,
  },
  {
    key: "shadow_realm",
    name: "Shadow Realm",
    description: "A hidden world cloaked in perpetual twilight. Insurgency haven.",
    faction: "insurgency",
    icon: "Moon",
    color: "#6366f1",
    resourceBonus: { resource: "dark_matter", multiplier: 1.25 },
    defenseModifier: 1.20,
    gridSize: 8,
    maxBuildings: 18,
  },
  {
    key: "crystal_spire",
    name: "Crystal Spire",
    description: "A world of crystalline towers channeling cosmic energy. Neutral beacon.",
    faction: "neutral",
    icon: "Gem",
    color: "#8b5cf6",
    resourceBonus: { resource: "crystal", multiplier: 1.30 },
    defenseModifier: 1.10,
    gridSize: 8,
    maxBuildings: 22,
  },
  {
    key: "void_nexus",
    name: "Void Nexus",
    description: "A world at the intersection of dimensions. Unstable but powerful.",
    faction: "neutral",
    icon: "Orbit",
    color: "#06b6d4",
    resourceBonus: { resource: "void_essence", multiplier: 1.35 },
    defenseModifier: 1.05,
    gridSize: 10,
    maxBuildings: 24,
  },
  {
    key: "eden_prime",
    name: "Eden Prime",
    description: "A lush paradise world with abundant natural resources. Highly contested.",
    faction: "neutral",
    icon: "TreePine",
    color: "#10b981",
    resourceBonus: { resource: "biomass", multiplier: 1.20 },
    defenseModifier: 1.00,
    gridSize: 8,
    maxBuildings: 25,
  },
];

/* ═══════════════════════════════════════════════════════
   RESOURCES
   ═══════════════════════════════════════════════════════ */

export type ResourceType = "alloy" | "crystal" | "dark_matter" | "void_essence" | "biomass" | "dream_tokens" | "credits";

export interface ResourceRate {
  resource: ResourceType;
  baseRate: number; // per hour
}

/* ═══════════════════════════════════════════════════════
   BUILDINGS — Constructable structures for the capital
   ═══════════════════════════════════════════════════════ */

export type BuildingCategory = "resource" | "defense" | "utility" | "military" | "research" | "prestige";

export interface BuildingDef {
  key: string;
  name: string;
  description: string;
  category: BuildingCategory;
  icon: string;
  color: string;
  /** Max level for this building */
  maxLevel: number;
  /** Base cost to construct (level 1) */
  baseCost: Record<string, number>;
  /** Cost multiplier per level */
  costMultiplier: number;
  /** Time to build in minutes (level 1) */
  baseBuildTime: number;
  /** Resource production per hour (if resource building) */
  production?: ResourceRate[];
  /** Defense value added */
  defenseValue?: number;
  /** Guild-wide bonus */
  guildBonus?: { target: string; value: number; label: string };
  /** Required class mastery to unlock */
  requiredClass?: CharacterClass;
  /** Required class mastery rank */
  requiredClassRank?: number;
  /** Required prestige class */
  requiredPrestige?: string;
  /** Required citizen level */
  requiredLevel?: number;
  /** Element affinity (for elemental synergy) */
  element?: string;
  /** Size on grid (1x1, 2x2, etc.) */
  gridSize: [number, number];
}

export const BUILDINGS: BuildingDef[] = [
  /* ─── RESOURCE BUILDINGS ─── */
  {
    key: "alloy_foundry",
    name: "Alloy Foundry",
    description: "Smelts raw ore into refined alloys. Engineer class boosts output by 20%.",
    category: "resource",
    icon: "Flame",
    color: "#ef4444",
    maxLevel: 10,
    baseCost: { credits: 500, alloy: 50 },
    costMultiplier: 1.5,
    baseBuildTime: 30,
    production: [{ resource: "alloy", baseRate: 10 }],
    requiredClass: "engineer",
    requiredClassRank: 1,
    element: "fire",
    gridSize: [2, 2],
  },
  {
    key: "crystal_harvester",
    name: "Crystal Harvester",
    description: "Extracts crystalline energy from the world's core. Mystic class boosts output by 20%.",
    category: "resource",
    icon: "Gem",
    color: "#8b5cf6",
    maxLevel: 10,
    baseCost: { credits: 500, crystal: 50 },
    costMultiplier: 1.5,
    baseBuildTime: 30,
    production: [{ resource: "crystal", baseRate: 10 }],
    requiredClass: "oracle",
    requiredClassRank: 1,
    element: "void",
    gridSize: [2, 2],
  },
  {
    key: "dark_matter_extractor",
    name: "Dark Matter Extractor",
    description: "Harvests dark matter from dimensional rifts. Spy class boosts output by 20%.",
    category: "resource",
    icon: "Atom",
    color: "#6366f1",
    maxLevel: 10,
    baseCost: { credits: 600, dark_matter: 30 },
    costMultiplier: 1.6,
    baseBuildTime: 45,
    production: [{ resource: "dark_matter", baseRate: 8 }],
    requiredClass: "spy",
    requiredClassRank: 1,
    element: "shadow",
    gridSize: [2, 2],
  },
  {
    key: "bio_dome",
    name: "Bio-Dome",
    description: "Cultivates organic matter for trade and crafting. Diplomat class boosts output by 20%.",
    category: "resource",
    icon: "TreePine",
    color: "#10b981",
    maxLevel: 10,
    baseCost: { credits: 400, biomass: 60 },
    costMultiplier: 1.4,
    baseBuildTime: 25,
    production: [{ resource: "biomass", baseRate: 12 }],
    element: "nature",
    gridSize: [2, 2],
  },
  {
    key: "dream_well",
    name: "Dream Well",
    description: "Channels the collective unconscious into Dream Tokens. Oracle class boosts output by 25%.",
    category: "resource",
    icon: "Sparkles",
    color: "#fbbf24",
    maxLevel: 8,
    baseCost: { credits: 1000, crystal: 100, void_essence: 50 },
    costMultiplier: 1.8,
    baseBuildTime: 60,
    production: [{ resource: "dream_tokens", baseRate: 5 }],
    requiredClass: "oracle",
    requiredClassRank: 2,
    element: "light",
    gridSize: [2, 2],
  },
  {
    key: "void_siphon",
    name: "Void Siphon",
    description: "Draws raw void essence from between dimensions. Dangerous but lucrative.",
    category: "resource",
    icon: "Zap",
    color: "#06b6d4",
    maxLevel: 8,
    baseCost: { credits: 800, void_essence: 40, dark_matter: 40 },
    costMultiplier: 1.7,
    baseBuildTime: 50,
    production: [{ resource: "void_essence", baseRate: 6 }],
    element: "void",
    gridSize: [2, 2],
  },

  /* ─── DEFENSE BUILDINGS ─── */
  {
    key: "plasma_turret",
    name: "Plasma Turret",
    description: "Anti-raid defense turret. Soldier class increases damage by 25%.",
    category: "defense",
    icon: "Crosshair",
    color: "#dc2626",
    maxLevel: 10,
    baseCost: { credits: 300, alloy: 80 },
    costMultiplier: 1.5,
    baseBuildTime: 20,
    defenseValue: 50,
    requiredClass: "soldier",
    requiredClassRank: 1,
    element: "fire",
    gridSize: [1, 1],
  },
  {
    key: "shield_generator",
    name: "Shield Generator",
    description: "Projects an energy shield over nearby buildings. Engineer class extends range.",
    category: "defense",
    icon: "Shield",
    color: "#3b82f6",
    maxLevel: 8,
    baseCost: { credits: 600, crystal: 100, alloy: 50 },
    costMultiplier: 1.6,
    baseBuildTime: 40,
    defenseValue: 100,
    requiredClass: "engineer",
    requiredClassRank: 2,
    element: "lightning",
    gridSize: [2, 2],
  },
  {
    key: "shadow_mine",
    name: "Shadow Mine",
    description: "Invisible explosive trap. Assassin class doubles damage.",
    category: "defense",
    icon: "AlertTriangle",
    color: "#475569",
    maxLevel: 6,
    baseCost: { credits: 200, dark_matter: 40 },
    costMultiplier: 1.4,
    baseBuildTime: 15,
    defenseValue: 75,
    requiredClass: "assassin",
    requiredClassRank: 1,
    element: "shadow",
    gridSize: [1, 1],
  },
  {
    key: "void_wall",
    name: "Void Wall",
    description: "Dimensional barrier that slows raiders. Higher levels increase slow effect.",
    category: "defense",
    icon: "Square",
    color: "#6366f1",
    maxLevel: 8,
    baseCost: { credits: 250, void_essence: 30 },
    costMultiplier: 1.3,
    baseBuildTime: 10,
    defenseValue: 30,
    element: "void",
    gridSize: [1, 1],
  },
  {
    key: "nexus_cannon",
    name: "Nexus Cannon",
    description: "Ultimate defense weapon. Requires Warlord prestige class.",
    category: "defense",
    icon: "Target",
    color: "#f59e0b",
    maxLevel: 5,
    baseCost: { credits: 2000, alloy: 200, crystal: 200, void_essence: 100 },
    costMultiplier: 2.0,
    baseBuildTime: 120,
    defenseValue: 300,
    requiredPrestige: "warlord",
    element: "fire",
    gridSize: [3, 3],
  },

  /* ─── UTILITY BUILDINGS ─── */
  {
    key: "command_center",
    name: "Command Center",
    description: "Central hub. Increases max buildings by 3. One per world.",
    category: "utility",
    icon: "Building",
    color: "#f59e0b",
    maxLevel: 5,
    baseCost: { credits: 1000, alloy: 100, crystal: 100 },
    costMultiplier: 2.0,
    baseBuildTime: 60,
    guildBonus: { target: "max_buildings", value: 3, label: "+3 building slots per level" },
    gridSize: [3, 3],
  },
  {
    key: "trade_hub",
    name: "Trade Hub",
    description: "Enables inter-guild trading. Negotiation civil skill reduces fees.",
    category: "utility",
    icon: "ArrowLeftRight",
    color: "#f59e0b",
    maxLevel: 5,
    baseCost: { credits: 800, biomass: 80 },
    costMultiplier: 1.6,
    baseBuildTime: 45,
    guildBonus: { target: "trade_fee_reduction", value: 0.05, label: "5% trade fee reduction per level" },
    gridSize: [2, 2],
  },
  {
    key: "barracks",
    name: "Barracks",
    description: "Trains raid troops. Soldier class increases troop quality.",
    category: "military",
    icon: "Swords",
    color: "#dc2626",
    maxLevel: 8,
    baseCost: { credits: 500, alloy: 60 },
    costMultiplier: 1.5,
    baseBuildTime: 30,
    guildBonus: { target: "raid_troop_capacity", value: 5, label: "+5 raid troops per level" },
    requiredClass: "soldier",
    requiredClassRank: 1,
    gridSize: [2, 2],
  },
  {
    key: "spy_network_hq",
    name: "Spy Network HQ",
    description: "Reveals enemy base layouts before raids. Espionage civil skill extends intel duration.",
    category: "military",
    icon: "Eye",
    color: "#6366f1",
    maxLevel: 5,
    baseCost: { credits: 700, dark_matter: 60 },
    costMultiplier: 1.7,
    baseBuildTime: 40,
    guildBonus: { target: "raid_intel_duration", value: 60, label: "+60min raid intel per level" },
    requiredClass: "spy",
    requiredClassRank: 2,
    gridSize: [2, 2],
  },
  {
    key: "research_nexus",
    name: "Research Nexus",
    description: "Unlocks advanced building upgrades. Lore civil skill speeds research.",
    category: "research",
    icon: "FlaskConical",
    color: "#8b5cf6",
    maxLevel: 5,
    baseCost: { credits: 900, crystal: 80, void_essence: 40 },
    costMultiplier: 1.8,
    baseBuildTime: 60,
    guildBonus: { target: "research_speed", value: 0.10, label: "+10% research speed per level" },
    gridSize: [2, 2],
  },
  {
    key: "companion_quarters",
    name: "Companion Quarters",
    description: "Station companions here for aura bonuses. Companion Bond talent doubles aura range.",
    category: "utility",
    icon: "Heart",
    color: "#ec4899",
    maxLevel: 3,
    baseCost: { credits: 600, biomass: 50, crystal: 50 },
    costMultiplier: 1.5,
    baseBuildTime: 35,
    guildBonus: { target: "companion_aura_range", value: 1, label: "+1 companion aura range per level" },
    gridSize: [2, 2],
  },

  /* ─── PRESTIGE BUILDINGS ─── */
  {
    key: "temporal_forge",
    name: "Temporal Forge",
    description: "Chronomancer-exclusive. Crafts time-enhanced equipment for the entire guild.",
    category: "prestige",
    icon: "Timer",
    color: "#8b5cf6",
    maxLevel: 3,
    baseCost: { credits: 3000, crystal: 300, void_essence: 200 },
    costMultiplier: 2.5,
    baseBuildTime: 180,
    guildBonus: { target: "craft_time_reduction", value: 0.15, label: "15% guild-wide craft time reduction" },
    requiredPrestige: "chronomancer",
    element: "void",
    gridSize: [3, 3],
  },
  {
    key: "shadow_market",
    name: "Shadow Market",
    description: "Shadow Broker-exclusive. Black market access for the entire guild.",
    category: "prestige",
    icon: "EyeOff",
    color: "#475569",
    maxLevel: 3,
    baseCost: { credits: 3000, dark_matter: 300, alloy: 100 },
    costMultiplier: 2.5,
    baseBuildTime: 180,
    guildBonus: { target: "black_market_discount", value: 0.10, label: "10% black market discount" },
    requiredPrestige: "shadow_broker",
    element: "shadow",
    gridSize: [3, 3],
  },
];

/* ═══════════════════════════════════════════════════════
   RPG BONUS RESOLVERS — How character builds affect the capital
   ═══════════════════════════════════════════════════════ */

export interface CapitalBonuses {
  buildSpeedMultiplier: number;
  resourceMultiplier: number;
  defenseMultiplier: number;
  costReduction: number;
  maxBuildingBonus: number;
  raidTroopBonus: number;
  sources: { source: string; label: string }[];
}

/**
 * Resolve all RPG bonuses that apply to syndicate world operations.
 */
export function resolveCapitalBonuses(opts: {
  characterClass?: string;
  classRank?: number;
  species?: string;
  civilSkills?: Record<string, number>;
  talents?: string[];
  prestigeClass?: string;
  prestigeRank?: number;
  achievementTraits?: string[];
  companionIds?: string[];
}): CapitalBonuses {
  const bonuses: CapitalBonuses = {
    buildSpeedMultiplier: 1.0,
    resourceMultiplier: 1.0,
    defenseMultiplier: 1.0,
    costReduction: 0,
    maxBuildingBonus: 0,
    raidTroopBonus: 0,
    sources: [],
  };

  // CLASS MASTERY BONUSES
  if (opts.characterClass && opts.classRank) {
    const classBonus = CLASS_CAPITAL_BONUSES[opts.characterClass];
    if (classBonus) {
      if (opts.classRank >= 1) {
        bonuses.sources.push({ source: `${opts.characterClass} Rank 1`, label: classBonus.rank1Label });
        if (classBonus.rank1Type === "resource") bonuses.resourceMultiplier += classBonus.rank1Value;
        if (classBonus.rank1Type === "defense") bonuses.defenseMultiplier += classBonus.rank1Value;
        if (classBonus.rank1Type === "build") bonuses.buildSpeedMultiplier += classBonus.rank1Value;
      }
      if (opts.classRank >= 3) {
        bonuses.sources.push({ source: `${opts.characterClass} Rank 3`, label: classBonus.rank3Label });
        if (classBonus.rank3Type === "resource") bonuses.resourceMultiplier += classBonus.rank3Value;
        if (classBonus.rank3Type === "defense") bonuses.defenseMultiplier += classBonus.rank3Value;
        if (classBonus.rank3Type === "cost") bonuses.costReduction += classBonus.rank3Value;
      }
      if (opts.classRank >= 5) {
        bonuses.sources.push({ source: `${opts.characterClass} Grandmaster`, label: classBonus.rank5Label });
        bonuses.maxBuildingBonus += 2;
      }
    }
  }

  // SPECIES BONUSES
  if (opts.species) {
    const speciesBonus = SPECIES_CAPITAL_BONUSES[opts.species];
    if (speciesBonus) {
      bonuses.resourceMultiplier += speciesBonus.resourceBonus;
      bonuses.defenseMultiplier += speciesBonus.defenseBonus;
      bonuses.sources.push({ source: `${opts.species} Species`, label: speciesBonus.label });
    }
  }

  // CIVIL SKILL BONUSES
  if (opts.civilSkills) {
    const leadership = opts.civilSkills["leadership"] || 0;
    if (leadership >= 3) {
      bonuses.buildSpeedMultiplier += 0.05 * Math.min(leadership, 10);
      bonuses.sources.push({ source: "Leadership Skill", label: `+${5 * Math.min(leadership, 10)}% build speed` });
    }
    const craftsmanship = opts.civilSkills["craftsmanship"] || 0;
    if (craftsmanship >= 2) {
      bonuses.costReduction += 0.03 * Math.min(craftsmanship, 10);
      bonuses.sources.push({ source: "Craftsmanship Skill", label: `${3 * Math.min(craftsmanship, 10)}% cost reduction` });
    }
    const espionage = opts.civilSkills["espionage"] || 0;
    if (espionage >= 3) {
      bonuses.defenseMultiplier += 0.02 * Math.min(espionage, 10);
      bonuses.sources.push({ source: "Espionage Skill", label: `+${2 * Math.min(espionage, 10)}% defense from intel` });
    }
  }

  // TALENT BONUSES
  if (opts.talents) {
    if (opts.talents.includes("war_veteran")) {
      bonuses.defenseMultiplier += 0.15;
      bonuses.raidTroopBonus += 10;
      bonuses.sources.push({ source: "War Veteran Talent", label: "+15% defense, +10 raid troops" });
    }
    if (opts.talents.includes("merchant_prince")) {
      bonuses.resourceMultiplier += 0.10;
      bonuses.sources.push({ source: "Merchant Prince Talent", label: "+10% resource generation" });
    }
    if (opts.talents.includes("scavenger")) {
      bonuses.resourceMultiplier += 0.05;
      bonuses.sources.push({ source: "Scavenger Talent", label: "+5% bonus resources" });
    }
    if (opts.talents.includes("grandmasters_focus")) {
      bonuses.buildSpeedMultiplier += 0.10;
      bonuses.sources.push({ source: "Grandmaster's Focus Talent", label: "+10% build speed" });
    }
    if (opts.talents.includes("companion_bond")) {
      bonuses.maxBuildingBonus += 1;
      bonuses.sources.push({ source: "Companion Bond Talent", label: "+1 building slot from companion synergy" });
    }
  }

  // PRESTIGE CLASS BONUSES
  if (opts.prestigeClass && opts.prestigeRank) {
    const prestigeBonus = PRESTIGE_CAPITAL_BONUSES[opts.prestigeClass];
    if (prestigeBonus) {
      bonuses.sources.push({ source: `${opts.prestigeClass} Prestige`, label: prestigeBonus.label });
      bonuses.resourceMultiplier += prestigeBonus.resourceBonus * opts.prestigeRank;
      bonuses.defenseMultiplier += prestigeBonus.defenseBonus * opts.prestigeRank;
    }
  }

  // ACHIEVEMENT TRAIT BONUSES
  if (opts.achievementTraits) {
    if (opts.achievementTraits.includes("iron_fortress")) {
      bonuses.defenseMultiplier += 0.20;
      bonuses.sources.push({ source: "Iron Fortress Trait", label: "+20% capital defense" });
    }
    if (opts.achievementTraits.includes("master_builder")) {
      bonuses.buildSpeedMultiplier += 0.15;
      bonuses.costReduction += 0.10;
      bonuses.sources.push({ source: "Master Builder Trait", label: "+15% build speed, 10% cost reduction" });
    }
    if (opts.achievementTraits.includes("resource_magnate")) {
      bonuses.resourceMultiplier += 0.15;
      bonuses.sources.push({ source: "Resource Magnate Trait", label: "+15% resource generation" });
    }
  }

  return bonuses;
}

/* ═══════════════════════════════════════════════════════
   CLASS → CAPITAL BONUS LOOKUP
   ═══════════════════════════════════════════════════════ */

const CLASS_CAPITAL_BONUSES: Record<string, {
  rank1Type: string; rank1Value: number; rank1Label: string;
  rank3Type: string; rank3Value: number; rank3Label: string;
  rank5Label: string;
}> = {
  soldier: {
    rank1Type: "defense", rank1Value: 0.10, rank1Label: "+10% capital defense",
    rank3Type: "defense", rank3Value: 0.15, rank3Label: "+15% additional defense",
    rank5Label: "+2 building slots, +25% turret damage",
  },
  engineer: {
    rank1Type: "build", rank1Value: 0.15, rank1Label: "+15% build speed",
    rank3Type: "cost", rank3Value: 0.10, rank3Label: "10% building cost reduction",
    rank5Label: "+2 building slots, buildings auto-repair",
  },
  oracle: {
    rank1Type: "resource", rank1Value: 0.10, rank1Label: "+10% resource generation",
    rank3Type: "resource", rank3Value: 0.15, rank3Label: "+15% additional resources",
    rank5Label: "+2 building slots, predict raid timing",
  },
  spy: {
    rank1Type: "defense", rank1Value: 0.05, rank1Label: "+5% stealth defense",
    rank3Type: "defense", rank3Value: 0.10, rank3Label: "Buildings hidden from scouts",
    rank5Label: "+2 building slots, counter-espionage active",
  },
  assassin: {
    rank1Type: "defense", rank1Value: 0.08, rank1Label: "+8% trap damage",
    rank3Type: "defense", rank3Value: 0.12, rank3Label: "Shadow mines deal 2x damage",
    rank5Label: "+2 building slots, invisible defenses",
  },
};

/* ═══════════════════════════════════════════════════════
   SPECIES → CAPITAL BONUS LOOKUP
   ═══════════════════════════════════════════════════════ */

const SPECIES_CAPITAL_BONUSES: Record<string, { resourceBonus: number; defenseBonus: number; label: string }> = {
  demagi: { resourceBonus: 0.10, defenseBonus: 0.05, label: "+10% resources, +5% defense (Demagi resilience)" },
  quarchon: { resourceBonus: 0.05, defenseBonus: 0.15, label: "+5% resources, +15% defense (Quarchon fortification)" },
  neyon: { resourceBonus: 0.15, defenseBonus: 0.00, label: "+15% resources (Neyon efficiency)" },
  human: { resourceBonus: 0.08, defenseBonus: 0.08, label: "+8% resources, +8% defense (Human adaptability)" },
  synthetic: { resourceBonus: 0.12, defenseBonus: 0.10, label: "+12% resources, +10% defense (Synthetic optimization)" },
};

/* ═══════════════════════════════════════════════════════
   PRESTIGE → CAPITAL BONUS LOOKUP
   ═══════════════════════════════════════════════════════ */

const PRESTIGE_CAPITAL_BONUSES: Record<string, { resourceBonus: number; defenseBonus: number; label: string }> = {
  chronomancer: { resourceBonus: 0.05, defenseBonus: 0.03, label: "Time-enhanced production and shields" },
  warlord: { resourceBonus: 0.02, defenseBonus: 0.08, label: "Military fortification mastery" },
  shadow_broker: { resourceBonus: 0.06, defenseBonus: 0.04, label: "Black market resource channels" },
  technomancer: { resourceBonus: 0.04, defenseBonus: 0.06, label: "Automated defense systems" },
  blade_dancer: { resourceBonus: 0.03, defenseBonus: 0.07, label: "Lethal perimeter defense" },
  architect_prime: { resourceBonus: 0.08, defenseBonus: 0.02, label: "Optimized building layouts" },
  void_walker: { resourceBonus: 0.07, defenseBonus: 0.03, label: "Dimensional resource siphoning" },
  iron_prophet: { resourceBonus: 0.04, defenseBonus: 0.06, label: "Prophetic defense positioning" },
  phantom_engineer: { resourceBonus: 0.05, defenseBonus: 0.05, label: "Ghost-tech infrastructure" },
  war_oracle: { resourceBonus: 0.03, defenseBonus: 0.07, label: "Strategic defense foresight" },
};

/* ═══════════════════════════════════════════════════════
   ELEMENTAL BUILDING SYNERGIES
   ═══════════════════════════════════════════════════════ */

export interface BuildingSynergy {
  elements: [string, string];
  bonus: string;
  value: number;
  label: string;
}

export const BUILDING_SYNERGIES: BuildingSynergy[] = [
  { elements: ["fire", "lightning"], bonus: "defense", value: 0.15, label: "Plasma Storm: +15% defense" },
  { elements: ["shadow", "void"], bonus: "stealth", value: 0.20, label: "Dimensional Cloak: +20% stealth" },
  { elements: ["nature", "light"], bonus: "resource", value: 0.15, label: "Growth Bloom: +15% resources" },
  { elements: ["fire", "shadow"], bonus: "trap_damage", value: 0.25, label: "Infernal Trap: +25% trap damage" },
  { elements: ["void", "light"], bonus: "shield", value: 0.20, label: "Void Shield: +20% shield strength" },
  { elements: ["lightning", "nature"], bonus: "build_speed", value: 0.10, label: "Living Circuits: +10% build speed" },
];

/**
 * Check for elemental synergies between adjacent buildings.
 */
export function checkBuildingSynergies(buildingElements: string[]): BuildingSynergy[] {
  const active: BuildingSynergy[] = [];
  const elementSet = new Set(buildingElements);
  for (const synergy of BUILDING_SYNERGIES) {
    if (elementSet.has(synergy.elements[0]) && elementSet.has(synergy.elements[1])) {
      active.push(synergy);
    }
  }
  return active;
}

/**
 * Calculate building cost with RPG reductions applied.
 */
export function calculateBuildCost(
  building: BuildingDef,
  level: number,
  costReduction: number
): Record<string, number> {
  const costs: Record<string, number> = {};
  const multiplier = Math.pow(building.costMultiplier, level - 1);
  const reduction = Math.max(0, Math.min(costReduction, 0.50)); // cap at 50%
  for (const [resource, baseCost] of Object.entries(building.baseCost)) {
    costs[resource] = Math.ceil(baseCost * multiplier * (1 - reduction));
  }
  return costs;
}

/**
 * Calculate build time with RPG speed bonuses applied.
 */
export function calculateBuildTime(
  building: BuildingDef,
  level: number,
  speedMultiplier: number
): number {
  const baseTime = building.baseBuildTime * Math.pow(1.3, level - 1);
  return Math.ceil(baseTime / Math.max(speedMultiplier, 0.5));
}

/**
 * Calculate resource production with all bonuses.
 */
export function calculateProduction(
  building: BuildingDef,
  level: number,
  resourceMultiplier: number,
  worldBiomeBonus: number
): ResourceRate[] {
  if (!building.production) return [];
  return building.production.map(p => ({
    resource: p.resource,
    baseRate: Math.ceil(p.baseRate * level * resourceMultiplier * worldBiomeBonus),
  }));
}

/**
 * Get building by key.
 */
export function getBuilding(key: string): BuildingDef | undefined {
  return BUILDINGS.find(b => b.key === key);
}

/**
 * Get buildings available to a player based on their RPG stats.
 */
export function getAvailableBuildings(opts: {
  characterClass?: string;
  classRank?: number;
  citizenLevel?: number;
  prestigeClass?: string;
}): BuildingDef[] {
  return BUILDINGS.filter(b => {
    if (b.requiredClass && b.requiredClass !== opts.characterClass) return false;
    if (b.requiredClassRank && (opts.classRank || 0) < b.requiredClassRank) return false;
    if (b.requiredLevel && (opts.citizenLevel || 0) < b.requiredLevel) return false;
    if (b.requiredPrestige && b.requiredPrestige !== opts.prestigeClass) return false;
    return true;
  });
}
