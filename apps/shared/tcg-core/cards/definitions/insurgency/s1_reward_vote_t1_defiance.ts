/**
 * s1_reward_vote_t1_defiance — Signal Booster
 *
 * Common unit · Insurgency faction · 2 cost · 3/2
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give an adjacent friendly unit +1/+0.
 *    The resistance amplifies every voice that dares to speak."
 *
 * Lore: Governance votes along the Defiance axis reward players with
 * tools of rebellion. The Signal Booster is a field device used by
 * Insurgency cells to amplify their comrades' combat effectiveness —
 * a small act of defiance that tips the balance in the field.
 *
 * Reward: Participate in a Governance vote with Defiance-tier morality.
 *
 * Balance: 2 cost · 3/2 = 5 stats. Budget = 2*2+1 = 5. Buff +1/+0
 * to adjacent ~0.5 stat (conditional). On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_vote_t1_defiance" as CardDefinition["id"],
  name: "Signal Booster",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "sb_buff_adjacent" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "self", except: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 1, health: 0 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "Agent Zero's last frequency still carries. The Booster makes sure everyone hears it.",
  rulesVersion: "1.0.0",
};
