/**
 * s1_pack_033 — Debt Collector
 *
 * Common unit · New Babylon faction · 2 cost · 2/2
 *
 * Oracle text:
 *   "On deploy, deal 2 damage to the enemy general.
 *    The debt is always collected."
 *
 * Aggressive 2-drop that burns the enemy general on arrival. A 2/2
 * body plus 2 direct damage is significant early-game pressure.
 * Enables New Babylon's burn-and-control strategy by chipping away
 * at the opponent's life total while establishing board presence.
 *
 * Mechanical model:
 *  - On deploy, deal 2 damage to the enemy general.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_033" as CardDefinition["id"],
  name: "Debt Collector",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "dc_deploy_burn" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 2 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_033.webp"),
  flavorText:
    "He does not knock. He does not ask. He simply subtracts.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
