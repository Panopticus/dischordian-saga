/**
 * s1_pack_cosm_ship_theme — Corrupted Ark Fragment
 *
 * Rare unit · Architect faction · 3 cost · 2/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, silence a random enemy unit.
 *    A piece of the Ark, corrupted beyond recognition. It still
 *    remembers how to erase."
 *
 * Lore: The Corrupted Ark was the Architect's original vessel —
 * a ship so infused with the faction's erasure protocols that even
 * its fragments retain the ability to silence. This shard targets
 * a random enemy on deployment, stripping their abilities with the
 * same Damnatio Memoriae protocol the Collector once wielded.
 *
 * Cosmetic unlock: Collecting this card unlocks the Corrupted Ark
 * ship theme.
 *
 * Balance: 3 cost · 2/4 = 6 stats. Budget = 3*2+1 = 7. Random
 * silence on deploy ~1 stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_cosm_ship_theme" as CardDefinition["id"],
  name: "Corrupted Ark Fragment",
  faction: "architect",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "caf_deploy_silence_random" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "silence",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "A piece of the Ark, corrupted beyond recognition. It still remembers how to erase.",
  rulesVersion: "1.0.0",
};
