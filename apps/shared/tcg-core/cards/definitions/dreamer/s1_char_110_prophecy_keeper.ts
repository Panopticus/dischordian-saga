/**
 * s1_char_110 — Prophecy Keeper
 *
 * Rare unit · Dreamer faction · 4 cost · 3/5
 * Keywords: none
 *
 * Oracle text:
 *   "At the start of your turn, draw a card — the future reveals
 *    itself to those who know how to listen."
 *
 * Lore: The Prophecy Keepers are the Dreamer faction's seers, custodians
 * of the visions that flow from the Living Universe's subconscious.
 * They interpret the Dischordian Cycle's patterns and translate them
 * into actionable intelligence. Each turn they persist, they pull
 * another thread of the future into the present — represented as a
 * card draw. The Witness regards them as the closest mortal
 * approximation to its own observational role.
 *
 * Mechanical model:
 *  - On turn start (owner: "self"), draw 1 card. A recurring draw
 *    engine that rewards keeping the Prophecy Keeper alive.
 *
 * Golden tests: test/cards/dreamer/s1_char_110_prophecy_keeper.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_110" as CardDefinition["id"],
  name: "Prophecy Keeper",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: [],
  abilities: [
    // --- Foresight: draw on turn start ---
    {
      id: "pk_foresight" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_char_110.webp",
  flavorText:
    "She reads the future not in tea leaves or stars but in the Living Universe's heartbeat. Each pulse is a chapter yet unwritten.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};
