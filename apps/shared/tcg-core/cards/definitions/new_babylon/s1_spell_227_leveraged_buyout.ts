/**
 * s1_spell_227 — Leveraged Buyout
 *
 * Rare spell · New Babylon faction · 4 cost
 *
 * Oracle text:
 *   "Silence an enemy unit with 2 or less attack, then buff it +0/+0
 *    and return it to your hand under your control. New Babylon doesn't
 *    destroy assets — it acquires them."
 *
 * Mechanical model: silence a weak enemy (strip abilities/keywords), then
 * return it to the caster's hand. The silenced unit becomes a vanilla body
 * the caster can redeploy. Premium mind-control-lite for the merchant city.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_227" as CardDefinition["id"],
  name: "Leveraged Buyout",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "rare",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "lb_acquire" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent", maxStats: { power: 2 } },
          chooser: "player",
        },
        do: {
          op: "sequence",
          steps: [
            {
              op: "silence",
              to: { kind: "it" },
            },
            {
              op: "return_to_hand",
              to: { kind: "it" },
              owner: "self",
            },
          ],
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_227.webp",
  flavorText:
    "Your asset is underperforming. Allow us to restructure it under new management.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
};
