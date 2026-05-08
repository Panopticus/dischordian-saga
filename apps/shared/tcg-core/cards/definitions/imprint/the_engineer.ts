/**
 * Imprint Set — The Engineer (5 tiers). Phase F14.
 *
 * Inventor of the deck. Carved his own knights. Wrote the chess
 * tutorial inside the chess tutorial. Mechanical vocabulary:
 * card draw, spell synergy, on-deploy invention. Antiquarian
 * faction because that is where the Engineer's workbench lives
 * narratively — he catalogues and rebuilds, he does not conquer.
 *
 * Tier id convention: s1_imprint_the_engineer_t{1..5}
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const the_engineer_t1: CardDefinition = {
  id: "s1_imprint_the_engineer_t1" as CardDefinition["id"],
  name: "Imprint: The Engineer (Common)",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 3 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/imprint/engineer_t1.webp"),
  flavorText:
    "A man at a workbench in a room you cannot quite locate on the map. The goggles are too large. The goggles are always too large.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const the_engineer_t2: CardDefinition = {
  id: "s1_imprint_the_engineer_t2" as CardDefinition["id"],
  name: "Imprint: The Engineer (Uncommon)",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "eng_t2_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/imprint/engineer_t2.webp"),
  flavorText:
    "On deploy, draw a card. He hands you the next tool before you realize you are going to need it.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Imprint-tier scaling design (T2): stats stay below curve so tier upgrades land mechanic-side. T2 adds the on-deploy draw; T3 deepens to draw 2. The player feels tier growth as an ability acquisition curve.",
    reviewer: "panopticus",
  },
};

export const the_engineer_t3: CardDefinition = {
  id: "s1_imprint_the_engineer_t3" as CardDefinition["id"],
  name: "Imprint: The Engineer (Rare)",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "eng_t3_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/imprint/engineer_t3.webp"),
  flavorText:
    "On deploy, draw two cards. He is already solving the next problem while the current one is still explaining itself.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
  balanceException: {
    reason: "Imprint-tier scaling design (T3): stats below curve so tier upgrades land mechanic-side. T3 deepens the on-deploy draw to draw 2 — the player feels tier growth as escalating ability strength.",
    reviewer: "panopticus",
  },
};

export const the_engineer_t4: CardDefinition = {
  id: "s1_imprint_the_engineer_t4" as CardDefinition["id"],
  name: "Imprint: The Engineer (Epic)",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "eng_t4_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
    {
      id: "eng_t4_mana_refund" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 1 },
        permanent: false,
      },
    },
  ],
  art: assetUrl("art/cards/imprint/engineer_t4.webp"),
  flavorText:
    "On deploy, draw 2 and refund 1 mana. Every invention pays for itself, or it is not yet an invention.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};

export const the_engineer_t5: CardDefinition = {
  id: "s1_imprint_the_engineer_t5" as CardDefinition["id"],
  name: "The Engineer, Author of the Deck",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 5, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "eng_t5_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 3 },
        who: "self",
      },
    },
    {
      id: "eng_t5_mana_refund" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 2 },
        permanent: false,
      },
    },
  ],
  art: assetUrl("art/cards/imprint/engineer_t5.webp"),
  flavorText:
    "On deploy, draw 3 and refund 2 mana. The Engineer built the first prototype deck the week the Oracle asked for a way to think about conflict without having to live it. The deck did not exist before him. He is the reason you are playing any of this.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};

export const THE_ENGINEER_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  the_engineer_t1,
  the_engineer_t2,
  the_engineer_t3,
  the_engineer_t4,
  the_engineer_t5,
]);
