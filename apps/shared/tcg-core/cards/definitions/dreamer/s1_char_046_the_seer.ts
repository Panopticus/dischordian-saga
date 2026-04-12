/**
 * s1_char_046 — The Seer
 *
 * Rare unit · Dreamer faction · 5 cost · 6/6
 * Keywords: shield, stealth
 *
 * Oracle text (from season1-cards.json):
 *   "Absorbs the first 2 damage taken.
 *    Hidden for 2 turn(s). Cannot be targeted until revealed."
 *
 * Mechanical model:
 *  - Forcefield: on deploy, set `forcefield_charges` counter to 2.
 *  - Stealth: on deploy, grant `untargetable` keyword for 2 turns and
 *    set `stealth_turns` counter to 2. Breaks on first damage dealt.
 *
 * Golden tests: test/cards/dreamer/s1_char_046_the_seer.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_046" as CardDefinition["id"],
  name: "The Seer",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 6, health: 6 },
  keywords: ["forcefield"],
  abilities: [
    // --- Shield: 2 forcefield charges on deploy ---
    {
      id: "seer_forcefield_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 2,
        to: { kind: "self" },
      },
    },
    // --- Stealth: untargetable for 2 turns on deploy ---
    {
      id: "seer_stealth_2" as CardDefinition["abilities"][number]["id"],
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
      id: "seer_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
  ],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/022_the_seer_9ad7eb24.png",
  flavorText:
    "Unbound by allegiance, the Seer identifies opportunities and dangers, providing foresight that often shifts the balance ...",
  rulesVersion: "1.0.0",
};
