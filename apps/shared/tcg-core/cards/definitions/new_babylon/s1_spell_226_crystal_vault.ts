/**
 * s1_spell_226 — Crystal Vault
 *
 * Common spell · New Babylon faction · 2 cost
 *
 * Oracle text:
 *   "Give a friendly unit forcefield permanently. The crystal shielding
 *    of New Babylon's vaults protects its most valued assets."
 *
 * Permanent forcefield grant. Shields a key unit from the first damage
 * instance each turn — premium protection in the New Babylon style.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_226" as CardDefinition["id"],
  name: "Crystal Vault",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "cv_forcefield" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "grant_keyword",
          keyword: "forcefield",
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_226.webp"),
  flavorText:
    "Behind crystal walls, value appreciates. Outside, everything depreciates.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
