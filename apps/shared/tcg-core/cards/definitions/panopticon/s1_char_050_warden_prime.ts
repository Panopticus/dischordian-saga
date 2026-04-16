/**
 * s1_char_050 — Warden Prime
 *
 * Legendary unit · Panopticon faction · 7 cost · 8/10
 * Keywords: provoke
 *
 * The supreme overseer of the Panopticon surveillance state.
 * A high-cost legendary anchor that dominates the board with provoke.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_050" as CardDefinition["id"],
  name: "Warden Prime",
  faction: "architect",
  cardType: "unit",
  rarity: "legendary",
  cost: 7,
  baseStats: { power: 8, health: 10 },
  keywords: ["provoke"],
  abilities: [
    {
      id: "wp_surveillance_shield" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "self" },
        },
        do: {
          op: "buff",
          stats: { health: 1 },
          duration: { kind: "permanent" },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_char_050.webp",
  flavorText:
    "From the Central Spire, every whisper is heard, every shadow measured. The Warden does not sleep — the Warden is sleep denied to others.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
};
