/**
 * s1_char_057 — Blacksite Interrogator
 *
 * Epic unit · Panopticon faction · 6 cost · 7/6
 * Keywords: pierce, stealth
 *
 * A high-value operative who emerges from hidden detention sites
 * to break through enemy defenses.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_057" as CardDefinition["id"],
  name: "Blacksite Interrogator",
  faction: "architect",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 7, health: 6 },
  keywords: ["pierce", "backstab"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "The detainees never see her face. The files say she doesn't have one.",
  rulesVersion: "1.0.0",
};
