/**
 * Imprint Set — Foucault (5 tiers). Phase F26.
 *
 * Surveillance theorist embedded in the Babylonian bureaucracy.
 * Knows where the cameras are not. New Babylon faction. Mechanical
 * vocabulary: stealth (untargetable), dispel, reveal — he knows
 * what is being watched and what is deliberately not.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const foucault_t1: CardDefinition = {
  id: "s1_imprint_foucault_t1" as CardDefinition["id"],
  name: "Imprint: Foucault (Common)",
  faction: "new_babylon", cardType: "unit", rarity: "common",
  cost: 2, baseStats: { power: 2, health: 3 },
  keywords: [], abilities: [],
  art: assetUrl("art/cards/imprint/foucault_t1.webp"),
  flavorText: "A reader in a Babylonian archive. He is not in any of the surveillance logs because he built the surveillance logs.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
};

export const foucault_t2: CardDefinition = {
  id: "s1_imprint_foucault_t2" as CardDefinition["id"],
  name: "Imprint: Foucault (Uncommon)",
  faction: "new_babylon", cardType: "unit", rarity: "uncommon",
  cost: 3, baseStats: { power: 3, health: 3 },
  keywords: ["dispel"], abilities: [],
  art: assetUrl("art/cards/imprint/foucault_t2.webp"),
  flavorText: "Dispel. He reads the surveillance tag on your buff and crosses it out with a red pen.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
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
  flavorText: "Dispel. Stealth — 1 turn. He stepped into the blind spot of the room's camera. He installed the blind spot two years ago.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
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
  flavorText: "Dispel. Stealth — 2 turns. He is carrying a map of the Panopticon's schedule of glances, and you are in none of them.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
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
    "Dispel. Stealth — 3 turns. On deploy, silence the enemy general. Foucault wrote the theory of the surveillance state the Babylonians are currently operating inside of. They did not read the theory. He keeps a copy in his inside pocket with footnotes they would have needed.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};

export const FOUCAULT_IMPRINT_SET: readonly CardDefinition[] = Object.freeze([
  foucault_t1, foucault_t2, foucault_t3, foucault_t4, foucault_t5,
]);
