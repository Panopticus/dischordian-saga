/**
 * s1_spell_116 — Blood Tax
 *
 * Uncommon spell · New Babylon faction · 3 cost
 *
 * Oracle text:
 *   "Sacrifice a friendly unit. Deal 5 damage to an enemy unit.
 *    In Locke's economy, lives are the most liquid currency."
 *
 * Sacrifice-for-value burn — destroy one of your own to remove an enemy
 * threat. New Babylon's fundamental bargain: everything has a price, and
 * Locke ensures the exchange rate always favors the house.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_116" as CardDefinition["id"],
  name: "Blood Tax",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "bt_sac_deal_5" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sacrifice_then",
        sac: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        then: {
          op: "with_target",
          selector: {
            kind: "single",
            filter: { controller: "opponent" },
            chooser: "player",
          },
          do: {
            op: "deal_damage",
            amount: { kind: "const", value: 5 },
            to: { kind: "it" },
          },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_116.webp"),
  flavorText:
    "Locke never flinches at the cost. He simply adds it to someone else's invoice.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
