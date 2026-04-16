/**
 * s1_char_117 — Senator Voss
 *
 * Epic unit · New Babylon faction · 5 cost · 3/4
 * Keywords: none
 *
 * Oracle text:
 *   "Democracy-as-death-sentence. On deploy, destroy a friendly unit
 *    and summon a 5/5 Crystal Senator — power demands sacrifice."
 *
 * Lore: Senator Voss perfected New Babylon's most ruthless political
 * instrument: mandatory sacrifice for the greater good of the state.
 * In the Senate's calculus, every citizen is a resource, and Voss has
 * the authority to liquidate any asset and reconstitute it as raw
 * political power. The Crystal Senator that emerges is neither alive
 * nor dead — it is the vote itself made flesh, a crystalline
 * automaton that executes the Senate's will. The Witness records that
 * Voss never sacrificed herself. Democracy, after all, has its privileges.
 *
 * Mechanical model:
 *  - On deploy, the player must choose a friendly unit to sacrifice
 *    (sacrifice_then). After the sacrifice resolves, a 5/5 Crystal
 *    Senator token is summoned at a random empty adjacent position.
 *
 * Golden tests: test/cards/new_babylon/s1_char_117_senator_voss.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_117" as CardDefinition["id"],
  name: "Senator Voss",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    // --- Democracy's Price: sacrifice a friendly, summon Crystal Senator ---
    {
      id: "voss_democracy_price" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sacrifice_then",
        sac: {
          kind: "single",
          filter: { controller: "self", except: "self" },
          chooser: "player",
        },
        then: {
          op: "summon",
          tokenId: "token_crystal_senator_5_5",
          at: { kind: "random_empty" },
          controller: "self",
        },
      },
    },
  ],
  art: "/art/cards/s1_char_117.webp",
  flavorText:
    "The vote was unanimous. It always is, when the dissenters have already been recycled.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
};
