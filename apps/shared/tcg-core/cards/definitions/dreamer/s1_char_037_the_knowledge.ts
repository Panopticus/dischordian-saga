/**
 * s1_char_037 — The Knowledge
 *
 * Rare unit · Dreamer faction · 4 cost · 4/5
 * Keywords: evolve, shield
 *
 * Oracle text (from season1-cards.json):
 *   "After 2 kills, gains +2/+2 and a new keyword.
 *    Absorbs the first 2 damage taken."
 *
 * Design interpretation:
 *   "a new keyword" resolves to **Forcefield** (the shield keyword in our
 *   engine). Rationale: The Knowledge is a Ne-Yon spy whose power comes
 *   from information-as-armor; gaining forcefield on evolve doubles down
 *   on the defensive shield fantasy. On deploy, 2 forcefield charges
 *   absorb initial damage.
 *
 * Mechanical model:
 *  - Forcefield: on deploy, set `forcefield_charges` counter to 2.
 *  - Evolve: a `knowledge_kills` counter ticks on each kill. At 2, the
 *    unit gains +2/+2 permanently and the `forcefield` keyword, and
 *    the counter resets.
 *
 * Golden tests: test/cards/dreamer/s1_char_037_the_knowledge.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_037" as CardDefinition["id"],
  name: "The Knowledge",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: ["forcefield"],
  abilities: [
    // --- Shield: 2 forcefield charges on deploy ---
    {
      id: "know_forcefield_2" as CardDefinition["abilities"][number]["id"],
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
      id: "know_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "knowledge_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: at 2 kills, gain +2/+2 and forcefield ---
    {
      id: "know_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "knowledge_kills",
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
            kind: "knowledge_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_037.webp"),
  flavorText:
    "By maintaining an equilibrium of enlightenment and ignorance, the Knowledge ensures the Ne-Yons remain indispensable to ...",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence", "reactive"] as const,
  verdict_delta: 1,
};
