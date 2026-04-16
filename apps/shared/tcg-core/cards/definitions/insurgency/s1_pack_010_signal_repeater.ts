/**
 * s1_pack_010 — Signal Repeater
 *
 * Uncommon unit · Insurgency faction · 3 cost · 2/3
 *
 * Oracle text:
 *   "On death, draw 2 cards. The signal persists beyond the carrier."
 *
 * A sticky value engine. The 2/3 body is modest for 3 mana, but the
 * death trigger drawing 2 cards makes this extremely card-efficient.
 * Opponents face a dilemma: leave it alive or give the Insurgency
 * massive card advantage. Premium uncommon.
 *
 * Mechanical model:
 *  - On death, draw 2 cards for the controlling player.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_010" as CardDefinition["id"],
  name: "Signal Repeater",
  faction: "insurgency",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 3 },
  keywords: [],
  abilities: [
    {
      id: "sr_death_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 2 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_pack_010.webp",
  flavorText:
    "Destroy the tower. The broadcast has already been copied to a thousand receivers.",
  rulesVersion: "1.0.0",
  trial_categories: ["confession"] as const,
};
