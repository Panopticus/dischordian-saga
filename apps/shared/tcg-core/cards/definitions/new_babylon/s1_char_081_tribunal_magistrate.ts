/**
 * s1_char_081 — Tribunal Magistrate
 *
 * Uncommon unit · New Babylon faction · 4 cost · 4/5
 * Keywords: shield
 *
 * A senior judge of the Tribunal who wields legal and literal armor.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_081" as CardDefinition["id"],
  name: "Tribunal Magistrate",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: ["forcefield"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "Her verdicts are absolute. Her sentences, irrevocable.",
  rulesVersion: "1.0.0",
};
