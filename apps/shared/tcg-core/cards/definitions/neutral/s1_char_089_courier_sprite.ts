/**
 * s1_char_089 — Courier Sprite
 *
 * Common unit · Neutral · 1 cost · 1/1
 * Keywords: flying, rush
 *
 * The cheapest neutral flyer — a tiny messenger that
 * delivers one quick strike.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_089" as CardDefinition["id"],
  name: "Courier Sprite",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 1 },
  keywords: ["flying", "rush"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "It carries messages no one else dares to deliver — and pays for it with its brief, bright life.",
  rulesVersion: "1.0.0",
};
