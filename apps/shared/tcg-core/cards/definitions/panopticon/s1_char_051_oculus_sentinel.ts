/**
 * s1_char_051 — Oculus Sentinel
 *
 * Common unit · Panopticon faction · 2 cost · 2/3
 * Keywords: ranged
 *
 * A low-cost surveillance drone that picks off threats from afar.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_051" as CardDefinition["id"],
  name: "Oculus Sentinel",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["ranged"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "Its glass eye never blinks. Its memory never falters. It was built to watch — and to remember.",
  rulesVersion: "1.0.0",
};
