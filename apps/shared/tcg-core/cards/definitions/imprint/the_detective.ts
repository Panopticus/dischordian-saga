/**
 * Imprint Set — The Detective (5 tiers). Phase F24.
 *
 * The Companion who treats every case like a deck and every
 * suspect like a card. Antiquarian faction. Mechanical vocabulary:
 * card draw, backstab, deathwatch — he reads the room and then
 * inserts himself into the part of it nobody was watching.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const the_detective_t1: CardDefinition = {
  id: "s1_imprint_the_detective_t1" as CardDefinition["id"],
  name: "Imprint: The Detective (Common)",
  faction: "antiquarian", cardType: "unit", rarity: "common",
  cost: 2, baseStats: { power: 2, health: 2 },
  keywords: [], abilities: [],
  art: assetUrl("art/cards/imprint/detective_t1.webp"),
  flavorText: "A long coat in a doorway. He has been there for three seconds and already knows who you are.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const the_detective_t2: CardDefinition = {
  id: "s1_imprint_the_detective_t2" as CardDefinition["id"],
  name: "Imprint: The Detective (Uncommon)",
  faction: "antiquarian", cardType: "unit", rarity: "uncommon",
  cost: 3, baseStats: { power: 2, health: 3 },
  keywords: ["backstab"],
  abilities: [
    { id: "det_t2_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" } },
  ],
  art: assetUrl("art/cards/imprint/detective_t2.webp"),
  flavorText: "Backstab. On deploy, draw 1. He has already read the next page of the case file.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Imprint-tier scaling design (T2): stats stay below curve so tier upgrades land mechanic-side. T2 adds backstab + on-deploy draw; the player feels growth via tier, not stat creep.",
    reviewer: "panopticus",
  },
};

export const the_detective_t3: CardDefinition = {
  id: "s1_imprint_the_detective_t3" as CardDefinition["id"],
  name: "Imprint: The Detective (Rare)",
  faction: "antiquarian", cardType: "unit", rarity: "rare",
  cost: 4, baseStats: { power: 3, health: 4 },
  keywords: ["backstab", "deathwatch"],
  abilities: [
    { id: "det_t3_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" } },
  ],
  art: assetUrl("art/cards/imprint/detective_t3.webp"),
  flavorText: "Backstab. Deathwatch. On deploy, draw 1. Every corpse is evidence and evidence compounds.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Imprint-tier scaling design (T3): stats below curve so tier upgrades land mechanic-side. T3 adds deathwatch on top of the T2 backstab + draw. The player feels growth via tier, not stat creep.",
    reviewer: "panopticus",
  },
};

export const the_detective_t4: CardDefinition = {
  id: "s1_imprint_the_detective_t4" as CardDefinition["id"],
  name: "Imprint: The Detective (Epic)",
  faction: "antiquarian", cardType: "unit", rarity: "epic",
  cost: 5, baseStats: { power: 4, health: 5 },
  keywords: ["backstab", "deathwatch"],
  abilities: [
    { id: "det_t4_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 2 }, who: "self" } },
  ],
  art: assetUrl("art/cards/imprint/detective_t4.webp"),
  flavorText: "Backstab. Deathwatch. On deploy, draw 2. He is already reading three pages ahead. He is reading the ending. He is tolerating the ending.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};

export const the_detective_t5: CardDefinition = {
  id: "s1_imprint_the_detective_t5" as CardDefinition["id"],
  name: "The Detective, Final Page",
  faction: "antiquarian", cardType: "unit", rarity: "legendary",
  cost: 6, baseStats: { power: 5, health: 6 },
  keywords: ["backstab", "deathwatch"],
  abilities: [
    { id: "det_t5_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 3 }, who: "self" } },
  ],
  art: assetUrl("art/cards/imprint/detective_t5.webp"),
  flavorText:
    "Backstab. Deathwatch. On deploy, draw 3. The Detective has been working this case since the first chapter was a rumor. He already knows who did it, he already knows why, he is here because the reader still has to be shown.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};

export const THE_DETECTIVE_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  the_detective_t1, the_detective_t2, the_detective_t3, the_detective_t4, the_detective_t5,
]);
