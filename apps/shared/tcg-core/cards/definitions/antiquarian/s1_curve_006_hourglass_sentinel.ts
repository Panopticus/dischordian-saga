/**
 * s1_curve_006 — Hourglass Sentinel
 *
 * Uncommon unit · Antiquarian faction · 4 cost · 3/6
 *
 * audit/09.F4 cost-curve cadence. Cost-4 share of the
 * active pool was 9.8%; this is one of five cost-4 prints
 * pushing toward the curve's expected ~15-20% mass.
 *
 * 3/6 (=9) at cost 4 is on-curve (expected 9, tol ±20%).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_curve_006_hourglass_sentinel" as CardDefinition["id"],
  name: "Hourglass Sentinel",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 3, health: 6 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/antiquarian/hourglass_sentinel.webp"),
  flavorText:
    "The grain falls at the rate the room agrees to. The Sentinel does not negotiate.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 0,
};
