/**
 * s1_reward_draft_perfect — Undefeated Drafter
 *
 * Legendary unit · Neutral faction · 6 cost · 5/6
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give self +2/+2.
 *    Zero losses. Zero compromises. Every pick was perfect."
 *
 * Lore: Going undefeated in a draft tournament is the ultimate proof
 * of skill under constraint. The Undefeated Drafter is a legend among
 * competitors — a player so attuned to the meta that they adapt
 * flawlessly. On arrival, they buff themselves to a formidable 7/8,
 * representing the way a perfect draft record snowballs into
 * an unstoppable force.
 *
 * Reward: Go undefeated in a draft tournament.
 *
 * Balance: 6 cost · 5/6 = 11 stats. Budget = 6*2+1 = 13. Self
 * buff +2/+2 on deploy adds 4 effective stats for a 7/8 body.
 * Net 15 effective, but self-buff only and legendary. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_draft_perfect" as CardDefinition["id"],
  name: "Undefeated Drafter",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 5, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "ud_self_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 2, health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_reward_draft_perfect.webp",
  flavorText:
    "Zero losses. Zero compromises. Every pick was perfect.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};
