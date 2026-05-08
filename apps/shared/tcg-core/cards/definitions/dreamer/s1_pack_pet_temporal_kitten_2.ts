/**
 * s1_pack_pet_temporal_kitten_2 — Temporal Cat
 *
 * Rare unit · Dreamer faction · 3 cost · 2/4
 * Keywords: none
 *
 * Oracle text:
 *   "At the start of your turn, heal self for 1.
 *    It ages backward when no one is looking."
 *
 * Lore: The Temporal Cat is the second stage of the Temporal Kitten
 * line — a paradox wrapped in fur. It passively reverses minor
 * wounds by slipping backward through its own timeline, undoing
 * damage a few seconds after it occurs. The result is a resilient
 * midrange body that is deceptively difficult to remove.
 *
 * Pet Evolution: Temporal Kitten stage 2 of 3.
 * Collect all 3 stages to unlock the Temporal Kitten card back.
 *
 * Balance: 3 cost · 2/4 = 6 stats. Budget = 3*2+1 = 7. Heal self 1
 * per turn ~1 stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_pet_temporal_kitten_2" as CardDefinition["id"],
  name: "Temporal Cat",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "tc_turn_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 1 },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_pet_temporal_kitten_2.webp"),
  flavorText:
    "It ages backward when no one is looking.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
