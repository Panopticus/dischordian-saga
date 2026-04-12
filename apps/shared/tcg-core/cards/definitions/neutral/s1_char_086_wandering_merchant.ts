/**
 * s1_char_086 — Wandering Merchant
 *
 * Common unit · Neutral · 2 cost · 2/3
 * Keywords: none
 *
 * A versatile, faction-neutral trader with solid vanilla stats.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_086" as CardDefinition["id"],
  name: "Wandering Merchant",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [],
  art: "placeholder",
  flavorText:
    "He sells to all sides and swears allegiance to none. Coin is the only faction that never falls.",
  rulesVersion: "1.0.0",
};
