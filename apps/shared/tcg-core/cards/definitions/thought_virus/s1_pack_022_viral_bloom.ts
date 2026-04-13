/**
 * s1_pack_022 — Viral Bloom
 *
 * Rare spell · Thought Virus faction · 3 cost
 *
 * Oracle text:
 *   "Debuff all enemy units -1/-1 permanently. The bloom spreads.
 *    Everything withers."
 *
 * Premium AoE debuff. Permanently weakens every enemy unit on the
 * board, shrinking stats and potentially killing 1-health units.
 * At 3 mana this is an efficient board-wide answer that scales
 * with the number of enemies. A Thought Virus signature effect.
 *
 * Mechanical model:
 *  - On cast, foreach enemy unit, buff -1/-1 permanently.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_022" as CardDefinition["id"],
  name: "Viral Bloom",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "vb_debuff_all" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "buff",
          stats: { power: -1, health: -1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_022.webp",
  flavorText:
    "It does not kill. It diminishes. By the time you notice, you are less than you were.",
  rulesVersion: "1.0.0",
};
