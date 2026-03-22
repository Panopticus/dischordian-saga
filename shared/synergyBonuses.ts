/**
 * SYNERGY BONUS SYSTEM (Recommendation 4.1)
 * ─────────────────────────────────────────
 * Inspired by Hades Duo Boons and BG3 Multiclass Synergies.
 * Specific combinations of species + class + element + alignment
 * unlock hidden synergy bonuses that reward thoughtful character building.
 *
 * Players discover synergies organically through gameplay and see them
 * displayed in the Character Bonuses panel on their profile.
 */

import type { CitizenData } from "./citizenTraits";

/* ═══════════════════════════════════════════════════════
   SYNERGY DEFINITION
   ═══════════════════════════════════════════════════════ */

export interface SynergyBonus {
  /** Unique key for this synergy */
  key: string;
  /** Display name */
  name: string;
  /** Lore-flavored description */
  description: string;
  /** Icon identifier for UI (lucide icon name) */
  icon: string;
  /** Color hex for UI glow */
  color: string;
  /** Which build axes must match (null = any value accepted) */
  requirements: {
    species?: CitizenData["species"] | null;
    characterClass?: CitizenData["characterClass"] | null;
    alignment?: CitizenData["alignment"] | null;
    element?: CitizenData["element"] | null;
    minAttrAttack?: number;
    minAttrDefense?: number;
    minAttrVitality?: number;
  };
  /** Mechanical effects applied across game systems */
  effects: SynergyEffect[];
  /** Rarity tier for UI display */
  rarity: "uncommon" | "rare" | "legendary";
}

export interface SynergyEffect {
  /** Which game system this affects */
  system: "card_game" | "trade_empire" | "fight" | "chess" | "guild_war" | "quest" | "market" | "crafting" | "all";
  /** Effect type */
  type: "multiplier" | "flat" | "passive" | "unlock";
  /** What stat/mechanic is affected */
  target: string;
  /** Numeric value */
  value: number;
  /** Human-readable description */
  label: string;
}

/* ═══════════════════════════════════════════════════════
   SYNERGY DEFINITIONS — 24 total synergies
   3 tiers: 12 uncommon, 8 rare, 4 legendary
   ═══════════════════════════════════════════════════════ */

export const SYNERGY_BONUSES: SynergyBonus[] = [
  /* ─── UNCOMMON SYNERGIES (2-axis combos) ─── */
  {
    key: "volcanic_blood",
    name: "Volcanic Blood",
    description: "Quarchon warriors channel fire through their crystalline armor, superheating their strikes.",
    icon: "Flame",
    color: "#ef4444",
    rarity: "uncommon",
    requirements: { species: "quarchon", element: "fire" },
    effects: [
      { system: "fight", type: "flat", target: "fire_damage_bonus", value: 5, label: "+5 fire damage per hit" },
      { system: "card_game", type: "multiplier", target: "fire_card_atk", value: 1.15, label: "+15% fire card ATK" },
    ],
  },
  {
    key: "neural_network",
    name: "Neural Network",
    description: "DeMagi engineers weave organic circuitry into their constructs, creating living machines.",
    icon: "Cpu",
    color: "#22d3ee",
    rarity: "uncommon",
    requirements: { species: "demagi", characterClass: "engineer" },
    effects: [
      { system: "crafting", type: "multiplier", target: "craft_success", value: 1.15, label: "+15% crafting success rate" },
      { system: "trade_empire", type: "multiplier", target: "colony_production", value: 1.10, label: "+10% colony production" },
    ],
  },
  {
    key: "shadow_protocol",
    name: "Shadow Protocol",
    description: "Ne-Yon spies operate between dimensions, their hybrid nature making them impossible to track.",
    icon: "Ghost",
    color: "#a78bfa",
    rarity: "uncommon",
    requirements: { species: "neyon", characterClass: "spy" },
    effects: [
      { system: "guild_war", type: "multiplier", target: "sabotage_power", value: 1.20, label: "+20% sabotage effectiveness" },
      { system: "market", type: "multiplier", target: "tax_reduction", value: 0.90, label: "10% additional tax reduction" },
    ],
  },
  {
    key: "order_of_steel",
    name: "Order of Steel",
    description: "Disciplined soldiers who follow the path of Order become unbreakable in formation.",
    icon: "Shield",
    color: "#3b82f6",
    rarity: "uncommon",
    requirements: { alignment: "order", characterClass: "soldier" },
    effects: [
      { system: "fight", type: "multiplier", target: "armor_effectiveness", value: 1.20, label: "+20% armor effectiveness" },
      { system: "guild_war", type: "multiplier", target: "reinforce_power", value: 1.15, label: "+15% reinforce effectiveness" },
    ],
  },
  {
    key: "chaos_blade",
    name: "Chaos Blade",
    description: "Assassins who embrace Chaos strike with unpredictable, devastating precision.",
    icon: "Swords",
    color: "#dc2626",
    rarity: "uncommon",
    requirements: { alignment: "chaos", characterClass: "assassin" },
    effects: [
      { system: "fight", type: "flat", target: "crit_chance_bonus", value: 0.08, label: "+8% critical hit chance" },
      { system: "card_game", type: "flat", target: "first_strike_bonus", value: 3, label: "+3 first strike damage" },
    ],
  },
  {
    key: "temporal_sight",
    name: "Temporal Sight",
    description: "Oracles attuned to the Time dimension perceive multiple futures simultaneously.",
    icon: "Clock",
    color: "#f59e0b",
    rarity: "uncommon",
    requirements: { characterClass: "oracle", element: "time" },
    effects: [
      { system: "chess", type: "flat", target: "time_bonus", value: 15, label: "+15s chess time bonus" },
      { system: "quest", type: "multiplier", target: "reward_multiplier", value: 1.10, label: "+10% quest rewards" },
    ],
  },
  {
    key: "probability_engine",
    name: "Probability Engine",
    description: "Engineers who master Probability create devices that bend luck itself.",
    icon: "Dice5",
    color: "#10b981",
    rarity: "uncommon",
    requirements: { characterClass: "engineer", element: "probability" },
    effects: [
      { system: "crafting", type: "passive", target: "bonus_craft_chance", value: 0.12, label: "12% chance for bonus craft result" },
      { system: "all", type: "passive", target: "rng_improvement", value: 0.05, label: "+5% to all RNG outcomes" },
    ],
  },
  {
    key: "void_walker",
    name: "Void Walker",
    description: "Those attuned to Space move through the void between stars with effortless grace.",
    icon: "Orbit",
    color: "#6366f1",
    rarity: "uncommon",
    requirements: { element: "space" },
    effects: [
      { system: "trade_empire", type: "multiplier", target: "warp_cost", value: 0.80, label: "20% reduced warp costs" },
      { system: "trade_empire", type: "flat", target: "scan_range", value: 2, label: "+2 scan range" },
    ],
  },
  {
    key: "earth_anchor",
    name: "Earth Anchor",
    description: "Earth-attuned warriors root themselves in battle, becoming immovable fortresses.",
    icon: "Mountain",
    color: "#78716c",
    rarity: "uncommon",
    requirements: { element: "earth", characterClass: "soldier" },
    effects: [
      { system: "fight", type: "multiplier", target: "max_hp", value: 1.15, label: "+15% max HP in fights" },
      { system: "guild_war", type: "multiplier", target: "capture_speed", value: 1.10, label: "+10% territory capture speed" },
    ],
  },
  {
    key: "reality_weave",
    name: "Reality Weave",
    description: "Spies who manipulate Reality see through all deceptions and create their own.",
    icon: "Eye",
    color: "#ec4899",
    rarity: "uncommon",
    requirements: { characterClass: "spy", element: "reality" },
    effects: [
      { system: "market", type: "unlock", target: "see_hidden_listings", value: 1, label: "See hidden marketplace listings" },
      { system: "guild_war", type: "unlock", target: "see_enemy_plans", value: 1, label: "See enemy guild war plans" },
    ],
  },
  {
    key: "water_sage",
    name: "Water Sage",
    description: "DeMagi oracles channel the deep currents of Water to heal and foresee.",
    icon: "Droplets",
    color: "#06b6d4",
    rarity: "uncommon",
    requirements: { species: "demagi", element: "water" },
    effects: [
      { system: "fight", type: "passive", target: "regen_per_turn", value: 3, label: "Regenerate 3 HP per turn in fights" },
      { system: "card_game", type: "flat", target: "hp_bonus", value: 5, label: "+5 starting HP in card battles" },
    ],
  },
  {
    key: "air_dancer",
    name: "Air Dancer",
    description: "Assassins attuned to Air strike like the wind — swift, silent, and everywhere at once.",
    icon: "Wind",
    color: "#94a3b8",
    rarity: "uncommon",
    requirements: { characterClass: "assassin", element: "air" },
    effects: [
      { system: "fight", type: "passive", target: "dodge_chance", value: 0.10, label: "+10% dodge chance" },
      { system: "fight", type: "multiplier", target: "attack_speed", value: 1.15, label: "+15% attack speed" },
    ],
  },

  /* ─── RARE SYNERGIES (3-axis combos) ─── */
  {
    key: "inferno_strike",
    name: "Inferno Strike",
    description: "Quarchon assassins who channel Fire deliver strikes that burn through any defense.",
    icon: "Zap",
    color: "#f97316",
    rarity: "rare",
    requirements: { species: "quarchon", characterClass: "assassin", element: "fire" },
    effects: [
      { system: "fight", type: "passive", target: "fire_first_strike", value: 0.25, label: "First attack deals +25% fire damage" },
      { system: "card_game", type: "flat", target: "burn_damage", value: 2, label: "Fire cards inflict 2 burn damage per turn" },
      { system: "guild_war", type: "multiplier", target: "sabotage_power", value: 1.15, label: "+15% sabotage in fire territories" },
    ],
  },
  {
    key: "tectonic_forge",
    name: "Tectonic Forge",
    description: "DeMagi engineers who master Earth shape raw materials with thought alone.",
    icon: "Hammer",
    color: "#a16207",
    rarity: "rare",
    requirements: { species: "demagi", characterClass: "engineer", element: "earth" },
    effects: [
      { system: "crafting", type: "multiplier", target: "craft_success", value: 1.20, label: "+20% crafting success rate" },
      { system: "crafting", type: "passive", target: "material_cost_reduction", value: 0.15, label: "15% material cost reduction" },
      { system: "trade_empire", type: "multiplier", target: "colony_production", value: 1.15, label: "+15% colony production" },
    ],
  },
  {
    key: "temporal_mastery",
    name: "Temporal Mastery",
    description: "Ne-Yon oracles who perceive Time exist in multiple moments simultaneously.",
    icon: "Timer",
    color: "#8b5cf6",
    rarity: "rare",
    requirements: { species: "neyon", characterClass: "oracle", element: "time" },
    effects: [
      { system: "chess", type: "multiplier", target: "time_bonus", value: 2.0, label: "Chess time bonus doubled" },
      { system: "quest", type: "multiplier", target: "reward_multiplier", value: 1.25, label: "+25% quest rewards" },
      { system: "all", type: "multiplier", target: "xp_bonus", value: 1.10, label: "+10% all XP gains" },
    ],
  },
  {
    key: "reality_breaker",
    name: "Reality Breaker",
    description: "Quarchon soldiers who bend Reality shatter the very ground beneath enemy fortifications.",
    icon: "Sparkles",
    color: "#e11d48",
    rarity: "rare",
    requirements: { species: "quarchon", characterClass: "soldier", element: "reality" },
    effects: [
      { system: "guild_war", type: "multiplier", target: "capture_speed", value: 1.30, label: "+30% capture speed in reality territories" },
      { system: "fight", type: "multiplier", target: "armor_pierce", value: 1.20, label: "+20% armor penetration" },
      { system: "card_game", type: "flat", target: "global_atk", value: 2, label: "+2 ATK to all summoned units" },
    ],
  },
  {
    key: "tidal_prophecy",
    name: "Tidal Prophecy",
    description: "DeMagi oracles who channel Water see the currents of fate flowing through all things.",
    icon: "Waves",
    color: "#0ea5e9",
    rarity: "rare",
    requirements: { species: "demagi", characterClass: "oracle", element: "water" },
    effects: [
      { system: "card_game", type: "unlock", target: "see_top_deck", value: 2, label: "See top 2 cards of own deck" },
      { system: "chess", type: "flat", target: "undo_moves", value: 1, label: "+1 undo move per chess game" },
      { system: "quest", type: "flat", target: "daily_quest_slots", value: 1, label: "+1 daily quest slot" },
    ],
  },
  {
    key: "loaded_dice",
    name: "Loaded Dice",
    description: "Ne-Yon spies who manipulate Probability tilt every outcome in their favor.",
    icon: "Dices",
    color: "#14b8a6",
    rarity: "rare",
    requirements: { species: "neyon", characterClass: "spy", element: "probability" },
    effects: [
      { system: "all", type: "passive", target: "rng_improvement", value: 0.15, label: "+15% to all RNG outcomes" },
      { system: "market", type: "multiplier", target: "sell_bonus", value: 1.15, label: "+15% sell price bonus" },
      { system: "crafting", type: "passive", target: "bonus_craft_chance", value: 0.15, label: "15% chance for bonus craft" },
    ],
  },
  {
    key: "wildfire",
    name: "Wildfire",
    description: "Chaos assassins attuned to Fire spread destruction like an uncontrolled blaze.",
    icon: "FlameKindling",
    color: "#ea580c",
    rarity: "rare",
    requirements: { alignment: "chaos", characterClass: "assassin", element: "fire" },
    effects: [
      { system: "fight", type: "passive", target: "aoe_crit_chance", value: 0.10, label: "Crits have 10% chance to hit adjacent enemies" },
      { system: "card_game", type: "multiplier", target: "fire_card_atk", value: 1.25, label: "+25% fire card ATK" },
      { system: "guild_war", type: "multiplier", target: "sabotage_power", value: 1.20, label: "+20% sabotage effectiveness" },
    ],
  },
  {
    key: "iron_bastion",
    name: "Iron Bastion",
    description: "Order soldiers attuned to Earth become living fortresses that no force can topple.",
    icon: "Castle",
    color: "#78716c",
    rarity: "rare",
    requirements: { alignment: "order", characterClass: "soldier", element: "earth" },
    effects: [
      { system: "fight", type: "multiplier", target: "max_hp", value: 1.25, label: "+25% max HP" },
      { system: "fight", type: "multiplier", target: "armor_effectiveness", value: 1.30, label: "+30% armor effectiveness" },
      { system: "guild_war", type: "multiplier", target: "reinforce_power", value: 1.25, label: "+25% reinforce effectiveness" },
    ],
  },

  /* ─── LEGENDARY SYNERGIES (4-axis combos) ─── */
  {
    key: "architect_of_reality",
    name: "Architect of Reality",
    description: "A DeMagi engineer of Order who masters Reality can reshape the very fabric of existence. The Panopticon itself was built by such beings.",
    icon: "Crown",
    color: "#fbbf24",
    rarity: "legendary",
    requirements: { species: "demagi", characterClass: "engineer", alignment: "order", element: "reality" },
    effects: [
      { system: "crafting", type: "multiplier", target: "craft_success", value: 1.30, label: "+30% crafting success" },
      { system: "crafting", type: "passive", target: "rarity_upgrade_chance", value: 0.15, label: "15% chance to craft at +1 rarity" },
      { system: "trade_empire", type: "multiplier", target: "colony_production", value: 1.25, label: "+25% colony production" },
      { system: "all", type: "multiplier", target: "xp_bonus", value: 1.15, label: "+15% all XP gains" },
    ],
  },
  {
    key: "void_phantom",
    name: "Void Phantom",
    description: "A Ne-Yon assassin of Chaos who channels Space exists between dimensions — striking from nowhere and vanishing into nothing.",
    icon: "Skull",
    color: "#7c3aed",
    rarity: "legendary",
    requirements: { species: "neyon", characterClass: "assassin", alignment: "chaos", element: "space" },
    effects: [
      { system: "fight", type: "passive", target: "dodge_chance", value: 0.20, label: "+20% dodge chance" },
      { system: "fight", type: "multiplier", target: "crit_damage", value: 1.50, label: "+50% critical hit damage" },
      { system: "fight", type: "passive", target: "guaranteed_crit_first", value: 1, label: "First attack is always a critical hit" },
      { system: "guild_war", type: "multiplier", target: "sabotage_power", value: 1.35, label: "+35% sabotage effectiveness" },
    ],
  },
  {
    key: "eternal_warlord",
    name: "Eternal Warlord",
    description: "A Quarchon soldier of Order who commands Time is an unstoppable force — ancient, patient, and absolutely relentless.",
    icon: "Swords",
    color: "#dc2626",
    rarity: "legendary",
    requirements: { species: "quarchon", characterClass: "soldier", alignment: "order", element: "time" },
    effects: [
      { system: "fight", type: "multiplier", target: "max_hp", value: 1.30, label: "+30% max HP" },
      { system: "fight", type: "passive", target: "death_save", value: 2, label: "Survive lethal hits twice per fight" },
      { system: "guild_war", type: "multiplier", target: "war_points", value: 1.30, label: "+30% war point multiplier" },
      { system: "guild_war", type: "multiplier", target: "capture_speed", value: 1.25, label: "+25% capture speed" },
    ],
  },
  {
    key: "dream_weaver",
    name: "Dream Weaver",
    description: "A DeMagi oracle of Chaos who perceives Probability weaves the threads of fate itself — every outcome bends to their will.",
    icon: "Sparkles",
    color: "#d946ef",
    rarity: "legendary",
    requirements: { species: "demagi", characterClass: "oracle", alignment: "chaos", element: "probability" },
    effects: [
      { system: "all", type: "passive", target: "rng_improvement", value: 0.20, label: "+20% to all RNG outcomes" },
      { system: "quest", type: "multiplier", target: "reward_multiplier", value: 1.35, label: "+35% quest rewards" },
      { system: "chess", type: "multiplier", target: "reward_multiplier", value: 1.30, label: "+30% chess rewards" },
      { system: "card_game", type: "flat", target: "extra_draw", value: 1, label: "+1 card draw per turn" },
    ],
  },
  // ═══ HUMAN SYNERGIES ═══
  {
    key: "adaptive_resilience",
    name: "Adaptive Resilience",
    description: "Humans who walk the path of the Soldier and channel Earth draw upon an unbreakable will — they endure where others fall.",
    icon: "Shield",
    color: "#78716c",
    rarity: "rare",
    requirements: { species: "human", characterClass: "soldier", element: "earth" },
    effects: [
      { system: "fight", type: "flat", target: "defense", value: 3, label: "+3 defense" },
      { system: "fight", type: "multiplier", target: "max_hp", value: 1.15, label: "+15% max HP" },
      { system: "guild_war", type: "multiplier", target: "reinforce_speed", value: 1.15, label: "+15% reinforce speed" },
    ],
  },
  {
    key: "cunning_diplomat",
    name: "Cunning Diplomat",
    description: "A Human Spy attuned to Air moves through negotiations like a breeze — unseen, unfelt, but always present.",
    icon: "MessageCircle",
    color: "#94a3b8",
    rarity: "rare",
    requirements: { species: "human", characterClass: "spy", element: "air" },
    effects: [
      { system: "trade_empire", type: "flat", target: "trade_discount", value: 0.10, label: "+10% trade discount" },
      { system: "market", type: "multiplier", target: "sell_bonus", value: 1.12, label: "+12% sell price" },
      { system: "quest", type: "multiplier", target: "reward_multiplier", value: 1.10, label: "+10% quest rewards" },
    ],
  },
  {
    key: "jacks_gambit",
    name: "Jack's Gambit",
    description: "Humans who embrace Chaos and the Oracle's sight see patterns in the noise — every risk becomes a calculated play.",
    icon: "Dices",
    color: "#f59e0b",
    rarity: "rare",
    requirements: { species: "human", characterClass: "oracle", alignment: "chaos" },
    effects: [
      { system: "chess", type: "multiplier", target: "reward_multiplier", value: 1.20, label: "+20% chess rewards" },
      { system: "card_game", type: "flat", target: "extra_draw", value: 1, label: "+1 card draw" },
      { system: "all", type: "passive", target: "rng_improvement", value: 0.08, label: "+8% to all RNG outcomes" },
    ],
  },
  // ═══ SYNTHETIC SYNERGIES ═══
  {
    key: "machine_precision",
    name: "Machine Precision",
    description: "Synthetic Engineers who channel Reality operate with perfect mechanical efficiency — every calculation exact, every output optimized.",
    icon: "Cpu",
    color: "#06b6d4",
    rarity: "rare",
    requirements: { species: "synthetic", characterClass: "engineer", element: "reality" },
    effects: [
      { system: "crafting", type: "flat", target: "success_bonus", value: 0.15, label: "+15% crafting success" },
      { system: "crafting", type: "multiplier", target: "bonus_output", value: 1.10, label: "+10% bonus output" },
      { system: "trade_empire", type: "flat", target: "scan_bonus", value: 3, label: "+3 scan range" },
    ],
  },
  {
    key: "digital_phantom",
    name: "Digital Phantom",
    description: "A Synthetic Assassin attuned to Space exists between dimensions — striking from angles that shouldn't exist.",
    icon: "Ghost",
    color: "#8b5cf6",
    rarity: "rare",
    requirements: { species: "synthetic", characterClass: "assassin", element: "space" },
    effects: [
      { system: "fight", type: "flat", target: "attack", value: 3, label: "+3 attack" },
      { system: "fight", type: "flat", target: "crit_chance", value: 0.05, label: "+5% crit chance" },
      { system: "card_game", type: "flat", target: "global_attack_bonus", value: 2, label: "+2 global attack" },
    ],
  },
  {
    key: "singularity_core",
    name: "Singularity Core",
    description: "A Synthetic Oracle of Order who channels Time has transcended mortal computation — they see all possible futures simultaneously.",
    icon: "Infinity",
    color: "#14b8a6",
    rarity: "legendary",
    requirements: { species: "synthetic", characterClass: "oracle", alignment: "order", element: "time" },
    effects: [
      { system: "chess", type: "flat", target: "time_bonus", value: 30, label: "+30s chess time" },
      { system: "chess", type: "multiplier", target: "reward_multiplier", value: 1.25, label: "+25% chess rewards" },
      { system: "all", type: "passive", target: "rng_improvement", value: 0.15, label: "+15% to all RNG outcomes" },
      { system: "quest", type: "multiplier", target: "reward_multiplier", value: 1.25, label: "+25% quest rewards" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════
   RESOLVER — Check citizen build against all synergies
   ═══════════════════════════════════════════════════════ */

export interface ResolvedSynergy {
  synergy: SynergyBonus;
  /** All effects from this synergy */
  effects: SynergyEffect[];
}

/**
 * Resolve all active synergies for a citizen build.
 * Returns an array of matched synergies with their effects.
 */
export function resolveSynergies(citizen: CitizenData): ResolvedSynergy[] {
  const matched: ResolvedSynergy[] = [];

  for (const synergy of SYNERGY_BONUSES) {
    if (matchesSynergy(citizen, synergy)) {
      matched.push({ synergy, effects: synergy.effects });
    }
  }

  return matched;
}

/**
 * Check if a citizen's build matches a synergy's requirements.
 */
function matchesSynergy(citizen: CitizenData, synergy: SynergyBonus): boolean {
  const req = synergy.requirements;

  if (req.species && citizen.species !== req.species) return false;
  if (req.characterClass && citizen.characterClass !== req.characterClass) return false;
  if (req.alignment && citizen.alignment !== req.alignment) return false;
  if (req.element && citizen.element !== req.element) return false;
  if (req.minAttrAttack && citizen.attrAttack < req.minAttrAttack) return false;
  if (req.minAttrDefense && citizen.attrDefense < req.minAttrDefense) return false;
  if (req.minAttrVitality && citizen.attrVitality < req.minAttrVitality) return false;

  return true;
}

/**
 * Get all synergy effects for a specific game system.
 * Aggregates effects from all active synergies.
 */
export function getSynergyEffectsForSystem(
  citizen: CitizenData,
  system: SynergyEffect["system"]
): { effects: SynergyEffect[]; sources: string[] } {
  const synergies = resolveSynergies(citizen);
  const effects: SynergyEffect[] = [];
  const sources: string[] = [];

  for (const { synergy, effects: synergyEffects } of synergies) {
    for (const effect of synergyEffects) {
      if (effect.system === system || effect.system === "all") {
        effects.push(effect);
        if (!sources.includes(synergy.name)) {
          sources.push(synergy.name);
        }
      }
    }
  }

  return { effects, sources };
}

/**
 * Get a specific synergy effect value, aggregated across all active synergies.
 * For multipliers, compounds them (1.1 * 1.2 = 1.32).
 * For flat bonuses, sums them.
 */
export function getAggregatedSynergyEffect(
  citizen: CitizenData,
  system: SynergyEffect["system"],
  target: string
): { value: number; type: "multiplier" | "flat" | "passive" | "unlock"; sources: string[] } {
  const { effects, sources } = getSynergyEffectsForSystem(citizen, system);
  const matching = effects.filter(e => e.target === target);

  if (matching.length === 0) {
    return { value: 0, type: "flat", sources: [] };
  }

  const type = matching[0].type;
  let value: number;

  if (type === "multiplier") {
    value = matching.reduce((acc, e) => acc * e.value, 1);
  } else {
    value = matching.reduce((acc, e) => acc + e.value, 0);
  }

  return { value, type, sources };
}

/**
 * Count how many synergies a citizen has unlocked, by rarity.
 */
export function countSynergies(citizen: CitizenData): { total: number; uncommon: number; rare: number; legendary: number } {
  const synergies = resolveSynergies(citizen);
  return {
    total: synergies.length,
    uncommon: synergies.filter(s => s.synergy.rarity === "uncommon").length,
    rare: synergies.filter(s => s.synergy.rarity === "rare").length,
    legendary: synergies.filter(s => s.synergy.rarity === "legendary").length,
  };
}
