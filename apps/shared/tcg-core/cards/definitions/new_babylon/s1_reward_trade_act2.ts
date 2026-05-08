/**
 * s1_reward_trade_act2 — Trade Captain
 *
 * Rare unit · New Babylon faction · 4 cost · 4/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 1.
 *    Her cargo manifest is classified. So is her kill count."
 *
 * Lore: Act 2 of the Trade Empire questline escalates the stakes —
 * players must defend their routes, negotiate hostile markets, and
 * outmaneuver rivals. The Trade Captain is a seasoned operator who
 * has survived the cutthroat middle game. Her card draw on deploy
 * represents the logistical advantage of a well-run fleet.
 *
 * Reward: Complete Trade Empire Act 2.
 *
 * Balance: 4 cost · 4/4 = 8 stats. Budget = 4*2+1 = 9. Draw 1 on
 * deploy ~1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_trade_act2" as CardDefinition["id"],
  name: "Trade Captain",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "tcap_draw_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_trade_act2.webp"),
  flavorText:
    "Her cargo manifest is classified. So is her kill count.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
