/**
 * s1_pack_024 — Plague Architect
 *
 * Uncommon unit · Thought Virus faction · 4 cost · 3/5
 * Keywords: deathwatch
 *
 * Oracle text:
 *   "Deathwatch: whenever any unit dies, gain +1/+1.
 *    It builds cathedrals from carnage."
 *
 * A snowball threat that grows with every death on the battlefield.
 * The 3/5 body is durable enough to survive early trades, and each
 * unit death — friend or foe — makes the Plague Architect larger.
 * In a Thought Virus deck built around disposable tokens and board
 * clears, this becomes enormous fast.
 *
 * Mechanical model:
 *  - Deathwatch: on any unit death, buff self +1/+1 permanently.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_024" as CardDefinition["id"],
  name: "Plague Architect",
  faction: "thought_virus",
  cardType: "unit",
  rarity: "uncommon",
  cost: 4,
  baseStats: { power: 3, health: 5 },
  keywords: ["deathwatch"],
  abilities: [
    {
      id: "pa_deathwatch_grow" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_any_unit_dies" },
      effect: {
        op: "buff",
        stats: { power: 1, health: 1 },
        duration: { kind: "permanent" },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_pack_024.webp",
  flavorText:
    "Every fallen soldier is a brick. Every scream is mortar. The cathedral rises.",
  rulesVersion: "1.0.0",
};
