/**
 * s1_pack_pet_glyph_moth_2 — Sigil Moth
 *
 * Rare unit · Dreamer faction · 3 cost · 2/3
 * Keywords: flying
 *
 * Oracle text:
 *   "Flying. On death, give adjacent friendly units +1/+1.
 *    Its wings are prayers. Its dust is a blessing."
 *
 * Lore: The Sigil Moth is the second stage of the Glyph Moth line
 * — a luminous insect whose wings are inscribed with living sigils.
 * When it falls, the sigils scatter across adjacent allies like
 * protective wards, buffing them in its final act. The Dreamer
 * faction values sacrifice that empowers the collective dream.
 *
 * Pet Evolution: Glyph Moth stage 2 of 3.
 * Collect all 3 stages to unlock the Glyph Moth card back.
 *
 * Balance: 3 cost · 2/3 = 5 stats. Budget = 3*2+1 = 7. Flying ~1
 * stat, on-death adjacent buff +1/+1 ~1 stat (conditional,
 * positional). 7 - 2 = 5. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_glyph_moth_2" as CardDefinition["id"],
  name: "Sigil Moth",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 3 },
  keywords: ["flying"],
  abilities: [
    {
      id: "sm_death_buff_adjacent" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "foreach",
        over: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "self" },
        },
        do: {
          op: "buff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_pet_glyph_moth_2.webp",
  flavorText:
    "Its wings are prayers. Its dust is a blessing.",
  rulesVersion: "1.0.0",
};
