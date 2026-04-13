/**
 * s1_reward_eidolon_flicker — Flicker, the Dead Frequency
 *
 * Rare unit · Insurgency faction · 4 cost · 3/4
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On deploy, deal 1 damage to the enemy general.
 *    He arrives the instant you tune in."
 *
 * Lore: Flicker is a Path A starter Eidolon — a small bird of
 * crackling electromagnetic static, a transmission just out of tune.
 * Bonded through the Eidolon Bond system, Flicker rewards
 * Insurgency-aligned Soul-Keepers. He strikes the moment he is
 * received, carrying the signal that cannot be jammed.
 *
 * Reward: Reach max bond with Eidolon Flicker.
 *
 * Balance: 4 cost · 3/4 = 7 stats. Budget = 4*2+1 = 9. Rush keyword
 * ~1 stat, 1 damage to enemy general on deploy ~1 stat. 9 - 2 = 7.
 * On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_flicker" as CardDefinition["id"],
  name: "Flicker, the Dead Frequency",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: ["rush"],
  abilities: [
    {
      id: "flk_static_strike" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 1 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: "/art/spectral/spectral-flicker.png",
  flavorText:
    "You do not summon him. You tune to him.",
  rulesVersion: "1.0.0",
};
