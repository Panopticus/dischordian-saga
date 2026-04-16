/**
 * Imprint Set — Elara Voss (5 tiers). Phase F15.
 *
 * Senator-turned-Ship. The Empress with a load balancer. Her
 * mechanical signature is HEAL + support + keeping the General
 * alive past the point where the opponent thought they had won.
 * Neutral faction so any deck can run her.
 *
 * Tier id convention: s1_imprint_elara_t{1..5}
 */
import type { CardDefinition } from "../../../index";

export const elara_t1: CardDefinition = {
  id: "s1_imprint_elara_t1" as CardDefinition["id"],
  name: "Imprint: Elara (Common)",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "ely_t1_heal_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_elara_t1.webp",
  flavorText:
    "On deploy, heal your general for 2. A voice over the intercom you recognize even though the intercom has never played her voice before.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};

export const elara_t2: CardDefinition = {
  id: "s1_imprint_elara_t2" as CardDefinition["id"],
  name: "Imprint: Elara (Uncommon)",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "ely_t2_heal_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 3 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_elara_t2.webp",
  flavorText:
    "On deploy, heal your general for 3. She has been mothering ten thousand strangers for a while now. One more is easy.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};

export const elara_t3: CardDefinition = {
  id: "s1_imprint_elara_t3" as CardDefinition["id"],
  name: "Imprint: Elara (Rare)",
  faction: "neutral",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    {
      id: "ely_t3_heal_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 4 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_elara_t3.webp",
  flavorText:
    "On deploy, heal your general for 4. The Ark rolls over in its orbit to put itself between you and the thing that was about to hit you.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};

export const elara_t4: CardDefinition = {
  id: "s1_imprint_elara_t4" as CardDefinition["id"],
  name: "Imprint: Elara (Epic)",
  faction: "neutral",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 3, health: 6 },
  keywords: ["forcefield"],
  abilities: [
    {
      id: "ely_t4_heal_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 5 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_elara_t4.webp",
  flavorText:
    "Forcefield. On deploy, heal your general for 5. The senator is gone. The ship remembers her anyway.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};

export const elara_t5: CardDefinition = {
  id: "s1_imprint_elara_t5" as CardDefinition["id"],
  name: "Elara, the Ark's Voice",
  faction: "neutral",
  cardType: "unit",
  rarity: "legendary",
  cost: 6,
  baseStats: { power: 4, health: 7 },
  keywords: ["forcefield"],
  abilities: [
    {
      id: "ely_t5_heal_on_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 8 },
        to: { kind: "friendly_general" },
      },
    },
    {
      id: "ely_t5_heal_each_turn" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: "/art/cards/imprint/s1_imprint_elara_t5.webp",
  flavorText:
    "Forcefield. On deploy, heal your general for 8. Each of your turns, heal your general for 2. Senator Elara Voss, pre-upload, delivered a speech from the floor of the Atarion Concord the night the war vote closed. 'We are the people who choose not to die of the decision we just made.' The ship still plays the recording on the anniversary. Every anniversary.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence", "narrative"] as const,
};

export const ELARA_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  elara_t1,
  elara_t2,
  elara_t3,
  elara_t4,
  elara_t5,
]);
