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

   Per the dreamer canon-lock of 2026-05-16: three
   intermediate Coordinators (positions 2-4, between the
   Founder and Jericho) are named here under explicit
   project-owner authorization. They are generated to be
   consistent with the Order's established doctrine
   (apps/shared/ocularumCanon.ts: the watcher/witness
   ethos, the cell structure, the continuity log read only
   at chair-handoff) and span the millennia the
   Antiquarian's archive deliberately omits. The Founder
   remains doctrinally nameless and is untouched.
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
 * Positions 2-4 (Veth Karran, Oss Vae, Halvenn Sarro) are
 * generated intermediate Coordinators added under
 * project-owner authorization (dreamer canon-lock
 * 2026-05-16), consistent with the Order's doctrine. Their
 * exact positions within the dreamer-locked 5-15 chain are
 * approximate. Future PRs/DLCs may register further links.
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
    id: "the_scrivener",
    name: "Veth Karran",
    epithet: "The First Scribe of the Log",
    positionInChain: 2,
    era: "Early Empire (the Order goes underground)",
    loreSource:
      "Generated 2026-05-16 per project-owner authorization; " +
      "consistent with apps/shared/ocularumCanon.ts Order " +
      "doctrine + the dreamer-locked 5-15 chain range " +
      "(apps/shared/preLockeCoordinators.ts).",
    canonNote:
      "Generated intermediate Coordinator (canon-lock " +
      "2026-05-16). Took the chair after the founding and " +
      "formalized the continuity log and the cell structure " +
      "the Order still uses. Distinct from the doctrinally-" +
      "nameless Founder and from Jericho; position approximate.",
  },
  {
    id: "the_long_silence",
    name: "Oss Vae",
    epithet: "The Long Silence",
    positionInChain: 3,
    era: "Mid Empire (the omitted millennia, ~Year 200 A.A. onward)",
    loreSource:
      "Generated 2026-05-16 per project-owner authorization; " +
      "consistent with apps/shared/ocularumCanon.ts Order " +
      "doctrine + the dreamer-locked 5-15 chain range " +
      "(apps/shared/preLockeCoordinators.ts).",
    canonNote:
      "Generated intermediate Coordinator (canon-lock " +
      "2026-05-16). Held the chair through the era the " +
      "Antiquarian's archive deliberately omits; embodied the " +
      "Order's pure-observation doctrine (seeing, not acting). " +
      "Distinct from the Founder and Jericho; position approximate.",
  },
  {
    id: "the_last_watch",
    name: "Halvenn Sarro",
    epithet: "The Last Watch Before the Crisis",
    positionInChain: 4,
    era: "Late Empire (immediately before Jericho)",
    loreSource:
      "Generated 2026-05-16 per project-owner authorization; " +
      "consistent with apps/shared/ocularumCanon.ts Order " +
      "doctrine + the dreamer-locked 5-15 chain range " +
      "(apps/shared/preLockeCoordinators.ts).",
    canonNote:
      "Generated intermediate Coordinator (canon-lock " +
      "2026-05-16). Jericho's predecessor; carried the chain " +
      "into the late-Empire crisis and handed the log to " +
      "Jericho. Distinct from the Founder and Jericho; " +
      "position approximate.",
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
