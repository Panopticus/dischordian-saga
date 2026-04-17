/**
 * s1_spell_216 — Oracle's Blessing
 *
 * Common spell · Dreamer faction · 2 cost
 *
 * Oracle text:
 *   "Give a friendly unit forcefield this turn. The Oracle whispers
 *    a word of protection — for one breath, nothing can touch you."
 *
 * Defensive trick. Forcefield absorbs the first damage instance this turn,
 * making a key unit invulnerable to the next hit. Cheap insurance.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_216" as CardDefinition["id"],
  name: "Oracle's Blessing",
  faction: "dreamer",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "ob_forcefield" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "grant_keyword",
          keyword: "forcefield",
          duration: { kind: "this_turn" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_216.webp",
  flavorText:
    "The Oracle spoke a single syllable. The blade passed through like light through glass.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
