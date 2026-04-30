/**
 * s1_pack_040 — Fossil Sentinel
 *
 * Common unit · Antiquarian faction · 2 cost · 1/4
 * Keywords: grow
 *
 * Oracle text:
 *   "Grow: gains +1/+1 at the start of your turn. Ancient stone
 *    that remembers how to live."
 *
 * A cheap grow threat. The 1/4 statline is defensive enough to
 * survive early aggression, and the grow keyword means it becomes
 * 2/5, 3/6, 4/7... each turn. If left unchecked, it snowballs into
 * an unstoppable force. A classic Antiquarian value engine.
 *
 * Mechanical model:
 *  - Grow: intrinsic keyword. At the start of the owner's turn, gains
 *    +1/+1 permanently.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_040" as CardDefinition["id"],
  name: "Fossil Sentinel",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 1, health: 4 },
  keywords: ["grow"],
  abilities: [
    {
      id: "fs_grow" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_040.webp"),
  flavorText:
    "It was buried for a thousand ages. Each one made it stronger. Now it remembers why it was buried.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
};
