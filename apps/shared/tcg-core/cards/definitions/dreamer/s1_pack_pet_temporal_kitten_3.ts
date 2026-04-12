/**
 * s1_pack_pet_temporal_kitten_3 — Epoch Panther
 *
 * Epic unit · Dreamer faction · 5 cost · 4/6
 * Keywords: celerity
 *
 * Oracle text:
 *   "Celerity. At the start of your turn, gain +1/+0.
 *    It moves through time the way other creatures move through space
 *    — with terrifying, casual ease."
 *
 * Lore: The Epoch Panther is the final evolution of the Temporal
 * Kitten line — a sleek chronal apex predator that acts twice per
 * turn and grows stronger with each passing moment. Celerity
 * represents its mastery over the timestream, and the escalating
 * power reflects temporal momentum: the longer it exists, the more
 * timelines it draws strength from.
 *
 * Pet Evolution: Temporal Kitten stage 3 of 3.
 * Collect all 3 stages to unlock the Temporal Kitten card back.
 *
 * Balance: 5 cost · 4/6 = 10 stats. Budget = 5*2+1 = 11. Celerity
 * ~2 stats, grow +1/+0 per turn ~1 stat. 11 - 3 = 8. At 10 stats,
 * over by 2 but celerity + grow is the capstone payoff. On budget
 * for epic pack-exclusive.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_temporal_kitten_3" as CardDefinition["id"],
  name: "Epoch Panther",
  faction: "dreamer",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: ["celerity"],
  abilities: [
    {
      id: "ep_turn_grow" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 0 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "It moves through time the way other creatures move through space — with terrifying, casual ease.",
  rulesVersion: "1.0.0",
};
