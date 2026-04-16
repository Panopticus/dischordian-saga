/**
 * Class Cards — Engineer (5 cards). Phase B4.
 *
 * Build, modify, tech. The engineer's TCG identity is setting up
 * structures and drawing more resources than they should be able
 * to. Mechanical vocabulary: card draw, mana refund, structure,
 * artifacts.
 *
 * Class restriction: only players of the engineer class.
 *
 * IDs follow the convention s1_class_engineer_{01..05}.
 */
import type { CardDefinition } from "../../../index";

export const engineer_01: CardDefinition = {
  id: "s1_class_engineer_01" as CardDefinition["id"],
  name: "Workshop Drone",
  faction: "antiquarian",
  characterClass: "engineer",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "eng01_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    },
  ],
  art: "/art/cards/class/s1_class_engineer_01.webp",
  flavorText:
    "On deploy, draw 1. The first thing the Engineer builds in any new workshop is a smaller version of himself that he can hand the smaller problems to.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};

export const engineer_02: CardDefinition = {
  id: "s1_class_engineer_02" as CardDefinition["id"],
  name: "Field Modification",
  faction: "antiquarian",
  characterClass: "engineer",
  cardType: "spell",
  rarity: "uncommon",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "eng02_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: { op: "draw", amount: { kind: "const", value: 2 }, who: "self" },
    },
    {
      id: "eng02_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: { op: "gain_mana", amount: { kind: "const", value: 1 }, permanent: false },
    },
  ],
  art: "/art/cards/class/s1_class_engineer_02.webp",
  flavorText:
    "Draw 2 cards and gain 1 mana this turn. Every invention pays for itself or it is not an invention, it is just a mistake with enthusiasm.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};

export const engineer_03: CardDefinition = {
  id: "s1_class_engineer_03" as CardDefinition["id"],
  name: "Kinetic Containment Sink",
  faction: "antiquarian",
  characterClass: "engineer",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 1, health: 6 },
  keywords: ["provoke"],
  abilities: [],
  art: "/art/cards/class/s1_class_engineer_03.webp",
  flavorText:
    "Provoke. A structure the Engineer built the week he accidentally invented Rush and lost three lab walls. He patched the walls by telling the kinetic overflow where to go.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};

export const engineer_04: CardDefinition = {
  id: "s1_class_engineer_04" as CardDefinition["id"],
  name: "Prototype Blueprint",
  faction: "antiquarian",
  characterClass: "engineer",
  cardType: "spell",
  rarity: "epic",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "eng04_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: { op: "draw", amount: { kind: "const", value: 3 }, who: "self" },
    },
  ],
  art: "/art/cards/class/s1_class_engineer_04.webp",
  flavorText:
    "Draw 3 cards. A blueprint is a design that has not yet been talked out of itself by the physics it will have to live inside of.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};

export const engineer_05: CardDefinition = {
  id: "s1_class_engineer_05" as CardDefinition["id"],
  name: "The Engineer's Apprentice",
  faction: "antiquarian",
  characterClass: "engineer",
  cardType: "unit",
  rarity: "legendary",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "eng05_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 2 }, who: "self" },
    },
    {
      id: "eng05_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "gain_mana", amount: { kind: "const", value: 2 }, permanent: false },
    },
  ],
  art: "/art/cards/class/s1_class_engineer_05.webp",
  flavorText:
    "On deploy, draw 2 and gain 2 mana this turn. The Engineer's apprentices learn by building the same instrument their master built, in a different way, because the different way is the only thing that will teach them anything the master's way could not already say.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};

export const ENGINEER_CLASS_CARDS: readonly CardDefinition[] = Object.freeze([
  engineer_01, engineer_02, engineer_03, engineer_04, engineer_05,
]);
