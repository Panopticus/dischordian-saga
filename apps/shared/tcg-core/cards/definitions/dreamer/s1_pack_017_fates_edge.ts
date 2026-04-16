/**
 * s1_pack_017 — Fate's Edge
 *
 * Rare unit · Dreamer faction · 4 cost · 4/4
 *
 * Oracle text:
 *   "On deploy, stun an enemy unit and give self forcefield.
 *    Fate cuts both ways — one frozen, one shielded."
 *
 * Premium midrange unit that arrives with immediate board impact.
 * Stuns a threat while protecting itself with forcefield. A two-for-one
 * that stabilizes the board and establishes a resilient threat. One
 * of the strongest rare units in the set.
 *
 * Mechanical model:
 *  - On deploy: sequence of stun an enemy (player-chosen) for 1 turn,
 *    then add 1 forcefield charge to self.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_017" as CardDefinition["id"],
  name: "Fate's Edge",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "fe_stun_shield" as CardDefinition["abilities"][number]["id"],
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
            op: "add_counter",
            kind: "forcefield_charges",
            amount: 1,
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_pack_017.webp",
  flavorText:
    "She saw the blade that would end her. She chose the timeline where it froze mid-swing.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence"] as const,
};
