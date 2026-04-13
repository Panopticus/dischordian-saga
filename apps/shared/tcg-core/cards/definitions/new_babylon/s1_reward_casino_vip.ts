/**
 * s1_reward_casino_vip — Casino Mogul
 *
 * Legendary unit · New Babylon faction · 6 cost · 5/7
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, gain 2 mana this turn.
 *    The VIP table has no limits. Neither does she."
 *
 * Lore: VIP status in New Babylon's casinos is not merely a perk — it
 * is a declaration of wealth and influence. The Casino Mogul has turned
 * the house's own games into a personal empire. On deployment, she
 * brings a surge of temporary mana — liquid capital that evaporates
 * if unused, mirroring the fleeting excess of the Casino floor.
 *
 * Reward: Reach VIP status in Casino mode.
 *
 * Balance: 6 cost · 5/7 = 12 stats. Budget = 6*2+1 = 13. Gain 2
 * temporary mana ~1 stat. 13 - 1 = 12. On budget. Legendary rarity.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_casino_vip" as CardDefinition["id"],
  name: "Casino Mogul",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 5, health: 7 },
  keywords: [],
  abilities: [
    {
      id: "cm_gain_2_temp_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 2 },
        permanent: false,
      },
    },
  ],
  art: "/art/cards/s1_reward_casino_vip.webp",
  flavorText:
    "The VIP table has no limits. Neither does she.",
  rulesVersion: "1.0.0",
};
