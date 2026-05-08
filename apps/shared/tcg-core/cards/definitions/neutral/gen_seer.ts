/**
 * gen_seer — The Seer (visiting fellow)
 *
 * General · Neutral faction · 0 cost · 3/25
 *
 * "I will not raise my staff today. I want to see whether the bench
 *  has learned yet."
 *
 * The Act 1 §4.9 opponent — the visiting fellow who plays cards that
 * aren't in her hand yet. Her plays are driven by the reducer's
 * §4.9 hook (engine/seerProphecy.ts), not her own AI heuristic or a
 * scripted-action queue — that's what makes the mechanic feel
 * retroactive.
 *
 * Slightly beefier than gen_programmer (3/22) and gen_game_master_original
 * (4/24) so the canonical 6-turn prophecy sequence runs to completion
 * without combat damage accidentally killing her before the
 * scripted loss lands. The one winnable path (spec §3.3) requires
 * burnt_card_placeholder in the player's deck — Acts 2+ unlock
 * routes deliver it retroactively; a normal first-playthrough deck
 * never has it.
 *
 * No Bloodborn. No keywords. Dialog in the Act 1 chapter dialog bank.
 *
 * Spec: docs/production/act1/seer-prophecy-mechanic.md,
 * act1Opponents.ts step 8.
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "gen_seer" as CardDefinition["id"],
  name: "The Seer (visiting fellow)",
  faction: "neutral",
  cardType: "general",
  rarity: "basic",
  cost: 0,
  baseStats: { power: 3, health: 25 },
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/gen_seer.webp"),
  flavorText:
    "I will not raise my staff today. I want to see whether the bench has learned yet.",
  rulesVersion: "1.1.0",
};
