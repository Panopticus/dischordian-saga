/**
 * s1_spell_108 — Prophetic Collapse
 *
 * Uncommon spell · Dreamer faction · 4 cost
 *
 * Oracle text:
 *   "Deal damage to an enemy unit equal to the number of friendly
 *    units you control. The Oracle does not predict the future —
 *    she collapses it."
 *
 * Scaling targeted burn — the more allies on board, the harder the hit.
 * Represents the Dreamer's probability-collapse mechanic: every allied
 * unit is an observer, and observation collapses the wavefunction into
 * the outcome the Oracle already saw.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_108" as CardDefinition["id"],
  name: "Prophetic Collapse",
  faction: "dreamer",
  cardType: "spell",
  rarity: "uncommon",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "pc_scale_dmg" as CardDefinition["abilities"][number]["id"],
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
          amount: { kind: "count_of", filter: { controller: "self" } },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_108.webp"),
  flavorText:
    "She closed her eyes and saw every timeline converge. When she opened them, only one remained.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
