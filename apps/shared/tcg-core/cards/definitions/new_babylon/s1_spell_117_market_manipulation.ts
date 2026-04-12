/**
 * s1_spell_117 — Market Manipulation
 *
 * Common spell · New Babylon faction · 1 cost
 *
 * Oracle text:
 *   "Gain 2 temporary mana crystals this turn.
 *    When Locke adjusts the market, everyone pays."
 *
 * Mana ramp — gain 2 temporary mana for a burst turn. New Babylon's economic
 * engine: Locke manipulates the resource market to create artificial surpluses,
 * enabling plays a turn ahead of curve. The mana is temporary — Locke's
 * bubbles always burst, but by then the damage is done.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_117" as CardDefinition["id"],
  name: "Market Manipulation",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "mm_gain_2_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 2 },
        permanent: false,
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The market obeyed Locke's whisper before it heard the shout. By the time the correction came, fortunes had already changed hands.",
  rulesVersion: "1.0.0",
};
