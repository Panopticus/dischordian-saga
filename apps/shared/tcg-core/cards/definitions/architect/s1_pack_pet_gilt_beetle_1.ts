/**
 * s1_pack_pet_gilt_beetle_1 — Bronze Scarab
 *
 * Common unit · Architect faction · 1 cost · 1/3
 * Keywords: provoke
 *
 * Oracle text:
 *   "Provoke.
 *    The Architect stamps its mark on everything — even its pets."
 *
 * Lore: The Bronze Scarab is the first stage of the Gilt Beetle
 * evolution line — a small but sturdy metallic insect that forces
 * enemy engagement. Its provoke ability reflects the Architect's
 * philosophy of control: even the smallest piece on the board can
 * dictate where the opponent must strike.
 *
 * Pet Evolution: Gilt Beetle stage 1 of 3.
 * Collect all 3 stages to unlock the Gilt Beetle card back.
 *
 * Balance: 1 cost · 1/3 = 4 stats. Budget = 1*2+1 = 3. Provoke
 * ~1 stat. 3 - 1 = 2. At 4 stats, over by 2 but 1 power limits
 * offensive threat. On budget for a defensive common.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_pack_pet_gilt_beetle_1" as CardDefinition["id"],
  name: "Bronze Scarab",
  faction: "architect",
  cardType: "unit",
  rarity: "common",
  cost: 1,
  baseStats: { power: 1, health: 3 },
  keywords: ["provoke"],
  abilities: [],
  art: assetUrl("art/cards/s1_pack_pet_gilt_beetle_1.webp"),
  flavorText:
    "The Architect stamps its mark on everything — even its pets.",
  rulesVersion: "1.1.0",
  trial_categories: ["defensive"] as const,
  verdict_delta: 1,
  balanceException: {
    reason: "Pet flavor-tier unit: provoke is the value, sub-curve stat profile keeps pet rewards from competing with main-board threats.",
    reviewer: "panopticus",
  },
};
