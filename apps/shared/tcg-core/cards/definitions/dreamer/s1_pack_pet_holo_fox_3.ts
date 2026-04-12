/**
 * s1_pack_pet_holo_fox_3 — Holographic Apex Fox
 *
 * Epic unit · Dreamer faction · 5 cost · 4/5
 * Keywords: flying
 *
 * Oracle text:
 *   "Flying. On deploy, stun a random enemy unit and draw 1 card.
 *    It no longer phases between worlds. It is both at once."
 *
 * Lore: The Holographic Apex Fox is the final evolution — a creature
 * of pure prismatic energy that exists simultaneously in every
 * frequency of light. Its arrival stuns an enemy with a blinding
 * holographic burst and draws a card as its multidimensional
 * awareness feeds intelligence back to its master.
 *
 * Pet Evolution: Holographic Fox stage 3 of 3.
 * Collect all 3 stages to unlock the Holographic Fox card back.
 *
 * Balance: 5 cost · 4/5 = 9 stats. Budget = 5*2+1 = 11. Flying ~1
 * stat, random stun ~1 stat, draw 1 ~1 stat. 11 - 3 = 8. Slightly
 * over at 9, but epic pack-exclusive capstone. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_pet_holo_fox_3" as CardDefinition["id"],
  name: "Holographic Apex Fox",
  faction: "dreamer",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 5 },
  keywords: ["flying"],
  abilities: [
    {
      id: "haf_deploy_stun_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "with_target",
            selector: {
              kind: "single",
              filter: { controller: "opponent" },
              chooser: "random",
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
  art: "placeholder",
  flavorText:
    "It no longer phases between worlds. It is both at once.",
  rulesVersion: "1.0.0",
};
