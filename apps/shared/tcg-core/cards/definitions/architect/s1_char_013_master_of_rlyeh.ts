/**
 * s1_char_013 — Master of R'lyeh
 *
 * Uncommon unit · Architect faction · 3 cost · 5/6
 * Keywords: evolve
 *
 * Oracle text (from season1-cards.json):
 *   "After 2 kills, gains +2/+2 and a new keyword."
 *
 * Ambiguity resolution — "a new keyword" is resolved to **Celerity**.
 * Rationale: the Master of R'lyeh is an ancient entity of immense power
 * existing outside normal time — Celerity (two actions per turn) captures
 * the flavor of operating at a speed beyond mortal comprehension.
 *
 * Mechanical model:
 *  - `rlyeh_kills` counter ticks up on every unit the Master kills.
 *    When it hits 2, the evolve ability fires: permanent +2/+2 stat buff
 *    plus the Celerity keyword, then the counter resets.
 *
 * Golden tests: test/cards/architect/s1_char_013_master_of_rlyeh.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_013" as CardDefinition["id"],
  name: "Master of R\u2019lyeh",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 4, health: 3 },
  keywords: [],
  abilities: [
    // --- Evolve: tick kill counter ---
    {
      id: "rlyeh_tick_kill" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "rlyeh_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: fire at 2 kills → +2/+2 + celerity ---
    {
      id: "rlyeh_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "rlyeh_kills",
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
            keyword: "celerity",
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "rlyeh_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_013.webp"),
  flavorText:
    "A. Era; current status unknown after the Fall of Reality The Master of R\u2019lyeh is an enigmatic and ancient entity of immense power.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "reactive"] as const,
  verdict_delta: 1,
};
