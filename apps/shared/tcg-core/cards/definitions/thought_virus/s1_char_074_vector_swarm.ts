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
  abilities: [
    // --- Infection Spreads: debuff all adjacent enemies -1/-1 on death ---
    {
      id: "swarm_death_debuff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "foreach",
        over: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "opponent" },
        },
        do: {
          op: "debuff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_char_074.webp",
  flavorText:
    "Kill it and it splits. Burn it and it drifts. Ignore it and you are already too late.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
