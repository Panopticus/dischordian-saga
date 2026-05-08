/**
 * s1_zeal_004 — Relic Acolyte
 *
 * Common unit · Antiquarian faction · 2 cost · 1/3
 *
 * audit/09.F3 expansion. Zeal = +1 power while adjacent to own
 * general. 1/3 (=4) at cost 2 (expected 5) pays the conditional
 * activation tax; effective 2/3 (=5) on-curve when the acolyte
 * walks beside the keeper of the era.
 *
 * Antiquarian zeal is custodial: archives need someone willing to
 * stand at the shelf. The acolyte's power is the act of remaining,
 * not the act of striking.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_zeal_004_relic_acolyte" as CardDefinition["id"],
  name: "Relic Acolyte",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 3 },
  keywords: ["zeal"],
  abilities: [],
  art: assetUrl("art/cards/s1_zeal_004.webp"),
  flavorText:
    "Every relic was once a tool. Then a question. Then this acolyte, who has outlived all three.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Zeal tax: printed 1/3 (=4) is sub-curve at cost 2 (expected 5). Effective 2/3 (=5) when adjacent to own general.",
    reviewer: "audit-09.F3",
  },
};
