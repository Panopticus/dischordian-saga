/**
 * s1_zeal_005 — Compliance Zealot
 *
 * Common unit · New Babylon faction · 3 cost · 3/3
 *
 * audit/09.F3 expansion. Zeal = +1 power while adjacent to own
 * general. 3/3 (=6) at cost 3 (expected 7) pays the conditional
 * activation tax; effective 4/3 (=7) on-curve when the zealot
 * stands at the senator's side. The trade-off: the zealot is a
 * more aggressive zeal stat-line than Honor Guard's 2/3 — New
 * Babylon's procedural devotion is louder than the neutral
 * baseline.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_zeal_005_compliance_zealot" as CardDefinition["id"],
  name: "Compliance Zealot",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["zeal"],
  abilities: [],
  art: assetUrl("art/cards/new_babylon/compliance_zealot.webp"),
  flavorText:
    "Procedure is the prayer the empire understands. He prays at her elbow.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Zeal tax: printed 3/3 (=6) is sub-curve at cost 3 (expected 7). Effective 4/3 (=7) when adjacent to own general; the offensive lean differentiates this from Honor Guard's defensive 2/3.",
    reviewer: "audit-09.F3",
  },
};
