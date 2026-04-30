/**
 * Allegiance Cards — Architect (6 cards). Phase D4.
 *
 * Six tiered cards unlocked progressively by playing + winning
 * Architect matches. The plan specifies:
 *   Tier 1 (10 played)   — Common     "Initiate"
 *   Tier 2 (25 played)   — Uncommon   "Loyal Servant"
 *   Tier 3 (50 played)   — Rare       "Veteran"
 *   Tier 4 (10 won)      — Rare       "Victorious Veteran"
 *   Tier 5 (50 won)      — Epic       "Elite"
 *   Tier 6 (100 won)     — Legendary  "Champion" (the faction's
 *                                      signature unlock)
 *
 * Mechanical identity: control, provoke, grow, forcefield,
 * silence — the Architect's predetermined-design vocabulary.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const arch_alleg_t1: CardDefinition = {
  id: "s1_alleg_architect_t1" as CardDefinition["id"],
  name: "Architect Initiate",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_architect_t1.webp"),
  flavorText:
    "Unlocked by playing 10 Architect matches. The first thing the Architect gives you is a uniform. The uniform is not the point.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const arch_alleg_t2: CardDefinition = {
  id: "s1_alleg_architect_t2" as CardDefinition["id"],
  name: "Architect Loyal Servant",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 5 },
  keywords: ["provoke"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_architect_t2.webp"),
  flavorText:
    "Unlocked by playing 25 Architect matches. Provoke. Loyal servants stand in the doorway the Architect is watching, even when the Architect is not currently watching.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const arch_alleg_t3: CardDefinition = {
  id: "s1_alleg_architect_t3" as CardDefinition["id"],
  name: "Architect Veteran",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 6 },
  keywords: ["provoke", "grow"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_architect_t3.webp"),
  flavorText:
    "Unlocked by playing 50 Architect matches. Provoke. Grow. A veteran has seen what a predetermined design looks like from the inside and has decided, on balance, that the inside is warmer.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const arch_alleg_t4: CardDefinition = {
  id: "s1_alleg_architect_t4" as CardDefinition["id"],
  name: "Architect Victorious Veteran",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 6 },
  keywords: ["provoke", "grow", "forcefield"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_architect_t4.webp"),
  flavorText:
    "Unlocked by winning 10 Architect matches. Provoke. Grow. Forcefield. A victorious veteran has been to the far side of every match in this deck and came back with the Architect's quiet approval, which is a thing you only notice you have after you've earned it.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const arch_alleg_t5: CardDefinition = {
  id: "s1_alleg_architect_t5" as CardDefinition["id"],
  name: "Architect Elite",
  faction: "architect",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 8 },
  keywords: ["provoke", "grow", "forcefield"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_architect_t5.webp"),
  flavorText:
    "Unlocked by winning 50 Architect matches. Provoke. Grow. Forcefield. The Elite has been personally cc'd on memos the rank and file will never see, and none of the memos tell them what is going to happen next, and all of them tell them that it has already been decided.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence", "narrative"] as const,
  verdict_delta: 2,
};

export const arch_alleg_t6: CardDefinition = {
  id: "s1_alleg_architect_t6" as CardDefinition["id"],
  name: "Architect Champion",
  faction: "architect",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 7, health: 10 },
  keywords: ["provoke", "grow", "forcefield"],
  abilities: [
    {
      id: "arch_alleg_t6_silence" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "silence", to: { kind: "enemy_general" } },
    },
  ],
  art: assetUrl("art/cards/allegiance/s1_alleg_architect_t6.webp"),
  flavorText:
    "Unlocked by winning 100 Architect matches. Provoke. Grow. Forcefield. On deploy, silence the enemy general. The Architect Champion is not a character. They are the position. The name on the employee badge changes; the badge is the same badge, and the badge is the card.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const ARCHITECT_ALLEGIANCE_CARDS: readonly CardDefinition[] = Object.freeze([
  arch_alleg_t1, arch_alleg_t2, arch_alleg_t3, arch_alleg_t4, arch_alleg_t5, arch_alleg_t6,
]);
