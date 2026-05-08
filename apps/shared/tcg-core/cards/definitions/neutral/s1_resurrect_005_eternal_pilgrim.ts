/**
 * s1_resurrect_005 — Eternal Pilgrim
 *
 * Epic unit · Neutral faction · 6 cost · 4/6
 *
 * audit/09.F3 expansion. Neutral's heavy-cost resurrect variant.
 * The pilgrim walks through every civilization and survives them
 * all; a second life is a tithe paid by walking far enough.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_resurrect_005_eternal_pilgrim" as CardDefinition["id"],
  name: "Eternal Pilgrim",
  faction: "neutral",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 4, health: 6 },
  keywords: ["resurrect"],
  abilities: [],
  art: assetUrl("art/cards/s1_resurrect_005.webp"),
  flavorText:
    "Their flag is the absence of a flag. The pilgrim outlasts every banner that names her, including her own.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Resurrect tax: 4/6 (=10) at cost 6 (expected 13) is sub-curve. Second life amortises to ~17 across two appearances; on-curve when killed once.",
    reviewer: "audit-09.F3",
  },
};
