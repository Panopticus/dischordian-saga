/**
 * s1_pack_007 — Surveillance Probe
 *
 * Uncommon unit · Architect faction · 1 cost · 1/2
 *
 * Oracle text:
 *   "On death, draw 1 card. Even in destruction, data is collected."
 *
 * A cheap cantrip body that replaces itself on death. Excellent for
 * early board presence, chump blocking, and maintaining card flow.
 * The Architect wastes nothing — even a destroyed probe transmits
 * its final readings.
 *
 * Mechanical model:
 *  - On death, draw 1 card for the controlling player.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_007" as CardDefinition["id"],
  name: "Surveillance Probe",
  faction: "architect",
  cardType: "unit",
  rarity: "uncommon",
  cost: 1,
  baseStats: { power: 1, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "sp_death_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "Its final transmission contained more intelligence than its entire operational lifespan.",
  rulesVersion: "1.0.0",
};
