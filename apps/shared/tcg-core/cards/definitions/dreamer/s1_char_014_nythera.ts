/**
 * s1_char_014 — Nythera
 *
 * Uncommon unit · Dreamer faction · 2 cost · 5/6
 * Keywords: evolve, stealth
 *
 * Oracle text (from season1-cards.json):
 *   "After 2 kills, gains +2/+2 and a new keyword.
 *    Hidden for 2 turn(s). Cannot be targeted until revealed."
 *
 * Ambiguity resolution — "a new keyword" left as design TBD; the evolve
 * grants +2/+2 and Celerity (same cadence as other evolve cards). Stealth
 * is modeled as untargetable for 2 turns with reveal-on-attack.
 *
 * Mechanical model:
 *  - Stealth: on deploy, gains `untargetable` for 2 turns and sets a
 *    `stealth_turns` counter to 2. On damage dealt, untargetable is removed.
 *  - Evolve: `nythera_kills` counter ticks on kills. At 2, fires +2/+2
 *    permanent buff + celerity keyword, then counter resets.
 *
 * Golden tests: test/cards/dreamer/s1_char_014_nythera.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_014" as CardDefinition["id"],
  name: "Nythera",
  faction: "dreamer",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: [],
  abilities: [
    // --- Stealth: untargetable for 2 turns on deploy ---
    {
      id: "nyth_stealth_2" as CardDefinition["abilities"][number]["id"],
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
    // --- Stealth: reveal on attack ---
    {
      id: "nyth_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
    // --- Evolve: tick kill counter ---
    {
      id: "nyth_tick_kill" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "nythera_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: fire at 2 kills → +2/+2 + celerity ---
    {
      id: "nyth_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "nythera_kills",
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
            kind: "nythera_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_char_014.webp",
  flavorText:
    "Their essence is drawn from a dual heritage \u2014 Harvested DNA and Machine Code \u2014 meticulously preserved to ensure that, when the time came, they would awaken.",
  rulesVersion: "1.0.0",
};
