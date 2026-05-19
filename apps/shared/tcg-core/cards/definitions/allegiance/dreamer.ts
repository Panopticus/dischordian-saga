/**
 * Allegiance Cards — Dreamer (6 cards). Phase D6.
 *
 * Tiers unlock by playing + winning Dreamer matches. Mechanical
 * identity: flying, dispel, draw, forcefield — prophetic vision
 * as board control.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const drm_alleg_t1: CardDefinition = {
  id: "s1_alleg_dreamer_t1" as CardDefinition["id"],
  name: "Dreamer Acolyte",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 3 },
  keywords: ["flying"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/dreamer_acolyte_t1.webp"),
  flavorText:
    "Unlocked by playing 10 Dreamer matches. Flying. An acolyte has not yet dreamed their future — they are still waiting for permission to stop being afraid of it.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};

export const drm_alleg_t2: CardDefinition = {
  id: "s1_alleg_dreamer_t2" as CardDefinition["id"],
  name: "Dreamer Visionary",
  faction: "dreamer",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: ["flying"],
  abilities: [
    {
      id: "drm_alleg_t2_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    },
  ],
  art: assetUrl("art/cards/allegiance/dreamer_seer_t2.webp"),
  flavorText:
    "Unlocked by playing 25 Dreamer matches. Flying. On deploy, draw 1. A visionary has started to recognize the pattern and has not yet learned to hide that they are recognizing it.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 1,
};

export const drm_alleg_t3: CardDefinition = {
  id: "s1_alleg_dreamer_t3" as CardDefinition["id"],
  name: "Dreamer Veteran",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: ["flying", "dispel"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/dreamer_visionary_t3.webp"),
  flavorText:
    "Unlocked by playing 50 Dreamer matches. Flying. Dispel. A Dreamer veteran has been wrong enough times to be trusted with being right.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const drm_alleg_t4: CardDefinition = {
  id: "s1_alleg_dreamer_t4" as CardDefinition["id"],
  name: "Dreamer Victorious Seer",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 6 },
  keywords: ["flying", "dispel"],
  abilities: [
    {
      id: "drm_alleg_t4_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" },
    },
  ],
  art: assetUrl("art/cards/allegiance/dreamer_prophet_t4.webp"),
  flavorText:
    "Unlocked by winning 10 Dreamer matches. Flying. Dispel. On deploy, draw 1. A seer who has won has stopped being surprised and started being concerned.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const drm_alleg_t5: CardDefinition = {
  id: "s1_alleg_dreamer_t5" as CardDefinition["id"],
  name: "Dreamer Elite",
  faction: "dreamer",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 4, health: 7 },
  keywords: ["flying", "dispel", "forcefield"],
  abilities: [],
  art: assetUrl("art/cards/allegiance/dreamer_dreamwalker_t5.webp"),
  flavorText:
    "Unlocked by winning 50 Dreamer matches. Flying. Dispel. Forcefield. An Elite Dreamer dreams the match before it happens and remembers having already lived it, which is terrifying for everybody at the table including the Elite.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const drm_alleg_t6: CardDefinition = {
  id: "s1_alleg_dreamer_t6" as CardDefinition["id"],
  name: "Dreamer Champion",
  faction: "dreamer",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 5, health: 8 },
  keywords: ["flying", "dispel", "forcefield"],
  abilities: [
    {
      id: "drm_alleg_t6_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 3 }, who: "self" },
    },
  ],
  art: assetUrl("art/cards/allegiance/dreamer_champion_t6.webp"),
  flavorText:
    "Unlocked by winning 100 Dreamer matches. Flying. Dispel. Forcefield. On deploy, draw 3. The Dreamer Champion is the Dreamer herself, making herself briefly available for one match because you have done the work.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const DREAMER_ALLEGIANCE_CARDS: readonly CardDefinition[] = Object.freeze([
  drm_alleg_t1, drm_alleg_t2, drm_alleg_t3, drm_alleg_t4, drm_alleg_t5, drm_alleg_t6,
]);
