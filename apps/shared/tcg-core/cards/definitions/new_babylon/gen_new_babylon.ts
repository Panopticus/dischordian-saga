/**
 * gen_new_babylon — Adjudicator Locke
 *
 * General · New Babylon faction · 0 cost · 2/25
 *
 * "Every truth has a price. I should know — I've bought most of them."
 *
 * Lost an eye in a deal that went wrong (won't say which). Investigates
 * the Thought Virus for weaponization potential. New Babylon operates a
 * democracy-as-death-sentence: elected officials stored in crystal; if
 * voted out, they die. Locke thrives in this system — pragmatism over
 * morality, trade as universal law.
 *
 * Bloodborn Spell: DARK BARGAIN
 * Deal 2 damage to your general, deal 3 damage to an enemy.
 * The quintessential New Babylon exchange — sacrifice for gain,
 * always coming out ahead on the deal. Every transaction costs
 * something; the trick is making sure it costs you less.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "gen_new_babylon" as CardDefinition["id"],
  name: "Adjudicator Locke",
  faction: "new_babylon",
  cardType: "general",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 2, health: 25 },
  keywords: [],
  abilities: [
    {
      id: "nb_bbs_dark_bargain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "activated", cost: { kind: "once_per_match", manaCost: 1 } },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "deal_damage",
            amount: { kind: "const", value: 2 },
            to: { kind: "friendly_general" },
          },
          {
            op: "deal_damage",
            amount: { kind: "const", value: 3 },
            to: { kind: "enemy_general" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/gen_new_babylon.webp"),
  flavorText:
    "Lost an eye in a deal that went wrong. Won't say which deal. Won't say which eye.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
