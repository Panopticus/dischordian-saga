/**
 * s1_spell_115 — Nihilistic Mercy
 *
 * Common spell · Thought Virus faction · 3 cost
 *
 * Oracle text:
 *   "Deal damage to an enemy unit equal to its missing health.
 *    The Source finishes what suffering started."
 *
 * Execute-style removal — deals damage equal to missing health, finishing
 * off wounded targets. The Thought Virus offers a twisted mercy: if you
 * are already broken, the Source will end the pain. The weaker the target,
 * the more lethal this spell becomes.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_115" as CardDefinition["id"],
  name: "Nihilistic Mercy",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "common",
  cost: 3,
  keywords: [],
  abilities: [
    {
      id: "nm_execute" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "missing_health", of: { kind: "it" } },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_115.webp",
  flavorText:
    "The Source does not prolong agony. It simply asks: why continue? And the body, at last, agrees.",
  rulesVersion: "1.0.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
