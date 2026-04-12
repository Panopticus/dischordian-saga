/**
 * s1_spell_219 — Plague Wind
 *
 * Uncommon spell · Thought Virus faction · 3 cost
 *
 * Oracle text:
 *   "Deal 1 damage to ALL units. The Virus does not discriminate —
 *    it spreads to everything it touches."
 *
 * Symmetrical AoE ping. Cleans up tokens on both sides, pops forcefields,
 * and chips away at boards. The Thought Virus cares nothing for allegiance.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_219" as CardDefinition["id"],
  name: "Plague Wind",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "pw_aoe_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "any" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The wind carries more than dust. It carries the end of thought.",
  rulesVersion: "1.0.0",
};
