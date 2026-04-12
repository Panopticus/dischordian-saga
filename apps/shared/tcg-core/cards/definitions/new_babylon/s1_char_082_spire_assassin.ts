/**
 * s1_char_082 — Spire Assassin
 *
 * Rare unit · New Babylon faction · 4 cost · 5/3
 * Keywords: stealth, pierce
 *
 * An elite operative dispatched from the upper spires to eliminate
 * threats to the regime.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_082" as CardDefinition["id"],
  name: "Spire Assassin",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 5, health: 3 },
  keywords: ["backstab", "pierce"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "She descends from the Spire like a verdict from on high — silent, precise, and final.",
  rulesVersion: "1.0.0",
};
