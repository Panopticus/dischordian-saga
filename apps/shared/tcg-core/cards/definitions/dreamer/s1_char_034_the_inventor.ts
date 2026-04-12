/**
 * s1_char_034 — The Inventor
 *
 * Rare unit · Dreamer faction · 3 cost · 7/5
 * Keywords: evolve, shield
 *
 * Oracle text (from season1-cards.json):
 *   "After 2 kills, gains +2/+2 and a new keyword.
 *    Absorbs the first 2 damage taken."
 *
 * Ambiguity resolution:
 *   "a new keyword" is resolved to **Forcefield** (the keyword itself).
 *   However, per the spec, the evolve at 2 grants +2/+2 + forcefield.
 *   Since shield is already present via charges, the evolve granting the
 *   `forcefield` keyword ensures it persists even after charges deplete.
 *   The 2 forcefield charges are deployed up front per spec.
 *
 * Mechanical model:
 *  - Shield: on deploy, 2 `forcefield_charges` are added.
 *  - `inventor_kills` counter ticks up per kill. At 2, evolve fires:
 *    permanent +2/+2 plus the `forcefield` keyword, counter resets.
 *
 * Golden tests: test/cards/dreamer/s1_char_034_the_inventor.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_034" as CardDefinition["id"],
  name: "The Inventor",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["forcefield"],
  abilities: [
    // --- Shield: 2 forcefield charges on deploy ---
    {
      id: "inv_forcefield_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 2,
        to: { kind: "self" },
      },
    },
    // --- Evolve: tick kill counter ---
    {
      id: "inv_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "inventor_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: at 2 kills → +2/+2 + forcefield ---
    {
      id: "inv_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "inventor_kills",
        value: 2,
      },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "buff",
            stats: { power: 2, health: 2 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          {
            op: "grant_keyword",
            keyword: "forcefield",
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "inventor_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/039_the_inventor_4db38ce2.png",
  flavorText:
    "Driven by the Dreamer's visions, the Inventor crafts tools and innovations that can empower or undermine any faction, de...",
  rulesVersion: "1.0.0",
};
