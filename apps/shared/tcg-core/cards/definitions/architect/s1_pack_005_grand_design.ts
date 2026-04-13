/**
 * s1_pack_005 — Grand Design
 *
 * Epic spell · Architect faction · 6 cost
 *
 * Oracle text:
 *   "Draw 3 cards. Give all friendly units +1/+1 permanently.
 *    The Architect's vision made manifest — and it includes everyone."
 *
 * Premium value spell. Combines massive card advantage with a board-wide
 * buff. At 6 cost it requires commitment, but the payoff is enormous:
 * refuel the hand while strengthening every unit in play. A pack-defining
 * epic that rewards board presence.
 *
 * Mechanical model:
 *  - On cast: sequence of draw 3, then foreach friendly unit buff +1/+1.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_005" as CardDefinition["id"],
  name: "Grand Design",
  faction: "architect",
  cardType: "spell",
  rarity: "epic",
  cost: 6,
  keywords: [],
  abilities: [
    {
      id: "gd_draw_buff" as CardDefinition["abilities"][number]["id"],
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
            op: "foreach",
            over: {
              kind: "all",
              filter: { controller: "self" },
            },
            do: {
              op: "buff",
              stats: { power: 1, health: 1 },
              duration: { kind: "permanent" },
              to: { kind: "it" },
            },
          },
        ],
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The blueprint was always there. You simply lacked the clearance to see it.",
  rulesVersion: "1.0.0",
};
