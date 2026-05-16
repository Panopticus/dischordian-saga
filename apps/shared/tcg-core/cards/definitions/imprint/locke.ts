/**
 * Imprint Set â Adjudicator Locke (5 tiers). Phase F22.
 *
 * The last Archon who still makes decisions as if decisions matter.
 * New Babylon faction. Mechanical vocabulary: provoke, heal general,
 * silence enemy spells â structural law as support.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const locke_t1: CardDefinition = {
  id: "s1_imprint_locke_t1" as CardDefinition["id"],
  // First-summon gated to the act this character is canonically
  // introduced (CHAPTER_TO_IMPRINT_NPCS, imprintRegistry.ts) — I14.
  unlockCondition: { kind: "act_completion", act: 1 },
  name: "Imprint: Locke (Common)",
  faction: "new_babylon", cardType: "unit", rarity: "common",
  cost: 2, baseStats: { power: 1, health: 4 },
  keywords: [], abilities: [],
  art: assetUrl("art/cards/imprint/locke_t1.webp"),
  flavorText: "A tired figure in a jurist's coat at a desk that has been tidy longer than you have been alive.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const locke_t2: CardDefinition = {
  id: "s1_imprint_locke_t2" as CardDefinition["id"],
  name: "Imprint: Locke (Uncommon)",
  faction: "new_babylon", cardType: "unit", rarity: "uncommon",
  cost: 3, baseStats: { power: 2, health: 5 },
  keywords: ["provoke"], abilities: [],
  art: assetUrl("art/cards/imprint/locke_t2.webp"),
  flavorText: "Provoke. He stands between the harm and the people who did not ask for the harm. He is on the clock, the whole clock, every clock.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const locke_t3: CardDefinition = {
  id: "s1_imprint_locke_t3" as CardDefinition["id"],
  name: "Imprint: Locke (Rare)",
  faction: "new_babylon", cardType: "unit", rarity: "rare",
  cost: 4, baseStats: { power: 3, health: 6 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "lck_t3_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "heal", amount: { kind: "const", value: 3 }, to: { kind: "friendly_general" } },
    },
  ],
  art: assetUrl("art/cards/imprint/locke_t3.webp"),
  flavorText: "Provoke. On deploy, heal your general for 3. The room is healthier for having him in it, but he is not healthier for being in the room.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const locke_t4: CardDefinition = {
  id: "s1_imprint_locke_t4" as CardDefinition["id"],
  name: "Imprint: Locke (Epic)",
  faction: "new_babylon", cardType: "unit", rarity: "epic",
  cost: 5, baseStats: { power: 4, health: 7 },
  keywords: ["provoke", "forcefield"],
  abilities: [
    {
      id: "lck_t4_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "heal", amount: { kind: "const", value: 4 }, to: { kind: "friendly_general" } },
    },
  ],
  art: assetUrl("art/cards/imprint/locke_t4.webp"),
  flavorText: "Provoke. Forcefield. On deploy, heal your general for 4. The gavel has been quiet for a long time. This is the turn it comes down once.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const locke_t5: CardDefinition = {
  id: "s1_imprint_locke_t5" as CardDefinition["id"],
  name: "Locke, the Last Adjudicator",
  faction: "new_babylon", cardType: "unit", rarity: "legendary",
  cost: 6, baseStats: { power: 5, health: 9 },
  keywords: ["provoke", "forcefield"],
  abilities: [
    {
      id: "lck_t5_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "heal", amount: { kind: "const", value: 6 }, to: { kind: "friendly_general" } },
    },
    {
      id: "lck_t5_silence" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "silence", to: { kind: "enemy_general" } },
    },
  ],
  art: assetUrl("art/cards/imprint/locke_t5.webp"),
  flavorText:
    "Provoke. Forcefield. On deploy, heal your general for 6 and silence the enemy general. Locke rules by consent, which is the hardest way, which is why there are so few of him.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const LOCKE_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  locke_t1, locke_t2, locke_t3, locke_t4, locke_t5,
]);
