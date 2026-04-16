/**
 * s1_pack_048 — Elara's Final Gift
 *
 * Epic unit · Neutral faction · 6 cost · 4/7
 *
 * Oracle text:
 *   "On deploy, heal all friendly units for 3 and draw 1 card.
 *    Her last act was not a weapon. It was a kindness."
 *
 * A stabilization powerhouse. The 4/7 body is durable, and the
 * deploy effect heals your entire board while drawing a card for
 * continued value. Turns losing board states into winning ones.
 * Pack-exclusive epic that any faction can use.
 *
 * Mechanical model:
 *  - On deploy: sequence of foreach friendly heal 3, then draw 1.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_048" as CardDefinition["id"],
  name: "Elara's Final Gift",
  faction: "neutral",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 4, health: 7 },
  keywords: [],
  abilities: [
    {
      id: "efg_heal_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "sequence",
        steps: [
          {
            op: "foreach",
            over: {
              kind: "all",
              filter: { controller: "self" },
            },
            do: {
              op: "heal",
              amount: { kind: "const", value: 3 },
              to: { kind: "it" },
            },
          },
          {
            op: "draw",
            amount: { kind: "const", value: 1 },
            who: "self",
          },
        ],
      },
    },
  ],
  art: "/art/cards/s1_pack_048.webp",
  flavorText:
    "She had one last thing to give. She gave it to everyone.",
  rulesVersion: "1.0.0",
  trial_categories: ["defensive", "narrative"] as const,
  verdict_delta: 2,
};
