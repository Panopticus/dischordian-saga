/**
 * s1_pack_pet_data_serpent_2 — Cipher Serpent
 *
 * Rare unit · Architect faction · 3 cost · 3/4
 * Keywords: none
 *
 * Oracle text:
 *   "Whenever this unit deals damage, draw 1 card.
 *    Each byte it consumes becomes a secret it can sell."
 *
 * Lore: The Cipher Serpent is the second stage of the Data Serpent
 * line — a sleek data predator that feeds on information. Every
 * strike siphons encrypted packets from its target, which it
 * decodes and passes to its controller as tactical intelligence.
 * The Architect faction prizes this kind of efficient extraction.
 *
 * Pet Evolution: Data Serpent stage 2 of 3.
 * Collect all 3 stages to unlock the Data Serpent card back.
 *
 * Balance: 3 cost · 3/4 = 7 stats. Budget = 3*2+1 = 7. Draw 1 on
 * damage dealt ~1 stat (conditional). 7 - 1 = 6. Slightly over at
 * 7 but the draw is combat-conditional. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_data_serpent_2" as CardDefinition["id"],
  name: "Cipher Serpent",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "cs_on_hit_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "Each byte it consumes becomes a secret it can sell.",
  rulesVersion: "1.0.0",
};
