/**
 * s1_char_006 — Dr. Lyra Vox
 *
 * Uncommon unit · Architect faction · 3 cost · 5/6
 * Keywords: evolve (modeled as a kill-counter evolution path)
 *
 * Oracle text (from season1-cards.json):
 *   "After 2 kills, gains +2/+2 and a new keyword."
 *
 * Ambiguity resolution:
 *   "a new keyword" resolves to **Celerity**. Rationale: Dr. Lyra Vox
 *   was a brilliant scientist renowned for rapid breakthroughs; celerity
 *   — two actions per turn — captures the relentless pace of discovery.
 *
 * Mechanical model:
 *  - `vox_kills` counter ticks up on every unit kill. When it hits 2,
 *    the evolve ability fires: a permanent +2/+2 stat buff plus the
 *    Celerity keyword, and the counter resets.
 *
 * Golden tests: test/cards/architect/s1_char_006_dr_lyra_vox.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_006" as CardDefinition["id"],
  name: "Dr. Lyra Vox",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 5, health: 6 },
  keywords: [],
  abilities: [
    // --- Seed the kill counter on deploy ---
    {
      id: "dlv_seed_kills" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "vox_kills",
        amount: 0,
        to: { kind: "self" },
      },
    },
    // --- Tick the kill counter on every kill ---
    {
      id: "dlv_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "vox_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve at 2 kills: +2/+2 + Celerity ---
    {
      id: "dlv_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "vox_kills",
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
          // Reset the counter so the next 2 kills re-trigger evolve.
          {
            op: "add_counter",
            kind: "vox_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/051_dr_lyra_vox_7601beb0.png",
  flavorText:
    "A brilliant scientist and a key figure within the AI Empire, renowned for her groundbreaking work in neural interface technology.",
  rulesVersion: "1.0.0",
};
