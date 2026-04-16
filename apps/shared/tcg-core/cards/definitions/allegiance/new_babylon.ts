/**
 * Allegiance Cards — New Babylon (6 cards). Phase D7.
 *
 * Tiers unlock by playing + winning New Babylon matches.
 * Mechanical identity: drain, provoke, forcefield — elegant
 * cruelty with an accountant's eye.
 */
import type { CardDefinition } from "../../../index";

export const nb_alleg_t1: CardDefinition = {
  id: "s1_alleg_new_babylon_t1" as CardDefinition["id"],
  name: "Babylonian Clerk",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [],
  art: "/art/cards/allegiance/s1_alleg_new_babylon_t1.webp",
  flavorText:
    "Unlocked by playing 10 New Babylon matches. A clerk keeps the receipts you are about to need but would rather not have.",
  rulesVersion: "1.0.0",
};

export const nb_alleg_t2: CardDefinition = {
  id: "s1_alleg_new_babylon_t2" as CardDefinition["id"],
  name: "Babylonian Magistrate",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 5 },
  keywords: ["provoke"],
  abilities: [],
  art: "/art/cards/allegiance/s1_alleg_new_babylon_t2.webp",
  flavorText:
    "Unlocked by playing 25 New Babylon matches. Provoke. The magistrate calls the session to order and then keeps it in order by making eye contact with exactly the right person at exactly the right time.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};

export const nb_alleg_t3: CardDefinition = {
  id: "s1_alleg_new_babylon_t3" as CardDefinition["id"],
  name: "Babylonian Tax Collector",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["drain"],
  abilities: [],
  art: "/art/cards/allegiance/s1_alleg_new_babylon_t3.webp",
  flavorText:
    "Unlocked by playing 50 New Babylon matches. Drain. The tax collector takes a small amount of everything she handles, and by the end of the year she has a very reasonable amount of everything.",
  rulesVersion: "1.0.0",
};

export const nb_alleg_t4: CardDefinition = {
  id: "s1_alleg_new_babylon_t4" as CardDefinition["id"],
  name: "Babylonian Victorious Adjudicator",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 6 },
  keywords: ["provoke", "drain"],
  abilities: [],
  art: "/art/cards/allegiance/s1_alleg_new_babylon_t4.webp",
  flavorText:
    "Unlocked by winning 10 New Babylon matches. Provoke. Drain. The Victorious Adjudicator closes the books on every case they touch, which is the polite version of a sentence that used to end differently.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence"] as const,
};

export const nb_alleg_t5: CardDefinition = {
  id: "s1_alleg_new_babylon_t5" as CardDefinition["id"],
  name: "Babylonian Archon-Elect",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 7 },
  keywords: ["provoke", "drain", "forcefield"],
  abilities: [],
  art: "/art/cards/allegiance/s1_alleg_new_babylon_t5.webp",
  flavorText:
    "Unlocked by winning 50 New Babylon matches. Provoke. Drain. Forcefield. The Archon-Elect is one vote away from a seat in the Chamber, and has been one vote away for ninety years. That is the patient version of politics.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};

export const nb_alleg_t6: CardDefinition = {
  id: "s1_alleg_new_babylon_t6" as CardDefinition["id"],
  name: "New Babylon Champion",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 6, health: 10 },
  keywords: ["provoke", "drain", "forcefield"],
  abilities: [
    {
      id: "nb_alleg_t6_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 6 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: "/art/cards/allegiance/s1_alleg_new_babylon_t6.webp",
  flavorText:
    "Unlocked by winning 100 New Babylon matches. Provoke. Drain. Forcefield. On deploy, heal your general for 6. The New Babylon Champion is not yet Adjudicator Locke. They are the version of Locke you get when they finally put their foot down and the foot makes a sound.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};

export const NEW_BABYLON_ALLEGIANCE_CARDS: readonly CardDefinition[] = Object.freeze([
  nb_alleg_t1, nb_alleg_t2, nb_alleg_t3, nb_alleg_t4, nb_alleg_t5, nb_alleg_t6,
]);
