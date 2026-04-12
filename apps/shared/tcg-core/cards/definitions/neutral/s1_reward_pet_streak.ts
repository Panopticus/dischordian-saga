/**
 * s1_reward_pet_streak — Battle-Hardened Companion
 *
 * Common unit · Neutral faction · 1 cost · 1/1
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. This tiny companion has seen more battles than most generals.
 *    Underestimate it at your peril."
 *
 * Lore: Pet Battles pit players' companion creatures against each other
 * in friendly combat. A win streak proves the player's bond with their
 * companion. The Battle-Hardened Companion is small but fierce — a
 * creature that learned to strike first through countless bouts.
 *
 * Reward: Achieve a win streak in Pet Battle mode.
 *
 * Balance: 1 cost · 1/1 = 2 stats. Budget = 1*2+1 = 3. Rush keyword
 * costs 1 stat. 3 - 1 = 2. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_pet_streak" as CardDefinition["id"],
  name: "Battle-Hardened Companion",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 1 },
  keywords: ["rush"],
  abilities: [
    {
      id: "bhc_rush_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "can_attack_this_turn",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "It fits in your pocket. It has killed things that don't.",
  rulesVersion: "1.0.0",
};
