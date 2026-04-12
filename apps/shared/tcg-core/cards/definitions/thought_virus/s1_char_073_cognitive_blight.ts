/**
 * s1_char_073 — Cognitive Blight
 *
 * Uncommon unit · Thought Virus faction · 3 cost · 4/3
 * Keywords: pierce
 *
 * A viral thought-form that bypasses mental defenses entirely.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_073" as CardDefinition["id"],
  name: "Cognitive Blight",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 4, health: 3 },
  keywords: ["pierce"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "It rewrites your beliefs one synapse at a time, until loyalty feels like a foreign language.",
  rulesVersion: "1.0.0",
};
