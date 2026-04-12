/**
 * s1_char_088 — Field Medic
 *
 * Uncommon unit · Neutral · 3 cost · 2/4
 * Keywords: drain
 *
 * A neutral healer who sustains herself and her allies
 * through battlefield triage.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_088" as CardDefinition["id"],
  name: "Field Medic",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: ["drain"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "She does not ask which side you fight for. Only where it hurts.",
  rulesVersion: "1.0.0",
};
