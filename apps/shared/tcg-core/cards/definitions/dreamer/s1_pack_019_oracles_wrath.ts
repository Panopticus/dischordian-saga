/**
 * s1_pack_019 — Oracle's Wrath
 *
 * Epic spell · Dreamer faction · 5 cost
 *
 * Oracle text:
 *   "Deal 4 damage to an enemy unit. Draw 2 cards.
 *    The Oracle does not merely see the future — she enforces it."
 *
 * Premium targeted removal with card advantage. 4 damage kills most
 * midrange threats, and drawing 2 cards ensures you never fall behind
 * on resources. A powerful two-for-one that epitomizes the Dreamer's
 * control-plus-advantage gameplan.
 *
 * Mechanical model:
 *  - On cast: sequence of deal 4 to a chosen enemy, then draw 2.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_019" as CardDefinition["id"],
  name: "Oracle's Wrath",
  faction: "dreamer",
  cardType: "spell",
  rarity: "epic",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "ow_damage_draw" as CardDefinition["abilities"][number]["id"],
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
              op: "deal_damage",
              amount: { kind: "const", value: 4 },
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
  art: "/art/cards/s1_pack_019.webp",
  flavorText:
    "She did not foresee your destruction. She ordained it.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
};
