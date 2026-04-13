/**
 * s1_char_023 — The Degen
 *
 * Rare unit · Dreamer faction · 5 cost · 4/6
 * Keywords: overcharge, pierce
 *
 * Oracle text (from season1-cards.json):
 *   "Deals +2 damage on first attack, then takes 1 self-damage.
 *    Ignores 2 points of enemy armor."
 *
 * Design interpretation:
 *   The spec normalizes the overcharge bonus to deal 3 bonus damage on
 *   first attack (following the overcharge counter pattern). Pierce is
 *   modeled as a permanent passive `ignore_armor_3` aura (the engine's
 *   only armor-pierce keyword tier).
 *
 * Mechanical model:
 *  - Overcharge: `first_attack_bonus` counter = 1 on deploy. On first
 *    damage dealt when counter >= 1, fires bonus 3 damage + 1 self-damage
 *    + counter reset.
 *  - Pierce: permanent passive_aura granting `ignore_armor_3` to self.
 *
 * Golden tests: test/cards/dreamer/s1_char_023_the_degen.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_023" as CardDefinition["id"],
  name: "The Degen",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: [],
  abilities: [
    // --- Overcharge: arm the first-attack bonus counter ---
    {
      id: "degen_arm_overcharge" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "first_attack_bonus",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Overcharge: fire on first attack (bonus 3 damage + 1 self-damage) ---
    {
      id: "degen_overcharge_fire" as CardDefinition["abilities"][number]["id"],
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
            amount: { kind: "const", value: 1 },
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
    // --- Pierce: passive ignore_armor_3 ---
    {
      id: "degen_pierce_passive" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "passive_aura", range: { kind: "self" } },
      effect: {
        op: "grant_keyword",
        keyword: "ignore_armor_3",
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_023.webp",
  flavorText:
    "Ne-Yon #8. The casino host pours your drink with hands that have shuffled the fates of civilizations. Through entropy and corruption, the Degen creates conditions in which the Ne-Yons can flourish.",
  rulesVersion: "1.0.0",
};
