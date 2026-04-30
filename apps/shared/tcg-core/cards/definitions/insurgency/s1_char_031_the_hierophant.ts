/**
 * s1_char_031 — The Hierophant
 *
 * Epic unit · Insurgency faction · 6 cost · 6/7
 * Keywords: rally, shield
 *
 * Oracle text (from season1-cards.json):
 *   "Adjacent allies gain +3 ATK this turn.
 *    Absorbs the first 3 damage taken."
 *
 * Mechanical model:
 *  - Shield: on deploy, 3 `forcefield_charges` are added. The engine's
 *    damage pipeline decrements this counter before subtracting health.
 *  - Rally: on deploy, self receives a +3/0 stat buff for the current
 *    turn (`this_turn` duration). The Iron Lion pattern is followed here
 *    — rally is modeled as a self-buff; the Duelyst engine applies the
 *    "adjacent allies" broadcast at the board level.
 *
 * Golden tests: test/cards/insurgency/s1_char_031_the_hierophant.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_031" as CardDefinition["id"],
  name: "The Hierophant",
  faction: "insurgency",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 6, health: 7 },
  keywords: ["forcefield"],
  abilities: [
    // --- Shield: 3 forcefield charges on deploy ---
    {
      id: "hiero_forcefield_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 3,
        to: { kind: "self" },
      },
    },
    // --- Rally: self-buff +3/0 this turn on deploy ---
    {
      id: "hiero_rally_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 3, health: 0 },
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_031.webp"),
  flavorText:
    "A. The Hierophant is the esteemed spiritual leader of Thaloria, a planet renowned for its rich history and deep-rooted t...",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence", "narrative"] as const,
  verdict_delta: 2,
};
