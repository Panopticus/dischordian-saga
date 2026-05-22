/**
 * s1_zeal_002 — Engine Warden
 *
 * Uncommon unit · Architect faction · 3 cost · 2/4
 *
 * audit/09.F3 expansion: zeal previously had only one card
 * (s1_neutral_zeal_001 Honor Guard). New cards bring the
 * keyword-with-engine-behavior up from 1 to 5 cards across the
 * factions whose voice fits the conditional-loyalty mechanic.
 *
 * Zeal = +1 power while adjacent to own general (engine/combat.ts).
 * Sub-curve printed stats (2/4 at cost 3 — expected 7 total, here 6)
 * pay the conditional-activation tax: effective 3/4 (=7) when the
 * Warden is positioned next to the general. Architect's zeal is
 * structural, not personal — the warden defends the schematic the
 * general embodies.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_zeal_002_engine_warden" as CardDefinition["id"],
  name: "Engine Warden",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: ["zeal"],
  abilities: [],
  art: assetUrl("art/cards/architect/engine_warden.webp"),
  flavorText:
    "Geometry knows what flesh forgets. So she stays within sight of the line.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 0,
  balanceException: {
    reason: "Zeal tax: printed 2/4 (=6) is sub-curve at cost 3 (expected 7). Effective 3/4 (=7) when adjacent to own general; otherwise the conditional under-statting is intentional, mirroring s1_neutral_zeal_001.",
    reviewer: "audit-09.F3",
  },
};
