/**
 * s1_pack_001 — Panopticon Override
 *
 * Rare spell · Architect faction · 4 cost
 *
 * Oracle text:
 *   "Silence all enemy units. The Panopticon sees all — and what it sees,
 *    it controls."
 *
 * Premium AoE silence. Strips all abilities and keywords from every enemy
 * unit on the board. The Architect's ultimate expression of control:
 * reduce every opponent to a mute, baseline state. A pack-exclusive
 * answer to keyword-heavy and ability-reliant strategies.
 *
 * Mechanical model:
 *  - On cast, iterate over all enemy units and silence each one.
 *    Silence removes all abilities and keywords permanently.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_001" as CardDefinition["id"],
  name: "Panopticon Override",
  faction: "architect",
  cardType: "spell",
  rarity: "rare",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "po_silence_all_enemies" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "silence",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_001.webp",
  flavorText:
    "The Panopticon does not destroy rebellion. It simply makes rebellion forget what it was fighting for.",
  rulesVersion: "1.0.0",
};
