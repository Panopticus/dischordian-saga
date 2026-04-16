/**
 * s1_reward_pvp_bronze — Arena Aspirant
 *
 * Common unit · Neutral faction · 2 cost · 2/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, deal 1 damage to the enemy general.
 *    Every legend begins with a first step into the arena."
 *
 * Lore: Reaching Bronze rank in PvP proves a player can hold their own
 * in the Saga's combat arenas. The Arena Aspirant is a fresh recruit
 * whose eagerness translates into immediate aggression — a small but
 * telling opening blow.
 *
 * Reward: Reach Bronze rank in PvP Ranked mode.
 *
 * Balance: 2 cost · 2/3 = 5 stats. Budget = 2*2+1 = 5. Deal 1 to
 * general is minor (~0.5 stat). On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_pvp_bronze" as CardDefinition["id"],
  name: "Arena Aspirant",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "aa_ping_general" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 1 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: "/art/cards/s1_reward_pvp_bronze.webp",
  flavorText:
    "She entered the arena with nothing but a borrowed blade and a refusal to lose.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
};
