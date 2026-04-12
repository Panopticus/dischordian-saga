/**
 * s1_reward_prestige_t1 — First Ascension
 *
 * Common unit · Neutral faction · 2 cost · 2/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give self 1 forcefield charge.
 *    The first step upward is the hardest. The shield proves you took it."
 *
 * Lore: Prestige Tier 1 marks the player's first full cycle through
 * the game's progression — a rebirth that strips away accumulated power
 * in exchange for deeper understanding. The First Ascension embodies
 * that exchange: a modest body protected by a single forcefield charge,
 * representing the thin but real shield of experience.
 *
 * Reward: Reach Prestige Tier 1.
 *
 * Balance: 2 cost · 2/3 = 5 stats. Budget = 2*2+1 = 5. 1 forcefield
 * charge ~0.5 stat. Slightly over but trivial. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_prestige_t1" as CardDefinition["id"],
  name: "First Ascension",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "fa_deploy_forcefield" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 1,
        to: { kind: "self" },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The first step upward is the hardest. The shield proves you took it.",
  rulesVersion: "1.0.0",
};
