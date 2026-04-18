/**
 * §5.8 Authority trial boss deck — "Judgment, not a duelist".
 *
 * The Authority's general (gen_authority) is 0/99 with no abilities
 * and the §5.8 match ends at turn 10 via `resolveTrialOutcome`
 * (engine/trialPhase.ts), never via general-killed. The deck is
 * therefore decorative under normal play — the trial is the match
 * resolution, not board state. It still composes to exactly 39 cards
 * of faction-legal Architect content so validation + registry
 * lookups pass.
 *
 * Composition leans on surveillance / lockdown / law-enforcement
 * flavor (Jailer, Panoptic Warden, Arena Enforcer, Protocol Enforcer,
 * Surveillance Probe + the full Architect spell suite) to keep the
 * thematic register aligned with the trial's "The system watches"
 * voice from the dialog bank.
 *
 * Card ids are the short registry keys ("s1_spell_200", not
 * "s1_spell_200_surveillance_grid") — filename suffixes are human
 * aids, the `.id` field on each CardDefinition is the canonical key.
 */
import { STARTER_DECK_MAP } from "./starterDecks";

function x(id: string, n: number): string[] {
  return Array.from({ length: n }, () => id);
}

/** 39 Architect cards composed as a law-enforcement control deck. */
export const AUTHORITY_TRIAL_BOSS_DECK: readonly string[] = Object.freeze([
  // Surveillance / judgment spells (full suite × 3).
  ...x("s1_spell_203", 3),  // Calculated Retreat — 1-cost removal
  ...x("s1_spell_200", 3),  // Surveillance Grid — 2-cost AoE
  ...x("s1_spell_201", 3),  // Protocol Override — 3-cost spell
  ...x("s1_spell_205", 3),  // Panoptic Lockdown — 3-cost lock
  ...x("s1_spell_204", 3),  // Architect's Mandate — 4-cost
  ...x("s1_spell_202", 3),  // System Purge — 5-cost wipe
  // Enforcer bodies (low-curve to mid).
  ...x("s1_pack_007", 3),   // Surveillance Probe — 1-cost 1/2
  ...x("s1_pack_004", 3),   // Protocol Enforcer — 2-cost 2/3 provoke
  ...x("s1_char_103", 3),   // Inception Ark Sentry — 2-cost 2/3
  ...x("s1_char_102", 3),   // Arena Enforcer — 3-cost 2/4
  ...x("s1_char_035", 3),   // The Jailer — 3-cost 3/4 provoke
  ...x("s1_pack_002", 3),   // Schematic Sentinel — 3-cost 3/4
  ...x("s1_char_101", 3),   // Panoptic Warden Foucault — 5-cost 4/6
]);

const _authoritySize: 39 = AUTHORITY_TRIAL_BOSS_DECK.length as 39;
void _authoritySize;

/**
 * Fallback helper if the curated constant ever needs to degrade to
 * the Architect starter (smoke test, dev scaffolding). Not used at
 * runtime — present to document that the starter is the conservative
 * faction default per `bossDeckForFaction`.
 */
export function authorityStarterFallback(): readonly string[] {
  return STARTER_DECK_MAP["architect"].cardDefIds;
}
