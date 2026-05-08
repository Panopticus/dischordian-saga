/**
 * s1_char_081 — Tribunal Magistrate
 *
 * Uncommon unit · New Babylon faction · 4 cost · 4/5
 * Keywords: shield
 *
 * A senior judge of the Tribunal who wields legal and literal armor.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_081" as CardDefinition["id"],
  name: "Tribunal Magistrate",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: ["forcefield"],
  abilities: [
    // --- Verdict of Silence: silence a random enemy on deploy ---
    {
      id: "magistrate_deploy_silence" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "silence",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_081.webp"),
  flavorText:
    "Her verdicts are absolute. Her sentences, irrevocable.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence"] as const,
  verdict_delta: 1,
};
