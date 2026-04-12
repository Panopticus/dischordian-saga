/**
 * s1_char_079 — Citadel Guardian
 *
 * Common unit · New Babylon faction · 3 cost · 3/4
 * Keywords: provoke
 *
 * A stalwart defender of New Babylon's inner walls.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_079" as CardDefinition["id"],
  name: "Citadel Guardian",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["provoke"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "The walls of New Babylon have never been breached. The guardians intend to keep it that way.",
  rulesVersion: "1.0.0",
};
