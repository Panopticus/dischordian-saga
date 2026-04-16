/**
 * s1_char_041 — The Oracle
 *
 * Epic unit · Insurgency faction · 6 cost · 6/10
 * Keywords: shield, resurrect
 *
 * Oracle text (from season1-cards.json):
 *   "Absorbs the first 3 damage taken.
 *    Returns to the field with 3 HP after first death."
 *
 * Mechanical model:
 *  - Forcefield: on deploy, set `forcefield_charges` counter to 3. The
 *    engine's damage pipeline decrements this counter before subtracting
 *    health.
 *  - Resurrect: on_death, if the `resurrect_used` counter is < 1, the
 *    unit is returned to the field with 3 HP. The counter is incremented
 *    to prevent re-triggering.
 *
 * Golden tests: test/cards/insurgency/s1_char_041_the_oracle.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_041" as CardDefinition["id"],
  name: "The Oracle",
  faction: "insurgency",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 6, health: 7 },
  keywords: ["forcefield"],
  abilities: [
    // --- Shield: 3 forcefield charges on deploy ---
    {
      id: "oracle_forcefield_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 3,
        to: { kind: "self" },
      },
    },
    // --- Resurrect: come back once with 3 HP ---
    {
      id: "oracle_resurrect" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      condition: {
        kind: "counter_gte",
        counter: "resurrect_used",
        value: 0,
      },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "add_counter",
            kind: "resurrect_used",
            amount: 1,
            to: { kind: "self" },
          },
          {
            op: "buff",
            stats: { power: 0, health: 3 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_char_041.webp",
  flavorText:
    "A. The Oracle was a revered figure within the Insurgency , known for his wisdom and prophetic insights that inspired res...",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence", "narrative"] as const,
};
