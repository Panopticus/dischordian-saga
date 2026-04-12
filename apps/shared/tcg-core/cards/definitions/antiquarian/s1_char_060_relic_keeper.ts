/**
 * s1_char_060 — Relic Keeper
 *
 * Common unit · Antiquarian faction · 2 cost · 2/3
 * Keywords: shield
 *
 * A custodian of ancient artifacts, shielded by the relics she guards.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_060" as CardDefinition["id"],
  name: "Relic Keeper",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["forcefield"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "The relics protect themselves. She merely gives them someone to protect.",
  rulesVersion: "1.0.0",
};
