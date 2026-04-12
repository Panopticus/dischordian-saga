/**
 * s1_char_075 — Plague Herald
 *
 * Rare unit · Thought Virus faction · 4 cost · 4/5
 * Keywords: overcharge, drain
 *
 * A corrupted prophet whose first strike carries devastating viral payload.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_075" as CardDefinition["id"],
  name: "Plague Herald",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: ["overcharge", "drain"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "His sermons are not metaphors. Every word is a live pathogen.",
  rulesVersion: "1.0.0",
};
