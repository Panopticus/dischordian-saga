/**
 * s1_pack_045 — Universal Adapter
 *
 * Uncommon unit · Neutral faction �� 2 cost · 2/2
 *
 * Oracle text:
 *   "On deploy, draw 1 card. Compatible with everything."
 *
 * A cantrip body that replaces itself on deploy. The 2/2 for 2 is
 * a clean statline, and the free draw means you never lose card
 * advantage by playing it. Fits into any deck as a smooth curve
 * filler with value attached.
 *
 * Mechanical model:
 *  - On deploy, draw 1 card.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_045" as CardDefinition["id"],
  name: "Universal Adapter",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: [],
  abilities: [
    {
      id: "ua_deploy_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "placeholder",
  flavorText:
    "It connects to any system, any faction, any purpose. Versatility is the only true currency.",
  rulesVersion: "1.0.0",
};
