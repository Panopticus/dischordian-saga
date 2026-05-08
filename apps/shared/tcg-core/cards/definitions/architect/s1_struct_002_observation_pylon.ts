/**
 * s1_struct_002 — Observation Pylon
 *
 * Uncommon structure · Architect faction · 4 cost · 2/10
 *
 * audit/09.F3 expansion. Structure had only one card before
 * (s1_neutral_struct_001 The Anchor of Kael). Architect's structure
 * variant is the panopticon-pylon: doesn't move, doesn't attack;
 * exists to watch.
 *
 * Stats follow the structure design pattern (over-curve HP, low
 * power, no movement). The keyword is read by engine/combat.ts
 * (which already exempts structures from movement/attack actions).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_struct_002_observation_pylon" as CardDefinition["id"],
  name: "Observation Pylon",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 2, health: 10 },
  keywords: ["structure"],
  abilities: [],
  art: assetUrl("art/cards/s1_struct_002.webp"),
  flavorText:
    "Geometry knows what flesh forgets. The pylon does not blink.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Structure tank: cannot move or attack (structure keyword). +33% printed-vs-curve stats reflect that structures pay the entire stat budget into HP. Mirrors s1_neutral_struct_001's design.",
    reviewer: "audit-09.F3",
  },
};
