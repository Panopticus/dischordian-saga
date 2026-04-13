/**
 * s1_pack_015 — Probability Surge
 *
 * Common spell · Dreamer faction · 2 cost
 *
 * Oracle text:
 *   "Draw 2 cards. The future is not predicted — it is selected."
 *
 * Clean, efficient card draw. Two cards for two mana is excellent
 * rate, fueling the Dreamer's hand advantage and combo potential.
 * A pack staple that every Dreamer deck wants.
 *
 * Mechanical model:
 *  - On cast, draw 2 cards.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_015" as CardDefinition["id"],
  name: "Probability Surge",
  faction: "dreamer",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "ps_draw_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_pack_015.webp",
  flavorText:
    "She did not see the future. She reached into the probability field and pulled out the one she wanted.",
  rulesVersion: "1.0.0",
};
