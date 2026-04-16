/**
 * s1_spell_208 — Rebel Yell
 *
 * Common spell · Insurgency faction · 1 cost
 *
 * Oracle text:
 *   "Give all friendly units +1/+0 this turn. A single voice becomes
 *    a chorus. A chorus becomes a weapon."
 *
 * Cheap board-wide attack buff. Best when the Insurgency has established
 * a wide board of small units — every body gains teeth for the push.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_208" as CardDefinition["id"],
  name: "Rebel Yell",
  faction: "insurgency",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "ry_all_atk" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 1 },
          duration: { kind: "this_turn" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_208.webp",
  flavorText:
    "The cry starts in one throat and ends in a hundred fists.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};
