/**
 * s1_spell_214 — Mind's Eye
 *
 * Uncommon spell · Dreamer faction · 3 cost
 *
 * Oracle text:
 *   "Deal 4 damage to a unit. The Dreamer focuses, and reality bends —
 *    a single thought sharp enough to cut."
 *
 * Single-target removal. Clean, efficient damage. The Dreamer doesn't
 * need weapons — concentration alone is lethal.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_214" as CardDefinition["id"],
  name: "Mind's Eye",
  faction: "dreamer",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "me_dmg_4" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "any" },
          chooser: "player",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 4 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "She did not blink. She did not flinch. She simply thought, and it was done.",
  rulesVersion: "1.0.0",
};
