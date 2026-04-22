/**
 * s1_char_052 — Compliance Officer
 *
 * Common unit · Panopticon faction · 3 cost · 3/4
 * Keywords: provoke
 *
 * A frontline enforcer that channels citizen obedience through fear.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_052" as CardDefinition["id"],
  name: "Compliance Officer",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["provoke"],
  abilities: [
    // --- Compliance Shield: give self +0/+2 on deploy ---
    {
      id: "compliance_deploy_shield" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_052.webp"),
  flavorText:
    "Obedience is not requested. It is extracted.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
