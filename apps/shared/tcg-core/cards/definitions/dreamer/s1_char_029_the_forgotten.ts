/**
 * s1_char_029 — The Forgotten
 *
 * Rare unit · Dreamer faction · 3 cost · 7/8
 * Keywords: stealth, evolve
 *
 * Oracle text (from season1-cards.json):
 *   "Hidden for 2 turn(s). Cannot be targeted until revealed.
 *    After 2 kills, gains +2/+2 and a new keyword."
 *
 * Ambiguity resolution:
 *   "a new keyword" is resolved to **Rush**. Rationale: The Forgotten is
 *   a stealth warrior — once they strike from the shadows and prove
 *   themselves (2 kills), they gain the momentum to act immediately each
 *   turn. Rush complements the aggressive stealth opener.
 *
 * Mechanical model:
 *  - Stealth: on deploy, gains `untargetable` for 2 turns plus a
 *    `stealth_turns` counter for UI countdown. Breaks on first attack.
 *  - `forgotten_kills` counter ticks up per kill. At 2, evolve fires:
 *    permanent +2/+2 plus Rush, counter resets.
 *
 * Golden tests: test/cards/dreamer/s1_char_029_the_forgotten.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_029" as CardDefinition["id"],
  name: "The Forgotten",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 4, health: 3 },
  keywords: [],
  abilities: [
    // --- Stealth: untargetable for 2 turns on deploy ---
    {
      id: "forg_stealth_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "grant_keyword",
            keyword: "untargetable",
            duration: { kind: "n_turns", n: 2 },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "stealth_turns",
            amount: 2,
            to: { kind: "self" },
          },
        ],
      },
    },
    // --- Reveal: remove untargetable when dealing damage ---
    {
      id: "forg_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
    // --- Evolve: tick kill counter ---
    {
      id: "forg_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "forgotten_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: at 2 kills → +2/+2 + rush ---
    {
      id: "forg_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "forgotten_kills",
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
            kind: "forgotten_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_029.webp"),
  flavorText:
    "Connections Appearances No connected characters. No appearances in stories.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "reactive"] as const,
  verdict_delta: 1,
};
