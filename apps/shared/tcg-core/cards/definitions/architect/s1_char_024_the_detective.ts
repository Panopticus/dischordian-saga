/**
 * s1_char_024 — The Detective
 *
 * Epic unit · Architect faction · 4 cost · 9/10
 * Keywords: stealth, pierce
 *
 * Oracle text (from season1-cards.json):
 *   "Hidden for 3 turn(s). Cannot be targeted until revealed.
 *    Ignores 3 points of enemy armor."
 *
 * Design interpretation:
 *   The spec sets stealth to 2 turns for balance. Pierce is the standard
 *   permanent passive `ignore_armor_3` aura. Stealth follows the
 *   untargetable-for-N-turns + reveal-on-attack pattern.
 *
 * Mechanical model:
 *  - Stealth: on deploy, gains `untargetable` for 2 turns and sets a
 *    `stealth_turns` counter to 2. On damage dealt, untargetable is removed.
 *  - Pierce: permanent passive_aura granting `ignore_armor_3` to self.
 *
 * Golden tests: test/cards/architect/s1_char_024_the_detective.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_024" as CardDefinition["id"],
  name: "The Detective",
  faction: "architect",
  cardType: "unit",
  rarity: "epic",
  cost: 4,
  baseStats: { power: 5, health: 4 },
  keywords: [],
  abilities: [
    // --- Stealth: untargetable for 2 turns on deploy ---
    {
      id: "det_stealth_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "grant_keyword",
            keyword: "untargetable",
            duration: { kind: "n_turns", n: 2 },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "stealth_turns",
            amount: 2,
            to: { kind: "self" },
          },
        ],
      },
    },
    // --- Stealth: reveal on attack ---
    {
      id: "det_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
    // --- Pierce: passive ignore_armor_3 ---
    {
      id: "det_pierce_passive" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "passive_aura", range: { kind: "self" } },
      effect: {
        op: "grant_keyword",
        keyword: "ignore_armor_3",
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_024.webp"),
  flavorText:
    "A. The one known as the Detective began his journey as a curious and determined Seeker in the mysterious Project Celebration.",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: 2,
};
