/**
 * s1_char_120 — Crystal Archive Guard
 *
 * Common unit · New Babylon faction · 2 cost · 2/3
 * Keywords: forcefield
 *
 * Oracle text:
 *   "The Crystal Archive must be protected. Absorbs the first
 *    damage instance each turn — shielded by crystalline lattice."
 *
 * Lore: The Crystal Archive is New Babylon's most sacred institution —
 * a repository of crystallized knowledge, contracts, and power
 * structures that defines the city-state's legal reality. The Guards
 * who protect it are equipped with forcefield generators derived from
 * the Archive's own crystal technology. The Witness notes that the
 * Archive contains records of every deal, every betrayal, and every
 * death sentence New Babylon has ever issued. Its guards know exactly
 * what they protect — and what it costs to fail.
 *
 * Mechanical model:
 *  - Forcefield: intrinsic keyword. Absorbs the first instance of
 *    damage taken each turn. A cheap defensive unit with built-in
 *    survivability.
 *
 * Golden tests: test/cards/new_babylon/s1_char_120_crystal_archive_guard.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_120" as CardDefinition["id"],
  name: "Crystal Archive Guard",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["forcefield"],
  abilities: [],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/120_crystal_archive_guard.png",
  flavorText:
    "The crystal remembers every blow it absorbs. The guard does not need to.",
  rulesVersion: "1.0.0",
};
