/**
 * token_wolf_2_2 — Wolf Token
 *
 * Basic token unit · Neutral · 0 cost · 2/2
 * No keywords, no abilities.
 *
 * Summoned by: Fenra the Moon Tyrant (s1_char_066) on deploy.
 * A vanilla 2/2 body with no special mechanics.
 */
import type { CardDefinition } from "../../index";

export const cardDef: CardDefinition = {
  id: "token_wolf_2_2" as CardDefinition["id"],
  name: "Wolf",
  faction: "neutral",
  cardType: "unit",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 2, health: 2 },
  keywords: [],
  abilities: [],
  art: "/art/cards/token_wolf_2_2.webp",
  flavorText: "A spectral wolf, bound by lunar magic to fight at its master's side.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};
