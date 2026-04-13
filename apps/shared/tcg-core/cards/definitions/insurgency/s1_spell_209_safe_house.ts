/**
 * s1_spell_209 — Safe House
 *
 * Common spell · Insurgency faction · 2 cost
 *
 * Oracle text:
 *   "Heal a friendly unit for 4. Behind every revolution is a door
 *    that opens only for the wounded."
 *
 * Efficient healing spell. Keeps key Insurgency units alive through trades,
 * extending their value. The resistance survives because it knows where to hide.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_209" as CardDefinition["id"],
  name: "Safe House",
  faction: "insurgency",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "sh_heal_4" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "heal",
          amount: { kind: "const", value: 4 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_209.webp",
  flavorText:
    "Knock three times. Wait for the candle. Say the name they gave you when you first resisted.",
  rulesVersion: "1.0.0",
};
