/**
 * s1_spell_109 — Vision Cascade
 *
 * Common spell · Dreamer faction · 1 cost
 *
 * Oracle text:
 *   "Draw 2 cards, then discard 1 card. The Oracle sees many futures —
 *    only the truest vision is kept."
 *
 * Card filtering — draw 2, discard 1. Nets +1 card but with selection
 * quality. The Dreamer peers into branching futures, witnesses multiple
 * visions, and collapses on the most useful one. The discarded card is
 * a future that was never meant to be.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_109" as CardDefinition["id"],
  name: "Vision Cascade",
  faction: "dreamer",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "vc_draw_discard" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 2 },
            who: "self",
          },
          {
            op: "discard",
            amount: { kind: "const", value: 1 },
            from: "self",
            mode: "choose",
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_spell_109.webp",
  flavorText:
    "A thousand futures bloom in the Oracle's mind. She plucks the brightest and lets the rest wither.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
};
