/**
 * s1_spell_207 — Ambush Protocol
 *
 * Uncommon spell · Insurgency faction · 3 cost
 *
 * Oracle text:
 *   "Give a friendly unit rush and backstab this turn. Strike fast,
 *    strike from behind — the Insurgency way."
 *
 * Aggressive keyword-granting spell. Enables surprise lethal by giving
 * a unit both rush (act immediately) and backstab (bonus damage from behind).
 * The Insurgency's guerrilla doctrine distilled into a single order.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_207" as CardDefinition["id"],
  name: "Ambush Protocol",
  faction: "insurgency",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "ap_rush_backstab" as CardDefinition["abilities"][number]["id"],
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
              keyword: "rush",
              duration: { kind: "this_turn" },
              to: { kind: "it" },
            },
            {
              op: "grant_keyword",
              keyword: "backstab",
              duration: { kind: "this_turn" },
              to: { kind: "it" },
            },
          ],
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "They never see us coming. That is the point.",
  rulesVersion: "1.0.0",
};
