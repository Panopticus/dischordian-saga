/**
 * s1_char_065 — Age-Ender
 *
 * Epic unit · Antiquarian faction · 6 cost · 7/7
 * Keywords: pierce, forcefield
 *
 * A cataclysmic entity summoned to close an era by force.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_065" as CardDefinition["id"],
  name: "Age-Ender",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 7, health: 7 },
  keywords: ["pierce", "forcefield"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "It does not destroy civilizations. It simply marks where one ends and silence begins.",
  rulesVersion: "1.0.0",
};
