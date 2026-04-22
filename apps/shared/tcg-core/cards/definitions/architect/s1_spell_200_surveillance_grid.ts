/**
 * s1_spell_200 — Surveillance Grid
 *
 * Common spell · Architect faction · 2 cost
 *
 * Oracle text:
 *   "Deal 1 damage to ALL enemy units. The Architect's eyes are everywhere —
 *    no corner of the Arena escapes observation."
 *
 * Low-cost AoE ping. Cleans up tokens, pops forcefields, and softens boards.
 * The Architect's surveillance network as a weapon — total awareness
 * translated into precise, distributed harm.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_200" as CardDefinition["id"],
  name: "Surveillance Grid",
  faction: "architect",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "sg_aoe_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_200.webp"),
  flavorText:
    "Every lens in the grid turns at once. To be seen is to be struck.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
