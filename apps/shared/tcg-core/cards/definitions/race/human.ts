/**
 * Race Cards — Human (3 cards). Phase C13.
 *
 * Humans are the baseline — pre-Fall genetic stock, mostly
 * preserved on the Arks. Mechanical vocabulary: balanced stats,
 * rebirth (they keep getting back up), provoke (they stand
 * between their people and the thing coming).
 *
 * Final Phase C batch.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const human_01: CardDefinition = {
  id: "s1_race_human_01" as CardDefinition["id"],
  name: "Ark Survivor",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["rebirth"],
  abilities: [],
  art: assetUrl("art/cards/race/human_citizen_of_atarion.webp"),
  flavorText:
    "Rebirth. An Ark survivor was in a cryotube when Atarion burned. They woke up eleven years later than they should have and have been working every Wednesday ever since.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const human_02: CardDefinition = {
  id: "s1_race_human_02" as CardDefinition["id"],
  name: "Senate Legionary",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["provoke"],
  abilities: [],
  art: assetUrl("art/cards/race/human_senate_legionary.webp"),
  flavorText:
    "Provoke. A Senate Legionary was the last physical guard standing between Elara Voss and the Hierarchy's shock troops the day Atarion voted for the war. They did not survive the meeting. The vote did.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const human_03: CardDefinition = {
  id: "s1_race_human_03" as CardDefinition["id"],
  name: "The Final Potential",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 5,
  baseStats: { power: 5, health: 6 },
  keywords: ["provoke", "rebirth"],
  abilities: [
    {
      id: "hum03_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 5 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/race/human_final_potential.webp"),
  flavorText:
    "Provoke. Rebirth. On deploy, heal your general for 5. The Potentials are the ten thousand humans asleep in the Ark's cryo vaults. The Final Potential is the one the Saga has elected to wake up last, because the Saga already knows which one they need, and it is not yet time.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const HUMAN_RACE_CARDS: readonly CardDefinition[] = Object.freeze([
  human_01, human_02, human_03,
]);
