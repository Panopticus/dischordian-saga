/**
 * s1_spell_212 — Lucid Clarity
 *
 * Common spell · Dreamer faction · 1 cost
 *
 * Oracle text:
 *   "Draw 1 card. In the space between sleeping and waking,
 *    the Dreamer sees what others cannot."
 *
 * Cantrip. Cheap card draw to cycle through the deck and find key pieces.
 * The Dreamer's visions are currency — each glimpse is another option.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_212" as CardDefinition["id"],
  name: "Lucid Clarity",
  faction: "dreamer",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "lc_draw_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_spell_212.webp",
  flavorText:
    "Close your eyes. What do you see? Everything.",
  rulesVersion: "1.0.0",
};
