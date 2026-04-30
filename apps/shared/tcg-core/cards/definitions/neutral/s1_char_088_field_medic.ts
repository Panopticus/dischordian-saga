/**
 * s1_char_088 — Field Medic
 *
 * Uncommon unit · Neutral · 3 cost · 2/4
 * Keywords: drain
 *
 * A neutral healer who sustains herself and her allies
 * through battlefield triage.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_088" as CardDefinition["id"],
  name: "Field Medic",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 2, health: 4 },
  keywords: ["drain"],
  abilities: [
    {
      id: "fm_drain" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_damage_dealt", by: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 1 },
        to: { kind: "friendly_general" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_088.webp"),
  flavorText:
    "She does not ask which side you fight for. Only where it hurts.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
  // §5.7 divergence: a medic healing the defendant mid-trial reads
  // tactically as defense (+1) but publicly as obstruction (-2) —
  // the court frames care as collusion. Rust-orange border fires.
  public_delta: -2,
};
