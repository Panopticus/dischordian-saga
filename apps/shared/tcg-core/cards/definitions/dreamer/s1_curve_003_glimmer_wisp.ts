/**
 * s1_curve_003 — Glimmer Wisp
 *
 * Common unit · Dreamer faction · 1 cost · 1/2
 *
 * audit/09.F4 cost-curve cadence. Dreamer's 1-drop chaff —
 * a small persistent presence that holds the line while
 * larger visions assemble.
 *
 * 1/2 (=3) at cost 1 is on-curve (expected 3, tol ±25%).
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_curve_003_glimmer_wisp" as CardDefinition["id"],
  name: "Glimmer Wisp",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 2 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/dreamer/glimmer_wisp.webp"),
  flavorText:
    "It is the half-second after waking, given a body. It does not last. It does not need to.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 0,
};
