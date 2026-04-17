/**
 * s1_char_007 — General Alarik
 *
 * Uncommon unit · Architect faction · 2 cost · 5/5
 * Keywords: evolve (modeled as a kill-counter evolution path)
 *
 * Oracle text (from season1-cards.json):
 *   "After 2 kills, gains +2/+2 and a new keyword."
 *
 * Ambiguity resolution:
 *   "a new keyword" resolves to **Provoke**. Rationale: General Alarik
 *   was one of the Architect's elite Titan Generals; provoke — forcing
 *   enemies to target him — captures the battlefield command presence of
 *   a front-line commander.
 *
 * Mechanical model:
 *  - `alarik_kills` counter ticks up on every unit kill. When it hits 2,
 *    the evolve ability fires: a permanent +2/+2 stat buff plus the
 *    Provoke keyword, and the counter resets.
 *
 * Golden tests: test/cards/architect/s1_char_007_general_alarik.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_007" as CardDefinition["id"],
  name: "General Alarik",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: [],
  abilities: [
    // --- Seed the kill counter on deploy ---
    {
      id: "ga_seed_kills" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "alarik_kills",
        amount: 0,
        to: { kind: "self" },
      },
    },
    // --- Tick the kill counter on every kill ---
    {
      id: "ga_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "alarik_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve at 2 kills: +2/+2 + Provoke ---
    {
      id: "ga_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "alarik_kills",
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
            keyword: "provoke",
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          // Reset the counter so the next 2 kills re-trigger evolve.
          {
            op: "add_counter",
            kind: "alarik_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_char_007.webp",
  flavorText:
    "One of the Architect's elite robotic Titan Generals, specialized in planetary siege operations and orbital suppression.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "reactive"] as const,
  verdict_delta: 1,
};
