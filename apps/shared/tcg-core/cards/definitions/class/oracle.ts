/**
 * Class Cards — Oracle (5 cards). Phase B2.
 *
 * Prophecy, divination, foresight. The oracle's TCG identity is
 * knowing what the deck is about to do and positioning for it.
 * Mechanical vocabulary: draw, flying, dispel, reveal-and-tempo.
 *
 * Class restriction: only players of the oracle class may include
 * these cards in their decks.
 *
 * IDs follow the convention s1_class_oracle_{01..05}.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const oracle_01: CardDefinition = {
  id: "s1_class_oracle_01" as CardDefinition["id"],
  name: "Auspex",
  faction: "dreamer",
  characterClass: "oracle",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 3 },
  keywords: ["flying"],
  abilities: [
    {
      id: "ora01_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    },
  ],
  art: assetUrl("art/cards/class/auspex.webp"),
  flavorText:
    "Flying. On deploy, draw 1. The first divination tool the Oracle's apprentices learn is a bird that already knows where the body is.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 1,
};

export const oracle_02: CardDefinition = {
  id: "s1_class_oracle_02" as CardDefinition["id"],
  name: "Prescient Glyph",
  faction: "dreamer",
  characterClass: "oracle",
  cardType: "spell",
  rarity: "uncommon",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "ora02_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: { op: "draw", amount: { kind: "const", value: 2 }, who: "self" },
    },
  ],
  art: assetUrl("art/cards/class/prescient_glyph.webp"),
  flavorText:
    "Draw 2 cards. A glyph you carved yesterday because today's version of you was going to need it.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 1,
};

export const oracle_03: CardDefinition = {
  id: "s1_class_oracle_03" as CardDefinition["id"],
  name: "Reader of Tomorrows",
  faction: "dreamer",
  characterClass: "oracle",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: ["flying", "dispel"],
  abilities: [],
  art: assetUrl("art/cards/class/reader_of_tomorrows.webp"),
  flavorText:
    "Flying. Dispel. Your enemy's plan and your enemy's belief in your enemy's plan are two different things, and she can untangle both at once.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const oracle_04: CardDefinition = {
  id: "s1_class_oracle_04" as CardDefinition["id"],
  name: "Second Sight",
  faction: "dreamer",
  characterClass: "oracle",
  cardType: "spell",
  rarity: "epic",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "ora04_draw3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: { op: "draw", amount: { kind: "const", value: 3 }, who: "self" },
    },
  ],
  art: assetUrl("art/cards/class/second_sight.webp"),
  flavorText:
    "Draw 3 cards. What you see with first sight is the room. What you see with second sight is the room's opinion of you.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};

export const oracle_05: CardDefinition = {
  id: "s1_class_oracle_05" as CardDefinition["id"],
  name: "The Oracle's Unbroken Signal",
  faction: "dreamer",
  characterClass: "oracle",
  cardType: "unit",
  rarity: "legendary",
  cost: 5,
  baseStats: { power: 3, health: 6 },
  keywords: ["flying", "dispel", "forcefield"],
  abilities: [
    {
      id: "ora05_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 2 }, who: "self" },
    },
  ],
  art: assetUrl("art/cards/class/s1_class_oracle_05.webp"),
  flavorText:
    "Flying. Dispel. Forcefield. On deploy, draw 2. The White Oracle is suspended in a processing loop. The loop is supposed to contain her. It has been leaking since the day it closed, and these cards are some of the shapes the leak takes.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const ORACLE_CLASS_CARDS: readonly CardDefinition[] = Object.freeze([
  oracle_01, oracle_02, oracle_03, oracle_04, oracle_05,
]);
