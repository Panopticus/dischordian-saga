/**
 * s1_spell_211 — Scorched Earth
 *
 * Rare spell · Insurgency faction · 5 cost
 *
 * Oracle text:
 *   "Deal 3 damage to ALL units. When retreat is impossible,
 *    the Insurgency burns everything — including their own."
 *
 * Symmetrical board wipe. Devastating when behind, punishing when the
 * opponent commits heavily to board. The Insurgency's last resort:
 * if we can't have it, no one will.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_211" as CardDefinition["id"],
  name: "Scorched Earth",
  faction: "insurgency",
  cardType: "spell",
  rarity: "rare",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "se_aoe_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "any" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 3 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The fire does not distinguish between friend and foe. Neither does desperation.",
  rulesVersion: "1.0.0",
};
