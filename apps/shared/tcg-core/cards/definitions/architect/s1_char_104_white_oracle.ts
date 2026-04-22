/**
 * s1_char_104 — White Oracle
 *
 * Legendary unit · Architect faction · 7 cost · 3/8
 * Keywords: none
 *
 * Oracle text:
 *   "The Architect wore the Oracle's face. On deploy, silence an
 *    enemy unit and gain +4/+4 — becoming what you behold."
 *
 * Lore: The White Oracle is the stolen identity the Architect wears as
 * a mask. During the Fall of Reality, the Architect captured the true
 * Oracle and assumed her visage to deceive the Witness. The White Oracle
 * unit embodies this deception — on deploy it silences an enemy (strips
 * their identity) while growing in power, as though absorbing their
 * essence. Base 3/8 becomes an effective 7/12 — a formidable presence
 * that paid the cost of its own identity theft.
 *
 * Mechanical model:
 *  - On deploy, target an enemy unit. Silence that unit (strip abilities,
 *    buffs, and keywords). Then buff self +4/+4 permanently, representing
 *    the stolen essence. The stat gain is fixed rather than stat-copy
 *    because the effect system's `buff` op takes literal StatDelta values.
 *
 * Golden tests: test/cards/architect/s1_char_104_white_oracle.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_104" as CardDefinition["id"],
  name: "White Oracle",
  faction: "architect",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 3, health: 8 },
  keywords: [],
  abilities: [
    // --- Stolen Visage: silence an enemy and gain +4/+4 on deploy ---
    {
      id: "wo_stolen_visage" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "sequence",
          steps: [
            {
              op: "silence",
              to: { kind: "it" },
            },
            {
              op: "buff",
              stats: { power: 4, health: 4 },
              duration: { kind: "permanent" },
              to: { kind: "self" },
            },
          ],
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_104.webp"),
  flavorText:
    "She speaks with the Oracle's voice, sees through the Oracle's eyes, and wears the Oracle's fate. But the words are the Architect's.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 2,
};
