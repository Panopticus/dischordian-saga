/**
 * s1_pack_pet_glyph_moth_1 — Glyph Larva
 *
 * Common unit · Dreamer faction · 1 cost · 0/3
 * Keywords: rebirth
 *
 * Oracle text:
 *   "Rebirth.
 *    It clings to the underside of reality, waiting to become
 *    something worth noticing."
 *
 * Lore: The Glyph Larva is the first stage of the Glyph Moth
 * evolution line — a dormant chrysalis etched with faintly glowing
 * runes. It has no attack power, existing only to endure and
 * eventually be reborn. The rebirth keyword means even destruction
 * is just another stage in its metamorphosis.
 *
 * Pet Evolution: Glyph Moth stage 1 of 3.
 * Collect all 3 stages to unlock the Glyph Moth card back.
 *
 * Balance: 1 cost · 0/3 = 3 stats. Budget = 1*2+1 = 3. Rebirth
 * keyword ~1 stat. 3 - 1 = 2. At 3 stats with 0 power, fair for
 * a defensive rebirth body. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_glyph_moth_1" as CardDefinition["id"],
  name: "Glyph Larva",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 0, health: 3 },
  keywords: ["rebirth"],
  abilities: [],
  art: "/art/cards/s1_pack_pet_glyph_moth_1.webp",
  flavorText:
    "It clings to the underside of reality, waiting to become something worth noticing.",
  rulesVersion: "1.0.0",
};
