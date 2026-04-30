/**
 * s1_pack_012 — Rebel Arsenal
 *
 * Common spell · Insurgency faction · 2 cost
 *
 * Oracle text:
 *   "Give a friendly unit +3/+0 this turn. Arm the resistance."
 *
 * Aggressive combat trick. A cheap burst of attack power that can
 * push a unit into lethal range or enable a favorable trade. At 2
 * mana for +3 attack, it is efficient and dangerous. Classic
 * Insurgency tempo tool.
 *
 * Mechanical model:
 *  - On cast, target a friendly unit and buff +3/+0 for this turn.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_012" as CardDefinition["id"],
  name: "Rebel Arsenal",
  faction: "insurgency",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "ra_buff_attack" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "buff",
          stats: { power: 3, health: 0 },
          duration: { kind: "this_turn" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_012.webp"),
  flavorText:
    "The crates were unmarked. The weapons inside were not.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
