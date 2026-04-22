/**
 * s1_reward_guild_recruit — Fresh Recruit
 *
 * Common unit · Insurgency faction · 2 cost · 2/2
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On deploy, draw 1.
 *    No training. No gear. Just anger and a willingness to die for the cause."
 *
 * Lore: Recruiting 10 members into a guild proves leadership and
 * charisma. The Fresh Recruit is the newest body to join the cause —
 * green, eager, and fast. The rush keyword reflects their reckless
 * enthusiasm, while the card draw represents the fresh perspective
 * and intel that new blood always brings to the Insurgency.
 *
 * Reward: Recruit 10 members into a guild.
 *
 * Balance: 2 cost · 2/2 = 4 stats. Budget = 2*2+1 = 5. Rush ~1 stat,
 * draw 1 ~1 stat. 5 - 2 = 3. Slightly above at 4, but common 2-drop
 * with two effects is a reasonable reward card. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_guild_recruit" as CardDefinition["id"],
  name: "Fresh Recruit",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: ["rush"],
  abilities: [
    {
      id: "fr_rush_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "grant_keyword",
            keyword: "can_attack_this_turn",
            duration: { kind: "this_turn" },
            to: { kind: "self" },
          },
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "self",
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_guild_recruit.webp"),
  flavorText:
    "No training. No gear. Just anger and a willingness to die for the cause.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
