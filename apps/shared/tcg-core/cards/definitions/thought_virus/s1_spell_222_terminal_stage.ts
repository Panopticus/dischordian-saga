/**
 * s1_spell_222 — Terminal Stage
 *
 * Rare spell · Thought Virus faction · 5 cost
 *
 * Oracle text:
 *   "Deal damage to an enemy unit equal to its missing health.
 *    The sicker they are, the harder the Virus strikes."
 *
 * Finisher spell. Deals damage equal to (maxHealth - currentHealth) of the
 * target. Worthless against healthy units, devastating against wounded ones.
 * The Thought Virus rewards patient attrition — weaken first, then execute.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_spell_222" as CardDefinition["id"],
  name: "Terminal Stage",
  faction: "thought_virus",
  cardType: "spell",
  rarity: "rare",
  cost: 5,
  keywords: [],
  abilities: [
    {
      id: "ts_missing_hp" as CardDefinition["abilities"][number]["id"],
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
  art: assetUrl("art/cards/s1_spell_222.webp"),
  flavorText:
    "By the time the symptoms manifest, the prognosis is already written.",
  rulesVersion: "1.1.0",
  trial_categories: ["offensive"] as const,
  verdict_delta: 1,
};
