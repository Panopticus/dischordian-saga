/**
 * s1_spell_228 — Economic Sanctions
 *
 * Uncommon spell · New Babylon faction · 3 cost
 *
 * Oracle text:
 *   "Deal 2 damage to the enemy general. The markets close.
 *    The credits freeze. New Babylon's displeasure is measured in pain."
 *
 * Direct general damage. Applies pressure to the opponent's life total,
 * useful as a finisher or chip damage tool. New Babylon's economic power
 * translates into direct harm.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_228" as CardDefinition["id"],
  name: "Economic Sanctions",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "es_general_dmg" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 2 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_228.webp"),
  flavorText:
    "When New Babylon cuts the purse strings, even gods go hungry.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
