/**
 * s1_pack_pet_data_serpent_3 — Archive Wyrm
 *
 * Epic unit · Architect faction · 6 cost · 5/7
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, silence an enemy unit and draw 1 card.
 *    It remembers every file ever deleted. It does not forgive."
 *
 * Lore: The Archive Wyrm is the final evolution of the Data Serpent
 * line — a colossal construct of compressed archives and encrypted
 * malice. Its silence effect represents a total system purge on an
 * enemy unit, stripping all abilities and buffs, while the card draw
 * reflects the vast intelligence it has accumulated across its
 * evolutionary journey.
 *
 * Pet Evolution: Data Serpent stage 3 of 3.
 * Collect all 3 stages to unlock the Data Serpent card back.
 *
 * Balance: 6 cost · 5/7 = 12 stats. Budget = 6*2+1 = 13. Silence
 * on deploy ~1 stat, draw 1 ~1 stat. 13 - 2 = 11. At 12 stats,
 * slightly over but epic pack-exclusive capstone. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_data_serpent_3" as CardDefinition["id"],
  name: "Archive Wyrm",
  faction: "architect",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 5, health: 7 },
  keywords: [],
  abilities: [
    {
      id: "aw_deploy_silence_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
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
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "self",
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_pack_pet_data_serpent_3.webp",
  flavorText:
    "It remembers every file ever deleted. It does not forgive.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: 2,
};
