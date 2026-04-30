/**
 * token_crystal_senator_5_5 — Crystal Senator Token
 *
 * Basic token unit · New Babylon · 0 cost · 5/5
 * No keywords, no abilities.
 *
 * Summoned by: Senator Voss (s1_char_117) on deploy after sacrificing
 * a friendly unit. Represents the crystallized power of New Babylon's
 * Senate — a political body made literal.
 */
import type { CardDefinition } from "../../index";

import { assetUrl } from "../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "token_crystal_senator_5_5" as CardDefinition["id"],
  name: "Crystal Senator",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 5, health: 5 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/token_crystal_senator_5_5.webp"),
  flavorText:
    "In New Babylon, power is not metaphorical. It crystallizes. It votes. It kills.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};
