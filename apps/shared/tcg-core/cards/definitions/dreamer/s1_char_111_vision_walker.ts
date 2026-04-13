/**
 * s1_char_111 — Vision Walker
 *
 * Common unit · Dreamer faction · 3 cost · 2/3
 * Keywords: flying
 *
 * Oracle text:
 *   "Dreamers see beyond walls. May move to any empty tile —
 *    the Vision Walker walks between what is and what could be."
 *
 * Lore: Vision Walkers are Dreamer adepts who have learned to perceive
 * the probability layers that underlie physical space. Walls, barriers,
 * and fortifications exist only in the "prime" layer — the Vision Walker
 * simply steps through adjacent probabilities where the wall was never
 * built. This is the Dreamer faction's answer to the Architect's
 * fortified positions: you cannot wall out someone who walks through
 * the spaces between your certainties.
 *
 * Mechanical model:
 *  - Flying: intrinsic keyword. May move to any empty tile on the board
 *    rather than being limited to adjacent tiles.
 *
 * Golden tests: test/cards/dreamer/s1_char_111_vision_walker.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_111" as CardDefinition["id"],
  name: "Vision Walker",
  faction: "dreamer",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 2, health: 3 },
  keywords: ["flying"],
  abilities: [
    // --- Probability Blessing: give a random friendly unit +1/+1 on deploy ---
    {
      id: "vision_deploy_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "random",
        },
        do: {
          op: "buff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_char_111.webp",
  flavorText:
    "To the untrained eye, she vanishes. To the Dreamer's eye, she simply takes a different path — one that was always there.",
  rulesVersion: "1.0.0",
};
