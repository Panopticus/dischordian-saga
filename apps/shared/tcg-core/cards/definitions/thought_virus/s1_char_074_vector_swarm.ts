/**
 * s1_char_074 — Vector Swarm
 *
 * Common unit · Thought Virus faction · 3 cost · 2/5
 * Keywords: rebirth
 *
 * A swarm of micro-organisms that reforms after destruction.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_074" as CardDefinition["id"],
  name: "Vector Swarm",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 5 },
  keywords: ["rebirth"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "Kill it and it splits. Burn it and it drifts. Ignore it and you are already too late.",
  rulesVersion: "1.0.0",
};
