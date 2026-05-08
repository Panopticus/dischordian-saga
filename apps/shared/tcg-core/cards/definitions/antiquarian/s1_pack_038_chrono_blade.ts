/**
 * s1_pack_038 — Chrono Blade
 *
 * Rare unit · Antiquarian faction · 4 cost · 4/3
 * Keywords: celerity
 *
 * Oracle text:
 *   "Celerity — may move and attack twice per turn.
 *    It strikes once in the present and once in the future."
 *
 * A double-strike attacker with celerity. The 4/3 statline is fragile
 * but the ability to attack twice per turn means 8 potential damage
 * output. An aggressive rare that punishes undefended boards and can
 * close games quickly. High risk, high reward.
 *
 * Mechanical model:
 *  - Celerity: intrinsic keyword. May act twice per turn.
 *    No additional abilities.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_038" as CardDefinition["id"],
  name: "Chrono Blade",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 3 },
  keywords: ["celerity"],
  abilities: [],
  art: assetUrl("art/cards/s1_pack_038.webp"),
  flavorText:
    "The first cut opens the wound. The second cut is already healing when you notice the third.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Celerity ability-driven: 4/3 + 2 actions per turn = 8 effective damage potential per turn-cycle. Sub-curve printed stats compensate for the doubled damage cadence.",
    reviewer: "panopticus",
  },
};
