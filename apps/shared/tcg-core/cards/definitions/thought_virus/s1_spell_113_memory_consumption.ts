/**
 * s1_spell_113 — Memory Consumption
 *
 * Common spell · Thought Virus faction · 2 cost
 *
 * Oracle text:
 *   "Destroy an enemy unit with 2 or less attack. Some minds are too
 *    small to resist the dissolution."
 *
 * Conditional hard removal — destroys a weak enemy outright. The Thought
 * Virus consumes the target's memories until nothing remains to sustain
 * consciousness. Only minds with sufficient willpower (attack) can resist.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_113" as CardDefinition["id"],
  name: "Memory Consumption",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "mc_destroy_weak" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent", maxStats: { power: 2 } },
          chooser: "player",
        },
        do: {
          op: "destroy",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_113.webp",
  flavorText:
    "It ate his name first, then his childhood. By the time it reached his fears, there was nothing left to be afraid.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
};
