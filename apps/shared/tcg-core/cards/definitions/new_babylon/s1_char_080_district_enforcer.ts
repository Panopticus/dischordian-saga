/**
 * s1_char_080 — District Enforcer
 *
 * Common unit · New Babylon faction · 2 cost · 3/2
 * Keywords: rush
 *
 * A fast-response unit deployed to quell unrest in the outer districts.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_080" as CardDefinition["id"],
  name: "District Enforcer",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: ["rush"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "Justice in New Babylon is swift. Appeals are slower — by design.",
  rulesVersion: "1.0.0",
};
