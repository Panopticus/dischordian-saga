/**
 * s1_reward_guild_hall — Hall's Blessing
 *
 * Rare spell · Neutral faction · 3 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Heal all friendly units for 2.
 *    The hall stands. So do we."
 *
 * Lore: A fully upgraded guild hall is the heart of any successful
 * guild — a sanctuary where wounded operatives recuperate and
 * regroup. Hall's Blessing channels that sanctuary's restorative
 * power across the entire friendly board, mending allies as if
 * they had retreated to the hall itself.
 *
 * Reward: Upgrade guild hall to max level.
 *
 * Balance: 3 cost spell. AoE heal 2 to all friendly units is worth
 * ~2-3 mana depending on board state. Fair at 3 cost.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_guild_hall" as CardDefinition["id"],
  name: "Hall's Blessing",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "hb_heal_all_friendly" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
        },
        do: {
          op: "heal",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_guild_hall.webp",
  flavorText:
    "The hall stands. So do we.",
  rulesVersion: "1.0.0",
};
