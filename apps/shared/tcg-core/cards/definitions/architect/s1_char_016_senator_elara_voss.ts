/**
 * s1_char_016 — Senator Elara Voss
 *
 * Uncommon unit · Architect faction · 2 cost · 5/4
 * Keywords: evolve
 *
 * Oracle text (from season1-cards.json):
 *   "After 2 kills, gains +2/+2 and a new keyword."
 *
 * Ambiguity resolution — "a new keyword" is resolved to **Rush**.
 * Rationale: Senator Elara Voss is a prominent political figure known
 * for decisive action — Rush (may act the turn it gains the keyword)
 * captures the aggressive political maneuvering flavor.
 *
 * Mechanical model:
 *  - `voss_kills` counter ticks up on every unit kill.
 *    When it hits 2, the evolve ability fires: permanent +2/+2 stat buff
 *    plus the Rush keyword, then the counter resets.
 *
 * Golden tests: test/cards/architect/s1_char_016_senator_elara_voss.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_016" as CardDefinition["id"],
  name: "Senator Elara Voss",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 5, health: 4 },
  keywords: [],
  abilities: [
    // --- Evolve: tick kill counter ---
    {
      id: "voss_tick_kill" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "voss_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: fire at 2 kills → +2/+2 + rush ---
    {
      id: "voss_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "voss_kills",
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
            kind: "voss_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/054_senator_elara_voss_15ab7ede.png",
  flavorText:
    "A.; fate following the Fall of Reality is unspecified Senator Elara Voss was a prominent political figure born on the planet Atarion.",
  rulesVersion: "1.0.0",
};
