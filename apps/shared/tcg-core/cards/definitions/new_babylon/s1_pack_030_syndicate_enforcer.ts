/**
 * s1_pack_030 — Syndicate Enforcer
 *
 * Common unit · New Babylon faction · 3 cost · 3/3
 *
 * Oracle text:
 *   "On kill, gain 1 permanent mana crystal. Every elimination
 *    is a taxable event."
 *
 * Economy-aggro hybrid. A solid 3/3 body that ramps your mana
 * whenever it kills something. If it picks off even one unit, the
 * mana advantage pays for itself. Excellent in aggressive New Babylon
 * lists that want to trade up while accelerating.
 *
 * Mechanical model:
 *  - On kill (any type), gain 1 permanent mana crystal.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_030" as CardDefinition["id"],
  name: "Syndicate Enforcer",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "se_kill_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 1 },
        permanent: true,
      },
    },
  ],
  art: "/art/cards/s1_pack_030.webp",
  flavorText:
    "He does not ask for payment. He takes it from the corpse's pockets. The Syndicate calls it 'efficiency.'",
  rulesVersion: "1.0.0",
  trial_categories: ["reactive"] as const,
};
