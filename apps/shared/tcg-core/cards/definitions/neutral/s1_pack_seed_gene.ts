/**
 * s1_pack_seed_gene — Void-Touched Specimen
 *
 * Rare unit · Neutral faction · 4 cost · 3/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give self +1/+1 and add 1 forcefield charge.
 *    It came back from the Void changed. Stronger. Wrong."
 *
 * Lore: The Void-Touched Specimen is a creature altered by exposure
 * to the space between dimensions — the Void that the Dreamers seal
 * and the Thought Virus exploits. Its genetic structure has been
 * rewritten, granting it enhanced resilience and a natural forcefield.
 * Scientists want to study it. Breeders want to replicate it.
 *
 * Cross-game seed: Collecting this card unlocks the "Void Touched"
 * breeding gene in the creature breeding system.
 *
 * Balance: 4 cost · 3/5 = 8 stats. Budget = 4*2+1 = 9. Self +1/+1
 * on deploy ~1 stat (self-only), 1 forcefield charge ~0.5 stat.
 * 9 - 1.5 = 7.5. At 8 base + 2 effective = 10 total. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_seed_gene" as CardDefinition["id"],
  name: "Void-Touched Specimen",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "vts_deploy_buff_shield" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "buff",
            stats: { power: 1, health: 1 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "forcefield_charges",
            amount: 1,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_seed_gene.webp"),
  flavorText:
    "It came back from the Void changed. Stronger. Wrong.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
};
