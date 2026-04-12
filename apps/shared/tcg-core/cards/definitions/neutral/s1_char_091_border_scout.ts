/**
 * s1_char_091 — Border Scout
 *
 * Common unit · Neutral · 2 cost · 2/2
 * Keywords: ranged, stealth
 *
 * A reconnaissance unit that hides at the edges of contested territory,
 * picking off targets from cover.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_091" as CardDefinition["id"],
  name: "Border Scout",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: ["ranged", "backstab"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "The borderlands belong to no faction — only to those quiet enough to survive them.",
  rulesVersion: "1.0.0",
};
