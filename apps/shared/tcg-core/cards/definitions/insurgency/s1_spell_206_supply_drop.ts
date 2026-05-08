/**
 * s1_spell_206 — Supply Drop
 *
 * Common spell · Insurgency faction · 2 cost
 *
 * Oracle text:
 *   "Give a friendly unit +1/+1 permanently. Every crate that falls
 *    from the sky is another reason to keep fighting."
 *
 * Simple permanent buff. Efficient stat-granting for the Insurgency's
 * scrappy, value-oriented game plan. Turns any body into a bigger threat.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_206" as CardDefinition["id"],
  name: "Supply Drop",
  faction: "insurgency",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "sd_buff_11" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "buff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_spell_206.webp"),
  flavorText:
    "The resistance runs on hope and ammunition. This crate has both.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
