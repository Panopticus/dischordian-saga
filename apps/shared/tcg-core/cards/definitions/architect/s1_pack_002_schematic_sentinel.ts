/**
 * s1_pack_002 — Schematic Sentinel
 *
 * Common unit · Architect faction · 3 cost · 3/4
 *
 * Oracle text:
 *   "On deploy, gain +0/+1. Built to spec — and then some."
 *
 * Solid common body with a deploy bonus. The Sentinel arrives
 * slightly above curve as a 3/5 for 3, making it an excellent
 * defensive option. Simple, effective, and satisfying to play.
 *
 * Mechanical model:
 *  - On deploy, buff self +0/+1 permanently. Effective statline: 3/5.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_002" as CardDefinition["id"],
  name: "Schematic Sentinel",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 3,
  baseStats: { power: 3, health: 4 },
  keywords: [],
  abilities: [
    {
      id: "ss_deploy_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 0, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_pack_002.webp",
  flavorText:
    "Every rivet placed with mathematical certainty. Every joint stress-tested against probability itself.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive"] as const,
};
