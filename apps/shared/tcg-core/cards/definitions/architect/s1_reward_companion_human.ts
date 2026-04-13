/**
 * s1_reward_companion_human — The Human's Trust
 *
 * Rare unit · Architect faction · 4 cost · 3/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 1 card and give self +0/+2.
 *    The last organic Archon entrusted you with something no algorithm
 *    could replicate."
 *
 * Lore: The Human is the sole remaining biological Archon — a living
 * anomaly in a world of constructs and code. Earning The Human's trust
 * means proving that loyalty transcends programming. The card draws on
 * that bond: the draw represents shared knowledge, and the health buff
 * represents the resilience that trust provides.
 *
 * Reward: Max out relationship with The Human companion.
 *
 * Balance: 4 cost · 3/5 = 8 stats. Budget = 4*2+1 = 9. Draw 1 ~1 stat,
 * +0/+2 self ~1 stat. 9 - 2 = 7. Slightly under, but two effects on
 * deploy is flexible. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_companion_human" as CardDefinition["id"],
  name: "The Human's Trust",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "ht_deploy_draw_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "self",
          },
          {
            op: "buff",
            stats: { power: 0, health: 2 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The last organic Archon looked at you and saw something worth believing in. That is rarer than any algorithm.",
  rulesVersion: "1.0.0",
};
