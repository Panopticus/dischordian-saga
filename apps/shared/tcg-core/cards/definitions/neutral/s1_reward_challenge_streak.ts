/**
 * s1_reward_challenge_streak — Honored Rival
 *
 * Rare unit · Neutral faction · 3 cost · 3/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, give both generals +0/+2.
 *    A true rival makes you stronger — and you make them stronger too."
 *
 * Lore: Winning ten friendly challenges proves the player values
 * competition as a path to mutual growth. The Honored Rival reflects
 * that philosophy — on deployment, both generals gain health, honoring
 * the bond between worthy opponents. It is the only reward card that
 * benefits the opponent, embodying sportsmanship.
 *
 * Reward: Win 10 friendly challenges.
 *
 * Balance: 3 cost · 3/3 = 6 stats. Budget = 3*2+1 = 7. Heal both
 * generals +0/+2 — net neutral advantage (both benefit). 7 - 0 = 7.
 * At 6 stats with a symmetrical effect, slightly under, but the
 * defensive utility is real. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_challenge_streak" as CardDefinition["id"],
  name: "Honored Rival",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "hr_buff_generals" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "buff",
            stats: { power: 0, health: 2 },
            duration: { kind: "permanent" },
            to: { kind: "friendly_general" },
          },
          {
            op: "buff",
            stats: { power: 0, health: 2 },
            duration: { kind: "permanent" },
            to: { kind: "enemy_general" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_challenge_streak.webp"),
  flavorText:
    "They fought ten times. After the tenth, they shook hands. Both were harder to kill for it.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
