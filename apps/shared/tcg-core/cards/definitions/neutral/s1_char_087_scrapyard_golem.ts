/**
 * s1_char_087 — Scrapyard Golem
 *
 * Common unit · Neutral · 4 cost · 5/4
 * Keywords: provoke
 *
 * A hulking construct assembled from battlefield debris.
 * Cheap provoke body for any deck that needs a wall.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_087" as CardDefinition["id"],
  name: "Scrapyard Golem",
  faction: "neutral",
  cardType: "unit",
  rarity: "common",
  cost: 4,
  baseStats: { power: 5, health: 4 },
  keywords: ["provoke"],
  abilities: [
    // --- Scrap Reinforcement: give self +1/+0 on deploy ---
    {
      id: "scrapyard_deploy_buff" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "buff",
        stats: { power: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_087.webp"),
  flavorText:
    "It was built from the wreckage of a dozen machines, none of which were designed to kill. It learned that part on its own.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
  // §5.7 alignment-but-stronger: a rebuilt-from-scrap construct reads
  // publicly as evidence of craftsmanship — reinforces the Game
  // Master's narrative louder than the private scoring. No sign
  // divergence (both positive), so no warning border — just a
  // louder row on the public record.
  public_delta: 2,
};
