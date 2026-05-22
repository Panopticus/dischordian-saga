/**
 * Race Cards — Quarchon (3 cards). Phase C10.
 *
 * Quarchon are the Architect's crystalline engineered race —
 * silicon-based, patient, dense with lattice-structure memory.
 * Mechanical vocabulary: forcefield, grow, provoke. Defensive
 * and incremental.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const quarchon_01: CardDefinition = {
  id: "s1_race_quarchon_01" as CardDefinition["id"],
  name: "Quarchon Latticework",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 1, health: 4 },
  keywords: ["forcefield"],
  abilities: [],
  art: assetUrl("art/cards/race/quarchon_latticework.webp"),
  flavorText:
    "Forcefield. A quarchon begins life as a lattice of intentions the Architect has not yet committed to. The forcefield is what he still reserves the right to.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const quarchon_02: CardDefinition = {
  id: "s1_race_quarchon_02" as CardDefinition["id"],
  name: "Quarchon Archivist",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 5 },
  keywords: ["provoke", "grow"],
  abilities: [],
  art: assetUrl("art/cards/race/quarchon_archivist.webp"),
  flavorText:
    "Provoke. Grow. Quarchon archivists remember by becoming denser. The older one is, the more it weighs, and the more room it takes up in any conversation that thinks it has finished.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const quarchon_03: CardDefinition = {
  id: "s1_race_quarchon_03" as CardDefinition["id"],
  name: "The Crystal Senator",
  faction: "architect",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 4, health: 10 },
  keywords: ["provoke", "forcefield", "grow"],
  abilities: [],
  art: assetUrl("art/cards/race/quarchon_crystal_senator.webp"),
  flavorText:
    "Provoke. Forcefield. Grow. Ten health, growing. The Crystal Senator is the Architect's only quarchon diplomat. He has been in session for 4,700 years. He has not yet finished his opening remarks.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const QUARCHON_RACE_CARDS: readonly CardDefinition[] = Object.freeze([
  quarchon_01, quarchon_02, quarchon_03,
]);
