/**
 * s1_char_070 — Patient Zero
 *
 * Legendary unit · Thought Virus faction · 7 cost · 8/9
 * Keywords: deathwatch, drain
 *
 * The original carrier of the Thought Virus — a walking plague
 * that feeds on death around it.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_070" as CardDefinition["id"],
  name: "Patient Zero",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 8, health: 9 },
  keywords: ["deathwatch", "drain"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "The first mind to crack open and let the signal through. Every infection since has been an echo of that original scream.",
  rulesVersion: "1.0.0",
};
