/**
 * s1_char_045 — The Resurrectionist
 *
 * Rare unit · Dreamer faction · 5 cost · 5/8
 * Keywords: resurrect, drain
 *
 * Oracle text (from season1-cards.json):
 *   "Returns to the field with 2 HP after first death.
 *    Heals for 2% of damage dealt."
 *
 * Mechanical model:
 *  - Same pattern as The Necromancer (s1_char_039) but weaker numbers:
 *    resurrect at 2 HP instead of 3, and drain heals 1 HP per hit
 *    (simplified flat value for the 2% percentage).
 *  - Resurrect: on_death, if `resurrect_used` counter < 1, add the
 *    counter and buff health to 2.
 *  - Drain: on_damage_dealt by self, heal self for 1 HP.
 *
 * Golden tests: test/cards/dreamer/s1_char_045_the_resurrectionist.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_045" as CardDefinition["id"],
  name: "The Resurrectionist",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 5, health: 8 },
  keywords: [],
  abilities: [
    // --- Resurrect: come back once with 2 HP ---
    {
      id: "res_resurrect" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      condition: {
        kind: "counter_gte",
        counter: "resurrect_used",
        value: 0,
      },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "add_counter",
            kind: "resurrect_used",
            amount: 1,
            to: { kind: "self" },
          },
          {
            op: "buff",
            stats: { power: 0, health: 2 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
        ],
      },
    },
    // --- Drain: heal 1 on each hit ---
    {
      id: "res_drain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_045.webp"),
  flavorText:
    "By resurrecting key figures on both sides, they maintain a balance favorable to the Ne-Yons, ensuring no faction becomes...",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
};
