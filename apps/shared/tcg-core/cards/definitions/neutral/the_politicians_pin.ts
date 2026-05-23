/**
 * the_politicians_pin — Season 2 antagonist marker
 *
 * Token · Neutral faction · 0 cost · 0/1
 *
 * docs/design/NEXUS_TRIAL_PLAN.md → Politician Fork resolution.
 *
 * When the Trial closes with low community engagement, the
 * Politician's vacant Archon-7 seat opens and the apprentices'
 * leader ascends. This card is the yellow-tie pin that surfaces
 * in every player's collection on Day 1 of Season 2 — a visible
 * marker that the seat was let to be filled.
 *
 * Gating (apps/shared/seasons/season2/politician_fork/index.ts →
 * FULL_RETURN.cardUnlocks):
 *   1. politicianFork.resolution === "full_return"
 *
 * The card is granted to ALL players when the full_return
 * resolution fires — it's not romance-gated like the_humans_chip.
 * The Politician's return is community-wide; the pin marks the
 * community-wide state of the seat in every collection.
 *
 * For the other two resolutions (seat_sealed, constrained_return),
 * this card is reserved and ungrantable.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "the_politicians_pin" as CardDefinition["id"],
  name: "The Politician's Pin",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 0,
  baseStats: { power: 0, health: 1 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/the_politicians_pin.webp"),
  flavorText:
    "Yellow thread on a silver pin. She wore it the first time. She wears it again.",
  rulesVersion: "1.1.0",
  reserved: true,
  balanceException: {
    reason:
      "Season 2 community-state marker. Granted to all players only when the Politician fork resolves to full_return. reserved=true keeps it out of packs and deck-builder; the card's job is the visible record of the seat's resolution, not combat budget.",
    reviewer: "post-sprint-16",
  },
};
