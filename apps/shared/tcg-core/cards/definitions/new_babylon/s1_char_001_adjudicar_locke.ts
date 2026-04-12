/**
 * s1_char_001 — Adjudicar Locke
 *
 * Uncommon unit · New Babylon faction · 2 cost · 4/5
 * Keywords: provoke (taunt mapped to provoke in our engine)
 *
 * Oracle text (from season1-cards.json):
 *   "Absorbs the first 2 damage taken. Enemies in this lane must attack
 *    this unit first."
 *
 * Mechanical model:
 *  - Provoke: the combat targeting resolver forces enemy attacks to target
 *    units with provoke before any other friendly unit in the same lane.
 *    Listed as an intrinsic keyword.
 *  - Shield: modeled via `forcefield_charges` counter set to 2 on deploy.
 *    The engine's damage pipeline decrements this counter before subtracting
 *    health (see damage.ts in the combat port).
 *
 * Golden tests: test/cards/new_babylon/s1_char_001_adjudicar_locke.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_001" as CardDefinition["id"],
  name: "Adjudicar Locke",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 4, health: 5 },
  keywords: ["provoke"],
  abilities: [
    // --- Shield: 2 forcefield charges on deploy ---
    {
      id: "al_forcefield_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 2,
        to: { kind: "self" },
      },
    },
  ],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/0_iSJV4odiK8KCIHf1BIm7cy_1773935729414_na1fn_L2hvbWUvdWJ1bnR1L3MxX2NoYXJfMDAxX2FydA_f08e9530.png",
  flavorText:
    "Known for her piercing intelligence and enigmatic presence, Locke is a controversial figure in the city's labyrinthine politics.",
  rulesVersion: "1.0.0",
};
