/**
 * s1_pack_seed_trade — Shadow Route Manifest
 *
 * Rare spell · New Babylon faction · 2 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Gain 2 mana this turn.
 *    The routes that don't appear on any chart are the ones that pay
 *    the most."
 *
 * Lore: New Babylon's shadow routes are the lifeblood of its
 * underground economy — hidden trade lanes that bypass tariffs,
 * inspections, and the Architect's surveillance. This manifest
 * grants temporary mana, representing the burst of illicit capital
 * that flows through these hidden channels.
 *
 * Cross-game seed: Collecting this card unlocks a hidden Trade
 * Empire mission.
 *
 * Balance: 2 cost spell. Gain 2 mana this turn is net-zero mana
 * but enables tempo plays. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_seed_trade" as CardDefinition["id"],
  name: "Shadow Route Manifest",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "rare",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "srm_gain_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 2 },
        permanent: false,
      },
    },
  ],
  art: "/art/cards/s1_pack_seed_trade.webp",
  flavorText:
    "The routes that don't appear on any chart are the ones that pay the most.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
