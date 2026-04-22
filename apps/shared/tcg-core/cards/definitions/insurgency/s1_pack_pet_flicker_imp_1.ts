/**
 * s1_pack_pet_flicker_imp_1 — Spark Imp
 *
 * Common unit · Insurgency faction · 1 cost · 2/1
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush.
 *    It exists for exactly one brilliant, violent second."
 *
 * Lore: The Spark Imp is the first stage of the Flicker Imp
 * evolution line — a volatile mote of insurgent energy that ignites
 * on contact. It has no special ability beyond rush, embodying the
 * Insurgency's philosophy of immediate, reckless action. Cheap,
 * fast, and disposable.
 *
 * Pet Evolution: Flicker Imp stage 1 of 3.
 * Collect all 3 stages to unlock the Flicker Imp card back.
 *
 * Balance: 1 cost · 2/1 = 3 stats. Budget = 1*2+1 = 3. Rush ~1
 * stat. 3 - 1 = 2. At 3 stats, slightly over but 1 health makes
 * it extremely fragile. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_pet_flicker_imp_1" as CardDefinition["id"],
  name: "Spark Imp",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 2, health: 1 },
  keywords: ["rush"],
  abilities: [],
  art: assetUrl("art/cards/s1_pack_pet_flicker_imp_1.webp"),
  flavorText:
    "It exists for exactly one brilliant, violent second.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
