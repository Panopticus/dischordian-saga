/**
 * s1_pack_006 — Dream Choir
 *
 * Common unit · Dreamer faction · 3 cost · 2/2
 *
 * audit/09.F3 expansion. Dreamer's pack variant: a single voice
 * is a hum; together they harmonise into a chord that doesn't
 * leave the room.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_pack_006_dream_choir" as CardDefinition["id"],
  name: "Dream Choir",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 2 },
  keywords: ["pack"],
  abilities: [],
  art: assetUrl("art/cards/s1_pack_006.webp"),
  flavorText:
    "We hum what we cannot say. Together. Until the room remembers.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Pack snowball: 2/2 (=4) at cost 3 (expected 7) is sub-curve solo; on-curve at 2 copies, exceeds at 3. Mirrors s1_neutral_pack_001's design pattern.",
    reviewer: "audit-09.F3",
  },
};
