/**
 * s1_reward_guild_officer — Guild Officer
 *
 * Common unit · Neutral faction · 3 cost · 3/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give adjacent allies +0/+1.
 *    Rank carries weight. So does the armor she requisitions."
 *
 * Lore: Rising to officer rank within a guild means shouldering
 * responsibility for those who serve under you. The Guild Officer
 * reinforces nearby allies with defensive coordination — a small
 * but tangible buff to adjacent units that reflects the protective
 * instinct of a competent mid-rank leader.
 *
 * Reward: Reach officer rank in a guild.
 *
 * Balance: 3 cost · 3/3 = 6 stats. Budget = 3*2+1 = 7. Adjacent
 * buff +0/+1 ~0.5 stat (conditional). On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_guild_officer" as CardDefinition["id"],
  name: "Guild Officer",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "go_buff_adjacent" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
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
  art: assetUrl("art/cards/s1_reward_guild_officer.webp"),
  flavorText:
    "Rank carries weight. So does the armor she requisitions.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
