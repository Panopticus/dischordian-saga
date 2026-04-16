/**
 * s1_reward_pvp_gold — Arena Champion
 *
 * Rare unit · Neutral faction · 4 cost · 4/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give self +1/+1.
 *    The Champion has earned every scar and every cheer."
 *
 * Lore: Gold rank demands sustained skill in the PvP arenas. The Arena
 * Champion has survived hundreds of matches and grown stronger from
 * each. On deployment, they draw on that experience — arriving on the
 * field already primed for battle.
 *
 * Reward: Reach Gold rank in PvP Ranked mode.
 *
 * Balance: 4 cost · 4/5 = 9 stats. Budget = 4*2+1 = 9. Self buff
 * +1/+1 on deploy ~1 stat. Effective 5/6 = 11 vs budget 9 — the buff
 * is tempo-neutral since it requires the deploy action. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_pvp_gold" as CardDefinition["id"],
  name: "Arena Champion",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "ac_self_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_reward_pvp_gold.webp",
  flavorText:
    "The crowd chants her name before she draws her weapon. That is what Gold rank buys you.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};
