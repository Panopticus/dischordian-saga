/**
 * s1_spell_230 — Chrono Anchor
 *
 * Common spell · Antiquarian faction · 1 cost
 *
 * Oracle text:
 *   "Heal a unit for 3. The Antiquarian pins a moment of wholeness
 *    in time and draws the wounded back to it."
 *
 * Cheap, efficient healing. Can target any unit (friend or foe), but
 * typically used to preserve friendly units through combat. The Antiquarian's
 * mastery of time expressed as restoration.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_230" as CardDefinition["id"],
  name: "Chrono Anchor",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "ca_heal_3" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "any" },
          chooser: "player",
        },
        do: {
          op: "heal",
          amount: { kind: "const", value: 3 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_230.webp",
  flavorText:
    "The wound closes. Not because it healed, but because it never happened.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
