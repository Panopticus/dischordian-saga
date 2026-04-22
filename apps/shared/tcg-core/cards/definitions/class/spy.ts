/**
 * Class Cards — Spy (5 cards). Phase B1.
 *
 * Stealth, intel, sabotage. The spy's TCG identity is seeing more
 * than the opponent sees and landing the knife in the blind spot
 * that nobody else noticed. Mechanical vocabulary: untargetable,
 * backstab, dispel, card draw from hidden information.
 *
 * Class restriction: only players of the spy class may include
 * these cards in their decks (enforced by validateDeck in B8).
 *
 * IDs follow the convention s1_class_spy_{01..05}.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const spy_01: CardDefinition = {
  id: "s1_class_spy_01" as CardDefinition["id"],
  name: "Signal Ghost",
  faction: "insurgency",
  characterClass: "spy",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "spy01_stealth" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "untargetable",
        duration: { kind: "n_turns", n: 1 },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/class/s1_class_spy_01.webp"),
  flavorText:
    "Stealth — 1 turn. The first spies the Insurgency ran weren't trained; they were chosen because the cameras had stopped noticing them years before anyone asked.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 1,
};

export const spy_02: CardDefinition = {
  id: "s1_class_spy_02" as CardDefinition["id"],
  name: "Dead Drop",
  faction: "insurgency",
  characterClass: "spy",
  cardType: "spell",
  rarity: "uncommon",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "spy02_draw2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/class/s1_class_spy_02.webp"),
  flavorText:
    "Draw 2 cards. A dead drop is an address nobody agreed on. The message is always already there when you arrive.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 1,
};

export const spy_03: CardDefinition = {
  id: "s1_class_spy_03" as CardDefinition["id"],
  name: "Cover Name",
  faction: "insurgency",
  characterClass: "spy",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: ["backstab"],
  abilities: [
    {
      id: "spy03_stealth" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "untargetable",
        duration: { kind: "n_turns", n: 2 },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/class/s1_class_spy_03.webp"),
  flavorText:
    "Backstab. Stealth — 2 turns. The cover name is not a lie. It is a separate person you built and then walked into like a coat.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};

export const spy_04: CardDefinition = {
  id: "s1_class_spy_04" as CardDefinition["id"],
  name: "Burn the Handler",
  faction: "insurgency",
  characterClass: "spy",
  cardType: "spell",
  rarity: "epic",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "spy04_silence" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "silence",
        to: { kind: "enemy_general" },
      },
    },
  ],
  art: assetUrl("art/cards/class/s1_class_spy_04.webp"),
  flavorText:
    "Silence the enemy general. Every operative eventually has to kill the person who recruited them, usually to protect the secret of having been recruited at all.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};

export const spy_05: CardDefinition = {
  id: "s1_class_spy_05" as CardDefinition["id"],
  name: "The Twelfth Archon's Apprentice",
  faction: "insurgency",
  characterClass: "spy",
  cardType: "unit",
  rarity: "legendary",
  cost: 5,
  baseStats: { power: 5, health: 5 },
  keywords: ["backstab"],
  abilities: [
    {
      id: "spy05_stealth" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "grant_keyword",
        keyword: "untargetable",
        duration: { kind: "n_turns", n: 3 },
        to: { kind: "self" },
      },
    },
    {
      id: "spy05_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/class/s1_class_spy_05.webp"),
  flavorText:
    "Backstab. Stealth — 3 turns. On deploy, draw 2. The Human trained only a handful of apprentices and none of them know each other. They will not meet in the sequel. That's the point.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};

export const SPY_CLASS_CARDS: readonly CardDefinition[] = Object.freeze([
  spy_01, spy_02, spy_03, spy_04, spy_05,
]);
