/**
 * Class Cards — Assassin (5 cards). Phase B3.
 *
 * Execute, backstab multiplier, sudden removals. The assassin's
 * TCG identity is single-target deletion with extreme prejudice.
 * Mechanical vocabulary: backstab, celerity, pierce, deal_damage.
 *
 * Class restriction: only players of the assassin class.
 *
 * IDs follow the convention s1_class_assassin_{01..05}.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const assassin_01: CardDefinition = {
  id: "s1_class_assassin_01" as CardDefinition["id"],
  name: "Glass Blade Initiate",
  faction: "insurgency",
  characterClass: "assassin",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 1 },
  keywords: ["backstab"],
  abilities: [],
  art: assetUrl("art/cards/class/s1_class_assassin_01.webp"),
  flavorText:
    "Backstab. Glass blades shatter on impact. The instructors keep handing them out anyway, because the students who learn this are the ones who stop needing the second strike.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};

export const assassin_02: CardDefinition = {
  id: "s1_class_assassin_02" as CardDefinition["id"],
  name: "Silent Step",
  faction: "insurgency",
  characterClass: "assassin",
  cardType: "spell",
  rarity: "uncommon",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "asn02_dmg" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 4 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: assetUrl("art/cards/class/s1_class_assassin_02.webp"),
  flavorText:
    "Deal 4 damage to the enemy general. The first half of the move is silent. The second half is an apology, but not to you.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};

export const assassin_03: CardDefinition = {
  id: "s1_class_assassin_03" as CardDefinition["id"],
  name: "Witness Remover",
  faction: "insurgency",
  characterClass: "assassin",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 4, health: 3 },
  keywords: ["backstab", "celerity"],
  abilities: [],
  art: assetUrl("art/cards/class/s1_class_assassin_03.webp"),
  flavorText:
    "Backstab. Celerity. A second strike is what you spend when you cannot afford to leave a witness. This unit does not know any other kind of math.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};

export const assassin_04: CardDefinition = {
  id: "s1_class_assassin_04" as CardDefinition["id"],
  name: "Execute Protocol",
  faction: "insurgency",
  characterClass: "assassin",
  cardType: "spell",
  rarity: "epic",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "asn04_dmg" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "deal_damage",
        amount: { kind: "const", value: 7 },
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: assetUrl("art/cards/class/s1_class_assassin_04.webp"),
  flavorText:
    "Deal 7 damage to the enemy general. The Protocol is a single sentence that the assassin has to say out loud before they use it. Nobody has ever reported hearing the sentence, because everyone who would have heard it is part of the sentence.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const assassin_05: CardDefinition = {
  id: "s1_class_assassin_05" as CardDefinition["id"],
  name: "Akai Shi's First Apprentice",
  faction: "architect",
  characterClass: "assassin",
  cardType: "unit",
  rarity: "legendary",
  cost: 5,
  baseStats: { power: 6, health: 4 },
  keywords: ["backstab", "celerity", "pierce"],
  abilities: [
    {
      id: "asn05_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "rush",
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/class/s1_class_assassin_05.webp"),
  flavorText:
    "Backstab. Celerity. Pierce. Rush on deploy. Red Death does not train apprentices, because apprentices survive the training. This one did. She has not spoken in nine years and will not explain why.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const ASSASSIN_CLASS_CARDS: readonly CardDefinition[] = Object.freeze([
  assassin_01, assassin_02, assassin_03, assassin_04, assassin_05,
]);
