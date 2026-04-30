/**
 * s1_reward_daily_streak — Dedicated Operative
 *
 * Common unit · Neutral faction · 2 cost · 2/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 1 card.
 *    Dedication is measured in days, not declarations."
 *
 * Lore: Maintaining a daily quest streak demonstrates consistent
 * engagement with the Saga. The Dedicated Operative embodies that
 * reliability — a field agent who shows up every day, always prepared,
 * always bringing something useful (card draw) to the operation.
 *
 * Reward: Maintain a daily quest completion streak.
 *
 * Balance: 2 cost · 2/3 = 5 stats. Budget = 2*2+1 = 5. Draw 1 on
 * deploy ~1 stat. 5 - 1 = 4 base would be tight, but 2/3 = 5 with a
 * cantrip effect is the standard 2-drop cantrip rate. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_daily_streak" as CardDefinition["id"],
  name: "Dedicated Operative",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "do_draw_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_daily_streak.webp"),
  flavorText:
    "Thirty consecutive days. No sick leave. No excuses. The streak is the mission.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 1,
};
