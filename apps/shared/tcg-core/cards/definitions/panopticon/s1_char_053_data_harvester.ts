/**
 * s1_char_053 — Data Harvester
 *
 * Uncommon unit · Panopticon faction · 4 cost · 4/5
 * Keywords: drain
 *
 * Extracts vital information — and vital energy — from targets.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_053" as CardDefinition["id"],
  name: "Data Harvester",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: ["drain"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "It does not ask questions. It parses screams for keywords.",
  rulesVersion: "1.0.0",
};
