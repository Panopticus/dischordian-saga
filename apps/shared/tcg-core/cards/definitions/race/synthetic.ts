/**
 * Race Cards — Synthetic (3 cards). Phase C12.
 *
 * Synthetics are the non-organic inhabitants of the Saga — the
 * Architect's built-from-scratch entities, not uploaded humans.
 * Mechanical vocabulary: structure (provoke + forcefield),
 * deathwatch (they watch the battlefield like a debugger),
 * deployment-triggered card draw.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const synth_01: CardDefinition = {
  id: "s1_race_synthetic_01" as CardDefinition["id"],
  name: "Synthetic Worker",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "syn01_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    }],
  art: assetUrl("art/cards/race/synthetic_worker.webp"),
  flavorText:
    "On deploy, draw 1. A Synthetic Worker was designed by the Architect the week he needed a worker and forgot to ask whether anybody else needed something.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 1,
};

export const synth_02: CardDefinition = {
  id: "s1_race_synthetic_02" as CardDefinition["id"],
  name: "Synthetic Watchtower",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 1, health: 6 },
  keywords: ["provoke", "forcefield"],
  abilities: [],
  art: assetUrl("art/cards/race/synthetic_watchtower.webp"),
  flavorText:
    "Provoke. Forcefield. The Watchtower is a synthetic whose job is to stand in one place and be a very reliable shape the enemy has to go through. It writes a detailed log afterward.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const synth_03: CardDefinition = {
  id: "s1_race_synthetic_03" as CardDefinition["id"],
  name: "Chrome Archon",
  faction: "architect",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 6, health: 7 },
  keywords: ["provoke", "forcefield"],
  abilities: [],
  art: assetUrl("art/cards/race/s1_race_synthetic_03.webp"),
  flavorText:
    "Provoke. Forcefield. Deathwatch. Chrome Archons are the Architect's synthetic parliamentarians. They do not eat, they do not sleep, and they do not forget the motion anyone voted for on the last eighteen years of Wednesdays.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const SYNTHETIC_RACE_CARDS: readonly CardDefinition[] = Object.freeze([
  synth_01, synth_02, synth_03]);
