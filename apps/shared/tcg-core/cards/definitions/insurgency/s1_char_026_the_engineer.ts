/**
 * s1_char_026 — The Engineer
 *
 * Epic unit · Insurgency faction · 5 cost · 6/10
 * Keywords: shield, evolve
 *
 * Oracle text (from season1-cards.json):
 *   "Absorbs the first 3 damage taken.
 *    After 3 kills, gains +2/+2 and a new keyword."
 *
 * Ambiguity resolution:
 *   "a new keyword" is resolved to **Rush**. Rationale: The Engineer is a
 *   builder and pragmatist — Rush represents her ability to deploy
 *   creations into battle immediately. Mechanically, rush lets the unit
 *   attack the turn it evolves, rewarding aggressive play.
 *
 * Mechanical model:
 *  - `forcefield_charges` counter starts at 3 on deploy. The engine's
 *    damage pipeline decrements this counter before subtracting health.
 *  - `engineer_kills` counter ticks up on every unit The Engineer kills.
 *    When it hits 3, the evolve ability fires: a permanent +2/+2 stat
 *    buff plus the Rush keyword, and the counter resets.
 *
 * Golden tests: test/cards/insurgency/s1_char_026_the_engineer.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_026" as CardDefinition["id"],
  name: "The Engineer",
  faction: "insurgency",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 6 },
  keywords: ["forcefield"],
  abilities: [
    // --- Shield: 3 forcefield charges on deploy ---
    {
      id: "eng_forcefield_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 3,
        to: { kind: "self" },
      },
    },
    // --- Evolve: tick kill counter ---
    {
      id: "eng_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "engineer_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: at 3 kills → +2/+2 + rush ---
    {
      id: "eng_evolve_at_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "engineer_kills",
        value: 3,
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
            keyword: "rush",
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          {
            op: "reset_counter",
            counter: "engineer_kills",
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_026.webp"),
  flavorText:
    "She built the Inception Arks to save humanity. Now she builds weapons to defend the dream. The Engineer does not choose sides \u2014 she chooses survival.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence", "narrative", "reactive"] as const,
  verdict_delta: 2,
};
