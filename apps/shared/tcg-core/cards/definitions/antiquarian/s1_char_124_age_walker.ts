/**
 * s1_char_124 — Age Walker
 *
 * Common unit · Antiquarian faction · 3 cost · 2/3
 * Keywords: grow
 *
 * Oracle text:
 *   "Grows through the ages. Gains +1/+1 at the start of your
 *    turn — each age strengthens what endures."
 *
 * Lore: Age Walkers are Antiquarian adepts who have learned to draw
 * strength from the passage of time itself. While the Dischordian Cycle
 * grinds civilizations to dust, the Age Walker absorbs temporal energy
 * from each passing age, growing stronger with every turn. Left
 * unchecked, an Age Walker becomes an unstoppable force — a lesson the
 * Architect learned when a single Walker held the Temporal Nexus for
 * eleven turns against an entire assault battalion. The Witness records
 * this as "the patience proof."
 *
 * Mechanical model:
 *  - Grow: intrinsic keyword. At the start of the owner's turn, gains
 *    +1/+1 permanently. The engine handles the grow keyword's stat
 *    increase internally. A snowball threat that demands early removal.
 *
 * Golden tests: test/cards/antiquarian/s1_char_124_age_walker.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_124" as CardDefinition["id"],
  name: "Age Walker",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 3 },
  keywords: ["grow"],
  abilities: [
    {
      id: "aw_grow" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_124.webp",
  flavorText:
    "It was small when the first age began. By the third, armies feared it. By the seventh, they worshipped it.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
