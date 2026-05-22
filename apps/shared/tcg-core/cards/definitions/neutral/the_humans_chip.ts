/**
 * the_humans_chip — Season 2 unlock card
 *
 * Token · Neutral faction · 0 cost · 0/1
 *
 * docs/design/NEXUS_TRIAL_PLAN.md → Pre-Authored Companion-Sacrifice
 * Cinematics, Confession variant B (The Human is sacrificed).
 *
 * The Human's final cinematic shows him placing a chip on the
 * Inception Ark's floor mosaic. The mosaic accepts it. This card
 * is the chip — surfaced to romanced players who lost The Human at
 * the Confession-phase vote, as a Day 7 Season 2 unlock.
 *
 * Gating (apps/shared/seasons/season2/companion_sacrifice/
 * index.ts → HUMAN_DIES.cardUnlocks):
 *   1. Companion-sacrifice variant === "human_dies"
 *   2. Romance-tag eligibility === true (relationship ≥75 OR
 *      romanceActive at sacrifice — see decideRomanceTagEligibility)
 *
 * Players who fail either gate never see this card. The card is
 * reserved from packs, deck-builder, and rewards; it only lands
 * via the Season 2 Wave 2 patch on Day 7.
 *
 * For non-romanced players who lost The Human: the chip is
 * decorative — it appears in the Inception Ark rotunda memorial
 * space but does not enter the player's collection.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "the_humans_chip" as CardDefinition["id"],
  name: "The Human's Chip",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 0,
  baseStats: { power: 0, health: 1 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/the_humans_chip.webp"),
  flavorText:
    "He carried it the whole way. You're holding it now. You'll know what to do with it when you do.",
  rulesVersion: "3.0.0",
  // The chip is reserved from every pool. Only the Season 2 Wave 2
  // patch grants it, and only to romanced players whose Human was
  // sacrificed at Confession.
  reserved: true,
  // audit/post-Sprint-16 — cost-0 0/1 token is over-the-curve in the
  // strict balance sense but the card is canonically a narrative
  // artefact, not a combat unit. Behaves like the burnt-card
  // placeholder: reserved=true keeps it out of competitive deck
  // construction. Future Season 2 effects may bind to ownership of
  // this card (e.g. cosmetic profile decorations).
  balanceException: {
    reason:
      "Season 2 narrative artefact granted to romanced players whose Human was sacrificed. reserved=true keeps it out of packs and deck-builder; mechanical impact is intentionally minimal (the chip is the artifact, not the combat unit).",
    reviewer: "post-sprint-16",
  },
};
