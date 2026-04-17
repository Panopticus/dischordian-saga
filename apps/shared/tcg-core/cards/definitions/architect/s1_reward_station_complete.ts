/**
 * s1_reward_station_complete — Station Commander
 *
 * Rare unit · Architect faction · 5 cost · 4/6
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give all friendly units +0/+1.
 *    A completed station is a fortress. Its commander makes it an army."
 *
 * Lore: Completing a space station's full construction demands sustained
 * resource management and strategic planning — the Architect's core
 * virtues. The Station Commander oversees the finished installation and
 * reinforces every allied unit with hardened station shielding, granting
 * a permanent health buff across the board.
 *
 * Reward: Complete space station construction.
 *
 * Balance: 5 cost · 4/6 = 10 stats. Budget = 5*2+1 = 11. AoE +0/+1
 * permanent ~1 stat. 11 - 1 = 10. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_station_complete" as CardDefinition["id"],
  name: "Station Commander",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "sc_buff_all_hp" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self", except: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 0, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_station_complete.webp",
  flavorText:
    "The station's last module locked into place. The Commander looked out at the fleet and smiled. Now they were ready.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
