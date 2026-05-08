/**
 * Act 1 Cycle C neutral boss deck.
 *
 * The §4.9 Seer, §5.6 Programmer, and §5.7 Game Master encounters
 * all share the `neutral` faction but historically ran on synthetic
 * `boss_*_{0..38}` placeholder ids that never resolved in the card
 * registry. Matches technically ran (unknown-defId cards get 0/1
 * stats per engine/init.ts) but with blank, non-functional decks.
 *
 * This module assembles a 39-card deck of REAL neutral cards drawn
 * from apps/shared/tcg-core/cards/definitions/neutral/. The
 * composition follows the §5.6/§5.7/§4.9 narrative character:
 *   - balanced unit mix so matches play out honestly
 *   - a handful of neutral spells for interaction
 *   - the §4.9 winnable-path card (burnt_card_placeholder) is NOT
 *     in this deck — it lives only in the player's hand via the
 *     Acts 2+ unlock route (spec §3.3)
 *
 * Per-chapter variants (scripted-action cards, trial-only cards)
 * should be added by the chapter via spread + slice, preserving
 * the 39-card deck size — see chWarlordZeroFirst's bossDeckCardDefIds
 * for the canonical prepend pattern.
 */

function x(id: string, n: number): string[] {
  return Array.from({ length: n }, () => id);
}

/** 39 real neutral cards, faction-appropriate for Cycle C bosses. */
export const NEUTRAL_CYCLE_C_BOSS_DECK: readonly string[] = Object.freeze([
  // Low-curve units (cost 2-3)
  ...x("s1_char_086_wandering_merchant", 3),
  ...x("s1_char_089_courier_sprite", 3),
  ...x("s1_char_088_field_medic", 3),
  ...x("s1_char_091_border_scout", 3),
  // Mid-curve units (cost 3-5)
  ...x("s1_char_090_hired_blade", 3),
  ...x("s1_char_004_ambassador_veron", 3),
  ...x("s1_char_087_scrapyard_golem", 3),
  ...x("s1_char_092_ruin_stalker", 3),
  ...x("s1_char_093_ironclad_veteran", 3),
  // Neutral spells for interaction
  ...x("s1_spell_123_dischordian_logic", 3),
  ...x("s1_spell_124_ark_emergency_protocol", 3),
  // Artifacts / support
  ...x("s1_pack_043_void_crystal", 3),
  ...x("s1_pack_044_ark_defender", 3),
]);

/** Compile-time invariant: deck is exactly 39 cards (Dischordia standard). */
const _deckSizeInvariant: 39 = NEUTRAL_CYCLE_C_BOSS_DECK.length as 39;
