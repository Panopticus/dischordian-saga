/**
 * Race Cards — Demagi (3 cards). Phase C9.
 *
 * Demagi are the Saga's native demon-stock, the Hierarchy of the
 * Damned's rank-and-file. Mechanical vocabulary: drain (they
 * feed), deathwatch (a demon counts corpses for a living),
 * provoke (they want to be fought first).
 */
import type { CardDefinition } from "../../../index";

export const demagi_01: CardDefinition = {
  id: "s1_race_demagi_01" as CardDefinition["id"],
  name: "Demagi Footsoldier",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: ["drain"],
  abilities: [],
  art: "/art/cards/race/s1_race_demagi_01.webp",
  flavorText:
    "Drain. A Demagi footsoldier gets paid in whatever feeling the engagement generates. The payroll is always on time.",
  rulesVersion: "1.0.0",
};

export const demagi_02: CardDefinition = {
  id: "s1_race_demagi_02" as CardDefinition["id"],
  name: "Demagi Corpse-Reader",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["drain", "deathwatch"],
  abilities: [],
  art: "/art/cards/race/s1_race_demagi_02.webp",
  flavorText:
    "Drain. Deathwatch. Corpse-Readers are the Hierarchy's forensic accountants. Every death on the board is a line item on a ledger only she knows how to audit.",
  rulesVersion: "1.0.0",
};

export const demagi_03: CardDefinition = {
  id: "s1_race_demagi_03" as CardDefinition["id"],
  name: "Xeth'Raal, Demagi Archlord",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 6, health: 7 },
  keywords: ["drain", "deathwatch", "provoke"],
  abilities: [],
  art: "/art/cards/race/s1_race_demagi_03.webp",
  flavorText:
    "Drain. Deathwatch. Provoke. Xeth'Raal is the Demagi archlord who arranged the Game Master's death by sending Agent Zero his strategic playbook. He has kept a copy of the playbook ever since, for sentimental reasons.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};

export const DEMAGI_RACE_CARDS: readonly CardDefinition[] = Object.freeze([
  demagi_01, demagi_02, demagi_03,
]);
