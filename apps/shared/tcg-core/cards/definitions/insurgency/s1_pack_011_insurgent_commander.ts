/**
 * s1_pack_011 — Insurgent Commander
 *
 * Rare unit · Insurgency faction · 5 cost · 5/5
 * Keywords: rush
 *
 * Oracle text:
 *   "Rush. On deploy, give adjacent friendly units rush this turn.
 *    When the Commander charges, everyone charges."
 *
 * Premium midrange threat that enables alpha strikes. The Commander
 * arrives with rush and grants it to adjacent allies, turning a
 * defensive board into an aggressive one in a single turn. Pack-
 * exclusive tempo finisher.
 *
 * Mechanical model:
 *  - Rush: intrinsic keyword. On deploy, foreach adjacent friendly
 *    unit (excluding self), grant can_attack_this_turn for this turn.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_011" as CardDefinition["id"],
  name: "Insurgent Commander",
  faction: "insurgency",
  cardType: "unit",
  rarity: "rare",
  cost: 5,
  baseStats: { power: 5, health: 5 },
  keywords: ["rush"],
  abilities: [
    {
      id: "ic_rally_rush" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "self", except: "self" },
        },
        do: {
          op: "grant_keyword",
          keyword: "can_attack_this_turn",
          duration: { kind: "this_turn" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_pack_011.webp",
  flavorText:
    "He does not give orders. He gives permission. And the Insurgency has been waiting a long time to hear it.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
};
