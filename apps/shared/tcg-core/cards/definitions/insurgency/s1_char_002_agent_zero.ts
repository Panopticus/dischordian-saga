/**
 * s1_char_002 — Agent Zero
 *
 * Epic unit · Insurgency faction · 5 cost · 7/8
 * Keywords: stealth (modeled as untargetable + stealth_turns counter),
 *           pierce (modeled as ignore_armor_3 passive aura on self)
 *
 * Oracle text (from season1-cards.json):
 *   "Hidden for 3 turn(s). Cannot be targeted until revealed.
 *    Ignores 3 points of enemy armor."
 *
 * Mechanical model:
 *  - On deploy, Agent Zero gains the `untargetable` keyword for 3 turns.
 *    Simultaneously, a `stealth_turns` counter is set to 3 — this lets UIs
 *    render a countdown and gives effects a programmatic way to detect
 *    stealth duration remaining. The engine's targeting resolver skips
 *    units with the `untargetable` keyword when building single-target
 *    lists (but AoE still hits them — that's the intended TCG convention,
 *    see docs/cards/s1_char_002.md for disposition).
 *
 *  - The reveal trigger: when Agent Zero deals damage (i.e. attacks), the
 *    `untargetable` keyword is removed immediately. This is the standard
 *    "stealth breaks on first attack" rule.
 *
 *  - Armor ignore: the pierce effect is modeled as a permanent passive
 *    aura on the Agent Zero entity that grants the `ignore_armor_3`
 *    keyword. The combat pipeline in damage.ts reads this keyword and
 *    subtracts 3 from any armor reduction when Agent Zero is the source
 *    of damage.
 *
 *  - Because `grant_keyword` inside an `on_deploy` effect is functionally
 *    equivalent to declaring the keyword intrinsically, we list only
 *    `untargetable` under `keywords` (as a marker) and use passive_aura
 *    for the pierce effect to match how other "always-on" self-buffs
 *    are authored across the faction.
 *
 * Golden tests: test/cards/insurgency/s1_char_002_agent_zero.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_002" as CardDefinition["id"],
  name: "Agent Zero",
  faction: "insurgency",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 6 },
  keywords: [],
  abilities: [
    {
      id: "az_stealth_3" as CardDefinition["abilities"][number]["id"],
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
    {
      id: "az_reveal_on_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "remove_keyword",
        keyword: "untargetable",
        to: { kind: "self" },
      },
    },
    {
      id: "az_pierce_passive" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "passive_aura", range: { kind: "self" } },
      effect: {
        op: "grant_keyword",
        keyword: "ignore_armor_3",
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_002.webp",
  flavorText:
    "Renowned for her exceptional combat abilities, strategic acumen, and mastery of espionage, she played pivotal roles in some of the Insurgency's most decisive strikes.",
  rulesVersion: "1.0.0",
};
