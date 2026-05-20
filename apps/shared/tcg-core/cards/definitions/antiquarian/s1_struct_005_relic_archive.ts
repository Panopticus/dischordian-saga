/**
 * s1_struct_005 — Relic Archive
 *
 * Rare structure · Antiquarian faction · 5 cost · 3/12
 *
 * audit/09.F3 expansion. Antiquarian's structure: the archive
 * IS the era. Highest-HP structure of the new set; an era's worth
 * of compiled time anchors the field.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_struct_005_relic_archive" as CardDefinition["id"],
  name: "Relic Archive",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 3, health: 12 },
  keywords: ["structure"],
  abilities: [],
  art: assetUrl("art/cards/antiquarian/relic_archive.webp"),
  flavorText:
    "The shelf is older than the language on it. The shelf does not move.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Structure tank: cannot move or attack. +36% printed-vs-curve HP at cost 5 reflects the antiquarian design role — eras anchor harder than buildings. Power floor is 3 to match the structure baseline; HP carries the budget.",
    reviewer: "audit-09.F3",
  },
};
