/* ═══════════════════════════════════════════════════════
   ARENA ESSENCE HARVEST — The Collector's Ledger

   Every fighter defeated in the Collectors Arena leaves
   behind an *essence* — a conceptual trophy representing
   the defeated opponent's signature power / identity.

   Essences accumulate in the player's personal ledger
   (server-side: `arena_essences` table). Each row is a
   (userId, fighterId) tuple with a running count and the
   rarity of the highest-difficulty harvest seen so far.

   This file is the canonical REGISTRY — types + per-fighter
   essence definitions + helpers for rarity derivation and
   bonus application. The server imports the registry to
   validate harvest calls and the client imports it to
   render the Essence Harvest UI.
   ═══════════════════════════════════════════════════════ */

import { ALL_FIGHTERS } from "./gameData";

// ─── TYPES ─────────────────────────────────────────────

export type EssenceRarity =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

export interface EssenceBonus {
  /** Human-readable description of what the bonus does */
  description: string;
  /** Target stat — matches FighterData fields the UI can apply */
  stat: "attack" | "defense" | "speed" | "hp" | "meter_gain";
  /** Flat value added per copy (capped at `maxStacks`) */
  valuePerStack: number;
  /** Maximum stacks that contribute to the bonus */
  maxStacks: number;
}

export interface EssenceDef {
  /** Matches FighterData.id in gameData */
  fighterId: string;
  /** Display name of the essence (NOT the fighter name) */
  name: string;
  /** Flavor / lore text shown in the ledger */
  flavor: string;
  /** Base rarity — harvests at higher difficulty upgrade it */
  baseRarity: EssenceRarity;
  /** Accent color for the card border */
  color: string;
  /** Passive bonus applied when essence is "equipped" */
  bonus: EssenceBonus;
}

export interface HarvestedEssence {
  fighterId: string;
  /** Total times this fighter has been defeated */
  count: number;
  /** Highest rarity seen across all harvests of this fighter */
  bestRarity: EssenceRarity;
  firstHarvestedAt: Date | string;
  lastHarvestedAt: Date | string;
}

// ─── RARITY TABLE ──────────────────────────────────────

/** Rarity lift applied when a fighter is defeated at a given difficulty. */
export const DIFFICULTY_RARITY_TABLE: Record<string, EssenceRarity> = {
  easy: "common",
  normal: "rare",
  hard: "epic",
  nightmare: "legendary",
};

const RARITY_ORDER: EssenceRarity[] = [
  "common",
  "rare",
  "epic",
  "legendary",
  "mythic",
];

/** Return the higher of two rarities. */
export function maxRarity(a: EssenceRarity, b: EssenceRarity): EssenceRarity {
  return RARITY_ORDER.indexOf(a) >= RARITY_ORDER.indexOf(b) ? a : b;
}

/** Derive the rarity this harvest produces. A perfect victory is one
 *  rank higher than a normal victory, capped at `mythic`. */
export function deriveHarvestRarity(
  baseRarity: EssenceRarity,
  difficulty: string,
  isPerfect: boolean,
): EssenceRarity {
  const difficultyRarity = DIFFICULTY_RARITY_TABLE[difficulty] ?? "common";
  let rarity = maxRarity(baseRarity, difficultyRarity);
  if (isPerfect) {
    const idx = RARITY_ORDER.indexOf(rarity);
    rarity = RARITY_ORDER[Math.min(idx + 1, RARITY_ORDER.length - 1)];
  }
  return rarity;
}

// ─── ESSENCE REGISTRY ──────────────────────────────────

/**
 * Per-fighter essence definitions. Every fighter id in `ALL_FIGHTERS`
 * should have an entry so that `harvestEssence` never rejects a valid
 * KO. Non-listed fighters fall back to `DEFAULT_ESSENCE`.
 */
export const ESSENCES: Record<string, EssenceDef> = {
  /* ─── Starter roster ─── */
  architect: {
    fighterId: "architect",
    name: "Blueprint of the End",
    flavor: "A brittle schematic that keeps redrawing itself at the edges.",
    baseRarity: "legendary",
    color: "#ef4444",
    bonus: { description: "+2 attack while equipped", stat: "attack", valuePerStack: 2, maxStacks: 3 },
  },
  collector: {
    fighterId: "collector",
    name: "The Harvester's Jar",
    flavor: "An empty glass jar with your own handwriting on the label.",
    baseRarity: "legendary",
    color: "#a855f7",
    bonus: { description: "+3 meter gain per hit", stat: "meter_gain", valuePerStack: 3, maxStacks: 3 },
  },
  enigma: {
    fighterId: "enigma",
    name: "Unresolved Variable",
    flavor: "A number that refuses to hold still long enough to be named.",
    baseRarity: "epic",
    color: "#22d3ee",
    bonus: { description: "+2 speed while equipped", stat: "speed", valuePerStack: 2, maxStacks: 3 },
  },
  warlord: {
    fighterId: "warlord",
    name: "Veridian Kill Order",
    flavor: "A single line of code signed in the Warlord's own blood-ink.",
    baseRarity: "epic",
    color: "#f97316",
    bonus: { description: "+3 attack while equipped", stat: "attack", valuePerStack: 3, maxStacks: 3 },
  },
  necromancer: {
    fighterId: "necromancer",
    name: "Green Ember",
    flavor: "A coal that burns cold and resurrects whoever it warms.",
    baseRarity: "legendary",
    color: "#22c55e",
    bonus: { description: "+5 max HP while equipped", stat: "hp", valuePerStack: 5, maxStacks: 3 },
  },
  meme: {
    fighterId: "meme",
    name: "Pink Static",
    flavor: "A song you can't remember the words to but your bones recognize.",
    baseRarity: "legendary",
    color: "#ec4899",
    bonus: { description: "+2 meter gain per hit", stat: "meter_gain", valuePerStack: 2, maxStacks: 3 },
  },
  source: {
    fighterId: "source",
    name: "Corrupted Core",
    flavor: "A fragment of something that was almost a god before it chose otherwise.",
    baseRarity: "mythic",
    color: "#dc2626",
    bonus: { description: "+3 attack and +2 defense while equipped", stat: "attack", valuePerStack: 3, maxStacks: 2 },
  },
  jailer: {
    fighterId: "jailer",
    name: "Skull in Green Robes",
    flavor: "A functional face. The sockets are still warm.",
    baseRarity: "rare",
    color: "#78716c",
    bonus: { description: "+3 defense while equipped", stat: "defense", valuePerStack: 3, maxStacks: 3 },
  },
  host: {
    fighterId: "host",
    name: "Parasite Bloom",
    flavor: "A flower that only grows through the eyes of the possessed.",
    baseRarity: "epic",
    color: "#7c3aed",
    bonus: { description: "+2 attack while equipped", stat: "attack", valuePerStack: 2, maxStacks: 3 },
  },
  prisoner: {
    fighterId: "prisoner",
    name: "Fractured Prophecy",
    flavor: "The Oracle's own voice. Caught mid-sentence by your own teeth.",
    baseRarity: "mythic",
    color: "#a78bfa",
    bonus: { description: "+2 to every stat while equipped", stat: "attack", valuePerStack: 2, maxStacks: 1 },
  },

  /* ─── Story mode opponents ─── */
  "agent-zero": {
    fighterId: "agent-zero",
    name: "Rotation Window",
    flavor: "Thirty-one seconds of clean air stolen from the cameras.",
    baseRarity: "rare",
    color: "#94a3b8",
    bonus: { description: "+3 speed while equipped", stat: "speed", valuePerStack: 3, maxStacks: 3 },
  },
  "iron-lion": {
    fighterId: "iron-lion",
    name: "The Lion Crest",
    flavor: "A brass sigil once pinned to a commander's chest. The sigil still salutes you when you pick it up.",
    baseRarity: "epic",
    color: "#f59e0b",
    bonus: { description: "+3 defense while equipped", stat: "defense", valuePerStack: 3, maxStacks: 3 },
  },
  "wraith-calder": {
    fighterId: "wraith-calder",
    name: "Seven Echoes",
    flavor: "A bottle containing seven breaths, each one taken by a different body.",
    baseRarity: "epic",
    color: "#c4b5fd",
    bonus: { description: "+5 max HP while equipped", stat: "hp", valuePerStack: 5, maxStacks: 3 },
  },
  "akai-shi": {
    fighterId: "akai-shi",
    name: "Eleven-Death Resin",
    flavor: "A red resin that absorbs pain but remembers every wound.",
    baseRarity: "epic",
    color: "#dc2626",
    bonus: { description: "+2 attack and +1 defense while equipped", stat: "attack", valuePerStack: 2, maxStacks: 3 },
  },
  "white-oracle": {
    fighterId: "white-oracle",
    name: "False Prophecy",
    flavor: "A mirror that shows you a future that never belonged to you.",
    baseRarity: "epic",
    color: "#f8fafc",
    bonus: { description: "+2 speed and +2 meter gain while equipped", stat: "speed", valuePerStack: 2, maxStacks: 3 },
  },
  human: {
    fighterId: "human",
    name: "Old Case File",
    flavor: "A paper folder labeled in a language that hasn't been spoken in eleven years.",
    baseRarity: "rare",
    color: "#64748b",
    bonus: { description: "+2 defense while equipped", stat: "defense", valuePerStack: 2, maxStacks: 3 },
  },
  warden: {
    fighterId: "warden",
    name: "Chrome Jaw Fragment",
    flavor: "Metal that once belonged to a face you loved.",
    baseRarity: "legendary",
    color: "#facc15",
    bonus: { description: "+4 defense while equipped", stat: "defense", valuePerStack: 4, maxStacks: 3 },
  },
  degen: {
    fighterId: "degen",
    name: "Loaded Deck",
    flavor: "A deck that contains one more ace than any deck has a right to.",
    baseRarity: "epic",
    color: "#f59e0b",
    bonus: { description: "+3 meter gain per hit", stat: "meter_gain", valuePerStack: 3, maxStacks: 3 },
  },
};

/** Fallback essence for fighters without an explicit entry. Rarity is
 *  low by design so completionists are nudged toward bosses. */
export const DEFAULT_ESSENCE: EssenceDef = {
  fighterId: "__default__",
  name: "Spent Fragment",
  flavor: "A sliver of identity left behind by a fighter the Arena hasn't catalogued yet.",
  baseRarity: "common",
  color: "#64748b",
  bonus: { description: "+1 attack per 2 stacks while equipped", stat: "attack", valuePerStack: 1, maxStacks: 4 },
};

/** Look up the essence def for a fighter id, falling back to DEFAULT. */
export function getEssenceDef(fighterId: string): EssenceDef {
  return ESSENCES[fighterId] ?? { ...DEFAULT_ESSENCE, fighterId };
}

/** List of fighter ids that currently have a registered essence. Used
 *  by the invariant test to confirm coverage. */
export const REGISTERED_FIGHTER_IDS = Object.keys(ESSENCES);

/** Return the subset of `ALL_FIGHTERS` that do not yet have an essence
 *  registered. Empty in practice once the registry is complete. */
export function getUnregisteredFighters(): string[] {
  return ALL_FIGHTERS
    .map(f => f.id)
    .filter(id => !(id in ESSENCES));
}

// ─── STACK MATH ────────────────────────────────────────

/** Compute the effective bonus value for a given essence at a given count.
 *  Stacks are capped at `bonus.maxStacks`. */
export function computeStackedBonus(def: EssenceDef, count: number): number {
  const stacks = Math.min(Math.max(count, 0), def.bonus.maxStacks);
  return stacks * def.bonus.valuePerStack;
}

// ─── UI HELPERS ────────────────────────────────────────

export const RARITY_ORDER_EXPORT = RARITY_ORDER;

export const RARITY_BORDER_CLASS: Record<EssenceRarity, string> = {
  common:    "border-gray-500   shadow-[0_0_12px_rgba(156,163,175,0.35)]",
  rare:      "border-blue-500   shadow-[0_0_16px_rgba(59,130,246,0.45)]",
  epic:      "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.55)]",
  legendary: "border-yellow-400 shadow-[0_0_24px_rgba(250,204,21,0.65)]",
  mythic:    "border-pink-400   shadow-[0_0_28px_rgba(244,114,182,0.75)]",
};

export const RARITY_TEXT_CLASS: Record<EssenceRarity, string> = {
  common:    "text-gray-300",
  rare:      "text-blue-400",
  epic:      "text-purple-400",
  legendary: "text-yellow-400",
  mythic:    "text-pink-400",
};
