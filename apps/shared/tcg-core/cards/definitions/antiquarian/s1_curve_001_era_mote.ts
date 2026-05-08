/**
 * s1_curve_001 — Era Mote
 *
 * Common unit · Antiquarian faction · 1 cost · 1/2
 *
 * audit/09.F4 cost-curve cadence. Cost-1 share of the active
 * pool was 2.7%; this is one of five cost-1 prints inflecting
 * toward a healthier deckbuilder curve.
 *
 * 1/2 (=3) at cost 1 is on-curve (expected 3, tol ±25%).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_curve_001_era_mote" as CardDefinition["id"],
  name: "Era Mote",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 2 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/s1_curve_001.webp"),
  flavorText:
    "Smaller than the period at the end of an era. Heavier than its name.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 0,
};
