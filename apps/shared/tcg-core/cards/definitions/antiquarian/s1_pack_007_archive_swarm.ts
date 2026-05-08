/**
 * s1_pack_007 — Archive Swarm
 *
 * Common unit · Antiquarian faction · 2 cost · 1/2
 *
 * audit/09.F3 expansion. Antiquarian's pack variant: a single
 * archive-mite is curiosity; a swarm is consensus reached
 * across volumes.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_pack_007_archive_swarm" as CardDefinition["id"],
  name: "Archive Swarm",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 2 },
  keywords: ["pack"],
  abilities: [],
  art: assetUrl("art/cards/s1_pack_007.webp"),
  flavorText:
    "Time leaves fingerprints. We collect them. Together. Patiently.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "offensive"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Pack snowball: 1/2 solo is sub-curve at cost 2; reaches curve at 2 copies. Mirrors s1_neutral_pack_001.",
    reviewer: "audit-09.F3",
  },
};
