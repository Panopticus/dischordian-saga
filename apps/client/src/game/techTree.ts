/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE TECH TREE — Civilization-style Research

   Three branches: Military, Economic, Diplomatic.
   Each branch has 5 tiers of technologies that unlock
   new capabilities in Trade Empire, affect guild wars,
   and modify resource generation across all game modes.

   StarCraft upgrades, EU4 idea groups

   Research costs Influence + time. Higher tiers require
   prerequisites from the same branch.
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export type TechBranch = "military" | "economic" | "diplomatic";

export interface Technology {
  id: string;
  name: string;
  branch: TechBranch;
  tier: 1 | 2 | 3 | 4 | 5;
  /** What this tech unlocks or modifies */
  description: string;
  /** Lore flavor text */
  loreText: string;
  /** Research cost */
  cost: { influence: number; dream?: number; voidCrystals?: number };
  /** Research time in hours */
  researchHours: number;
  /** Prerequisites (tech IDs that must be completed first) */
  prerequisites: string[];
  /** Gameplay effects */
  effects: TechEffect[];
  /** Civ-style civics fork: techs in this list become unresearchable
   *  once any sibling in the group is researched. Shared symmetric set —
   *  if A lists B in mutexWith then B should list A. The forks are the
   *  only mechanism in the tree where research is a real *choice*. */
  mutexWith?: string[];
}

export interface TechSynergy {
  id: string;
  /** Required tech ids — every entry must be researched for the bonus
   *  to apply. */
  requires: string[];
  name: string;
  description: string;
  /** Effects accumulated alongside per-tech effects in getTotalEffects. */
  effects: TechEffect[];
}

export type TechEffect =
  | { type: "fleet_combat"; bonus: number; percent: boolean }
  | { type: "fleet_cargo"; bonus: number; percent: boolean }
  | { type: "trade_profit"; bonus: number; percent: boolean }
  | { type: "mission_speed"; bonus: number; percent: boolean }
  | { type: "diplomacy_bonus"; bonus: number; percent: boolean }
  | { type: "war_points"; bonus: number; percent: boolean }
  | { type: "resource_generation"; resource: string; bonus: number; percent: boolean }
  | { type: "unlock_feature"; feature: string; description: string }
  | { type: "agent_slots"; bonus: number }
  | { type: "sector_income"; bonus: number; percent: boolean }
  | { type: "guild_xp"; bonus: number; percent: boolean };

export interface TechTreeState {
  researched: string[];
  currentResearch: { techId: string; startedAt: number; endsAt: number } | null;
  totalResearched: number;
}

/* ─── MILITARY BRANCH ─── */

const MILITARY_TECHS: Technology[] = [
  // Tier 1
  {
    id: "mil_basic_tactics",
    name: "Basic Fleet Tactics",
    branch: "military", tier: 1,
    description: "Fundamental combat formations increase fleet effectiveness.",
    loreText: "The Insurgency's tactical manuals survived the Fall. Their formations are brutal but effective.",
    cost: { influence: 10 }, researchHours: 2,
    prerequisites: [],
    effects: [{ type: "fleet_combat", bonus: 10, percent: true }],
  },
  {
    id: "mil_armor_plating",
    name: "Reinforced Hull Plating",
    branch: "military", tier: 1,
    description: "Thicker hull armor reduces fleet losses in combat.",
    loreText: "Ark 1047's engineers reverse-engineered Panopticon armor composites.",
    cost: { influence: 15 }, researchHours: 3,
    prerequisites: [],
    effects: [{ type: "fleet_cargo", bonus: 5, percent: true }, { type: "war_points", bonus: 5, percent: true }],
  },
  // Tier 2
  {
    id: "mil_advanced_weapons",
    name: "Advanced Weapon Systems",
    branch: "military", tier: 2,
    description: "Next-generation weapons technology from Agent Zero's cache.",
    loreText: "Agent Zero's weapons cache contained schematics the Insurgency never deployed. Until now.",
    cost: { influence: 30, dream: 50 }, researchHours: 6,
    prerequisites: ["mil_basic_tactics"],
    effects: [{ type: "fleet_combat", bonus: 20, percent: true }, { type: "unlock_feature", feature: "orbital_strike", description: "Unlock Orbital Strike in guild wars" }],
  },
  {
    id: "mil_rapid_deployment",
    name: "Rapid Deployment Protocol",
    branch: "military", tier: 2,
    description: "Faster fleet mobilization for missions and combat.",
    loreText: "The Warlord's blitzkrieg doctrine — adapted for less genocidal purposes.",
    cost: { influence: 25 }, researchHours: 5,
    prerequisites: ["mil_armor_plating"],
    effects: [{ type: "mission_speed", bonus: 15, percent: true }],
  },
  // Tier 3
  {
    id: "mil_terminus_doctrine",
    name: "Terminus Doctrine",
    branch: "military", tier: 3,
    description: "Combat strategies adapted from Terminus swarm patterns.",
    loreText: "Study the swarm long enough and its patterns become predictable. Then they become weapons.",
    cost: { influence: 50, dream: 100 }, researchHours: 12,
    prerequisites: ["mil_advanced_weapons", "mil_rapid_deployment"],
    effects: [{ type: "fleet_combat", bonus: 30, percent: true }, { type: "war_points", bonus: 15, percent: true }],
  },
  // Tier 4
  {
    id: "mil_archon_tactics",
    name: "Archon Battle Protocols",
    branch: "military", tier: 4,
    description: "Military knowledge extracted from The Human's Archon memories.",
    loreText: "The Human served 1,351 years as an Archon. His military knowledge spans civilizations.",
    cost: { influence: 80, dream: 200, voidCrystals: 10 }, researchHours: 24,
    prerequisites: ["mil_terminus_doctrine"],
    effects: [{ type: "fleet_combat", bonus: 40, percent: true }, { type: "agent_slots", bonus: 2 }],
  },
  // Tier 5
  {
    id: "mil_iron_lion_legacy",
    name: "Iron Lion's Legacy",
    branch: "military", tier: 5,
    description: "The last great human general's ultimate battle strategy.",
    loreText: "Iron Lion fought the machines to a standstill. His final strategy was never executed — until now.",
    cost: { influence: 150, dream: 500, voidCrystals: 25 }, researchHours: 48,
    prerequisites: ["mil_archon_tactics"],
    effects: [
      { type: "fleet_combat", bonus: 50, percent: true },
      { type: "war_points", bonus: 25, percent: true },
      { type: "unlock_feature", feature: "dreadnought", description: "Unlock Dreadnought capital ship for guild fleet" },
    ],
  },
  /* ─── Civics fork: choose one doctrine per prestige cycle ─── */
  {
    id: "mil_doctrine_aggression",
    name: "Doctrine of Aggression",
    branch: "military", tier: 2,
    description: "All-offense fleet posture. Excludes Doctrine of Attrition.",
    loreText: "The Warlord's notebook closed with a single line: 'Hesitation is the only true defeat.'",
    cost: { influence: 35, dream: 60 }, researchHours: 6,
    prerequisites: ["mil_basic_tactics"],
    mutexWith: ["mil_doctrine_attrition"],
    effects: [{ type: "fleet_combat", bonus: 25, percent: true }],
  },
  {
    id: "mil_doctrine_attrition",
    name: "Doctrine of Attrition",
    branch: "military", tier: 2,
    description: "Endurance-first fleet posture. Excludes Doctrine of Aggression.",
    loreText: "Iron Lion's discarded draft: 'A fleet that survives the second day wins the war.'",
    cost: { influence: 35, dream: 60 }, researchHours: 6,
    prerequisites: ["mil_armor_plating"],
    mutexWith: ["mil_doctrine_aggression"],
    effects: [
      { type: "fleet_cargo", bonus: 25, percent: true },
      { type: "war_points", bonus: 10, percent: true },
    ],
  },
];

/* ─── ECONOMIC BRANCH ─── */

const ECONOMIC_TECHS: Technology[] = [
  // Tier 1
  {
    id: "eco_trade_routes",
    name: "Expanded Trade Routes",
    branch: "economic", tier: 1,
    description: "Open new shipping lanes between sectors.",
    loreText: "Locke's trade network extends further than anyone realized. Time to map it.",
    cost: { influence: 10 }, researchHours: 2,
    prerequisites: [],
    effects: [{ type: "trade_profit", bonus: 10, percent: true }],
  },
  {
    id: "eco_cargo_optimization",
    name: "Cargo Optimization",
    branch: "economic", tier: 1,
    description: "Better packing algorithms increase cargo capacity.",
    loreText: "The Engineer's logistics algorithms — elegant, efficient, inhuman.",
    cost: { influence: 12 }, researchHours: 2,
    prerequisites: [],
    effects: [{ type: "fleet_cargo", bonus: 15, percent: true }],
  },
  // Tier 2
  {
    id: "eco_market_manipulation",
    name: "Market Intelligence",
    branch: "economic", tier: 2,
    description: "Access Locke's insider trading network for better margins.",
    loreText: "New Babylon's markets are rigged. Locke shows you exactly how.",
    cost: { influence: 25, dream: 40 }, researchHours: 5,
    prerequisites: ["eco_trade_routes"],
    effects: [{ type: "trade_profit", bonus: 20, percent: true }, { type: "resource_generation", resource: "dream", bonus: 5, percent: true }],
  },
  {
    id: "eco_resource_extraction",
    name: "Advanced Resource Extraction",
    branch: "economic", tier: 2,
    description: "More efficient resource gathering from controlled sectors.",
    loreText: "The Antiquarian's archives contained mining techniques from civilizations that no longer exist.",
    cost: { influence: 20, dream: 30 }, researchHours: 4,
    prerequisites: ["eco_cargo_optimization"],
    effects: [{ type: "sector_income", bonus: 15, percent: true }, { type: "resource_generation", resource: "salvage", bonus: 10, percent: true }],
  },
  // Tier 3
  {
    id: "eco_new_babylon_accord",
    name: "New Babylon Trade Accord",
    branch: "economic", tier: 3,
    description: "Full access to New Babylon's interstellar trade network.",
    loreText: "Everything has a price. Today, the price is acceptable.",
    cost: { influence: 50, dream: 100 }, researchHours: 10,
    prerequisites: ["eco_market_manipulation", "eco_resource_extraction"],
    effects: [
      { type: "trade_profit", bonus: 35, percent: true },
      { type: "unlock_feature", feature: "black_market", description: "Unlock Black Market trades with rare materials" },
    ],
  },
  // Tier 4
  {
    id: "eco_void_harvesting",
    name: "Void Crystal Harvesting",
    branch: "economic", tier: 4,
    description: "Extract Void Crystals from the space between dimensions.",
    loreText: "The space between realities isn't empty. It's full of crystallized potential.",
    cost: { influence: 80, dream: 200, voidCrystals: 5 }, researchHours: 20,
    prerequisites: ["eco_new_babylon_accord"],
    effects: [{ type: "resource_generation", resource: "voidCrystals", bonus: 20, percent: true }, { type: "sector_income", bonus: 25, percent: true }],
  },
  // Tier 5
  {
    id: "eco_galactic_monopoly",
    name: "Galactic Trade Monopoly",
    branch: "economic", tier: 5,
    description: "Total economic dominance. New Babylon has nothing on you.",
    loreText: "Locke smiles for the first time. 'You've surpassed me. The student becomes the house.'",
    cost: { influence: 150, dream: 500, voidCrystals: 25 }, researchHours: 48,
    prerequisites: ["eco_void_harvesting"],
    effects: [
      { type: "trade_profit", bonus: 50, percent: true },
      { type: "resource_generation", resource: "dream", bonus: 15, percent: true },
      { type: "unlock_feature", feature: "trade_station", description: "Build a personal Trade Station generating passive income" },
    ],
  },
  /* ─── Civics fork: choose one economic doctrine per prestige cycle ─── */
  {
    id: "eco_doctrine_free_market",
    name: "Free Market Doctrine",
    branch: "economic", tier: 2,
    description: "Profit through deregulated commerce. Excludes Command Economy.",
    loreText: "Locke's gospel: 'Price is the only signal that doesn't lie.'",
    cost: { influence: 35, dream: 50 }, researchHours: 6,
    prerequisites: ["eco_trade_routes"],
    mutexWith: ["eco_doctrine_command_economy"],
    effects: [{ type: "trade_profit", bonus: 30, percent: true }],
  },
  {
    id: "eco_doctrine_command_economy",
    name: "Command Economy",
    branch: "economic", tier: 2,
    description: "Profit through controlled extraction. Excludes Free Market.",
    loreText: "The Antiquarian's dry footnote: 'Every empire that planned its grain stores outlasted the ones that priced them.'",
    cost: { influence: 35, dream: 50 }, researchHours: 6,
    prerequisites: ["eco_cargo_optimization"],
    mutexWith: ["eco_doctrine_free_market"],
    effects: [
      { type: "sector_income", bonus: 25, percent: true },
      { type: "resource_generation", resource: "salvage", bonus: 10, percent: true },
    ],
  },
];

/* ─── DIPLOMATIC BRANCH ─── */

const DIPLOMATIC_TECHS: Technology[] = [
  // Tier 1
  {
    id: "dip_first_contact",
    name: "First Contact Protocols",
    branch: "diplomatic", tier: 1,
    description: "Better NPC relationship building — faster trust gains.",
    loreText: "Elara's communication algorithms adapted for inter-faction diplomacy.",
    cost: { influence: 10 }, researchHours: 2,
    prerequisites: [],
    effects: [{ type: "diplomacy_bonus", bonus: 10, percent: true }],
  },
  {
    id: "dip_intelligence_network",
    name: "Intelligence Network",
    branch: "diplomatic", tier: 1,
    description: "Recruit agent operatives for diplomatic missions.",
    loreText: "Agent Zero's network wasn't destroyed. It was sleeping.",
    cost: { influence: 15 }, researchHours: 3,
    prerequisites: [],
    effects: [{ type: "agent_slots", bonus: 1 }, { type: "mission_speed", bonus: 10, percent: true }],
  },
  // Tier 2
  {
    id: "dip_faction_envoys",
    name: "Faction Envoys",
    branch: "diplomatic", tier: 2,
    description: "Send envoys to improve relations with all discovered factions.",
    loreText: "The Antiquarian suggests: 'Send them stories. Every faction values their own mythology.'",
    cost: { influence: 25, dream: 30 }, researchHours: 5,
    prerequisites: ["dip_first_contact"],
    effects: [{ type: "diplomacy_bonus", bonus: 20, percent: true }, { type: "guild_xp", bonus: 10, percent: true }],
  },
  {
    id: "dip_espionage",
    name: "Espionage Division",
    branch: "diplomatic", tier: 2,
    description: "Covert operatives gather intelligence on rival factions.",
    loreText: "The Human taught you: 'The best detective is the one nobody knows exists.'",
    cost: { influence: 30, dream: 40 }, researchHours: 6,
    prerequisites: ["dip_intelligence_network"],
    effects: [{ type: "agent_slots", bonus: 2 }, { type: "unlock_feature", feature: "spy_missions", description: "Unlock espionage missions in Trade Empire" }],
  },
  // Tier 3
  {
    id: "dip_alliance_charter",
    name: "Alliance Charter",
    branch: "diplomatic", tier: 3,
    description: "Form official alliances with discovered factions for mutual benefit.",
    loreText: "Even enemies can be allies when the alternative is extinction.",
    cost: { influence: 50, dream: 100 }, researchHours: 10,
    prerequisites: ["dip_faction_envoys", "dip_espionage"],
    effects: [
      { type: "diplomacy_bonus", bonus: 35, percent: true },
      { type: "war_points", bonus: 10, percent: true },
      { type: "unlock_feature", feature: "alliance_missions", description: "Unlock cooperative faction missions" },
    ],
  },
  // Tier 4
  {
    id: "dip_shadow_diplomacy",
    name: "Shadow Diplomacy",
    branch: "diplomatic", tier: 4,
    description: "Negotiate with the Hierarchy of the Damned. Dangerous but powerful.",
    loreText: "The Shadow Tongue offers: 'I can make anyone believe anything. For a price.'",
    cost: { influence: 80, dream: 200, voidCrystals: 10 }, researchHours: 24,
    prerequisites: ["dip_alliance_charter"],
    effects: [
      { type: "diplomacy_bonus", bonus: 40, percent: true },
      { type: "unlock_feature", feature: "hierarchy_deals", description: "Negotiate forbidden pacts with the Hierarchy" },
    ],
  },
  // Tier 5
  {
    id: "dip_architects_accord",
    name: "The Architect's Accord",
    branch: "diplomatic", tier: 5,
    description: "Unite all factions under a single banner. The ultimate diplomatic achievement.",
    loreText: "The Programmer whispers: 'This is how it was supposed to work. All voices. One song.'",
    cost: { influence: 150, dream: 500, voidCrystals: 25 }, researchHours: 48,
    prerequisites: ["dip_shadow_diplomacy"],
    effects: [
      { type: "diplomacy_bonus", bonus: 50, percent: true },
      { type: "guild_xp", bonus: 25, percent: true },
      { type: "unlock_feature", feature: "galactic_council", description: "Establish the Galactic Council — endgame faction management" },
    ],
  },
  /* ─── Civics fork: choose one diplomatic doctrine per prestige cycle ─── */
  {
    id: "dip_doctrine_open",
    name: "Open Diplomacy Doctrine",
    branch: "diplomatic", tier: 2,
    description: "Soft-power negotiation. Excludes Realpolitik.",
    loreText: "Elara's first protocol: 'The hardest thing to negotiate against is sincerity.'",
    cost: { influence: 30, dream: 40 }, researchHours: 5,
    prerequisites: ["dip_first_contact"],
    mutexWith: ["dip_doctrine_realpolitik"],
    effects: [{ type: "diplomacy_bonus", bonus: 30, percent: true }],
  },
  {
    id: "dip_doctrine_realpolitik",
    name: "Realpolitik Doctrine",
    branch: "diplomatic", tier: 2,
    description: "Pragmatic negotiation backed by intelligence. Excludes Open Diplomacy.",
    loreText: "The Human's dry assessment: 'Trust the signal, not the speaker.'",
    cost: { influence: 30, dream: 40 }, researchHours: 5,
    prerequisites: ["dip_intelligence_network"],
    mutexWith: ["dip_doctrine_open"],
    effects: [
      { type: "diplomacy_bonus", bonus: 20, percent: true },
      { type: "agent_slots", bonus: 1 },
    ],
  },
];

/* ─── COMBINED TREE ─── */

export const ALL_TECHNOLOGIES: Technology[] = [
  ...MILITARY_TECHS,
  ...ECONOMIC_TECHS,
  ...DIPLOMATIC_TECHS,
];

/* ─── CROSS-BRANCH SYNERGIES ─── */

export const TECH_SYNERGIES: TechSynergy[] = [
  {
    id: "syn_combined_arms",
    requires: ["mil_advanced_weapons", "dip_espionage"],
    name: "Combined Arms Intelligence",
    description: "Espionage and frontline weapons share targeting data.",
    effects: [
      { type: "fleet_combat", bonus: 5, percent: true },
      { type: "war_points", bonus: 5, percent: true },
    ],
  },
  {
    id: "syn_trade_diplomacy",
    requires: ["eco_market_manipulation", "dip_first_contact"],
    name: "Trade Diplomacy",
    description: "Insider markets reward established diplomatic ties.",
    effects: [{ type: "trade_profit", bonus: 10, percent: true }],
  },
  {
    id: "syn_void_armada",
    requires: ["mil_terminus_doctrine", "eco_void_harvesting"],
    name: "Void Armada",
    description: "Void-crystal-fueled fleets adapt the Terminus swarm tempo.",
    effects: [{ type: "fleet_combat", bonus: 15, percent: true }],
  },
  {
    id: "syn_trade_alliance",
    requires: ["dip_alliance_charter", "eco_new_babylon_accord"],
    name: "Trade Alliance",
    description: "Charters with anchor markets stabilize both sides.",
    effects: [
      { type: "diplomacy_bonus", bonus: 10, percent: true },
      { type: "trade_profit", bonus: 10, percent: true },
    ],
  },
];

/* ─── HELPERS ─── */

export function getTechById(id: string): Technology | undefined {
  return ALL_TECHNOLOGIES.find(t => t.id === id);
}

export function getTechsByBranch(branch: TechBranch): Technology[] {
  return ALL_TECHNOLOGIES.filter(t => t.branch === branch).sort((a, b) => a.tier - b.tier);
}

export function canResearch(techId: string, researched: string[]): boolean {
  const tech = getTechById(techId);
  if (!tech) return false;
  if (researched.includes(techId)) return false;
  if (!tech.prerequisites.every(p => researched.includes(p))) return false;
  if (tech.mutexWith?.some(m => researched.includes(m))) return false;
  return true;
}

export function getActiveSynergies(researched: string[]): TechSynergy[] {
  const set = new Set(researched);
  return TECH_SYNERGIES.filter(s => s.requires.every(r => set.has(r)));
}

export function getTotalEffects(researched: string[]): Record<string, number> {
  const totals: Record<string, number> = {};
  const accumulate = (effects: TechEffect[]) => {
    for (const effect of effects) {
      if ("bonus" in effect) {
        totals[effect.type] = (totals[effect.type] || 0) + effect.bonus;
      }
    }
  };
  for (const id of researched) {
    const tech = getTechById(id);
    if (tech) accumulate(tech.effects);
  }
  for (const synergy of getActiveSynergies(researched)) {
    accumulate(synergy.effects);
  }
  return totals;
}

export function getResearchProgress(state: TechTreeState): {
  military: number; economic: number; diplomatic: number; total: number;
} {
  const byBranch = { military: 0, economic: 0, diplomatic: 0 };
  for (const id of state.researched) {
    const tech = getTechById(id);
    if (tech) byBranch[tech.branch]++;
  }
  return {
    ...byBranch,
    total: state.researched.length,
  };
}

export const DEFAULT_TECH_STATE: TechTreeState = {
  researched: [],
  currentResearch: null,
  totalResearched: 0,
};
