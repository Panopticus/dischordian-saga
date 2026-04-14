/**
 * Dimension Cards — Probability (3 cards). Phase C7.
 *
 * Probability is the dimension where the roll is happening. The
 * Engineer's Oracle Deck lives here. Mechanical vocabulary: card
 * draw, extra mana refund, flicker between timelines — the cards
 * in this batch accelerate the draw engine more than they deal
 * damage.
 */
import type { CardDefinition } from "../../../index";

export const prob_01: CardDefinition = {
  id: "s1_dim_prob_01" as CardDefinition["id"],
  name: "Outcome Gambler",
  faction: "dreamer",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "prob01_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    },
  ],
  art: "/art/cards/dimension/s1_dim_prob_01.webp",
  flavorText:
    "On deploy, draw 1. Every card the Outcome Gambler draws is a card she had already bet on before the match started.",
  rulesVersion: "1.0.0",
};

export const prob_02: CardDefinition = {
  id: "s1_dim_prob_02" as CardDefinition["id"],
  name: "Bayes Adept",
  faction: "dreamer",
  cardType: "spell",
  rarity: "rare",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "prob02_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: { op: "draw", amount: { kind: "const", value: 3 }, who: "self" },
    },
  ],
  art: "/art/cards/dimension/s1_dim_prob_02.webp",
  flavorText:
    "Draw 3. A Bayes Adept updates her priors in public and you can watch the update happen in real time, which is terrifying.",
  rulesVersion: "1.0.0",
};

export const prob_03: CardDefinition = {
  id: "s1_dim_prob_03" as CardDefinition["id"],
  name: "The Sum Over Histories",
  faction: "dreamer",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 4, health: 6 },
  keywords: ["flying", "dispel"],
  abilities: [
    {
      id: "prob03_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 3 }, who: "self" },
    },
    {
      id: "prob03_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "gain_mana", amount: { kind: "const", value: 2 }, permanent: false },
    },
  ],
  art: "/art/cards/dimension/s1_dim_prob_03.webp",
  flavorText:
    "Flying. Dispel. On deploy, draw 3 and gain 2 mana this turn. The Sum Over Histories is the only entity in the Saga who has seen every possible version of this match play out. She is kind about it. She does not tell you which version you are in.",
  rulesVersion: "1.0.0",
};

export const PROBABILITY_DIMENSION_CARDS: readonly CardDefinition[] = Object.freeze([
  prob_01, prob_02, prob_03,
]);
