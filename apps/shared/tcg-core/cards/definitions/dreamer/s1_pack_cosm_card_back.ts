/**
 * s1_pack_cosm_card_back — Echoes of the Fall
 *
 * Rare spell · Dreamer faction · 2 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Heal all friendly units for 2.
 *    The Fall broke everything. The echoes put some of it back."
 *
 * Lore: The Dreamers perceive time differently — they hear the
 * echoes of past events as clearly as the present. This spell
 * channels the echoes of the Fall into restorative energy, healing
 * all friendly units. What was broken can be mended, if you know
 * how to listen to the reverberations.
 *
 * Cosmetic unlock: Collecting this card unlocks the S1 card back.
 *
 * Balance: 2 cost spell. AoE heal 2 to all friendly units is
 * comparable to Elara's Guidance at the same cost. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_cosm_card_back" as CardDefinition["id"],
  name: "Echoes of the Fall",
  faction: "dreamer",
  cardType: "spell",
  rarity: "rare",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "eotf_heal_all" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
        },
        do: {
          op: "heal",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_cosm_card_back.webp"),
  flavorText:
    "The Fall broke everything. The echoes put some of it back.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
