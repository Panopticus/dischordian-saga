/**
 * s1_pack_cosm_tower_skin — Terminus Spire Guard
 *
 * Rare unit · Thought Virus faction · 4 cost · 3/5
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. On deploy, give self +0/+2.
 *    The Spire's guards do not move. They do not need to. Nothing
 *    passes them."
 *
 * Lore: The Terminus Spire is the Thought Virus's central broadcast
 * tower — the structure from which the corrosive signal radiates
 * across the galaxy. Its guards are infected sentinels who have
 * fused with the Spire's architecture, immovable barriers that
 * force all comers to engage. The self-buff represents the guard
 * hardening itself upon deployment, drawing on the Spire's signal
 * to reinforce its body.
 *
 * Cosmetic unlock: Collecting this card unlocks the Terminus Spire
 * tower skin.
 *
 * Balance: 4 cost · 3/5 = 8 stats. Budget = 4*2+1 = 9. Provoke ~1
 * stat, self +0/+2 on deploy ~1 stat. 9 - 2 = 7. At 8 base + 2
 * effective = 10 total. Provoke tax brings to 9. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_cosm_tower_skin" as CardDefinition["id"],
  name: "Terminus Spire Guard",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "tsg_self_fortify" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_cosm_tower_skin.webp"),
  flavorText:
    "The Spire's guards do not move. They do not need to. Nothing passes them.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
