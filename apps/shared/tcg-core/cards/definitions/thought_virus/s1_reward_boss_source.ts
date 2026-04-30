/**
 * s1_reward_boss_source — Source Fragment
 *
 * Legendary unit · Thought Virus faction · 7 cost · 6/8
 * Keywords: none
 *
 * Oracle text:
 *   "At the start of your turn, deal 1 damage to all enemy units.
 *    A shard of the Source still pulses with its corrosive signal."
 *
 * Lore: The Source is the origin node of the Thought Virus — mastering
 * it means surviving prolonged exposure to its reality-corroding
 * broadcast. The Source Fragment is a piece of that broadcast given
 * physical form, constantly radiating low-level damage to every enemy
 * on the board. It cannot be silenced because the signal is the
 * Fragment's very substance.
 *
 * Reward: Master The Source boss.
 *
 * Balance: 7 cost · 6/8 = 14 stats. Budget = 7*2+1 = 15. AoE 1
 * damage per turn ~2 stats. 15 - 2 = 13. At 14 stats, slightly above
 * but the passive is slow. Fair for a legendary reward.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_boss_source" as CardDefinition["id"],
  name: "Source Fragment",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 6, health: 8 },
  keywords: [],
  abilities: [
    {
      id: "sf_aoe_tick" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_boss_source.webp"),
  flavorText:
    "The Source was destroyed. The signal was not. It hums inside the Fragment like a heartbeat made of static.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};
