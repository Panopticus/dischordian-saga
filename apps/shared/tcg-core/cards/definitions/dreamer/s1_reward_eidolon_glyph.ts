/**
 * s1_reward_eidolon_glyph — Glyph, the Living Manuscript
 *
 * Rare unit · Dreamer faction · 4 cost · 3/4
 * Keywords: flying
 *
 * Oracle text:
 *   "Flying. On deploy, draw 1 card.
 *    Every flutter of his wings writes a line you had forgotten."
 *
 * Lore: Glyph is a Path A starter Eidolon — a delicate moth whose
 * wings are flowing luminous text, tiny glyphs and letterforms
 * shifting and rearranging as he flies. Bonded through the Eidolon
 * Bond system, Glyph rewards Dreamer-aligned Soul-Keepers with
 * knowledge carried on the wind. Reading him is an act of memory.
 *
 * Reward: Reach max bond with Eidolon Glyph.
 *
 * Balance: 4 cost · 3/4 = 7 stats. Budget = 4*2+1 = 9. Flying
 * keyword ~1 stat, draw 1 on deploy ~1 stat. 9 - 2 = 7. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_glyph" as CardDefinition["id"],
  name: "Glyph, the Living Manuscript",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: ["flying"],
  abilities: [
    {
      id: "glyph_draw_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/spectral/spectral-glyph.png",
  flavorText:
    "Every flutter of his wings writes a line you had forgotten.",
  rulesVersion: "1.0.0",
};
