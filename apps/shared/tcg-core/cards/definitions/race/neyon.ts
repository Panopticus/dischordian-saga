/**
 * Race Cards — Ne-Yon (3 cards). Phase C11.
 *
 * Ne-Yon as a race (not a player class) are the Dischordian
 * successor-humans — genetic descendants of pre-Fall humanity
 * who retained full neural plasticity where the other races
 * specialized. They are the baseline from which every other
 * Season-1 NPC has been derived or modified. Mechanical
 * vocabulary: balanced stats, hybrid keywords, card draw.
 */
import type { CardDefinition } from "../../../index";

export const neyon_race_01: CardDefinition = {
  id: "s1_race_neyon_01" as CardDefinition["id"],
  name: "Ne-Yon Adept",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "neyr01_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    },
  ],
  art: "/art/cards/race/s1_race_neyon_01.webp",
  flavorText:
    "On deploy, draw 1. A Ne-Yon adept has the same brain the first humans had, and they have learned to use eleven percent of it, which is eleven percent more than the other races believe is possible.",
  rulesVersion: "1.0.0",
};

export const neyon_race_02: CardDefinition = {
  id: "s1_race_neyon_02" as CardDefinition["id"],
  name: "Ne-Yon Bondwalker",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["flying"],
  abilities: [],
  art: "/art/cards/race/s1_race_neyon_02.webp",
  flavorText:
    "Flying. Ne-Yon Bondwalkers can ride any pet species that has agreed to ride them back. The negotiation is the first thing they teach at the academy, and the academy is sometimes a bird.",
  rulesVersion: "1.0.0",
};

export const neyon_race_03: CardDefinition = {
  id: "s1_race_neyon_03" as CardDefinition["id"],
  name: "Kael, First of the Ne-Yon",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 6, health: 7 },
  keywords: ["flying", "rush"],
  abilities: [
    {
      id: "neyr03_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 2 }, who: "self" },
    },
  ],
  art: "/art/cards/race/s1_race_neyon_03.webp",
  flavorText:
    "Flying. Rush. On deploy, draw 2. Kael was the first human the Dischordian cosmology let through the gate that became Ne-Yon, and every Ne-Yon you meet after this match will be wearing her smile somewhere on their own face without knowing why.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
};

export const NEYON_RACE_CARDS: readonly CardDefinition[] = Object.freeze([
  neyon_race_01, neyon_race_02, neyon_race_03,
]);
