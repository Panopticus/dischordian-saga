/**
 * s1_char_039 — The Necromancer
 *
 * Epic unit · Architect faction · 6 cost · 9/11
 * Keywords: resurrect, drain
 *
 * Oracle text (from season1-cards.json):
 *   "Returns to the field with 3 HP after first death.
 *    Heals for 3% of damage dealt."
 *
 * Mechanical model:
 *  - Resurrect: on_death, if the `resurrect_used` counter is < 1, the
 *    unit is returned to the field. Modeled as: add_counter resurrect_used
 *    +1 (to prevent re-triggering), then buff health so the unit sits at
 *    3 HP. The engine's death pipeline checks for on_death effects that
 *    set health > 0 to cancel removal from the board.
 *  - Drain: on_damage_dealt by self, heal self for a constant 1 HP.
 *    This is a simplified model of "3% of damage dealt" — percentage-based
 *    healing is not yet in the effect DSL, so we use a flat approximation.
 *
 * Golden tests: test/cards/architect/s1_char_039_the_necromancer.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_039" as CardDefinition["id"],
  name: "The Necromancer",
  faction: "architect",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 6, health: 8 },
  keywords: [],
  abilities: [
    // --- Resurrect: come back once with 3 HP ---
    {
      id: "necro_resurrect" as CardDefinition["abilities"][number]["id"],
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
            stats: { power: 0, health: 3 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
        ],
      },
    },
    // --- Drain: heal 1 on each hit ---
    {
      id: "necro_drain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_039.webp"),
  flavorText:
    "A. The Necromancer was the tenth Archon created by the Architect in Year 600 A.A., a dark elven magician with white s...",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: 2,
};
