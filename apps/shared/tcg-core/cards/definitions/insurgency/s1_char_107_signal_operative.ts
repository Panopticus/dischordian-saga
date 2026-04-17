/**
 * s1_char_107 — Signal Operative
 *
 * Common unit · Insurgency faction · 2 cost · 2/2
 * Keywords: none
 *
 * Oracle text:
 *   "The signal persists. On death, draw a card — the transmission
 *    was already sent."
 *
 * Lore: Signal Operatives are the Insurgency's communications backbone,
 * threading encrypted data through the Architect's surveillance net.
 * Even death cannot stop the signal — when an Operative falls, the
 * message has already been transmitted. This is the Insurgency's core
 * philosophy: the cause outlives the individual. The Witness records
 * that not a single Operative's final transmission was ever intercepted.
 *
 * Mechanical model:
 *  - On death (dying wish), the controller draws 1 card.
 *    A cheap body that replaces itself in hand on death.
 *
 * Golden tests: test/cards/insurgency/s1_char_107_signal_operative.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_107" as CardDefinition["id"],
  name: "Signal Operative",
  faction: "insurgency",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: [],
  abilities: [
    // --- The Signal Persists: draw on death ---
    {
      id: "sigop_draw_on_death" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_char_107.webp",
  flavorText:
    "Kill the messenger. The message was sent three seconds before you arrived.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "reactive"] as const,
  verdict_delta: 1,
};
