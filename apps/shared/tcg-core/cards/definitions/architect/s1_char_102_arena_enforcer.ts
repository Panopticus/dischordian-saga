/**
 * s1_char_102 — Arena Enforcer
 *
 * Common unit · Architect faction · 3 cost · 2/4
 * Keywords: provoke
 *
 * Oracle text:
 *   "Enemies must attack this unit. The rotation enforcers keep
 *    the Arena's cycle turning — no one escapes the schedule."
 *
 * Lore: The Arena Enforcers maintain the Architect's rotation protocol,
 * ensuring every citizen takes their turn in the Arena. They are the
 * living embodiment of the Dischordian Cycle's cruelest mechanic —
 * mandatory participation in the games of survival.
 *
 * Mechanical model:
 *  - Provoke: adjacent enemies must attack this unit. Intrinsic keyword,
 *    no additional abilities needed.
 *
 * Golden tests: test/cards/architect/s1_char_102_arena_enforcer.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_102" as CardDefinition["id"],
  name: "Arena Enforcer",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: ["provoke"],
  abilities: [
    // --- Rotation Lock: stun an adjacent enemy for 1 turn on deploy ---
    {
      id: "enforcer_deploy_stun" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "opponent" },
        },
        do: {
          op: "stun",
          duration: { kind: "n_turns", n: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_102.webp"),
  flavorText:
    "Your rotation has arrived. There is no deferral. There is no appeal. Step into the Arena.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
