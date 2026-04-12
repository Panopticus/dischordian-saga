/**
 * s1_pack_pet_glyph_moth_3 — Arcane Monarch
 *
 * Epic unit · Dreamer faction · 5 cost · 3/5
 * Keywords: flying
 *
 * Oracle text:
 *   "Flying. On deploy, give all friendly units +1/+0.
 *    When it spreads its wings, the battlefield remembers how to fight."
 *
 * Lore: The Arcane Monarch is the final evolution of the Glyph Moth
 * line — a majestic butterfly-like entity whose wings span the
 * entire board with arcane light. Its arrival inspires all friendly
 * units with a surge of power, its glyphs resonating with the latent
 * potential in every ally. A board-wide anthem effect worthy of its
 * regal title.
 *
 * Pet Evolution: Glyph Moth stage 3 of 3.
 * Collect all 3 stages to unlock the Glyph Moth card back.
 *
 * Balance: 5 cost · 3/5 = 8 stats. Budget = 5*2+1 = 11. Flying ~1
 * stat, give all allies +1/+0 on deploy ~2 stats (board-dependent).
 * 11 - 3 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_glyph_moth_3" as CardDefinition["id"],
  name: "Arcane Monarch",
  faction: "dreamer",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 3, health: 5 },
  keywords: ["flying"],
  abilities: [
    {
      id: "am_deploy_buff_all" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 1, health: 0 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "When it spreads its wings, the battlefield remembers how to fight.",
  rulesVersion: "1.0.0",
};
