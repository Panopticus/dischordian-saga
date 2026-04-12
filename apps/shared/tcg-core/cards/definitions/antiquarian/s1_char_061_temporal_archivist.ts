/**
 * s1_char_097 — Temporal Archivist
 *
 * Uncommon unit · Antiquarian faction · 3 cost · 3/4
 * Keywords: evolve
 *
 * A scholar of forgotten eras who grows stronger with each battle witnessed.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_097" as CardDefinition["id"],
  name: "Temporal Archivist",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["grow"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "Every war she catalogues makes the next one easier to survive.",
  rulesVersion: "1.0.0",
};
