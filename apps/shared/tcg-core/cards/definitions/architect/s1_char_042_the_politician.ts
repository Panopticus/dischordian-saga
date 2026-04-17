/**
 * s1_char_042 — The Politician
 *
 * Rare unit · Architect faction · 5 cost · 5/6
 * Keywords: stealth, shield
 *
 * Oracle text (from season1-cards.json):
 *   "Hidden for 2 turn(s). Cannot be targeted until revealed.
 *    Absorbs the first 2 damage taken."
 *
 * Mechanical model:
 *  - Stealth: on deploy, grant `untargetable` keyword for 2 turns and
 *    set `stealth_turns` counter to 2. Breaks on first damage dealt.
 *  - Forcefield: on deploy, set `forcefield_charges` counter to 2.
 *
 * Golden tests: test/cards/architect/s1_char_042_the_politician.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_042" as CardDefinition["id"],
  name: "The Politician",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 5, health: 6 },
  keywords: ["forcefield"],
  abilities: [
    // --- Stealth: untargetable for 2 turns on deploy ---
    {
      id: "pol_stealth_2" as CardDefinition["abilities"][number]["id"],
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
      id: "pol_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
    // --- Shield: 2 forcefield charges on deploy ---
    {
      id: "pol_forcefield_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 2,
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_042.webp",
  flavorText:
    "A. The Politician was the seventh Archon created by the Architect on Day 15 of Ascension, Year 419 A.A., engineered to m...",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "evidence"] as const,
  verdict_delta: 1,
};
