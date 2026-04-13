/**
 * s1_spell_231 — Temporal Fracture
 *
 * Uncommon spell · Antiquarian faction · 3 cost
 *
 * Oracle text:
 *   "Stun all enemy units for 1 turn. Time fractures around the enemy —
 *    they are frozen between one second and the next."
 *
 * Board-wide stun. Buys a full turn of breathing room by locking down
 * every enemy unit. Premium control tool for the Antiquarian's
 * tempo-based strategies.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_231" as CardDefinition["id"],
  name: "Temporal Fracture",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "tf_stun_all" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "stun",
          duration: { kind: "n_turns", n: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The clock hands stop. The pendulum hangs mid-swing. Only the Antiquarian still moves.",
  rulesVersion: "1.0.0",
};
