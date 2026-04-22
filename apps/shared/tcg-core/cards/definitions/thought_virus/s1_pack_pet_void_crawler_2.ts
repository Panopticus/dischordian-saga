/**
 * s1_pack_pet_void_crawler_2 — Void Stalker
 *
 * Rare unit · Thought Virus faction · 3 cost · 3/3
 * Keywords: backstab
 *
 * Oracle text:
 *   "Backstab. On kill, heal your general for 2.
 *    It feeds from behind. You won't feel it until it's too late."
 *
 * Lore: The Void Stalker is the second stage of the Void Crawler
 * line — a predator that slips through dimensional folds to strike
 * from behind. Its backstab keyword represents its ambush tactics,
 * and the on-kill heal reflects the parasitic energy it siphons
 * from victims and channels to its master. The Thought Virus
 * faction sustains itself through consumption.
 *
 * Pet Evolution: Void Crawler stage 2 of 3.
 * Collect all 3 stages to unlock the Void Crawler card back.
 *
 * Balance: 3 cost · 3/3 = 6 stats. Budget = 3*2+1 = 7. Backstab
 * ~1 stat, on-kill heal general 2 ~0.5 stat (conditional). 7 - 1.5
 * = 5.5. At 6 stats, slightly over. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_pet_void_crawler_2" as CardDefinition["id"],
  name: "Void Stalker",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["backstab"],
  abilities: [
    {
      id: "vs_on_kill_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "unit" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_pet_void_crawler_2.webp"),
  flavorText:
    "It feeds from behind. You won't feel it until it's too late.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "reactive"] as const,
  verdict_delta: 1,
};
