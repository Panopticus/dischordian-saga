/**
 * s1_char_040 — The Nomad
 *
 * Rare unit · Insurgency faction · 3 cost · 4/8
 * Keywords: evolve
 *
 * Oracle text (from season1-cards.json):
 *   "After 2 kills, gains +2/+2 and a new keyword."
 *
 * Design interpretation:
 *   "a new keyword" resolves to **Rush**. Rationale: The Nomad is a masked
 *   Insurgency operative whose past is entirely classified — rush (acting
 *   immediately after evolution) captures the hit-and-run guerrilla
 *   tactics of a wanderer who strikes without warning.
 *
 * Mechanical model:
 *  - Evolve: `nomad_kills` counter ticks on each kill. At 2, the unit
 *    gains +2/+2 permanently and the `rush` keyword, then the counter
 *    resets.
 *
 * Golden tests: test/cards/insurgency/s1_char_040_the_nomad.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_040" as CardDefinition["id"],
  name: "The Nomad",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    // --- Evolve: tick kill counter ---
    {
      id: "nomad_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "nomad_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: at 2 kills, gain +2/+2 and rush ---
    {
      id: "nomad_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "nomad_kills",
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
            keyword: "rush",
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "nomad_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_char_040.webp",
  flavorText:
    "Always concealed beneath a hood and a mask, his true identity remains a mystery, with his past entirely classified. The ...",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "reactive"] as const,
  verdict_delta: 1,
};
