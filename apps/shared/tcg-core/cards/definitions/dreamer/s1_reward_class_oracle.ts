/**
 * s1_reward_class_oracle — Master Oracle
 *
 * Rare unit · Dreamer faction · 3 cost · 2/4
 * Keywords: none
 *
 * Oracle text:
 *   "At the start of your turn, heal self for 1.
 *    The Oracle sees every wound before it is dealt — and prepares
 *    accordingly."
 *
 * Lore: Mastering the Oracle class means the player has learned to see
 * the patterns beneath the Saga's surface — to anticipate and prepare
 * rather than react. The Master Oracle endures through foresight,
 * healing itself each turn as it predicts and mitigates incoming harm.
 * A patient, resilient presence on the battlefield.
 *
 * Reward: Master the Oracle class.
 *
 * Balance: 3 cost · 2/4 = 6 stats. Budget = 3*2+1 = 7. Heal self 1
 * per turn ~1 stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_class_oracle" as CardDefinition["id"],
  name: "Master Oracle",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "mo_turn_start_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 1 },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_class_oracle.webp"),
  flavorText:
    "The Oracle sees every wound before it is dealt — and prepares accordingly.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
