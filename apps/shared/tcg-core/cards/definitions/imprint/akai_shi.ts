/**
 * Imprint Set — Akai Shi (5 tiers). Phase F21.
 *
 * Red Death. The Architect's silent removal arm. Speaks once per
 * assignment. Mechanical vocabulary: backstab, celerity, pierce.
 * High-damage striker that rewards position.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const akai_shi_t1: CardDefinition = {
  id: "s1_imprint_akai_shi_t1" as CardDefinition["id"],
  name: "Imprint: Akai Shi (Common)",
  faction: "architect", cardType: "unit", rarity: "common",
  cost: 2, baseStats: { power: 3, health: 2 },
  keywords: [], abilities: [],
  art: assetUrl("art/cards/imprint/akai_shi_t1.webp"),
  flavorText: "A silhouette in a red coat at the edge of a doorway that was not there a second ago.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const akai_shi_t2: CardDefinition = {
  id: "s1_imprint_akai_shi_t2" as CardDefinition["id"],
  name: "Imprint: Akai Shi (Uncommon)",
  faction: "architect", cardType: "unit", rarity: "uncommon",
  cost: 3, baseStats: { power: 4, health: 2 },
  keywords: ["backstab"], abilities: [],
  art: assetUrl("art/cards/imprint/akai_shi_t2.webp"),
  flavorText: "Backstab. Red Death prefers the side of you that is not facing the problem.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};

export const akai_shi_t3: CardDefinition = {
  id: "s1_imprint_akai_shi_t3" as CardDefinition["id"],
  name: "Imprint: Akai Shi (Rare)",
  faction: "architect", cardType: "unit", rarity: "rare",
  cost: 4, baseStats: { power: 5, health: 3 },
  keywords: ["backstab", "celerity"], abilities: [],
  art: assetUrl("art/cards/imprint/akai_shi_t3.webp"),
  flavorText: "Backstab. Celerity. He attacks twice, and both strikes land before you notice either one.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};

export const akai_shi_t4: CardDefinition = {
  id: "s1_imprint_akai_shi_t4" as CardDefinition["id"],
  name: "Imprint: Akai Shi (Epic)",
  faction: "architect", cardType: "unit", rarity: "epic",
  cost: 5, baseStats: { power: 6, health: 4 },
  keywords: ["backstab", "celerity"],
  abilities: [
    {
      id: "akai_t4_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "grant_keyword", keyword: "rush", duration: { kind: "this_turn" }, to: { kind: "self" } },
    },
  ],
  art: assetUrl("art/cards/imprint/akai_shi_t4.webp"),
  flavorText: "Backstab. Celerity. Rush on deploy. The Architect uses Akai Shi for removals the surveillance layer does not want on its own camera feed.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const akai_shi_t5: CardDefinition = {
  id: "s1_imprint_akai_shi_t5" as CardDefinition["id"],
  name: "Akai Shi, The Red Death",
  faction: "architect", cardType: "unit", rarity: "legendary",
  cost: 6, baseStats: { power: 8, health: 5 },
  keywords: ["backstab", "celerity", "pierce"],
  abilities: [
    {
      id: "akai_t5_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "grant_keyword", keyword: "rush", duration: { kind: "this_turn" }, to: { kind: "self" } },
    },
  ],
  art: assetUrl("art/cards/imprint/akai_shi_t5.webp"),
  flavorText:
    "Backstab. Celerity. Pierce. Rush on deploy. Akai Shi speaks exactly once per assignment, always to the person he is about to remove, always a single word. Nobody who has been removed by Akai Shi has been asked afterward what the word was, because asking that question is a fast way to become one of the people who had to be asked the question.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const AKAI_SHI_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  akai_shi_t1, akai_shi_t2, akai_shi_t3, akai_shi_t4, akai_shi_t5,
]);
