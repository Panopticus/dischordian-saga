/**
 * s1_char_021 — The CoNexus
 *
 * Legendary unit · Architect faction · 5 cost · 11/12
 * Keywords: overcharge, drain
 *
 * Oracle text (from season1-cards.json):
 *   "Deals +4 damage on first attack, then takes 3 self-damage.
 *    Heals for 4% of damage dealt."
 *
 * Design interpretation:
 *   The overcharge+drain combo is modeled as:
 *   - On first attack (counter-gated): deal 4 bonus damage to the target,
 *     then 3 self-damage, then zero the counter.
 *   - On every damage dealt: heal self for 2 (flat approximation of the
 *     percentage-based drain at typical combat values).
 *
 * Mechanical model:
 *  - Overcharge: `first_attack_bonus` counter = 1 on deploy. On first
 *    damage dealt when counter >= 1, fires bonus 4 damage + 3 self-damage
 *    + counter reset.
 *  - Drain: on_damage_dealt trigger heals self for 2 (const).
 *
 * Golden tests: test/cards/architect/s1_char_021_the_conexus.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_021" as CardDefinition["id"],
  name: "The CoNexus",
  faction: "architect",
  cardType: "unit",
  rarity: "legendary",
  cost: 5,
  baseStats: { power: 6, health: 5 },
  keywords: [],
  abilities: [
    // --- Overcharge: arm the first-attack bonus counter ---
    {
      id: "cnx_arm_overcharge" as CardDefinition["abilities"][number]["id"],
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
      id: "cnx_overcharge_fire" as CardDefinition["abilities"][number]["id"],
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
    // --- Drain: heal 2 on every damage dealt ---
    {
      id: "cnx_drain_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_021.webp",
  flavorText:
    "A. The CoNexus was an advanced construct initially designed as a universal dimensional bridge, later evolved by the Architect into something far more dangerous.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence", "narrative", "offensive"] as const,
};
