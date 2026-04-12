/**
 * s1_spell_104 — Signal Intercept
 *
 * Common spell · Insurgency faction · 2 cost
 *
 * Oracle text:
 *   "Draw 2 cards. Agent Zero's dead signal still carries data —
 *    if you know how to listen."
 *
 * Card draw spell — the bread and butter of Insurgency resource generation.
 * Agent Zero's last broadcast was jammed, but fragments persist in the static.
 * Every intercepted fragment is another weapon in the resistance's arsenal.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_104" as CardDefinition["id"],
  name: "Signal Intercept",
  faction: "insurgency",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "si_draw_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The signal died with Agent Zero, but the frequency lives on. Every rebel cell still tunes in at midnight.",
  rulesVersion: "1.0.0",
};
