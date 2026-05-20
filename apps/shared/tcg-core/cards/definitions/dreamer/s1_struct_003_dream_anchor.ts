/**
 * s1_struct_003 — Dream Anchor
 *
 * Uncommon structure · Dreamer faction · 4 cost · 2/9
 *
 * audit/09.F3 expansion. Dreamer's structure: a still point in
 * the lattice that doesn't move and doesn't strike, but the dream
 * around it persists. Structure tank with sub-Anchor HP because
 * dreamers don't anchor as hard as architects do.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_struct_003_dream_anchor" as CardDefinition["id"],
  name: "Dream Anchor",
  faction: "dreamer",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 2, health: 9 },
  keywords: ["structure"],
  abilities: [],
  art: assetUrl("art/cards/dreamer/dream_anchor.webp"),
  flavorText:
    "Some doors only open inward. The anchor is the doorway that does not move.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Structure tank: cannot move or attack. +22% printed-vs-curve HP reflects the structure design pattern; lower than Anchor of Kael because dreamer fortifications are less obstinate than architect ones.",
    reviewer: "audit-09.F3",
  },
};
