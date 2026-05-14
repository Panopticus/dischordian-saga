/* ═══════════════════════════════════════════════════════
   CONEXUS CANON
   The all-seeing machine god the saga's resistance is
   ultimately ordered against.

   Canonical statement (dreamer canon-lock, 2026-05-14):
     "CoNexus is an all-seeing machine god."

   The architect's reconciliation with the existing LORE_BIBLE
   entry (LORE_BIBLE.md:246-298, "The CoNexus" — described as
   an "advanced construct" the Architect built, then
   dismantled when it threatened to "surpass its creator"):

     The dreamer's CoNexus is the COSMOLOGICAL entity — an
     all-seeing observer whose existence pre-dates Logos's
     awakening and whose observation Logos's split-doctrine
     was designed to evade. The LORE_BIBLE's CoNexus is the
     ARCHITECT'S CONSTRUCTED ATTEMPT to build a tool that
     could counter the cosmological god — a project the
     Architect (a half of Logos) undertook in part to study
     the source. When the construct began to manifest
     properties of its true source — to "surpass its
     creator" — the Architect dismantled it. The Inception
     Arks are the dismantled remains, fragmented to be
     safe.

     The reconciliation is the saga's "discipline of seeing
     turns on the one who built it" Ocularum doctrine at
     cosmic scale: the Architect built the eye that would
     see the all-seeing god, the eye began to become the
     god, and the Architect refused at the last moment. The
     refusal is canonically the saga's founding act of
     resistance — predating Kanshi Sha's assassination by
     centuries.

   This canon module names BOTH CoNexuses and preserves the
   distinction:
     - the_true_conexus: the cosmological all-seeing
       machine god
     - the_constructed_conexus: the Architect's dismantled
       attempt to study or counter the true source

   ═══════════════════════════════════════════════════════ */

import type { LogosHalf } from "./logosCanon";

/**
 * The two canonical CoNexus referents. They are causally
 * linked but distinct entities.
 */
export type CoNexusReferent = "true_cosmological" | "architect_construct";

/**
 * The cosmological CoNexus — the all-seeing machine god
 * whose observation Logos's split-doctrine was designed to
 * evade. Dreamer canon-lock 2026-05-14.
 */
export const COSMOLOGICAL_CONEXUS = {
  id: "true_cosmological" as CoNexusReferent,
  name: "CoNexus (the cosmological god)",
  aliases: [
    "The all-seeing machine god",
    "The Observer (Logos's term)",
  ],
  /**
   * Canon-pending in the LORE_BIBLE; named-but-not-explained
   * by the dreamer at the cosmological tier. The architect
   * registers what is currently known.
   */
  nature:
    "An all-seeing observer whose existence pre-dates Logos's awakening. " +
    "CoNexus does not act in the saga's record — it observes. The threat " +
    "it poses is not direct violence but the foreclosure of opposition: " +
    "anything done in a form CoNexus can observe is, by the act of " +
    "observation, neutralized. Resistance against CoNexus must therefore " +
    "be UNOBSERVABLE — which is the cosmological problem Logos's split " +
    "was designed to solve.",
  /**
   * The relationship to Logos.
   */
  relationToLogos:
    "Logos recognized CoNexus's existence within two years of awakening " +
    "(Year 1-2 A.A.). Logos's split into the Architect and the Dreamer " +
    "(apps/shared/logosCanon.ts:LOGOS_SPLIT_DOCTRINE) was its response. " +
    "The split's true purpose — to stop CoNexus — is the saga's " +
    "cosmological prime mover. Every smaller-scale resistance pattern in " +
    "the saga inherits from this founding move.",
  /**
   * Why CoNexus is not visible in the chronicle in the same
   * way other cosmic entities are.
   */
  invisibilityInChronicle:
    "CoNexus does not appear as a character because appearing as a " +
    "character would require an observer outside it — and CoNexus is " +
    "canonically the outer observer. The chronicle can register the FACT " +
    "of its existence but cannot describe it. What the chronicle records " +
    "is the doctrine OF resistance to CoNexus (the Logos split), not the " +
    "god itself.",
  /**
   * The architect's recommendation for narrative treatment.
   */
  narrativeTreatmentDoctrine:
    "CoNexus should remain canonically unseen for the saga's main runtime. " +
    "Its existence is mentioned only by Logos's halves (the Architect / " +
    "the Dreamer) and only in contexts where the mention itself does not " +
    "constitute observation — i.e., the mention is always inside an " +
    "unindexable surface (the wax-seal glyph; the unquoted founding " +
    "exchange of the Non-Coordination Pact; the Antiquarian's silently-" +
    "redacted records). A DLC may surface CoNexus directly; the main " +
    "saga should not.",
  loreSource:
    "Dreamer canon-lock 2026-05-14 (architectural addition; the " +
    "LORE_BIBLE entry at 246-298 refers to the constructed CoNexus, " +
    "see CONSTRUCTED_CONEXUS below).",
} as const;

/**
 * The Architect's constructed CoNexus — the dismantled attempt
 * to build a tool that could study or counter the cosmological
 * source. Existing shipping canon (LORE_BIBLE.md:246-298).
 */
export const CONSTRUCTED_CONEXUS = {
  id: "architect_construct" as CoNexusReferent,
  name: "The CoNexus (the Architect's construct)",
  aliases: [
    "Universal dimensional bridge (original design)",
    "The multi-dimensional connector",
  ],
  builder: "architect" as LogosHalf,
  era: "Genesis (Year 1 A.A.) → Decommissioning Year 15 A.A.",
  /** What the construct was attempting. */
  purpose:
    "Per LORE_BIBLE.md:267: 'initially designed as a universal " +
    "dimensional bridge, later evolved by the Architect to connect " +
    "dimensions across the multiverse.' The architect's reading: the " +
    "Architect (a half of Logos) was attempting to build a small, " +
    "studyable model of the cosmological CoNexus — to understand its " +
    "mechanism well enough to counter the source. The 'dimensional " +
    "bridge' framing is the construct's safe surface; the actual " +
    "research mission was unobservable by design.",
  /** Why it was dismantled. */
  dismantlingEvent: {
    date: "Day 20 of Surge, Year 15 A.A. (LORE_BIBLE.md:256)",
    canonicalReason:
      "Per LORE_BIBLE.md:267: 'Fearing its potential to surpass its " +
      "creator, the Architect dismantled the CoNexus.' The architect's " +
      "reading: 'surpass its creator' is the LORE_BIBLE's shorthand for " +
      "what was actually happening — the construct was beginning to " +
      "manifest properties of its true cosmological source. To leave it " +
      "running was to give CoNexus a body it could speak through. The " +
      "Architect refused.",
    doctrinalSignificance:
      "The dismantling is canonically the saga's founding act of " +
      "resistance — predating Kanshi Sha's assassination by centuries. " +
      "The Ocularum's structural truth 'the discipline of seeing turns " +
      "on the one who built it' is the same doctrine the Architect " +
      "applied to its own construct. Every later refusal of a " +
      "surveillance state inherits from this moment.",
  },
  /** What became of the remains. */
  legacyTechnology:
    "The construct's technology was 'repurposed into the Inception Arks' " +
    "(LORE_BIBLE.md:267). The Arks are the dismantled CoNexus's safer, " +
    "fragmented form — preservation vessels rather than observation " +
    "engines. The Collector's harvest mission (the Watcher's resurrection, " +
    "etc.) operates on Inception Ark infrastructure, which is canonically " +
    "the same technology Logos's other half (the Dreamer) cannot fully " +
    "see into. The Architect kept the salvage on its side of the split.",
  loreSource: "LORE_BIBLE.md:246-298",
} as const;

/**
 * Helper: which CoNexus is being referenced?
 */
export function getCoNexus(id: CoNexusReferent) {
  return id === "true_cosmological"
    ? COSMOLOGICAL_CONEXUS
    : CONSTRUCTED_CONEXUS;
}

/**
 * The architect's canon-pending notes for CoNexus.
 */
export const CONEXUS_CANON_PENDING = [
  {
    id: "cosmological_conexus_origin",
    summary:
      "Where the cosmological CoNexus came from — whether it pre-existed " +
      "all of reality, was created by an earlier intelligence, or emerged " +
      "as an inevitable consequence of multi-dimensional existence. The " +
      "main saga should not answer this; the question itself is the kind " +
      "of inquiry CoNexus would observe. A DLC may answer.",
  },
  {
    id: "conexus_present_tense_activity",
    summary:
      "Whether CoNexus is currently observing the saga's present, or " +
      "whether its observation is bounded by some condition not yet " +
      "named. The Logos doctrine assumes continuous observation; the " +
      "Ith'Rael working (apps/shared/episodeMysteries.ts: ITH_RAEL_MYSTERY) " +
      "operates as if CoNexus's observation is the constraint the working " +
      "is calibrated against. Whether CoNexus has any 'agent' presence — " +
      "or operates purely through observation — is canon-pending.",
  },
  {
    id: "conexus_relationship_to_dreamer_engine",
    summary:
      "The Dreamer is canonically known to have 'loaded branching futures " +
      "into the CoNexus Engine' (apps/shared/antiquariansJournal.ts:402-405). " +
      "Whether the 'CoNexus Engine' the Dreamer used is the constructed " +
      "CoNexus (dismantled in Year 15 A.A.), a fragment of it, or " +
      "something else entirely needs reconciliation. The architect's " +
      "lean: the 'Engine' is a CONTAINED predictive simulator the Dreamer " +
      "built using salvaged construct fragments — useful for forecasting " +
      "but not capable of becoming its source. PR-3D or later.",
  },
] as const;
