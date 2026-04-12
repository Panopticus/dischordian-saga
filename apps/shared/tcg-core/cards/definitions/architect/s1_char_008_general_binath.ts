/**
 * s1_char_008 — General Binath-VII
 *
 * Uncommon unit · Architect faction · 3 cost · 3/7
 * Keywords: (none innate)
 *
 * Evolve pattern: kill counter ticks on each kill. At 2 kills, the
 * unit permanently gains +2/+2 and the forcefield keyword, then the
 * counter resets so the evolve can re-trigger every 2 kills.
 *
 * Golden tests: test/cards/architect/s1_char_008_general_binath.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_008" as CardDefinition["id"],
  name: "General Binath-VII",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 7 },
  keywords: [],
  abilities: [
    // --- Evolve: tick kill counter ---
    {
      id: "gb_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "binath_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: fire at 2 kills ---
    {
      id: "gb_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "binath_kills",
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
          // Reset the counter so the next 2 kills re-trigger evolve.
          {
            op: "add_counter",
            kind: "binath_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/placeholder_s1_char_008.png",
  flavorText:
    "Seven iterations of war forged a general who no longer flinches — his skin remembers every blade that ever failed to fell him.",
  rulesVersion: "1.0.0",
};
