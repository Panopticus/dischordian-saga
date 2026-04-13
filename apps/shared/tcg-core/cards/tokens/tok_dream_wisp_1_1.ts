/**
 * tok_dream_wisp_1_1 — Dream Wisp
 *
 * Token · Dreamer faction · 0 cost · 1/1
 *
 * Summoned by Dream Weave. Fragments of unrealized thought given
 * fleeting form in the waking world.
 */
import type { CardDefinition } from "../../index";

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
  art: "/art/cards/tok_dream_wisp_1_1.webp",
  flavorText:
    "Born between thoughts, gone before the next.",
  rulesVersion: "1.0.0",
};
