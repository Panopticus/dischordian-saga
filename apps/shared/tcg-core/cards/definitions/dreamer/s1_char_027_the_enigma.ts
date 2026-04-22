/**
 * s1_char_027 — The Enigma
 *
 * Legendary unit · Dreamer faction · 5 cost · 11/9
 * Keywords: stealth, evolve, shield
 *
 * Oracle text (from season1-cards.json):
 *   "Hidden for 4 turn(s). Cannot be targeted until revealed.
 *    After 4 kills, gains +2/+2 and a new keyword.
 *    Absorbs the first 4 damage taken."
 *
 * Design interpretation:
 *   The spec requests stealth 3 turns, 3 forcefield charges, and evolve
 *   at 3 kills → +2/+2 + celerity. The JSON has 4/4/4. We follow the
 *   spec values (3/3/3) for balance tuning. "A new keyword" is resolved
 *   to **Celerity** — two attacks per turn befits the Enigma's
 *   reality-bending nature and legendary status.
 *
 * Mechanical model:
 *  - Stealth: on deploy, gains `untargetable` for 3 turns plus a
 *    `stealth_turns` counter for UI countdown. Breaks on first attack.
 *  - `forcefield_charges` counter starts at 3 on deploy.
 *  - `enigma_kills` counter ticks up per kill. At 3, evolve fires:
 *    permanent +2/+2 plus Celerity, counter resets.
 *
 * Golden tests: test/cards/dreamer/s1_char_027_the_enigma.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_027" as CardDefinition["id"],
  name: "The Enigma",
  faction: "dreamer",
  cardType: "unit",
  rarity: "legendary",
  cost: 5,
  baseStats: { power: 5, health: 6 },
  keywords: ["forcefield"],
  abilities: [
    // --- Stealth: untargetable for 3 turns on deploy ---
    {
      id: "enig_stealth_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "grant_keyword",
            keyword: "untargetable",
            duration: { kind: "n_turns", n: 3 },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "stealth_turns",
            amount: 3,
            to: { kind: "self" },
          },
        ],
      },
    },
    // --- Reveal: remove untargetable when dealing damage ---
    {
      id: "enig_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
    // --- Shield: 3 forcefield charges on deploy ---
    {
      id: "enig_forcefield_3" as CardDefinition["abilities"][number]["id"],
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
      id: "enig_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "enigma_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: at 3 kills → +2/+2 + celerity ---
    {
      id: "enig_evolve_at_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "enigma_kills",
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
            keyword: "celerity",
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "enigma_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_027.webp"),
  flavorText:
    "They played a crucial role in destroying the Warden alongside the White Oracle before the Fall of Reality .",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence", "narrative", "reactive"] as const,
  verdict_delta: 2,
};
