/**
 * s1_pack_014 — Agent Zero, Reborn
 *
 * Legendary unit · Insurgency faction · 7 cost · 6/7
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On deploy, deal 3 damage to an enemy unit and give all
 *    friendly units +1/+1 permanently. The signal returns. Louder."
 *
 * THE Insurgency pack chase card. Agent Zero returns with a vengeance:
 * rush for immediate impact, targeted removal on deploy, and a
 * board-wide permanent buff. A complete package that threatens
 * lethal the moment it arrives. Premium legendary in every sense.
 *
 * Mechanical model:
 *  - Rush: intrinsic keyword. On deploy: sequence of deal 3 to a
 *    chosen enemy, then foreach friendly buff +1/+1 permanently.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_014" as CardDefinition["id"],
  name: "Agent Zero, Reborn",
  faction: "insurgency",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 6, health: 7 },
  keywords: ["rush"],
  abilities: [
    {
      id: "azr_deploy_combo" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
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
              op: "deal_damage",
              amount: { kind: "const", value: 3 },
              to: { kind: "it" },
            },
          },
          {
            op: "foreach",
            over: {
              kind: "all",
              filter: { controller: "self" },
            },
            do: {
              op: "buff",
              stats: { power: 1, health: 1 },
              duration: { kind: "permanent" },
              to: { kind: "it" },
            },
          },
        ],
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_014.webp"),
  flavorText:
    "They buried the signal. They burned the frequency. They erased the name. None of it mattered.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};
