/**
 * s1_reward_pvp_diamond — Arena Veteran
 *
 * Epic unit · Neutral faction · 6 cost · 5/7
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. On deploy, deal 2 damage to a random enemy.
 *    Veterans don't enter the arena — they command it."
 *
 * Lore: Diamond rank is the crucible where good players become great.
 * The Arena Veteran is a battle-hardened warrior who forces enemies to
 * engage (provoke) and strikes with devastating precision on arrival.
 * They have survived everything the arena can throw at them.
 *
 * Reward: Reach Diamond rank in PvP Ranked mode.
 *
 * Balance: 6 cost · 5/7 = 12 stats. Budget = 6*2+1 = 13. Provoke
 * keyword costs 1 stat, deal 2 random ~1 stat. 13 - 2 = 11. Slightly
 * under, but provoke + deploy damage is strong tempo. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_pvp_diamond" as CardDefinition["id"],
  name: "Arena Veteran",
  faction: "neutral",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 5, health: 7 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "av_deploy_damage" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_reward_pvp_diamond.webp",
  flavorText:
    "She doesn't flinch. She hasn't flinched since Silver rank. The arena burned that reflex out of her.",
  rulesVersion: "1.0.0",
};
