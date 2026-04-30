/**
 * s1_char_089 — Courier Sprite
 *
 * Common unit · Neutral · 1 cost · 1/1
 * Keywords: flying, rush
 *
 * The cheapest neutral flyer — a tiny messenger that
 * delivers one quick strike.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_089" as CardDefinition["id"],
  name: "Courier Sprite",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 1 },
  keywords: ["flying", "rush"],
  abilities: [
    // --- Final Delivery: draw 1 card on death ---
    {
      id: "courier_death_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_089.webp"),
  flavorText:
    "It carries messages no one else dares to deliver — and pays for it with its brief, bright life.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
