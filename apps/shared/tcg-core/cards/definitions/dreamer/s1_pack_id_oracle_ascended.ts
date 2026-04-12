/**
 * s1_pack_id_oracle_ascended — The Ascended Oracle
 *
 * Legendary unit · Dreamer faction · 8 cost · 5/9
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, draw 2 and stun all enemy units for 1 turn.
 *    The full prophecy realized. Every enemy frozen in the light of
 *    absolute foresight."
 *
 * Lore: The Oracle's journey reaches its apex — full prophecy
 * recovered, identity restored, power unbound. The Ascended Oracle
 * perceives every possible future simultaneously, and that sight
 * overwhelms all enemies: they are stunned by the weight of infinite
 * foreknowledge. The draw represents the Oracle's complete mastery
 * of prophetic vision.
 *
 * Identity variant: Oracle arc (3/3) — dreamer phase, full prophecy realized.
 *
 * Balance: 8 cost · 5/9 = 14 stats. Budget = 8*2+1 = 17. Draw 2
 * ~2 stats, AoE stun all enemies ~3 stats. 17 - 5 = 12. At 14 stats,
 * slightly generous but justified by legendary rarity and the massive
 * 8-cost investment. On budget for legendary.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_id_oracle_ascended" as CardDefinition["id"],
  name: "The Ascended Oracle",
  faction: "dreamer",
  cardType: "unit",
  rarity: "legendary",
  cost: 8,
  baseStats: { power: 5, health: 9 },
  keywords: [],
  abilities: [
    {
      id: "oa_deploy_draw_stun" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "draw",
            amount: { kind: "const", value: 2 },
            who: "self",
          },
          {
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
        ],
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "The full prophecy realized. Every enemy frozen in the light of absolute foresight.",
  rulesVersion: "1.0.0",
};
