/**
 * s1_reward_graduate_deploy — Graduated Operative
 *
 * Rare unit · Neutral faction · 4 cost · 3/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give a friendly unit +1/+1 permanently.
 *    Every graduate carries a lesson. The best ones share it."
 *
 * Lore: Deploying ten graduates from the Legion's academies demonstrates
 * commitment to the long game — building a cadre of trained operatives
 * one at a time. The Graduated Operative embodies that investment: on
 * arrival, they mentor a friendly unit, permanently strengthening it
 * with the skills honed through the academy system.
 *
 * Reward: Deploy 10 graduates in Graduate Legion.
 *
 * Balance: 4 cost · 3/4 = 7 stats. Budget = 4*2+1 = 9. Targeted
 * +1/+1 permanent ~1 stat. 9 - 1 = 8. At 7 stats, slightly under,
 * but the mentoring effect provides lasting board value. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_graduate_deploy" as CardDefinition["id"],
  name: "Graduated Operative",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "go_buff_ally" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "buff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_graduate_deploy.webp"),
  flavorText:
    "She graduated top of her class. Her first act was to teach everything she knew to the soldier beside her.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
  balanceException: {
    reason: "Reward-tier card from the graduate grant. On-deploy permanent +1/+1 to a friendly is the value (= effective 4/5 split across two units). Stats below ladder curve to balance the persistent buff.",
    reviewer: "panopticus",
  },
};
