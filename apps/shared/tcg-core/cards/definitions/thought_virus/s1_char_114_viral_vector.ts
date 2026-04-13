/**
 * s1_char_114 — Viral Vector
 *
 * Rare unit · Thought Virus faction · 3 cost · 2/3
 * Keywords: none
 *
 * Oracle text:
 *   "Infection spreads. On death, give adjacent enemy units -1/-1
 *    permanently — the virus leaps to new hosts."
 *
 * Lore: Viral Vectors are the Thought Virus's delivery mechanism —
 * fragile, expendable carriers that exist only to reach proximity to
 * healthy hosts before expiring and releasing their payload. The
 * Insurgency learned this the hard way at the Battle of Nexus Gate:
 * killing a Vector only accelerated the infection. The Witness records
 * that the most effective countermeasure was isolation, not destruction.
 *
 * Mechanical model:
 *  - On death (dying wish), all enemy units within radius 1 of the
 *    death position receive a permanent -1/-1 debuff. Uses foreach
 *    over a radius selector centered on self.
 *
 * Golden tests: test/cards/thought_virus/s1_char_114_viral_vector.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_114" as CardDefinition["id"],
  name: "Viral Vector",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    // --- Infection Burst: debuff adjacent enemies on death ---
    {
      id: "vv_infection_burst" as CardDefinition["abilities"][number]["id"],
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
          op: "debuff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_char_114.webp",
  flavorText:
    "Do not kill it. Do not touch it. Do not look at it too long. The infection reads your attention as an invitation.",
  rulesVersion: "1.0.0",
};
