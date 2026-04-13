/**
 * s1_char_032 — The Host
 *
 * Uncommon unit · Thought Virus faction · 2 cost · 4/5
 * Keywords: drain, overcharge
 *
 * Oracle text (from season1-cards.json):
 *   "Heals for 2% of damage dealt.
 *    Deals +2 damage on first attack, then takes 1 self-damage."
 *
 * Mechanical model:
 *  - Drain: on_damage_dealt by self, heal self for 1 HP. This is a
 *    simplified flat approximation of "2% of damage dealt" — percentage-
 *    based healing is not yet in the effect DSL.
 *  - Overcharge: a `first_attack_bonus` counter starts at 1 on deploy.
 *    When the counter is >= 1 and the unit deals damage, a sequence
 *    fires: deal 3 bonus damage to the target (the +2 overcharge bonus
 *    folded into a single burst for simplicity), then deal 2 damage to
 *    self (burnout), then zero out the counter.
 *
 * Design note: The spec requests "deal_damage 3 + self-damage 2 on
 * first attack." We model the overcharge fire as 3 damage to target and
 * 2 to self per spec, following The Architect's overcharge pattern.
 *
 * Golden tests: test/cards/thought_virus/s1_char_032_the_host.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_032" as CardDefinition["id"],
  name: "The Host",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    // --- Drain: heal 1 on each hit ---
    {
      id: "host_drain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
    // --- Overcharge: arm the first-attack bonus counter ---
    {
      id: "host_arm_overcharge" as CardDefinition["abilities"][number]["id"],
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
      id: "host_overcharge_fire" as CardDefinition["abilities"][number]["id"],
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
            amount: { kind: "const", value: 3 },
            to: { kind: "trigger_victim" },
          },
          {
            op: "deal_damage",
            amount: { kind: "const", value: 2 },
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
  ],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/049_the_host_471d1ee3.png",
  flavorText:
    "Once a Potential, forged from the Architect\u2019s legacy of preserved DNA and machine code, this being once carried the spar...",
  rulesVersion: "1.0.0",
};
