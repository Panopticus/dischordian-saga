/**
 * Allegiance Cards — Antiquarian (6 cards). Phase D8.
 *
 * Tiers unlock by playing + winning Antiquarian matches.
 * Mechanical identity: grow, rebirth, draw — the long-view
 * vocabulary. These cards get stronger the longer the game
 * runs, which is the Antiquarian's whole philosophy.
 */
import type { CardDefinition } from "../../../index";

export const ant_alleg_t1: CardDefinition = {
  id: "s1_alleg_antiquarian_t1" as CardDefinition["id"],
  name: "Antiquarian Apprentice",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 4 },
  keywords: ["grow"],
  abilities: [],
  art: "/art/cards/allegiance/s1_alleg_antiquarian_t1.webp",
  flavorText:
    "Unlocked by playing 10 Antiquarian matches. Grow. An apprentice has not yet been told which ending of the twelve possible endings they are currently working toward. They will figure it out around tier 4.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const ant_alleg_t2: CardDefinition = {
  id: "s1_alleg_antiquarian_t2" as CardDefinition["id"],
  name: "Antiquarian Scholar",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 5 },
  keywords: ["grow"],
  abilities: [
    {
      id: "ant_alleg_t2_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    },
  ],
  art: "/art/cards/allegiance/s1_alleg_antiquarian_t2.webp",
  flavorText:
    "Unlocked by playing 25 Antiquarian matches. Grow. On deploy, draw 1. A scholar has read the page the opponent is about to write.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 1,
};

export const ant_alleg_t3: CardDefinition = {
  id: "s1_alleg_antiquarian_t3" as CardDefinition["id"],
  name: "Antiquarian Curator",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 6 },
  keywords: ["grow", "rebirth"],
  abilities: [],
  art: "/art/cards/allegiance/s1_alleg_antiquarian_t3.webp",
  flavorText:
    "Unlocked by playing 50 Antiquarian matches. Grow. Rebirth. A curator does not die. A curator rotates into storage and waits.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const ant_alleg_t4: CardDefinition = {
  id: "s1_alleg_antiquarian_t4" as CardDefinition["id"],
  name: "Antiquarian Victorious Lorekeeper",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 7 },
  keywords: ["grow", "rebirth", "forcefield"],
  abilities: [],
  art: "/art/cards/allegiance/s1_alleg_antiquarian_t4.webp",
  flavorText:
    "Unlocked by winning 10 Antiquarian matches. Grow. Rebirth. Forcefield. A victorious lorekeeper has been in the library during a fire and has chosen which three books to carry out.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const ant_alleg_t5: CardDefinition = {
  id: "s1_alleg_antiquarian_t5" as CardDefinition["id"],
  name: "Antiquarian Archive-Keeper",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 8 },
  keywords: ["grow", "rebirth", "forcefield"],
  abilities: [
    {
      id: "ant_alleg_t5_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 2 }, who: "self" },
    },
  ],
  art: "/art/cards/allegiance/s1_alleg_antiquarian_t5.webp",
  flavorText:
    "Unlocked by winning 50 Antiquarian matches. Grow. Rebirth. Forcefield. On deploy, draw 2. An archive-keeper is the only person who knows where the complete ending catalogue is shelved. The Antiquarian does not. He is waiting to be told.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence", "narrative"] as const,
  verdict_delta: 2,
};

export const ant_alleg_t6: CardDefinition = {
  id: "s1_alleg_antiquarian_t6" as CardDefinition["id"],
  name: "Antiquarian Champion",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 5, health: 10 },
  keywords: ["grow", "rebirth", "forcefield"],
  abilities: [
    {
      id: "ant_alleg_t6_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 3 }, who: "self" },
    },
  ],
  art: "/art/cards/allegiance/s1_alleg_antiquarian_t6.webp",
  flavorText:
    "Unlocked by winning 100 Antiquarian matches. Grow. Rebirth. Forcefield. On deploy, draw 3. The Antiquarian Champion is the Antiquarian himself, briefly willing to sit across the table from you because you have become one of the twelve possible endings and he wants to be on the record as having liked this one.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence", "narrative"] as const,
  verdict_delta: 2,
};

export const ANTIQUARIAN_ALLEGIANCE_CARDS: readonly CardDefinition[] = Object.freeze([
  ant_alleg_t1, ant_alleg_t2, ant_alleg_t3, ant_alleg_t4, ant_alleg_t5, ant_alleg_t6,
]);
