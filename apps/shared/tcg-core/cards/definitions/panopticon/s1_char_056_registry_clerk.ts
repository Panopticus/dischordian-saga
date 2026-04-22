/**
 * s1_char_056 — Registry Clerk
 *
 * Common unit · Panopticon faction · 2 cost · 3/2
 * Keywords: rally_buff
 *
 * A bureaucratic cog that buffs adjacent allies through strict order.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_056" as CardDefinition["id"],
  name: "Registry Clerk",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: ["rally_buff"],
  abilities: [
    {
      id: "rc_rally_power" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "self", except: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_056.webp"),
  flavorText:
    "Every citizen has a file. Every file has a purpose. Every purpose serves the Spire.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
};
