/**
 * s1_pack_cosm_frame_gold — Golden Prophecy Shard
 *
 * Rare unit · Dreamer faction · 3 cost · 2/4
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, add 2 forcefield charges to self.
 *    A fragment of the Oracle's golden vision, crystallized into matter."
 *
 * Lore: The Golden Prophecy is the Oracle's ultimate vision — a
 * glimpse of the timeline where all factions find peace. This shard
 * is a physical fragment of that vision, wrapped in a double layer
 * of prophetic protection. The forcefield charges represent the
 * prophecy's insistence on surviving: this future refuses to die.
 *
 * Cosmetic unlock: Collecting this card unlocks the Golden Prophecy
 * avatar frame.
 *
 * Balance: 3 cost · 2/4 = 6 stats. Budget = 3*2+1 = 7. 2 forcefield
 * charges ~1 stat. 7 - 1 = 6. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_cosm_frame_gold" as CardDefinition["id"],
  name: "Golden Prophecy Shard",
  faction: "dreamer",
  cardType: "unit",
  rarity: "rare",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "gps_deploy_forcefield" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 2,
        to: { kind: "self" },
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "A fragment of the Oracle's golden vision, crystallized into matter.",
  rulesVersion: "1.0.0",
};
