/**
 * s1_char_033 — The Human
 *
 * Epic unit · New Babylon faction · 5 cost · 8/8
 * Keywords: evolve, rally
 *
 * Oracle text (from season1-cards.json):
 *   "After 3 kills, gains +2/+2 and a new keyword.
 *    Adjacent allies gain +3 ATK this turn."
 *
 * Ambiguity resolution:
 *   "a new keyword" is resolved to **Celerity**. Rationale: The Human is
 *   an epic assassin who has served the Architect for centuries — two
 *   attacks per turn represents his preternatural speed and combat
 *   mastery. Combined with the rally buff, Celerity makes him a
 *   devastating late-game threat.
 *
 * Mechanical model:
 *  - Evolve: `human_kills` counter ticks up per kill. At 3, evolve
 *    fires: permanent +2/+2 plus Celerity, counter resets.
 *  - Rally: on deploy, self receives a +3/0 stat buff for the current
 *    turn (`this_turn` duration).
 *
 * Golden tests: test/cards/new_babylon/s1_char_033_the_human.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_033" as CardDefinition["id"],
  name: "The Human",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 6 },
  keywords: [],
  abilities: [
    // --- Rally: self-buff +3/0 this turn on deploy ---
    {
      id: "hum_rally_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 3, health: 0 },
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
    // --- Evolve: tick kill counter ---
    {
      id: "hum_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "human_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: at 3 kills → +2/+2 + celerity ---
    {
      id: "hum_evolve_at_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "human_kills",
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
            op: "reset_counter",
            counter: "human_kills",
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_033.webp"),
  flavorText:
    "After graduating from Mechronis Academy, he served for centuries as the Architect's most trusted agent, solving the univ...",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "narrative", "reactive"] as const,
  verdict_delta: 2,
};
