/**
 * s1_char_077 — Mind Rot Drone
 *
 * Rare unit · Thought Virus faction · 5 cost · 6/5
 * Keywords: flying, pierce
 *
 * An aerial bio-weapon that dissolves mental barriers from above.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_077" as CardDefinition["id"],
  name: "Mind Rot Drone",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 6, health: 5 },
  keywords: ["flying", "pierce"],
  abilities: [],
  art: "placeholder",
  flavorText:
    "It circles above the battlefield like a vulture — except it feeds on sanity, not carrion.",
  rulesVersion: "1.0.0",
};
