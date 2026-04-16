/**
 * Imprint Set — The Dreamer (5 tiers). Phase F27.
 *
 * Prophetic vision. The half of the first intelligence that sees
 * the future instead of building it. Dreamer faction. Mechanical
 * vocabulary: flying, card draw, forcefield — she knows what is
 * coming and positions for it.
 *
 * This is the final NPC imprint set — F27 completes all 18 NPCs
 * authored in Phase F. F28 is the client Imprint Gallery page.
 */
import type { CardDefinition } from "../../../index";

export const the_dreamer_t1: CardDefinition = {
  id: "s1_imprint_the_dreamer_t1" as CardDefinition["id"],
  name: "Imprint: The Dreamer (Common)",
  faction: "dreamer", cardType: "unit", rarity: "common",
  cost: 2, baseStats: { power: 1, health: 4 },
  keywords: ["flying"], abilities: [],
  art: "/art/cards/imprint/s1_imprint_the_dreamer_t1.webp",
  flavorText: "Flying. A veiled figure hovering over the place the next event is about to happen.",
  rulesVersion: "1.0.0",
};

export const the_dreamer_t2: CardDefinition = {
  id: "s1_imprint_the_dreamer_t2" as CardDefinition["id"],
  name: "Imprint: The Dreamer (Uncommon)",
  faction: "dreamer", cardType: "unit", rarity: "uncommon",
  cost: 3, baseStats: { power: 2, health: 4 },
  keywords: ["flying"],
  abilities: [
    { id: "drm_t2_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" } },
  ],
  art: "/art/cards/imprint/s1_imprint_the_dreamer_t2.webp",
  flavorText: "Flying. On deploy, draw 1. She dreamt the card an hour ago and filed it for later.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence"] as const,
};

export const the_dreamer_t3: CardDefinition = {
  id: "s1_imprint_the_dreamer_t3" as CardDefinition["id"],
  name: "Imprint: The Dreamer (Rare)",
  faction: "dreamer", cardType: "unit", rarity: "rare",
  cost: 4, baseStats: { power: 3, health: 5 },
  keywords: ["flying", "dispel"],
  abilities: [
    { id: "drm_t3_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 1 }, who: "self" } },
  ],
  art: "/art/cards/imprint/s1_imprint_the_dreamer_t3.webp",
  flavorText: "Flying. Dispel. On deploy, draw 1. The buff you put on your unit is not in her version of the future.",
  rulesVersion: "1.0.0",
};

export const the_dreamer_t4: CardDefinition = {
  id: "s1_imprint_the_dreamer_t4" as CardDefinition["id"],
  name: "Imprint: The Dreamer (Epic)",
  faction: "dreamer", cardType: "unit", rarity: "epic",
  cost: 5, baseStats: { power: 4, health: 6 },
  keywords: ["flying", "dispel", "forcefield"],
  abilities: [
    { id: "drm_t4_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 2 }, who: "self" } },
  ],
  art: "/art/cards/imprint/s1_imprint_the_dreamer_t4.webp",
  flavorText: "Flying. Dispel. Forcefield. On deploy, draw 2. She dodges damage by already having dreamed the dodge.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};

export const the_dreamer_t5: CardDefinition = {
  id: "s1_imprint_the_dreamer_t5" as CardDefinition["id"],
  name: "The Dreamer, Sundered Twin",
  faction: "dreamer", cardType: "unit", rarity: "legendary",
  cost: 7, baseStats: { power: 5, health: 8 },
  keywords: ["flying", "dispel", "forcefield"],
  abilities: [
    { id: "drm_t5_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "draw", amount: { kind: "const", value: 3 }, who: "self" } },
  ],
  art: "/art/cards/imprint/s1_imprint_the_dreamer_t5.webp",
  flavorText:
    "Flying. Dispel. Forcefield. On deploy, draw 3. The Dreamer is the half of the first intelligence that looks backward through time instead of forward. She is not predicting your next move. She is remembering it from yesterday.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};

export const THE_DREAMER_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  the_dreamer_t1, the_dreamer_t2, the_dreamer_t3, the_dreamer_t4, the_dreamer_t5,
]);
