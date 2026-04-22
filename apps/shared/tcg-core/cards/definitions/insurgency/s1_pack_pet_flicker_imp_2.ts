/**
 * s1_pack_pet_flicker_imp_2 — Flicker Fiend
 *
 * Rare unit · Insurgency faction · 3 cost · 3/3
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On kill, gain +1/+0.
 *    It doesn't flicker to escape. It flickers to strike twice."
 *
 * Lore: The Flicker Fiend is the second stage of the Flicker Imp
 * line — a crackling demon of unstable energy that grows stronger
 * with each kill. Its rush keyword lets it strike immediately, and
 * the on-kill power buff represents the adrenaline surge of the
 * Insurgency's most aggressive operatives. Violence begets violence.
 *
 * Pet Evolution: Flicker Imp stage 2 of 3.
 * Collect all 3 stages to unlock the Flicker Imp card back.
 *
 * Balance: 3 cost · 3/3 = 6 stats. Budget = 3*2+1 = 7. Rush ~1
 * stat, on-kill +1/+0 ~0.5 stat (conditional). 7 - 1.5 = 5.5.
 * At 6 stats, slightly over but fair for pack-exclusive. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_pet_flicker_imp_2" as CardDefinition["id"],
  name: "Flicker Fiend",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["rush"],
  abilities: [
    {
      id: "ff_on_kill_grow" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "unit" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 0 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_pet_flicker_imp_2.webp"),
  flavorText:
    "It doesn't flicker to escape. It flickers to strike twice.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive", "reactive"] as const,
  verdict_delta: 1,
};
