/**
 * s1_char_083 — Propaganda Herald
 *
 * Common unit · New Babylon faction · 2 cost · 2/3
 * Keywords: rally_buff
 *
 * A state-sanctioned speaker who bolsters morale through carefully
 * crafted messaging.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_083" as CardDefinition["id"],
  name: "Propaganda Herald",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["rally_buff"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "The truth is whatever the Spire says it is. He just makes it rhyme.",
  rulesVersion: "1.0.0",
};
