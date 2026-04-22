/**
 * s1_reward_eidolon_echo — Echo, the Resonance
 *
 * Rare unit · Insurgency faction · 4 cost · 3/4
 * Keywords: none
 *
 * Oracle text:
 *   "Whenever this unit deals damage, heal your general for 1.
 *    Every blow she strikes rings outward, mending what was broken."
 *
 * Lore: Echo is an Eidolon of the Insurgency — a spectral entity
 * born from the reverberations of rebellion. At max bond, Echo's
 * resonance manifests as a card that heals its owner with every
 * strike. The Insurgency fights to destroy, but Echo proves that
 * even destruction can carry echoes of restoration.
 *
 * Reward: Reach max bond with Eidolon Echo.
 *
 * Balance: 4 cost · 3/4 = 7 stats. Budget = 4*2+1 = 9. Heal general
 * 1 on damage dealt is conditional and incremental ~1 stat. 9 - 1 =
 * 8. Slightly below at 7 but the sustain effect has high upside
 * across multiple combats. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_reward_eidolon_echo" as CardDefinition["id"],
  name: "Echo, the Resonance",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "echo_heal_on_hit" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 1 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_reward_eidolon_echo.webp"),
  flavorText:
    "Every blow she strikes rings outward, mending what was broken.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
