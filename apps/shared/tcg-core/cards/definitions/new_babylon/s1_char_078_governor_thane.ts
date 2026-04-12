/**
 * s1_char_078 — Governor Thane
 *
 * Legendary unit · New Babylon faction · 8 cost · 9/10
 * Keywords: provoke, forcefield
 *
 * The iron-fisted governor of New Babylon's outer districts,
 * an immovable bulwark of authoritarian order.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_078" as CardDefinition["id"],
  name: "Governor Thane",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 9, health: 10 },
  keywords: ["provoke", "forcefield"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "He did not rise to power. He built the staircase and burned every other way up.",
  rulesVersion: "1.0.0",
};
