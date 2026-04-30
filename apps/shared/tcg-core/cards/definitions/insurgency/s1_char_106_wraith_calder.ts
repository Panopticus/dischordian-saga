/**
 * s1_char_106 — Wraith Calder
 *
 * Rare unit · Insurgency faction · 4 cost · 3/4
 * Keywords: rebirth
 *
 * Oracle text:
 *   "Seven deaths and still standing. On death, leaves a 0/1 egg
 *    that hatches into Wraith Calder next turn."
 *
 * Lore: Calder has died seven times in service to the Insurgency and
 * returned from each death through means the Dreamers cannot explain.
 * The Witness documented each resurrection. Whether it is the Living
 * Universe refusing to let him rest or some deeper mechanism of the
 * Dischordian Cycle, Calder persists — a wraith that death cannot hold.
 * The rebirth keyword models this perfectly: when killed, he leaves
 * behind an egg (the 0/1 husk) that hatches next turn.
 *
 * Mechanical model:
 *  - Rebirth: intrinsic keyword. On death, spawns a 0/1 egg at the
 *    unit's position. At start of owner's next turn, the egg hatches
 *    into a full copy of the unit. Engine handles rebirth internally.
 *
 * Golden tests: test/cards/insurgency/s1_char_106_wraith_calder.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_106" as CardDefinition["id"],
  name: "Wraith Calder",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 4 },
  keywords: ["rebirth"],
  abilities: [
    // --- Death Explosion: deal 2 damage to all adjacent enemies on death ---
    {
      id: "calder_death_explosion" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "foreach",
        over: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_106.webp"),
  flavorText:
    "Seven graves bear his name across seven battlefields. He has visited each one, and left them all.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive", "offensive"] as const,
  verdict_delta: 1,
};
