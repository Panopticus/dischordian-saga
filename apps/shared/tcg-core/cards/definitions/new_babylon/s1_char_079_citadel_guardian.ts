/**
 * s1_char_079 — Citadel Guardian
 *
 * Common unit · New Babylon faction · 3 cost · 3/4
 * Keywords: provoke
 *
 * A stalwart defender of New Babylon's inner walls.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_079" as CardDefinition["id"],
  name: "Citadel Guardian",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["provoke"],
  abilities: [
    // --- Citadel Fortification: give self +0/+2 on deploy ---
    {
      id: "citadel_deploy_shield" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_079.webp"),
  flavorText:
    "The walls of New Babylon have never been breached. The guardians intend to keep it that way.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
