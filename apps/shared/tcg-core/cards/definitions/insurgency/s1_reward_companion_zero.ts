/**
 * s1_reward_companion_zero — Zero's Parting Gift
 *
 * Rare unit · Insurgency faction · 3 cost · 3/3
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On deploy, give an adjacent friendly unit +1/+1.
 *    Agent Zero always left something behind — a frequency, a signal,
 *    a reason to keep fighting."
 *
 * Lore: Agent Zero operates at the edge of the Insurgency — a ghost
 * who appears, empowers those around them, and vanishes before the
 * Architect's gaze can settle. This card captures that fleeting bond:
 * Zero arrives fast (rush), bolsters a nearby ally, then throws
 * themselves into the fight.
 *
 * Reward: Max out relationship with Agent Zero companion.
 *
 * Balance: 3 cost · 3/3 = 6 stats. Budget = 3*2+1 = 7. Rush keyword
 * costs 1 stat, adjacent +1/+1 ~0.5 stat (conditional). 7 - 1.5 = 5.5
 * ~ 6. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_companion_zero" as CardDefinition["id"],
  name: "Zero's Parting Gift",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["rush"],
  abilities: [
    {
      id: "zpg_rush_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "can_attack_this_turn",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
    {
      id: "zpg_buff_adjacent" as CardDefinition["abilities"][number]["id"],
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
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_companion_zero.webp",
  flavorText:
    "Agent Zero always left something behind — a frequency, a signal, a reason to keep fighting.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
