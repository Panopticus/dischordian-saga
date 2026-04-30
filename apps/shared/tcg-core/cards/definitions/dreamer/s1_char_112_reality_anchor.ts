/**
 * s1_char_112 — Reality Anchor
 *
 * Common unit · Dreamer faction · 2 cost · 1/4
 * Keywords: provoke
 *
 * Oracle text:
 *   "Grounds probability. Enemies must attack this unit — its
 *    presence stabilizes the local probability field, preventing
 *    enemies from slipping past."
 *
 * Lore: While Dreamers bend probability and walk between realities,
 * the Reality Anchor does the opposite: it locks down the local
 * probability field, forcing enemies into a single deterministic
 * path — straight through it. The Dreamers discovered that controlled
 * certainty is as powerful a weapon as controlled chaos. The Witness
 * notes that Reality Anchors were first deployed during the Siege of
 * the Nexus, where they held the line while Vision Walkers flanked.
 *
 * Mechanical model:
 *  - Provoke: intrinsic keyword. Adjacent enemies must target this
 *    unit before attacking others. A cheap defensive body for the
 *    Dreamer faction.
 *
 * Golden tests: test/cards/dreamer/s1_char_112_reality_anchor.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_112" as CardDefinition["id"],
  name: "Reality Anchor",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 4 },
  keywords: ["provoke"],
  abilities: [
    // --- Probability Lock: add 1 forcefield_charges counter on deploy ---
    {
      id: "anchor_deploy_forcefield" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 1,
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_112.webp"),
  flavorText:
    "In a world of shifting probabilities, certainty is the heaviest chain.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence"] as const,
  verdict_delta: 1,
};
