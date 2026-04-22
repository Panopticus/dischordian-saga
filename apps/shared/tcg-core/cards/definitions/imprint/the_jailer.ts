/**
 * Imprint Set — The Jailer (5 tiers). Phase F20.
 *
 * Enforcer of the Rotation. Holds the lion's mouth shut by patience.
 * Architect faction. Mechanical vocabulary: provoke, forcefield,
 * endurance. The Jailer does not attack. The Jailer outlasts.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const jailer_t1: CardDefinition = {
  id: "s1_imprint_the_jailer_t1" as CardDefinition["id"],
  name: "Imprint: The Jailer (Common)",
  faction: "architect", cardType: "unit", rarity: "common",
  cost: 3, baseStats: { power: 1, health: 6 },
  keywords: ["provoke"], abilities: [],
  art: assetUrl("art/cards/imprint/s1_imprint_the_jailer_t1.webp"),
  flavorText: "Provoke. A massive figure at the cell door. He does not move, because what is in front of him is not trying to move either.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const jailer_t2: CardDefinition = {
  id: "s1_imprint_the_jailer_t2" as CardDefinition["id"],
  name: "Imprint: The Jailer (Uncommon)",
  faction: "architect", cardType: "unit", rarity: "uncommon",
  cost: 4, baseStats: { power: 2, health: 7 },
  keywords: ["provoke"], abilities: [],
  art: assetUrl("art/cards/imprint/s1_imprint_the_jailer_t2.webp"),
  flavorText: "Provoke. The Rotation has a schedule. He has a watch. The watch agrees with the schedule, so far.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const jailer_t3: CardDefinition = {
  id: "s1_imprint_the_jailer_t3" as CardDefinition["id"],
  name: "Imprint: The Jailer (Rare)",
  faction: "architect", cardType: "unit", rarity: "rare",
  cost: 5, baseStats: { power: 3, health: 9 },
  keywords: ["provoke", "forcefield"], abilities: [],
  art: assetUrl("art/cards/imprint/s1_imprint_the_jailer_t3.webp"),
  flavorText: "Provoke. Forcefield. You cannot get past him in a way that matters to anything on the other side of him.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const jailer_t4: CardDefinition = {
  id: "s1_imprint_the_jailer_t4" as CardDefinition["id"],
  name: "Imprint: The Jailer (Epic)",
  faction: "architect", cardType: "unit", rarity: "epic",
  cost: 6, baseStats: { power: 4, health: 10 },
  keywords: ["provoke", "forcefield", "rebirth"], abilities: [],
  art: assetUrl("art/cards/imprint/s1_imprint_the_jailer_t4.webp"),
  flavorText: "Provoke. Forcefield. Rebirth. The Jailer does not end his shift. The shift ends around him and he re-certifies without comment.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const jailer_t5: CardDefinition = {
  id: "s1_imprint_the_jailer_t5" as CardDefinition["id"],
  name: "The Jailer, Rotation-Shaped",
  faction: "architect", cardType: "unit", rarity: "legendary",
  cost: 7, baseStats: { power: 5, health: 12 },
  keywords: ["provoke", "forcefield", "rebirth"], abilities: [],
  art: assetUrl("art/cards/imprint/s1_imprint_the_jailer_t5.webp"),
  flavorText:
    "Provoke. Forcefield. Rebirth. The Jailer does not hate the prisoners and he does not hate the Architect. He hates the rotation. He lives longer than everyone he guards and he remembers all of them. He never says their names out loud because saying them out loud would count as a second crime on top of the first.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const THE_JAILER_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  jailer_t1, jailer_t2, jailer_t3, jailer_t4, jailer_t5,
]);
