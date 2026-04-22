/**
 * tok_infected_2_2 — Infected
 *
 * Token · Thought Virus faction · 0 cost · 2/2
 *
 * Summoned by Assimilate. A body seized by the Thought Virus,
 * the former host's consciousness consumed and repurposed.
 */
import type { CardDefinition } from "../../index";

import { assetUrl } from "../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "tok_infected_2_2" as CardDefinition["id"],
  name: "Infected",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 2, health: 2 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/tok_infected_2_2.webp"),
  flavorText:
    "What was once a person is now a vessel. The Virus wears their face but not their name.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "offensive"] as const,
  verdict_delta: 1,
};
