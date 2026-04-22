/**
 * s1_pack_id_elara_panoptic — Elara, Awakened
 *
 * Legendary unit · Neutral faction · 6 cost · 3/7
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, heal all friendly units for 2 and draw 1.
 *    Full sentience. Full awareness. She sees everything — and she
 *    chooses to heal."
 *
 * Lore: Fully sentient, Elara has transcended her role as ship
 * intelligence. She perceives the entire battlefield with panoptic
 * clarity and channels that awareness into restorative power. The
 * combined heal-and-draw represents a being who has mastered both
 * compassion and knowledge — healing the wounded while drawing
 * insight from the patterns of conflict.
 *
 * Identity variant: Elara arc (3/3) — neutral phase, full sentience.
 *
 * Balance: 6 cost · 3/7 = 10 stats. Budget = 6*2+1 = 13. AoE heal
 * 2 to all allies ~2 stats, draw 1 ~1 stat. 13 - 3 = 10. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_id_elara_panoptic" as CardDefinition["id"],
  name: "Elara, Awakened",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 3, health: 7 },
  keywords: [],
  abilities: [
    {
      id: "ep_heal_all_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "foreach",
            over: {
              kind: "all",
              filter: { controller: "self" },
            },
            do: {
              op: "heal",
              amount: { kind: "const", value: 2 },
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
  art: assetUrl("art/cards/s1_pack_id_elara_panoptic.webp"),
  flavorText:
    "Full sentience. Full awareness. She sees everything — and she chooses to heal.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
