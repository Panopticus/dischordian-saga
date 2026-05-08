/**
 * s1_blast_002 — Arc Lance
 *
 * Uncommon unit · Architect faction · 4 cost · 3/5
 *
 * audit/09.F3 expansion. Blast previously had only one S1
 * print (s2_hierarchy_dir_bottom_line_decimator) plus a test
 * fixture. Architect's blast variant: a focused arc-weapon
 * that lances down a row.
 *
 * 3/5 (=8) at cost 4 (expected 9, tol ±20%) is within curve;
 * blast keyword's row-hit is incremental tempo on top of a
 * fair stat line.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_blast_002_arc_lance" as CardDefinition["id"],
  name: "Arc Lance",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: ["blast"],
  abilities: [],
  art: assetUrl("art/cards/s1_blast_002.webp"),
  flavorText:
    "The lance does not aim. The lance traces. The schematic does the aiming.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 0,
};
