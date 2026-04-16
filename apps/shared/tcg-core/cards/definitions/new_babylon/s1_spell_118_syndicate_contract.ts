/**
 * s1_spell_118 — Syndicate Contract
 *
 * Uncommon spell · New Babylon faction · 2 cost
 *
 * Oracle text:
 *   "Give a friendly unit +3/+3 this turn and grant it ephemeral.
 *    The Syndicate pays generously — and collects with interest."
 *
 * High-risk buff — massive temporary power boost, but the unit dies at end
 * of turn. New Babylon's Faustian bargain distilled: Locke's Syndicate
 * offers unmatched resources, but the fine print always favors the house.
 * Perfect for a lethal push or trading up into a high-value target.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_118" as CardDefinition["id"],
  name: "Syndicate Contract",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "uncommon",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "sc_buff_ephemeral" as CardDefinition["abilities"][number]["id"],
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
              op: "buff",
              stats: { power: 3, health: 3 },
              duration: { kind: "this_turn" },
              to: { kind: "it" },
            },
            {
              op: "grant_keyword",
              keyword: "ephemeral",
              duration: { kind: "permanent" },
              to: { kind: "it" },
            },
          ],
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_118.webp",
  flavorText:
    "Sign here, in blood. The power is yours — for exactly as long as it takes to spend it.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};
