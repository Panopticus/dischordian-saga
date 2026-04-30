/**
 * s1_spell_221 — Cognitive Decay
 *
 * Common spell · Thought Virus faction · 2 cost
 *
 * Oracle text:
 *   "Force the opponent to discard 1 random card. The Virus eats
 *    at the edges of thought — memories dissolve, plans unravel."
 *
 * Hand disruption. Strips a random card from the opponent's hand,
 * denying resources and options. The Thought Virus erodes from within.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_221" as CardDefinition["id"],
  name: "Cognitive Decay",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "cd_discard_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "discard",
        amount: { kind: "const", value: 1 },
        from: "opponent",
        mode: "random",
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_221.webp"),
  flavorText:
    "What was I going to — no. It's gone. It was important, wasn't it?",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
