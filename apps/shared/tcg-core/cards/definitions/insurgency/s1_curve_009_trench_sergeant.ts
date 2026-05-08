/**
 * s1_curve_009 — Trench Sergeant
 *
 * Uncommon unit · Insurgency faction · 4 cost · 4/5
 *
 * audit/09.F4 cost-curve cadence. Insurgency's mid-curve
 * line officer — disciplined body that holds the row.
 *
 * 4/5 (=9) at cost 4 is on-curve (expected 9, tol ±20%).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_curve_009_trench_sergeant" as CardDefinition["id"],
  name: "Trench Sergeant",
  faction: "insurgency",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/s1_curve_009.webp"),
  flavorText:
    "The trench is the cell, written in dirt. Hold it. Hold it. The relief is coming. The relief is you.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "offensive"] as const,
  verdict_delta: 0,
};
