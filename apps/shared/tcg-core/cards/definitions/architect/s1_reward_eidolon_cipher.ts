/**
 * s1_reward_eidolon_cipher — Cipher, Logic's Edge
 *
 * Rare unit · Architect faction · 4 cost · 3/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 1 card.
 *    Cipher processes information faster than thought —
 *    what it finds, it shares."
 *
 * Lore: Cipher is an Eidolon bonded through the Eidolon Bond system —
 * a creature of pure logic that resonates with the Architect faction.
 * Its analytical nature translates to card advantage on deployment:
 * Cipher processes the battlefield and surfaces the most relevant
 * resource from the player's deck.
 *
 * Reward: Reach maximum bond level with the Cipher Eidolon.
 *
 * Balance: 4 cost · 3/4 = 7 stats. Budget = 4*2+1 = 9. Draw 1 ~1
 * stat. 9 - 1 = 8. Slightly under at 7 stats, but cantrip provides
 * card-neutral deployment. Fair for a reward card.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_cipher" as CardDefinition["id"],
  name: "Cipher, Logic's Edge",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "cle_draw_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_eidolon_cipher.webp"),
  flavorText:
    "Cipher does not think. Cipher computes. The distinction matters only to those who lose to it.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
  balanceException: {
    reason: "Reward/prestige card: designer-tuned outside the standard curve for narrative role; not part of the regular deck-builder balance pool. UNDER curve by 22%.",
    reviewer: "2026-05-stat-curve-recalibration",
  },
};
