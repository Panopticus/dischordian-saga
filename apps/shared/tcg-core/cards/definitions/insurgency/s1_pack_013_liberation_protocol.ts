/**
 * s1_pack_013 — Liberation Protocol
 *
 * Epic spell · Insurgency faction · 5 cost
 *
 * Oracle text:
 *   "Return all enemy units with 3 or less attack to their owner's hand.
 *    The Insurgency liberates even its enemies — from the battlefield."
 *
 * Conditional mass bounce. Removes all small-to-midrange enemy units
 * without triggering death effects. Devastating against go-wide
 * strategies and token boards. At 5 cost it is a premium tempo play
 * that can swing games wide open.
 *
 * Mechanical model:
 *  - On cast, foreach enemy unit with power <= 3, return to hand.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_013" as CardDefinition["id"],
  name: "Liberation Protocol",
  faction: "insurgency",
  cardType: "spell",
  rarity: "epic",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "lp_bounce_weak" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent", maxStats: { power: 3 } },
        },
        do: {
          op: "return_to_hand",
          to: { kind: "it" },
          owner: "original",
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_013.webp",
  flavorText:
    "They called it liberation. The enemy called it a vanishing act. Both were correct.",
  rulesVersion: "1.0.0",
};
