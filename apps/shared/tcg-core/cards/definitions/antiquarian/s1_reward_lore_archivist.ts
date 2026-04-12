/**
 * s1_reward_lore_archivist — Knowledge Keeper
 *
 * Rare unit · Antiquarian faction · 3 cost · 2/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, add 2 forcefield charges to self.
 *    Knowledge is the only armor that never rusts."
 *
 * Lore: Completing the Lore Journal requires piecing together the
 * Saga's hidden history from scattered fragments. The Knowledge Keeper
 * is an Antiquarian archivist who has assembled those fragments into a
 * coherent shield — mechanically represented by forcefield charges
 * that absorb incoming damage.
 *
 * Reward: Complete the Lore Journal collection.
 *
 * Balance: 3 cost · 2/4 = 6 stats. Budget = 3*2+1 = 7. 2 forcefield
 * charges ~1 stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_lore_archivist" as CardDefinition["id"],
  name: "Knowledge Keeper",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "kk_forcefield_charges" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 2,
        to: { kind: "self" },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "She memorized every page of the lost archives. Her mind is the last library standing.",
  rulesVersion: "1.0.0",
};
