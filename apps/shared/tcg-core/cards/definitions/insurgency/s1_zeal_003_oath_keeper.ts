/**
 * s1_zeal_003 — Oath Keeper
 *
 * Uncommon unit · Insurgency faction · 4 cost · 3/5
 *
 * audit/09.F3 expansion. Zeal = +1 power while adjacent to own
 * general. 3/5 (=8) at cost 4 (expected 9) pays the conditional
 * activation tax; effective 4/5 (=9) on-curve when the keeper
 * holds the general's flank.
 *
 * Insurgency zeal reads as covenant rather than discipline. The
 * keeper's bond to the general is the operational principle; the
 * unit weakens when alone because the cell is the point.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_zeal_003_oath_keeper" as CardDefinition["id"],
  name: "Oath Keeper",
  faction: "insurgency",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: ["zeal"],
  abilities: [],
  art: assetUrl("art/cards/s1_zeal_003.webp"),
  flavorText:
    "We outlast every framework that names us. She names me. I outlast.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "offensive"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Zeal tax: printed 3/5 (=8) is sub-curve at cost 4 (expected 9). Effective 4/5 (=9) when adjacent to own general.",
    reviewer: "audit-09.F3",
  },
};
