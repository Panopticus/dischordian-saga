/**
 * s1_resurrect_003 — Ghost Cell Runner
 *
 * Rare unit · Insurgency faction · 4 cost · 3/4
 *
 * audit/09.F3 expansion. Insurgency's resurrect variant: the
 * runner who has died once before. Sub-curve because resurrect
 * pays for a second life; the runner is light enough to not
 * stay dead.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_resurrect_003_ghost_cell_runner" as CardDefinition["id"],
  name: "Ghost Cell Runner",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: ["resurrect", "rush"],
  abilities: [],
  art: assetUrl("art/cards/s1_resurrect_003.webp"),
  flavorText:
    "We were here before the maps. We are here after them. The runner does not stay dead because the cell does not stay caught.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "offensive", "reactive"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Resurrect+rush tax: 3/4 (=7) at cost 4 (expected 9) is sub-curve. Two-life amortised total ~13 plus rush's tempo — on-curve when the runner gets two attacks across two lives.",
    reviewer: "audit-09.F3",
  },
};
