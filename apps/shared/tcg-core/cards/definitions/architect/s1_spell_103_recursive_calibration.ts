/**
 * s1_spell_103 — Recursive Calibration
 *
 * Common spell · Architect faction · 2 cost
 *
 * Oracle text:
 *   "Stun an enemy unit for 1 turn. Systems that deviate from spec
 *    are taken offline for recalibration."
 *
 * Targeted stun — a tempo tool that freezes an enemy unit for a turn.
 * Thematically, the Architect diagnoses malfunction in the enemy's
 * operational parameters and forces a hard reboot.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_103" as CardDefinition["id"],
  name: "Recursive Calibration",
  faction: "architect",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "rc_stun_enemy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "stun",
          duration: { kind: "n_turns", n: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_103.webp"),
  flavorText:
    "Error detected in subsystem 7-Kappa. Initiating forced recalibration. Estimated downtime: one operational cycle.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
