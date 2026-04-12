/**
 * s1_char_102 — Arena Enforcer
 *
 * Common unit · Architect faction · 3 cost · 2/4
 * Keywords: provoke
 *
 * Oracle text:
 *   "Enemies must attack this unit. The rotation enforcers keep
 *    the Arena's cycle turning — no one escapes the schedule."
 *
 * Lore: The Arena Enforcers maintain the Architect's rotation protocol,
 * ensuring every citizen takes their turn in the Arena. They are the
 * living embodiment of the Dischordian Cycle's cruelest mechanic —
 * mandatory participation in the games of survival.
 *
 * Mechanical model:
 *  - Provoke: adjacent enemies must attack this unit. Intrinsic keyword,
 *    no additional abilities needed.
 *
 * Golden tests: test/cards/architect/s1_char_102_arena_enforcer.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_102" as CardDefinition["id"],
  name: "Arena Enforcer",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: ["provoke"],
  abilities: [],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/102_arena_enforcer.png",
  flavorText:
    "Your rotation has arrived. There is no deferral. There is no appeal. Step into the Arena.",
  rulesVersion: "1.0.0",
};
