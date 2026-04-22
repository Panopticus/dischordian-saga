/**
 * s1_char_003 — Akai Shi
 *
 * Epic unit · New Babylon faction · 4 cost · 7/8
 * Keywords: pierce
 *
 * Oracle text (from season1-cards.json):
 *   "Ignores 3 points of enemy armor. Hidden for 3 turn(s). Cannot be
 *    targeted until revealed."
 *
 * Mechanical model:
 *  - Stealth: on deploy, Akai Shi gains the `untargetable` keyword for
 *    3 turns and a `stealth_turns` counter set to 3 for UI countdown.
 *    The engine's targeting resolver skips units with the `untargetable`
 *    keyword when building single-target lists.
 *  - Reveal trigger: when Akai Shi deals damage (attacks), the
 *    `untargetable` keyword is removed immediately — standard "stealth
 *    breaks on first attack" rule.
 *  - Armor ignore: permanent passive aura grants the `ignore_armor_3`
 *    keyword. The combat pipeline in damage.ts subtracts 3 from any armor
 *    reduction when Akai Shi is the source of damage.
 *
 * Golden tests: test/cards/new_babylon/s1_char_003_akai_shi.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_003" as CardDefinition["id"],
  name: "Akai Shi",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "epic",
  cost: 4,
  baseStats: { power: 4, health: 4 },
  keywords: ["pierce"],
  abilities: [
    // --- Stealth: untargetable for 3 turns on deploy ---
    {
      id: "as_stealth_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "grant_keyword",
            keyword: "untargetable",
            duration: { kind: "n_turns", n: 3 },
            to: { kind: "self" },
          },
          {
            op: "add_counter",
            kind: "stealth_turns",
            amount: 3,
            to: { kind: "self" },
          },
        ],
      },
    },
    // --- Reveal: remove untargetable when dealing damage ---
    {
      id: "as_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
    // --- Pierce: ignore 3 armor (passive aura on self) ---
    {
      id: "as_pierce_passive" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "passive_aura", range: { kind: "self" } },
      effect: {
        op: "grant_keyword",
        keyword: "ignore_armor_3",
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_003.webp"),
  flavorText:
    "A. Akai Shi was a revered member of the Potentials, a group of beings who emerged to restore balance in the universe after the Fall of Reality.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: 2,
};
