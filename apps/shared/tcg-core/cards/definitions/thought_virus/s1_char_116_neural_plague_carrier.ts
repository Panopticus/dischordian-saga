/**
 * s1_char_116 — Neural Plague Carrier
 *
 * Uncommon unit · Thought Virus faction · 4 cost · 3/5
 * Keywords: deathwatch
 *
 * Oracle text:
 *   "Grows stronger as others fall. Gains +1/+0 whenever any unit
 *    dies — the plague feeds on death."
 *
 * Lore: Neural Plague Carriers are Stage 3 infections — still partially
 * aware, but the Virus has hijacked their neural reward pathways. They
 * experience euphoria when biological signals terminate nearby, drawing
 * strength from the cessation of consciousness. Every death on the
 * battlefield makes the Carrier stronger, a grim feedback loop that
 * the Witness describes as "the Virus's most elegant cruelty — turning
 * grief into growth."
 *
 * Mechanical model:
 *  - Deathwatch: intrinsic keyword marker. The authored ability fires
 *    on_any_unit_dies (no filter — any unit, friendly or enemy) and
 *    grants a permanent +1/+0 buff to self. Scales with board attrition.
 *
 * Golden tests: test/cards/thought_virus/s1_char_116_neural_plague_carrier.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_116" as CardDefinition["id"],
  name: "Neural Plague Carrier",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: ["deathwatch"],
  abilities: [
    // --- Plague Feed: gain +1/+0 when any unit dies ---
    {
      id: "npc_deathwatch_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies" },
      effect: {
        op: "buff",
        stats: { power: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_116.webp"),
  flavorText:
    "It smiles when soldiers fall. Not from malice — the Virus has rewired joy to the frequency of dying screams.",
  rulesVersion: "1.0.0",
  trial_categories: ["reactive"] as const,
  verdict_delta: 1,
};
