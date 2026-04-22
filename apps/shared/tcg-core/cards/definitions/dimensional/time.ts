/**
 * Dimension Cards — Time (3 cards). Phase C6.
 *
 * Time in Dischordia is a resource, not a fabric. Mechanical
 * vocabulary: grow (the unit is larger later), rebirth (the unit
 * is still here next turn), on_turn_start triggers.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const time_01: CardDefinition = {
  id: "s1_dim_time_01" as CardDefinition["id"],
  name: "Moment Keeper",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 1, health: 4 },
  keywords: ["grow"],
  abilities: [],
  art: assetUrl("art/cards/dimension/s1_dim_time_01.webp"),
  flavorText:
    "Grow. The Moment Keeper takes the moment the opponent was not using and files it. She gets larger the longer anybody forgets she is there.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
};

export const time_02: CardDefinition = {
  id: "s1_dim_time_02" as CardDefinition["id"],
  name: "Loop Walker",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: ["grow", "rebirth"],
  abilities: [],
  art: assetUrl("art/cards/dimension/s1_dim_time_02.webp"),
  flavorText:
    "Grow. Rebirth. The Loop Walker dies and walks out of the same door he walked in, which is the one over there that you are looking at right now.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const time_03: CardDefinition = {
  id: "s1_dim_time_03" as CardDefinition["id"],
  name: "Hour-Unmaker",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 4, health: 7 },
  keywords: ["grow", "rebirth", "forcefield"],
  abilities: [],
  art: assetUrl("art/cards/dimension/s1_dim_time_03.webp"),
  flavorText:
    "Grow. Rebirth. Forcefield. The Hour-Unmaker has a list of hours that nobody has yet agreed to spend, and he is spending them on the match you are playing. The match is taking longer on his side than yours.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const TIME_DIMENSION_CARDS: readonly CardDefinition[] = Object.freeze([
  time_01, time_02, time_03,
]);
