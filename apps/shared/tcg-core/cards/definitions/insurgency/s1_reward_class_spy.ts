/**
 * s1_reward_class_spy — Master Spy
 *
 * Rare unit · Insurgency faction · 3 cost · 3/2
 * Keywords: backstab
 *
 * Oracle text:
 *   "Backstab. On kill, draw 1 card.
 *    Every secret extracted is another weapon in the arsenal."
 *
 * Lore: Mastering the Spy class means the player has perfected the art
 * of intelligence gathering and covert operations. The Master Spy strikes
 * from the shadows (backstab) and converts each kill into information
 * (draw a card). Knowledge is the Insurgency's most dangerous weapon.
 *
 * Reward: Master the Spy class.
 *
 * Balance: 3 cost · 3/2 = 5 stats. Budget = 3*2+1 = 7. Backstab
 * keyword costs 1 stat, on-kill draw 1 ~1 stat (conditional). 7 - 2 = 5.
 * On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_class_spy" as CardDefinition["id"],
  name: "Master Spy",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 2 },
  keywords: ["backstab"],
  abilities: [
    {
      id: "ms_on_kill_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "unit" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_class_spy.webp"),
  flavorText:
    "Every secret extracted is another weapon in the arsenal.",
  rulesVersion: "1.1.0",
  trial_categories: ["reactive"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Reward-tier card from the spy-class grant. Aggressive 3/2 statline + backstab + on-kill draw fits the assassin archetype. Stats held below ladder curve to prevent class rewards from gating competitive play.",
    reviewer: "panopticus",
  },
};
