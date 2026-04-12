/**
 * s1_char_011 — Jericho Jones
 *
 * Uncommon unit · Insurgency faction · 2 cost · 5/7
 * Keywords: provoke (taunt mapped to provoke in our engine)
 *
 * Oracle text (from season1-cards.json):
 *   "Enemies in this lane must attack this unit first. Adjacent allies
 *    gain +2 ATK this turn."
 *
 * Mechanical model:
 *  - Provoke: the combat targeting resolver forces enemy attacks to target
 *    units with provoke before any other friendly unit in the same lane.
 *    Listed as an intrinsic keyword.
 *  - Rally: simplified to a self-buff of +3/0 for this turn. The full
 *    adjacent-ally targeting is deferred to the AoE targeting pass; for
 *    now this mirrors the Iron Lion pattern.
 *
 * Golden tests: test/cards/insurgency/s1_char_011_jericho_jones.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_011" as CardDefinition["id"],
  name: "Jericho Jones",
  faction: "insurgency",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 5, health: 7 },
  keywords: ["provoke"],
  abilities: [
    // --- Rally: +3 ATK self-buff this turn ---
    {
      id: "jj_rally_deploy" as CardDefinition["abilities"][number]["id"],
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
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/058_jericho_jones_9493c866.png",
  flavorText:
    "Known for his exceptional combat skills, tactical genius, and deep sense of loyalty, Jericho played a pivotal role in several key battles.",
  rulesVersion: "1.0.0",
};
