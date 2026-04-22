/**
 * s1_spell_105 — Guerrilla Strike
 *
 * Common spell · Insurgency faction · 2 cost
 *
 * Oracle text:
 *   "Deal 3 damage to an enemy unit. Hit hard, disappear."
 *
 * Targeted burn — efficient single-target removal reflecting Insurgency's
 * hit-and-run doctrine. The resistance can't win in prolonged engagements,
 * so every strike must count.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_105" as CardDefinition["id"],
  name: "Guerrilla Strike",
  faction: "insurgency",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "gs_deal_3" as CardDefinition["abilities"][number]["id"],
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
          amount: { kind: "const", value: 3 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_105.webp"),
  flavorText:
    "They never see us coming. By the time they've calculated our trajectory, we've already gone.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
