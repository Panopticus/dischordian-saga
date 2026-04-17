/**
 * s1_reward_class_soldier — Master Soldier
 *
 * Rare unit · New Babylon faction · 3 cost · 3/3
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. On deploy, give self +1/+0.
 *    New Babylon's finest don't ask for orders. They are the order."
 *
 * Lore: Mastering the Soldier class means the player has learned
 * discipline, positioning, and the art of holding the line. The Master
 * Soldier forces engagement (provoke) and arrives slightly stronger than
 * expected (+1/+0 on deploy), representing the edge that separates a
 * veteran from a recruit. In New Babylon, soldiers are the law made flesh.
 *
 * Reward: Master the Soldier class.
 *
 * Balance: 3 cost · 3/3 = 6 stats. Budget = 3*2+1 = 7. Provoke keyword
 * costs 1 stat. +1/+0 self on deploy ~0.5 stat. 7 - 1.5 = 5.5 ~ 6.
 * On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_class_soldier" as CardDefinition["id"],
  name: "Master Soldier",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "msol_deploy_self_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 0 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_reward_class_soldier.webp",
  flavorText:
    "New Babylon's finest don't ask for orders. They are the order.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
