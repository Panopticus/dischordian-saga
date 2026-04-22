/**
 * s1_char_086 — Wandering Merchant
 *
 * Common unit · Neutral · 2 cost · 2/3
 * Keywords: none
 *
 * A versatile, faction-neutral trader with solid vanilla stats.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_086" as CardDefinition["id"],
  name: "Wandering Merchant",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "wm_trade_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "self",
          },
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "opponent",
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_086.webp"),
  flavorText:
    "He sells to all sides and swears allegiance to none. Coin is the only faction that never falls.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 1,
};
