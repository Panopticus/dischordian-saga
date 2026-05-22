/**
 * s1_resurrect_004 — Undying Witness
 *
 * Rare unit · Panopticon faction · 5 cost · 4/5
 *
 * audit/09.F3 expansion. Panopticon's resurrect variant: the
 * watcher who has been killed for what she saw, and remembers
 * it on the second turn.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_resurrect_004_undying_witness" as CardDefinition["id"],
  name: "Undying Witness",
  faction: "panopticon",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 4, health: 5 },
  keywords: ["resurrect"],
  abilities: [],
  art: assetUrl("art/cards/panopticon/undying_witness.webp"),
  flavorText:
    "The eye does not blink. Even when struck. Especially when struck.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "reactive"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Resurrect tax: 4/5 (=9) at cost 5 (expected 11) is sub-curve. Second life pushes amortised total to ~16 across two appearances; on-curve when the witness is killed once.",
    reviewer: "audit-09.F3",
  },
};
