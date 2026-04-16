/**
 * s1_pack_028 — Spore Cloud
 *
 * Common spell · Thought Virus faction · 1 cost
 *
 * Oracle text:
 *   "Debuff an enemy unit -2/-0 this turn. A whisper of spores
 *    that saps the will to fight."
 *
 * Cheap combat trick that weakens an enemy attacker. At 1 mana,
 * it can save a unit in combat or neutralize a threat for a turn.
 * Simple, efficient, and thematic. The Virus erodes strength.
 *
 * Mechanical model:
 *  - On cast, target an enemy unit and buff -2/-0 for this turn.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_028" as CardDefinition["id"],
  name: "Spore Cloud",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "sc_debuff_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "buff",
          stats: { power: -2, health: 0 },
          duration: { kind: "this_turn" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_028.webp",
  flavorText:
    "It drifted across the battlefield like a sigh. Warriors dropped their blades without knowing why.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};
