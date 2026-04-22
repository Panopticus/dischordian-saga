/**
 * Element Cards — Water (5 cards). Phase C3.
 *
 * Water = adaptive, healing, dispelling, shape-changing.
 * Mechanical vocabulary: heal, dispel, drain, balanced stats.
 *
 * IDs follow the convention s1_elem_water_{01..05}.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const water_01: CardDefinition = {
  id: "s1_elem_water_01" as CardDefinition["id"],
  name: "Tide Keeper",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "water01_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/element/s1_elem_water_01.webp"),
  flavorText:
    "On deploy, heal your general for 2. A tide keeper knows which wave is going to be the one that matters and stands one wave back from it.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const water_02: CardDefinition = {
  id: "s1_elem_water_02" as CardDefinition["id"],
  name: "Dissolving Wave",
  faction: "neutral",
  cardType: "spell",
  rarity: "uncommon",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "water02_silence" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: { op: "silence", to: { kind: "enemy_general" } },
    },
  ],
  art: assetUrl("art/cards/element/s1_elem_water_02.webp"),
  flavorText:
    "Silence the enemy general. Water that has been taught to ask questions eventually becomes a solvent.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};

export const water_03: CardDefinition = {
  id: "s1_elem_water_03" as CardDefinition["id"],
  name: "Mercy Current",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "water03_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 6 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/element/s1_elem_water_03.webp"),
  flavorText:
    "Heal your general for 6. The mercy current is the part of a river that decides not to take anything with it on purpose.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const water_04: CardDefinition = {
  id: "s1_elem_water_04" as CardDefinition["id"],
  name: "Abyssal Form",
  faction: "neutral",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: ["drain", "dispel"],
  abilities: [],
  art: assetUrl("art/cards/element/s1_elem_water_04.webp"),
  flavorText:
    "Drain. Dispel. The Abyssal Form has lived at the bottom of a sea that existed for four days in the second week of the Fall and was remembered by nobody.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};

export const water_05: CardDefinition = {
  id: "s1_elem_water_05" as CardDefinition["id"],
  name: "The Ocean That Forgives",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 5, health: 8 },
  keywords: ["drain", "dispel"],
  abilities: [
    {
      id: "water05_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 8 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/element/s1_elem_water_05.webp"),
  flavorText:
    "Drain. Dispel. On deploy, heal your general for 8. The Ocean That Forgives is a body of water big enough that the thing you are ashamed of will be smaller than a wave in it, and the wave will arrive whether or not you asked it to.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const WATER_ELEMENT_CARDS: readonly CardDefinition[] = Object.freeze([
  water_01, water_02, water_03, water_04, water_05,
]);
