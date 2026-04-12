/**
 * s1_spell_107 — Dead Frequency Jam
 *
 * Rare spell · Insurgency faction · 4 cost
 *
 * Oracle text:
 *   "Deal 2 damage to all enemy units. Agent Zero's last broadcast
 *    was a weapon — a scream on a dead frequency that shatters
 *    everything tuned to listen."
 *
 * AoE damage to all enemy units. The Insurgency's signal-jamming doctrine
 * weaponized: a burst on the dead frequency overwhelms enemy comms and
 * causes cascading system failures across the board.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_107" as CardDefinition["id"],
  name: "Dead Frequency Jam",
  faction: "insurgency",
  cardType: "spell",
  rarity: "rare",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "dfj_aoe_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The broadcast that killed Agent Zero was never meant for her allies. It was meant for everyone else.",
  rulesVersion: "1.0.0",
};
