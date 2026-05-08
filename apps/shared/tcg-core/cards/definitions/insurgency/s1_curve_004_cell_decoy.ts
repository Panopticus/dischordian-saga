/**
 * s1_curve_004 — Cell Decoy
 *
 * Common unit · Insurgency faction · 1 cost · 1/2
 *
 * audit/09.F4 cost-curve cadence. Insurgency's 1-drop —
 * a quiet body that draws the wrong eye.
 *
 * 1/2 (=3) at cost 1 is on-curve (expected 3, tol ±25%).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_curve_004_cell_decoy" as CardDefinition["id"],
  name: "Cell Decoy",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 2 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/s1_curve_004.webp"),
  flavorText:
    "She walks the route the auditors expect. The actual cell walks the other route.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 0,
};
