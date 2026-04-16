/**
 * s1_reward_pet_evolve — Evolved Familiar
 *
 * Rare unit · Neutral faction · 3 cost · 2/4
 * Keywords: none
 *
 * Oracle text:
 *   "At the start of your turn, gain +1/+0.
 *    Each battle makes it stronger. Each evolution makes it stranger."
 *
 * Lore: When a pet reaches its final evolutionary stage in Pet Battles,
 * it transcends its original form. The Evolved Familiar grows stronger
 * with each passing turn, representing the ongoing process of
 * adaptation that defines the Pet Battle system.
 *
 * Reward: Fully evolve a companion in Pet Battle mode.
 *
 * Balance: 3 cost · 2/4 = 6 stats. Budget = 3*2+1 = 7. Grow +1/+0
 * per turn is ~1 stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_pet_evolve" as CardDefinition["id"],
  name: "Evolved Familiar",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "ef_grow_power" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 0 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_reward_pet_evolve.webp",
  flavorText:
    "It shed its skin three times before the trainers stopped recognizing it. By the fourth, it stopped recognizing them.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};
