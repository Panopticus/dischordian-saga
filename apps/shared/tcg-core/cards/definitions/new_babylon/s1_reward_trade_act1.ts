/**
 * s1_reward_trade_act1 — Trade Scout
 *
 * Common unit · New Babylon faction · 2 cost · 2/3
 * Keywords: none
 *
 * Oracle text:
 *   "On deploy, gain 1 mana this turn.
 *    First contact. First contract. First profit."
 *
 * Lore: Act 1 of the Trade Empire questline sends players into
 * uncharted markets to establish initial trade routes. The Trade
 * Scout is the vanguard of commerce — a New Babylon operative who
 * identifies opportunities and generates immediate (if temporary)
 * resource advantage, like a scout who finds a shortcut to wealth.
 *
 * Reward: Complete Trade Empire Act 1.
 *
 * Balance: 2 cost · 2/3 = 5 stats. Budget = 2*2+1 = 5. Gain 1
 * temporary mana ~0.5 stat. On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_reward_trade_act1" as CardDefinition["id"],
  name: "Trade Scout",
  faction: "new_babylon",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "ts_gain_1_temp_mana" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "gain_mana",
        amount: { kind: "const", value: 1 },
        permanent: false,
      },
    },
  ],
  art: "/art/cards/s1_reward_trade_act1.webp",
  flavorText:
    "First contact. First contract. First profit.",
  rulesVersion: "1.0.0",
};
