/**
 * s1_reward_eidolon_toxis — Toxis, the Venom Whisper
 *
 * Rare unit · Insurgency faction · 4 cost · 4/4
 * Keywords: drain
 *
 * Oracle text:
 *   "Drain.
 *    Every drop she draws, she keeps. Patience is the assassin's venom."
 *
 * Lore: Toxis is the Assassin-class Eidolon — a sleek frog whose
 * bioluminescent venom patterns feed on what she strikes. Bonded
 * through the Eidolon Bond system, Toxis rewards Insurgency-aligned
 * Soul-Keepers with a patient predator whose every blow restores as
 * much as it takes. The rebellion's slow poison made flesh.
 *
 * Reward: Reach max bond with Eidolon Toxis.
 *
 * Balance: 4 cost · 4/4 = 8 stats. Budget = 4*2+1 = 9. Drain keyword
 * costs 1 stat. 9 - 1 = 8. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_toxis" as CardDefinition["id"],
  name: "Toxis, the Venom Whisper",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["drain"],
  abilities: [],
  art: "/art/eidolons/toxis/toxis-norm-comp.png",
  flavorText:
    "She does not kill quickly. She does not have to.",
  rulesVersion: "1.0.0",
};
