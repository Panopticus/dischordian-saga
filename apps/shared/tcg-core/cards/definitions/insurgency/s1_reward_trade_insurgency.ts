/**
 * s1_reward_trade_insurgency — Smuggler's Cache
 *
 * Rare spell · Insurgency faction · 2 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Draw 2 cards. The black market always has what you need —
 *    if you know who to ask."
 *
 * Lore: The Trade Empire's underground runs on smuggled goods and
 * forbidden information. Players who build a successful Insurgency
 * trade network learn to exploit supply chains that the authorities
 * can't track. The Smuggler's Cache represents a hidden stash of
 * resources accumulated through illicit trade.
 *
 * Reward: Build an Insurgency-aligned trade network in Trade Empire mode.
 *
 * Balance: 2 cost spell. Draw 2 is the standard rate for 2 mana
 * (cf. Signal Intercept). On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_trade_insurgency" as CardDefinition["id"],
  name: "Smuggler's Cache",
  faction: "insurgency",
  cardType: "spell",
  rarity: "rare",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "sc_draw_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_reward_trade_insurgency.webp",
  flavorText:
    "Every crate had a false bottom. Every false bottom had a frequency. Every frequency led to Agent Zero's ghost.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
