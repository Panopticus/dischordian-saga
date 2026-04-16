/**
 * s1_reward_vortex_master — Vortex Walker
 *
 * Epic unit · Dreamer faction · 5 cost · 4/6
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, stun all adjacent enemies for 1 turn.
 *    She walks between dimensions as easily as you walk between rooms."
 *
 * Lore: Closing fifty vortex incursions transforms a Dreamer from a
 * seal-keeper into a dimensional traveler. The Vortex Walker has crossed
 * so many thresholds that reality warps around her — enemies near her
 * deployment site are stunned by the dimensional shockwave of her arrival.
 *
 * Reward: Close 50 vortex incursions.
 *
 * Balance: 5 cost · 4/6 = 10 stats. Budget = 5*2+1 = 11. AoE stun
 * adjacent for 1 turn ~1.5 stats. 11 - 1.5 = 9.5 ~ 10. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_vortex_master" as CardDefinition["id"],
  name: "Vortex Walker",
  faction: "dreamer",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "vw_stun_adjacent" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "opponent" },
        },
        do: {
          op: "stun",
          duration: { kind: "n_turns", n: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_vortex_master.webp",
  flavorText:
    "Fifty incursions. Fifty seals. Now she does not close the vortex — she becomes it.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};
