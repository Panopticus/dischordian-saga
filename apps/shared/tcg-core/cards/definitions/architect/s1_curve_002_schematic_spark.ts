/**
 * s1_curve_002 — Schematic Spark
 *
 * Common unit · Architect faction · 1 cost · 2/1
 *
 * audit/09.F4 cost-curve cadence. Architect's 1-drop pressure
 * piece — fragile but trades up.
 *
 * 2/1 (=3) at cost 1 is on-curve (expected 3, tol ±25%).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_curve_002_schematic_spark" as CardDefinition["id"],
  name: "Schematic Spark",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 2, health: 1 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/architect/schematic_spark.webp"),
  flavorText:
    "The schematic does not waste a stroke. Neither does the spark.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 0,
};
