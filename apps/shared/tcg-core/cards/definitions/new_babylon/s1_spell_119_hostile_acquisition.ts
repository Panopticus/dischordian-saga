/**
 * s1_spell_119 — Hostile Acquisition
 *
 * Rare spell · New Babylon faction · 6 cost
 *
 * Oracle text:
 *   "Destroy an enemy unit. Draw 2 cards. In New Babylon, everything
 *    is for sale — including your opponent's army."
 *
 * Premium removal + card advantage. The most expensive Babylon spell, but
 * it eliminates a threat while refueling the hand. Locke's endgame:
 * strip the competition of assets and absorb their resources into the
 * Syndicate's portfolio.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_119" as CardDefinition["id"],
  name: "Hostile Acquisition",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "rare",
  cost: 6,
  keywords: [],
  abilities: [
    {
      id: "ha_destroy_draw" as CardDefinition["abilities"][number]["id"],
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
            amount: { kind: "const", value: 2 },
            who: "self",
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_119.webp"),
  flavorText:
    "Locke didn't conquer New Babylon with armies. He bought it — one signature, one soul, one leveraged asset at a time.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
