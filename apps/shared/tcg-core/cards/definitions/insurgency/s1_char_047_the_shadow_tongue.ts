/**
 * s1_char_047 — The Shadow Tongue
 *
 * Legendary unit · Insurgency faction · 8 cost · 10/13
 * Keywords: drain, stealth
 *
 * Oracle text (from season1-cards.json):
 *   "Heals for 4% of damage dealt.
 *    Hidden for 4 turn(s). Cannot be targeted until revealed."
 *
 * Design interpretation:
 *   The spec models drain as a flat 2 HP heal per hit (simplified from
 *   the percentage) and stealth as 3 turns (spec override of JSON's 4).
 *   The Shadow Tongue is an ancient thought demon — the longer stealth
 *   window and sustained drain make it a persistent lurking threat.
 *
 * Mechanical model:
 *  - Drain: on_damage_dealt by self, heal self for 2 HP via a permanent
 *    health buff. Same pattern as The Source (s1_char_049).
 *  - Stealth: on deploy, grant `untargetable` keyword for 3 turns and
 *    set `stealth_turns` counter to 3. Breaks on first damage dealt.
 *
 * Golden tests: test/cards/insurgency/s1_char_047_the_shadow_tongue.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_047" as CardDefinition["id"],
  name: "The Shadow Tongue",
  faction: "insurgency",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 10, health: 13 },
  keywords: [],
  abilities: [
    // --- Drain: heal 2 on each hit ---
    {
      id: "st_drain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 2 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
    // --- Stealth: untargetable for 3 turns on deploy ---
    {
      id: "st_stealth_3" as CardDefinition["abilities"][number]["id"],
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
      id: "st_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_047.webp"),
  flavorText:
    "In Year 16,200 A.A., it escaped the infernal dominion of the Empire of Shadows\u2014one of the few horrors to slip its leash ...",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence", "narrative"] as const,
  verdict_delta: 2,
};
