/**
 * s1_reward_prestige_t5 — Quintessence Guardian
 *
 * Epic unit · Neutral faction · 6 cost · 5/7
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. On deploy, give all friendly units +0/+1.
 *    Five ascensions forged a guardian that draws every blow and shields
 *    every ally."
 *
 * Lore: Prestige Tier 5 represents mastery through repetition — a player
 * who has ascended five times understands the game at a fundamental level.
 * The Quintessence Guardian is the embodiment of that protective wisdom:
 * a wall that forces engagement (provoke) and toughens every ally on
 * arrival, reflecting the shield of experience.
 *
 * Reward: Reach Prestige Tier 5.
 *
 * Balance: 6 cost · 5/7 = 12 stats. Budget = 6*2+1 = 13. Provoke
 * keyword costs 1 stat. AoE +0/+1 to allies ~1 stat depending on board.
 * 13 - 2 = 11. Slightly under but provoke + AoE buff is strong tempo.
 * On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_prestige_t5" as CardDefinition["id"],
  name: "Quintessence Guardian",
  faction: "neutral",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 5, health: 7 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "qg_deploy_aoe_health" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self", except: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 0, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_prestige_t5.webp"),
  flavorText:
    "Five ascensions forged a guardian that draws every blow and shields every ally.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
