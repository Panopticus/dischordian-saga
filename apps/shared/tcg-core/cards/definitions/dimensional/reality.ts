/**
 * Dimension Cards — Reality (3 cards). Phase C8.
 *
 * Reality is the dimension most players think they are in. It is
 * the one that takes the most work to maintain. Mechanical
 * vocabulary: silence (overwrite the enemy's definition), dispel
 * (erase a buff that was never really there), control.
 */
import type { CardDefinition } from "../../../index";

export const reality_01: CardDefinition = {
  id: "s1_dim_reality_01" as CardDefinition["id"],
  name: "Ground Truth Witness",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["dispel"],
  abilities: [],
  art: "/art/cards/dimension/s1_dim_reality_01.webp",
  flavorText:
    "Dispel. She was in the room when it happened. Her testimony removes the parts of the story that depend on nobody having been in the room.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "offensive"] as const,
};

export const reality_02: CardDefinition = {
  id: "s1_dim_reality_02" as CardDefinition["id"],
  name: "Consensus Weaver",
  faction: "architect",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "reality02_silence" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: { op: "silence", to: { kind: "enemy_general" } },
    },
  ],
  art: "/art/cards/dimension/s1_dim_reality_02.webp",
  flavorText:
    "Silence the enemy general. A Consensus Weaver does not argue with your version of events. She lets nine other people agree with hers until yours stops being one.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
};

export const reality_03: CardDefinition = {
  id: "s1_dim_reality_03" as CardDefinition["id"],
  name: "The Thing That Is Actually Happening",
  faction: "architect",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 6, health: 6 },
  keywords: ["provoke", "dispel", "forcefield"],
  abilities: [
    {
      id: "reality03_silence" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "silence", to: { kind: "enemy_general" } },
    },
  ],
  art: "/art/cards/dimension/s1_dim_reality_03.webp",
  flavorText:
    "Provoke. Dispel. Forcefield. On deploy, silence the enemy general. The Thing That Is Actually Happening is always happening, and nothing in the match will convince it otherwise, which is the definition of reality the Architect was using when he wrote the first draft.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};

export const REALITY_DIMENSION_CARDS: readonly CardDefinition[] = Object.freeze([
  reality_01, reality_02, reality_03,
]);
