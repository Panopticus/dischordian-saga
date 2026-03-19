/* ═══════════════════════════════════════════════════════
   UNIFIED CITIZEN TRAIT RESOLVER
   
   Every game system calls resolveTraitBonuses() with the
   player's citizen + optional NFT data. Returns bonuses
   specific to each game context.
   
   This is the SINGLE SOURCE OF TRUTH for how character
   builds affect gameplay across the entire app.
   ═══════════════════════════════════════════════════════ */

/* ─── INPUT TYPES ─── */

export interface CitizenData {
  species: "demagi" | "quarchon" | "neyon";
  characterClass: "engineer" | "oracle" | "assassin" | "soldier" | "spy";
  alignment: "order" | "chaos";
  element: "earth" | "fire" | "water" | "air" | "space" | "time" | "probability" | "reality";
  attrAttack: number;   // 1-5 dot rating
  attrDefense: number;  // 1-5 dot rating
  attrVitality: number; // 1-5 dot rating
  classLevel: number;   // 1+
  level: number;        // overall citizen level
}

export interface PotentialNftData {
  tokenId: number;
  level: number;        // NFT level (1-100)
  nftClass?: string | null;
  weapon?: string | null;
  specie?: string | null;
  claimCount?: number;  // how many Potentials the user has claimed
}

/* ─── OUTPUT TYPES ─── */

export interface CardGameBonuses {
  /** Flat HP bonus to player's starting health */
  hpBonus: number;
  /** Flat influence bonus at match start */
  influenceBonus: number;
  /** Flat energy bonus at match start */
  energyBonus: number;
  /** Bonus ATK for all summoned characters */
  globalAttackBonus: number;
  /** Bonus HP for all summoned characters */
  globalHealthBonus: number;
  /** Element that gets +2 ATK when matching */
  elementAffinity: string;
  /** Extra card draw per N turns (0 = none) */
  extraDrawEveryNTurns: number;
  /** Chance to reduce card cost by 1 (0-1) */
  costReductionChance: number;
  /** Alignment-specific bonus */
  alignmentEffect: { type: "order_structure" | "chaos_wildcard"; value: number };
  /** Breakdown for UI display */
  breakdown: Array<{ source: string; effect: string }>;
}

export interface TradeEmpireBonuses {
  /** Flat combat power bonus */
  combatPowerBonus: number;
  /** Shield damage reduction % (0-1) */
  shieldDamageReduction: number;
  /** Trade price discount % (0-1) */
  tradePriceDiscount: number;
  /** Extra credits from trading (flat) */
  tradeCreditsBonus: number;
  /** Hazard damage reduction % (0-1) */
  hazardResistance: number;
  /** Extra XP from all actions (flat) */
  xpBonus: number;
  /** Extra turns per day */
  bonusTurns: number;
  /** Card drop rate bonus (additive, 0-1) */
  cardDropRateBonus: number;
  /** Sector scan range bonus */
  scanRangeBonus: number;
  /** Colony income multiplier (1.0 = no bonus) */
  colonyIncomeMultiplier: number;
  /** Breakdown for UI display */
  breakdown: Array<{ source: string; effect: string }>;
}

export interface FightGameBonuses {
  /** Flat attack bonus */
  attackBonus: number;
  /** Flat defense bonus */
  defenseBonus: number;
  /** Flat HP bonus */
  hpBonus: number;
  /** Flat speed bonus */
  speedBonus: number;
  /** Critical hit chance bonus (0-1) */
  critChanceBonus: number;
  /** Counter-attack damage bonus % */
  counterBonus: number;
  /** XP multiplier from fights (1.0 = no bonus) */
  xpMultiplier: number;
  /** Dream token multiplier from fights (1.0 = no bonus) */
  dreamMultiplier: number;
  /** Element-specific resistance (reduces damage from this element) */
  elementResistance: string | null;
  /** Breakdown for UI display */
  breakdown: Array<{ source: string; effect: string }>;
}

export interface CraftingBonuses {
  /** Success rate bonus (additive, 0-1) */
  successRateBonus: number;
  /** Dream cost reduction % (0-1) */
  dreamCostReduction: number;
  /** Chance to preserve one input material (0-1) */
  materialPreserveChance: number;
  /** Chance to get bonus output card (0-1) */
  bonusOutputChance: number;
  /** Breakdown for UI display */
  breakdown: Array<{ source: string; effect: string }>;
}

export interface ExplorationBonuses {
  /** Extra discovery XP from exploring rooms */
  discoveryXpBonus: number;
  /** Chance to find hidden items in rooms (0-1) */
  hiddenItemChance: number;
  /** Puzzle hint availability (extra hints per puzzle) */
  extraPuzzleHints: number;
  /** Easter egg detection range bonus */
  easterEggBonus: number;
  /** Bonus Dream token multiplier from content rewards (0-1 = 0-100% bonus) */
  dreamBonus: number;
  /** Chance to upgrade card rarity pool by one tier (0-1) */
  rarityUpgradeChance: number;
  /** Breakdown for UI display */
  breakdown: Array<{ source: string; effect: string }>;
}

/* ═══════════════════════════════════════════════════════
   SPECIES BONUSES — Fundamental identity
   DeMagi: Tanky, elemental mastery, HP focus
   Quarchon: Aggressive, armor, tech/dimension focus
   Ne-Yon: Balanced hybrid, versatile
   ═══════════════════════════════════════════════════════ */

const SPECIES_CARD_GAME = {
  demagi:   { hpBonus: 5, globalHealthBonus: 2, globalAttackBonus: 0, influenceBonus: 0, energyBonus: 0 },
  quarchon: { hpBonus: 0, globalHealthBonus: 0, globalAttackBonus: 2, influenceBonus: 5, energyBonus: 0 },
  neyon:    { hpBonus: 3, globalHealthBonus: 1, globalAttackBonus: 1, influenceBonus: 0, energyBonus: 2 },
} as const;

const SPECIES_TRADE = {
  demagi:   { combatBonus: 0, shieldReduction: 0.05, tradeDiscount: 0, hazardResist: 0.10, colonyMulti: 1.0 },
  quarchon: { combatBonus: 5, shieldReduction: 0, tradeDiscount: 0.05, hazardResist: 0, colonyMulti: 1.10 },
  neyon:    { combatBonus: 3, shieldReduction: 0.03, tradeDiscount: 0.03, hazardResist: 0.05, colonyMulti: 1.05 },
} as const;

const SPECIES_FIGHT = {
  demagi:   { hp: 10, defense: 1, attack: 0, speed: 0, critChance: 0 },
  quarchon: { hp: 0, defense: 0, attack: 1, speed: 1, critChance: 0.02 },
  neyon:    { hp: 5, defense: 0, attack: 0, speed: 0, critChance: 0.01 },
} as const;

const SPECIES_CRAFTING = {
  demagi:   { successBonus: 0, materialPreserve: 0, bonusOutput: 0.05 },
  quarchon: { successBonus: 0.05, materialPreserve: 0, bonusOutput: 0 },
  neyon:    { successBonus: 0.02, materialPreserve: 0.03, bonusOutput: 0.02 },
} as const;

/* ═══════════════════════════════════════════════════════
   CLASS BONUSES — Playstyle specialization
   ═══════════════════════════════════════════════════════ */

const CLASS_CARD_GAME = {
  engineer:  { extraDraw: 0, costReduction: 0.15, globalAtk: 0, globalHp: 2, energy: 2 },
  oracle:    { extraDraw: 3, costReduction: 0, globalAtk: 0, globalHp: 0, energy: 0 },
  assassin:  { extraDraw: 0, costReduction: 0, globalAtk: 3, globalHp: 0, energy: 0 },
  soldier:   { extraDraw: 0, costReduction: 0, globalAtk: 1, globalHp: 3, energy: 0 },
  spy:       { extraDraw: 2, costReduction: 0.10, globalAtk: 0, globalHp: 0, energy: 1 },
} as const;

const CLASS_TRADE = {
  engineer:  { scanBonus: 2, combatBonus: 0, tradeBonus: 0, xpBonus: 0, bonusTurns: 0 },
  oracle:    { scanBonus: 0, combatBonus: 0, tradeBonus: 200, xpBonus: 5, bonusTurns: 0 },
  assassin:  { scanBonus: 0, combatBonus: 8, tradeBonus: 0, xpBonus: 0, bonusTurns: 0 },
  soldier:   { scanBonus: 0, combatBonus: 5, tradeBonus: 0, xpBonus: 3, bonusTurns: 5 },
  spy:       { scanBonus: 3, combatBonus: 0, tradeBonus: 100, xpBonus: 0, bonusTurns: 5 },
} as const;

const CLASS_FIGHT = {
  engineer:  { attack: 0, defense: 2, hp: 5, speed: 0, counter: 0 },
  oracle:    { attack: 0, defense: 1, hp: 5, speed: 0, counter: 0.05 },
  assassin:  { attack: 2, defense: 0, hp: 0, speed: 1, counter: 0 },
  soldier:   { attack: 1, defense: 1, hp: 5, speed: 0, counter: 0 },
  spy:       { attack: 1, defense: 0, hp: 0, speed: 2, counter: 0.03 },
} as const;

const CLASS_CRAFTING = {
  engineer:  { successBonus: 0.10, dreamReduction: 0.10, materialPreserve: 0.05 },
  oracle:    { successBonus: 0.05, dreamReduction: 0, materialPreserve: 0 },
  assassin:  { successBonus: 0, dreamReduction: 0, materialPreserve: 0 },
  soldier:   { successBonus: 0, dreamReduction: 0.05, materialPreserve: 0 },
  spy:       { successBonus: 0, dreamReduction: 0.05, materialPreserve: 0.05 },
} as const;

const CLASS_EXPLORATION = {
  engineer:  { discoveryXp: 5, hiddenItem: 0.05, extraHints: 1, easterEgg: 0 },
  oracle:    { discoveryXp: 0, hiddenItem: 0.10, extraHints: 2, easterEgg: 1 },
  assassin:  { discoveryXp: 0, hiddenItem: 0.05, extraHints: 0, easterEgg: 0 },
  soldier:   { discoveryXp: 10, hiddenItem: 0, extraHints: 0, easterEgg: 0 },
  spy:       { discoveryXp: 5, hiddenItem: 0.15, extraHints: 1, easterEgg: 1 },
} as const;

/* ═══════════════════════════════════════════════════════
   ALIGNMENT BONUSES
   Order: Structured, defensive, consistent
   Chaos: Unpredictable, offensive, high-risk/high-reward
   ═══════════════════════════════════════════════════════ */

const ALIGNMENT_CARD = {
  order: { type: "order_structure" as const, value: 2, desc: "All characters get +2 HP" },
  chaos: { type: "chaos_wildcard" as const, value: 2, desc: "Random card costs 0 once per match" },
} as const;

const ALIGNMENT_TRADE = {
  order: { tradeDiscount: 0.05, combatBonus: 0, cardDrop: 0 },
  chaos: { tradeDiscount: 0, combatBonus: 3, cardDrop: 0.05 },
} as const;

const ALIGNMENT_FIGHT = {
  order: { counter: 0.05, crit: 0, defense: 1, attack: 0 },
  chaos: { counter: 0, crit: 0.03, defense: 0, attack: 1 },
} as const;

/* ═══════════════════════════════════════════════════════
   ELEMENT BONUSES — Contextual advantages
   Elements grant affinity bonuses in matching contexts
   ═══════════════════════════════════════════════════════ */

const ELEMENT_CARD_AFFINITY: Record<string, string> = {
  earth: "earth", fire: "fire", water: "water", air: "air",
  space: "space", time: "time", probability: "probability", reality: "reality",
};

const ELEMENT_TRADE_HAZARD_RESIST: Record<string, number> = {
  earth: 0.15, fire: 0.10, water: 0.10, air: 0.05,
  space: 0.10, time: 0.05, probability: 0.05, reality: 0.15,
};

const ELEMENT_FIGHT_RESIST: Record<string, string> = {
  earth: "earth", fire: "fire", water: "water", air: "air",
  space: "space", time: "time", probability: "probability", reality: "reality",
};

/* ═══════════════════════════════════════════════════════
   ATTRIBUTE DOT SCALING
   Each dot (1-5) provides incremental bonuses.
   Scaling is per-dot above 1 (so 2 dots = 1x bonus, 5 dots = 4x bonus)
   ═══════════════════════════════════════════════════════ */

function attrScale(dots: number): number {
  return Math.max(0, dots - 1); // 1=0, 2=1, 3=2, 4=3, 5=4
}

/* ═══════════════════════════════════════════════════════
   POTENTIAL NFT LEVEL MULTIPLIER
   NFT level 1-100 provides a universal scaling multiplier.
   Level 1 = 1.0x, Level 50 = 1.25x, Level 100 = 1.5x
   Having multiple claimed Potentials adds a small stacking bonus.
   ═══════════════════════════════════════════════════════ */

export function nftLevelMultiplier(nft?: PotentialNftData | null): number {
  if (!nft) return 1.0;
  const levelBonus = 1.0 + (nft.level / 200); // 1.0 to 1.5
  const claimBonus = nft.claimCount ? Math.min(0.1, (nft.claimCount - 1) * 0.02) : 0; // up to +0.1 for 6+ claims
  return levelBonus + claimBonus;
}

/* ═══════════════════════════════════════════════════════
   RESOLVER FUNCTIONS — One per game system
   ═══════════════════════════════════════════════════════ */

export function resolveCardGameBonuses(
  citizen?: CitizenData | null,
  nft?: PotentialNftData | null
): CardGameBonuses {
  const breakdown: Array<{ source: string; effect: string }> = [];
  const result: CardGameBonuses = {
    hpBonus: 0, influenceBonus: 0, energyBonus: 0,
    globalAttackBonus: 0, globalHealthBonus: 0,
    elementAffinity: "", extraDrawEveryNTurns: 0,
    costReductionChance: 0,
    alignmentEffect: { type: "order_structure", value: 0 },
    breakdown,
  };

  if (!citizen) return result;

  // Species
  const sp = SPECIES_CARD_GAME[citizen.species];
  result.hpBonus += sp.hpBonus;
  result.globalHealthBonus += sp.globalHealthBonus;
  result.globalAttackBonus += sp.globalAttackBonus;
  result.influenceBonus += sp.influenceBonus;
  result.energyBonus += sp.energyBonus;
  breakdown.push({ source: `Species: ${citizen.species}`, effect: `+${sp.hpBonus} HP, +${sp.globalAttackBonus} ATK, +${sp.globalHealthBonus} unit HP` });

  // Class
  const cl = CLASS_CARD_GAME[citizen.characterClass];
  result.extraDrawEveryNTurns = cl.extraDraw;
  result.costReductionChance += cl.costReduction;
  result.globalAttackBonus += cl.globalAtk;
  result.globalHealthBonus += cl.globalHp;
  result.energyBonus += cl.energy;
  const classEffects: string[] = [];
  if (cl.extraDraw > 0) classEffects.push(`Extra draw every ${cl.extraDraw} turns`);
  if (cl.costReduction > 0) classEffects.push(`${Math.round(cl.costReduction * 100)}% cost reduction chance`);
  if (cl.globalAtk > 0) classEffects.push(`+${cl.globalAtk} unit ATK`);
  if (cl.globalHp > 0) classEffects.push(`+${cl.globalHp} unit HP`);
  if (cl.energy > 0) classEffects.push(`+${cl.energy} starting energy`);
  breakdown.push({ source: `Class: ${citizen.characterClass}`, effect: classEffects.join(", ") });

  // Alignment
  const al = ALIGNMENT_CARD[citizen.alignment];
  result.alignmentEffect = { type: al.type, value: al.value };
  breakdown.push({ source: `Alignment: ${citizen.alignment}`, effect: al.desc });

  // Element affinity
  result.elementAffinity = ELEMENT_CARD_AFFINITY[citizen.element] || "";
  if (result.elementAffinity) {
    breakdown.push({ source: `Element: ${citizen.element}`, effect: `${citizen.element} cards get +2 ATK` });
  }

  // Attribute dots
  const atkScale = attrScale(citizen.attrAttack);
  const defScale = attrScale(citizen.attrDefense);
  const vitScale = attrScale(citizen.attrVitality);
  result.globalAttackBonus += atkScale;
  result.globalHealthBonus += defScale;
  result.hpBonus += vitScale * 3;
  if (atkScale + defScale + vitScale > 0) {
    breakdown.push({ source: "Attributes", effect: `+${atkScale} unit ATK, +${defScale} unit HP, +${vitScale * 3} player HP` });
  }

  // Class level scaling (each class level adds a small flat bonus)
  if (citizen.classLevel > 1) {
    const clBonus = citizen.classLevel - 1;
    result.hpBonus += clBonus;
    result.globalAttackBonus += Math.floor(clBonus / 2);
    breakdown.push({ source: `Class Level ${citizen.classLevel}`, effect: `+${clBonus} HP, +${Math.floor(clBonus / 2)} unit ATK` });
  }

  // NFT level multiplier
  const multi = nftLevelMultiplier(nft);
  if (multi > 1.0) {
    result.hpBonus = Math.round(result.hpBonus * multi);
    result.globalAttackBonus = Math.round(result.globalAttackBonus * multi);
    result.globalHealthBonus = Math.round(result.globalHealthBonus * multi);
    result.influenceBonus = Math.round(result.influenceBonus * multi);
    result.energyBonus = Math.round(result.energyBonus * multi);
    breakdown.push({ source: `Potential Lv.${nft!.level}`, effect: `${Math.round((multi - 1) * 100)}% bonus to all stats` });
  }

  return result;
}

export function resolveTradeEmpireBonuses(
  citizen?: CitizenData | null,
  nft?: PotentialNftData | null
): TradeEmpireBonuses {
  const breakdown: Array<{ source: string; effect: string }> = [];
  const result: TradeEmpireBonuses = {
    combatPowerBonus: 0, shieldDamageReduction: 0,
    tradePriceDiscount: 0, tradeCreditsBonus: 0,
    hazardResistance: 0, xpBonus: 0, bonusTurns: 0,
    cardDropRateBonus: 0, scanRangeBonus: 0,
    colonyIncomeMultiplier: 1.0, breakdown,
  };

  if (!citizen) return result;

  // Species
  const sp = SPECIES_TRADE[citizen.species];
  result.combatPowerBonus += sp.combatBonus;
  result.shieldDamageReduction += sp.shieldReduction;
  result.tradePriceDiscount += sp.tradeDiscount;
  result.hazardResistance += sp.hazardResist;
  result.colonyIncomeMultiplier *= sp.colonyMulti;
  breakdown.push({ source: `Species: ${citizen.species}`, effect: `+${sp.combatBonus} combat, ${Math.round(sp.hazardResist * 100)}% hazard resist` });

  // Class
  const cl = CLASS_TRADE[citizen.characterClass];
  result.scanRangeBonus += cl.scanBonus;
  result.combatPowerBonus += cl.combatBonus;
  result.tradeCreditsBonus += cl.tradeBonus;
  result.xpBonus += cl.xpBonus;
  result.bonusTurns += cl.bonusTurns;
  const classEffects: string[] = [];
  if (cl.scanBonus > 0) classEffects.push(`+${cl.scanBonus} scan range`);
  if (cl.combatBonus > 0) classEffects.push(`+${cl.combatBonus} combat power`);
  if (cl.tradeBonus > 0) classEffects.push(`+${cl.tradeBonus} trade credits`);
  if (cl.bonusTurns > 0) classEffects.push(`+${cl.bonusTurns} daily turns`);
  breakdown.push({ source: `Class: ${citizen.characterClass}`, effect: classEffects.join(", ") });

  // Alignment
  const al = ALIGNMENT_TRADE[citizen.alignment];
  result.tradePriceDiscount += al.tradeDiscount;
  result.combatPowerBonus += al.combatBonus;
  result.cardDropRateBonus += al.cardDrop;
  breakdown.push({ source: `Alignment: ${citizen.alignment}`, effect: citizen.alignment === "order" ? "5% trade discount" : "+3 combat, +5% card drops" });

  // Element — hazard resistance
  const elResist = ELEMENT_TRADE_HAZARD_RESIST[citizen.element] || 0;
  result.hazardResistance += elResist;
  breakdown.push({ source: `Element: ${citizen.element}`, effect: `${Math.round(elResist * 100)}% hazard resistance` });

  // Attribute dots
  const atkScale = attrScale(citizen.attrAttack);
  const defScale = attrScale(citizen.attrDefense);
  const vitScale = attrScale(citizen.attrVitality);
  result.combatPowerBonus += atkScale * 3;  // ATK dots = weapon power
  result.shieldDamageReduction += defScale * 0.03; // DEF dots = shield efficiency
  result.bonusTurns += vitScale; // VIT dots = endurance (extra turns)
  if (atkScale + defScale + vitScale > 0) {
    breakdown.push({ source: "Attributes", effect: `+${atkScale * 3} combat, ${Math.round(defScale * 3)}% shield, +${vitScale} turns` });
  }

  // Class level
  if (citizen.classLevel > 1) {
    const clBonus = citizen.classLevel - 1;
    result.combatPowerBonus += clBonus * 2;
    result.tradeCreditsBonus += clBonus * 50;
    breakdown.push({ source: `Class Level ${citizen.classLevel}`, effect: `+${clBonus * 2} combat, +${clBonus * 50} trade credits` });
  }

  // NFT multiplier
  const multi = nftLevelMultiplier(nft);
  if (multi > 1.0) {
    result.combatPowerBonus = Math.round(result.combatPowerBonus * multi);
    result.tradeCreditsBonus = Math.round(result.tradeCreditsBonus * multi);
    result.xpBonus = Math.round(result.xpBonus * multi);
    breakdown.push({ source: `Potential Lv.${nft!.level}`, effect: `${Math.round((multi - 1) * 100)}% bonus to combat & trade` });
  }

  return result;
}

export function resolveFightGameBonuses(
  citizen?: CitizenData | null,
  nft?: PotentialNftData | null
): FightGameBonuses {
  const breakdown: Array<{ source: string; effect: string }> = [];
  const result: FightGameBonuses = {
    attackBonus: 0, defenseBonus: 0, hpBonus: 0, speedBonus: 0,
    critChanceBonus: 0, counterBonus: 0,
    xpMultiplier: 1.0, dreamMultiplier: 1.0,
    elementResistance: null, breakdown,
  };

  if (!citizen) return result;

  // Species
  const sp = SPECIES_FIGHT[citizen.species];
  result.hpBonus += sp.hp;
  result.defenseBonus += sp.defense;
  result.attackBonus += sp.attack;
  result.speedBonus += sp.speed;
  result.critChanceBonus += sp.critChance;
  breakdown.push({ source: `Species: ${citizen.species}`, effect: `+${sp.hp} HP, +${sp.attack} ATK, +${sp.defense} DEF` });

  // Class
  const cl = CLASS_FIGHT[citizen.characterClass];
  result.attackBonus += cl.attack;
  result.defenseBonus += cl.defense;
  result.hpBonus += cl.hp;
  result.speedBonus += cl.speed;
  result.counterBonus += cl.counter;
  breakdown.push({ source: `Class: ${citizen.characterClass}`, effect: `+${cl.attack} ATK, +${cl.defense} DEF, +${cl.hp} HP` });

  // Alignment
  const al = ALIGNMENT_FIGHT[citizen.alignment];
  result.counterBonus += al.counter;
  result.critChanceBonus += al.crit;
  result.defenseBonus += al.defense;
  result.attackBonus += al.attack;
  breakdown.push({ source: `Alignment: ${citizen.alignment}`, effect: citizen.alignment === "order" ? "+5% counter, +1 DEF" : "+3% crit, +1 ATK" });

  // Element resistance
  result.elementResistance = ELEMENT_FIGHT_RESIST[citizen.element] || null;
  if (result.elementResistance) {
    breakdown.push({ source: `Element: ${citizen.element}`, effect: `Resist ${citizen.element} damage` });
  }

  // Attribute dots — direct scaling
  const atkScale = attrScale(citizen.attrAttack);
  const defScale = attrScale(citizen.attrDefense);
  const vitScale = attrScale(citizen.attrVitality);
  result.attackBonus += atkScale * 2;
  result.defenseBonus += defScale * 2;
  result.hpBonus += vitScale * 5;
  if (atkScale + defScale + vitScale > 0) {
    breakdown.push({ source: "Attributes", effect: `+${atkScale * 2} ATK, +${defScale * 2} DEF, +${vitScale * 5} HP` });
  }

  // Class level
  if (citizen.classLevel > 1) {
    const clBonus = citizen.classLevel - 1;
    result.attackBonus += clBonus;
    result.defenseBonus += clBonus;
    result.hpBonus += clBonus * 2;
    result.xpMultiplier += clBonus * 0.05;
    result.dreamMultiplier += clBonus * 0.05;
    breakdown.push({ source: `Class Level ${citizen.classLevel}`, effect: `+${clBonus} ATK/DEF, +${clBonus * 2} HP, ${Math.round(clBonus * 5)}% XP/Dream bonus` });
  }

  // NFT multiplier
  const multi = nftLevelMultiplier(nft);
  if (multi > 1.0) {
    result.attackBonus = Math.round(result.attackBonus * multi);
    result.defenseBonus = Math.round(result.defenseBonus * multi);
    result.hpBonus = Math.round(result.hpBonus * multi);
    result.speedBonus = Math.round(result.speedBonus * multi);
    result.xpMultiplier *= multi;
    result.dreamMultiplier *= multi;
    breakdown.push({ source: `Potential Lv.${nft!.level}`, effect: `${Math.round((multi - 1) * 100)}% bonus to all fight stats` });
  }

  return result;
}

export function resolveCraftingBonuses(
  citizen?: CitizenData | null,
  nft?: PotentialNftData | null
): CraftingBonuses {
  const breakdown: Array<{ source: string; effect: string }> = [];
  const result: CraftingBonuses = {
    successRateBonus: 0, dreamCostReduction: 0,
    materialPreserveChance: 0, bonusOutputChance: 0,
    breakdown,
  };

  if (!citizen) return result;

  // Species
  const sp = SPECIES_CRAFTING[citizen.species];
  result.successRateBonus += sp.successBonus;
  result.materialPreserveChance += sp.materialPreserve;
  result.bonusOutputChance += sp.bonusOutput;
  breakdown.push({ source: `Species: ${citizen.species}`, effect: `+${Math.round(sp.successBonus * 100)}% success, ${Math.round(sp.bonusOutput * 100)}% bonus output` });

  // Class
  const cl = CLASS_CRAFTING[citizen.characterClass];
  result.successRateBonus += cl.successBonus;
  result.dreamCostReduction += cl.dreamReduction;
  result.materialPreserveChance += cl.materialPreserve;
  breakdown.push({ source: `Class: ${citizen.characterClass}`, effect: `+${Math.round(cl.successBonus * 100)}% success, ${Math.round(cl.dreamReduction * 100)}% Dream discount` });

  // Attribute dots — Intelligence (attack) helps crafting
  const atkScale = attrScale(citizen.attrAttack);
  result.successRateBonus += atkScale * 0.02;
  if (atkScale > 0) {
    breakdown.push({ source: "Attack Attribute", effect: `+${Math.round(atkScale * 2)}% crafting success` });
  }

  // Class level
  if (citizen.classLevel > 1) {
    const clBonus = citizen.classLevel - 1;
    result.successRateBonus += clBonus * 0.02;
    result.dreamCostReduction += clBonus * 0.02;
    breakdown.push({ source: `Class Level ${citizen.classLevel}`, effect: `+${Math.round(clBonus * 2)}% success, ${Math.round(clBonus * 2)}% Dream discount` });
  }

  // NFT multiplier
  const multi = nftLevelMultiplier(nft);
  if (multi > 1.0) {
    result.successRateBonus *= multi;
    result.bonusOutputChance *= multi;
    breakdown.push({ source: `Potential Lv.${nft!.level}`, effect: `${Math.round((multi - 1) * 100)}% bonus to crafting success` });
  }

  return result;
}

export function resolveExplorationBonuses(
  citizen?: CitizenData | null,
  nft?: PotentialNftData | null
): ExplorationBonuses {
  const breakdown: Array<{ source: string; effect: string }> = [];
  const result: ExplorationBonuses = {
    discoveryXpBonus: 0, hiddenItemChance: 0,
    extraPuzzleHints: 0, easterEggBonus: 0,
    dreamBonus: 0, rarityUpgradeChance: 0,
    breakdown,
  };

  if (!citizen) return result;

  // Class — primary driver of exploration bonuses
  const cl = CLASS_EXPLORATION[citizen.characterClass];
  result.discoveryXpBonus += cl.discoveryXp;
  result.hiddenItemChance += cl.hiddenItem;
  result.extraPuzzleHints += cl.extraHints;
  result.easterEggBonus += cl.easterEgg;
  const classEffects: string[] = [];
  if (cl.discoveryXp > 0) classEffects.push(`+${cl.discoveryXp} discovery XP`);
  if (cl.hiddenItem > 0) classEffects.push(`${Math.round(cl.hiddenItem * 100)}% hidden item chance`);
  if (cl.extraHints > 0) classEffects.push(`+${cl.extraHints} puzzle hints`);
  if (cl.easterEgg > 0) classEffects.push(`+${cl.easterEgg} easter egg detection`);
  breakdown.push({ source: `Class: ${citizen.characterClass}`, effect: classEffects.join(", ") });

  // Vitality dots = exploration endurance
  const vitScale = attrScale(citizen.attrVitality);
  result.discoveryXpBonus += vitScale * 3;
  if (vitScale > 0) {
    breakdown.push({ source: "Vitality Attribute", effect: `+${vitScale * 3} discovery XP` });
  }

  // Species — DeMagi get dream bonus, Quarchon get rarity upgrade
  if (citizen.species === "demagi") {
    result.dreamBonus += 0.15;
    breakdown.push({ source: "Species: DeMagi", effect: "+15% Dream rewards" });
  } else if (citizen.species === "quarchon") {
    result.rarityUpgradeChance += 0.08;
    breakdown.push({ source: "Species: Quarchon", effect: "8% rarity upgrade chance" });
  } else if (citizen.species === "neyon") {
    result.dreamBonus += 0.08;
    result.rarityUpgradeChance += 0.05;
    breakdown.push({ source: "Species: Ne-Yon", effect: "+8% Dream, 5% rarity upgrade" });
  }

  // Class — Oracle and Spy get extra dream/rarity
  if (citizen.characterClass === "oracle") {
    result.dreamBonus += 0.10;
    breakdown.push({ source: "Class: Oracle", effect: "+10% Dream rewards" });
  } else if (citizen.characterClass === "spy") {
    result.rarityUpgradeChance += 0.06;
    breakdown.push({ source: "Class: Spy", effect: "6% rarity upgrade chance" });
  }

  // Level scaling — higher citizen level = more dream
  result.dreamBonus += citizen.level * 0.005;
  if (citizen.level > 5) {
    breakdown.push({ source: `Citizen Lv.${citizen.level}`, effect: `+${(citizen.level * 0.5).toFixed(1)}% Dream bonus` });
  }

  // NFT multiplier
  const multi = nftLevelMultiplier(nft);
  if (multi > 1.0) {
    result.discoveryXpBonus = Math.round(result.discoveryXpBonus * multi);
    result.hiddenItemChance *= multi;
    result.dreamBonus *= multi;
    result.rarityUpgradeChance = Math.min(0.5, result.rarityUpgradeChance * multi);
    breakdown.push({ source: `Potential Lv.${nft!.level}`, effect: `${Math.round((multi - 1) * 100)}% exploration bonus` });
  }

  return result;
}
