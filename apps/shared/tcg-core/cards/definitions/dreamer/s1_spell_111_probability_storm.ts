/**
 * s1_spell_111 — Probability Storm
 *
 * Rare spell · Dreamer faction · 5 cost
 *
 * Oracle text:
 *   "Deal 2 damage to all enemy units and draw 1 card for each enemy
 *    damaged. The Oracle unleashes every collapsed future simultaneously."
 *
 * AoE damage followed by card draw. The two steps execute in sequence:
 * first the storm hits all enemies for 2, then the caster draws 1 card
 * for each enemy unit on board (the count is taken at resolution time,
 * so units killed by the damage won't be counted).
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_111" as CardDefinition["id"],
  name: "Probability Storm",
  faction: "dreamer",
  cardType: "spell",
  rarity: "rare",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "ps_aoe_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "foreach",
            over: {
              kind: "all",
              filter: { controller: "opponent" },
            },
            do: {
              op: "deal_damage",
              amount: { kind: "const", value: 2 },
              to: { kind: "it" },
            },
          },
          {
            op: "draw",
            amount: { kind: "count_of", filter: { controller: "opponent" } },
            who: "self",
          },
        ],
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "Every probable outcome struck at once. The survivors could only wonder which future they'd been assigned.",
  rulesVersion: "1.0.0",
};
