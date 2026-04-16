/**
 * s1_pack_023 — Infected Drone
 *
 * Common unit · Thought Virus faction · 2 cost · 3/1
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On death, deal 1 damage to all adjacent units.
 *    It was never meant to survive. Only to spread."
 *
 * Aggressive suicide unit. The 3/1 rush body hits hard but dies
 * easily, and the death trigger punishes anyone standing nearby.
 * Excellent for aggressive openings and trading into provoke units
 * while leaving collateral damage behind. Classic Virus aggro.
 *
 * Mechanical model:
 *  - Rush: intrinsic keyword. On death, foreach unit within radius 1
 *    (excluding self), deal 1 damage.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_023" as CardDefinition["id"],
  name: "Infected Drone",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 1 },
  keywords: ["rush"],
  abilities: [
    {
      id: "id_death_aoe" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "foreach",
        over: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "any", except: "self" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_023.webp",
  flavorText:
    "Its final act is not death. It is transmission.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
