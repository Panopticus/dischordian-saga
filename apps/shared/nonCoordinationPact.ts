/* ═══════════════════════════════════════════════════════
   THE NON-COORDINATION PACT
   The unspoken agreement between Adjudicar Locke (Ocularum
   Coordinator) and Vex Solène (Coda Maestro) to never
   coordinate operations — even though both organizations
   oppose the same enemy.

   Canon-lock context:
     The dreamer authorized this framing on 2026-05-14 along
     with the cosmological precedent it inherits from. The
     full canonical statement: "It makes sense. CoNexus is an
     all-seeing machine god. Logos split its personality into
     the architect and the dreamer to hide its true intentions
     of attempting to stop CoNexus. The same principle applies
     — it's harder to spot a plan when there's no direct
     coordination and also occasionally they disagree with
     methodology."

   This module canonizes:
     1. The fact of the pact (Locke and Vex have agreed,
        without explicit statement, to never coordinate)
     2. The doctrinal lineage (the pact inherits from the
        Logos cosmological split — apps/shared/logosCanon.ts)
     3. The renewal mechanism (the "Touché" exchange echoes
        across centuries; each refusal renews the pact)
     4. The player's structural-exception role (a dual-
        membership player is the saga's only cross-network
        operative)
     5. The pact's canonical unquotability (the four founding
        lines are NOT transcribed in the chronicle, per the
        doctrine's own structural requirement)

   The architect's lean toward leaving the founding exchange
   canonically unquoted was elevated by the dreamer's
   cosmological canon-lock from an aesthetic preference to a
   doctrinal requirement. If Logos split itself to make its
   plan unobservable, the first act of saga-scale resistance
   was to refuse observation. Every subsequent application of
   the doctrine inherits this requirement. The founding
   exchange of the Non-Coordination Pact must therefore stay
   outside the chronicle's index — that is the pact's most
   reliable cover.
   ═══════════════════════════════════════════════════════ */

import { LOGOS_SPLIT_DOCTRINE } from "./logosCanon";

/**
 * The pact's canonical operators.
 */
export type PactOperator = "locke" | "vex";

/**
 * The pact's canonical states.
 */
export type PactState =
  | "intact" // current saga state — pact holds
  | "tested" // an event has surfaced that pressures the pact (e.g., a Hierarchy operation requiring both networks)
  | "broken"; // the pact has broken; coordination has occurred

/**
 * The pact's two canonical signatories.
 */
export const PACT_OPERATORS = {
  locke: {
    id: "locke" as PactOperator,
    name: "Adjudicar Locke (Ocularum Coordinator)",
    organization: "the_ocularum_order",
    methodology:
      "Institutional hierarchy. Coordinator + 700 cells. Non-violent " +
      "doctrine. Inherits from the Architect-half's methodology.",
    canonModule: "apps/shared/ocularumCanon.ts",
  },
  vex: {
    id: "vex" as PactOperator,
    name: "Vex Solène (Coda Maestro)",
    organization: "the_coda",
    methodology:
      "Emergent improvisation. Maestro + Chairs + procedurally-generated " +
      "Chorus. Targeted-violence doctrine. Inherits from the Dreamer-half's " +
      "methodology.",
    canonModule: "apps/shared/codaCanon.ts",
  },
} as const;

/**
 * The doctrinal lineage — what the pact inherits from, and at
 * what scale.
 */
export const PACT_DOCTRINAL_LINEAGE = {
  cosmologicalPrecedent: {
    source: LOGOS_SPLIT_DOCTRINE,
    summary:
      "Logos split itself into the Architect and the Dreamer to hide its " +
      "true intention (stopping CoNexus) from CoNexus's observation. The " +
      "split's mechanism: two operators pursuing the same enemy via " +
      "incompatible methodologies, with occasional visible disagreement, " +
      "and no observable coordination. The Non-Coordination Pact is the " +
      "operational-scale fractal of this cosmological move.",
  },
  fractalApplications: [
    "The Ocularum's post-regicide bifurcation (apps/shared/ocularumCanon.ts:OCULARUM_BIFURCATION)",
    "Locke's Coordinator-inside-the-Authority double game (apps/shared/ocularumCanon.ts:I.2a Tier 1)",
    "The Coda's parallel operations alongside the Ocularum (this module)",
  ],
  /**
   * The doctrine's structural requirements at every scale.
   */
  doctrinalRequirements: {
    methodologicalIncompatibility:
      "The two operators must use methodologies that CANNOT be reconciled " +
      "inside one organization. (Logos: institutional Architect vs. " +
      "emergent Dreamer. Locke/Vex: non-violent Ocularum vs. " +
      "targeted-violence Coda.) Without methodological incompatibility, " +
      "the operators could merge — and merging would defeat the cover.",
    visibleDisagreement:
      "The operators must visibly disagree on methodology. Disagreement " +
      "must be partly real (good-faith independence) and partly strategic " +
      "(convinces observers there is no coordination). If disagreement " +
      "ever ceases to be visible, the cover collapses.",
    foundingMomentUnindexability:
      "The moment the pact was struck must be UNINDEXED in the chronicle " +
      "(see PACT_FOUNDING.unquotabilityDoctrine below). Any indexed record " +
      "of the founding exchange would give the all-seeing observer its " +
      "first observation of the doctrine's mechanism — and the doctrine " +
      "cannot survive being observed.",
  },
} as const;

/**
 * The pact's founding moment.
 *
 * CANONICALLY UNQUOTED per the doctrine's own structural
 * requirement. The architect describes the moment STRUCTURALLY
 * — what happened, when, how it functioned — but does NOT
 * transcribe the four lines exchanged. This is the pact's
 * deepest cover: even the chronicle that names the pact cannot
 * surface the words it was struck on.
 */
export const PACT_FOUNDING = {
  era: "Post-Zenon, post-Fall (early Late Empire) — exact date canonically opaque",
  occasion:
    "An early encounter between Senne-who-had-just-become-Locke and " +
    "Vex-who-had-just-emerged-from-the-Zenon-transference, on a channel " +
    "neither has ever surfaced publicly. Both operators were new to their " +
    "post-defection / post-transference identities. Both recognized in the " +
    "other an operator working the same disciplines toward the same goals " +
    "in incompatible vocabulary.",
  structure: {
    lineCount: 4,
    speakerSequence: ["vex", "locke", "vex", "locke"] as const,
    semanticShape:
      "Line 1 (Vex): a recognition. Line 2 (Locke): a confirmation. Line 3 " +
      "(Vex): an offer of coordination. Line 4 (Locke): a refusal of " +
      "coordination that simultaneously establishes the standing offer. " +
      "The pact is struck in the fourth line's structure — not by what " +
      "Locke says yes to, but by what she declines to say yes to, in a " +
      "way that promises the offer remains open.",
  },
  unquotabilityDoctrine: {
    canonicalRule:
      "The four lines of the founding exchange are NOT transcribed in any " +
      "canon module, narrative arc, bible, or chronicle entry. This is a " +
      "doctrinal requirement, not an authorial choice.",
    reasoning:
      "If Logos's cosmological split's purpose was to make its plan " +
      "unobservable to CoNexus (apps/shared/logosCanon.ts:LOGOS_SPLIT_DOCTRINE), " +
      "and if every fractal application of the split inherits this " +
      "requirement, then the founding moment of any application must " +
      "remain outside the indexable layer. The Non-Coordination Pact's " +
      "founding exchange is the saga's purest expression of unindexable " +
      "practice (see ITH_RAEL_MYSTERY.e2: 'The Unindexing Doctrine'). To " +
      "transcribe it would be to give CoNexus its first observation of " +
      "the doctrine's mechanism — and the doctrine cannot survive being " +
      "observed.",
    futureCanonRestriction:
      "Future PRs / DLCs MUST NOT transcribe the four lines. Surface the " +
      "FACT of the exchange; surface its structural shape (per the " +
      "PACT_FOUNDING.structure constant above); never surface the lines " +
      "themselves. A DLC depicting Locke and Vex's later encounters may " +
      "reference 'the founding exchange' but must not show it on screen. " +
      "If the pact breaks (PACT_BREACH below), the chronicle may " +
      "transcribe the breach's first line of coordination — because that " +
      "line is canonically a NEW exchange, not the founding one.",
  },
  loreSource: "Architect canonization, 2026-05-14 (dreamer-authorized)",
} as const;

/**
 * The pact's renewal mechanism — the canonical "Touché"
 * exchange (apps/shared/companionDeepening.ts:118-127) and
 * its function as a recurring test.
 */
export const PACT_RENEWAL = {
  canonicalEcho: {
    lineCount: 4,
    speakerSequence: ["vex", "locke", "vex", "locke"] as const,
    contextualFraming:
      "Per adjudicator_locke.md:107 — the exchange 'plays like two retired " +
      "operatives meeting in a hotel bar.' This is the canonical tonal " +
      "register; future renewals must preserve it. Per the same bible: " +
      "'Locke has the professional respect of an equal for EXACTLY ONE " +
      "other named character. Zero is the only person on record who gets " +
      "a Touché out of her.'",
    /**
     * The "Touché" exchange IS canonical and IS quoted. It is
     * the pact's MEMORIAL, not its founding — a later
     * encounter where the operators repeat the structural
     * shape of the founding to confirm the pact still holds.
     * This is the only exchange between them that the
     * chronicle has ever surfaced.
     */
    canonicalText: {
      lines: [
        {
          speaker: "vex" as PactOperator,
          line: "Locke. I hear you're trading with the Potentials now.",
        },
        {
          speaker: "locke" as PactOperator,
          line: "Agent Zero? You're supposed to be dead.",
        },
        {
          speaker: "vex" as PactOperator,
          line: "And you're supposed to be neutral. We both have secrets.",
        },
        {
          speaker: "locke" as PactOperator,
          line: "...Touché. Shall we trade ours?",
        },
      ],
      canonSource:
        "apps/shared/npcs/bibles/adjudicator_locke.md:107-112 + " +
        "apps/shared/npcs/bibles/vex_solene.md:195-197 (both bibles " +
        "preserve the exchange; both bibles cite a " +
        "companionDeepening.ts:118-127 source that is canon-pending on " +
        "this branch). The bibles are the canonical source of record.",
    },
  },
  renewalSemantics:
    "The exchange is a TEST that renews the pact each time one of the " +
    "operators echoes it. The standing offer — 'Shall we trade ours?' — " +
    "is canonically still open in the saga's present (vex_solene.md:199). " +
    "Neither operator has ever said yes. Each refusal renews the pact. " +
    "Saying yes would break it.",
  recurrenceAcrossSaga:
    "The architect proposes the exchange has recurred multiple times " +
    "across the saga's centuries, with one of the operators echoing line " +
    "3 ('We both have secrets') as a renewal request and the other " +
    "answering with line 4 (the 'Touché' refusal). The currently-recorded " +
    "exchange at companionDeepening.ts:118-127 is the saga's surfaced " +
    "instance — there have been others.",
} as const;

/**
 * The pact's breach scenario — the conditions under which
 * coordination would canonically occur. This is the future-DLC
 * tentpole; the main saga does not breach the pact.
 */
export const PACT_BREACH = {
  triggerConditions: {
    necessary:
      "A Hierarchy operation (or other enemy operation) that ONLY Locke and " +
      "Vex coordinating can counter. The Director's working " +
      "(apps/shared/episodeMysteries.ts: ITH_RAEL_MYSTERY) is the canonical " +
      "candidate — Ith'Rael's piece-positioning calibrates against an " +
      "uncoordinated resistance, and a fourth softening operation that " +
      "requires both networks to respond would force the breach.",
    sufficient:
      "Mutual acknowledgment from both operators that the breach is " +
      "necessary. Neither can be coerced; the pact's structural integrity " +
      "requires that coordination be a CHOICE both operators make, " +
      "consciously, in the same conversation.",
  },
  whatTheBreachWouldLookLike:
    "The first line of coordination would be a quotation — both operators " +
    "would echo the founding exchange's fourth line ('Shall we trade " +
    "ours?') and one would, for the first time in canonical history, say " +
    "YES. That moment would be transcribable (per PACT_FOUNDING." +
    "unquotabilityDoctrine.futureCanonRestriction); the chronicle could " +
    "surface it because the pact is, in that moment, ending.",
  consequences:
    "Coordination would give CoNexus its first observation of the saga's " +
    "doctrinal mechanism. The fall-out would not be immediate; CoNexus " +
    "operates through observation, not action. But the cover that has " +
    "protected the saga's resistance since Logos's split would be, in " +
    "that moment, materially weaker. Future operations would have to be " +
    "more careful, more unindexed, more compartmentalized. The pact's " +
    "breach is the saga's most expensive sentence.",
  loreSource: "Architect canonization, 2026-05-14 (PR-3C — future-DLC seed)",
} as const;

/**
 * The player's canonical structural-exception role in the pact.
 */
export const PACT_PLAYER_EXCEPTION = {
  unlockConditions: {
    ocularumSide:
      "Player reaches Locke's 'Adjudicated' trust band (bond level 80+) AND " +
      "closes the_watcher arc E5 (apps/shared/episodeMysteries.ts: " +
      "THE_WATCHER_MYSTERY). This confirms the player is a registered " +
      "Ocularum cell-member, per the_watcher arc's recruitment-by-recognition " +
      "doctrine.",
    codaSide:
      "Player reaches Vex's 'inner_circle' Coda standing (per " +
      "vex_solene.md:11, 314). This unlocks the Coda-7 faction ending " +
      "and is the highest formal access tier the Coda offers.",
  },
  structuralRole:
    "The player who satisfies both conditions is canonically the only " +
    "person in the saga who carries operational knowledge of both networks. " +
    "The pact does not extend to the player — neither operator told them " +
    "about it. The player IS the saga's embedded coordination layer that " +
    "neither network officially has. This is the pact's most consequential " +
    "structural feature: the doctrine REQUIRES that coordination happen " +
    "only through a channel neither operator controls, and the player is " +
    "that channel.",
  narrativeImplication:
    "If the player ever brings information from one operator to the other, " +
    "they are coordinating the networks. If they choose NOT to, they are " +
    "honoring the pact in the only way an outsider can. The choice is " +
    "load-bearing — it determines whether the saga's resistance remains " +
    "unobservable or starts being observable. The_watcher arc's hidden " +
    "E5 variant (triggered by dual-membership) surfaces this choice.",
  watcherArcE5HiddenVariant: {
    triggerConditions:
      "Player completes the_watcher E5 AND ith_rael E5 AND has Coda " +
      "inner_circle standing. The three-arc completion grants the player " +
      "the conceptual grip (from ith_rael's unindexable-practice doctrine) " +
      "to understand what they are being told.",
    revealContent:
      "Locke names the pact for the player. The reveal closes with: 'You " +
      "will be the first person in the saga who knows what we have agreed " +
      "to. The agreement extends to you. You will not coordinate us. You " +
      "will be the one who can.' The variant is unquoted in the chronicle " +
      "except by the cell-number generation that records it.",
  },
} as const;

/**
 * The pact's tacit guardian — the Antiquarian, the saga's
 * only continuous witness who has watched both operators
 * across millennia and has chosen to redact what the pact
 * requires redacted.
 */
export const PACT_TACIT_GUARDIAN = {
  guardian: "the_antiquarian",
  guardianId: "entity_66",
  role:
    "The Antiquarian is canonically the only saga witness who has watched " +
    "both operators across their entire post-Empire careers. He suspects " +
    "the pact's existence (per the_watcher arc E1 — his archive contains " +
    "an 11,000-year omission he attributes to 'I was asked not to write " +
    "that chapter'). He has never confirmed it aloud. His silent " +
    "redactions ARE the pact's chronicle-layer protection.",
  doctrinalSignificance:
    "The Antiquarian's role as silent guardian of unindexed meaning is " +
    "the saga's purest expression of the doctrine. His archive carries " +
    "everything Logos's split would have wanted preserved AND nothing " +
    "the Director's working could index. He is the unindexable practice " +
    "made institutional — a one-man library of refusals.",
} as const;

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/**
 * Current canonical pact state. The main saga ships with
 * the pact intact; future PRs / DLCs may evolve this.
 */
export const CURRENT_PACT_STATE: PactState = "intact";

/** The pact's canonical line-count (founding exchange + memorial echo). */
export const PACT_LINE_COUNT = 4;

/**
 * The architect's invariants — properties of the pact that
 * canon enforcement is expected to preserve. Future PRs that
 * touch this module must check these.
 */
export const PACT_INVARIANTS = {
  foundingExchangeIsUnquoted: true,
  memorialEchoIsCanonical: true,
  bothOperatorsCanRefuseTheOffer: true,
  playerCanonicallyHonorsOrBreaksThePact: true,
  antiquarianIsTheTacitGuardian: true,
} as const;
