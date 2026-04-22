/**
 * Imprint Set — The Enigma (5 tiers). Phase F25.
 *
 * The Unpredictable. The Companion who makes a different move than
 * the right one and the wrong one. Neutral faction. Mechanical
 * vocabulary: flying, celerity, ephemeral — he is never where
 * you expect and rarely where he expected either.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const the_enigma_t1: CardDefinition = {
  id: "s1_imprint_the_enigma_t1" as CardDefinition["id"],
  name: "Imprint: The Enigma (Common)",
  faction: "neutral", cardType: "unit", rarity: "common",
  cost: 2, baseStats: { power: 2, health: 2 },
  keywords: [], abilities: [],
  art: assetUrl("art/cards/imprint/s1_imprint_the_enigma_t1.webp"),
  flavorText: "A shape you are not sure was just standing there. It might have been. It was probably something else.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const the_enigma_t2: CardDefinition = {
  id: "s1_imprint_the_enigma_t2" as CardDefinition["id"],
  name: "Imprint: The Enigma (Uncommon)",
  faction: "neutral", cardType: "unit", rarity: "uncommon",
  cost: 3, baseStats: { power: 3, health: 3 },
  keywords: ["flying"], abilities: [],
  art: assetUrl("art/cards/imprint/s1_imprint_the_enigma_t2.webp"),
  flavorText: "Flying. The Enigma does not walk. He arrives.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};

export const the_enigma_t3: CardDefinition = {
  id: "s1_imprint_the_enigma_t3" as CardDefinition["id"],
  name: "Imprint: The Enigma (Rare)",
  faction: "neutral", cardType: "unit", rarity: "rare",
  cost: 4, baseStats: { power: 4, health: 4 },
  keywords: ["flying", "celerity"], abilities: [],
  art: assetUrl("art/cards/imprint/s1_imprint_the_enigma_t3.webp"),
  flavorText: "Flying. Celerity. He attacks twice and lets you work out which was the real one.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};

export const the_enigma_t4: CardDefinition = {
  id: "s1_imprint_the_enigma_t4" as CardDefinition["id"],
  name: "Imprint: The Enigma (Epic)",
  faction: "neutral", cardType: "unit", rarity: "epic",
  cost: 5, baseStats: { power: 5, health: 4 },
  keywords: ["flying", "celerity"],
  abilities: [
    { id: "eni_t4_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" } },
  ],
  art: assetUrl("art/cards/imprint/s1_imprint_the_enigma_t4.webp"),
  flavorText: "Flying. Celerity. On deploy, draw 1. He drew the card before the card was in the deck.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const the_enigma_t5: CardDefinition = {
  id: "s1_imprint_the_enigma_t5" as CardDefinition["id"],
  name: "The Enigma, Third Option",
  faction: "neutral", cardType: "unit", rarity: "legendary",
  cost: 6, baseStats: { power: 6, health: 5 },
  keywords: ["flying", "celerity"],
  abilities: [
    { id: "eni_t5_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 2 }, who: "self" } },
  ],
  art: assetUrl("art/cards/imprint/s1_imprint_the_enigma_t5.webp"),
  flavorText:
    "Flying. Celerity. On deploy, draw 2. The Enigma has made exactly one decision that was obvious in retrospect and it was the decision to become the Enigma, which nobody saw coming.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const THE_ENIGMA_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  the_enigma_t1, the_enigma_t2, the_enigma_t3, the_enigma_t4, the_enigma_t5,
]);
