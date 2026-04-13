/**
 * s1_pack_047 — Emergency Protocol
 *
 * Common spell · Neutral faction · 1 cost
 *
 * Oracle text:
 *   "Give a friendly unit +1/+3 this turn. Survival mode activated."
 *
 * Cheap defensive combat trick. The +1/+3 buff can save a unit from
 * lethal combat or enable a favorable trade. At 1 mana it is extremely
 * mana-efficient and can be played alongside other cards on the same
 * turn. Universally useful common.
 *
 * Mechanical model:
 *  - On cast, target a friendly unit and buff +1/+3 for this turn.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_047" as CardDefinition["id"],
  name: "Emergency Protocol",
  faction: "neutral",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "ep_buff_defensive" as CardDefinition["abilities"][number]["id"],
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
          stats: { power: 1, health: 3 },
          duration: { kind: "this_turn" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_047.webp",
  flavorText:
    "The protocol was designed for catastrophe. It activates in the space between the blow and the fall.",
  rulesVersion: "1.0.0",
};
