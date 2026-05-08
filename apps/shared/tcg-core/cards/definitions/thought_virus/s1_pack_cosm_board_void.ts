/**
 * s1_pack_cosm_board_void — Void Arena Rift
 *
 * Rare spell · Thought Virus faction · 3 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Deal 2 damage to all enemies.
 *    The arena tears open. The Void pours through."
 *
 * Lore: The Void Arena is a battlefield that exists between
 * dimensions — a rift in spacetime where the Thought Virus's
 * corrosive signal is strongest. This spell tears that rift open
 * on the current battlefield, bathing all enemies in the Void's
 * destructive energy.
 *
 * Cosmetic unlock: Collecting this card unlocks the Void Arena
 * board skin.
 *
 * Balance: 3 cost spell. Deal 2 to all enemies is ~3 mana value
 * with good board presence. On budget.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_cosm_board_void" as CardDefinition["id"],
  name: "Void Arena Rift",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "rare",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "var_aoe_damage" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_cosm_board_void.webp"),
  flavorText:
    "The arena tears open. The Void pours through.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
