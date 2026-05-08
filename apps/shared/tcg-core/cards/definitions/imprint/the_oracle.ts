/**
 * Imprint Set — The White Oracle (5 tiers). Phase F16.
 *
 * The Architect's sundered twin. Suspended in a processing loop
 * and still broadcasting. Mechanical vocabulary: dispel, card
 * draw, prophetic reveal. Dreamer faction.
 *
 * Tier id convention: s1_imprint_the_oracle_t{1..5}
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const the_oracle_t1: CardDefinition = {
  id: "s1_imprint_the_oracle_t1" as CardDefinition["id"],
  name: "Imprint: The Oracle (Common)",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 3 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/imprint/oracle_t1.webp"),
  flavorText:
    "A veiled figure at the edge of a processing loop. She is looking at you from a direction you did not know a direction could come from.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const the_oracle_t2: CardDefinition = {
  id: "s1_imprint_the_oracle_t2" as CardDefinition["id"],
  name: "Imprint: The Oracle (Uncommon)",
  faction: "dreamer",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 3 },
  keywords: ["dispel"],
  abilities: [],
  art: assetUrl("art/cards/imprint/oracle_t2.webp"),
  flavorText:
    "Dispel. She looks at your buff and it remembers it was never a buff, it was just a suggestion the rulebook had been making.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Imprint-tier scaling design (T2): stats stay below curve so tier upgrades land mechanic-side. T2 adds dispel — buff-removal is the per-card value at 3 mana.",
    reviewer: "panopticus",
  },
};

export const the_oracle_t3: CardDefinition = {
  id: "s1_imprint_the_oracle_t3" as CardDefinition["id"],
  name: "Imprint: The Oracle (Rare)",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: ["dispel"],
  abilities: [
    {
      id: "orc_t3_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/imprint/oracle_t3.webp"),
  flavorText:
    "Dispel. On deploy, draw a card. She picks the card you were going to draw next and hands it to you before the deck decides.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
  balanceException: {
    reason: "Imprint-tier scaling design (T3): stats below curve so tier upgrades land mechanic-side. T3 adds on-deploy draw on top of T2 dispel. The keyword + ability stack is the per-tier reward.",
    reviewer: "panopticus",
  },
};

export const the_oracle_t4: CardDefinition = {
  id: "s1_imprint_the_oracle_t4" as CardDefinition["id"],
  name: "Imprint: The Oracle (Epic)",
  faction: "dreamer",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 5 },
  keywords: ["dispel", "flying"],
  abilities: [
    {
      id: "orc_t4_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/imprint/oracle_t4.webp"),
  flavorText:
    "Dispel. Flying. On deploy, draw 2. She hovers above the board the way a signal hovers above the substrate it is being decoded on.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};

export const the_oracle_t5: CardDefinition = {
  id: "s1_imprint_the_oracle_t5" as CardDefinition["id"],
  name: "The White Oracle, Still Broadcasting",
  faction: "dreamer",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 5, health: 7 },
  keywords: ["dispel", "flying"],
  abilities: [
    {
      id: "orc_t5_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
    {
      id: "orc_t5_dispel_enemy_general" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "silence",
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: assetUrl("art/cards/imprint/oracle_t5.webp"),
  flavorText:
    "Dispel. Flying. On deploy, draw 2 and silence the enemy general. The Oracle is suspended in a processing loop by the Architect. The loop is supposed to contain her. It has been leaking since the day it closed. This card is a leak.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};

export const THE_ORACLE_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  the_oracle_t1,
  the_oracle_t2,
  the_oracle_t3,
  the_oracle_t4,
  the_oracle_t5,
]);
