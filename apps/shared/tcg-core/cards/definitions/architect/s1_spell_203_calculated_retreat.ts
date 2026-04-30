/**
 * s1_spell_203 — Calculated Retreat
 *
 * Common spell · Architect faction · 1 cost
 *
 * Oracle text:
 *   "Return a friendly unit to your hand. Sometimes the optimal move
 *    is to withdraw — and redeploy with better positioning."
 *
 * Tempo bounce. Saves a unit from lethal, resets deploy triggers, or clears
 * a tile for a better play. Cheap and flexible — the hallmark of Architect
 * spell design.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_203" as CardDefinition["id"],
  name: "Calculated Retreat",
  faction: "architect",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "cr_bounce" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "return_to_hand",
          to: { kind: "it" },
          owner: "original",
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_203.webp"),
  flavorText:
    "Retreat is merely attack in the temporal dimension.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
