/**
 * s1_pack_027 — Terminus Dreadnought
 *
 * Legendary unit · Thought Virus faction · 8 cost · 7/10
 *
 * Oracle text:
 *   "At the start of your turn, deal 2 damage to all enemy units.
 *    On death, deal 3 damage to all enemy units.
 *    The end arrives. Twice."
 *
 * THE Thought Virus pack chase card. A monstrous body that radiates
 * 2 damage to every enemy each turn — a walking board clear. If the
 * opponent finally manages to destroy it, the death trigger deals 3
 * to everything, often wiping whatever survived. There is no good
 * answer. Premium legendary.
 *
 * Mechanical model:
 *  - On turn start: foreach enemy deal 2.
 *  - On death: foreach enemy deal 3.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_027" as CardDefinition["id"],
  name: "Terminus Dreadnought",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 7, health: 10 },
  keywords: [],
  abilities: [
    {
      id: "td_turn_aoe" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
    {
      id: "td_death_aoe" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 3 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "It does not chase. It simply exists, and everything around it decays. Destroying it only accelerates the process.",
  rulesVersion: "1.0.0",
};
