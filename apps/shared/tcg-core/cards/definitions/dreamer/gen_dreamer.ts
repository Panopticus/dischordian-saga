/**
 * gen_dreamer — The Oracle
 *
 * General · Dreamer faction · 0 cost · 2/25
 *
 * "I've already seen this."
 *
 * The Prisoner IS the Oracle — the Insurgency's greatest prophet, whose
 * prophecy foretold the unraveling of the Architect's design. Captured
 * by the Collector, memory-erased, imprisoned in the Panopticon. Through
 * the Collector's Arena the Oracle recovers identity fragment by fragment.
 * The Dreamer faction represents prophetic vision — seeing probability
 * clouds collapse before they happen.
 *
 * Bloodborn Spell: PROPHETIC VISION
 * Draw a card. The Oracle's prophecy sees what's coming before it
 * arrives — card advantage through foreknowledge. Simple, powerful,
 * and thematically pure.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "gen_dreamer" as CardDefinition["id"],
  name: "The Oracle",
  faction: "dreamer",
  cardType: "general",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 2, health: 25 },
  keywords: [],
  abilities: [
    {
      id: "drm_bbs_prophetic_vision" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "activated", cost: { kind: "once_per_match", manaCost: 1 } },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/gen_dreamer.webp"),
  flavorText:
    "Before every fight you muttered: 'I've already seen this.' You don't remember saying it.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 1,
};
