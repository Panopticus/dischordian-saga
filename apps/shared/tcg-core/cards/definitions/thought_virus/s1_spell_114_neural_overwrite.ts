/**
 * s1_spell_114 — Neural Overwrite
 *
 * Rare spell · Thought Virus faction · 5 cost
 *
 * Oracle text:
 *   "Transform an enemy unit into a 1/1 Husk. The mind is rewritten.
 *    The body follows."
 *
 * Hard transform — reduces any enemy unit to a 1/1 token. The Thought Virus
 * doesn't just infect; it overwrites the host's neural architecture entirely.
 * What remains is a hollow shell — technically alive, functionally nothing.
 * The "husk_1_1" token is a neutral token defined elsewhere in the registry.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_114" as CardDefinition["id"],
  name: "Neural Overwrite",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "rare",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "no_transform_1_1" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "transform",
          into: "husk_1_1",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_114.webp",
  flavorText:
    "The soldier's eyes went blank mid-sentence. When he spoke again, it was in the Source's voice, thanking them for the vessel.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence"] as const,
};
