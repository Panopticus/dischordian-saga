/**
 * s1_spell_210 — Intel Leak
 *
 * Uncommon spell · Insurgency faction · 3 cost
 *
 * Oracle text:
 *   "Draw 1 card. Knowledge is the Insurgency's sharpest blade —
 *    every secret stolen is a battle half-won."
 *
 * Card advantage spell. Represents intercepted intelligence from enemy
 * channels. The draw fuels the Insurgency's need for options and answers.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_210" as CardDefinition["id"],
  name: "Intel Leak",
  faction: "insurgency",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "il_draw_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "self",
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
    "Every wall has cracks. Every code has a key. The resistance finds both.",
  rulesVersion: "1.0.0",
};
