/**
 * s1_reward_casino_jackpot — Lucky Break
 *
 * Rare spell · Neutral faction · 0 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Draw 2 cards. Fortune favors those who play long enough."
 *
 * Lore: The Casino's jackpot is the ultimate stroke of luck — a
 * windfall that arrives when least expected. Lucky Break translates
 * that moment of fortune into pure card advantage at zero mana cost.
 * The catch? You have to earn it by hitting the jackpot in the Casino.
 *
 * Reward: Hit the jackpot in Casino mode.
 *
 * Balance: 0 cost spell. Draw 2 at 0 mana is powerful but gated
 * behind a rare achievement reward. Premium reward-exclusive rate.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_casino_jackpot" as CardDefinition["id"],
  name: "Lucky Break",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 0,
  keywords: [],
  abilities: [
    {
      id: "lb_draw_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_casino_jackpot.webp"),
  flavorText:
    "The house always wins. Unless you're the house. And today, you're the house.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
