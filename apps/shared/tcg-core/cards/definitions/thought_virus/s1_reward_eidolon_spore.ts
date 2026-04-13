/**
 * s1_reward_eidolon_spore — Spore, the Patient Symbiote
 *
 * Rare unit · Thought Virus faction · 4 cost · 3/4
 * Keywords: deathwatch
 *
 * Oracle text:
 *   "Deathwatch: whenever any unit dies, gain +0/+1.
 *    Spore does not consume. Spore waits."
 *
 * Lore: Spore is a Path A starter Eidolon — a symbiotic creature of
 * coiled viral filaments with an amber-red pulsing core visible
 * through translucent skin. Bonded through the Eidolon Bond system,
 * Spore rewards Thought-Virus-aligned Soul-Keepers. Unlike Strain,
 * who grieves what dies, Spore simply thickens in the silence after.
 * Each death makes her a little more patient.
 *
 * Reward: Reach max bond with Eidolon Spore.
 *
 * Balance: 4 cost · 3/4 = 7 stats. Budget = 4*2+1 = 9. Deathwatch
 * keyword ~1 stat, +0/+1 on unit death ~1 stat. 9 - 2 = 7. On budget.
 * Differentiated from Strain (which grows +1/+1) by being a pure
 * health accumulator — a patient survivor rather than a grieving
 * aggressor.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_spore" as CardDefinition["id"],
  name: "Spore, the Patient Symbiote",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: ["deathwatch"],
  abilities: [
    {
      id: "spore_patient_thicken" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/spectral/spectral-spore.png",
  flavorText:
    "Spore does not consume. Spore waits.",
  rulesVersion: "1.0.0",
};
