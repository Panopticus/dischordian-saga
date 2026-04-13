/**
 * s1_pack_035 — Trade Embargo
 *
 * Uncommon spell · New Babylon faction · 1 cost
 *
 * Oracle text:
 *   "Your opponent discards 1 random card. Commerce suspended."
 *
 * Cheap hand disruption. At 1 mana, stripping a random card from the
 * opponent's hand is excellent tempo. Can hit key combo pieces, removal
 * spells, or expensive finishers. A premium uncommon that punishes
 * greedy hands.
 *
 * Mechanical model:
 *  - On cast, opponent discards 1 random card from hand.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_035" as CardDefinition["id"],
  name: "Trade Embargo",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "uncommon",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "te_discard_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "discard",
        amount: { kind: "const", value: 1 },
        from: "opponent",
        mode: "random",
      },
    },
  ],
  art: "/art/cards/s1_pack_035.webp",
  flavorText:
    "The trade routes closed overnight. By morning, entire strategies had starved.",
  rulesVersion: "1.0.0",
};
