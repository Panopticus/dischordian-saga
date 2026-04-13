/**
 * s1_spell_220 — Assimilate
 *
 * Rare spell · Thought Virus faction · 4 cost
 *
 * Oracle text:
 *   "Destroy an enemy unit. Summon a 2/2 Infected token for you.
 *    What was theirs is now part of the swarm."
 *
 * Removal that generates board presence. Destroy a threat and leave behind
 * a body. The Thought Virus doesn't just kill — it converts.
 * References tok_infected_2_2.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_220" as CardDefinition["id"],
  name: "Assimilate",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "rare",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "as_destroy_summon" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "with_target",
            selector: {
              kind: "single",
              filter: { controller: "opponent" },
              chooser: "player",
            },
            do: {
              op: "destroy",
              to: { kind: "it" },
            },
          },
          {
            op: "summon",
            tokenId: "tok_infected_2_2",
            at: { kind: "random_empty" },
            controller: "self",
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_spell_220.webp",
  flavorText:
    "The host collapses. Something new rises from the remains, wearing a familiar face.",
  rulesVersion: "1.0.0",
};
