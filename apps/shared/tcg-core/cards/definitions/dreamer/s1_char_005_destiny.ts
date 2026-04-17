/**
 * s1_char_005 — Destiny
 *
 * Epic unit · Dreamer faction · 6 cost · 6/11
 * Keywords: shield (forcefield), rally (simplified to self-buff)
 *
 * Oracle text (from season1-cards.json):
 *   "Absorbs the first 3 damage taken. Adjacent allies gain +3 ATK this
 *    turn."
 *
 * Mechanical model:
 *  - Shield: `forcefield_charges` counter starts at 3 on deploy. The
 *    engine's damage pipeline decrements this counter before subtracting
 *    health.
 *  - Rally: simplified to a self-buff of +3/0 for this turn. The full
 *    adjacent-ally targeting is deferred to the AoE targeting pass; for
 *    now this mirrors the Iron Lion pattern.
 *
 * Golden tests: test/cards/dreamer/s1_char_005_destiny.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_005" as CardDefinition["id"],
  name: "Destiny",
  faction: "dreamer",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 6, health: 8 },
  keywords: [],
  abilities: [
    // --- Shield: 3 forcefield charges on deploy ---
    {
      id: "de_forcefield_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 3,
        to: { kind: "self" },
      },
    },
    // --- Rally: +3 ATK self-buff this turn ---
    {
      id: "de_rally_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 3, health: 0 },
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_005.webp",
  flavorText:
    "Awake and aware, she served as the Potentials\u2019 vigilant guide, monitoring ship functions, analyzing sensor data, and resolving crises before they could escalate.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: 2,
};
