/**
 * s1_spell_229 — Liquidation Sale
 *
 * Common spell · New Babylon faction · 2 cost
 *
 * Oracle text:
 *   "Destroy a friendly unit. Draw 2 cards. Every asset has a liquidation
 *    value — the question is whether you're willing to cash it in."
 *
 * Sacrifice-for-cards. Trades a board piece for card advantage. Synergizes
 * with dying wish units, tokens, or units about to die anyway. Classic
 * New Babylon — everything has a price.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_229" as CardDefinition["id"],
  name: "Liquidation Sale",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "ls_sac_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sacrifice_then",
        sac: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        then: {
          op: "draw",
          amount: { kind: "const", value: 2 },
          who: "self",
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_229.webp",
  flavorText:
    "Everything must go. Including the soldiers.",
  rulesVersion: "1.0.0",
};
