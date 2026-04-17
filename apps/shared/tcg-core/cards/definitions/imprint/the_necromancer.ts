/**
 * Imprint Set — The Necromancer (5 tiers). Phase F17.
 *
 * Death as a kindness. Walks away across dissolving cards. Bone-
 * white flowers grow behind him. Mechanical vocabulary: deathwatch,
 * rebirth, trades-are-resources.
 *
 * Tier id convention: s1_imprint_the_necromancer_t{1..5}
 */
import type { CardDefinition } from "../../../index";

export const the_necromancer_t1: CardDefinition = {
  id: "s1_imprint_the_necromancer_t1" as CardDefinition["id"],
  name: "Imprint: The Necromancer (Common)",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [],
  art: "/art/cards/imprint/s1_imprint_the_necromancer_t1.webp",
  flavorText:
    "A figure walking away from the viewer across a field of soft grey ash. He is not a skeleton. He is a person whose face is hidden because if you saw it you would recognize him.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const the_necromancer_t2: CardDefinition = {
  id: "s1_imprint_the_necromancer_t2" as CardDefinition["id"],
  name: "Imprint: The Necromancer (Uncommon)",
  faction: "dreamer",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: ["deathwatch"],
  abilities: [],
  art: "/art/cards/imprint/s1_imprint_the_necromancer_t2.webp",
  flavorText:
    "Deathwatch. Every dying unit is a paragraph in a letter he has been writing to himself for longer than you have been alive.",
  rulesVersion: "1.0.0",
  trial_categories: ["reactive"] as const,
  verdict_delta: 1,
};

export const the_necromancer_t3: CardDefinition = {
  id: "s1_imprint_the_necromancer_t3" as CardDefinition["id"],
  name: "Imprint: The Necromancer (Rare)",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["deathwatch", "rebirth"],
  abilities: [],
  art: "/art/cards/imprint/s1_imprint_the_necromancer_t3.webp",
  flavorText:
    "Deathwatch. Rebirth. The Necromancer dies twice. The second time is the unmaking, not the death. He gets to choose.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};

export const the_necromancer_t4: CardDefinition = {
  id: "s1_imprint_the_necromancer_t4" as CardDefinition["id"],
  name: "Imprint: The Necromancer (Epic)",
  faction: "dreamer",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 5 },
  keywords: ["deathwatch", "rebirth"],
  abilities: [
    {
      id: "nec_t4_heal_on_kill" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_the_necromancer_t4.webp",
  flavorText:
    "Deathwatch. Rebirth. Heals for 2 when he deals damage. Every strike leaves a flower of bone-white light behind where the target used to stand.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const the_necromancer_t5: CardDefinition = {
  id: "s1_imprint_the_necromancer_t5" as CardDefinition["id"],
  name: "The Necromancer, Mercy-Shaped",
  faction: "dreamer",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 6, health: 7 },
  keywords: ["deathwatch", "rebirth", "drain"],
  abilities: [],
  art: "/art/cards/imprint/s1_imprint_the_necromancer_t5.webp",
  flavorText:
    "Deathwatch. Rebirth. Drain. He unmakes his friends now, because the alternative is leaving them in the hands of people who would not know how to do it kindly. This card is the longest conversation he has been able to have about it.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};

export const THE_NECROMANCER_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  the_necromancer_t1,
  the_necromancer_t2,
  the_necromancer_t3,
  the_necromancer_t4,
  the_necromancer_t5,
]);
