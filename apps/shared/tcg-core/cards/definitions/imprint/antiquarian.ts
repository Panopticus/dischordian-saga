/**
 * Imprint Set — The Antiquarian (5 tiers). Phase F18.
 *
 * Catalogue-keeper of the twelve possible endings. Charges tuition
 * no one wants to pay. Mechanical vocabulary: grow, rebirth, the
 * long view — the Antiquarian gets stronger the longer the game
 * runs, and he is never the one who had to hurry.
 *
 * Tier id convention: s1_imprint_antiquarian_t{1..5}
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const antiquarian_t1: CardDefinition = {
  id: "s1_imprint_antiquarian_t1" as CardDefinition["id"],
  name: "Imprint: The Antiquarian (Common)",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 1, health: 5 },
  keywords: ["grow"],
  abilities: [],
  art: assetUrl("art/cards/imprint/antiquarian_t1.webp"),
  flavorText:
    "Grow. A robed figure reading the margins of a book thicker than any shelf should be able to hold. He has not looked up yet.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const antiquarian_t2: CardDefinition = {
  id: "s1_imprint_antiquarian_t2" as CardDefinition["id"],
  name: "Imprint: The Antiquarian (Uncommon)",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 5 },
  keywords: ["grow"],
  abilities: [],
  art: assetUrl("art/cards/imprint/antiquarian_t2.webp"),
  flavorText:
    "Grow. He is reading the ending you will reach if you keep playing the way you are playing. He is making small disapproving notes in pencil.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const antiquarian_t3: CardDefinition = {
  id: "s1_imprint_antiquarian_t3" as CardDefinition["id"],
  name: "Imprint: The Antiquarian (Rare)",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 6 },
  keywords: ["grow", "rebirth"],
  abilities: [],
  art: assetUrl("art/cards/imprint/antiquarian_t3.webp"),
  flavorText:
    "Grow. Rebirth. The Antiquarian has already lived the conclusion of this match before. He is using the rematch to correct his earlier annotations.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const antiquarian_t4: CardDefinition = {
  id: "s1_imprint_antiquarian_t4" as CardDefinition["id"],
  name: "Imprint: The Antiquarian (Epic)",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 7 },
  keywords: ["grow", "rebirth"],
  abilities: [
    {
      id: "ant_t4_draw_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/imprint/antiquarian_t4.webp"),
  flavorText:
    "Grow. Rebirth. On deploy, draw a card. He pulls the next page from a book you are beginning to suspect he wrote about you specifically.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const antiquarian_t5: CardDefinition = {
  id: "s1_imprint_antiquarian_t5" as CardDefinition["id"],
  name: "The Antiquarian, Ending-Cataloguer",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 5, health: 8 },
  keywords: ["grow", "rebirth", "forcefield"],
  abilities: [
    {
      id: "ant_t5_draw_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/imprint/antiquarian_t5.webp"),
  flavorText:
    "Grow. Rebirth. Forcefield. On deploy, draw 2. The Antiquarian has catalogued twelve endings for the Dischordian universe. He has not told anyone which one he thinks this particular game is headed for. He does not want to ruin it.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const ANTIQUARIAN_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  antiquarian_t1,
  antiquarian_t2,
  antiquarian_t3,
  antiquarian_t4,
  antiquarian_t5,
]);
