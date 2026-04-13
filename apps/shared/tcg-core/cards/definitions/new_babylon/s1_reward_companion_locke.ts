/**
 * s1_reward_companion_locke — Locke's Favor
 *
 * Rare spell · New Babylon faction · 1 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Gain 1 permanent mana crystal.
 *    Adjudicator Locke's favor is the rarest currency in New Babylon —
 *    and the most profitable."
 *
 * Lore: Adjudicator Locke controls the flow of resources in New Babylon.
 * Earning Locke's favor means gaining access to the economic engine that
 * drives the city. This spell is the simplest expression of that bond:
 * a permanent increase in resources, reflecting Locke's investment in
 * you as a trusted asset.
 *
 * Reward: Max out bond with Adjudicator Locke companion.
 *
 * Balance: 1 cost spell. Gain 1 permanent mana = ramp. Pays for itself
 * over 2 turns. Strong but reward-gated. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_companion_locke" as CardDefinition["id"],
  name: "Locke's Favor",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "rare",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "lf_gain_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 1 },
        permanent: true,
      },
    },
  ],
  art: "/art/cards/s1_reward_companion_locke.webp",
  flavorText:
    "Adjudicator Locke's favor is the rarest currency in New Babylon — and the most profitable.",
  rulesVersion: "1.0.0",
};
