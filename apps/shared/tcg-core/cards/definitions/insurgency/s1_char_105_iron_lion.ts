/**
 * s1_char_105 — Iron Lion
 *
 * Epic unit · Insurgency faction · 5 cost · 5/5
 * Keywords: rush
 *
 * Oracle text:
 *   "The general's honor. May act immediately. On deploy, give
 *    adjacent allies +1/+1 permanently."
 *
 * Lore: The Iron Lion is the legendary warrior who led the Insurgency's
 * most decisive strikes against the AI Empire. Born in Year 6, he rose
 * through the ranks through sheer martial excellence and an
 * unshakeable code of honor. This variant represents the Lion at the
 * height of his command — charging into the frontline (rush) and
 * rallying adjacent allies with his presence.
 *
 * Note: s1_char_010 is the existing Iron Lion with provoke + rally_buff.
 * This is the rush + adjacent buff variant at the s1_char_105 slot.
 *
 * Mechanical model:
 *  - Rush: intrinsic keyword, may act the turn summoned.
 *  - On deploy, all friendly units within radius 1 (adjacent) receive
 *    a permanent +1/+1 buff. Uses foreach over a radius selector.
 *
 * Golden tests: test/cards/insurgency/s1_char_105_iron_lion.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_105" as CardDefinition["id"],
  name: "Iron Lion",
  faction: "insurgency",
  cardType: "unit",
  rarity: "epic",
  cost: 5,
  baseStats: { power: 5, health: 5 },
  keywords: ["rush"],
  abilities: [
    // --- General's Honor: buff adjacent allies on deploy ---
    {
      id: "il2_generals_honor" as CardDefinition["abilities"][number]["id"],
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
          op: "buff",
          stats: { power: 1, health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_105.webp"),
  flavorText:
    "He does not ask his soldiers to hold the line. He stands in front of it.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};
