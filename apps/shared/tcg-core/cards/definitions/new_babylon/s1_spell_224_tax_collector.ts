/**
 * s1_spell_224 — Tax Collector
 *
 * Common spell · New Babylon faction · 1 cost
 *
 * Oracle text:
 *   "Deal 2 damage to an enemy unit. New Babylon collects what is owed —
 *    in coin or in blood."
 *
 * Cheap targeted removal. Efficient damage for clearing small threats
 * or finishing wounded units. The tax is non-negotiable.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_224" as CardDefinition["id"],
  name: "Tax Collector",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "tc_dmg_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_224.webp"),
  flavorText:
    "Payment is due. The currency is flexible. The deadline is not.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
