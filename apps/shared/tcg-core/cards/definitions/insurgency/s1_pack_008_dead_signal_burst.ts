/**
 * s1_pack_008 — Dead Signal Burst
 *
 * Rare spell · Insurgency faction · 3 cost
 *
 * Oracle text:
 *   "Deal 2 damage to all enemy units. Give all friendly units +1/+0
 *    this turn. The dead signal still burns."
 *
 * Premium AoE damage combined with a temporary attack buff for your
 * board. At 3 mana this is an aggressive tempo swing — soften the
 * enemy board while powering up your own units for lethal trades.
 * Pack-exclusive Insurgency staple.
 *
 * Mechanical model:
 *  - On cast: sequence of foreach enemy deal 2, then foreach friendly
 *    buff +1/+0 this turn.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_008" as CardDefinition["id"],
  name: "Dead Signal Burst",
  faction: "insurgency",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "dsb_aoe_buff" as CardDefinition["abilities"][number]["id"],
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
              op: "buff",
              stats: { power: 1, health: 0 },
              duration: { kind: "this_turn" },
              to: { kind: "it" },
            },
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_pack_008.webp",
  flavorText:
    "The frequency was supposed to be extinct. It came back screaming.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
};
