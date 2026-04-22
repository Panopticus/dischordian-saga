/**
 * s1_char_123 — Relic Scholar
 *
 * Common unit · Antiquarian faction · 2 cost · 2/2
 * Keywords: none
 *
 * Oracle text:
 *   "Studies the relics of ages past. On deploy, gain 1 forcefield
 *    charge — ancient wards activate in the Scholar's presence."
 *
 * Lore: Relic Scholars are the Antiquarian faction's field researchers,
 * specialists who study the artifacts left behind by previous iterations
 * of the Dischordian Cycle. Each relic carries residual temporal energy,
 * and the Scholar knows how to activate its protective ward — a
 * forcefield charge that absorbs a single damage instance. The Witness
 * records that the most valuable relics are not weapons but shields,
 * echoes of civilizations that chose to protect rather than destroy.
 *
 * Mechanical model:
 *  - On deploy, add 1 forcefield_charges counter to self. This gives
 *    the Scholar a one-time damage shield, making it more resilient
 *    than its 2/2 stats suggest. A cheap utility body.
 *
 * Golden tests: test/cards/antiquarian/s1_char_123_relic_scholar.test.ts
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_char_123" as CardDefinition["id"],
  name: "Relic Scholar",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "common",
  cost: 2,
  baseStats: { power: 2, health: 2 },
  keywords: [],
  abilities: [
    // --- Ancient Ward: gain forcefield charge on deploy ---
    {
      id: "rs_ancient_ward" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_deploy" },
      effect: {
        op: "add_counter",
        kind: "forcefield_charges",
        amount: 1,
        to: { kind: "self" },
      },
    },
  ],
  art: assetUrl("art/cards/s1_char_123.webp"),
  flavorText:
    "The relic hums in her hands. A thousand years of silence, broken by the touch of someone who finally understands.",
  rulesVersion: "1.0.0",
  trial_categories: ["evidence"] as const,
  verdict_delta: 1,
};
