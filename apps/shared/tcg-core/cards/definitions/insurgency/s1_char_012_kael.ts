/**
 * s1_char_012 — Kael
 *
 * Rare unit · Insurgency faction · 5 cost · 7/7
 * Keywords: drain, evolve (modeled as a kill-counter evolution path)
 *
 * Oracle text (from season1-cards.json):
 *   "After 2 kills, gains +2/+2 and a new keyword. Heals for 2% of
 *    damage dealt."
 *
 * Ambiguity resolution:
 *   "a new keyword" resolves to **Rush**. Rationale: Kael was a prominent
 *   Insurgency leader celebrated for strategic genius and decisive action;
 *   rush — acting immediately — captures the relentless offensive tempo.
 *
 * Mechanical model:
 *  - Evolve: `kael_kills` counter ticks up on every unit kill. When it
 *    hits 2, the evolve ability fires: a permanent +2/+2 stat buff plus
 *    the Rush keyword, and the counter resets.
 *  - Drain: simplified to a permanent +0/+1 buff on self whenever Kael
 *    deals damage. This approximates lifesteal as incremental health
 *    growth without requiring a dedicated heal-on-damage pipeline.
 *
 * Golden tests: test/cards/insurgency/s1_char_012_kael.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_012" as CardDefinition["id"],
  name: "Kael",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 5, health: 5 },
  keywords: ["drain"],
  abilities: [
    // --- Seed the kill counter on deploy ---
    {
      id: "ka_seed_kills" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "kael_kills",
        amount: 0,
        to: { kind: "self" },
      },
    },
    // --- Tick the kill counter on every kill ---
    {
      id: "ka_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "kael_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve at 2 kills: +2/+2 + Rush ---
    {
      id: "ka_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "kael_kills",
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
          // Reset the counter so the next 2 kills re-trigger evolve.
          {
            op: "add_counter",
            kind: "kael_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
    // --- Drain: +0/+1 permanent buff on self when dealing damage ---
    {
      id: "ka_drain_on_hit" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_012.webp"),
  flavorText:
    "A prominent leader within the Insurgency, celebrated for his strategic genius and alliances with figures like Agent Zero and The Iron Lion.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "reactive"] as const,
  verdict_delta: 1,
};
