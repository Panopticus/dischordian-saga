/**
 * s1_char_038 — The Meme
 *
 * Epic unit · Architect faction · 6 cost · 6/9
 * Keywords: stealth, evolve
 *
 * Oracle text (from season1-cards.json):
 *   "Hidden for 3 turn(s). Cannot be targeted until revealed.
 *    After 3 kills, gains +2/+2 and a new keyword."
 *
 * Design interpretation:
 *   "a new keyword" resolves to **Celerity**. Rationale: The Meme is the
 *   fifth Archon, designed to manipulate thought and culture — celerity
 *   (attacking twice per turn) captures the idea of memes spreading
 *   faster than anyone can react.
 *
 * Mechanical model:
 *  - Stealth: on deploy, grant `untargetable` keyword for 3 turns and
 *    set `stealth_turns` counter to 3. Breaks on first damage dealt.
 *  - Evolve: `meme_kills` counter ticks on each kill. At 3, the unit
 *    gains +2/+2 and celerity permanently, then the counter resets.
 *
 * Golden tests: test/cards/architect/s1_char_038_the_meme.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_038" as CardDefinition["id"],
  name: "The Meme",
  faction: "architect",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 6, health: 9 },
  keywords: [],
  abilities: [
    // --- Stealth: untargetable for 3 turns on deploy ---
    {
      id: "meme_stealth_3" as CardDefinition["abilities"][number]["id"],
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
      id: "meme_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
    // --- Evolve: tick kill counter ---
    {
      id: "meme_tick_kill_counter" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      effect: {
        op: "add_counter",
        kind: "meme_kills",
        amount: 1,
        to: { kind: "self" },
      },
    },
    // --- Evolve: at 3 kills, gain +2/+2 and celerity ---
    {
      id: "meme_evolve_at_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_kill", of: "any" },
      condition: {
        kind: "counter_gte",
        counter: "meme_kills",
        value: 3,
      },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "buff",
            stats: { power: 2, health: 2 },
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          {
            op: "grant_keyword",
            keyword: "celerity",
            duration: { kind: "permanent" },
            to: { kind: "self" },
          },
          {
            op: "reset_counter",
            counter: "meme_kills",
            to: { kind: "self" },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_038.webp"),
  flavorText:
    "A. The Meme was the fifth Archon created by the Architect in Year 298 A.A., designed to manipulate human thought and culture. Believed destroyed by the White Oracle \u2014 though the broadcasts never stopped...",
  rulesVersion: "1.1.0",
  trial_categories: ["evidence", "narrative", "reactive"] as const,
  verdict_delta: 2,
};
