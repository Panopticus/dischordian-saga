/**
 * s1_reward_class_neyon — Awakened Ne-Yon
 *
 * Legendary unit · Dreamer faction · 5 cost · 4/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, stun a random enemy unit.
 *    The Ne-Yon dreamed of a warrior who mastered every discipline.
 *    Then it opened its eyes, and the warrior was standing there."
 *
 * Lore: Mastering all six classes is the ultimate achievement in
 * character progression. The Awakened Ne-Yon is the reward — a
 * Dreamer entity that only manifests when all paths of combat mastery
 * converge. Its stun represents the overwhelming presence of a being
 * that has transcended specialization: enemies freeze in its wake,
 * unable to process what they face.
 *
 * Reward: Master all classes (spy, oracle, assassin, engineer, soldier,
 * and neyon).
 *
 * Balance: 5 cost · 4/5 = 9 stats. Budget = 5*2+1 = 11. Random stun
 * ~1-2 stats. 11 - 2 = 9. Legendary reward-exclusive. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_class_neyon" as CardDefinition["id"],
  name: "Awakened Ne-Yon",
  faction: "dreamer",
  cardType: "unit",
  rarity: "legendary",
  cost: 5,
  baseStats: { power: 4, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "an_deploy_stun_random" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "stun",
          duration: { kind: "n_turns", n: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The Ne-Yon dreamed of a warrior who mastered every discipline. Then it opened its eyes, and the warrior was standing there.",
  rulesVersion: "1.0.0",
};
