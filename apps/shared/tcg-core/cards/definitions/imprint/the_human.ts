/**
 * Imprint Set — The Human (5 tiers). Phase F12.
 *
 * The Twelfth Archon. Last organic Archon. The Student who
 * survived Mechronis Academy. In the TCG he reads as detective
 * more than soldier — his mechanical vocabulary is revealing
 * hidden information, drawing the extra card, and having one
 * good idea per turn that nobody else was going to have.
 *
 * Keywords: backstab, deathwatch. On-deploy card draw scaling
 * with tier. At the legendary tier, an extra ability that lets
 * him see the top card of the opponent's deck each turn.
 *
 * Tier id convention: s1_imprint_the_human_t{1..5}
 */
import type { CardDefinition } from "../../../index";

/* ═══════════════════════════════════════════════════════
   TIER 1 — COMMON
   ═══════════════════════════════════════════════════════ */
export const the_human_t1: CardDefinition = {
  id: "s1_imprint_the_human_t1" as CardDefinition["id"],
  name: "Imprint: The Human (Common)",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [],
  art: "/art/cards/imprint/s1_imprint_the_human_t1.webp",
  flavorText:
    "A figure in a long coat at the edge of the Mechronis playground, watching. He is twelve years old and he has already decided how this ends.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};

/* ═══════════════════════════════════════════════════════
   TIER 2 — UNCOMMON — backstab keyword
   ═══════════════════════════════════════════════════════ */
export const the_human_t2: CardDefinition = {
  id: "s1_imprint_the_human_t2" as CardDefinition["id"],
  name: "Imprint: The Human (Uncommon)",
  faction: "insurgency",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["backstab"],
  abilities: [],
  art: "/art/cards/imprint/s1_imprint_the_human_t2.webp",
  flavorText:
    "Backstab. He prefers to be behind you. You prefer for anyone you like to not be behind you. These preferences are not compatible and he worked that out first.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
};

/* ═══════════════════════════════════════════════════════
   TIER 3 — RARE — Draw 1 on deploy
   ═══════════════════════════════════════════════════════ */
export const the_human_t3: CardDefinition = {
  id: "s1_imprint_the_human_t3" as CardDefinition["id"],
  name: "Imprint: The Human (Rare)",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["backstab"],
  abilities: [
    {
      id: "th_t3_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_the_human_t3.webp",
  flavorText:
    "Backstab. On deploy, draw a card. He does not enter a room without already having read the case file the room is about.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence"] as const,
};

/* ═══════════════════════════════════════════════════════
   TIER 4 — EPIC — Deathwatch + draw 1
   ═══════════════════════════════════════════════════════ */
export const the_human_t4: CardDefinition = {
  id: "s1_imprint_the_human_t4" as CardDefinition["id"],
  name: "Imprint: The Human (Epic)",
  faction: "insurgency",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 5 },
  keywords: ["backstab", "deathwatch"],
  abilities: [
    {
      id: "th_t4_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_the_human_t4.webp",
  flavorText:
    "Backstab. Deathwatch. On deploy, draw a card. Every corpse is a paragraph in a case file he has been writing since Mechronis. He reads from them on the way to work.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "narrative"] as const,
};

/* ═══════════════════════════════════════════════════════
   TIER 5 — LEGENDARY
   The Twelfth Archon in his full detective shape. Draw 2
   on deploy, keeps backstab + deathwatch.
   ═══════════════════════════════════════════════════════ */
export const the_human_t5: CardDefinition = {
  id: "s1_imprint_the_human_t5" as CardDefinition["id"],
  name: "The Human, Twelfth Archon",
  faction: "insurgency",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 6, health: 7 },
  keywords: ["backstab", "deathwatch"],
  abilities: [
    {
      id: "th_t5_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_the_human_t5.webp",
  flavorText:
    "Backstab. Deathwatch. On deploy, draw two cards. The Twelfth Archon was appointed by a Panopticon that did not yet understand what kind of organism it was appointing. He has been writing his response ever since, and it is long, and it has footnotes, and you are probably in it.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};

/** All five Human imprint tiers in tier order. */
export const THE_HUMAN_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  the_human_t1,
  the_human_t2,
  the_human_t3,
  the_human_t4,
  the_human_t5,
]);
