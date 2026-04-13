/**
 * s1_pack_039 — Age of Reckoning
 *
 * Uncommon spell · Antiquarian faction · 3 cost
 *
 * Oracle text:
 *   "Deal 3 damage to a unit. Heal a friendly unit for 3.
 *    One age ends. Another is restored."
 *
 * Versatile removal-plus-heal. The flexibility of dealing damage
 * and healing in a single card makes this extremely efficient.
 * Can kill a small enemy while saving a damaged ally, or finish off
 * a wounded threat while topping up your biggest unit. Premium
 * uncommon utility.
 *
 * Mechanical model:
 *  - On cast: sequence of deal 3 to a chosen unit (any), then heal
 *    3 to a chosen friendly unit.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_039" as CardDefinition["id"],
  name: "Age of Reckoning",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "uncommon",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "aor_damage_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "with_target",
            selector: {
              kind: "single",
              filter: { controller: "any" },
              chooser: "player",
            },
            do: {
              op: "deal_damage",
              amount: { kind: "const", value: 3 },
              to: { kind: "it" },
            },
          },
          {
            op: "with_target",
            selector: {
              kind: "single",
              filter: { controller: "self" },
              chooser: "player",
            },
            do: {
              op: "heal",
              amount: { kind: "const", value: 3 },
              to: { kind: "it" },
            },
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_pack_039.webp",
  flavorText:
    "The old age crumbles. The new age mends what it can. The cycle continues.",
  rulesVersion: "1.0.0",
};
