/**
 * s1_pack_042 — Memory Splice
 *
 * Common spell · Antiquarian faction · 1 cost
 *
 * Oracle text:
 *   "Heal a unit for 3. A fragment of a better time, grafted
 *    onto the present."
 *
 * Cheap, efficient heal. At 1 mana for 3 health, this is an
 * excellent rate that keeps key units alive through combat. Can
 * target any unit — yours or the opponent's — though you will
 * almost always use it on your own. A common staple for any
 * Antiquarian deck that values attrition.
 *
 * Mechanical model:
 *  - On cast, target any unit and heal it for 3.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_042" as CardDefinition["id"],
  name: "Memory Splice",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "ms_heal_3" as CardDefinition["abilities"][number]["id"],
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
  art: "placeholder",
  flavorText:
    "She reached into yesterday and pulled out a moment before the wound. The body remembered.",
  rulesVersion: "1.0.0",
};
