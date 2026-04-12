/**
 * s1_char_090 — Hired Blade
 *
 * Uncommon unit · Neutral · 3 cost · 4/3
 * Keywords: rush
 *
 * A mercenary who fights for whoever pays, striking fast
 * and leaving faster.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_090" as CardDefinition["id"],
  name: "Hired Blade",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 4, health: 3 },
  keywords: ["rush"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "Loyalty is expensive. Disloyalty, more so.",
  rulesVersion: "1.0.0",
};
