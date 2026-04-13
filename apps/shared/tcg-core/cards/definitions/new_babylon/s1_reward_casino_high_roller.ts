/**
 * s1_reward_casino_high_roller — High Roller
 *
 * Epic unit · New Babylon faction · 5 cost · 6/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, deal 3 damage to a random enemy.
 *    The High Roller bets everything on a single throw — and usually wins."
 *
 * Lore: The Casino rewards those who wager big. The High Roller is a
 * New Babylon elite who treats combat like gambling — arriving with a
 * devastating opening play (3 random damage) backed by impressive
 * offensive stats. The randomness of the target mirrors the Casino's
 * inherent unpredictability.
 *
 * Reward: Reach High Roller status in Casino mode.
 *
 * Balance: 5 cost · 6/4 = 10 stats. Budget = 5*2+1 = 11. Deal 3
 * random ~1 stat. 11 - 1 = 10. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_casino_high_roller" as CardDefinition["id"],
  name: "High Roller",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 6, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "hr_random_damage" as CardDefinition["abilities"][number]["id"],
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
          amount: { kind: "const", value: 3 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_casino_high_roller.webp",
  flavorText:
    "He walked into the Casino with nothing and walked out owning three city blocks. Then he went back in.",
  rulesVersion: "1.0.0",
};
