/**
 * s1_spell_215 — Reality Fracture
 *
 * Rare spell · Dreamer faction · 4 cost
 *
 * Oracle text:
 *   "Deal 2 damage to all enemy units. Heal all friendly units for 1.
 *    The boundary between what is real and what is dreamed splits open."
 *
 * Two-sided AoE. Damages the opponent's board while healing your own.
 * A powerful swing spell that rewards having board presence.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_215" as CardDefinition["id"],
  name: "Reality Fracture",
  faction: "dreamer",
  cardType: "spell",
  rarity: "rare",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "rf_aoe_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "foreach",
            over: {
              kind: "all",
              filter: { controller: "opponent" },
            },
            do: {
              op: "deal_damage",
              amount: { kind: "const", value: 2 },
              to: { kind: "it" },
            },
          },
          {
            op: "foreach",
            over: {
              kind: "all",
              filter: { controller: "self" },
            },
            do: {
              op: "heal",
              amount: { kind: "const", value: 1 },
              to: { kind: "it" },
            },
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_spell_215.webp",
  flavorText:
    "The crack runs through everything. On one side, nightmare. On the other, a gentle dawn.",
  rulesVersion: "1.0.0",
};
