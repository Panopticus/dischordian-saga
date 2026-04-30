/**
 * s1_char_030 — The Game Master
 *
 * Rare unit · Architect faction · 3 cost · 4/8
 * Keywords: shield, evolve
 *
 * Oracle text (from season1-cards.json):
 *   "Absorbs the first 2 damage taken.
 *    After 2 kills, gains +2/+2 and a new keyword."
 *
 * Ambiguity resolution:
 *   "a new keyword" is resolved to **Rush**. Rationale: The Game Master
 *   is an Archon prophet who manipulates the rules of engagement —
 *   once evolved, Rush represents seizing the initiative on the board,
 *   fitting his tactical mastermind identity.
 *
 * Mechanical model:
 *  - `forcefield_charges` counter starts at 2 on deploy. The engine's
 *    damage pipeline decrements this counter before subtracting health.
 *  - `gamemaster_kills` counter ticks up per kill. At 2, evolve fires:
 *    permanent +2/+2 plus Rush, counter resets.
 *
 * Golden tests: test/cards/architect/s1_char_030_the_game_master.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_030" as CardDefinition["id"],
  name: "The Game Master",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["forcefield"],
  abilities: [
    // --- Shield: 2 forcefield charges on deploy ---
    {
      id: "gm_forcefield_2" as CardDefinition["abilities"][number]["id"],
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
      id: "gm_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "gamemaster_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: at 2 kills → +2/+2 + rush ---
    {
      id: "gm_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "gamemaster_kills",
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
            kind: "gamemaster_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_030.webp"),
  flavorText:
    "A. The Game Master was the tenth Archon created by the Architect in Year 550 A.A., manifesting either as a man with dark...",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence", "reactive"] as const,
  verdict_delta: 1,
};
