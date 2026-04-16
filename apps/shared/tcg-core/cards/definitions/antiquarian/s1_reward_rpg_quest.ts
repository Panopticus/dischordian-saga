/**
 * s1_reward_rpg_quest — Questmaster
 *
 * Rare unit · Antiquarian faction · 4 cost · 3/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, add 2 forcefield charges to self.
 *    Fifty quests. Fifty stories. All of them end with her still standing."
 *
 * Lore: Completing 50 RPG quests is a marathon of exploration,
 * combat, and narrative. The Questmaster is an Antiquarian veteran
 * who has seen everything the Saga has to offer — and survived it
 * all. Her forcefield charges represent the accumulated wisdom and
 * defensive instincts of someone who has walked through fifty
 * different kinds of danger.
 *
 * Reward: Complete 50 RPG quests.
 *
 * Balance: 4 cost · 3/5 = 8 stats. Budget = 4*2+1 = 9. 2 forcefield
 * charges ~1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_rpg_quest" as CardDefinition["id"],
  name: "Questmaster",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "qm_forcefield_charges" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 2,
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_reward_rpg_quest.webp",
  flavorText:
    "Fifty quests. Fifty stories. All of them end with her still standing.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence"] as const,
};
