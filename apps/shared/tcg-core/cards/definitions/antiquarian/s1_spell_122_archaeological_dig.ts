/**
 * s1_spell_122 — Archaeological Dig
 *
 * Uncommon spell · Antiquarian faction · 3 cost
 *
 * Oracle text:
 *   "Draw 3 cards, then discard 1. The Antiquarian sifts through the
 *    sediment of Ages, keeping only what endures."
 *
 * Deep card filtering — draw 3, discard 1 for a net +2. The Antiquarian
 * digs through historical layers, examining artifacts from collapsed
 * timelines. Most are dust; a few are priceless. The discard represents
 * relics too fragile to survive the transition between Ages.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_122" as CardDefinition["id"],
  name: "Archaeological Dig",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "ad_draw_3_discard_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 3 },
            who: "self",
          },
          {
            op: "discard",
            amount: { kind: "const", value: 1 },
            from: "self",
            mode: "choose",
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_122.webp"),
  flavorText:
    "Three Ages buried beneath the current one, each with its own truths. The Antiquarian keeps only what the next Age will need.",
  rulesVersion: "1.1.0",
  trial_categories: ["confession", "narrative", "offensive"] as const,
  verdict_delta: 1,
};
