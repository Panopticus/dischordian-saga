/**
 * s1_reward_eidolon_cog — Cog, the Self-Builder
 *
 * Rare unit · Architect faction · 4 cost · 4/4
 * Keywords: forcefield
 *
 * Oracle text:
 *   "Forcefield.
 *    Every fracture in his lattice, he repairs before the dust settles."
 *
 * Lore: Cog is the Engineer-class Eidolon — a small golem of
 * interlocking brass and copper components that rebuilds itself as
 * fast as the world breaks it. Bonded through the Eidolon Bond
 * system, Cog rewards Architect-aligned Soul-Keepers with a unit
 * that shrugs off the first blow every turn. His lattice is
 * never finished; that is the point.
 *
 * Reward: Reach max bond with Eidolon Cog.
 *
 * Balance: 4 cost · 4/4 = 8 stats. Budget = 4*2+1 = 9. Forcefield
 * keyword costs 1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_cog" as CardDefinition["id"],
  name: "Cog, the Self-Builder",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["forcefield"],
  abilities: [],
  art: "/art/eidolons/cog/cog-norm-comp.png",
  flavorText:
    "The lattice is never finished. That is the point.",
  rulesVersion: "1.0.0",
};
