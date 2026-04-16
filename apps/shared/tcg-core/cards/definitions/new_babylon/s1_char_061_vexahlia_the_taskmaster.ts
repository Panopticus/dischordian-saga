/**
 * s1_char_061 — Vex'Ahlia the Taskmaster
 *
 * Legendary unit · New Babylon faction · 8 cost · 12/10
 * Keywords: fury
 *
 * Oracle text (from season1-cards.json):
 *   "Six-Armed Assault: Attacks 3 times per turn at reduced power (4 each).
 *    Each hit has a 30% chance to stun."
 *
 * Design interpretation:
 *   The spec simplifies the stun mechanic: instead of modeling a 30%
 *   probability (which would require RNG in the effect DSL), every hit
 *   applies stun to the target. This makes the card deterministic for
 *   testing and balances out during playtesting. The multiattack keyword
 *   from the JSON is not in the spec scope — fury alone captures the
 *   "relentless attacker" fantasy.
 *
 * Mechanical model:
 *  - Fury: intrinsic keyword marker (engine grants +N ATK as the unit
 *    takes damage — standard fury semantics).
 *  - On damage dealt by self, apply stun to the target via the `stun`
 *    op. This fires on every hit, simplifying the 30% chance.
 *
 * Golden tests: test/cards/new_babylon/s1_char_061_vexahlia_the_taskmaster.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_061" as CardDefinition["id"],
  name: "Vex'Ahlia the Taskmaster",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 12, health: 10 },
  keywords: ["fury"],
  abilities: [
    // --- Stun on every hit (simplified 30% chance) ---
    {
      id: "vex_stun_on_hit" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "stun",
        duration: { kind: "n_turns", n: 1 },
        to: { kind: "trigger_victim" },
      },
    },
  ],
  art: "/art/cards/s1_char_061.webp",
  flavorText:
    "COO of the Hierarchy. Commands the Blood Weave's armies across 17 dimensions simultaneously with six tireless arms.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};
