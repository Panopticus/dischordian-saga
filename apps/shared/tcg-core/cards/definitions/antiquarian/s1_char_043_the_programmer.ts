/**
 * s1_char_043 — The Programmer
 *
 * Legendary unit · Antiquarian faction · 8 cost · 11/11
 * Keywords: evolve, overcharge
 *
 * Oracle text (from season1-cards.json):
 *   "After 4 kills, gains +2/+2 and a new keyword.
 *    Deals +4 damage on first attack, then takes 3 self-damage."
 *
 * Design interpretation:
 *   "a new keyword" resolves to **Celerity**. Rationale: The Programmer
 *   is the visionary creator of Logos — celerity (attacking twice per
 *   turn) represents the exponential speed at which his creations iterate
 *   and improve, echoing the recursive nature of code.
 *
 * Mechanical model:
 *  - Overcharge: `first_attack_bonus` counter starts at 1 on deploy.
 *    On first damage dealt, deal 4 bonus damage to the target, then deal
 *    3 damage to self, then zero out the counter.
 *  - Evolve: `programmer_kills` counter ticks on each kill. At 3 (spec
 *    says evolve at 3), the unit gains +2/+2 and celerity permanently,
 *    then the counter resets.
 *
 * Golden tests: test/cards/antiquarian/s1_char_043_the_programmer.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_043" as CardDefinition["id"],
  name: "The Programmer",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 11, health: 11 },
  keywords: [],
  abilities: [
    // --- Overcharge: arm the first-attack bonus counter ---
    {
      id: "prog_arm_overcharge" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "first_attack_bonus",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Overcharge: fire on first attack ---
    {
      id: "prog_overcharge_fire" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      condition: {
        kind: "counter_gte",
        counter: "first_attack_bonus",
        value: 1,
      },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "deal_damage",
            amount: { kind: "const", value: 4 },
            to: { kind: "trigger_victim" },
          },
          {
            op: "deal_damage",
            amount: { kind: "const", value: 3 },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "first_attack_bonus",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
    // --- Evolve: tick kill counter ---
    {
      id: "prog_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "programmer_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: at 3 kills, gain +2/+2 and celerity ---
    {
      id: "prog_evolve_at_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "programmer_kills",
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
            kind: "programmer_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/001_the_programmer_00494c37.png",
  flavorText:
    "A. The Programmer was a visionary scientist and philosopher whose intellectual curiosity led to the creation of Logos , ...",
  rulesVersion: "1.0.0",
};
