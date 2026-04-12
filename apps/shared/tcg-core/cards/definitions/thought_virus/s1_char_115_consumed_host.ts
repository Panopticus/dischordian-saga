/**
 * s1_char_115 — Consumed Host
 *
 * Common unit · Thought Virus faction · 2 cost · 3/2
 * Keywords: rush
 *
 * Oracle text:
 *   "Stage 5: Consumed. May act immediately. A body driven past
 *    its limits by the Thought Virus — fast, aggressive, disposable."
 *
 * Lore: Stage 5 of the Thought Virus infection is total consumption.
 * The host's consciousness is gone, replaced entirely by the Virus's
 * directive: spread, attack, expire. Consumed Hosts charge into battle
 * with no regard for self-preservation because there is no self left to
 * preserve. The Witness categorized Stage 5 as "irreversible cognitive
 * dissolution" — the point of no return in the Dischordian Cycle's
 * infection arc.
 *
 * Mechanical model:
 *  - Rush: intrinsic keyword. May act the turn summoned. A glass-cannon
 *    body (3/2) that trades immediately. Cheap aggression for the
 *    Thought Virus faction.
 *
 * Golden tests: test/cards/thought_virus/s1_char_115_consumed_host.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_115" as CardDefinition["id"],
  name: "Consumed Host",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 3, health: 2 },
  keywords: ["rush"],
  abilities: [
    // --- Viral Burst: deal 1 damage to all adjacent enemies on death ---
    {
      id: "consumed_death_burst" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_death" },
      effect: {
        op: "foreach",
        over: {
          kind: "radius",
          origin: { kind: "self" },
          radius: 1,
          filter: { controller: "opponent" },
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 1 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art:
    "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/115_consumed_host.png",
  flavorText:
    "The body runs. The mind is already gone. What remains is hunger wearing a human shape.",
  rulesVersion: "1.0.0",
};
