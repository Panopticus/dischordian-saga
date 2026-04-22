/**
 * Allegiance Cards — Insurgency (6 cards). Phase D5.
 *
 * Tiers unlock by playing + winning Insurgency matches.
 * Mechanical identity: rush, rebirth, provoke, backstab — the
 * defiance-and-momentum vocabulary.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const ins_alleg_t1: CardDefinition = {
  id: "s1_alleg_insurgency_t1" as CardDefinition["id"],
  name: "Insurgency Recruit",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_insurgency_t1.webp"),
  flavorText:
    "Unlocked by playing 10 Insurgency matches. A recruit showed up because the alternative was staying where they were. That is the whole pitch.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const ins_alleg_t2: CardDefinition = {
  id: "s1_alleg_insurgency_t2" as CardDefinition["id"],
  name: "Insurgency Partisan",
  faction: "insurgency",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 4, health: 3 },
  keywords: ["rush"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_insurgency_t2.webp"),
  flavorText:
    "Unlocked by playing 25 Insurgency matches. Rush. A partisan is a person who does not wait to be told the mission has started.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};

export const ins_alleg_t3: CardDefinition = {
  id: "s1_alleg_insurgency_t3" as CardDefinition["id"],
  name: "Insurgency Veteran",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 5, health: 4 },
  keywords: ["rush", "backstab"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_insurgency_t3.webp"),
  flavorText:
    "Unlocked by playing 50 Insurgency matches. Rush. Backstab. A veteran has the scar and they will show you the scar if you ask them once, and then never again.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};

export const ins_alleg_t4: CardDefinition = {
  id: "s1_alleg_insurgency_t4" as CardDefinition["id"],
  name: "Insurgency Victorious Veteran",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 5, health: 5 },
  keywords: ["rush", "backstab", "rebirth"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_insurgency_t4.webp"),
  flavorText:
    "Unlocked by winning 10 Insurgency matches. Rush. Backstab. Rebirth. A victorious veteran is the person the rest of the squad points at when a new recruit asks 'who decides when we go?' The answer is always 'him, last time.'",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "offensive"] as const,
  verdict_delta: 1,
};

export const ins_alleg_t5: CardDefinition = {
  id: "s1_alleg_insurgency_t5" as CardDefinition["id"],
  name: "Insurgency Elite",
  faction: "insurgency",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 6, health: 6 },
  keywords: ["rush", "backstab", "rebirth", "frenzy"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_insurgency_t5.webp"),
  flavorText:
    "Unlocked by winning 50 Insurgency matches. Rush. Backstab. Rebirth. Frenzy. The Elite were the first unit to breach a Panopticon relay and the first unit to come back out with the relay intact and one new tattoo each.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const ins_alleg_t6: CardDefinition = {
  id: "s1_alleg_insurgency_t6" as CardDefinition["id"],
  name: "Insurgency Champion",
  faction: "insurgency",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 7, health: 8 },
  keywords: ["rush", "provoke", "backstab", "rebirth", "frenzy"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_insurgency_t6.webp"),
  flavorText:
    "Unlocked by winning 100 Insurgency matches. Rush. Provoke. Backstab. Rebirth. Frenzy. The Insurgency Champion is not a character either. They are the shape you make out of yourself over a hundred matches of not backing down.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const INSURGENCY_ALLEGIANCE_CARDS: readonly CardDefinition[] = Object.freeze([
  ins_alleg_t1, ins_alleg_t2, ins_alleg_t3, ins_alleg_t4, ins_alleg_t5, ins_alleg_t6,
]);
