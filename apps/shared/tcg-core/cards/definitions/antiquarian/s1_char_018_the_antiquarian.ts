/**
 * s1_char_018 — The Antiquarian
 *
 * Legendary unit · Antiquarian faction · 5 cost · 12/11
 * Keywords: shield, evolve (both intrinsic; handled by the engine's
 *           forcefield-counter mechanic and a kill-counter evolution path)
 *
 * Oracle text (derived from Season 1 ability text + design interpretation):
 *   "Absorbs the first 4 points of damage taken.
 *    After killing 4 units, permanently gains +2/+2 and Celerity."
 *
 * Ambiguity resolution — from the source cards file (season1-cards.json):
 *   Raw text says "...gains +2/+2 and a new keyword." We resolve "a new
 *   keyword" to **Celerity**. Rationale: the Antiquarian is the neutral
 *   Timekeeper legendary, his lore is "walks between ages." Celerity —
 *   two attacks per turn — reads mechanically as "existing in multiple
 *   moments at once" and matches the evolve flavor. Recorded in
 *   docs/cards/s1_char_018.md (follow-up commit).
 *
 * Mechanical model:
 *  - `forcefield_charges` counter starts at 4 on deploy. The engine's
 *    damage pipeline decrements this counter before subtracting health
 *    (see damage.ts in the combat port).
 *  - `antiquarian_kills` counter ticks up on every unit the Antiquarian
 *    kills. When it hits 4, the evolve ability fires: a permanent +2/+2
 *    stat buff plus the Celerity keyword, and the counter resets.
 *  - The second `on_kill` ability is guarded by a `counter_gte` condition,
 *    so it only fires on the 4th, 8th, 12th... kill.
 *
 * Golden tests: test/cards/antiquarian/s1_char_018_the_antiquarian.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_018" as CardDefinition["id"],
  name: "The Antiquarian",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "legendary",
  cost: 5,
  baseStats: { power: 5, health: 6 },
  keywords: ["forcefield"],
  abilities: [
    {
      id: "ant_forcefield_4" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 4,
        to: { kind: "self" },
      },
    },
    {
      id: "ant_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "antiquarian_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    {
      id: "ant_evolve_at_4" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "antiquarian_kills",
        value: 4,
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
          // Reset the counter so the next 4 kills re-trigger evolve.
          // We go negative to zero-out whatever value the counter was at;
          // the engine clamps counters at 0 on read.
          {
            op: "reset_counter",
            counter: "antiquarian_kills",
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_018_the_antiquarian.webp"),
  flavorText:
    "Throughout the cataclysm and the epochs that followed, he retreated into a hidden pocket dimension — a refuge woven from stolen time.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence", "narrative", "reactive"] as const,
  verdict_delta: 2,
};
