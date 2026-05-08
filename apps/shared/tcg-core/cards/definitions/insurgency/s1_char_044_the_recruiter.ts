/**
 * s1_char_044 — The Recruiter
 *
 * Rare unit · Insurgency faction · 4 cost · 5/9
 * Keywords: rally
 *
 * Oracle text (from season1-cards.json):
 *   "Adjacent allies gain +2 ATK this turn."
 *
 * Design interpretation:
 *   The spec simplifies rally to a self-buff of +3/0 this turn on deploy,
 *   consistent with the rally keyword pattern used across the engine
 *   (see Iron Lion s1_char_010, The Architect s1_char_019).
 *
 * Mechanical model:
 *  - Rally: on deploy, buff self +3/0 for `this_turn` duration. The
 *    engine's rally resolver applies this as a temporary power boost.
 *
 * Golden tests: test/cards/insurgency/s1_char_044_the_recruiter.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_044" as CardDefinition["id"],
  name: "The Recruiter",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: [],
  abilities: [
    // --- Rally: self-buff +3/0 on deploy for this turn ---
    {
      id: "rec_rally_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 3, health: 0 },
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_044.webp"),
  flavorText:
    "Initially, he applied his powers to benefit the Empire, enrolling at the Academy and swiftly rising in influence. Yet, w...",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
