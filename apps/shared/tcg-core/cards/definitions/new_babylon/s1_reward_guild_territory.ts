/**
 * s1_reward_guild_territory — Territory Commander
 *
 * Rare unit · New Babylon faction · 5 cost · 4/6
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give all friendly units +0/+1.
 *    Territory is held not by walls, but by the will to defend them."
 *
 * Lore: Guild Wars pit player guilds against each other for territory
 * control across the Saga's world map. Capturing and holding territory
 * earns the Territory Commander — a New Babylon officer who fortifies
 * all allies upon arrival, representing the defensive infrastructure
 * that territorial control provides.
 *
 * Reward: Capture territory in Guild Wars mode.
 *
 * Balance: 5 cost · 4/6 = 10 stats. Budget = 5*2+1 = 11. AoE +0/+1
 * to allies ~1 stat. 11 - 1 = 10. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_guild_territory" as CardDefinition["id"],
  name: "Territory Commander",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "tc_fortify_allies" as CardDefinition["abilities"][number]["id"],
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
  art: "/art/cards/s1_reward_guild_territory.webp",
  flavorText:
    "She planted New Babylon's flag in contested ground and dared the world to pull it out.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
