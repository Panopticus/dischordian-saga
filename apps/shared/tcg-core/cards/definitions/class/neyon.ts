/**
 * Class Cards — Ne-Yon (5 cards). Phase B6.
 *
 * The meta-class. Unlocked only for players who have mastered
 * three or more of the other five classes. The Ne-Yon's TCG
 * identity is hybrid — every card here borrows a keyword from
 * two different classes and combines them, because that is
 * literally what a Ne-Yon is: a human who contains more than
 * one training discipline at the same time.
 *
 * Class restriction: only players of the neyon meta-class, which
 * the server-side class-mastery check gates on having reached
 * rank 3+ in at least three other classes.
 *
 * IDs follow the convention s1_class_neyon_{01..05}.
 */
import type { CardDefinition } from "../../../index";

export const neyon_01: CardDefinition = {
  id: "s1_class_neyon_01" as CardDefinition["id"],
  name: "Hybrid Initiate",
  faction: "neutral",
  characterClass: "neyon",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["backstab"],
  abilities: [
    {
      id: "ney01_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    },
  ],
  art: "/art/cards/class/s1_class_neyon_01.webp",
  flavorText:
    "Backstab. On deploy, draw 1. A Ne-Yon's first hybrid move is always spy + oracle. The second is the one you cannot predict, which is kind of the point.",
  rulesVersion: "1.0.0",
};

export const neyon_02: CardDefinition = {
  id: "s1_class_neyon_02" as CardDefinition["id"],
  name: "Dual Discipline",
  faction: "neutral",
  characterClass: "neyon",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["flying", "backstab"],
  abilities: [],
  art: "/art/cards/class/s1_class_neyon_02.webp",
  flavorText:
    "Flying. Backstab. Oracle's sight plus assassin's angle. You know where they will be AND you are already behind them. The two disciplines sit inside the same body without arguing.",
  rulesVersion: "1.0.0",
};

export const neyon_03: CardDefinition = {
  id: "s1_class_neyon_03" as CardDefinition["id"],
  name: "Three-Schools Master",
  faction: "neutral",
  characterClass: "neyon",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["provoke", "celerity"],
  abilities: [
    {
      id: "ney03_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    },
  ],
  art: "/art/cards/class/s1_class_neyon_03.webp",
  flavorText:
    "Provoke. Celerity. On deploy, draw 1. Soldier's formation, assassin's celerity, engineer's card draw. A Ne-Yon who holds three disciplines simultaneously gets to make the room wait on them.",
  rulesVersion: "1.0.0",
};

export const neyon_04: CardDefinition = {
  id: "s1_class_neyon_04" as CardDefinition["id"],
  name: "Syncretic Adept",
  faction: "neutral",
  characterClass: "neyon",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 5 },
  keywords: ["flying", "dispel", "backstab"],
  abilities: [
    {
      id: "ney04_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 2 }, who: "self" },
    },
  ],
  art: "/art/cards/class/s1_class_neyon_04.webp",
  flavorText:
    "Flying. Dispel. Backstab. On deploy, draw 2. Four disciplines simultaneously. The Ne-Yon who reaches the adept rank has stopped thinking of the disciplines as separate things and started thinking of them as sentences in a language the rest of the army does not speak.",
  rulesVersion: "1.0.0",
};

export const neyon_05: CardDefinition = {
  id: "s1_class_neyon_05" as CardDefinition["id"],
  name: "The Five-Schools Avatar",
  faction: "neutral",
  characterClass: "neyon",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 7, health: 7 },
  keywords: ["flying", "provoke", "celerity", "backstab", "dispel"],
  abilities: [
    {
      id: "ney05_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 3 }, who: "self" },
    },
    {
      id: "ney05_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "rush",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/class/s1_class_neyon_05.webp",
  flavorText:
    "Flying. Provoke. Celerity. Backstab. Dispel. Rush on deploy. Draw 3. The Five-Schools Avatar has mastered every discipline the Archons taught and one they did not: the discipline of not admitting in conversation that they have mastered all five. They play it off. They are very good at playing it off.",
  rulesVersion: "1.0.0",
};

export const NEYON_CLASS_CARDS: readonly CardDefinition[] = Object.freeze([
  neyon_01, neyon_02, neyon_03, neyon_04, neyon_05,
]);
