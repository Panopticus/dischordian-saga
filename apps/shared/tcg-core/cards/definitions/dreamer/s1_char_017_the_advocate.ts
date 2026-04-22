/**
 * s1_char_017 — The Advocate
 *
 * Rare unit · Dreamer faction · 4 cost · 7/5
 * Keywords: rally (shield), shield
 *
 * Oracle text (from season1-cards.json):
 *   "Adjacent allies gain +2 ATK this turn.
 *    Absorbs the first 2 damage taken."
 *
 * Design interpretation:
 *   The spec models the shield as 2 forcefield charges on deploy and the
 *   rally as a self-buff of +3/0 for this_turn (normalized to +3 for
 *   balance consistency). The Advocate is a Ne-Yon who established the
 *   Empire of Shadows — her forcefield reflects the Blood Weave barrier.
 *
 * Mechanical model:
 *  - On deploy: set `forcefield_charges` counter to 2 (absorbs first 2
 *    points of damage). Also apply a +3/0 self-buff lasting this_turn.
 *
 * Golden tests: test/cards/dreamer/s1_char_017_the_advocate.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_017" as CardDefinition["id"],
  name: "The Advocate",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["forcefield"],
  abilities: [
    // --- Shield: 2 forcefield charges on deploy ---
    {
      id: "adv_forcefield_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 2,
        to: { kind: "self" },
      },
    },
    // --- Rally: self-buff +3/0 this turn on deploy ---
    {
      id: "adv_rally_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 3, health: 0 },
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_017.webp"),
  flavorText:
    "Establishing the Empire of Shadows, she wielded the Blood Weave to reshape reality, battling the Hierarchy of the Damned.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence"] as const,
  verdict_delta: 1,
};
