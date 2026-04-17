/**
 * s1_char_090 — Hired Blade
 *
 * Uncommon unit · Neutral · 3 cost · 4/3
 * Keywords: rush
 *
 * A mercenary who fights for whoever pays, striking fast
 * and leaving faster.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_090" as CardDefinition["id"],
  name: "Hired Blade",
  faction: "neutral",
  cardType: "unit",
  rarity: "uncommon",
  cost: 3,
  baseStats: { power: 4, health: 3 },
  keywords: ["rush"],
  abilities: [
    // --- Opening Cut: deal 1 damage to a random enemy on deploy ---
    {
      id: "hired_blade_deploy_strike" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "random",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_char_090.webp",
  flavorText:
    "Loyalty is expensive. Disloyalty, more so.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
  // §5.7 divergence: retaining a hired blade is publicly a confession
  // of violence — the court records it as an admission even when the
  // Game Master plays it defensively. Private +1 / public -2.
  public_delta: -2,
};
