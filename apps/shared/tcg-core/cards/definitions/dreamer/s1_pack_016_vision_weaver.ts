/**
 * s1_pack_016 — Vision Weaver
 *
 * Uncommon unit · Dreamer faction · 3 cost · 2/4
 *
 * Oracle text:
 *   "At the start of your turn, draw 1 card. The visions never stop."
 *
 * A persistent card advantage engine. While the 2/4 body is modest,
 * the recurring draw each turn makes this unit extremely valuable
 * if left alive. Opponents must remove it quickly or face an
 * insurmountable card advantage gap. Premium uncommon.
 *
 * Mechanical model:
 *  - On turn start (owner), draw 1 card.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_016" as CardDefinition["id"],
  name: "Vision Weaver",
  faction: "dreamer",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "vw_turn_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_016.webp"),
  flavorText:
    "She weaves futures like thread — each dawn, a new strand appears in her hands.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 1,
};
