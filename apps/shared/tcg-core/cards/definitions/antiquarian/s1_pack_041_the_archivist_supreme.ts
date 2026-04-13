/**
 * s1_pack_041 — The Archivist Supreme
 *
 * Legendary unit · Antiquarian faction · 8 cost · 5/10
 *
 * Oracle text:
 *   "On deploy, return all enemy units to their owner's hand and
 *    draw 3 cards. The Archivist rewrites the present."
 *
 * THE Antiquarian pack chase card. A colossal body that bounces
 * the entire enemy board on arrival while drawing a massive hand
 * refill. The opponent loses all board development and must replay
 * everything, while you have a 5/10 and a full hand. The ultimate
 * time control finisher.
 *
 * Mechanical model:
 *  - On deploy: sequence of foreach enemy return to hand, then draw 3.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_041" as CardDefinition["id"],
  name: "The Archivist Supreme",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 5, health: 10 },
  keywords: [],
  abilities: [
    {
      id: "tas_bounce_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
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
              op: "return_to_hand",
              to: { kind: "it" },
              owner: "original",
            },
          },
          {
            op: "draw",
            amount: { kind: "const", value: 3 },
            who: "self",
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_pack_041.webp",
  flavorText:
    "The Archivist opened the book of this age and erased every entry but one: the page where it stands alone.",
  rulesVersion: "1.0.0",
};
