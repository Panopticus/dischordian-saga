/**
 * s1_pack_005 — Cell Runner
 *
 * Common unit · Insurgency faction · 2 cost · 1/2
 *
 * audit/09.F3 expansion. Pack previously had only Wolfpack
 * Initiate. Insurgency's pack variant: cells multiply through
 * presence; one runner is a yelp, two is a signal, four is a
 * front line.
 *
 * pack = +1 power per other ally with the same defId on the
 * same side (engine/combat.ts:packBonus). Sub-curve solo;
 * snowballs with multiples.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_pack_005_cell_runner" as CardDefinition["id"],
  name: "Cell Runner",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 2 },
  keywords: ["pack"],
  abilities: [],
  art: assetUrl("art/cards/s1_pack_005.webp"),
  flavorText:
    "Compliance is the slowest violence. We move faster, in groups, in the dark.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Pack snowball: 1/2 solo is sub-curve at cost 2 (expected 5); reaches curve at 2 copies, exceeds it at 4. Mirrors s1_neutral_pack_001 design.",
    reviewer: "audit-09.F3",
  },
};
