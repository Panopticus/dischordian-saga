/**
 * s1_spell_232 — Fossil Record
 *
 * Common spell · Antiquarian faction · 2 cost
 *
 * Oracle text:
 *   "Give a friendly unit the grow keyword and +0/+2 permanently.
 *    Ancient patterns imprinted on living tissue — the unit evolves
 *    with each passing turn."
 *
 * Scaling buff. The grow keyword causes the unit to gain stats each turn,
 * and the extra health ensures it survives long enough to accumulate value.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_232" as CardDefinition["id"],
  name: "Fossil Record",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "fr_grow_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "sequence",
          steps: [
            {
              op: "grant_keyword",
              keyword: "grow",
              duration: { kind: "permanent" },
              to: { kind: "it" },
            },
            {
              op: "buff",
              stats: { health: 2 },
              duration: { kind: "permanent" },
              to: { kind: "it" },
            },
          ],
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_232.webp"),
  flavorText:
    "In the stone are the bones of what came before. In the bones is the blueprint of what comes next.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
