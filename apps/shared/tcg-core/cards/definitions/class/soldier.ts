/**
 * Class Cards — Soldier (5 cards). Phase B5.
 *
 * Rally, formation, direct combat. The soldier's TCG identity is
 * straightforward beatdown — big units, provoke walls, rush
 * finishers. Nothing fancy, everything reliable.
 *
 * Class restriction: only players of the soldier class.
 *
 * IDs follow the convention s1_class_soldier_{01..05}.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const soldier_01: CardDefinition = {
  id: "s1_class_soldier_01" as CardDefinition["id"],
  name: "Line Recruit",
  faction: "insurgency",
  characterClass: "soldier",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 3 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/class/line_recruit.webp"),
  flavorText:
    "Three power, three health, two cost. There is no ability on the card. That is the ability.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const soldier_02: CardDefinition = {
  id: "s1_class_soldier_02" as CardDefinition["id"],
  name: "Shieldwall",
  faction: "insurgency",
  characterClass: "soldier",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 6 },
  keywords: ["provoke"],
  abilities: [],
  art: assetUrl("art/cards/class/shieldwall.webp"),
  flavorText:
    "Provoke. The soldier stands in front of the rest of the formation on purpose, every time, and expects the rest of the formation to know this is the deal.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const soldier_03: CardDefinition = {
  id: "s1_class_soldier_03" as CardDefinition["id"],
  name: "Rally the Line",
  faction: "insurgency",
  characterClass: "soldier",
  cardType: "spell",
  rarity: "rare",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "sol03_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "buff",
        stats: { power: 2, health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/class/rally_the_line.webp"),
  flavorText:
    "Your general gains +2/+2 permanently. A rally is the sentence a commander gives to the room they cannot leave.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
};

export const soldier_04: CardDefinition = {
  id: "s1_class_soldier_04" as CardDefinition["id"],
  name: "Iron Vanguard",
  faction: "insurgency",
  characterClass: "soldier",
  cardType: "unit",
  rarity: "epic",
  cost: 4,
  baseStats: { power: 5, health: 5 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "sol04_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "rush",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/class/iron_vanguard.webp"),
  flavorText:
    "Provoke. Rush on deploy. The Iron Vanguard's formation doctrine is a single word repeated four times in the same sentence. The word is 'forward.'",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence", "narrative"] as const,
  verdict_delta: 2,
};

export const soldier_05: CardDefinition = {
  id: "s1_class_soldier_05" as CardDefinition["id"],
  name: "The Last Regiment Standing",
  faction: "insurgency",
  characterClass: "soldier",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 7, health: 7 },
  keywords: ["provoke", "frenzy", "rebirth"],
  abilities: [],
  art: assetUrl("art/cards/class/s1_class_soldier_05.webp"),
  flavorText:
    "Provoke. Frenzy. Rebirth. The last regiment standing is the one that did not know the war was officially over, and by the time anyone told them, the war unofficially was not.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const SOLDIER_CLASS_CARDS: readonly CardDefinition[] = Object.freeze([
  soldier_01, soldier_02, soldier_03, soldier_04, soldier_05,
]);
