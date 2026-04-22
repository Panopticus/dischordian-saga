/**
 * s1_reward_guild_founder — Guild Founder
 *
 * Rare unit · Neutral faction · 5 cost · 4/6
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give all friendly units +1/+0.
 *    She built something from nothing. Now nothing can tear it down."
 *
 * Lore: Founding a guild is an act of ambition — rallying strangers
 * under a shared banner and forging them into something greater.
 * The Guild Founder inspires her allies the moment she arrives,
 * granting each a permanent surge of offensive power that reflects
 * the morale boost of unified purpose.
 *
 * Reward: Found a guild.
 *
 * Balance: 5 cost · 4/6 = 10 stats. Budget = 5*2+1 = 11. AoE +1/+0
 * to allies ~1 stat. 11 - 1 = 10. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_guild_founder" as CardDefinition["id"],
  name: "Guild Founder",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "gf_buff_all_allies" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self", except: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 1, health: 0 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_guild_founder.webp"),
  flavorText:
    "She built something from nothing. Now nothing can tear it down.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
