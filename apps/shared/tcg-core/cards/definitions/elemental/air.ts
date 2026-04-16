/**
 * Element Cards — Air (5 cards). Phase C4.
 *
 * Air = mobile, uncatchable, communicative. Mechanical vocabulary:
 * flying, card draw, dispel, ephemeral presence.
 *
 * IDs follow the convention s1_elem_air_{01..05}.
 */
import type { CardDefinition } from "../../../index";

export const air_01: CardDefinition = {
  id: "s1_elem_air_01" as CardDefinition["id"],
  name: "Breeze Whisper",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 2 },
  keywords: ["flying"],
  abilities: [
    {
      id: "air01_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    },
  ],
  art: "/art/cards/element/s1_elem_air_01.webp",
  flavorText:
    "Flying. On deploy, draw 1. A breeze is the part of the air that has been given something to do and does not yet know by whom.",
  rulesVersion: "1.0.0",
};

export const air_02: CardDefinition = {
  id: "s1_elem_air_02" as CardDefinition["id"],
  name: "Skyrider",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["flying"],
  abilities: [],
  art: "/art/cards/element/s1_elem_air_02.webp",
  flavorText:
    "Flying. 3/3 for three. The skyrider does not ride anything. The air has agreed to behave like something that can be ridden, and she has agreed to keep agreeing.",
  rulesVersion: "1.0.0",
};

export const air_03: CardDefinition = {
  id: "s1_elem_air_03" as CardDefinition["id"],
  name: "Gale Chorus",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "air03_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: { op: "draw", amount: { kind: "const", value: 2 }, who: "self" },
    },
  ],
  art: "/art/cards/element/s1_elem_air_03.webp",
  flavorText:
    "Draw 2 cards. A gale chorus is a wind that has learned to sing in chorus because no individual wind was willing to commit to the key.",
  rulesVersion: "1.0.0",
};

export const air_04: CardDefinition = {
  id: "s1_elem_air_04" as CardDefinition["id"],
  name: "Cyclone Herald",
  faction: "neutral",
  cardType: "unit",
  rarity: "epic",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["flying", "dispel"],
  abilities: [],
  art: "/art/cards/element/s1_elem_air_04.webp",
  flavorText:
    "Flying. Dispel. A cyclone does not announce itself. The Cyclone Herald is what the cyclone sends ahead to clear the weather of other weather.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};

export const air_05: CardDefinition = {
  id: "s1_elem_air_05" as CardDefinition["id"],
  name: "The Breath Before Language",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 5, health: 6 },
  keywords: ["flying", "dispel"],
  abilities: [
    {
      id: "air05_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 3 }, who: "self" },
    },
  ],
  art: "/art/cards/element/s1_elem_air_05.webp",
  flavorText:
    "Flying. Dispel. On deploy, draw 3. The Breath Before Language is the quarter-second of air you are about to use to say the thing you have not yet committed to. He is wearing it as a coat.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};

export const AIR_ELEMENT_CARDS: readonly CardDefinition[] = Object.freeze([
  air_01, air_02, air_03, air_04, air_05,
]);
