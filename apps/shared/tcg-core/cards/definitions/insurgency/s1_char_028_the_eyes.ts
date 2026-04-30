/**
 * s1_char_028 — The Eyes
 *
 * Rare unit · Insurgency faction · 3 cost · 4/8
 * Keywords: stealth
 *
 * Oracle text (from season1-cards.json):
 *   "Hidden for 2 turn(s). Cannot be targeted until revealed."
 *
 * Mechanical model:
 *  - Stealth: on deploy, gains the `untargetable` keyword for 2 turns
 *    and a `stealth_turns` counter set to 2 for UI countdown. The
 *    engine's targeting resolver skips units with the `untargetable`
 *    keyword. Stealth breaks on first attack (on_damage_dealt removes
 *    the keyword).
 *
 * Golden tests: test/cards/insurgency/s1_char_028_the_eyes.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_028" as CardDefinition["id"],
  name: "The Eyes",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    // --- Stealth: untargetable for 2 turns on deploy ---
    {
      id: "eyes_stealth_2" as CardDefinition["abilities"][number]["id"],
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
    // --- Reveal: remove untargetable when dealing damage ---
    {
      id: "eyes_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_028.webp"),
  flavorText:
    "A. The Eyes was an elite agent created by the Watcher for the AI Empire , renowned for her unparalleled infiltration and...",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
};
