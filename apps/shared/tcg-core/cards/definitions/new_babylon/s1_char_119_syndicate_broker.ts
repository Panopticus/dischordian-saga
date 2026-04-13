/**
 * s1_char_119 — Syndicate Broker
 *
 * Common unit · New Babylon faction · 3 cost · 3/3
 * Keywords: none
 *
 * Oracle text:
 *   "Information for a price. On deploy, draw a card then discard
 *    a card — the Broker deals in filtered intelligence."
 *
 * Lore: Syndicate Brokers operate in New Babylon's gray markets,
 * trading information, contraband, and loyalties. They serve no faction
 * exclusively but always serve New Babylon's interests. When deployed,
 * the Broker's network activates — you gain intel (draw) but must pay
 * with intel of your own (discard). The net effect is card filtering:
 * you trade what you don't need for a chance at what you do. The
 * Witness regards the Brokers as "the nervous system of New Babylon's
 * shadow economy."
 *
 * Mechanical model:
 *  - On deploy: draw 1 card, then discard 1 card (player's choice).
 *    A sequence of draw + discard for card quality filtering.
 *
 * Golden tests: test/cards/new_babylon/s1_char_119_syndicate_broker.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_119" as CardDefinition["id"],
  name: "Syndicate Broker",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 3, health: 3 },
  keywords: [],
  abilities: [
    // --- Black Market Deal: draw then discard on deploy ---
    {
      id: "sb_black_market" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "self",
          },
          {
            op: "discard",
            amount: { kind: "const", value: 1 },
            from: "self",
            mode: "choose",
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_char_119.webp",
  flavorText:
    "Everything has a price in New Babylon. The Broker's gift is knowing exactly what yours is.",
  rulesVersion: "1.0.0",
};
