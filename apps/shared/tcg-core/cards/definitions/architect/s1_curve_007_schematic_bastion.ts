/**
 * s1_curve_007 — Schematic Bastion
 *
 * Uncommon unit · Architect faction · 4 cost · 4/5
 *
 * audit/09.F4 cost-curve cadence. Architect's mid-curve
 * stat-stick — a clean blueprint with no fancy text.
 *
 * 4/5 (=9) at cost 4 is on-curve (expected 9, tol ±20%).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_curve_007_schematic_bastion" as CardDefinition["id"],
  name: "Schematic Bastion",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/s1_curve_007.webp"),
  flavorText:
    "The plan is complete. The bastion is the plan. No further iteration is required.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "offensive"] as const,
  verdict_delta: 0,
};
