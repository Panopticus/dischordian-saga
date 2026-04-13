/**
 * PRESTIGE UNLOCK QUESTS — Quest chains that gate prestige class access
 * ─────────────────────────────────────────────────────────────────────
 * Each prestige class requires completing a multi-step quest chain.
 * Quests test mastery of the base class, civil skills, and game systems.
 *
 * RPG INTEGRATION:
 * - Base class mastery rank 3+ required to start any prestige quest
 * - Civil skills determine which quest steps are available
 * - Talents can skip certain quest steps
 * - Achievement traits provide quest XP bonuses
 * - Companion synergies can assist in combat quest steps
 */

export interface PrestigeQuestStep {
  stepId: string;
  name: string;
  description: string;
  icon: string;
  /** Type of challenge */
  type: "combat" | "resource" | "social" | "exploration" | "crafting" | "knowledge";
  /** Requirement to complete this step */
  requirement: {
    kind: string;
    target?: string;
    count?: number;
    minLevel?: number;
    civilSkill?: { skill: string; level: number };
    /** Can be skipped if player has this talent */
    skipWithTalent?: string;
  };
  /** Rewards for completing this step */
  rewards: {
    xp?: number;
    dream?: number;
    credits?: number;
    item?: string;
  };
}

export interface PrestigeQuestChain {
  key: string;
  prestigeClass: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  /** Base class required */
  requiredBaseClass: string;
  /** Minimum class rank to start */
  requiredClassRank: number;
  /** Minimum citizen level */
  requiredLevel: number;
  /** Quest steps in order */
  steps: PrestigeQuestStep[];
  /** Final reward: the prestige class unlock */
  completionReward: {
    prestigeClass: string;
    title: string;
    xp: number;
    dream: number;
    exclusiveItem?: string;
  };
}

export const PRESTIGE_QUEST_CHAINS: PrestigeQuestChain[] = [
  /* ═══ CHRONOMANCER — Oracle → Time Master ═══ */
  {
    key: "path_of_the_chronomancer",
    prestigeClass: "chronomancer",
    name: "Path of the Chronomancer",
    description: "Master the flow of time itself. Only those who have gazed into eternity may bend it.",
    icon: "Timer",
    color: "#8b5cf6",
    requiredBaseClass: "oracle",
    requiredClassRank: 3,
    requiredLevel: 15,
    steps: [
      {
        stepId: "chrono_1",
        name: "Temporal Awareness",
        description: "Demonstrate mastery of foresight. Win 10 chess matches using prediction.",
        icon: "Eye",
        type: "combat",
        requirement: { kind: "chess_wins", count: 10 },
        rewards: { xp: 500, dream: 50 },
      },
      {
        stepId: "chrono_2",
        name: "Rift Study",
        description: "Research temporal anomalies. Requires Lore civil skill level 5.",
        icon: "FlaskConical",
        type: "knowledge",
        requirement: { kind: "civil_skill_check", civilSkill: { skill: "lore", level: 5 } },
        rewards: { xp: 400, credits: 200 },
      },
      {
        stepId: "chrono_3",
        name: "Chrono Crystals",
        description: "Gather 500 crystal and 200 void essence for the temporal focus.",
        icon: "Gem",
        type: "resource",
        requirement: { kind: "gather_resources", target: "crystal:500,void_essence:200" },
        rewards: { xp: 300, item: "chrono_focus_blueprint" },
      },
      {
        stepId: "chrono_4",
        name: "Time Dilation Trial",
        description: "Survive 20 waves in tower defense without losing a tower. Quick Study talent can skip.",
        icon: "Shield",
        type: "combat",
        requirement: { kind: "td_waves_survived", count: 20, skipWithTalent: "quick_study" },
        rewards: { xp: 600, dream: 100 },
      },
      {
        stepId: "chrono_5",
        name: "The Chronomancer's Oath",
        description: "Craft the Temporal Focus at your station's crafting bay. Craftsmanship 4+ required.",
        icon: "Sparkles",
        type: "crafting",
        requirement: { kind: "craft_item", target: "temporal_focus", civilSkill: { skill: "craftsmanship", level: 4 } },
        rewards: { xp: 800 },
      },
    ],
    completionReward: {
      prestigeClass: "chronomancer",
      title: "Chronomancer",
      xp: 2000,
      dream: 500,
      exclusiveItem: "chronomancer_robes",
    },
  },

  /* ═══ WARLORD — Soldier → Supreme Commander ═══ */
  {
    key: "path_of_the_warlord",
    prestigeClass: "warlord",
    name: "Path of the Warlord",
    description: "Prove your worth on the battlefield. Only the strongest may command armies.",
    icon: "Swords",
    color: "#dc2626",
    requiredBaseClass: "soldier",
    requiredClassRank: 3,
    requiredLevel: 15,
    steps: [
      {
        stepId: "warlord_1",
        name: "Battle Proven",
        description: "Win 25 PvP card battles or fight encounters.",
        icon: "Swords",
        type: "combat",
        requirement: { kind: "pvp_wins", count: 25 },
        rewards: { xp: 500, dream: 50 },
      },
      {
        stepId: "warlord_2",
        name: "Tactical Mastery",
        description: "Achieve Tactics civil skill level 5.",
        icon: "Map",
        type: "knowledge",
        requirement: { kind: "civil_skill_check", civilSkill: { skill: "tactics", level: 5 } },
        rewards: { xp: 400, credits: 200 },
      },
      {
        stepId: "warlord_3",
        name: "Forge the War Banner",
        description: "Gather 800 alloy and 300 dark matter for the war banner.",
        icon: "Flag",
        type: "resource",
        requirement: { kind: "gather_resources", target: "alloy:800,dark_matter:300" },
        rewards: { xp: 300, item: "war_banner_blueprint" },
      },
      {
        stepId: "warlord_4",
        name: "Raid Commander",
        description: "Successfully raid 10 enemy bases with 3-star results. War Veteran talent can skip.",
        icon: "Target",
        type: "combat",
        requirement: { kind: "raid_3star", count: 10, skipWithTalent: "war_veteran" },
        rewards: { xp: 600, dream: 100 },
      },
      {
        stepId: "warlord_5",
        name: "The Warlord's Coronation",
        description: "Lead your guild to victory in a guild war event.",
        icon: "Crown",
        type: "social",
        requirement: { kind: "guild_war_victory", count: 1 },
        rewards: { xp: 800 },
      },
    ],
    completionReward: {
      prestigeClass: "warlord",
      title: "Warlord",
      xp: 2000,
      dream: 500,
      exclusiveItem: "warlord_armor",
    },
  },

  /* ═══ SHADOW BROKER — Spy → Information Kingpin ═══ */
  {
    key: "path_of_the_shadow_broker",
    prestigeClass: "shadow_broker",
    name: "Path of the Shadow Broker",
    description: "Information is the ultimate currency. Control the flow and control the world.",
    icon: "EyeOff",
    color: "#475569",
    requiredBaseClass: "spy",
    requiredClassRank: 3,
    requiredLevel: 15,
    steps: [
      {
        stepId: "broker_1",
        name: "Intelligence Network",
        description: "Complete 20 espionage-related daily quests.",
        icon: "Network",
        type: "exploration",
        requirement: { kind: "quest_completions", target: "espionage", count: 20 },
        rewards: { xp: 500, dream: 50 },
      },
      {
        stepId: "broker_2",
        name: "Master of Deception",
        description: "Achieve Espionage civil skill level 5.",
        icon: "EyeOff",
        type: "knowledge",
        requirement: { kind: "civil_skill_check", civilSkill: { skill: "espionage", level: 5 } },
        rewards: { xp: 400, credits: 200 },
      },
      {
        stepId: "broker_3",
        name: "Black Market Connections",
        description: "Complete 50 marketplace trades.",
        icon: "ArrowLeftRight",
        type: "social",
        requirement: { kind: "marketplace_trades", count: 50 },
        rewards: { xp: 300, item: "shadow_network_key" },
      },
      {
        stepId: "broker_4",
        name: "The Perfect Heist",
        description: "Steal 10,000 total resources from raids. Scavenger talent can skip.",
        icon: "Package",
        type: "combat",
        requirement: { kind: "raid_loot_total", count: 10000, skipWithTalent: "scavenger" },
        rewards: { xp: 600, dream: 100 },
      },
      {
        stepId: "broker_5",
        name: "The Broker's Ascension",
        description: "Accumulate 5,000 Dream Tokens in your personal treasury.",
        icon: "Sparkles",
        type: "resource",
        requirement: { kind: "dream_balance", count: 5000 },
        rewards: { xp: 800 },
      },
    ],
    completionReward: {
      prestigeClass: "shadow_broker",
      title: "Shadow Broker",
      xp: 2000,
      dream: 500,
      exclusiveItem: "shadow_broker_cloak",
    },
  },

  /* ═══ TECHNOMANCER — Engineer → Tech Overlord ═══ */
  {
    key: "path_of_the_technomancer",
    prestigeClass: "technomancer",
    name: "Path of the Technomancer",
    description: "Merge flesh and machine. The Technomancer transcends biological limits.",
    icon: "Cpu",
    color: "#06b6d4",
    requiredBaseClass: "engineer",
    requiredClassRank: 3,
    requiredLevel: 15,
    steps: [
      {
        stepId: "tech_1",
        name: "Master Engineer",
        description: "Build 30 total structures across your station and guild capital.",
        icon: "Building",
        type: "crafting",
        requirement: { kind: "buildings_constructed", count: 30 },
        rewards: { xp: 500, dream: 50 },
      },
      {
        stepId: "tech_2",
        name: "Advanced Schematics",
        description: "Achieve Craftsmanship civil skill level 5.",
        icon: "FlaskConical",
        type: "knowledge",
        requirement: { kind: "civil_skill_check", civilSkill: { skill: "craftsmanship", level: 5 } },
        rewards: { xp: 400, credits: 200 },
      },
      {
        stepId: "tech_3",
        name: "Prototype Assembly",
        description: "Gather 600 alloy, 400 crystal, and 200 void essence.",
        icon: "Cog",
        type: "resource",
        requirement: { kind: "gather_resources", target: "alloy:600,crystal:400,void_essence:200" },
        rewards: { xp: 300, item: "tech_core_blueprint" },
      },
      {
        stepId: "tech_4",
        name: "Tower Defense Architect",
        description: "Defend your base from 15 raids without losing. Grandmaster's Focus talent can skip.",
        icon: "Shield",
        type: "combat",
        requirement: { kind: "defense_wins", count: 15, skipWithTalent: "grandmasters_focus" },
        rewards: { xp: 600, dream: 100 },
      },
      {
        stepId: "tech_5",
        name: "The Technomancer's Awakening",
        description: "Upgrade your station to Tier 4 (Citadel).",
        icon: "Zap",
        type: "crafting",
        requirement: { kind: "station_tier", minLevel: 4 },
        rewards: { xp: 800 },
      },
    ],
    completionReward: {
      prestigeClass: "technomancer",
      title: "Technomancer",
      xp: 2000,
      dream: 500,
      exclusiveItem: "technomancer_exosuit",
    },
  },

  /* ═══ BLADE DANCER — Assassin → Lethal Artist ═══ */
  {
    key: "path_of_the_blade_dancer",
    prestigeClass: "blade_dancer",
    name: "Path of the Blade Dancer",
    description: "Death is an art form. The Blade Dancer turns combat into poetry.",
    icon: "Swords",
    color: "#ec4899",
    requiredBaseClass: "assassin",
    requiredClassRank: 3,
    requiredLevel: 15,
    steps: [
      {
        stepId: "blade_1",
        name: "Flawless Execution",
        description: "Win 15 fight encounters without taking damage.",
        icon: "Swords",
        type: "combat",
        requirement: { kind: "flawless_fights", count: 15 },
        rewards: { xp: 500, dream: 50 },
      },
      {
        stepId: "blade_2",
        name: "Shadow Arts",
        description: "Achieve Endurance civil skill level 4 and Tactics level 3.",
        icon: "Moon",
        type: "knowledge",
        requirement: { kind: "multi_civil_skill_check", target: "endurance:4,tactics:3" },
        rewards: { xp: 400, credits: 200 },
      },
      {
        stepId: "blade_3",
        name: "Venom Synthesis",
        description: "Craft 20 poison items at your crafting bay.",
        icon: "FlaskConical",
        type: "crafting",
        requirement: { kind: "craft_items", target: "poison", count: 20 },
        rewards: { xp: 300, item: "blade_dancer_dagger_blueprint" },
      },
      {
        stepId: "blade_4",
        name: "The Gauntlet",
        description: "Defeat 5 boss battles solo. Battle Hardened talent can skip.",
        icon: "Skull",
        type: "combat",
        requirement: { kind: "boss_kills_solo", count: 5, skipWithTalent: "battle_hardened" },
        rewards: { xp: 600, dream: 100 },
      },
      {
        stepId: "blade_5",
        name: "Dance of Blades",
        description: "Achieve a 10-win streak in PvP.",
        icon: "Sparkles",
        type: "combat",
        requirement: { kind: "pvp_win_streak", count: 10 },
        rewards: { xp: 800 },
      },
    ],
    completionReward: {
      prestigeClass: "blade_dancer",
      title: "Blade Dancer",
      xp: 2000,
      dream: 500,
      exclusiveItem: "blade_dancer_twin_daggers",
    },
  },
];

/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

/**
 * Get the prestige quest chain for a given prestige class.
 */
export function getPrestigeQuestChain(prestigeClass: string): PrestigeQuestChain | undefined {
  return PRESTIGE_QUEST_CHAINS.find(q => q.prestigeClass === prestigeClass);
}

/**
 * Check if a player can start a prestige quest chain.
 */
export function canStartPrestigeQuest(
  chain: PrestigeQuestChain,
  opts: { characterClass: string; classRank: number; citizenLevel: number }
): { canStart: boolean; reason?: string } {
  if (opts.characterClass !== chain.requiredBaseClass) {
    return { canStart: false, reason: `Requires ${chain.requiredBaseClass} class` };
  }
  if (opts.classRank < chain.requiredClassRank) {
    return { canStart: false, reason: `Requires class rank ${chain.requiredClassRank}+` };
  }
  if (opts.citizenLevel < chain.requiredLevel) {
    return { canStart: false, reason: `Requires citizen level ${chain.requiredLevel}+` };
  }
  return { canStart: true };
}

/**
 * Check if a quest step can be skipped by a talent.
 */
export function canSkipStep(step: PrestigeQuestStep, talents: string[]): boolean {
  if (!step.requirement.skipWithTalent) return false;
  return talents.includes(step.requirement.skipWithTalent);
}

/**
 * Calculate quest XP bonus from achievement traits.
 */
export function getQuestXpMultiplier(achievementTraits: string[]): number {
  let mult = 1.0;
  if (achievementTraits.includes("lore_seeker")) mult += 0.15;
  if (achievementTraits.includes("completionist")) mult += 0.10;
  return mult;
}
