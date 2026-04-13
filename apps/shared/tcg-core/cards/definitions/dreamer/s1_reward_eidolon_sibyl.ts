/**
 * s1_reward_eidolon_sibyl — Sibyl, the Oracle
 *
 * Rare unit · Dreamer faction · 4 cost · 3/4
 * Keywords: grow
 *
 * Oracle text:
 *   "Grow.
 *    She sees tomorrow's strength and borrows it today."
 *
 * Lore: Sibyl is the Oracle-class Eidolon — a luminous owl whose eyes
 * show possible futures as shifting holographic visions. Bonded
 * through the Eidolon Bond system, Sibyl rewards Dreamer-aligned
 * Soul-Keepers. Each turn she grows a little more, because she has
 * already seen the shape she will take, and is patiently becoming it.
 *
 * Reward: Reach max bond with Eidolon Sibyl.
 *
 * Balance: 4 cost · 3/4 = 7 stats. Budget = 4*2+1 = 9. Grow keyword
 * provides passive +1/+1 per turn and is worth ~2 stats on budget.
 * 9 - 2 = 7. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_sibyl" as CardDefinition["id"],
  name: "Sibyl, the Oracle",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: ["grow"],
  abilities: [],
  art: "/art/eidolons/sibyl/sibyl-norm-comp.png",
  flavorText:
    "She does not become stronger. She remembers forward.",
  rulesVersion: "1.0.0",
};
