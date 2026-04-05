/* ═══════════════════════════════════════════════════════
   TCG ENHANCEMENTS — Best of every trading card game

   Analysis of: Magic: The Gathering, Pokémon TCG, Yu-Gi-Oh,
   Marvel Snap, Hearthstone, Legends of Runeterra, Gwent,
   KeyForge, Flesh and Blood, Disney Lorcana

   Applied to Dischordia to make the card system deeper,
   more collectible, and more engaging.
   ═══════════════════════════════════════════════════════ */

/* ═══ 1. CARD FOIL / VARIANT SYSTEM (Pokémon TCG) ═══ */

/**
 * Each card can exist in multiple visual variants.
 * Like Pokémon's holographic, reverse holo, full art, secret rare.
 * Variants are cosmetic — same stats, different visual treatment.
 */
export type CardVariant = "standard" | "holographic" | "full_art" | "animated" | "void_touched" | "golden" | "signature";

export interface CardVariantDef {
  type: CardVariant;
  name: string;
  dropRate: number; // Percentage chance from packs
  description: string;
  /** Visual treatment */
  effect: string;
  /** Trade value multiplier */
  tradeMultiplier: number;
}

export const CARD_VARIANTS: CardVariantDef[] = [
  { type: "standard", name: "Standard", dropRate: 70, description: "Standard card", effect: "none", tradeMultiplier: 1 },
  { type: "holographic", name: "Holographic", dropRate: 15, description: "Holographic shimmer on card art", effect: "rainbow_sheen", tradeMultiplier: 3 },
  { type: "full_art", name: "Full Art", dropRate: 8, description: "Art extends to card borders", effect: "borderless", tradeMultiplier: 5 },
  { type: "animated", name: "Animated", dropRate: 4, description: "Card art is animated (subtle motion)", effect: "particle_animation", tradeMultiplier: 10 },
  { type: "void_touched", name: "Void-Touched", dropRate: 2, description: "Void energy corrupts the card edges", effect: "void_corruption", tradeMultiplier: 15 },
  { type: "golden", name: "Golden", dropRate: 0.8, description: "Entirely gold-plated card", effect: "gold_foil", tradeMultiplier: 25 },
  { type: "signature", name: "Signature", dropRate: 0.2, description: "Signed by the character. 1 per player. Cannot be traded.", effect: "signature_glow", tradeMultiplier: 0 },
];

/* ═══ 2. KEYWORD SYNERGY SYSTEM (MTG) ═══ */

/**
 * Cards with matching keywords gain bonus effects when played together.
 * Like MTG's tribal synergies, creature types, and mechanic interactions.
 */
export interface KeywordSynergy {
  keywords: [string, string];
  bonusName: string;
  bonusDescription: string;
  effect: { stat: string; value: number };
}

export const KEYWORD_SYNERGIES: KeywordSynergy[] = [
  { keywords: ["rush", "celerity"], bonusName: "Blitz Commander", bonusDescription: "Rush + Celerity units get +1 ATK on summon", effect: { stat: "atk", value: 1 } },
  { keywords: ["provoke", "ranged"], bonusName: "Guardian's Reach", bonusDescription: "Provoke + Ranged units protect 2 tiles instead of 1", effect: { stat: "range", value: 1 } },
  { keywords: ["dying_wish", "rebirth"], bonusName: "Eternal Cycle", bonusDescription: "Dying Wish triggers twice if Rebirth is also on the field", effect: { stat: "trigger_count", value: 2 } },
  { keywords: ["opening_gambit", "infiltrate"], bonusName: "Saboteur", bonusDescription: "Opening Gambit deals double damage if unit is behind enemy lines", effect: { stat: "gambit_damage", value: 2 } },
  { keywords: ["forcefield", "flying"], bonusName: "Aegis Wing", bonusDescription: "Forcefield + Flying units are immune to ground-based removal", effect: { stat: "immunity", value: 1 } },
];

/* ═══ 3. CARD EVOLUTION / FUSION (Yu-Gi-Oh + Pokémon) ═══ */

export interface CardEvolution {
  baseCardId: string;
  evolvedCardId: string;
  /** Materials required to evolve */
  cost: { shards: number; voidCrystals?: number; specificCards?: string[] };
  /** The evolved form's stat changes */
  statChanges: { atk?: number; hp?: number; cost?: number };
  /** New keyword gained */
  newKeyword?: string;
  /** Lore text for evolved form */
  loreText: string;
}

export const CARD_EVOLUTIONS: CardEvolution[] = [
  { baseCardId: "soldier_recruit", evolvedCardId: "soldier_veteran",
    cost: { shards: 20 }, statChanges: { atk: 2, hp: 2 },
    loreText: "Battle-hardened. The recruit who survived becomes something the enemy fears." },
  { baseCardId: "arcane_wisp", evolvedCardId: "arcane_elemental",
    cost: { shards: 30, voidCrystals: 2 }, statChanges: { atk: 3, hp: 3, cost: 1 },
    newKeyword: "flying",
    loreText: "Concentrated dream energy given form. It no longer merely wisps — it storms." },
  { baseCardId: "insurgent_spy", evolvedCardId: "insurgent_commander",
    cost: { shards: 25, specificCards: ["insurgent_recruit"] }, statChanges: { atk: 2, hp: 1 },
    newKeyword: "opening_gambit",
    loreText: "Agent Zero trained them personally. The spy who leads is the spy who survives." },
  { baseCardId: "viral_scout", evolvedCardId: "viral_overlord",
    cost: { shards: 40, voidCrystals: 5 }, statChanges: { atk: 4, hp: 5, cost: 2 },
    newKeyword: "dying_wish",
    loreText: "When the swarm needs a general, the strongest scout is consumed and reborn as something worse." },
];

/* ═══ 4. SEALED / DRAFT FORMAT (MTG Limited) ═══ */

export interface SealedPool {
  packs: number;
  cardsPerPack: number;
  deckSize: number;
  /** Pool is randomly generated from ALL available cards */
  buildFromPool: boolean;
  /** Time limit to build deck (minutes) */
  buildTimeMinutes: number;
  /** Entry cost */
  entryCost: { dream: number };
  /** Prizes by wins (0-3 losses, 0-7 wins) */
  prizes: { wins: number; reward: { dream: number; packs?: number } }[];
}

export const SEALED_FORMAT: SealedPool = {
  packs: 6, cardsPerPack: 8, deckSize: 25,
  buildFromPool: true, buildTimeMinutes: 15,
  entryCost: { dream: 50 },
  prizes: [
    { wins: 0, reward: { dream: 0 } },
    { wins: 1, reward: { dream: 10 } },
    { wins: 2, reward: { dream: 25 } },
    { wins: 3, reward: { dream: 50, packs: 1 } },
    { wins: 4, reward: { dream: 75, packs: 1 } },
    { wins: 5, reward: { dream: 100, packs: 2 } },
    { wins: 6, reward: { dream: 150, packs: 2 } },
    { wins: 7, reward: { dream: 250, packs: 3 } },
  ],
};

/* ═══ 5. CARD LORE / FLAVOR TEXT SYSTEM (MTG) ═══ */

export interface CardLoreEntry {
  cardId: string;
  flavorText: string;
  /** Hidden lore that unlocks after playing the card X times */
  hiddenLore?: { playsRequired: number; text: string };
  /** Connected cards that form a story when collected */
  storyGroup?: string;
}

export const CARD_LORE_GROUPS: Record<string, { name: string; description: string; cardIds: string[] }> = {
  "fall_of_reality": {
    name: "The Fall",
    description: "Collect all 5 cards depicting the Fall of Reality. Completing the set reveals the hidden sixth card.",
    cardIds: ["architect_ascends", "dreamer_splits", "kael_falls", "warlord_rises", "enigma_sings"],
  },
  "seven_seals": {
    name: "The Seven Seals",
    description: "Seven cards, seven seals, seven endings. Collect them all to unlock the Seventh Seal card.",
    cardIds: ["seal_1_conquest", "seal_2_war", "seal_3_famine", "seal_4_death", "seal_5_martyrs", "seal_6_wrath", "seal_7_silence"],
  },
  "ne_yon_assembly": {
    name: "Ne-Yon Assembly",
    description: "The 12 Ne-Yons as a complete card set. Assembling all 12 unlocks The Potential — the 13th, hidden Ne-Yon.",
    cardIds: ["neyon_warlord", "neyon_watcher", "neyon_storm", "neyon_silence", "neyon_knowledge", "neyon_degen", "neyon_advocate", "neyon_forgotten", "neyon_resurrectionist", "neyon_akai_shi", "neyon_enigma", "neyon_iron_lion"],
  },
};

/* ═══ 6. PITY TIMER / GUARANTEED RARE (Genshin/Snap) ═══ */

export interface PitySystem {
  /** Pulls since last rare+ */
  pullsSinceRare: number;
  /** Pulls since last epic+ */
  pullsSinceEpic: number;
  /** Pulls since last legendary */
  pullsSinceLegendary: number;
  /** Hard pity: guaranteed legendary at this count */
  legendaryPity: number;
  /** Soft pity: increased legendary chance starting here */
  softPityStart: number;
}

export const PITY_CONFIG = {
  legendaryPity: 90,     // Guaranteed legendary at 90 pulls
  softPityStart: 75,     // Increased chance from pull 75
  epicGuarantee: 30,     // Guaranteed epic every 30 pulls
  rareGuarantee: 10,     // Guaranteed rare every 10 pulls
  softPityMultiplier: 6, // 6x legendary chance during soft pity
};

export function calculatePullRarity(pity: PitySystem): string {
  // Hard pity
  if (pity.pullsSinceLegendary >= PITY_CONFIG.legendaryPity) return "legendary";
  if (pity.pullsSinceEpic >= PITY_CONFIG.epicGuarantee) return "epic";
  if (pity.pullsSinceRare >= PITY_CONFIG.rareGuarantee) return "rare";

  // Soft pity
  const inSoftPity = pity.pullsSinceLegendary >= PITY_CONFIG.softPityStart;
  const legendaryChance = inSoftPity ? 0.006 * PITY_CONFIG.softPityMultiplier : 0.006;

  const roll = Math.random();
  if (roll < legendaryChance) return "legendary";
  if (roll < legendaryChance + 0.05) return "epic";
  if (roll < legendaryChance + 0.05 + 0.15) return "rare";
  if (roll < legendaryChance + 0.05 + 0.15 + 0.30) return "uncommon";
  return "common";
}

/* ═══ 7. COLLECTION MILESTONES (Pokémon Living Dex) ═══ */

export interface CollectionMilestone {
  id: string;
  name: string;
  description: string;
  /** Required: own at least X unique cards */
  uniqueRequired: number;
  reward: { dream: number; title?: string; cosmetic?: string; card?: string };
}

export const COLLECTION_MILESTONES: CollectionMilestone[] = [
  { id: "collector_10", name: "Fledgling Collector", description: "Own 10 unique cards", uniqueRequired: 10, reward: { dream: 50 } },
  { id: "collector_25", name: "Card Enthusiast", description: "Own 25 unique cards", uniqueRequired: 25, reward: { dream: 100, title: "Card Enthusiast" } },
  { id: "collector_50", name: "Archivist", description: "Own 50 unique cards", uniqueRequired: 50, reward: { dream: 200, cosmetic: "card_collector_aura" } },
  { id: "collector_100", name: "Master Collector", description: "Own 100 unique cards", uniqueRequired: 100, reward: { dream: 500, title: "Master Collector", cosmetic: "golden_card_frame" } },
  { id: "collector_all", name: "Living Archive", description: "Own every card in the game", uniqueRequired: 999, reward: { dream: 2000, title: "Living Archive", card: "the_potential_hidden" } },
  { id: "variant_all_holo", name: "Holographic Dream", description: "Own a holographic variant of every common card", uniqueRequired: 50, reward: { dream: 300, cosmetic: "holo_aura" } },
  { id: "set_fall", name: "Fall of Reality Set", description: "Complete The Fall card set", uniqueRequired: 5, reward: { dream: 150, card: "fall_hidden_sixth" } },
  { id: "set_seals", name: "Seven Seals Set", description: "Complete The Seven Seals set", uniqueRequired: 7, reward: { dream: 200, card: "seventh_seal_card" } },
  { id: "set_neyons", name: "Ne-Yon Assembly", description: "Collect all 12 Ne-Yon cards", uniqueRequired: 12, reward: { dream: 500, card: "the_potential_13th", title: "Ne-Yon Assembler" } },
];

/* ═══ 8. COMPETITIVE FORMATS (MTG Standard/Modern) ═══ */

export interface CompetitiveFormat {
  id: string;
  name: string;
  description: string;
  rules: string[];
  /** Banned cards in this format */
  bannedCards: string[];
  /** Minimum deck size */
  minDeckSize: number;
  /** Maximum copies per card */
  maxCopies: number;
  /** Rotation: does this format rotate cards? */
  rotating: boolean;
}

export const COMPETITIVE_FORMATS: CompetitiveFormat[] = [
  {
    id: "standard", name: "Standard", description: "Current season cards only. Rotates every 3 months.",
    rules: ["Cards from current + previous season only", "40-card decks", "Max 2 copies per card (1 for legendary)"],
    bannedCards: [], minDeckSize: 40, maxCopies: 2, rotating: true,
  },
  {
    id: "eternal", name: "Eternal", description: "All cards legal. The wild west of Dischordia.",
    rules: ["All cards from all sets", "40-card decks", "Max 3 copies per card (1 for legendary)"],
    bannedCards: ["the_potential_hidden"], minDeckSize: 40, maxCopies: 3, rotating: false,
  },
  {
    id: "pauper", name: "Pauper", description: "Common and uncommon cards only. Skill over collection.",
    rules: ["Common and uncommon rarity only", "30-card decks", "Max 3 copies per card"],
    bannedCards: [], minDeckSize: 30, maxCopies: 3, rotating: false,
  },
  {
    id: "singleton", name: "Singleton", description: "One copy of each card. Every card counts.",
    rules: ["1 copy per card", "40-card decks", "All rarities allowed"],
    bannedCards: [], minDeckSize: 40, maxCopies: 1, rotating: false,
  },
  {
    id: "faction_pure", name: "Faction Pure", description: "Single-faction decks only. Loyalty rewarded.",
    rules: ["All cards must be from one faction", "35-card decks", "Faction synergy bonuses active"],
    bannedCards: [], minDeckSize: 35, maxCopies: 3, rotating: false,
  },
];
