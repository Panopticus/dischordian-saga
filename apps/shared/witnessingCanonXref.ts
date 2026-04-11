/* ═══════════════════════════════════════════════════════
   WITNESSING CANON CROSS-REFERENCES — §14.3.

   Links the existing Mascoteer (shared/celebrationTrial.ts)
   and Mechronis Professor (shared/mechronisProfessors.ts)
   canon entities to the Witnessing Narrative Proposal's
   slideshow + milestone + dialog references.

   The proposal §14.3 says:
     > The Loredex entries for Project Celebration and
     > Mechronis Academy should be updated to cross-reference
     > every Act that features them.

   This module is the machine-readable version of those
   cross-references. A Loredex page can look up "which
   slideshows reference the Little Watcher" via
   `getMascoteerReferences("little_watcher")` and surface
   the Witnessing beats in the Loredex UI.

   Pure data. No runtime dependency on
   shared/celebrationTrial.ts or shared/mechronisProfessors.ts —
   we reference their ids as strings so this module stays
   self-contained and safe to test.
   ═══════════════════════════════════════════════════════ */

export interface WitnessingXref {
  /** Which Witnessing module references this canon entity. */
  kind:
    | "slideshow"
    | "milestone"
    | "dialog_line"
    | "memorable_moment"
    | "forcing_flag";
  /** The id of the referring entry in its source module. */
  refId: string;
  /** A short description of the reference context. */
  context: string;
}

/**
 * Cross-references from canonical Mascoteer child-Archon ids
 * (from shared/celebrationTrial.ts) to Witnessing content.
 *
 * The three canonical Mascoteers are the proto-forms of Little
 * Meme, Little Collector, and Little Watcher from §4.3 Cycle A
 * "Kindergarten of Gods".
 */
export const MASCOTEER_XREFS: Record<string, readonly WitnessingXref[]> = {
  little_meme: [
    {
      kind: "slideshow",
      refId: "welcome-to-celebration",
      context:
        "§12 C2 frame 5 — Little Meme yanks the Engineer's notebook.",
    },
    {
      kind: "slideshow",
      refId: "welcome-to-celebration",
      context:
        "§12 C2 frame 6 — the viral chant spreads from his hand.",
    },
  ],
  little_collector: [
    {
      kind: "slideshow",
      refId: "welcome-to-celebration",
      context:
        "§12 C2 frame 3 — the schoolyard, the jar, the early Collector.",
    },
  ],
  little_watcher: [
    {
      kind: "slideshow",
      refId: "welcome-to-celebration",
      context:
        "§12 C2 frame 3 — the half-finished white mask in the schoolyard.",
    },
    {
      kind: "milestone",
      refId: "act_1_cycle_a_complete",
      context:
        "§4.3 — the Little Watcher is the Cycle A finale boss fight.",
    },
  ],
};

/**
 * Cross-references from canonical Mechronis Professor ids (from
 * shared/mechronisProfessors.ts) to Witnessing content.
 *
 * The §4.4 Cycle B "Academy" arc walks the player through
 * fights against Mechronis alumni. Each professor has a
 * Witnessing tie-in here.
 */
export const MECHRONIS_PROFESSOR_XREFS: Record<
  string,
  readonly WitnessingXref[]
> = {
  professor_eidola: [
    {
      kind: "slideshow",
      refId: "to-be-the-human",
      context:
        "§12 C3 frame 6 — ethics seminar the Empire will later forget.",
    },
  ],
  professor_matrikala: [
    {
      kind: "dialog_line",
      refId: "engineering",
      context:
        "§13.8 — Matrikala helped the Engineer calibrate the reactor.",
    },
  ],
  professor_thanos: [
    {
      kind: "slideshow",
      refId: "to-be-the-human",
      context:
        "§12 C3 frame 1 — Thanos is the master who tolerated the Warlord.",
    },
  ],
  the_seer: [
    {
      kind: "slideshow",
      refId: "to-be-the-human",
      context:
        "§12 C3 frame 7 — the Seer visits Mechronis once. She says nothing.",
    },
    {
      kind: "slideshow",
      refId: "hacking-reality",
      context:
        "§12 C4 flashback — the Seer stands beside the Engineer at Nexon.",
    },
    {
      kind: "memorable_moment",
      refId: "tarot_found",
      context:
        "§2.6 — the burnt Seer's card the player recovers in Prelude.",
    },
  ],
};

/* ─── LOOKUP HELPERS ─── */

/**
 * Get every Witnessing reference for a Mascoteer id. Returns
 * an empty array for unknown ids — callers can use that as a
 * "no cross-references yet" signal.
 */
export function getMascoteerReferences(
  mascoteerId: string,
): readonly WitnessingXref[] {
  return MASCOTEER_XREFS[mascoteerId] ?? [];
}

/**
 * Get every Witnessing reference for a Mechronis Professor id.
 */
export function getMechronisProfessorReferences(
  professorId: string,
): readonly WitnessingXref[] {
  return MECHRONIS_PROFESSOR_XREFS[professorId] ?? [];
}

/** Return every canonical entity id that has at least one xref. */
export function listEntitiesWithXrefs(): {
  mascoteers: string[];
  professors: string[];
} {
  return {
    mascoteers: Object.keys(MASCOTEER_XREFS),
    professors: Object.keys(MECHRONIS_PROFESSOR_XREFS),
  };
}
