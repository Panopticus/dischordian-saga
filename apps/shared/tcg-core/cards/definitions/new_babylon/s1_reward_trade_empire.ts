/**
 * s1_reward_trade_empire — Merchant's Fortune
 *
 * Rare spell · New Babylon faction · 3 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Gain 2 permanent mana crystals.
 *    In New Babylon, fortune is not found — it is manufactured."
 *
 * Lore: The Trade Empire game mode simulates New Babylon's ruthless
 * commerce networks. Building a successful trade empire teaches the
 * player to convert opportunity into lasting wealth. Merchant's Fortune
 * transforms that commercial acumen into permanent resource advantage —
 * two mana crystals that persist for the rest of the match.
 *
 * Reward: Build a successful trade empire in Trade Empire mode.
 *
 * Balance: 3 cost spell. Gain 2 permanent mana is a premium ramp
 * effect worth ~3-4 mana. Fair at 3 cost for a reward-exclusive card.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_trade_empire" as CardDefinition["id"],
  name: "Merchant's Fortune",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "mf_gain_2_perm_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 2 },
        permanent: true,
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_trade_empire.webp"),
  flavorText:
    "Adjudicar Locke once said that mana is just money by another name. He was not wrong.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
