/**
 * s1_pack_seed_chess — The Game Master's Challenge
 *
 * Epic unit · Architect faction · 5 cost · 4/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, stun an enemy for 1 turn and draw 1.
 *    Every game is a test. Every test has a purpose only the
 *    Game Master understands."
 *
 * Lore: The Game Master is an Architect entity that views all of
 * existence as a vast strategic exercise. Their challenge is not
 * combat — it is comprehension. The stun represents the paralyzing
 * revelation of facing an intellect that has already calculated
 * every possible outcome. The card draw is the Game Master's gift:
 * a single insight into the shape of the game.
 *
 * Cross-game seed: Collecting this card unlocks the Game Master as
 * a chess opponent.
 *
 * Balance: 5 cost · 4/5 = 9 stats. Budget = 5*2+1 = 11. Targeted
 * stun 1 turn ~1 stat, draw 1 ~1 stat. 11 - 2 = 9. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_seed_chess" as CardDefinition["id"],
  name: "The Game Master's Challenge",
  faction: "architect",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "gmc_deploy_stun_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "with_target",
            selector: {
              kind: "single",
              filter: { controller: "opponent" },
              chooser: "player",
            },
            do: {
              op: "stun",
              duration: { kind: "n_turns", n: 1 },
              to: { kind: "it" },
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
  art: assetUrl("art/cards/s1_pack_seed_chess.webp"),
  flavorText:
    "Every game is a test. Every test has a purpose only the Game Master understands.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
