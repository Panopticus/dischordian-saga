/**
 * s1_pack_009 — Covert Operative
 *
 * Common unit · Insurgency faction · 2 cost · 3/2
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On deploy, deal 1 damage to a random enemy unit.
 *    Strike fast. Strike first. Disappear."
 *
 * Aggressive 2-drop with rush and a ping on arrival. The 3/2 statline
 * trades up well but dies easily — classic Insurgency glass cannon.
 * The random 1 damage on deploy can pick off weakened targets or
 * soften a blocker before the Operative charges in.
 *
 * Mechanical model:
 *  - Rush: intrinsic keyword. On deploy, deal 1 damage to a random
 *    enemy unit.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_009" as CardDefinition["id"],
  name: "Covert Operative",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: ["rush"],
  abilities: [
    {
      id: "co_deploy_ping" as CardDefinition["abilities"][number]["id"],
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
  art: assetUrl("art/cards/s1_pack_009.webp"),
  flavorText:
    "By the time you hear the shot, she is already three sectors away.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
