/**
 * s1_char_051 — Oculus Sentinel
 *
 * Common unit · Panopticon faction · 2 cost · 2/3
 * Keywords: ranged
 *
 * A low-cost surveillance drone that picks off threats from afar.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_051" as CardDefinition["id"],
  name: "Oculus Sentinel",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["ranged"],
  abilities: [
    // --- Surveillance Strike: deal 1 damage to a random enemy on deploy ---
    {
      id: "oculus_deploy_strike" as CardDefinition["abilities"][number]["id"],
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
  art: assetUrl("art/cards/s1_char_051.webp"),
  flavorText:
    "Its glass eye never blinks. Its memory never falters. It was built to watch — and to remember.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
