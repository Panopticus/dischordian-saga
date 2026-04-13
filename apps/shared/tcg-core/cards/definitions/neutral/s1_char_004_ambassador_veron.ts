/**
 * s1_char_004 — Ambassador Veron
 *
 * Uncommon unit · Neutral faction · 2 cost · 5/4
 * Keywords: evolve (modeled as a kill-counter evolution path)
 *
 * Oracle text (from season1-cards.json):
 *   "After 2 kills, gains +2/+2 and a new keyword."
 *
 * Ambiguity resolution:
 *   "a new keyword" resolves to **Rush**. Rationale: Veron is a covert
 *   operative posing as a diplomat; rush — acting immediately after
 *   transformation — captures the sudden-strike espionage flavor.
 *
 * Mechanical model:
 *  - `veron_kills` counter is seeded at 0 on deploy. Each unit kill
 *    increments the counter by 1.
 *  - When the counter reaches 2, the evolve ability fires: a permanent
 *    +2/+2 stat buff plus the Rush keyword, and the counter resets via
 *    negative overflow (engine clamps at 0 on read).
 *
 * Golden tests: test/cards/neutral/s1_char_004_ambassador_veron.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_004" as CardDefinition["id"],
  name: "Ambassador Veron",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: [],
  abilities: [
    // --- Seed the kill counter on deploy ---
    {
      id: "av_seed_kills" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "veron_kills",
        amount: 0,
        to: { kind: "self" },
      },
    },
    // --- Tick the kill counter on every kill ---
    {
      id: "av_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "veron_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve at 2 kills: +2/+2 + Rush ---
    {
      id: "av_evolve_at_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "veron_kills",
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
            kind: "veron_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_char_004.webp",
  flavorText:
    "Posing as a diplomat from the neutral planet Thessolar, she utilized this cover to engage in diplomatic relations with various factions.",
  rulesVersion: "1.0.0",
};
