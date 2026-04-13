/**
 * s1_pack_046 — Dimensional Rift
 *
 * Rare spell · Neutral faction · 4 cost
 *
 * Oracle text:
 *   "Deal 3 damage to an enemy unit. Draw 1 card. A crack in
 *    reality — and something comes through."
 *
 * Targeted removal with card advantage. 3 damage kills most midrange
 * threats, and the cantrip draw ensures you do not lose card parity.
 * A clean, universally useful rare that any deck can include.
 *
 * Mechanical model:
 *  - On cast: sequence of deal 3 to a chosen enemy, then draw 1.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_046" as CardDefinition["id"],
  name: "Dimensional Rift",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "dr_damage_draw" as CardDefinition["abilities"][number]["id"],
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
              amount: { kind: "const", value: 3 },
              to: { kind: "it" },
            },
          },
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "self",
          },
        ],
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The rift opened for half a second. What came through took considerably longer to forget.",
  rulesVersion: "1.0.0",
};
