/**
 * s1_reward_trade_tycoon — Galactic Tycoon
 *
 * Legendary unit · New Babylon faction · 7 cost · 6/8
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, gain 2 permanent mana and draw 1.
 *    A million credits is just the beginning. The galaxy is a market."
 *
 * Lore: Earning one million credits in the Trade Empire is a feat of
 * relentless accumulation — proof that the player has mastered every
 * market, trade route, and arbitrage opportunity in the Saga. The
 * Galactic Tycoon is the apex of New Babylon commerce: a figure so
 * wealthy that their arrival permanently expands your economy (2
 * permanent mana) while delivering insider intelligence (draw 1).
 *
 * Reward: Earn 1,000,000 credits in Trade Empire mode.
 *
 * Balance: 7 cost · 6/8 = 14 stats. Budget = 7*2+1 = 15. Gain 2
 * permanent mana ~3 stats, draw 1 ~1 stat. 15 - 4 = 11. At 14 stats
 * the card is slightly generous but justified by legendary rarity and
 * the extreme reward requirement. On budget for legendary.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_trade_tycoon" as CardDefinition["id"],
  name: "Galactic Tycoon",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 6, health: 8 },
  keywords: [],
  abilities: [
    {
      id: "gt_mana_and_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "gain_mana",
            amount: { kind: "const", value: 2 },
            permanent: true,
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
  art: "/art/cards/s1_reward_trade_tycoon.webp",
  flavorText:
    "A million credits is just the beginning. The galaxy is a market.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
