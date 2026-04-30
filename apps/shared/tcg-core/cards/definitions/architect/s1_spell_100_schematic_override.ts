/**
 * s1_spell_100 — Schematic Override
 *
 * Common spell · Architect faction · 2 cost
 *
 * Oracle text:
 *   "Silence a unit. The Architect's blueprints account for every variable —
 *    including free will."
 *
 * Targeted silence on any unit. Classic control tool reflecting the Architect's
 * deterministic worldview: every anomaly is a deviation to be corrected.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_100" as CardDefinition["id"],
  name: "Schematic Override",
  faction: "architect",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "so_silence_unit" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "any" },
          chooser: "player",
        },
        do: {
          op: "silence",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_100.webp"),
  flavorText:
    "Every variable was accounted for in the original design. Your autonomy was never part of the equation.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
