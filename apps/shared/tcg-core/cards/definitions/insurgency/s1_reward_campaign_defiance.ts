/**
 * s1_reward_campaign_defiance — Rebel's Conviction
 *
 * Rare unit · Insurgency faction · 3 cost · 4/2
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. The Rebel strikes first, strikes hard, and asks questions
 *    of the survivors."
 *
 * Lore: Completing the campaign with the Defiance axis dominant proves
 * that the player chose resistance over compliance at every turn. This
 * card embodies that unyielding spirit — a fighter who charges into
 * battle the moment they hit the field, trading durability for
 * immediate aggression.
 *
 * Reward: Complete the campaign with Defiance axis dominant.
 *
 * Balance: 3 cost · 4/2 = 6 stats. Budget = 3*2+1 = 7. Rush keyword
 * costs 1 stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_campaign_defiance" as CardDefinition["id"],
  name: "Rebel's Conviction",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 4, health: 2 },
  keywords: ["rush"],
  abilities: [
    {
      id: "rc_rush_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "can_attack_this_turn",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_campaign_defiance.webp"),
  flavorText:
    "They told her to wait for orders. She told them the Architect doesn't wait, so neither will she.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
