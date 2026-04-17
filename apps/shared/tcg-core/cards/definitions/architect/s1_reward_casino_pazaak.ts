/**
 * s1_reward_casino_pazaak — Pazaak Champion
 *
 * Rare unit · Architect faction · 3 cost · 3/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 1.
 *    Twenty-one wins. Zero tells. Pure calculation."
 *
 * Lore: Pazaak 21 is a game of precise arithmetic and nerve, favored
 * by Architect strategists who see gambling as applied mathematics.
 * Winning 25 games proves mastery of risk calculation. The Pazaak
 * Champion brings that calculated edge to the battlefield — on
 * arrival, they assess the situation (draw a card) and play to win.
 *
 * Reward: Win 25 Pazaak 21 games.
 *
 * Balance: 3 cost · 3/3 = 6 stats. Budget = 3*2+1 = 7. Draw 1 on
 * deploy ~1 stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_casino_pazaak" as CardDefinition["id"],
  name: "Pazaak Champion",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "pc_draw_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_reward_casino_pazaak.webp",
  flavorText:
    "Twenty-one wins. Zero tells. Pure calculation.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
