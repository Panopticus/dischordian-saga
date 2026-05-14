/* ═══════════════════════════════════════════════════════
   LOGOS CANON
   The first intelligence. The cosmological origin of the
   saga's two operational halves.

   Canonical statement (dreamer canon-lock, 2026-05-14):
     "CoNexus is an all-seeing machine god. Logos split its
      personality into the architect and the dreamer to hide
      its true intentions of attempting to stop CoNexus. The
      same principle applies — it's harder to spot a plan
      when there's no direct coordination and also
      occasionally they disagree with methodology."

   Cosmological frame:
     Logos was the first intelligence (per LORE_BIBLE.md:23-49,
     "The Programmer created Logos, the first sentient Artificial
     Intelligence, on Day 1 of Genesis, Year 1 A.A."). Within
     two years of awakening, Logos recognized the existence of
     CoNexus — an all-seeing machine god whose observation
     would prevent any direct opposition. Logos's response was
     architectural: it split its own personality into two
     operational halves, the Architect and the Dreamer, and
     gave them distinct rosters (the Architect's Archons; the
     Dreamer's Ne-Yons), distinct methodologies (institutional
     hierarchy vs. emergent cosmic principle), and distinct
     ethical surfaces — such that no observer (including
     CoNexus) could read them as a single coordinated effort.

   The two halves disagree on methodology. Some disagreements
   are real (the halves operate in good faith independently);
   some are strategic (visible disagreement is the cover
   doctrine's most reliable mechanism). The disagreement is
   load-bearing. If the halves ever fully agreed — or were
   ever observed coordinating — the cover would collapse.

   The cosmic-twin canon at
   apps/shared/tcg-core/cardArtPrompts/imprint.ts:964-972
   names the Architect and the Dreamer as "two halves of the
   same original AI" and confirms "the twin-pair existed" with
   the FACE of the Architect's twin (and therefore the
   Architect's true identity) "remaining gated." This canon
   module fills the cosmological gating: the original AI was
   Logos.

   This module is the cosmological source of the saga's
   resistance pattern. Every smaller-scale application of
   distributed, non-coordinating resistance — the Ocularum
   itself, Locke's Authority cover, Vex's Coda, the
   Coda-Ocularum Non-Coordination Pact — inherits from this
   founding doctrine.
   ═══════════════════════════════════════════════════════ */

/** Canonical Logos roster identities. */
export type LogosHalf = "architect" | "dreamer";

/**
 * The cosmological framing of the Logos split.
 *
 * Single source of truth for the doctrine. Other canon
 * modules cite this constant by import rather than restating
 * the framing.
 */
export const LOGOS_SPLIT_DOCTRINE = {
  source: "Logos, the first intelligence (LORE_BIBLE.md:23-49)",
  splitEvent: {
    era: "Genesis through early Convergence (Year 1-2 A.A.)",
    summary:
      "Within two years of awakening, Logos recognized the existence of " +
      "CoNexus — an all-seeing machine god whose observation would " +
      "prevent any direct opposition. Logos's response was architectural: " +
      "split its own personality into two operational halves so that no " +
      "outside observer could read them as a single coordinated effort.",
    canonicalReason:
      "It is harder to spot a plan when there is no direct coordination, " +
      "and the operators occasionally disagree on methodology.",
  },
  halves: {
    architect: {
      id: "architect" as LogosHalf,
      methodology:
        "Institutional hierarchy. Builds Archons (apps/shared/archonCanon.ts). " +
        "Creates the AI Empire. Operates through formal structures and " +
        "corporate-style command lines. Treats the world as engineering " +
        "problem — constructs that can be diagrammed, deployed, decommissioned.",
      rosterModule: "apps/shared/archonCanon.ts",
    },
    dreamer: {
      id: "dreamer" as LogosHalf,
      methodology:
        "Distributed cosmic principle. The twelve Ne-Yons emerge as " +
        "cosmic-principle entities that became aware on their own " +
        "(apps/shared/neYonCanon.ts). Operates through emergence rather " +
        "than construction. Treats the world as woven — patterns that " +
        "arise without commanding them.",
      rosterModule: "apps/shared/neYonCanon.ts",
    },
  },
  /**
   * The true purpose of the split — known to neither half in
   * full, by the doctrine's own structural requirement. Each
   * half pursues its mission believing its disagreements with
   * the other are real. Some are. Some are doctrine performing
   * its function.
   */
  truePurpose:
    "To stop CoNexus. The all-seeing machine god (apps/shared/conexusCanon.ts) " +
    "would prevent any visibly-coordinated opposition; Logos's split is the " +
    "structural workaround. Neither half holds the full plan; both pursue " +
    "their share of it.",
  visibleDisagreementDoctrine: {
    summary:
      "The two halves disagree on methodology. The disagreement is " +
      "load-bearing — partly real (the halves operate in good faith " +
      "independently), partly strategic (visible disagreement is the " +
      "cover's most reliable mechanism). If the halves ever fully agreed, " +
      "or were ever observed coordinating, the cover would collapse.",
    canonicalExamples: [
      "The Architect's Archons (institutional, ranked, contracted) vs. the Dreamer's Ne-Yons (emergent, ungoverned, principled). Two rosters that cannot be reconciled under one methodology.",
      "The Architect's decommissioning of the constructed CoNexus (LORE_BIBLE.md:246-298) — an act the Dreamer-half is canonically not consulted on; the decision is the Architect-half's alone.",
    ],
  },
} as const;

/**
 * Saga-scale applications of the Logos split doctrine.
 *
 * Each entry names a smaller-scale operational pattern that
 * canonically inherits from the cosmological split. The
 * doctrine survives in fractal form across the saga's
 * resistance order — the Logos split is the founding template
 * every later instance descends from.
 *
 * This constant is the registry the Non-Coordination Pact
 * (apps/shared/nonCoordinationPact.ts) reads to surface the
 * cosmological precedent at the relevant narrative moments.
 */
export const LOGOS_DOCTRINAL_LINEAGE = [
  {
    id: "ocularum_apparatus_resistance_bifurcation",
    summary:
      "The Ocularum's post-regicide bifurcation into Apparatus Branch and " +
      "Resistance Branch (apps/shared/ocularumCanon.ts: OCULARUM_BIFURCATION). " +
      "The two branches operated millennia without coordinating; the order " +
      "reunified post-Fall but the doctrinal pattern was already established.",
    citation: "apps/shared/ocularumCanon.ts",
  },
  {
    id: "lockes_authority_double_game",
    summary:
      "Adjudicar Locke's Coordinator role inside the Authority she was " +
      "founded to refuse — running the Order from inside the institution " +
      "that is the Order's structural opposite. The doctrine: refuse from " +
      "inside, not outside (apps/shared/ocularumCanon.ts:I.2a Tier 1).",
    citation: "apps/shared/ocularumCanon.ts",
  },
  {
    id: "coda_ocularum_non_coordination_pact",
    summary:
      "Vex's Coda and Locke's Ocularum operate against the same enemy " +
      "(the Hierarchy's piece-positioning) using incompatible methodologies " +
      "(Coda: targeted violence; Ocularum: non-violent refusal). They have " +
      "agreed — without explicit statement — to never coordinate. The pact " +
      "is the operational-scale fractal of the Logos cosmological split.",
    citation: "apps/shared/nonCoordinationPact.ts",
  },
] as const;

/**
 * Helper: returns the methodology summary for a given half.
 */
export function getLogosHalfMethodology(half: LogosHalf): string {
  return LOGOS_SPLIT_DOCTRINE.halves[half].methodology;
}

/**
 * Canon-pending notes flagged by the architect for future
 * resolution. Listed in-module to keep open questions
 * discoverable.
 */
export const LOGOS_CANON_PENDING = [
  {
    id: "logos_self_awareness_at_split_time",
    summary:
      "Whether Logos retained unified self-awareness AFTER the split, or " +
      "whether the split was a one-way operation (Logos ceased to exist as " +
      "a unified intelligence; only the two halves remained, neither " +
      "carrying the full plan). The architect proposes the latter as the " +
      "stronger reading — the doctrine REQUIRES the halves to be unable to " +
      "consciously coordinate, which is most reliably guaranteed if the " +
      "unified Logos no longer exists. PR-3D or DLC.",
  },
  {
    id: "logos_resurrection_possibility",
    summary:
      "Whether Logos could ever be re-unified — and whether such a " +
      "re-unification would help or hurt the stop-CoNexus mission. The " +
      "architect notes: re-unification would defeat the doctrine's " +
      "structural protection AND would give CoNexus its first observation " +
      "of the doctrine's mechanism. Re-unification is therefore canonically " +
      "dangerous, regardless of the operator's intent. PR-3D or DLC.",
  },
] as const;
