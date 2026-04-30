/**
 * s1_char_009 — General Prometheus
 *
 * Uncommon unit · Architect faction · 3 cost · 3/6
 * Keywords: (none innate)
 *
 * Evolve pattern: kill counter ticks on each kill. At 2 kills, the
 * unit permanently gains +2/+2 and the backstab keyword, then the
 * counter resets so the evolve can re-trigger every 2 kills.
 *
 * Golden tests: test/cards/architect/s1_char_009_general_prometheus.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_009" as CardDefinition["id"],
  name: "General Prometheus",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 6 },
  keywords: [],
  abilities: [
    // --- Evolve: tick kill counter ---
    {
      id: "gp_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "prometheus_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: fire at 2 kills ---
    {
      id: "gp_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "prometheus_kills",
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
            keyword: "backstab",
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          // Reset the counter so the next 2 kills re-trigger evolve.
          {
            op: "add_counter",
            kind: "prometheus_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_009.webp"),
  flavorText:
    "He stole fire once — now he steals the moment between heartbeats, striking where no eye can follow.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "reactive"] as const,
  verdict_delta: 1,
};
