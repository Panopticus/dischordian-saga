/**
 * Imprint Set â Foucault (5 tiers).
 *
 * RETIRED per dreamer-canon (2026-05-13): Foucault has been
 * dropped from the canonical character roster. The card
 * definitions remain in code so the engine recognizes the ids
 * (existing saved decks resolve correctly), but every tier is
 * marked `reserved: true` so pack-opening, deck-builder, and
 * reward surfaces filter them out (per CLAUDE.md
 * "Conventions worth knowing" â `reserved: true` keeps the
 * card recognized but absent from live pools).
 *
 * Per the plan Â§VIII Phase J9 + Â§X.11: no intro cutscene
 * authored, no Loredex sub-section surfaced, no Mystery
 * Engine binding. The Foucault imprint is a legacy entry only.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const foucault_t1: CardDefinition = {
  id: "s1_imprint_foucault_t1" as CardDefinition["id"],
  // First-summon gated to the act this character is canonically
  // introduced (CHAPTER_TO_IMPRINT_NPCS, imprintRegistry.ts) — I14.
  unlockCondition: { kind: "act_completion", act: 2 },
  name: "Imprint: Foucault (Common)",
  faction: "new_babylon", cardType: "unit", rarity: "common",
  cost: 2, baseStats: { power: 2, health: 3 },
  keywords: [], abilities: [],
  art: assetUrl("art/cards/imprint/foucault_t1.webp"),
  flavorText: "A reader in a Babylonian archive. He is not in any of the surveillance logs because he built the surveillance logs.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
  reserved: true,
};

export const foucault_t2: CardDefinition = {
  id: "s1_imprint_foucault_t2" as CardDefinition["id"],
  name: "Imprint: Foucault (Uncommon)",
  faction: "new_babylon", cardType: "unit", rarity: "uncommon",
  cost: 3, baseStats: { power: 3, health: 3 },
  keywords: ["dispel"], abilities: [],
  art: assetUrl("art/cards/imprint/foucault_t2.webp"),
  flavorText: "Dispel. He reads the surveillance tag on your buff and crosses it out with a red pen.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
  reserved: true,
};

export const foucault_t3: CardDefinition = {
  id: "s1_imprint_foucault_t3" as CardDefinition["id"],
  name: "Imprint: Foucault (Rare)",
  faction: "new_babylon", cardType: "unit", rarity: "rare",
  cost: 4, baseStats: { power: 4, health: 4 },
  keywords: ["dispel"],
  abilities: [
    { id: "fou_t3_stealth" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "grant_keyword", keyword: "untargetable",
        duration: { kind: "n_turns", n: 1 }, to: { kind: "self" } } },
  ],
  art: assetUrl("art/cards/imprint/foucault_t3.webp"),
  flavorText: "Dispel. Stealth â 1 turn. He stepped into the blind spot of the room's camera. He installed the blind spot two years ago.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
  reserved: true,
};

export const foucault_t4: CardDefinition = {
  id: "s1_imprint_foucault_t4" as CardDefinition["id"],
  name: "Imprint: Foucault (Epic)",
  faction: "new_babylon", cardType: "unit", rarity: "epic",
  cost: 5, baseStats: { power: 5, health: 5 },
  keywords: ["dispel"],
  abilities: [
    { id: "fou_t4_stealth" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "grant_keyword", keyword: "untargetable",
        duration: { kind: "n_turns", n: 2 }, to: { kind: "self" } } },
  ],
  art: assetUrl("art/cards/imprint/foucault_t4.webp"),
  flavorText: "Dispel. Stealth â 2 turns. He is carrying a map of the Panopticon's schedule of glances, and you are in none of them.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
  reserved: true,
};

export const foucault_t5: CardDefinition = {
  id: "s1_imprint_foucault_t5" as CardDefinition["id"],
  name: "Foucault, Schedule of Glances",
  faction: "new_babylon", cardType: "unit", rarity: "legendary",
  cost: 6, baseStats: { power: 6, health: 6 },
  keywords: ["dispel"],
  abilities: [
    { id: "fou_t5_stealth" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "grant_keyword", keyword: "untargetable",
        duration: { kind: "n_turns", n: 3 }, to: { kind: "self" } } },
    { id: "fou_t5_silence" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: { op: "silence", to: { kind: "enemy_general" } } },
  ],
  art: assetUrl("art/cards/imprint/foucault_t5.webp"),
  flavorText:
    "Dispel. Stealth â 3 turns. On deploy, silence the enemy general. Foucault wrote the theory of the surveillance state the Babylonians are currently operating inside of. They did not read the theory. He keeps a copy in his inside pocket with footnotes they would have needed.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
  reserved: true,
};

export const FOUCAULT_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  foucault_t1, foucault_t2, foucault_t3, foucault_t4, foucault_t5,
]);
