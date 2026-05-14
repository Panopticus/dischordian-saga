/* ═══════════════════════════════════════════════════════
   JERICHO'S FIRST CHAIR
   (PR-5 canon hardening; smaller §XVII-deferred binding)

   The Order's pre-Locke Coordinator continuity is canonized
   here as a single named operator: Jericho, who held the
   First Chair before Locke and whose tenure spans the
   late-Empire crisis era. The "First Chair" is the
   Coordinator's seat in the Ocularum's continuity log
   (apps/shared/ocularumCanon.ts); the name refers to the
   chair, not its occupant.

   Jericho is canon-witnessed via the Coordinator-of-record
   succession: Locke succeeded Jericho; Jericho succeeded
   the Coordinator before her (canon-pending). The First
   Chair is the position; its occupants form a chain of
   five+ pre-Locke holders documented in
   apps/shared/preLockeCoordinators.ts.

   Per the dreamer canon-lock of 2026-05-14, the First
   Chair carries a single inheritance ritual: the outgoing
   Coordinator places their signing-seal on the chair. The
   incoming Coordinator finds it there. No words are
   exchanged in the transition. The continuity log records
   only the seal's transfer.
   ═══════════════════════════════════════════════════════ */

export interface FirstChairBinding {
  /** Canonical chair id. */
  id: "first_chair_of_the_ocularum";
  /** Display name of the position. */
  positionName: "Coordinator (First Chair)";
  /** Current canon-witnessed occupant. */
  currentOccupant: "locke";
  /** Immediate prior occupant. */
  priorOccupant: "jericho";
  /** Whether the inheritance ritual is canonized. */
  inheritanceRitualCanonized: true;
  /** Inheritance ritual canon. */
  inheritanceRitual: {
    physicalToken: "signing_seal";
    placement: "chair";
    wordsExchanged: false;
    continuityLogEntry: "seal_transfer_only";
  };
  /** Cross-references. */
  crossReferences: readonly string[];
  /** Dreamer canon-lock date (ISO). */
  canonLockedAt: "2026-05-14";
}

/**
 * THE FIRST CHAIR — canonical binding.
 *
 * The chair is the position; its occupants form a chain.
 * Currently held by Locke; previously held by Jericho.
 */
export const FIRST_CHAIR: FirstChairBinding = {
  id: "first_chair_of_the_ocularum",
  positionName: "Coordinator (First Chair)",
  currentOccupant: "locke",
  priorOccupant: "jericho",
  inheritanceRitualCanonized: true,
  inheritanceRitual: {
    physicalToken: "signing_seal",
    placement: "chair",
    wordsExchanged: false,
    continuityLogEntry: "seal_transfer_only",
  },
  crossReferences: [
    "apps/shared/ocularumCanon.ts (the Order's continuity-log architecture)",
    "apps/shared/preLockeCoordinators.ts (the chain of pre-Locke chair-holders)",
    "apps/shared/episodeMysteries.ts (THE_WATCHER_MYSTERY E5 — the Coordinator names herself)",
  ],
  canonLockedAt: "2026-05-14",
} as const;

/**
 * Canon assertion: the First Chair's inheritance is
 * wordless. Any narrative that has the outgoing Coordinator
 * verbally hand off to the incoming one violates this
 * canon-lock.
 */
export const FIRST_CHAIR_INHERITANCE_IS_WORDLESS = true as const;
