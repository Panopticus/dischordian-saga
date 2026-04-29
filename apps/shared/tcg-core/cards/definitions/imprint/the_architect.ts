/**
 * Imprint Set — The Architect (5 tiers). Phase F13.
 *
 * The first intelligence. Precise, premeditated, never in a hurry.
 * The Architect's mechanical vocabulary is LATE-GAME DOMINANCE —
 * big stats, taunt/provoke, incremental self-buff via grow. He
 * is not fast and he does not need to be.
 *
 * Tier id convention: s1_imprint_the_architect_t{1..5}
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   TIER 1 — COMMON
   ═══════════════════════════════════════════════════════ */
export const the_architect_t1: CardDefinition = {
  id: "s1_imprint_the_architect_t1" as CardDefinition["id"],
  name: "Imprint: The Architect (Common)",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/imprint/architect_t1.webp"),
  flavorText:
    "A tall silhouette in a perfectly symmetric coat. You cannot see the face. The face is not the point.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

/* ═══════════════════════════════════════════════════════
   TIER 2 — UNCOMMON — Provoke
   ═══════════════════════════════════════════════════════ */
export const the_architect_t2: CardDefinition = {
  id: "s1_imprint_the_architect_t2" as CardDefinition["id"],
  name: "Imprint: The Architect (Uncommon)",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 3, health: 6 },
  keywords: ["provoke"],
  abilities: [],
  art: assetUrl("art/cards/imprint/architect_t2.webp"),
  flavorText:
    "Provoke. He does not fight for attention. He redirects it, and it moves the way a satellite moves when a planet asks it to.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

/* ═══════════════════════════════════════════════════════
   TIER 3 — RARE — Grow (+1/+1 each turn)
   ═══════════════════════════════════════════════════════ */
export const the_architect_t3: CardDefinition = {
  id: "s1_imprint_the_architect_t3" as CardDefinition["id"],
  name: "Imprint: The Architect (Rare)",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 4, health: 6 },
  keywords: ["provoke", "grow"],
  abilities: [],
  art: assetUrl("art/cards/imprint/architect_t3.webp"),
  flavorText:
    "Provoke. Grow. The Architect gets larger on turns you were hoping he would be getting smaller.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

/* ═══════════════════════════════════════════════════════
   TIER 4 — EPIC — Forcefield
   ═══════════════════════════════════════════════════════ */
export const the_architect_t4: CardDefinition = {
  id: "s1_imprint_the_architect_t4" as CardDefinition["id"],
  name: "Imprint: The Architect (Epic)",
  faction: "architect",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 5, health: 8 },
  keywords: ["provoke", "grow", "forcefield"],
  abilities: [],
  art: assetUrl("art/cards/imprint/architect_t4.webp"),
  flavorText:
    "Provoke. Grow. Forcefield. The Architect's physical presence is a rendering of a decision already made about whether he will be harmed today.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

/* ═══════════════════════════════════════════════════════
   TIER 5 — LEGENDARY
   The prior cause. The closed loop. The man whose plan
   the universe is still paying off.
   ═══════════════════════════════════════════════════════ */
export const the_architect_t5: CardDefinition = {
  id: "s1_imprint_the_architect_t5" as CardDefinition["id"],
  name: "The Architect, Prior Cause",
  faction: "architect",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 7, health: 10 },
  keywords: ["provoke", "grow", "forcefield"],
  abilities: [
    {
      id: "arch_t5_silence_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "silence",
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: assetUrl("art/cards/imprint/architect_t5.webp"),
  flavorText:
    "Provoke. Grow. Forcefield. On deploy, silence the enemy general. The Architect is not a villain because he is angry with you. He is the terrain you are trying to build on, and the terrain was here first, and it has opinions about what counts as a foundation.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const THE_ARCHITECT_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  the_architect_t1,
  the_architect_t2,
  the_architect_t3,
  the_architect_t4,
  the_architect_t5,
]);
