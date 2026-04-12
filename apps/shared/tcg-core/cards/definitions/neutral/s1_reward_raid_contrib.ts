/**
 * s1_reward_raid_contrib — Rally the Warband
 *
 * Rare spell · Neutral faction · 2 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Give all friendly units +1/+0 this turn.
 *    One voice lifts a hundred blades."
 *
 * Lore: Earning top contribution in five raids proves the player
 * can carry their weight — and others' — through the worst the Saga
 * throws at them. Rally the Warband channels that leadership into a
 * burst of offensive power for every friendly unit on the board.
 *
 * Reward: Earn top contribution in 5 Coop Raids.
 *
 * Balance: 2 cost spell. +1/+0 AoE this turn is a tempo burst worth
 * ~2 mana depending on board. Fair at 2 cost.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_raid_contrib" as CardDefinition["id"],
  name: "Rally the Warband",
  faction: "neutral",
  cardType: "spell",
  rarity: "rare",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "rtw_buff_all" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 1, health: 0 },
          duration: { kind: "this_turn" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The warband was losing. Then someone started singing. Then everyone did.",
  rulesVersion: "1.0.0",
};
