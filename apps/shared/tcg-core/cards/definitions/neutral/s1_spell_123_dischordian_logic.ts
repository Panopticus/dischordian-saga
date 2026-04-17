/**
 * s1_spell_123 — Dischordian Logic
 *
 * Common spell · Neutral faction · 4 cost
 *
 * Oracle text:
 *   "Deal 2 damage to ALL units. The Dischordian Cycle does not
 *    discriminate — entropy is universal."
 *
 * Symmetrical AoE — hits every unit on both sides of the board. A universal
 * tool tied to the Dischordian Cycle itself: the fundamental force of
 * entropy that all factions exist within. When the Cycle accelerates,
 * nothing is spared. Best used when behind on board.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_123" as CardDefinition["id"],
  name: "Dischordian Logic",
  faction: "neutral",
  cardType: "spell",
  rarity: "common",
  cost: 4,
  keywords: [],
  abilities: [
    {
      id: "dl_aoe_all_2" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "any" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 2 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_123.webp",
  flavorText:
    "The Cycle cares nothing for allegiance. When it turns, everything in its path is ground to equal dust.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
  // §5.7 divergence: invoking Dischordian Logic mid-trial reads
  // tactically as a solid sophistry (+1) but the court hears it as
  // paradox (-1) — the Authority does not like sophistry. Sign
  // disagreement fires the rust-orange border.
  public_delta: -1,
};
