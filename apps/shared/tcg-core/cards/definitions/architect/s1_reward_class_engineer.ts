/**
 * s1_reward_class_engineer — Master Engineer
 *
 * Rare unit · Architect faction · 3 cost · 2/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give a friendly unit +0/+3.
 *    The Engineer doesn't fight — she builds things that do."
 *
 * Lore: Mastering the Engineer class means the player has learned to
 * build, fortify, and sustain. The Master Engineer doesn't rely on raw
 * power — she reinforces allies, granting a massive health buff that
 * turns a vulnerable unit into a wall. In the Architect faction,
 * construction is the highest form of combat.
 *
 * Reward: Master the Engineer class.
 *
 * Balance: 3 cost · 2/5 = 7 stats. Budget = 3*2+1 = 7. +0/+3 to an
 * ally ~1 stat. 7 - 1 = 6. Slightly under on raw stats but the buff
 * is unconditional and permanent. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_class_engineer" as CardDefinition["id"],
  name: "Master Engineer",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "me_deploy_buff_ally" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self", except: "self" },
          chooser: "player",
        },
        do: {
          op: "buff",
          stats: { power: 0, health: 3 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_class_engineer.webp",
  flavorText:
    "The Engineer doesn't fight — she builds things that do.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};
