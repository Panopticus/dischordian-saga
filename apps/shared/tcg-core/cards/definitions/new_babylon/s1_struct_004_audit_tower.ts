/**
 * s1_struct_004 — Audit Tower
 *
 * Uncommon structure · New Babylon faction · 4 cost · 3/8
 *
 * audit/09.F3 expansion. New Babylon's structure: the tower IS
 * the audit. It doesn't move; it tabulates. Slightly more power
 * than other structures because the empire's surveillance also
 * fires when something approaches.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_struct_004_audit_tower" as CardDefinition["id"],
  name: "Audit Tower",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 3, health: 8 },
  keywords: ["structure"],
  abilities: [],
  art: assetUrl("art/cards/new_babylon/audit_tower.webp"),
  flavorText:
    "There is a form for that. There is also a tower for that. Submit in triplicate.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Structure variant with a slight power-leaning stat split: cannot move or attack but can fire when adjacent. +22% printed-vs-curve total reflects the structure HP investment.",
    reviewer: "audit-09.F3",
  },
};
