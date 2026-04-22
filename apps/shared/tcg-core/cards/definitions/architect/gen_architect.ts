/**
 * gen_architect — The Architect
 *
 * General · Architect faction · 0 cost · 2/25
 *
 * "I foresaw this moment the day I built the Arena."
 *
 * The entity that designed the Collector's Arena to contain the Oracle's
 * prophecy. Wore the Oracle's face for a decade as the Meme's puppet.
 * His schematic rolls out like an apology — every cage key is in the
 * Prisoner's teeth. Final boss of Season 1.
 *
 * Bloodborn Spell: PREDETERMINED DESIGN
 * Summon a 1/1 Calculation token on a random empty tile nearby.
 * Represents the Architect's belief that every outcome can be
 * calculated and predetermined — order through control.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "gen_architect" as CardDefinition["id"],
  name: "The Architect",
  faction: "architect",
  cardType: "general",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 2, health: 25 },
  keywords: [],
  abilities: [
    {
      id: "arch_bbs_predetermined" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "activated", cost: { kind: "once_per_match", manaCost: 1 } },
      effect: {
        op: "summon",
        tokenId: "tok_calculation",
        at: { kind: "random_empty", within: { row: 0, col: 0, radius: 2 } },
        controller: "self",
      },
    },
  ],
  art: assetUrl("art/cards/gen_architect.webp"),
  flavorText:
    "Every corridor is yours. Every cage key is in your teeth. Every prophecy I stole is whispered back in the order I took them.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
