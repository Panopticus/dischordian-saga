/**
 * s1_spell_202 — System Purge
 *
 * Rare spell · Architect faction · 5 cost
 *
 * Oracle text:
 *   "Destroy all enemy units with 2 or less attack. The Architect
 *    identifies the weak and eliminates them with surgical precision."
 *
 * Board-clearing conditional removal. Punishes go-wide strategies that flood
 * the board with small units. The Architect's disdain for inefficiency
 * made manifest — anything below threshold is simply deleted.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_202" as CardDefinition["id"],
  name: "System Purge",
  faction: "architect",
  cardType: "spell",
  rarity: "rare",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "sp_destroy_weak" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent", maxStats: { power: 2 } },
        },
        do: {
          op: "destroy",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_202.webp"),
  flavorText:
    "Insufficient threat level detected. Purging. Purging. Purged.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
