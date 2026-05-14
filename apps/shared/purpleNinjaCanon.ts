/* ═══════════════════════════════════════════════════════
   THE PURPLE-CLAD NINJA — NAME DOCTRINE
   (PR-5 canon hardening; smaller §XVII-deferred binding)

   The Ocularum's founder — the assassin who killed Kanshi
   Sha in feudal Japan (apps/shared/archonCanon.ts: the_watcher
   canon-note; LORE_BIBLE.md:1272) — is canonically and
   doctrinally NAMELESS. The order founded on her act named
   itself; she did not.

   This module canonizes the namelessness as DOCTRINE — not
   as a gap awaiting canon, but as a permanent canon-lock.
   Any future PR or DLC that attempts to surface a name for
   the founder violates the doctrine. The mechanism is:
   the founder's name was struck from the continuity log
   at the moment of the founding; the log records her only
   as 'the assassin' or 'the founder'; her successors
   inherited her seal but not her name.

   Per the dreamer canon-lock of 2026-05-14: the
   namelessness is the order's first refusal. The Watcher
   built the network; the assassin used it against him;
   the order founded itself on her act; her namelessness
   is the order's first 'no' — the refusal to be named on
   the Watcher's terms, since he was the one who named her
   the day he recruited her.

   This canon predates the Logos split (PR-3C) and predates
   the Non-Coordination Pact (PR-3C). It is the saga's
   FIRST resistance pattern — older than any cosmological
   resistance act this codebase canonizes.
   ═══════════════════════════════════════════════════════ */

export interface PurpleNinjaNameDoctrine {
  /** Doctrinal status of the founder's name. */
  status: "canonically_nameless";
  /** When the namelessness was established. */
  establishedAt: "the_founding_assassination";
  /** Acceptable canonical references to the founder. */
  acceptableReferences: readonly string[];
  /** Rationale per the dreamer canon-lock. */
  rationale: string;
  /** Cross-references. */
  crossReferences: readonly string[];
  /** Resistance-pattern lineage marker. */
  isFirstResistanceAct: true;
  /** Date canon-locked (ISO). */
  canonLockedAt: "2026-05-14";
}

/**
 * THE PURPLE-CLAD NINJA NAME DOCTRINE.
 *
 * The founder is nameless. Authoring her name in any future
 * PR violates this canon-lock. The dreamer's intent is that
 * the namelessness is itself the canon — there is nothing
 * to "reveal" later.
 */
export const PURPLE_NINJA_NAME_DOCTRINE: PurpleNinjaNameDoctrine = {
  status: "canonically_nameless",
  establishedAt: "the_founding_assassination",
  acceptableReferences: [
    "the assassin",
    "the founder",
    "the purple-clad ninja",
    "the first chair",
  ],
  rationale:
    "The Watcher built the network and named every cell in it. The " +
    "assassin used the network against him. The Order founded on her " +
    "act inherited her refusal: namelessness is the Order's first 'no.' " +
    "Every Coordinator since has been named only AFTER they accepted " +
    "the chair — the founder accepted nothing. She did not name herself " +
    "Coordinator; she did the work and left the seal on a chair that did " +
    "not yet exist. The first Coordinator named themselves after " +
    "finding the seal.",
  crossReferences: [
    "apps/shared/ocularumCanon.ts (OCULARUM_FOUNDING — the assassination)",
    "apps/shared/archonCanon.ts (the_watcher entry — founding regicide)",
    "apps/shared/firstChair.ts (the seal inheritance ritual)",
    "apps/shared/preLockeCoordinators.ts (the_founder entry)",
  ],
  isFirstResistanceAct: true,
  canonLockedAt: "2026-05-14",
} as const;

/**
 * Canon assertion: any module that surfaces a NAME for the
 * founder violates this doctrine. Used by the parity test
 * in apps/shared/_completeness/checks/purpleNinjaNameDoctrine.ts
 * to scan the canon for accidental name leakage.
 */
export const FOUNDER_IS_PERMANENTLY_NAMELESS = true as const;

/**
 * Forbidden patterns — string fragments that, if found in
 * any module describing the founder, indicate a canon
 * violation. Conservative list; the parity test scans only
 * the modules that canonically reference the founder.
 */
export const FORBIDDEN_NAME_PATTERNS: readonly string[] = [
  // Empty by default — names are added here ONLY when canon
  // violations are detected and a regression-guard is needed.
] as const;
