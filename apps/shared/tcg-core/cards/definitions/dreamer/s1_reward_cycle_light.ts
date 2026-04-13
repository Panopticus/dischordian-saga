/**
 * s1_reward_cycle_light — Dawn Ascendant
 *
 * Rare unit · Dreamer faction · 3 cost · 3/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, heal your general for 3.
 *    The light phase of the Dischordia Cycle restores what darkness consumed."
 *
 * Lore: The Dischordia Cycle alternates between light and dark phases,
 * each rewarding those who endure it. Dawn Ascendant embodies the light
 * phase's restorative power — the moment when the cycle's tide turns
 * and hope returns. Players who survive the full light cycle earn this
 * card as proof of their perseverance.
 *
 * Reward: Complete a full light phase of the Dischordia Cycle.
 *
 * Balance: 3 cost · 3/3 = 6 stats. Budget = 3*2+1 = 7. Heal general
 * 3 ~1 stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_cycle_light" as CardDefinition["id"],
  name: "Dawn Ascendant",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "da_heal_general" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 3 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: "/art/cards/s1_reward_cycle_light.webp",
  flavorText:
    "When the Cycle turns, the first light is always the coldest. But it is light nonetheless.",
  rulesVersion: "1.0.0",
};
