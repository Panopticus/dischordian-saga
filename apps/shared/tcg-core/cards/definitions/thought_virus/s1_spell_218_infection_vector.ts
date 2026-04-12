/**
 * s1_spell_218 — Infection Vector
 *
 * Common spell · Thought Virus faction · 1 cost
 *
 * Oracle text:
 *   "Debuff an enemy unit -1/-0 permanently. The Virus weakens
 *    before it consumes — a slow erosion of capability."
 *
 * Cheap targeted debuff. Reduces an enemy's attack permanently,
 * neutering threats at low cost. The Thought Virus works through attrition.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_218" as CardDefinition["id"],
  name: "Infection Vector",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "iv_debuff_10" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "debuff",
          stats: { power: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "It starts as a whisper in the neurons. By tomorrow, the arm won't lift.",
  rulesVersion: "1.0.0",
};
