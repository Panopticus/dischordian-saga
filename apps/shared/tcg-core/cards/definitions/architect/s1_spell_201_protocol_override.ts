/**
 * s1_spell_201 — Protocol Override
 *
 * Uncommon spell · Architect faction · 3 cost
 *
 * Oracle text:
 *   "Give a friendly unit +2/+2 this turn. The Architect rewrites
 *    the combat parameters — temporarily, but devastatingly."
 *
 * Aggressive combat trick. Pair with a unit about to trade to swing the math.
 * The Architect doesn't fight fair; the rules are his to bend.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_201" as CardDefinition["id"],
  name: "Protocol Override",
  faction: "architect",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "po_buff_22" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "buff",
          stats: { power: 2, health: 2 },
          duration: { kind: "this_turn" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_201.webp"),
  flavorText:
    "For one glorious instant, the unit operates beyond its design parameters.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
