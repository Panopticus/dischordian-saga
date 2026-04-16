/**
 * s1_char_025 — The Dreamer
 *
 * Epic unit · Dreamer faction · 4 cost · 6/10
 * Keywords: shield, evolve
 *
 * Oracle text (from season1-cards.json):
 *   "Absorbs the first 3 damage taken.
 *    After 3 kills, gains +2/+2 and a new keyword."
 *
 * Ambiguity resolution:
 *   "A new keyword" is resolved to **Rush** (can attack the turn it is
 *   played). Rationale: the Dreamer's lore speaks of shaping futures and
 *   acting preemptively — rush captures that "strike before the enemy
 *   reacts" fantasy. The Antiquarian gets Celerity; giving the Dreamer
 *   Rush ensures keyword diversity among evolve units.
 *
 * Mechanical model:
 *  - Shield: `forcefield_charges` counter starts at 3 on deploy. The
 *    engine's damage pipeline decrements this counter before subtracting
 *    health (same as The Antiquarian but with 3 charges).
 *  - Evolve: `dreamer_kills` counter ticks on each kill. At 3, the
 *    evolve fires: permanent +2/+2 buff plus the Rush keyword. Counter
 *    resets to allow re-triggering every 3 kills.
 *
 * Golden tests: test/cards/dreamer/s1_char_025_the_dreamer.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_025" as CardDefinition["id"],
  name: "The Dreamer",
  faction: "dreamer",
  cardType: "unit",
  rarity: "epic",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: ["forcefield"],
  abilities: [
    // --- Shield: 3 forcefield charges on deploy ---
    {
      id: "drm_forcefield_3" as CardDefinition["abilities"][number]["id"],
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
      id: "drm_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "dreamer_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: fire at 3 kills ---
    {
      id: "drm_evolve_at_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "dreamer_kills",
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
            keyword: "rush",
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          // Reset the counter so the next 3 kills re-trigger evolve.
          {
            op: "add_counter",
            kind: "dreamer_kills",
            amount: -999,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_char_025.webp",
  flavorText:
    "Existing beyond time and space, the Dreamer shapes futures and scenarios that benefit the Ne-Yons. Aloof from galactic s...",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence", "narrative", "reactive"] as const,
  verdict_delta: 2,
};
