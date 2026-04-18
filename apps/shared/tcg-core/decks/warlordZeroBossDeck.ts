/**
 * §5.5 Warlord Zero boss deck — "Three moves. Count them."
 *
 * Warlord Zero leads with `s1_warlord_three_moves`, the hand-lockout
 * spell scripted to fire on global turn 3 from
 * `engine/scriptedActions.ts`. The surrounding 36 cards are an
 * Architect tempo+lock archetype tuned to press the advantage the
 * lockout creates on player turns 3–6.
 *
 * Composition:
 *   - 3× three_moves spell (scripted force-play consumes 1; copies
 *     guarantee the card is always drawable for AI heuristics)
 *   - low-curve surveillance units to establish board before turn 3
 *   - mid-curve law-enforcement bodies for the post-lockout window
 *   - Architect spell suite for removal/denial while the player is
 *     held to three cards
 *
 * Card ids are the short registry keys (e.g. "s1_spell_200", not
 * "s1_spell_200_surveillance_grid"); filename suffixes are human
 * aids and do not appear in the registry.
 */
function x(id: string, n: number): string[] {
  return Array.from({ length: n }, () => id);
}

/** 39 Architect cards composed as a tempo+lockout war-deck. */
export const WARLORD_ZERO_BOSS_DECK: readonly string[] = Object.freeze([
  // Core lockout spell.
  ...x("s1_warlord_three_moves", 3),
  // Low-curve pressure (cost 1–2).
  ...x("s1_pack_007", 3),       // Surveillance Probe — 1/2
  ...x("s1_spell_203", 3),      // Calculated Retreat — 1-cost removal
  ...x("s1_pack_004", 3),       // Protocol Enforcer — 2/3 provoke
  ...x("s1_char_103", 3),       // Inception Ark Sentry — 2/3
  ...x("s1_spell_200", 3),      // Surveillance Grid — 2-cost AoE
  // Mid-curve bodies for the lockout window (cost 3).
  ...x("s1_char_035", 3),       // The Jailer — 3/4 provoke
  ...x("s1_char_102", 3),       // Arena Enforcer — 2/4
  ...x("s1_pack_002", 3),       // Schematic Sentinel — 3/4
  ...x("s1_spell_201", 3),      // Protocol Override — 3-cost
  ...x("s1_spell_205", 3),      // Panoptic Lockdown — 3-cost
  // Late-curve closer (cost 4–5).
  ...x("s1_spell_204", 3),      // Architect's Mandate — 4-cost
  ...x("s1_char_101", 3),       // Panoptic Warden Foucault — 5-cost 4/6
]);

const _warlordSize: 39 = WARLORD_ZERO_BOSS_DECK.length as 39;
void _warlordSize;
