/**
 * s1_char_071 — Neural Parasite
 *
 * Common unit · Thought Virus faction · 1 cost · 2/1
 * Keywords: rush
 *
 * A fast, fragile infection vector that strikes immediately.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_071" as CardDefinition["id"],
  name: "Neural Parasite",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 2, health: 1 },
  keywords: ["rush"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "It burrows through the ear canal and nests in the hippocampus. By then, you are already someone else.",
  rulesVersion: "1.0.0",
};
