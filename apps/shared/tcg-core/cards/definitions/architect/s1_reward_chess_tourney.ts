/**
 * s1_reward_chess_tourney — Calculated Checkmate
 *
 * Rare spell · Architect faction · 3 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Deal 4 damage to a unit.
 *    Every move was calculated. The outcome was never in doubt."
 *
 * Lore: Winning a Chess tournament demonstrates mastery of the
 * Architect's strategic paradigm. Calculated Checkmate is the
 * culmination of that mastery — a single, precise strike that ends
 * the game. Like a chess endgame, there is no escape once the
 * sequence begins.
 *
 * Reward: Win a Chess tournament.
 *
 * Balance: 3 cost spell. Deal 4 to a unit is efficient single-target
 * removal (cf. Guerrilla Strike: 2 cost, 3 damage). Fair at 3 cost.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_chess_tourney" as CardDefinition["id"],
  name: "Calculated Checkmate",
  faction: "architect",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "cc_deal_4" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "any" },
          chooser: "player",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 4 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_chess_tourney.webp"),
  flavorText:
    "Checkmate in four. The opponent saw it in three. By then, it was already too late.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
