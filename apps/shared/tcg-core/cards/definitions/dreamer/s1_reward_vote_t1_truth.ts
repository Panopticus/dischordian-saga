/**
 * s1_reward_vote_t1_truth — Investigator's Lens
 *
 * Common unit · Dreamer faction · 2 cost · 2/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, deal 1 damage to a random enemy.
 *    The lens reveals what others conceal — and revelation has a sting."
 *
 * Lore: Governance votes determine policy for the Saga's shared world.
 * Players who vote along the Truth morality axis receive this card as
 * recognition of their commitment to transparency. The Investigator's
 * Lens represents the tools of those who seek hidden truths behind
 * the Architect's facades.
 *
 * Reward: Participate in a Governance vote with Truth-tier morality.
 *
 * Balance: 2 cost · 2/3 = 5 stats. Budget = 2*2+1 = 5. Deal 1 damage
 * to random enemy is minor (~0.5 stat). Slightly over, but random
 * target compensates.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_vote_t1_truth" as CardDefinition["id"],
  name: "Investigator's Lens",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "il_ping_random" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_vote_t1_truth.webp",
  flavorText:
    "Truth is a weapon. The Lens simply makes it easier to aim.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
