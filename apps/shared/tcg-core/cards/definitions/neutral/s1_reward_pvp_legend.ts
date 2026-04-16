/**
 * s1_reward_pvp_legend — Arena Legend
 *
 * Legendary unit · Neutral faction · 8 cost · 7/9
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give all friendly units +1/+1.
 *    Legends reshape the battlefield by their presence alone."
 *
 * Lore: Legend rank is the apex of PvP competition. Only the most
 * dedicated and skilled players reach it. The Arena Legend is a figure
 * of myth — their very arrival on the battlefield inspires all allies
 * to fight harder, represented by a global permanent buff.
 *
 * Reward: Reach Legend rank in PvP Ranked mode.
 *
 * Balance: 8 cost · 7/9 = 16 stats. Budget = 8*2+1 = 17. AoE +1/+1
 * to allies is ~1-2 stats depending on board. 17 - 1 = 16. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_pvp_legend" as CardDefinition["id"],
  name: "Arena Legend",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 7, health: 9 },
  keywords: [],
  abilities: [
    {
      id: "al_buff_all_allies" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
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
    },
  ],
  art: "/art/cards/s1_reward_pvp_legend.webp",
  flavorText:
    "When the Legend enters the arena, even the walls lean in to watch.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};
