/**
 * s1_warlord_three_moves — Three Moves
 *
 * Legendary Architect spell · 3 cost · no stats · Warlord-only
 *
 * Spec: docs/production/act1/warlord-three-move-mechanic.md §2.2.
 *
 * The Warlord plays this card on her third turn of the §5.5 match.
 * It has no private-scoring effect; its entire function is to flip
 * the §5.5 lockout state. The §5.5 runtime intercepts this card's
 * `on_cast` event and applies the three-turn hand-narrowing,
 * spawns the countdown indicator, and sets the
 * `architect_reality_edit_witnessed` GameState flag. None of that
 * machinery exists yet (§5.5 runtime is a separate work-stream
 * blocked on this card's authoring per spec §6.1) — when it lands,
 * the runtime hooks the cast event by name, not by ability tree,
 * so this card's abilities array stays empty.
 *
 * Rarity-vs-spec note: the spec calls this a "Mythic" card. The
 * current Rarity enum tops at "legendary"; rather than introduce
 * a one-card "mythic" tier (almost certainly the wrong call —
 * extra rarity tiers create deck-construction balance work that
 * doesn't pay off until we have ≥3 cards at that tier), we use
 * "legendary" and treat "Mythic" as the in-fiction tier label.
 * The `warlord_only` flag is what actually keeps this out of
 * draftable pools.
 *
 * Faction-vs-spec note: spec calls it "Architect + New Babylon".
 * The schema allows one faction per card; we file it under
 * "architect" since the lockout mechanic belongs to the Architect
 * faction's "rules-can-change" identity (per spec §1). New Babylon
 * eligibility is narrative; if the §5.5 runtime ever needs to
 * surface a "secondary faction" we'll add a `secondary_faction`
 * field to the schema.
 *
 * Trial-categories: omitted intentionally. The card is
 * `warlord_only`, so the deck builder filters it out of every
 * player pool — it can never appear in a §5.8 Authority match,
 * which is the only context where trial_categories matter.
 *
 * Cost: 3 mana so the Warlord can cast it on her third turn under
 * the standard mana-equals-turn ramp (§5.5 spec § 2.2 requires
 * the card to land specifically on her third turn).
 */
import type { CardDefinition } from "../../../index";

import { assetUrl } from "@shared/lib/assetUrl";
export const cardDef: CardDefinition = {
  id: "s1_warlord_three_moves" as CardDefinition["id"],
  name: "Three Moves",
  faction: "architect",
  cardType: "spell",
  rarity: "legendary",
  cost: 3,
  keywords: [],
  abilities: [],
  art: assetUrl("art/cards/s1_warlord_three_moves.webp"),
  flavorText:
    "I am going to win this war in three moves. This is not bragging. This is arithmetic.",
  rulesVersion: "1.1.0",
  warlord_only: true,
};
