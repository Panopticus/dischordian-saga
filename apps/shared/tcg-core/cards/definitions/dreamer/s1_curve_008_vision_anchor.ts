/**
 * s1_curve_008 — Vision Anchor
 *
 * Uncommon unit · Dreamer faction · 4 cost · 3/6
 *
 * audit/09.F4 cost-curve cadence. Dreamer's mid-curve
 * tank — the still point inside the lattice's drift.
 *
 * 3/6 (=9) at cost 4 is on-curve (expected 9, tol ±20%).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_curve_008_vision_anchor" as CardDefinition["id"],
  name: "Vision Anchor",
  faction: "dreamer",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 3, health: 6 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/dreamer/vision_anchor.webp"),
  flavorText:
    "The dream moves around her. She does not. That is the whole job.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 0,
};
