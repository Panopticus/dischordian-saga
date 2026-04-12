/**
 * s1_reward_prestige_t7 — Transcended One
 *
 * Legendary unit · Neutral faction · 8 cost · 7/9
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give all friendly units +1/+1 and draw 1 card.
 *    Seven cycles of death and rebirth. What remains is beyond mortal
 *    understanding."
 *
 * Lore: Prestige Tier 7 is the apex of the prestige system — a player
 * who has ascended seven times has transcended the game's very framework.
 * The Transcended One is the ultimate prestige reward: a colossal body
 * that buffs every ally and draws a card on arrival. It is the sum of
 * all lessons learned across every cycle.
 *
 * Reward: Reach Prestige Tier 7.
 *
 * Balance: 8 cost · 7/9 = 16 stats. Budget = 8*2+1 = 17. AoE +1/+1
 * to allies ~1-2 stats depending on board, draw 1 ~1 stat. 17 - 3 = 14.
 * Under budget on raw stats but two powerful deploy effects. Legendary
 * reward-exclusive. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_prestige_t7" as CardDefinition["id"],
  name: "Transcended One",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 7, health: 9 },
  keywords: [],
  abilities: [
    {
      id: "to_deploy_buff_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "foreach",
            over: {
              kind: "all",
              filter: { controller: "self", except: "self" },
            },
            do: {
              op: "buff",
              stats: { power: 1, health: 1 },
              duration: { kind: "permanent" },
              to: { kind: "it" },
            },
          },
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "self",
          },
        ],
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "Seven cycles of death and rebirth. What remains is beyond mortal understanding.",
  rulesVersion: "1.0.0",
};
