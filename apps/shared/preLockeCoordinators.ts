/* ═══════════════════════════════════════════════════════
   PRE-LOCKE COORDINATORS REGISTRY
   (PR-5 canon hardening; smaller §XVII-deferred binding)

   The Ocularum has had a continuous chain of Coordinators
   from the founding regicide (apps/shared/ocularumCanon.ts:
   OCULARUM_FOUNDING) to the modern era. Locke is the
   present Coordinator (canon-locked in PR-3); Jericho
   was her immediate predecessor (apps/shared/firstChair.ts).

   This module is a ratcheted registry — each canonically
   named pre-Locke Coordinator must remain named, and the
   gap to the full chain (~5+ positions) is owed by future
   canon. The shape mirrors apps/shared/ocularumCanon.ts:
   CANONICAL_OCULARUM_CELLS — small, additive, owed by the
   future DLC.

   The chain is recorded in the order's continuity log; the
   log itself is held by the current Coordinator and read
   only on the day of a chair-handoff.

   Per the dreamer canon-lock of 2026-05-14: the
   Coordinators between the founding and Locke number more
   than five but fewer than fifteen. Their named-or-not
   status is canon-pending; each PR that adds a name must
   add a loreSource.
   ═══════════════════════════════════════════════════════ */

export interface PreLockeCoordinator {
  /** Stable id (snake_case). */
  id: string;
  /** Display name. */
  name: string;
  /** Optional epithet / known-as. */
  epithet?: string;
  /** Position in the chain — 1 is closest to the founding,
   *  increasing numbers approach Locke. Null if canon-pending. */
  positionInChain: number | null;
  /** Era during which they held the First Chair. */
  era: string;
  /** Canonical source citing the name. */
  loreSource: string;
  /** Optional canon-note for ambiguities. */
  canonNote?: string;
}

/**
 * Canonical roster of pre-Locke Coordinators.
 *
 * The first member, the Founder, is the canonical
 * un-named purple-clad ninja from
 * apps/shared/purpleNinjaCanon.ts — their name is doctrinally
 * withheld and may never be revealed.
 *
 * Jericho is locked as Locke's immediate predecessor.
 *
 * Future PRs/DLCs may register additional Coordinators
 * between the Founder and Jericho.
 */
export const PRE_LOCKE_COORDINATORS: readonly PreLockeCoordinator[] = [
  {
    id: "the_founder",
    name: "The Founder",
    epithet: "The Purple-Clad Ninja",
    positionInChain: 1,
    era: "Pre-A.A. (Feudal Japan)",
    loreSource: "apps/shared/ocularumCanon.ts (OCULARUM_FOUNDING.founder)",
    canonNote:
      "The Founder's true name is doctrinally withheld " +
      "(apps/shared/purpleNinjaCanon.ts:PURPLE_NINJA_NAME_DOCTRINE). " +
      "Continuity-log entry reads 'the assassin' only.",
  },
  {
    id: "jericho",
    name: "Jericho",
    epithet: "First Chair, late Empire crisis",
    positionInChain: null,
    era: "Late Empire (immediate pre-Locke)",
    loreSource: "apps/shared/firstChair.ts (FIRST_CHAIR.priorOccupant)",
    canonNote:
      "Jericho's exact position in the chain is canon-pending. " +
      "Confirmed only as Locke's immediate predecessor.",
  },
] as const;

/**
 * Canonical statement of the chain length range
 * (dreamer canon-lock 2026-05-14).
 */
export const PRE_LOCKE_COORDINATOR_COUNT_RANGE = {
  min: 5,
  max: 15,
  source: "Dreamer canon-lock 2026-05-14",
} as const;

/**
 * Coverage metric: how many pre-Locke Coordinators are
 * registered. PR-5 ships 2 (the Founder + Jericho). The
 * gap to the full chain is canon-pending.
 */
export function getPreLockeCoordinatorCoverage(): number {
  return PRE_LOCKE_COORDINATORS.length;
}
