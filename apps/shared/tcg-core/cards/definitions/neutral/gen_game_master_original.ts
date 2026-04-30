/**
 * gen_game_master_original — The Game Master (before the execution)
 *
 * General · Neutral faction · 0 cost · 4/24
 *
 * "You have built a beautiful box. The only thing I am going to do
 *  is open it in front of everybody."
 *
 * The Act 1 §5.7 opponent — the Engineer's actual trial opponent.
 * Per spec, he's NOT a brawler and NOT a decorative general either.
 * He plays cards; each play resolves twice (privately + publicly
 * via engine/publicWitness.ts). The match ends by normal scoring;
 * the public balance carries forward to §5.8 Authority's
 * openingVerdictBalance via deriveAuthorityVerdictOffset.
 *
 * Mid-range stats so the match can go the full distance. No
 * keywords; the prosecutor's power is the public record, not board
 * pressure. Dialog in the Act 1 chapter dialog bank.
 *
 * Spec: docs/production/act1/public-witness-ui-spec.md,
 * ACT1_NARRATIVE_STRUCTURE.md §5.7.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "../../../../../client/src/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "gen_game_master_original" as CardDefinition["id"],
  name: "The Game Master (before the execution)",
  faction: "neutral",
  cardType: "general",
  rarity: "basic",
  cost: 0,
  // Slightly beefier than gen_programmer's 3/22 so a prosecutor
  // match can run the full ~7-turn spec §4 arc without the
  // Game Master dying to normal combat damage.
  baseStats: { power: 4, health: 24 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/gen_game_master_original.webp"),
  flavorText:
    "You have built a beautiful box. The only thing I am going to do is open it in front of everybody.",
  rulesVersion: "1.1.0",
};
