/**
 * s1_reward_boss_architect — Architect's Schematic
 *
 * Rare spell · Architect faction · 5 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Summon two 1/1 Calculation tokens. Draw 1 card.
 *    The Architect's blueprints persist even after his defeat."
 *
 * Lore: Mastering The Architect boss — the game's designer-within-the-game —
 * teaches the player to think like the system itself. The Schematic is a
 * fragment of the Architect's own design language: it generates disposable
 * units and extracts information, echoing the Architect's control paradigm.
 *
 * Reward: Master The Architect boss.
 *
 * Balance: 5 cost spell. Summon two 1/1 tokens ~2 mana, draw 1 ~1.5 mana.
 * Total ~3.5 mana of value at 5 cost — slightly below rate, but board
 * presence + draw is flexible. Fair for a reward spell.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_boss_architect" as CardDefinition["id"],
  name: "Architect's Schematic",
  faction: "architect",
  cardType: "spell",
  rarity: "rare",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "as_summon_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "repeat",
            times: { kind: "const", value: 2 },
            do: {
              op: "summon",
              tokenId: "tok_calculation",
              at: { kind: "random_empty" },
              controller: "self",
            },
          },
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "self",
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_boss_architect.webp"),
  flavorText:
    "The Architect fell, but his schematics survived. Every line is a command. Every command still works.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
