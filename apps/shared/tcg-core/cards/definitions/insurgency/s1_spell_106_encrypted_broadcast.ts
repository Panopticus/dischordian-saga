/**
 * s1_spell_106 — Encrypted Broadcast
 *
 * Uncommon spell · Insurgency faction · 3 cost
 *
 * Oracle text:
 *   "Give a friendly unit backstab and rush this turn.
 *    The signal is scrambled — by the time they decode it, the strike
 *    is already over."
 *
 * Grants backstab + rush for the turn — enabling an ambush play. The unit
 * slips behind enemy lines on a covert frequency, strikes from behind, and
 * the encrypted signal fades before the enemy can triangulate the source.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_106" as CardDefinition["id"],
  name: "Encrypted Broadcast",
  faction: "insurgency",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "eb_grant_backstab_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "sequence",
          steps: [
            {
              op: "grant_keyword",
              keyword: "backstab",
              duration: { kind: "this_turn" },
              to: { kind: "it" },
            },
            {
              op: "grant_keyword",
              keyword: "rush",
              duration: { kind: "this_turn" },
              to: { kind: "it" },
            },
          ],
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_106.webp",
  flavorText:
    "Agent Zero's encryption keys were never recovered. The Insurgency uses them still — a dead woman's handshake that no firewall can parse.",
  rulesVersion: "1.0.0",
};
