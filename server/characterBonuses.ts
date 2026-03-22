/**
 * CHARACTER BONUS ENGINE
 * ══════════════════════════════════════════════════════════
 * Central module that calculates all gameplay bonuses from a player's
 * Citizen character build (species, class, element, attributes).
 *
 * Every game system imports this to make character choices matter.
 * ══════════════════════════════════════════════════════════
 */

import type { CitizenCharacter } from "../drizzle/schema";

/* ─── Type Definitions ─── */

export type Species = "demagi" | "quarchon" | "neyon";
export type CharacterClass = "engineer" | "oracle" | "assassin" | "soldier" | "spy";
export type Alignment = "order" | "chaos";
export type Element =
  | "earth" | "fire" | "water" | "air"
  | "space" | "time" | "probability" | "reality";

/** All bonuses a character build provides, expressed as multipliers (1.0 = no bonus) */
export interface CharacterBonuses {
  /* ── Global ── */
  xpMultiplier: number;          // XP earned from all sources
  dreamMultiplier: number;       // Dream token earnings
  creditMultiplier: number;      // Credit earnings

  /* ── Chess ── */
  chessTimeBonus: number;        // Extra seconds added to clock (flat)
  chessRewardMultiplier: number; // Reward multiplier for chess wins
  chessOpeningAffinity: string;  // Preferred opening style hint

  /* ── Card Battles / PvP ── */
  cardDrawBonus: number;         // Extra cards drawn per game (flat, 0 or 1)
  cardElementBoost: number;      // Damage multiplier for same-element cards
  cardHpBonus: number;           // Flat HP bonus to all deployed cards
  cardArmorBonus: number;        // Flat armor bonus to all deployed cards
  deckSizeBonus: number;         // Extra deck slots (flat)

  /* ── Fighting Game ── */
  fightHpMultiplier: number;     // Max HP multiplier
  fightDamageMultiplier: number; // Outgoing damage multiplier
  fightCritChance: number;       // Crit chance bonus (additive, 0.0-1.0)
  fightArmorFlat: number;        // Flat damage reduction per hit
  fightComboBonus: number;       // Combo damage scaling multiplier

  /* ── Trade Empire ── */
  tradeProfitMultiplier: number; // Buy/sell profit bonus
  colonyProductionMultiplier: number; // Colony resource output
  shipHoldsBonus: number;        // Extra cargo holds (flat)
  fuelEfficiency: number;        // Fuel cost reduction multiplier (lower = better)
  scannerRange: number;          // Extra scan range (flat sectors)

  /* ── Guild Wars ── */
  warPointMultiplier: number;    // War contribution point multiplier
  captureSpeedMultiplier: number; // Territory capture speed
  sabotageMultiplier: number;    // Sabotage effectiveness
  reinforceMultiplier: number;   // Reinforce effectiveness

  /* ── Crafting ── */
  craftSuccessBonus: number;     // Additive success rate bonus (0.0-1.0)
  craftCostReduction: number;    // Cost reduction multiplier (lower = cheaper)
  craftElementBonus: Element[];  // Elements that get bonus success rate

  /* ── Quests & Battle Pass ── */
  questRewardMultiplier: number; // Quest reward bonus
  battlePassXpMultiplier: number; // Battle pass XP earning rate
  dailyQuestSlots: number;       // Extra daily quest slots (flat)

  /* ── Market ── */
  marketTaxReduction: number;    // Tax reduction multiplier (lower = less tax)
  marketListingSlots: number;    // Extra listing slots (flat)
  marketIntel: boolean;          // Can see price history / hidden info

  /* ── Descriptors for UI ── */
  speciesName: string;
  speciesTitle: string;
  speciesDescription: string;
  className: string;
  classTitle: string;
  classDescription: string;
  elementName: string;
  elementIcon: string;
  alignmentName: string;
  passiveAbilities: PassiveAbility[];
}

export interface PassiveAbility {
  name: string;
  description: string;
  icon: string;       // Lucide icon name
  category: string;   // Which game system it affects
  magnitude: string;  // Human-readable magnitude ("+15%", "+1 card", etc.)
}

/* ─── Species Definitions ─── */

const SPECIES_DATA: Record<Species, {
  title: string;
  description: string;
  hpMultiplier: number;
  armorFlat: number;
  xpMultiplier: number;
  dreamMultiplier: number;
  elementBoost: number;
  tradeBonus: number;
  warBonus: number;
  craftBonus: number;
  adaptiveScaling: number; // Ne-Yon only: scales with level
}> = {
  demagi: {
    title: "DeMagi — Elemental Sovereigns",
    description: "Masters of elemental magic. Their deep connection to fundamental forces grants amplified elemental power and magical resilience.",
    hpMultiplier: 1.10,     // +10% HP
    armorFlat: 0,
    xpMultiplier: 1.0,
    dreamMultiplier: 1.05,  // +5% Dream (magical attunement)
    elementBoost: 0.20,     // +20% damage with matching element
    tradeBonus: 1.0,
    warBonus: 1.05,         // +5% war points (elemental warfare)
    craftBonus: 0.10,       // +10% craft success for element-aligned recipes
    adaptiveScaling: 0,
  },
  quarchon: {
    title: "Quarchon — Dimensional Navigators",
    description: "Beings who traverse dimensional boundaries. Their perception of multiple realities grants tactical foresight and temporal awareness.",
    hpMultiplier: 1.0,
    armorFlat: 2,           // +2 flat armor (dimensional shielding)
    xpMultiplier: 1.05,     // +5% XP (dimensional knowledge)
    dreamMultiplier: 1.0,
    elementBoost: 0.10,     // +10% element boost (dimensional resonance)
    tradeBonus: 1.10,       // +10% trade profits (see across dimensions)
    warBonus: 1.0,
    craftBonus: 0.05,       // +5% craft success
    adaptiveScaling: 0,
  },
  neyon: {
    title: "Ne-Yon — Adaptive Synthetics",
    description: "Synthetic beings who evolve and adapt. Weaker initially but scale with experience, eventually surpassing all other species at high levels.",
    hpMultiplier: 1.05,     // +5% HP base
    armorFlat: 1,           // +1 flat armor base
    xpMultiplier: 1.08,     // +8% XP (rapid learning)
    dreamMultiplier: 1.03,  // +3% Dream base
    elementBoost: 0.08,     // +8% element boost base
    tradeBonus: 1.05,       // +5% trade base
    warBonus: 1.03,         // +3% war base
    craftBonus: 0.05,       // +5% craft base
    adaptiveScaling: 0.01,  // +1% to ALL bonuses per level (up to +50% at level 50)
  },
};

/* ─── Class Definitions ─── */

const CLASS_DATA: Record<CharacterClass, {
  title: string;
  description: string;
  // Chess
  chessTimeBonus: number;
  chessRewardMult: number;
  chessOpeningStyle: string;
  // Cards
  cardDrawBonus: number;
  cardHpBonus: number;
  deckSizeBonus: number;
  // Fight
  fightDamageMult: number;
  fightCritBonus: number;
  fightHpMult: number;
  fightComboMult: number;
  // Trade
  tradeProfitMult: number;
  colonyProdMult: number;
  shipHoldsBonus: number;
  scannerBonus: number;
  // War
  warPointMult: number;
  captureSpeedMult: number;
  sabotageMult: number;
  reinforceMult: number;
  // Craft
  craftSuccessBonus: number;
  craftCostReduction: number;
  // Quest
  questRewardMult: number;
  dailyQuestSlots: number;
  // Market
  marketTaxReduction: number;
  marketListingSlots: number;
  marketIntel: boolean;
}> = {
  engineer: {
    title: "Engineer — Master Builder",
    description: "Excels at crafting, construction, and resource optimization. Engineers build empires through infrastructure and ingenuity.",
    chessTimeBonus: 15,
    chessRewardMult: 1.0,
    chessOpeningStyle: "positional",
    cardDrawBonus: 0,
    cardHpBonus: 0,
    deckSizeBonus: 2,
    fightDamageMult: 1.0,
    fightCritBonus: 0.0,
    fightHpMult: 1.05,
    fightComboMult: 1.0,
    tradeProfitMult: 1.05,
    colonyProdMult: 1.20,     // +20% colony production — the big Engineer bonus
    shipHoldsBonus: 5,         // +5 cargo holds
    scannerBonus: 0,
    warPointMult: 1.05,
    captureSpeedMult: 1.0,
    sabotageMult: 1.0,
    reinforceMult: 1.25,       // +25% reinforce — Engineers fortify
    craftSuccessBonus: 0.20,   // +20% craft success — THE Engineer signature
    craftCostReduction: 0.75,  // 25% cost reduction
    questRewardMult: 1.05,
    dailyQuestSlots: 0,
    marketTaxReduction: 0.90,  // 10% tax reduction
    marketListingSlots: 3,     // +3 listings
    marketIntel: false,
  },
  oracle: {
    title: "Oracle — Seer of Fates",
    description: "Commands foresight and knowledge. Oracles excel in strategy, card games, and quest completion through superior information.",
    chessTimeBonus: 30,        // +30s — Oracles see ahead
    chessRewardMult: 1.15,     // +15% chess rewards
    chessOpeningStyle: "prophetic",
    cardDrawBonus: 1,          // +1 card draw — THE Oracle signature
    cardHpBonus: 0,
    deckSizeBonus: 3,          // +3 deck slots
    fightDamageMult: 0.95,     // Slightly less physical damage
    fightCritBonus: 0.05,      // +5% crit (foresight)
    fightHpMult: 1.0,
    fightComboMult: 1.0,
    tradeProfitMult: 1.10,     // +10% trade (see market trends)
    colonyProdMult: 1.0,
    shipHoldsBonus: 0,
    scannerBonus: 2,           // +2 scanner range
    warPointMult: 1.0,
    captureSpeedMult: 1.0,
    sabotageMult: 1.0,
    reinforceMult: 1.0,
    craftSuccessBonus: 0.05,
    craftCostReduction: 0.95,
    questRewardMult: 1.20,     // +20% quest rewards — THE Oracle signature
    dailyQuestSlots: 1,        // +1 daily quest
    marketTaxReduction: 0.95,
    marketListingSlots: 0,
    marketIntel: true,         // Can see price history
  },
  assassin: {
    title: "Assassin — Shadow Striker",
    description: "Deadly in combat with devastating critical strikes. Assassins dominate PvP and fighting games through burst damage.",
    chessTimeBonus: 0,
    chessRewardMult: 1.05,
    chessOpeningStyle: "aggressive",
    cardDrawBonus: 0,
    cardHpBonus: 0,
    deckSizeBonus: 0,
    fightDamageMult: 1.20,    // +20% damage — THE Assassin signature
    fightCritBonus: 0.15,     // +15% crit chance — deadly strikes
    fightHpMult: 0.90,        // -10% HP (glass cannon)
    fightComboMult: 1.15,     // +15% combo scaling
    tradeProfitMult: 1.0,
    colonyProdMult: 1.0,
    shipHoldsBonus: 0,
    scannerBonus: 0,
    warPointMult: 1.10,        // +10% war points (combat focus)
    captureSpeedMult: 1.15,    // +15% capture speed (strike fast)
    sabotageMult: 1.20,        // +20% sabotage
    reinforceMult: 0.90,       // -10% reinforce (not a builder)
    craftSuccessBonus: 0.0,
    craftCostReduction: 1.0,
    questRewardMult: 1.05,
    dailyQuestSlots: 0,
    marketTaxReduction: 1.0,
    marketListingSlots: 0,
    marketIntel: false,
  },
  soldier: {
    title: "Soldier — Iron Vanguard",
    description: "The frontline warrior. Soldiers have the highest survivability and dominate in sustained combat and territory control.",
    chessTimeBonus: 10,
    chessRewardMult: 1.0,
    chessOpeningStyle: "defensive",
    cardDrawBonus: 0,
    cardHpBonus: 3,            // +3 HP to all cards — THE Soldier signature
    deckSizeBonus: 0,
    fightDamageMult: 1.10,     // +10% damage
    fightCritBonus: 0.0,
    fightHpMult: 1.25,         // +25% HP — THE Soldier signature
    fightComboMult: 1.0,
    tradeProfitMult: 1.0,
    colonyProdMult: 1.05,
    shipHoldsBonus: 0,
    scannerBonus: 0,
    warPointMult: 1.15,        // +15% war points — Soldiers dominate wars
    captureSpeedMult: 1.25,    // +25% capture speed — THE Soldier war signature
    sabotageMult: 1.0,
    reinforceMult: 1.15,       // +15% reinforce
    craftSuccessBonus: 0.0,
    craftCostReduction: 1.0,
    questRewardMult: 1.0,
    dailyQuestSlots: 0,
    marketTaxReduction: 1.0,
    marketListingSlots: 0,
    marketIntel: false,
  },
  spy: {
    title: "Spy — Shadow Operative",
    description: "Master of information and subterfuge. Spies excel in markets, intelligence gathering, and covert war operations.",
    chessTimeBonus: 20,
    chessRewardMult: 1.10,
    chessOpeningStyle: "tricky",
    cardDrawBonus: 0,
    cardHpBonus: 0,
    deckSizeBonus: 1,
    fightDamageMult: 1.05,
    fightCritBonus: 0.10,      // +10% crit (surprise attacks)
    fightHpMult: 0.95,         // -5% HP
    fightComboMult: 1.10,
    tradeProfitMult: 1.15,     // +15% trade profits — THE Spy signature
    colonyProdMult: 1.0,
    shipHoldsBonus: 0,
    scannerBonus: 3,           // +3 scanner range — intelligence
    warPointMult: 1.05,
    captureSpeedMult: 1.0,
    sabotageMult: 1.30,        // +30% sabotage — THE Spy war signature
    reinforceMult: 1.0,
    craftSuccessBonus: 0.0,
    craftCostReduction: 1.0,
    questRewardMult: 1.10,
    dailyQuestSlots: 0,
    marketTaxReduction: 0.80,  // 20% tax reduction — THE Spy market signature
    marketListingSlots: 5,     // +5 listings
    marketIntel: true,         // Full market intel
  },
};

/* ─── Element Definitions ─── */

const ELEMENT_DATA: Record<Element, {
  icon: string;
  /** Territory types this element boosts in guild wars */
  boostedTerritories: string[];
  /** Quest types this element boosts */
  boostedQuestTypes: string[];
  /** Crafting recipe categories this element boosts */
  boostedCraftCategories: string[];
  /** Card element types that get bonus damage */
  cardElementMatch: string[];
  /** Trade commodity this element boosts */
  boostedCommodity: string;
  /** Fight arena bonus (element-themed arenas) */
  arenaBonus: string;
  /** Flat bonus to war points in aligned territories */
  warTerritoryBonus: number;
  /** Extra craft success for aligned recipes */
  craftAlignedBonus: number;
}> = {
  earth: {
    icon: "Mountain",
    boostedTerritories: ["The Panopticon Core", "The Bazaar of Babylon"],
    boostedQuestTypes: ["trade", "craft"],
    boostedCraftCategories: ["armor", "shield", "fortification"],
    cardElementMatch: ["earth", "space"],
    boostedCommodity: "fuelOre",
    arenaBonus: "The Panopticon",
    warTerritoryBonus: 0.15,
    craftAlignedBonus: 0.10,
  },
  fire: {
    icon: "Flame",
    boostedTerritories: ["The Warlord's Forge", "The Arena of Echoes"],
    boostedQuestTypes: ["fight", "card_battle"],
    boostedCraftCategories: ["weapon", "damage", "offensive"],
    cardElementMatch: ["fire", "reality"],
    boostedCommodity: "equipment",
    arenaBonus: "The Forge",
    warTerritoryBonus: 0.15,
    craftAlignedBonus: 0.10,
  },
  water: {
    icon: "Droplets",
    boostedTerritories: ["The Oracle's Sanctum", "The Dreamer's Nexus"],
    boostedQuestTypes: ["explore", "social"],
    boostedCraftCategories: ["potion", "healing", "support"],
    cardElementMatch: ["water", "probability"],
    boostedCommodity: "organics",
    arenaBonus: "The Sanctum",
    warTerritoryBonus: 0.15,
    craftAlignedBonus: 0.10,
  },
  air: {
    icon: "Wind",
    boostedTerritories: ["The Spy Network Hub", "The Neutral Zone"],
    boostedQuestTypes: ["explore", "trade"],
    boostedCraftCategories: ["speed", "evasion", "movement"],
    cardElementMatch: ["air", "reality"],
    boostedCommodity: "equipment",
    arenaBonus: "The Nexus",
    warTerritoryBonus: 0.15,
    craftAlignedBonus: 0.10,
  },
  space: {
    icon: "Orbit",
    boostedTerritories: ["The Panopticon Core", "The Architect's Citadel"],
    boostedQuestTypes: ["explore", "trade"],
    boostedCraftCategories: ["armor", "shield", "dimensional"],
    cardElementMatch: ["space", "earth"],
    boostedCommodity: "fuelOre",
    arenaBonus: "The Citadel",
    warTerritoryBonus: 0.15,
    craftAlignedBonus: 0.10,
  },
  time: {
    icon: "Clock",
    boostedTerritories: ["The Oracle's Sanctum", "The Architect's Citadel"],
    boostedQuestTypes: ["card_battle", "explore"],
    boostedCraftCategories: ["temporal", "speed", "support"],
    cardElementMatch: ["time", "fire"],
    boostedCommodity: "organics",
    arenaBonus: "The Sanctum",
    warTerritoryBonus: 0.15,
    craftAlignedBonus: 0.10,
  },
  probability: {
    icon: "Dice5",
    boostedTerritories: ["The Dreamer's Nexus", "The Neutral Zone"],
    boostedQuestTypes: ["card_battle", "social"],
    boostedCraftCategories: ["luck", "critical", "random"],
    cardElementMatch: ["probability", "water"],
    boostedCommodity: "organics",
    arenaBonus: "The Nexus",
    warTerritoryBonus: 0.15,
    craftAlignedBonus: 0.10,
  },
  reality: {
    icon: "Eye",
    boostedTerritories: ["The Warlord's Forge", "The Spy Network Hub"],
    boostedQuestTypes: ["fight", "craft"],
    boostedCraftCategories: ["weapon", "illusion", "offensive"],
    cardElementMatch: ["reality", "air"],
    boostedCommodity: "equipment",
    arenaBonus: "The Forge",
    warTerritoryBonus: 0.15,
    craftAlignedBonus: 0.10,
  },
};

/* ─── Attribute Scaling ─── */

/**
 * Attributes are rated 1-5 (White Wolf dot system).
 * Each point provides incremental bonuses.
 * Scaling is designed so 3 dots = baseline, 5 dots = strong.
 */
function attrScale(dots: number, basePerDot: number): number {
  // Dots 1-2 are below baseline, 3 is neutral, 4-5 are bonuses
  return (dots - 3) * basePerDot;
}

/* ─── Main Calculation Function ─── */

/**
 * Calculate all gameplay bonuses for a given citizen character.
 * Returns a complete CharacterBonuses object that every game system can use.
 *
 * @param citizen - The citizen character record from the database
 * @returns Complete bonus calculations for all game systems
 */
export function calculateBonuses(citizen: Pick<
  CitizenCharacter,
  "species" | "characterClass" | "alignment" | "element" |
  "attrAttack" | "attrDefense" | "attrVitality" | "level"
>): CharacterBonuses {
  const sp = SPECIES_DATA[citizen.species];
  const cl = CLASS_DATA[citizen.characterClass];
  const el = ELEMENT_DATA[citizen.element];
  const align = citizen.alignment;

  // Ne-Yon adaptive scaling: +1% per level to all multiplier bonuses
  const adaptiveBoost = sp.adaptiveScaling * Math.min(citizen.level, 50);

  // Attribute scaling (dots 1-5, baseline at 3)
  const atkScale = attrScale(citizen.attrAttack, 0.05);    // ±5% per dot from baseline
  const defScale = attrScale(citizen.attrDefense, 0.05);
  const vitScale = attrScale(citizen.attrVitality, 0.05);

  // Alignment bonuses (subtle but meaningful)
  const orderBonus = align === "order" ? 1.05 : 1.0;  // +5% defense/structure
  const chaosBonus = align === "chaos" ? 1.05 : 1.0;   // +5% offense/disruption

  // Build passive abilities list
  const passives: PassiveAbility[] = [];

  // Species passives
  if (citizen.species === "demagi") {
    passives.push({
      name: "Elemental Mastery",
      description: `+${Math.round((sp.elementBoost + adaptiveBoost) * 100)}% damage with ${citizen.element}-aligned cards and abilities`,
      icon: "Sparkles",
      category: "Combat",
      magnitude: `+${Math.round((sp.elementBoost + adaptiveBoost) * 100)}%`,
    });
    passives.push({
      name: "Magical Resilience",
      description: `+${Math.round((sp.hpMultiplier - 1 + adaptiveBoost) * 100)}% max HP from magical constitution`,
      icon: "Heart",
      category: "Survival",
      magnitude: `+${Math.round((sp.hpMultiplier - 1 + adaptiveBoost) * 100)}%`,
    });
  } else if (citizen.species === "quarchon") {
    passives.push({
      name: "Dimensional Shielding",
      description: `+${sp.armorFlat} flat armor from phase-shifted body`,
      icon: "Shield",
      category: "Survival",
      magnitude: `+${sp.armorFlat}`,
    });
    passives.push({
      name: "Temporal Commerce",
      description: `+${Math.round((sp.tradeBonus - 1 + adaptiveBoost) * 100)}% trade profits from cross-dimensional market sight`,
      icon: "TrendingUp",
      category: "Economy",
      magnitude: `+${Math.round((sp.tradeBonus - 1 + adaptiveBoost) * 100)}%`,
    });
  } else {
    passives.push({
      name: "Adaptive Evolution",
      description: `+${Math.round(adaptiveBoost * 100)}% to all bonuses (scales with level, currently Lv.${citizen.level})`,
      icon: "Dna",
      category: "Global",
      magnitude: `+${Math.round(adaptiveBoost * 100)}%`,
    });
  }

  // Class passives
  if (cl.craftSuccessBonus > 0.10) {
    passives.push({
      name: "Master Craftsman",
      description: `+${Math.round(cl.craftSuccessBonus * 100)}% crafting success rate`,
      icon: "Hammer",
      category: "Crafting",
      magnitude: `+${Math.round(cl.craftSuccessBonus * 100)}%`,
    });
  }
  if (cl.cardDrawBonus > 0) {
    passives.push({
      name: "Prophetic Draw",
      description: `Draw ${cl.cardDrawBonus} extra card(s) per game`,
      icon: "Eye",
      category: "Card Battles",
      magnitude: `+${cl.cardDrawBonus}`,
    });
  }
  if (cl.fightDamageMult > 1.10) {
    passives.push({
      name: "Lethal Precision",
      description: `+${Math.round((cl.fightDamageMult - 1) * 100)}% combat damage, +${Math.round(cl.fightCritBonus * 100)}% crit chance`,
      icon: "Crosshair",
      category: "Fighting",
      magnitude: `+${Math.round((cl.fightDamageMult - 1) * 100)}%`,
    });
  }
  if (cl.fightHpMult > 1.15) {
    passives.push({
      name: "Iron Constitution",
      description: `+${Math.round((cl.fightHpMult - 1) * 100)}% max HP in combat`,
      icon: "ShieldPlus",
      category: "Fighting",
      magnitude: `+${Math.round((cl.fightHpMult - 1) * 100)}%`,
    });
  }
  if (cl.sabotageMult > 1.20) {
    passives.push({
      name: "Shadow Operations",
      description: `+${Math.round((cl.sabotageMult - 1) * 100)}% sabotage effectiveness, market intel access`,
      icon: "Ghost",
      category: "Guild Wars",
      magnitude: `+${Math.round((cl.sabotageMult - 1) * 100)}%`,
    });
  }
  if (cl.captureSpeedMult > 1.15) {
    passives.push({
      name: "Frontline Assault",
      description: `+${Math.round((cl.captureSpeedMult - 1) * 100)}% territory capture speed`,
      icon: "Swords",
      category: "Guild Wars",
      magnitude: `+${Math.round((cl.captureSpeedMult - 1) * 100)}%`,
    });
  }
  if (cl.questRewardMult > 1.10) {
    passives.push({
      name: "Foresight Rewards",
      description: `+${Math.round((cl.questRewardMult - 1) * 100)}% quest rewards, +${cl.dailyQuestSlots} daily quest slot(s)`,
      icon: "Gift",
      category: "Quests",
      magnitude: `+${Math.round((cl.questRewardMult - 1) * 100)}%`,
    });
  }
  if (cl.colonyProdMult > 1.10) {
    passives.push({
      name: "Infrastructure Mastery",
      description: `+${Math.round((cl.colonyProdMult - 1) * 100)}% colony production, +${cl.shipHoldsBonus} cargo holds`,
      icon: "Factory",
      category: "Trade Empire",
      magnitude: `+${Math.round((cl.colonyProdMult - 1) * 100)}%`,
    });
  }
  if (cl.tradeProfitMult > 1.10) {
    passives.push({
      name: "Market Manipulation",
      description: `+${Math.round((cl.tradeProfitMult - 1) * 100)}% trade profits, ${Math.round((1 - cl.marketTaxReduction) * 100)}% tax reduction`,
      icon: "BadgeDollarSign",
      category: "Economy",
      magnitude: `+${Math.round((cl.tradeProfitMult - 1) * 100)}%`,
    });
  }

  // Element passive
  passives.push({
    name: `${citizen.element.charAt(0).toUpperCase() + citizen.element.slice(1)} Affinity`,
    description: `Boosted in ${el.boostedTerritories.join(", ")}. Enhanced ${el.boostedCraftCategories.slice(0, 2).join("/")} crafting.`,
    icon: el.icon,
    category: "Elemental",
    magnitude: `+${Math.round(el.warTerritoryBonus * 100)}%`,
  });

  // Alignment passive
  passives.push({
    name: align === "order" ? "Order's Discipline" : "Chaos's Fury",
    description: align === "order"
      ? "+5% to defensive stats, reinforce, and structured play"
      : "+5% to offensive stats, sabotage, and aggressive play",
    icon: align === "order" ? "Shield" : "Zap",
    category: "Alignment",
    magnitude: "+5%",
  });

  // Attribute passives
  if (citizen.attrAttack >= 4) {
    passives.push({
      name: "High Attack",
      description: `Attack ${citizen.attrAttack}/5 — +${Math.round(atkScale * 100)}% offensive power across all systems`,
      icon: "Sword",
      category: "Attributes",
      magnitude: `+${Math.round(atkScale * 100)}%`,
    });
  }
  if (citizen.attrDefense >= 4) {
    passives.push({
      name: "High Defense",
      description: `Defense ${citizen.attrDefense}/5 — +${Math.round(defScale * 100)}% defensive power across all systems`,
      icon: "ShieldHalf",
      category: "Attributes",
      magnitude: `+${Math.round(defScale * 100)}%`,
    });
  }
  if (citizen.attrVitality >= 4) {
    passives.push({
      name: "High Vitality",
      description: `Vitality ${citizen.attrVitality}/5 — +${Math.round(vitScale * 100)}% HP and sustain across all systems`,
      icon: "HeartPulse",
      category: "Attributes",
      magnitude: `+${Math.round(vitScale * 100)}%`,
    });
  }

  return {
    /* ── Global ── */
    xpMultiplier: (sp.xpMultiplier + adaptiveBoost) * (1 + vitScale * 0.5),
    dreamMultiplier: (sp.dreamMultiplier + adaptiveBoost),
    creditMultiplier: (sp.tradeBonus + adaptiveBoost),

    /* ── Chess ── */
    chessTimeBonus: cl.chessTimeBonus + Math.round(attrScale(citizen.attrDefense, 5)),
    chessRewardMultiplier: cl.chessRewardMult * (sp.dreamMultiplier + adaptiveBoost),
    chessOpeningAffinity: cl.chessOpeningStyle,

    /* ── Card Battles ── */
    cardDrawBonus: cl.cardDrawBonus,
    cardElementBoost: 1 + sp.elementBoost + adaptiveBoost + atkScale * 0.5,
    cardHpBonus: cl.cardHpBonus + Math.round(vitScale * 2),
    cardArmorBonus: sp.armorFlat + Math.round(defScale * 1),
    deckSizeBonus: cl.deckSizeBonus,

    /* ── Fighting ── */
    fightHpMultiplier: (sp.hpMultiplier + adaptiveBoost) * cl.fightHpMult * (1 + vitScale) * orderBonus,
    fightDamageMultiplier: cl.fightDamageMult * (1 + atkScale) * chaosBonus,
    fightCritChance: cl.fightCritBonus + atkScale * 0.03,
    fightArmorFlat: sp.armorFlat + Math.round(defScale * 2),
    fightComboBonus: cl.fightComboMult * chaosBonus,

    /* ── Trade Empire ── */
    tradeProfitMultiplier: cl.tradeProfitMult * (sp.tradeBonus + adaptiveBoost),
    colonyProductionMultiplier: cl.colonyProdMult * (1 + adaptiveBoost),
    shipHoldsBonus: cl.shipHoldsBonus + Math.round(vitScale * 2),
    fuelEfficiency: Math.max(0.5, 1.0 - defScale * 0.1 - adaptiveBoost * 0.5),
    scannerRange: cl.scannerBonus,

    /* ── Guild Wars ── */
    warPointMultiplier: cl.warPointMult * (sp.warBonus + adaptiveBoost) * (align === "chaos" ? chaosBonus : orderBonus),
    captureSpeedMultiplier: cl.captureSpeedMult * chaosBonus,
    sabotageMultiplier: cl.sabotageMult * chaosBonus,
    reinforceMultiplier: cl.reinforceMult * orderBonus,

    /* ── Crafting ── */
    craftSuccessBonus: cl.craftSuccessBonus + sp.craftBonus + adaptiveBoost + defScale * 0.03,
    craftCostReduction: cl.craftCostReduction * (1 - adaptiveBoost * 0.2),
    craftElementBonus: el.boostedCraftCategories.length > 0 ? [citizen.element] : [],

    /* ── Quests & Battle Pass ── */
    questRewardMultiplier: cl.questRewardMult * (sp.xpMultiplier + adaptiveBoost),
    battlePassXpMultiplier: (sp.xpMultiplier + adaptiveBoost) * (1 + vitScale * 0.3),
    dailyQuestSlots: cl.dailyQuestSlots,

    /* ── Market ── */
    marketTaxReduction: cl.marketTaxReduction * (1 - adaptiveBoost * 0.1),
    marketListingSlots: cl.marketListingSlots,
    marketIntel: cl.marketIntel,

    /* ── UI Descriptors ── */
    speciesName: citizen.species,
    speciesTitle: sp.title,
    speciesDescription: sp.description,
    className: citizen.characterClass,
    classTitle: cl.title,
    classDescription: cl.description,
    elementName: citizen.element,
    elementIcon: el.icon,
    alignmentName: citizen.alignment,
    passiveAbilities: passives,
  };
}

/* ─── Helper: Get element data for UI ─── */

export function getElementData(element: Element) {
  return ELEMENT_DATA[element];
}

/* ─── Helper: Get class data for UI ─── */

export function getClassData(characterClass: CharacterClass) {
  return CLASS_DATA[characterClass];
}

/* ─── Helper: Get species data for UI ─── */

export function getSpeciesData(species: Species) {
  return SPECIES_DATA[species];
}

/* ─── Helper: Check if element boosts a territory ─── */

export function elementBoostsTerritory(element: Element, territoryName: string): boolean {
  return ELEMENT_DATA[element].boostedTerritories.includes(territoryName);
}

/* ─── Helper: Check if element boosts a quest type ─── */

export function elementBoostsQuestType(element: Element, questType: string): boolean {
  return ELEMENT_DATA[element].boostedQuestTypes.includes(questType);
}

/* ─── Helper: Check if element boosts a craft category ─── */

export function elementBoostsCraftCategory(element: Element, category: string): boolean {
  return ELEMENT_DATA[element].boostedCraftCategories.includes(category);
}

/* ─── Helper: Get card element damage multiplier ─── */

export function getCardElementMultiplier(
  playerElement: Element,
  cardElement: string,
  baseMultiplier: number
): number {
  const el = ELEMENT_DATA[playerElement];
  if (el.cardElementMatch.includes(cardElement)) {
    return baseMultiplier; // Already calculated in cardElementBoost
  }
  return 1.0;
}

/* ─── Helper: Format bonus for display ─── */

export function formatBonus(value: number, type: "multiplier" | "flat" | "percent"): string {
  if (type === "multiplier") {
    const pct = Math.round((value - 1) * 100);
    return pct >= 0 ? `+${pct}%` : `${pct}%`;
  }
  if (type === "flat") {
    return value >= 0 ? `+${value}` : `${value}`;
  }
  // percent
  return `${Math.round(value * 100)}%`;
}

/* ─── Default bonuses for players without a citizen ─── */

export function getDefaultBonuses(): CharacterBonuses {
  return {
    xpMultiplier: 1.0,
    dreamMultiplier: 1.0,
    creditMultiplier: 1.0,
    chessTimeBonus: 0,
    chessRewardMultiplier: 1.0,
    chessOpeningAffinity: "balanced",
    cardDrawBonus: 0,
    cardElementBoost: 1.0,
    cardHpBonus: 0,
    cardArmorBonus: 0,
    deckSizeBonus: 0,
    fightHpMultiplier: 1.0,
    fightDamageMultiplier: 1.0,
    fightCritChance: 0.0,
    fightArmorFlat: 0,
    fightComboBonus: 1.0,
    tradeProfitMultiplier: 1.0,
    colonyProductionMultiplier: 1.0,
    shipHoldsBonus: 0,
    fuelEfficiency: 1.0,
    scannerRange: 0,
    warPointMultiplier: 1.0,
    captureSpeedMultiplier: 1.0,
    sabotageMultiplier: 1.0,
    reinforceMultiplier: 1.0,
    craftSuccessBonus: 0.0,
    craftCostReduction: 1.0,
    craftElementBonus: [],
    questRewardMultiplier: 1.0,
    battlePassXpMultiplier: 1.0,
    dailyQuestSlots: 0,
    marketTaxReduction: 1.0,
    marketListingSlots: 0,
    marketIntel: false,
    speciesName: "none",
    speciesTitle: "No Citizen",
    speciesDescription: "Create a Citizen to unlock character bonuses across all game systems.",
    className: "none",
    classTitle: "No Class",
    classDescription: "Choose a class during Citizen creation.",
    elementName: "none",
    elementIcon: "Circle",
    alignmentName: "none",
    passiveAbilities: [],
  };
}
