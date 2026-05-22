/**
 * s1_blast_004 — Pyre Swarm
 *
 * Rare unit · Thought Virus faction · 5 cost · 4/6
 *
 * audit/09.F3 expansion. Thought Virus's blast variant: the
 * swarm doesn't pick a host; the swarm picks a row of hosts.
 * Concept-load applied to all enemies in line on attack.
 *
 * 4/6 (=10) at cost 5 (expected 11, tol ±20%) is within curve.
 */
import type { CardDefinition } from "../../../index";
import { assetUrl } from "@shared/lib/assetUrl";

export const cardDef: CardDefinition = {
  id: "s1_blast_004_pyre_swarm" as CardDefinition["id"],
  name: "Pyre Swarm",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: ["blast"],
  abilities: [],
  art: assetUrl("art/cards/thought_virus/pyre_swarm.webp"),
  flavorText:
    "The strain does not infect a self. The strain infects a sentence and waits for selves to read it.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: -1,
};
