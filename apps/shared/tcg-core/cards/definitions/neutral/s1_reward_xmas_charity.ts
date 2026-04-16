/**
 * s1_reward_xmas_charity — Charitable Spirit
 *
 * Common unit · Neutral faction · 3 cost · 2/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, heal all units (both sides) for 2.
 *    Kindness doesn't pick sides. That's what makes it kind."
 *
 * Lore: The Christmas in July charity pool rewards players who give
 * without expectation of return. The Charitable Spirit embodies that
 * selflessness on the battlefield — healing friend and foe alike.
 * The symmetric effect reflects genuine charity: you help everyone,
 * even your enemies, because that's the point.
 *
 * Reward: Donate to the Christmas in July charity pool.
 *
 * Balance: 3 cost · 2/4 = 6 stats. Budget = 3*2+1 = 7. AoE heal 2
 * to all units (symmetric) ~0.5 stat (helps opponent too). On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_xmas_charity" as CardDefinition["id"],
  name: "Charitable Spirit",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "cs_heal_all_units" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "any" },
        },
        do: {
          op: "heal",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_xmas_charity.webp",
  flavorText:
    "Kindness doesn't pick sides. That's what makes it kind.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};
