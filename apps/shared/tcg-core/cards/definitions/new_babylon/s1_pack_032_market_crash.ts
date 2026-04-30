/**
 * s1_pack_032 — Market Crash
 *
 * Epic spell · New Babylon faction · 6 cost
 *
 * Oracle text:
 *   "Destroy all units with 3 or less health (both sides).
 *    When the market crashes, the weak are liquidated first."
 *
 * Symmetric conditional board clear. Destroys every unit on both
 * sides with 3 or less health, punishing token strategies and
 * low-health boards while your high-health threats survive. New
 * Babylon's ruthless economic Darwinism: only the strong survive
 * the crash.
 *
 * Mechanical model:
 *  - On cast, foreach all units (both sides) with health <= 3, destroy.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_032" as CardDefinition["id"],
  name: "Market Crash",
  faction: "new_babylon",
  cardType: "spell",
  rarity: "epic",
  cost: 6,
  keywords: [],
  abilities: [
    {
      id: "mc_destroy_weak" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "foreach",
        over: {
          kind: "all",
          filter: { controller: "any", maxStats: { health: 3 } },
        },
        do: {
          op: "destroy",
          to: { kind: "it" },
        },
      },
    },
  ],
  art: assetUrl("art/cards/s1_pack_032.webp"),
  flavorText:
    "The market corrects itself. It does not care who is standing when it does.",
  rulesVersion: "1.1.0",
  trial_categories: ["narrative", "offensive"] as const,
  verdict_delta: 2,
};
