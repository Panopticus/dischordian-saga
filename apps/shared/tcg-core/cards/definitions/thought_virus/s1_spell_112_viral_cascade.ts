/**
 * s1_spell_112 — Viral Cascade
 *
 * Uncommon spell · Thought Virus faction · 4 cost
 *
 * Oracle text:
 *   "Give all enemy units -1/-1 permanently. The Source whispers, and
 *    flesh remembers how to fail."
 *
 * AoE debuff — permanently weakens every enemy unit on board. The Thought
 * Virus doesn't destroy directly; it corrodes, erodes, and dissolves.
 * Each unit touched by the cascade carries the infection forward,
 * diminished in body and purpose.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_112" as CardDefinition["id"],
  name: "Viral Cascade",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "uncommon",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "vc_debuff_all" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "debuff",
          stats: { power: -1, health: -1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_112.webp"),
  flavorText:
    "The Source does not kill. It simply reminds every cell in your body that it was always meant to stop.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
