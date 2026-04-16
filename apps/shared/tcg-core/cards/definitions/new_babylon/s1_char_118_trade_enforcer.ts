/**
 * s1_char_118 — Trade Enforcer
 *
 * Rare unit · New Babylon faction · 4 cost · 4/4
 * Keywords: none
 *
 * Oracle text:
 *   "Commerce is law. On kill, gain 1 permanent mana crystal —
 *    every enemy eliminated is a taxable event."
 *
 * Lore: Trade Enforcers are New Babylon's economic executors — part
 * soldier, part tax collector, part enforcer of the city-state's
 * monopoly on commerce. In New Babylon, violence is a transaction,
 * and the Trade Enforcers ensure the state takes its cut. Every kill
 * generates revenue for the controller's war machine, represented as
 * a permanent mana crystal. The Witness notes that New Babylon's
 * economy is built on the principle that destruction creates value.
 *
 * Mechanical model:
 *  - On kill (any type), the controller gains 1 permanent mana crystal.
 *    This is a powerful ramp effect that rewards aggressive trading.
 *
 * Golden tests: test/cards/new_babylon/s1_char_118_trade_enforcer.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_118" as CardDefinition["id"],
  name: "Trade Enforcer",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: [],
  abilities: [
    // --- Taxable Event: gain mana on kill ---
    {
      id: "te_taxable_event" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 1 },
        permanent: true,
      },
    },
  ],
  art: "/art/cards/s1_char_118.webp",
  flavorText:
    "In New Babylon, murder is not a crime. It is a line item. The Enforcer simply ensures the ledger balances.",
  rulesVersion: "1.0.0",
  trial_categories: ["reactive"] as const,
};
