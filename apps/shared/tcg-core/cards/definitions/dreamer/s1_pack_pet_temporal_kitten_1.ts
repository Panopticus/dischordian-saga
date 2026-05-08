/**
 * s1_pack_pet_temporal_kitten_1 — Chrono Kitten
 *
 * Common unit · Dreamer faction · 1 cost · 1/1
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On death, draw 1 card.
 *    Nine lives, but it burns through them so fast you'd swear
 *    it only has one."
 *
 * Lore: The Chrono Kitten is the first stage of the Temporal Kitten
 * evolution line — a tiny feline that flickers in and out of the
 * timestream. Its rush represents its impatience with linear
 * causality, and the death-draw reflects the paradox it leaves
 * behind: information from a future that never happened.
 *
 * Pet Evolution: Temporal Kitten stage 1 of 3.
 * Collect all 3 stages to unlock the Temporal Kitten card back.
 *
 * Balance: 1 cost · 1/1 = 2 stats. Budget = 1*2+1 = 3. Rush ~1
 * stat, on-death draw 1 ~0.5 stat. 3 - 1.5 = 1.5. At 2 stats,
 * slightly over but fragile body balances out. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_pet_temporal_kitten_1" as CardDefinition["id"],
  name: "Chrono Kitten",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 1 },
  keywords: ["rush"],
  abilities: [
    {
      id: "ck_death_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_pet_temporal_kitten_1.webp"),
  flavorText:
    "Nine lives, but it burns through them so fast you'd swear it only has one.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Pet engine: 1/1 rush + on-death draw — immediate impact + free card replacement at 1 mana. Sub-curve printed stats are the trade for both lines of value.",
    reviewer: "panopticus",
  },
};
