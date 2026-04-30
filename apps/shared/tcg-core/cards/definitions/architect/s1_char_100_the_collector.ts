/**
 * s1_char_100 — The Collector
 *
 * Epic unit · Architect faction · 6 cost · 5/7
 * Keywords: none
 *
 * Oracle text:
 *   "Damnatio Memoriae — On deploy, silence an enemy unit, erasing its
 *    identity. The Collector strips away what you were."
 *
 * Lore: The Collector captured the Oracle on behalf of the Architect,
 * harvesting identities across the multiverse. This card represents
 * the Collector in the act of erasure — the Damnatio Memoriae protocol
 * that wipes a unit's abilities, buffs, and keywords.
 *
 * Mechanical model:
 *  - On deploy, the player chooses an enemy unit to silence.
 *    Silence strips all abilities, keywords, and ongoing effects.
 *
 * Note: s1_char_022 is the existing Collector with drain/stealth.
 * This is the alternate "Damnatio Memoriae" variant at the s1_char_100 slot.
 *
 * Golden tests: test/cards/architect/s1_char_100_the_collector.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_100" as CardDefinition["id"],
  name: "The Collector",
  faction: "architect",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 5, health: 7 },
  keywords: [],
  abilities: [
    // --- Damnatio Memoriae: silence an enemy on deploy ---
    {
      id: "coll2_damnatio" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "silence",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_100.webp"),
  flavorText:
    "The Architect's hand reaches through the Collector. What was your name? It does not matter — you never had one.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
