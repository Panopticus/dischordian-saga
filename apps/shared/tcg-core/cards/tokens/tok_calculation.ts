/**
 * tok_calculation — Calculation
 *
 * Token · Architect faction · 0 cost · 1/1
 *
 * Summoned by The Architect's Bloodborn Spell "Predetermined Design".
 * A fragment of the Architect's computational grid made manifest —
 * every possible outcome pre-calculated, every probability collapsed
 * into a single deterministic point.
 */
import type { CardDefinition } from "../../index";

export const cardDef: CardDefinition = {
  id: "tok_calculation" as CardDefinition["id"],
  name: "Calculation",
  faction: "architect",
  cardType: "unit",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 1, health: 1 },
  keywords: [],
  abilities: [],
  art: "/art/cards/tok_calculation.webp",
  flavorText:
    "A sliver of the Arena's schematic given form. It computes, therefore it is.",
  rulesVersion: "1.0.0",
};
