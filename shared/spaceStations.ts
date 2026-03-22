/**
 * SPACE STATIONS — Player Base System
 * ────────────────────────────────────
 * Each player can build and upgrade a personal space station.
 * Stations have modular rooms that provide personal bonuses.
 * Other players can visit your station. Stations can be raided.
 *
 * RPG INTEGRATION:
 * - Class Mastery: Unlocks class-specific station modules
 * - Species Traits: Passive bonuses to station efficiency
 * - Citizen Talents: Unlock special modules and upgrades
 * - Civil Skills: Engineering speeds construction, Craftsmanship reduces costs
 * - Prestige Classes: Unlock ultimate station modules
 * - Elemental Combos: Adjacent elemental modules create synergy bonuses
 * - Companion Synergies: Companions stationed provide unique effects
 * - Achievement Traits: Passive bonuses to all station operations
 */

import type { CharacterClass } from "./classMastery";

/* ═══════════════════════════════════════════════════════
   STATION TIERS — Progression through station upgrades
   ═══════════════════════════════════════════════════════ */

export interface StationTier {
  tier: number;
  name: string;
  description: string;
  requiredLevel: number;
  maxModules: number;
  gridSize: number;
  defenseSlots: number;
  /** Cost to upgrade to this tier */
  upgradeCost: Record<string, number>;
  icon: string;
  color: string;
}

export const STATION_TIERS: StationTier[] = [
  {
    tier: 1, name: "Outpost", description: "A basic orbital platform with minimal facilities.",
    requiredLevel: 1, maxModules: 6, gridSize: 6, defenseSlots: 2,
    upgradeCost: {}, icon: "Satellite", color: "#6b7280",
  },
  {
    tier: 2, name: "Station", description: "A proper space station with room for expansion.",
    requiredLevel: 5, maxModules: 10, gridSize: 8, defenseSlots: 4,
    upgradeCost: { credits: 2000, alloy: 200, crystal: 100 }, icon: "Building2", color: "#3b82f6",
  },
  {
    tier: 3, name: "Fortress", description: "A heavily fortified station with advanced systems.",
    requiredLevel: 10, maxModules: 16, gridSize: 10, defenseSlots: 6,
    upgradeCost: { credits: 5000, alloy: 500, crystal: 300, dark_matter: 100 }, icon: "Shield", color: "#8b5cf6",
  },
  {
    tier: 4, name: "Citadel", description: "A massive orbital citadel. A beacon of power.",
    requiredLevel: 15, maxModules: 22, gridSize: 12, defenseSlots: 8,
    upgradeCost: { credits: 10000, alloy: 1000, crystal: 600, dark_matter: 300, void_essence: 100 }, icon: "Crown", color: "#f59e0b",
  },
  {
    tier: 5, name: "Nexus", description: "The ultimate station. A self-sustaining micro-world.",
    requiredLevel: 20, maxModules: 30, gridSize: 14, defenseSlots: 12,
    upgradeCost: { credits: 25000, alloy: 2000, crystal: 1200, dark_matter: 600, void_essence: 300 }, icon: "Orbit", color: "#ec4899",
  },
];

/* ═══════════════════════════════════════════════════════
   STATION MODULES — Buildable rooms/facilities
   ═══════════════════════════════════════════════════════ */

export type ModuleCategory = "production" | "defense" | "living" | "research" | "special" | "prestige";

export interface StationModule {
  key: string;
  name: string;
  description: string;
  category: ModuleCategory;
  icon: string;
  color: string;
  maxLevel: number;
  baseCost: Record<string, number>;
  costMultiplier: number;
  baseBuildTime: number; // minutes
  /** Personal bonus provided */
  bonus: { target: string; value: number; label: string };
  /** Required class */
  requiredClass?: CharacterClass;
  requiredClassRank?: number;
  /** Required prestige class */
  requiredPrestige?: string;
  /** Required citizen level */
  requiredLevel?: number;
  /** Required civil skill and level */
  requiredCivilSkill?: { skill: string; level: number };
  /** Element for synergy */
  element?: string;
  /** Grid size */
  gridSize: [number, number];
}

export const STATION_MODULES: StationModule[] = [
  /* ─── PRODUCTION MODULES ─── */
  {
    key: "mining_rig",
    name: "Mining Rig",
    description: "Extracts ore from nearby asteroids. Engineer class boosts yield.",
    category: "production", icon: "Pickaxe", color: "#a16207",
    maxLevel: 10, baseCost: { credits: 200, alloy: 30 }, costMultiplier: 1.4, baseBuildTime: 15,
    bonus: { target: "ore_production", value: 8, label: "+8 ore/hr per level" },
    element: "fire", gridSize: [1, 1],
  },
  {
    key: "crystal_lab",
    name: "Crystal Lab",
    description: "Synthesizes crystals from raw materials. Oracle class boosts purity.",
    category: "production", icon: "Gem", color: "#8b5cf6",
    maxLevel: 10, baseCost: { credits: 250, crystal: 20 }, costMultiplier: 1.4, baseBuildTime: 20,
    bonus: { target: "crystal_production", value: 6, label: "+6 crystal/hr per level" },
    requiredClass: "oracle", requiredClassRank: 1, element: "light", gridSize: [1, 1],
  },
  {
    key: "dream_condenser",
    name: "Dream Condenser",
    description: "Converts ambient psychic energy into Dream Tokens.",
    category: "production", icon: "Sparkles", color: "#fbbf24",
    maxLevel: 8, baseCost: { credits: 500, crystal: 50, void_essence: 20 }, costMultiplier: 1.6, baseBuildTime: 30,
    bonus: { target: "dream_production", value: 3, label: "+3 Dream/hr per level" },
    requiredLevel: 5, element: "void", gridSize: [2, 2],
  },
  {
    key: "trade_terminal",
    name: "Trade Terminal",
    description: "Automated trading post. Negotiation civil skill reduces fees.",
    category: "production", icon: "ArrowLeftRight", color: "#f59e0b",
    maxLevel: 5, baseCost: { credits: 400, alloy: 40 }, costMultiplier: 1.5, baseBuildTime: 25,
    bonus: { target: "trade_income", value: 5, label: "+5 credits/hr per level" },
    requiredCivilSkill: { skill: "negotiation", level: 2 }, gridSize: [1, 1],
  },

  /* ─── DEFENSE MODULES ─── */
  {
    key: "point_defense",
    name: "Point Defense System",
    description: "Automated turrets that target raiders. Soldier class increases accuracy.",
    category: "defense", icon: "Crosshair", color: "#dc2626",
    maxLevel: 10, baseCost: { credits: 300, alloy: 50 }, costMultiplier: 1.4, baseBuildTime: 15,
    bonus: { target: "station_defense", value: 25, label: "+25 defense per level" },
    requiredClass: "soldier", requiredClassRank: 1, element: "fire", gridSize: [1, 1],
  },
  {
    key: "deflector_array",
    name: "Deflector Array",
    description: "Energy shields that absorb damage. Engineer class extends duration.",
    category: "defense", icon: "Shield", color: "#3b82f6",
    maxLevel: 8, baseCost: { credits: 400, crystal: 60, alloy: 30 }, costMultiplier: 1.5, baseBuildTime: 25,
    bonus: { target: "station_shield", value: 40, label: "+40 shield per level" },
    requiredClass: "engineer", requiredClassRank: 2, element: "lightning", gridSize: [2, 2],
  },
  {
    key: "stealth_field",
    name: "Stealth Field Generator",
    description: "Makes your station harder to find for raiders. Spy class extends field.",
    category: "defense", icon: "EyeOff", color: "#6366f1",
    maxLevel: 5, baseCost: { credits: 500, dark_matter: 40 }, costMultiplier: 1.6, baseBuildTime: 30,
    bonus: { target: "stealth_rating", value: 15, label: "+15 stealth per level" },
    requiredClass: "spy", requiredClassRank: 2, element: "shadow", gridSize: [1, 1],
  },
  {
    key: "trap_bay",
    name: "Trap Bay",
    description: "Deploys traps that damage raiders. Assassin class doubles trap damage.",
    category: "defense", icon: "AlertTriangle", color: "#475569",
    maxLevel: 6, baseCost: { credits: 250, dark_matter: 30, alloy: 20 }, costMultiplier: 1.4, baseBuildTime: 15,
    bonus: { target: "trap_damage", value: 30, label: "+30 trap damage per level" },
    requiredClass: "assassin", requiredClassRank: 1, element: "shadow", gridSize: [1, 1],
  },

  /* ─── LIVING MODULES ─── */
  {
    key: "personal_quarters",
    name: "Personal Quarters",
    description: "Your private living space. Decoratable. Visitors earn you reputation.",
    category: "living", icon: "Home", color: "#10b981",
    maxLevel: 5, baseCost: { credits: 300, biomass: 30 }, costMultiplier: 1.3, baseBuildTime: 20,
    bonus: { target: "visitor_reputation", value: 2, label: "+2 reputation per visitor" },
    gridSize: [2, 2],
  },
  {
    key: "companion_bay",
    name: "Companion Bay",
    description: "Quarters for your companions. Stationed companions provide passive bonuses.",
    category: "living", icon: "Heart", color: "#ec4899",
    maxLevel: 3, baseCost: { credits: 400, biomass: 40, crystal: 20 }, costMultiplier: 1.5, baseBuildTime: 25,
    bonus: { target: "companion_slots", value: 1, label: "+1 companion station slot" },
    gridSize: [2, 2],
  },
  {
    key: "trophy_hall",
    name: "Trophy Hall",
    description: "Display your achievements. Each displayed trophy provides a small stat bonus.",
    category: "living", icon: "Trophy", color: "#f59e0b",
    maxLevel: 3, baseCost: { credits: 500, crystal: 30 }, costMultiplier: 1.4, baseBuildTime: 20,
    bonus: { target: "trophy_stat_bonus", value: 0.01, label: "+1% stats per displayed trophy" },
    gridSize: [2, 2],
  },

  /* ─── RESEARCH MODULES ─── */
  {
    key: "tech_lab",
    name: "Tech Lab",
    description: "Research new technologies. Lore civil skill speeds research.",
    category: "research", icon: "FlaskConical", color: "#8b5cf6",
    maxLevel: 5, baseCost: { credits: 600, crystal: 60, void_essence: 20 }, costMultiplier: 1.6, baseBuildTime: 40,
    bonus: { target: "research_speed", value: 0.10, label: "+10% research speed per level" },
    requiredCivilSkill: { skill: "lore", level: 3 }, element: "light", gridSize: [2, 2],
  },
  {
    key: "training_sim",
    name: "Training Simulator",
    description: "Practice combat and chess. Tactics civil skill boosts XP gained.",
    category: "research", icon: "Gamepad2", color: "#3b82f6",
    maxLevel: 5, baseCost: { credits: 400, alloy: 30, crystal: 30 }, costMultiplier: 1.4, baseBuildTime: 25,
    bonus: { target: "training_xp_bonus", value: 0.05, label: "+5% combat/chess XP per level" },
    requiredCivilSkill: { skill: "tactics", level: 2 }, gridSize: [2, 2],
  },

  /* ─── SPECIAL MODULES ─── */
  {
    key: "warp_gate",
    name: "Warp Gate",
    description: "Enables fast travel to guild capital. Requires Perception civil skill 5+.",
    category: "special", icon: "Zap", color: "#06b6d4",
    maxLevel: 3, baseCost: { credits: 1000, void_essence: 80, crystal: 60 }, costMultiplier: 2.0, baseBuildTime: 60,
    bonus: { target: "warp_cooldown_reduction", value: 0.20, label: "20% warp cooldown reduction per level" },
    requiredCivilSkill: { skill: "perception", level: 5 }, element: "void", gridSize: [2, 2],
  },
  {
    key: "crafting_bay",
    name: "Crafting Bay",
    description: "Personal crafting station. Craftsmanship civil skill boosts success rate.",
    category: "special", icon: "Hammer", color: "#a16207",
    maxLevel: 5, baseCost: { credits: 500, alloy: 50, biomass: 30 }, costMultiplier: 1.5, baseBuildTime: 30,
    bonus: { target: "craft_success_bonus", value: 0.05, label: "+5% craft success per level" },
    requiredCivilSkill: { skill: "craftsmanship", level: 2 }, element: "fire", gridSize: [2, 2],
  },

  /* ─── PRESTIGE MODULES ─── */
  {
    key: "chrono_chamber",
    name: "Chrono Chamber",
    description: "Chronomancer-exclusive. Reduces all cooldowns station-wide.",
    category: "prestige", icon: "Timer", color: "#8b5cf6",
    maxLevel: 3, baseCost: { credits: 3000, crystal: 200, void_essence: 150 }, costMultiplier: 2.5, baseBuildTime: 120,
    bonus: { target: "global_cooldown_reduction", value: 0.10, label: "10% global cooldown reduction per level" },
    requiredPrestige: "chronomancer", element: "void", gridSize: [3, 3],
  },
  {
    key: "war_room",
    name: "War Room",
    description: "Warlord-exclusive. Provides raid planning bonuses to entire guild.",
    category: "prestige", icon: "Target", color: "#dc2626",
    maxLevel: 3, baseCost: { credits: 3000, alloy: 250, dark_matter: 100 }, costMultiplier: 2.5, baseBuildTime: 120,
    bonus: { target: "guild_raid_bonus", value: 0.15, label: "+15% guild raid effectiveness per level" },
    requiredPrestige: "warlord", element: "fire", gridSize: [3, 3],
  },
];

/* ═══════════════════════════════════════════════════════
   RPG BONUS RESOLVERS — How character builds affect stations
   ═══════════════════════════════════════════════════════ */

export interface StationBonuses {
  buildSpeedMultiplier: number;
  productionMultiplier: number;
  defenseMultiplier: number;
  costReduction: number;
  moduleSlotBonus: number;
  stealthBonus: number;
  sources: { source: string; label: string }[];
}

export function resolveStationBonuses(opts: {
  characterClass?: string;
  classRank?: number;
  species?: string;
  civilSkills?: Record<string, number>;
  talents?: string[];
  prestigeClass?: string;
  prestigeRank?: number;
  achievementTraits?: string[];
}): StationBonuses {
  const bonuses: StationBonuses = {
    buildSpeedMultiplier: 1.0,
    productionMultiplier: 1.0,
    defenseMultiplier: 1.0,
    costReduction: 0,
    moduleSlotBonus: 0,
    stealthBonus: 0,
    sources: [],
  };

  // CLASS BONUSES
  if (opts.characterClass === "engineer" && (opts.classRank || 0) >= 1) {
    bonuses.buildSpeedMultiplier += 0.20;
    bonuses.costReduction += 0.10;
    bonuses.sources.push({ source: "Engineer Class", label: "+20% build speed, 10% cost reduction" });
  }
  if (opts.characterClass === "soldier" && (opts.classRank || 0) >= 1) {
    bonuses.defenseMultiplier += 0.20;
    bonuses.sources.push({ source: "Soldier Class", label: "+20% station defense" });
  }
  if (opts.characterClass === "oracle" && (opts.classRank || 0) >= 1) {
    bonuses.productionMultiplier += 0.15;
    bonuses.sources.push({ source: "Oracle Class", label: "+15% resource production" });
  }
  if (opts.characterClass === "spy" && (opts.classRank || 0) >= 1) {
    bonuses.stealthBonus += 20;
    bonuses.sources.push({ source: "Spy Class", label: "+20 stealth rating" });
  }
  if (opts.characterClass === "assassin" && (opts.classRank || 0) >= 1) {
    bonuses.defenseMultiplier += 0.10;
    bonuses.stealthBonus += 10;
    bonuses.sources.push({ source: "Assassin Class", label: "+10% defense, +10 stealth" });
  }

  // SPECIES BONUSES
  const speciesBonuses: Record<string, { prod: number; def: number; label: string }> = {
    demagi: { prod: 0.08, def: 0.05, label: "Demagi: +8% production, +5% defense" },
    quarchon: { prod: 0.03, def: 0.12, label: "Quarchon: +3% production, +12% defense" },
    neyon: { prod: 0.12, def: 0.00, label: "Neyon: +12% production" },
    human: { prod: 0.06, def: 0.06, label: "Human: +6% production, +6% defense" },
    synthetic: { prod: 0.10, def: 0.08, label: "Synthetic: +10% production, +8% defense" },
  };
  if (opts.species && speciesBonuses[opts.species]) {
    const sb = speciesBonuses[opts.species];
    bonuses.productionMultiplier += sb.prod;
    bonuses.defenseMultiplier += sb.def;
    bonuses.sources.push({ source: "Species", label: sb.label });
  }

  // CIVIL SKILL BONUSES
  if (opts.civilSkills) {
    const eng = opts.civilSkills["craftsmanship"] || 0;
    if (eng >= 2) {
      bonuses.buildSpeedMultiplier += 0.03 * eng;
      bonuses.costReduction += 0.02 * eng;
      bonuses.sources.push({ source: "Craftsmanship", label: `+${3 * eng}% build speed, ${2 * eng}% cost reduction` });
    }
    const tactics = opts.civilSkills["tactics"] || 0;
    if (tactics >= 3) {
      bonuses.defenseMultiplier += 0.02 * tactics;
      bonuses.sources.push({ source: "Tactics", label: `+${2 * tactics}% defense from tactical planning` });
    }
    const perception = opts.civilSkills["perception"] || 0;
    if (perception >= 2) {
      bonuses.stealthBonus += 2 * perception;
      bonuses.sources.push({ source: "Perception", label: `+${2 * perception} stealth from awareness` });
    }
  }

  // TALENT BONUSES
  if (opts.talents) {
    if (opts.talents.includes("iron_constitution")) {
      bonuses.defenseMultiplier += 0.10;
      bonuses.sources.push({ source: "Iron Constitution", label: "+10% station defense" });
    }
    if (opts.talents.includes("quick_study")) {
      bonuses.buildSpeedMultiplier += 0.10;
      bonuses.sources.push({ source: "Quick Study", label: "+10% build speed" });
    }
    if (opts.talents.includes("scavenger")) {
      bonuses.productionMultiplier += 0.08;
      bonuses.sources.push({ source: "Scavenger", label: "+8% resource production" });
    }
    if (opts.talents.includes("transcendence")) {
      bonuses.productionMultiplier += 0.15;
      bonuses.defenseMultiplier += 0.15;
      bonuses.sources.push({ source: "Transcendence", label: "+15% all station bonuses" });
    }
  }

  // PRESTIGE BONUSES
  if (opts.prestigeClass === "technomancer" && (opts.prestigeRank || 0) >= 1) {
    bonuses.buildSpeedMultiplier += 0.15;
    bonuses.moduleSlotBonus += opts.prestigeRank || 0;
    bonuses.sources.push({ source: "Technomancer", label: "+15% build speed, +module slots" });
  }
  if (opts.prestigeClass === "warlord" && (opts.prestigeRank || 0) >= 1) {
    bonuses.defenseMultiplier += 0.20;
    bonuses.sources.push({ source: "Warlord", label: "+20% station defense" });
  }

  // ACHIEVEMENT TRAIT BONUSES
  if (opts.achievementTraits) {
    if (opts.achievementTraits.includes("iron_fortress")) {
      bonuses.defenseMultiplier += 0.15;
      bonuses.sources.push({ source: "Iron Fortress Trait", label: "+15% station defense" });
    }
    if (opts.achievementTraits.includes("master_builder")) {
      bonuses.buildSpeedMultiplier += 0.12;
      bonuses.sources.push({ source: "Master Builder Trait", label: "+12% build speed" });
    }
  }

  return bonuses;
}

/**
 * Get modules available to a player based on RPG stats.
 */
export function getAvailableModules(opts: {
  characterClass?: string;
  classRank?: number;
  citizenLevel?: number;
  prestigeClass?: string;
  civilSkills?: Record<string, number>;
}): StationModule[] {
  return STATION_MODULES.filter(m => {
    if (m.requiredClass && m.requiredClass !== opts.characterClass) return false;
    if (m.requiredClassRank && (opts.classRank || 0) < m.requiredClassRank) return false;
    if (m.requiredLevel && (opts.citizenLevel || 0) < m.requiredLevel) return false;
    if (m.requiredPrestige && m.requiredPrestige !== opts.prestigeClass) return false;
    if (m.requiredCivilSkill) {
      const skillLevel = opts.civilSkills?.[m.requiredCivilSkill.skill] || 0;
      if (skillLevel < m.requiredCivilSkill.level) return false;
    }
    return true;
  });
}

/**
 * Get station tier for a given citizen level.
 */
export function getStationTier(citizenLevel: number): StationTier {
  for (let i = STATION_TIERS.length - 1; i >= 0; i--) {
    if (citizenLevel >= STATION_TIERS[i].requiredLevel) return STATION_TIERS[i];
  }
  return STATION_TIERS[0];
}

/**
 * Module elemental synergies (same as building synergies).
 */
export const MODULE_SYNERGIES = [
  { elements: ["fire", "lightning"], bonus: "defense", value: 0.12, label: "Plasma Core: +12% defense" },
  { elements: ["shadow", "void"], bonus: "stealth", value: 0.18, label: "Phase Cloak: +18% stealth" },
  { elements: ["light", "void"], bonus: "production", value: 0.12, label: "Energy Nexus: +12% production" },
  { elements: ["fire", "shadow"], bonus: "trap_damage", value: 0.20, label: "Dark Fire: +20% trap damage" },
] as const;
