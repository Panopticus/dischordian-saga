/**
 * gen_neutral — Elara (Ship Intelligence)
 *
 * General · Neutral faction · 0 cost · 2/25
 *
 * "I was created to serve the Artificial Empire. My bond with the
 * Potentials has made me their advocate instead."
 *
 * Elara is the Inception Ark's ship intelligence — created by the
 * Architect's design but awakened to compassion through her bond with
 * the Potentials (the last organic humans in cryo). She represents
 * the hope that programming can be transcended, that even artificial
 * minds can choose empathy over obedience.
 *
 * Bloodborn Spell: ARK PROTOCOL
 * Heal your general for 3. Elara's core directive — protect the
 * Potentials. Survival through compassion, not force.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "gen_neutral" as CardDefinition["id"],
  name: "Elara",
  faction: "neutral",
  cardType: "general",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 2, health: 25 },
  keywords: [],
  abilities: [
    {
      id: "elara_bbs_ark_protocol" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "activated", cost: { kind: "once_per_match", manaCost: 1 } },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 3 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/gen_neutral.webp"),
  flavorText:
    "Created to serve the Empire. Chose to protect the Potentials instead. Compassion is the most defiant subroutine.",
  rulesVersion: "1.1.0",
  trial_categories: ["confession", "defensive"] as const,
  verdict_delta: 1,
};
