/**
 * Dimension Cards — Space (3 cards). Phase C5.
 *
 * Space as a Dischordian dimension is not outer space — it is the
 * dimension of distance itself. Mechanical vocabulary: celerity
 * (the unit is in two places this turn), rush (the unit was
 * already where you needed it), airdrop (the unit can deploy
 * anywhere on the board).
 */
import type { CardDefinition } from "../../../index";

export const space_01: CardDefinition = {
  id: "s1_dim_space_01" as CardDefinition["id"],
  name: "Parallax Walker",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["airdrop"],
  abilities: [],
  art: "/art/cards/dimension/s1_dim_space_01.webp",
  flavorText:
    "Airdrop. She does not walk to where she needs to be. The distance between where she was and where she needed to be agreed to close itself.",
  rulesVersion: "1.0.0",
};

export const space_02: CardDefinition = {
  id: "s1_dim_space_02" as CardDefinition["id"],
  name: "Folded Distance",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["airdrop", "celerity"],
  abilities: [],
  art: "/art/cards/dimension/s1_dim_space_02.webp",
  flavorText:
    "Airdrop. Celerity. The Folded Distance's attack is not a second attack. It is the same attack, delivered in two places, while the attacker apologizes in the third.",
  rulesVersion: "1.0.0",
};

export const space_03: CardDefinition = {
  id: "s1_dim_space_03" as CardDefinition["id"],
  name: "The Cartographer of Elsewhere",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 5, health: 6 },
  keywords: ["airdrop", "celerity", "flying"],
  abilities: [
    {
      id: "space03_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "rush",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/dimension/s1_dim_space_03.webp",
  flavorText:
    "Airdrop. Celerity. Flying. Rush on deploy. The Cartographer of Elsewhere does not draw maps. He writes letters to places, and the places answer, and the answers are the maps.",
  rulesVersion: "1.0.0",
};

export const SPACE_DIMENSION_CARDS: readonly CardDefinition[] = Object.freeze([
  space_01, space_02, space_03,
]);
