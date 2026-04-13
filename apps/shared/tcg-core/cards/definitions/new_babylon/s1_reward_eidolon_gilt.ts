/**
 * s1_reward_eidolon_gilt — Gilt, the Living Coin
 *
 * Rare unit · New Babylon faction · 4 cost · 3/5
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, gain 1 permanent mana crystal.
 *    Every sigil on his shell is a promise New Babylon has not yet broken."
 *
 * Lore: Gilt is a Path A starter Eidolon — a small ornate beetle
 * whose polished gold shell bears engraved Babylonian sigils, a
 * living coin of the New Babylon economy. Bonded through the Eidolon
 * Bond system, Gilt rewards New-Babylon-aligned Soul-Keepers with
 * lasting prosperity. His arrival is a transaction the house always
 * honors — at least the first time.
 *
 * Reward: Reach max bond with Eidolon Gilt.
 *
 * Balance: 4 cost · 3/5 = 8 stats. Budget = 4*2+1 = 9. Permanent
 * mana crystal on deploy ~1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_gilt" as CardDefinition["id"],
  name: "Gilt, the Living Coin",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "gilt_tithe_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 1 },
        permanent: true,
      },
    },
  ],
  art: "/art/spectral/spectral-gilt.png",
  flavorText:
    "Every sigil on his shell is a promise New Babylon has not yet broken.",
  rulesVersion: "1.0.0",
};
