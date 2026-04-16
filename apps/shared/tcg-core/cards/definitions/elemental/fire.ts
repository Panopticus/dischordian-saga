/**
 * Element Cards — Fire (5 cards). Phase C2.
 *
 * Fire = fast, aggressive, brittle. Mechanical vocabulary:
 * rush (arrives already moving), celerity (attacks twice),
 * high power, low health, direct damage spells.
 *
 * IDs follow the convention s1_elem_fire_{01..05}.
 */
import type { CardDefinition } from "../../../index";

export const fire_01: CardDefinition = {
  id: "s1_elem_fire_01" as CardDefinition["id"],
  name: "Ember Scout",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 1 },
  keywords: [],
  abilities: [
    {
      id: "fire01_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "rush",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/element/s1_elem_fire_01.webp",
  flavorText:
    "Rush on deploy. 3/1. An ember scout is a single candle on a long empty road. It does not last. It gets the door open.",
  rulesVersion: "1.0.0",
};

export const fire_02: CardDefinition = {
  id: "s1_elem_fire_02" as CardDefinition["id"],
  name: "Spark Fragment",
  faction: "neutral",
  cardType: "spell",
  rarity: "uncommon",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "fire02_dmg" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 3 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: "/art/cards/element/s1_elem_fire_02.webp",
  flavorText:
    "Deal 3 damage to the enemy general. A spark is a decision that stops being one the moment you let go of it.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
};

export const fire_03: CardDefinition = {
  id: "s1_elem_fire_03" as CardDefinition["id"],
  name: "Blaze Lancer",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 5, health: 2 },
  keywords: ["celerity"],
  abilities: [],
  art: "/art/cards/element/s1_elem_fire_03.webp",
  flavorText:
    "Celerity. 5/2. A blaze lancer strikes twice because the first strike has already used up half of her.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
};

export const fire_04: CardDefinition = {
  id: "s1_elem_fire_04" as CardDefinition["id"],
  name: "Conflagration",
  faction: "neutral",
  cardType: "spell",
  rarity: "epic",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "fire04_dmg" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 6 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: "/art/cards/element/s1_elem_fire_04.webp",
  flavorText:
    "Deal 6 damage to the enemy general. A conflagration is a fire that has stopped waiting for fuel and is now metabolizing context.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
};

export const fire_05: CardDefinition = {
  id: "s1_elem_fire_05" as CardDefinition["id"],
  name: "The First Flame",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 8, health: 4 },
  keywords: ["rush", "celerity", "frenzy"],
  abilities: [],
  art: "/art/cards/element/s1_elem_fire_05.webp",
  flavorText:
    "Rush. Celerity. Frenzy. 8/4. The First Flame has been burning since before there were hands to warm by it, and it is very tired of not being used.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
};

export const FIRE_ELEMENT_CARDS: readonly CardDefinition[] = Object.freeze([
  fire_01, fire_02, fire_03, fire_04, fire_05,
]);
