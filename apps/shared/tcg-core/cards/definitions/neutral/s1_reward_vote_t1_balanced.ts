/**
 * s1_reward_vote_t1_balanced — Neutral Observer
 *
 * Common unit · Neutral faction · 2 cost · 2/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, gain 1 temporary mana this turn.
 *    Objectivity is its own reward — and sometimes, it pays dividends."
 *
 * Lore: Players who vote with Balanced morality in Governance receive
 * the Neutral Observer — an operative who refuses allegiance to any
 * axis. Their impartiality grants them access to resources that
 * partisans cannot reach, represented mechanically by a small mana
 * boost on deployment.
 *
 * Reward: Participate in a Governance vote with Balanced-tier morality.
 *
 * Balance: 2 cost · 2/3 = 5 stats. Budget = 2*2+1 = 5. Gain 1 temp
 * mana is minor (~0.5 stat). On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_vote_t1_balanced" as CardDefinition["id"],
  name: "Neutral Observer",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "no_gain_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 1 },
        permanent: false,
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_vote_t1_balanced.webp"),
  flavorText:
    "She took no side in the vote. Somehow, both sides owed her favors afterward.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 1,
};
