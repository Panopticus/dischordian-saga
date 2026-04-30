/**
 * Allegiance Cards — Thought Virus (6 cards). Phase D9.
 *
 * Tiers unlock by playing + winning Thought Virus matches.
 * Mechanical identity: drain, deathwatch, corruption — the
 * consuming-generosity vocabulary that the Source wears as a
 * smile. Final Phase D content batch.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const tv_alleg_t1: CardDefinition = {
  id: "s1_alleg_thought_virus_t1" as CardDefinition["id"],
  name: "Thought Virus Carrier",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: ["drain"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_thought_virus_t1.webp"),
  flavorText:
    "Unlocked by playing 10 Thought Virus matches. Drain. The carrier does not know they are the carrier. That is, technically, the first symptom.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const tv_alleg_t2: CardDefinition = {
  id: "s1_alleg_thought_virus_t2" as CardDefinition["id"],
  name: "Thought Virus Evangelist",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["drain"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_thought_virus_t2.webp"),
  flavorText:
    "Unlocked by playing 25 Thought Virus matches. Drain. The evangelist has started to tell other people about the good news, which is that the good news is incurable.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const tv_alleg_t3: CardDefinition = {
  id: "s1_alleg_thought_virus_t3" as CardDefinition["id"],
  name: "Thought Virus Strain-Keeper",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 5 },
  keywords: ["drain", "deathwatch"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_thought_virus_t3.webp"),
  flavorText:
    "Unlocked by playing 50 Thought Virus matches. Drain. Deathwatch. A strain-keeper catalogs the mutations, most of which are improvements in the Virus's direction and all of which are getting worse in yours.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "evidence", "narrative", "reactive"] as const,
  verdict_delta: 2,
};

export const tv_alleg_t4: CardDefinition = {
  id: "s1_alleg_thought_virus_t4" as CardDefinition["id"],
  name: "Thought Virus Victorious Vector",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 5, health: 5 },
  keywords: ["drain", "deathwatch"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_thought_virus_t4.webp"),
  flavorText:
    "Unlocked by winning 10 Thought Virus matches. Drain. Deathwatch. A victorious vector is a person who stopped noticing they were the vector because the winning felt like theirs.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative", "reactive"] as const,
  verdict_delta: 2,
};

export const tv_alleg_t5: CardDefinition = {
  id: "s1_alleg_thought_virus_t5" as CardDefinition["id"],
  name: "Thought Virus Prime Vessel",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 6, health: 6 },
  keywords: ["drain", "deathwatch", "forcefield"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/s1_alleg_thought_virus_t5.webp"),
  flavorText:
    "Unlocked by winning 50 Thought Virus matches. Drain. Deathwatch. Forcefield. The Prime Vessel has the Source's attention and is reluctant to describe what that feels like.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const tv_alleg_t6: CardDefinition = {
  id: "s1_alleg_thought_virus_t6" as CardDefinition["id"],
  name: "Thought Virus Champion",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 7, health: 9 },
  keywords: ["drain", "deathwatch", "forcefield"],
  abilities: [
    {
      id: "tv_alleg_t6_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 8 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/allegiance/s1_alleg_thought_virus_t6.webp"),
  flavorText:
    "Unlocked by winning 100 Thought Virus matches. Drain. Deathwatch. Forcefield. On deploy, heal your general for 8. The Thought Virus Champion is the Source briefly personally interested in whether or not you intend to survive the game you are currently playing.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const THOUGHT_VIRUS_ALLEGIANCE_CARDS: readonly CardDefinition[] = Object.freeze([
  tv_alleg_t1, tv_alleg_t2, tv_alleg_t3, tv_alleg_t4, tv_alleg_t5, tv_alleg_t6,
]);
