/**
 * s1_char_054 — Panoptic Drone
 *
 * Common unit · Panopticon faction · 1 cost · 1/2
 * Keywords: flying
 *
 * The cheapest Panopticon unit — a tiny aerial scout.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_054" as CardDefinition["id"],
  name: "Panoptic Drone",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 2 },
  keywords: ["flying"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "A speck against the grey sky — but it sees everything beneath it.",
  rulesVersion: "1.0.0",
};
