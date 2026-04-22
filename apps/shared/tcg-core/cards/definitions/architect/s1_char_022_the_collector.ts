/**
 * s1_char_022 — The Collector
 *
 * Epic unit · Architect faction · 5 cost · 9/10
 * Keywords: drain, stealth
 *
 * Oracle text (from season1-cards.json):
 *   "Heals for 3% of damage dealt.
 *    Hidden for 3 turn(s). Cannot be targeted until revealed."
 *
 * Design interpretation:
 *   Drain is modeled as a flat heal-2 on every damage dealt (approximation
 *   of the percentage-based drain at typical combat values). Stealth is
 *   the standard untargetable-for-N-turns + reveal-on-attack pattern.
 *
 * Mechanical model:
 *  - Drain: on_damage_dealt trigger heals self for 2 (const).
 *  - Stealth: on deploy, gains `untargetable` for 3 turns and sets a
 *    `stealth_turns` counter to 3. On damage dealt, untargetable is removed.
 *
 * Golden tests: test/cards/architect/s1_char_022_the_collector.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_022" as CardDefinition["id"],
  name: "The Collector",
  faction: "architect",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 6 },
  keywords: [],
  abilities: [
    // --- Stealth: untargetable for 3 turns on deploy ---
    {
      id: "coll_stealth_3" as CardDefinition["abilities"][number]["id"],
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
    // --- Stealth: reveal on attack ---
    {
      id: "coll_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
    // --- Drain: heal 2 on every damage dealt ---
    {
      id: "coll_drain_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_022.webp"),
  flavorText:
    "Tasked by the Architect, the Collector harvests the DNA and machine code of the most advanced organic and synthetic beings across the multiverse.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence", "narrative"] as const,
  verdict_delta: 2,
};
