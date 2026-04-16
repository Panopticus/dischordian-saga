/**
 * s1_reward_tower_wave50 — Terminus Bulwark
 *
 * Epic unit · Architect faction · 6 cost · 5/8
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke. At the start of your turn, heal self for 2.
 *    The last wall standing when every wave has broken."
 *
 * Lore: Surviving wave 50 in Tower Defense mode proves the player can
 * build defenses that endure the unendurable. The Terminus Bulwark is
 * the ultimate defensive unit — an Architect-engineered fortress given
 * sentience. Its provoke forces engagement, and its self-healing
 * ensures it outlasts whatever comes.
 *
 * Reward: Survive wave 50 in Tower Defense mode.
 *
 * Balance: 6 cost · 5/8 = 13 stats. Budget = 6*2+1 = 13. Provoke
 * keyword costs 1 stat, heal self 2 per turn ~1 stat. 13 - 2 = 11.
 * At 13 base stats the abilities come at a premium, but provoke +
 * self-sustain is the identity. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_tower_wave50" as CardDefinition["id"],
  name: "Terminus Bulwark",
  faction: "architect",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 5, health: 8 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "tb_self_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_reward_tower_wave50.webp",
  flavorText:
    "Fifty waves broke against it. The fifty-first is still trying.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};
