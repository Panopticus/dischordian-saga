/**
 * s1_reward_eidolon_nyx — Nyx, the Memory Thief
 *
 * Rare unit · Insurgency faction · 4 cost · 3/4
 * Keywords: infiltrate
 *
 * Oracle text:
 *   "Infiltrate. On deploy, opponent mills 1 card.
 *    She steals the memory of a move never made."
 *
 * Lore: Nyx is the Spy-class Eidolon — a raven of living shadow whose
 * feathers hold the fragments of forgotten memories. Bonded through
 * the Eidolon Bond system, Nyx rewards Soul-Keepers who walk the
 * rebellion's secret paths. On deployment she reaches into the
 * opponent's deck and erases a future they were counting on.
 *
 * Reward: Reach max bond with Eidolon Nyx.
 *
 * Balance: 4 cost · 3/4 = 7 stats. Budget = 4*2+1 = 9. Infiltrate
 * ~1 stat, mill 1 on deploy ~1 stat. 9 - 2 = 7. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_nyx" as CardDefinition["id"],
  name: "Nyx, the Memory Thief",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: ["infiltrate"],
  abilities: [
    {
      id: "nyx_mill_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "mill",
        amount: { kind: "const", value: 1 },
        who: "opponent",
      },
    },
  ],
  art: "/art/eidolons/nyx/nyx-norm-comp.png",
  flavorText:
    "She does not steal what you have. She steals what you were going to do next.",
  rulesVersion: "1.0.0",
};
