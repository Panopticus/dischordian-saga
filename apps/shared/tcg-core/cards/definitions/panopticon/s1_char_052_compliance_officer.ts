/**
 * s1_char_052 — Compliance Officer
 *
 * Common unit · Panopticon faction · 3 cost · 3/4
 * Keywords: provoke
 *
 * A frontline enforcer that channels citizen obedience through fear.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_052" as CardDefinition["id"],
  name: "Compliance Officer",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["provoke"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "Obedience is not requested. It is extracted.",
  rulesVersion: "1.0.0",
};
