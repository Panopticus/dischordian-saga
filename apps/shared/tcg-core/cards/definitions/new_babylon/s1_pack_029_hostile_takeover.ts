/**
 * s1_pack_029 — Hostile Takeover
 *
 * Rare spell · New Babylon faction · 4 cost
 *
 * Oracle text:
 *   "Destroy an enemy unit. Your opponent draws 1 card.
 *    In New Babylon, every deal has a cost — even the ones
 *    that destroy you."
 *
 * Premium hard removal with a downside. Destroys any enemy unit
 * unconditionally at 4 mana — extremely efficient — but the opponent
 * draws a card as compensation. The New Babylon philosophy: every
 * transaction has two sides. Still an incredible rate for hard removal.
 *
 * Mechanical model:
 *  - On cast: sequence of destroy a chosen enemy, then opponent draws 1.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_029" as CardDefinition["id"],
  name: "Hostile Takeover",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "rare",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "ht_destroy_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "with_target",
            selector: {
              kind: "single",
              filter: { controller: "opponent" },
              chooser: "player",
            },
            do: {
              op: "destroy",
              to: { kind: "it" },
            },
          },
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "opponent",
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_029.webp"),
  flavorText:
    "Locke smiled as he signed the order. The compensation was generous. The target was not expected to survive to collect it.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
