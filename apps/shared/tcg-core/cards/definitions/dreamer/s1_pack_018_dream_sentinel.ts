/**
 * s1_pack_018 — Dream Sentinel
 *
 * Common unit · Dreamer faction · 2 cost · 1/4
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. On deploy, gain +0/+1. The dream holds the line."
 *
 * Defensive common with provoke and a deploy health bonus. Effective
 * statline of 1/5 for 2 mana — an excellent early-game wall that
 * forces opponents to chew through it. Enables the Dreamer's card
 * advantage engine to get online safely.
 *
 * Mechanical model:
 *  - Provoke: intrinsic keyword. On deploy, buff self +0/+1 permanently.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_018" as CardDefinition["id"],
  name: "Dream Sentinel",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 4 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "ds_deploy_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "It dreams of an impenetrable wall. And so the wall exists.",
  rulesVersion: "1.0.0",
};
