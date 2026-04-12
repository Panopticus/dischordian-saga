/**
 * s1_char_059 — Chronosplicer
 *
 * Rare unit · Antiquarian faction · 5 cost · 5/6
 * Keywords: celerity
 *
 * A temporal operative that fractures moments, attacking twice per turn.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_059" as CardDefinition["id"],
  name: "Chronosplicer",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 5, health: 6 },
  keywords: ["celerity"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "She cuts time the way a surgeon cuts flesh — precisely, and without remorse.",
  rulesVersion: "1.0.0",
};
