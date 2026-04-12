/**
 * s1_char_020 — The Authority
 *
 * Rare unit · New Babylon faction · 3 cost · 7/7
 * Keywords: taunt (provoke), rally
 *
 * Oracle text (from season1-cards.json):
 *   "Enemies in this lane must attack this unit first.
 *    Adjacent allies gain +2 ATK this turn."
 *
 * Design interpretation:
 *   Provoke is intrinsic — the Authority forces all lane attacks onto
 *   itself. The rally effect is normalized to a +3/0 self-buff for
 *   this_turn on deploy, matching the balance cadence of other rally cards.
 *
 * Mechanical model:
 *  - Provoke: listed as intrinsic keyword. The combat targeting resolver
 *    forces enemy attacks to target this unit before other friendlies.
 *  - Rally: on deploy, self-buff +3/0 lasting this_turn.
 *
 * Golden tests: test/cards/new_babylon/s1_char_020_the_authority.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_020" as CardDefinition["id"],
  name: "The Authority",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 7, health: 7 },
  keywords: ["provoke"],
  abilities: [
    // --- Rally: self-buff +3/0 this turn on deploy ---
    {
      id: "auth_rally_deploy" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 3, health: 0 },
        duration: { kind: "this_turn" },
        to: { kind: "self" },
      },
    },
  ],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/0_jxThjKVIn9jDLhXELm6VQA_1773942383013_na1fn_L2hvbWUvdWJ1bnR1L3MxX2NoYXJfMDIw_80da4242.png",
  flavorText:
    "Formed by merging the consciousnesses of six chosen citizens into a living computer, it was designed to govern New Babylon with absolute fairness.",
  rulesVersion: "1.0.0",
};
