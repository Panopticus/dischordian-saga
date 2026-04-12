/**
 * s1_char_087 — Scrapyard Golem
 *
 * Common unit · Neutral · 4 cost · 5/4
 * Keywords: provoke
 *
 * A hulking construct assembled from battlefield debris.
 * Cheap provoke body for any deck that needs a wall.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_087" as CardDefinition["id"],
  name: "Scrapyard Golem",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 4,
  baseStats: { power: 5, health: 4 },
  keywords: ["provoke"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "It was built from the wreckage of a dozen machines, none of which were designed to kill. It learned that part on its own.",
  rulesVersion: "1.0.0",
};
