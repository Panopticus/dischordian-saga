/**
 * s1_char_202 — Saboteur
 *
 * Common unit · Insurgency faction · 2 cost · 3/2
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On deploy, deal 1 damage to a random enemy unit.
 *    The Saboteur arrives fast and breaks something on the way in."
 *
 * Aggressive 2-drop. Rush lets it attack immediately, and the deploy
 * ping softens a target or finishes off a wounded enemy. Classic
 * Insurgency hit-and-run design.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_202" as CardDefinition["id"],
  name: "Saboteur",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: ["rush"],
  abilities: [
    {
      id: "sab_deploy_ping" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_202.webp"),
  flavorText:
    "She was in and out before the alarm sounded. The fire was just a bonus.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
