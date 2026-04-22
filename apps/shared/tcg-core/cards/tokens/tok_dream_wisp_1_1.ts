/**
 * tok_dream_wisp_1_1 — Dream Wisp
 *
 * Token · Dreamer faction · 0 cost · 1/1
 *
 * Summoned by Dream Weave. Fragments of unrealized thought given
 * fleeting form in the waking world.
 */
import type { CardDefinition } from "../../index";

import { assetUrl } from "../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "tok_dream_wisp_1_1" as CardDefinition["id"],
  name: "Dream Wisp",
  faction: "dreamer",
  cardType: "unit",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 1, health: 1 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/tok_dream_wisp_1_1.webp"),
  flavorText:
    "Born between thoughts, gone before the next.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
