/**
 * s1_pack_008 — Caravan Outrider
 *
 * Uncommon unit · Neutral faction · 3 cost · 2/3
 *
 * audit/09.F3 expansion. Neutral's pack variant at the higher
 * cost-3 slot. The caravan idea: outriders watch the perimeter;
 * the caravan is the unit, not any one rider.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_pack_008_caravan_outrider" as CardDefinition["id"],
  name: "Caravan Outrider",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 3 },
  keywords: ["pack"],
  abilities: [],
  art: assetUrl("art/cards/s1_pack_008.webp"),
  flavorText:
    "Trade does not care who is winning. The caravan moves anyway. The outriders move with it.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "offensive"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Pack snowball: 2/3 (=5) solo at cost 3 (expected 7) is sub-curve; on-curve at 2 copies, exceeds at 3. Mirrors s1_neutral_pack_001.",
    reviewer: "audit-09.F3",
  },
};
