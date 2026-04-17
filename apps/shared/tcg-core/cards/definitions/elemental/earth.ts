/**
 * Element Cards — Earth (5 cards). Phase C1.
 *
 * Earth = heavy, rooted, slow, durable. Mechanical vocabulary:
 * provoke (you stand in front), forcefield (you don't break),
 * high health, low power, endurance. Neutral faction so any deck
 * can run them — elements in Dischordia are not faction-owned,
 * they are physics.
 *
 * IDs follow the convention s1_elem_earth_{01..05}.
 */
import type { CardDefinition } from "../../../index";

export const earth_01: CardDefinition = {
  id: "s1_elem_earth_01" as CardDefinition["id"],
  name: "Rooted Sentinel",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 5 },
  keywords: ["provoke"],
  abilities: [],
  art: "/art/cards/element/s1_elem_earth_01.webp",
  flavorText:
    "Provoke. The first earth element the Engineer catalogued was a man who had been standing in one spot for so long that the spot had started to belong to him.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const earth_02: CardDefinition = {
  id: "s1_elem_earth_02" as CardDefinition["id"],
  name: "Slate Golem",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 6 },
  keywords: ["provoke", "forcefield"],
  abilities: [],
  art: "/art/cards/element/s1_elem_earth_02.webp",
  flavorText:
    "Provoke. Forcefield. Assembled from sheets of grey stone mined from a world that had decided it was done being a world.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const earth_03: CardDefinition = {
  id: "s1_elem_earth_03" as CardDefinition["id"],
  name: "Mountain Vow",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "earth03_hp" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 5 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: "/art/cards/element/s1_elem_earth_03.webp",
  flavorText:
    "Heal your general for 5. A mountain vow is a promise made while holding a mountain in mind. Most of the mountain agrees.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const earth_04: CardDefinition = {
  id: "s1_elem_earth_04" as CardDefinition["id"],
  name: "Tectonic Warden",
  faction: "neutral",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 9 },
  keywords: ["provoke", "forcefield"],
  abilities: [],
  art: "/art/cards/element/s1_elem_earth_04.webp",
  flavorText:
    "Provoke. Forcefield. Nine health. The Tectonic Warden is the oldest element on the board. Everything you try to do to him has been tried before by a glacier.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const earth_05: CardDefinition = {
  id: "s1_elem_earth_05" as CardDefinition["id"],
  name: "The Sleeping Continent",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 5, health: 14 },
  keywords: ["provoke", "forcefield", "grow"],
  abilities: [],
  art: "/art/cards/element/s1_elem_earth_05.webp",
  flavorText:
    "Provoke. Forcefield. Grow. Fourteen health. Every turn, larger. The Sleeping Continent has not yet noticed this match. When he does, it will be because the match is over.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const EARTH_ELEMENT_CARDS: readonly CardDefinition[] = Object.freeze([
  earth_01, earth_02, earth_03, earth_04, earth_05,
]);
