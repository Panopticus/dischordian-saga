/**
 * s1_curve_010 — Sector Magistrate
 *
 * Uncommon unit · New Babylon faction · 4 cost · 4/5
 *
 * audit/09.F4 cost-curve cadence. New Babylon's mid-curve
 * authority piece — district administrator with a writ
 * and a sidearm.
 *
 * 4/5 (=9) at cost 4 is on-curve (expected 9, tol ±20%).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_curve_010_sector_magistrate" as CardDefinition["id"],
  name: "Sector Magistrate",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/s1_curve_010.webp"),
  flavorText:
    "Her seal is heavier than her sidearm. The seal does most of the work. The sidearm does the rest.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "offensive"] as const,
  verdict_delta: 0,
};
