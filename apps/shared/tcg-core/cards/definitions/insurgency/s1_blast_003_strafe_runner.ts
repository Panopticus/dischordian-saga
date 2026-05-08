/**
 * s1_blast_003 — Strafe Runner
 *
 * Common unit · Insurgency faction · 3 cost · 2/4
 *
 * audit/09.F3 expansion. Insurgency's blast variant: a
 * strafe-pass that doesn't pick targets. Compliance is a row;
 * the runner is what crosses it.
 *
 * 2/4 (=6) at cost 3 (expected 7, tol ±20%) is within curve.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_blast_003_strafe_runner" as CardDefinition["id"],
  name: "Strafe Runner",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: ["blast"],
  abilities: [],
  art: assetUrl("art/cards/s1_blast_003.webp"),
  flavorText:
    "I do not choose who is in the row. The row is the choice.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 0,
};
