/**
 * s1_spell_205 — Panoptic Lockdown
 *
 * Common spell · Architect faction · 3 cost
 *
 * Oracle text:
 *   "Stun an enemy unit for 1 turn. Under the Architect's gaze,
 *    all movement ceases. All resistance freezes."
 *
 * Single-target stun. Removes an enemy unit's ability to act for a full
 * turn cycle. Classic control tool for the Architect's tempo game.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_205" as CardDefinition["id"],
  name: "Panoptic Lockdown",
  faction: "architect",
  cardType: "spell",
  rarity: "common",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "pl_stun_1" as CardDefinition["abilities"][number]["id"],
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
  art: "/art/cards/s1_spell_205.webp",
  flavorText:
    "The Arena's walls contract. The ceiling descends. You are held in place by architecture itself.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
