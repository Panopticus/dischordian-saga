/**
 * s1_blast_005 — Audit Artillery
 *
 * Uncommon unit · New Babylon faction · 4 cost · 3/5
 *
 * audit/09.F3 expansion. New Babylon's blast variant: an
 * audit-by-shellfire. The salvo doesn't read individual files;
 * the salvo writes the same finding across the row.
 *
 * 3/5 (=8) at cost 4 (expected 9, tol ±20%) is within curve.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_blast_005_audit_artillery" as CardDefinition["id"],
  name: "Audit Artillery",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: ["blast"],
  abilities: [],
  art: assetUrl("art/cards/s1_blast_005.webp"),
  flavorText:
    "Submit in triplicate. The triplicate is the row. The row is what we audit.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 0,
};
