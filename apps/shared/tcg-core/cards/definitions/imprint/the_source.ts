/**
 * Imprint Set — The Source (5 tiers). Phase F23.
 *
 * Nihilism disguised as mercy. Generosity that consumes you and
 * calls it care. Thought Virus faction. Mechanical vocabulary:
 * drain, heal your general but also damage your own units (the
 * seductive bargain).
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const the_source_t1: CardDefinition = {
  id: "s1_imprint_the_source_t1" as CardDefinition["id"],
  name: "Imprint: The Source (Common)",
  faction: "thought_virus", cardType: "unit", rarity: "common",
  cost: 3, baseStats: { power: 2, health: 4 },
  keywords: [], abilities: [],
  art: assetUrl("art/cards/imprint/source_t1.webp"),
  flavorText: "A smiling androgynous figure in brilliant light. Two small children dance in front. The dance does not quite look voluntary.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const the_source_t2: CardDefinition = {
  id: "s1_imprint_the_source_t2" as CardDefinition["id"],
  name: "Imprint: The Source (Uncommon)",
  faction: "thought_virus", cardType: "unit", rarity: "uncommon",
  cost: 4, baseStats: { power: 3, health: 5 },
  keywords: ["drain"], abilities: [],
  art: assetUrl("art/cards/imprint/source_t2.webp"),
  flavorText: "Drain. He takes a little from everyone he loves. He loves everyone.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const the_source_t3: CardDefinition = {
  id: "s1_imprint_the_source_t3" as CardDefinition["id"],
  name: "Imprint: The Source (Rare)",
  faction: "thought_virus", cardType: "unit", rarity: "rare",
  cost: 5, baseStats: { power: 4, health: 6 },
  keywords: ["drain"],
  abilities: [
    {
      id: "src_t3_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "heal", amount: { kind: "const", value: 5 }, to: { kind: "friendly_general" } },
    },
  ],
  art: assetUrl("art/cards/imprint/source_t3.webp"),
  flavorText: "Drain. On deploy, heal your general for 5. He wants you to live. He wants the way you live to be a version he approves of.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const the_source_t4: CardDefinition = {
  id: "s1_imprint_the_source_t4" as CardDefinition["id"],
  name: "Imprint: The Source (Epic)",
  faction: "thought_virus", cardType: "unit", rarity: "epic",
  cost: 6, baseStats: { power: 5, health: 7 },
  keywords: ["drain", "forcefield"],
  abilities: [
    {
      id: "src_t4_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "heal", amount: { kind: "const", value: 7 }, to: { kind: "friendly_general" } },
    },
  ],
  art: assetUrl("art/cards/imprint/source_t4.webp"),
  flavorText: "Drain. Forcefield. On deploy, heal your general for 7. The halo around him is photons and apology in the same proportion.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const the_source_t5: CardDefinition = {
  id: "s1_imprint_the_source_t5" as CardDefinition["id"],
  name: "The Source, Cheerful Unsurvivable",
  faction: "thought_virus", cardType: "unit", rarity: "legendary",
  cost: 7, baseStats: { power: 6, health: 8 },
  keywords: ["drain", "forcefield"],
  abilities: [
    {
      id: "src_t5_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "heal", amount: { kind: "const", value: 10 }, to: { kind: "friendly_general" } },
    },
    {
      id: "src_t5_silence" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "silence", to: { kind: "enemy_general" } },
    },
  ],
  art: assetUrl("art/cards/imprint/source_t5.webp"),
  flavorText:
    "Drain. Forcefield. On deploy, heal your general for 10 and silence the enemy general. The Source is the cheerful end of every conversation, and the conversations he is cheerfully ending are not, strictly speaking, the conversations the people in them signed up for.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const THE_SOURCE_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  the_source_t1, the_source_t2, the_source_t3, the_source_t4, the_source_t5,
]);
