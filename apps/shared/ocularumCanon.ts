/* ═══════════════════════════════════════════════════════
   OCULARUM CANON

   The order founded on the assassination of Lord Kanshi Sha
   (feudal Japan, pre-A.A.). The single longest-running
   resistance order in the saga's continuity.

   Canonical reconciliation (architect note, 2026-05-14):

   The LORE_BIBLE references "Ocularum" in three distinct
   senses that this registry reconciles:

     (a) LORE_BIBLE.md:6728-6772 — "The Ocularum" as a
         LOCATION / device at the Panopticon, "built by the
         first Panopticon as a tool of observation, corrupted
         into a weapon of control." This is a physical
         surveillance instrument, separate from the order.

     (b) LORE_BIBLE.md:1272 — Kanshi Sha's "feudal spy
         network instinct became the foundation for the
         Empire's galaxy-spanning surveillance apparatus,
         including the Ocularum." This is the
         apparatus-branch reading — surveillance order that
         descended from Kanshi Sha's network into the AI
         Empire's intelligence bureaucracy, and which later
         became associated with the Panopticon's
         instrument (a).

     (c) Dreamer canon (2026-05-14): the Ocularum was
         Kanshi Sha's elite spy network. One of his own
         agents, trained personally by him, assassinated him
         in the feudal era. The order founded itself on that
         act of refusal and has persisted across millennia
         as an anti-surveillance resistance.

   The architect's reconciliation: (b) and (c) are TWO
   BRANCHES of the same order, both arising from Kanshi
   Sha's elite spy network at the moment of the founding
   regicide. The APPARATUS BRANCH (those who did not act)
   continued in his image and flowed into the Empire's
   surveillance bureaucracy across millennia, eventually
   curating the instrument at (a). The RESISTANCE BRANCH
   (the assassin and her sympathizers) went underground
   carrying the order's name and the founding doctrine
   "We were the first to refuse." After the Fall, the
   resistance branch reabsorbed what remained of the
   apparatus branch. The modern (saga-present) Ocularum is
   the reunified order, holding both legacies in productive
   tension. Their structural truth: the discipline of
   seeing turns on the one who built it. Anyone who teaches
   surveillance teaches the means of their own dethroning.

   This registry tracks the order qua organization. The
   instrument at (a) remains a LOCATION entry in the
   LORE_BIBLE and is not the subject of this canon module.

   ═══════════════════════════════════════════════════════ */

/**
 * Canonical Ocularum branch identity.
 *
 * The bifurcation across millennia produced two operational
 * lineages. The modern order is the reunified successor; this
 * type tracks which historical branch a member or operation
 * descended from when the distinction matters.
 */
export type OcularumBranch =
  | "apparatus" // post-regicide surveillance-bureaucracy descent
  | "resistance" // post-regicide underground descent
  | "reunified"; // saga-present, post-reunification

/**
 * Canonical role within the order's modern (reunified) structure.
 */
export type OcularumRole =
  | "coordinator" // operational head of the modern order; sits outside the cell-roster
  | "cell-member" // numbered cell (1-700 per the order's operational body)
  | "warlord-fragmented-sister"; // an Ocularum-trained operative seized by a warlord and unable to remember the order;
//                                  the order does not approach them and waits

/**
 * Canonical status of an Ocularum member entry within this registry.
 */
export type OcularumMemberStatus =
  | "active"
  | "predecessor-identity" // a registered prior identity of a still-active member (e.g., Senne for Locke)
  | "warlord-fragmented" // taken by a warlord; canonically un-remembering; status the order holds open indefinitely
  | "destroyed";

/* ═══════════════════════════════════════════════════════
   THE FOUNDING REGICIDE
   ═══════════════════════════════════════════════════════ */

/**
 * The order's founding event. The act that named the order
 * "Ocularum" and gave it the doctrine that has persisted across
 * tens of thousands of years.
 */
export const OCULARUM_FOUNDING = {
  event: "regicide_of_lord_kanshi_sha",
  era: "Feudal Japan, pre-A.A.",
  target: {
    name: "Lord Kanshi Sha",
    role: "feudal Japanese spymaster; later resurrected as The Watcher, the Fourth Archon",
    archonRegistryEntry: "the_watcher" as const,
    targetLoreSource: "LORE_BIBLE.md:1251-1289 (Kanshi Sha entry)",
  },
  assassin: {
    description: "a purple-clad ninja",
    relationship:
      "One of Kanshi Sha's own spy-network agents, trained personally by him. " +
      "She used every discipline he taught her — seeing without being seen, entering " +
      "and leaving without trace, reading a room and reading a man — to end him. The " +
      "founding irony is structural: he taught the discipline to the weapon that killed " +
      "him.",
    assassinLoreSource: "LORE_BIBLE.md:1272 (the purple-clad ninja canonical reference)",
    canonNote:
      "Canon registers the assassin as 'a purple-clad ninja' (LORE_BIBLE.md:1272). " +
      "Her specific identity beyond that callsign is canon-pending. The order " +
      "preserves her memory as the founding agent without speaking her personal name.",
  },
  doctrineEstablished:
    "The order names itself 'Ocularum' — those who watch — and writes into its " +
    "founding doctrine the line 'We were the first to refuse.' The doctrine has " +
    "three meanings the order holds together: (1) The eye that watches the watchers. " +
    "(2) The first to refuse the surveillance state. (3) The discipline of seeing " +
    "turns on the one who built it.",
  /**
   * What the founding regicide did NOT do, canonically: it did
   * not END Kanshi Sha. At the moment of his death, The
   * Collector (Archon) stepped through a dimensional veil,
   * seized his dying soul, and pulled him through time. He was
   * reborn as The Watcher, the Fourth Archon. The Ocularum has
   * spent the millennia since carrying the knowledge that their
   * regicide was canonically successful in the feudal era and
   * canonically reversed across deep time by an actor neither
   * the assassin nor her target could see at the moment of the
   * kill.
   */
  outcomeReversal: {
    reverser: "the_collector" as const,
    reversalLoreSource:
      "LORE_BIBLE.md:1272 — Collector stepped through a dimensional veil, seized " +
      "the dying soul, pulled Kanshi Sha through time; he was reborn as The Watcher",
    orchestrator: "the_hierarchy_of_the_damned",
    orchestrationCanonNote:
      "The Hierarchy of the Damned has been maneuvering pieces across aeons " +
      "(dreamer canon-lock, 2026-05-14). They needed Kanshi Sha alive in the " +
      "modern era to fill the surveillance-apparatus role The Watcher would " +
      "later occupy. The Collector's intervention was their tool. Project " +
      "Inception Ark provided the institutional cover. The Ocularum's regicide " +
      "succeeded against a single life and was undone by a faction operating on " +
      "a timescale longer than the order's own existence.",
  },
  loreSource: "LORE_BIBLE.md:1251-1289 + LORE_BIBLE.md:1272 (assassination canon)",
} as const;

/* ═══════════════════════════════════════════════════════
   BIFURCATION HISTORY
   ═══════════════════════════════════════════════════════ */

/**
 * The post-regicide split that produced two operational lineages.
 * Modern canon reunifies them, but the historical record carries
 * both — and the order's internal doctrine acknowledges that it
 * inherits from both legacies.
 */
export const OCULARUM_BIFURCATION = {
  apparatusBranch: {
    description:
      "Those of Kanshi Sha's spy network who did not act with the assassin. They " +
      "continued operating as he had trained them: ranked cells, silent doctrine, " +
      "the discipline of seeing without being seen. Across millennia their lineage " +
      "funneled into the AI Empire's surveillance bureaucracy and the broader " +
      "intelligence orders that later inherited the saga's surveillance state.",
    canonicalDescent:
      "Per LORE_BIBLE.md:1272 — 'his feudal spy network instinct became the " +
      "foundation for the Empire's galaxy-spanning surveillance apparatus, " +
      "including the Ocularum.' This shipping canon describes the apparatus " +
      "branch's descent into the surveillance state.",
    associationWithThePanopticonsInstrument:
      "The instrument at LORE_BIBLE.md:6728-6772 — 'The Ocularum' as a location / " +
      "device 'built by the first Panopticon as a tool of observation, corrupted " +
      "into a weapon of control' — is canonically associated with the apparatus " +
      "branch's surveillance lineage, not the resistance branch.",
  },
  resistanceBranch: {
    description:
      "The assassin and the four of the inner twelve who knew of the act and did " +
      "not stop her. They went underground carrying the order's name, the founding " +
      "doctrine, and the discipline they had been taught. They pledged to refuse " +
      "every surveillance state that ever arose after the first.",
    canonicalDoctrineSummary:
      "Three meanings of 'We were the first to refuse': the eye that watches the " +
      "watchers; the first to refuse the surveillance state; the discipline of " +
      "seeing turns on the one who built it.",
    operationalPeriod:
      "Continuously active from the feudal era through the saga's present — " +
      "tens of thousands of years of clandestine operation.",
  },
  reunification: {
    era: "Post-Fall, during the Empire's collapse and the rise of New Babylon",
    summary:
      "What remained of the apparatus branch — the surviving intelligence operators " +
      "whose institutional homes had collapsed with the AI Empire — was reabsorbed " +
      "by the resistance branch's underground successor. The modern order is the " +
      "reunified successor under the resistance branch's doctrine but retaining " +
      "the apparatus branch's operational reach.",
    canonNote:
      "The exact reunification event is canon-pending. The Coordinator at the time " +
      "of reunification (i.e., before Locke's modern coordinatorship) is also " +
      "canon-pending. The architect notes both as flagged for PR-2 (Watcher-arc " +
      "authoring) or DLC resolution.",
  },
} as const;

/* ═══════════════════════════════════════════════════════
   THE ORDER'S MODERN ROSTER (CANONIZED THIS WAVE)
   ═══════════════════════════════════════════════════════ */

/**
 * The order's operational body is canonically "the 700" — 700
 * numbered cells across the modern saga era. This registry
 * canonizes only the named cells the dreamer authorized in this
 * wave. The remaining ~695 are owed by the future DLC and must
 * resolve back into this canon when authored.
 *
 * Coordinators sit OUTSIDE the cell-roster — they are uncounted.
 * The "700" refers to the operational body, not the entire order.
 */
export interface OcularumMemberEntry {
  /** Stable id. */
  id: string;
  /** Display name or canonical callsign. */
  name: string;
  /** Cell number (1-700). `null` when the member sits outside the cell-roster (e.g., the Coordinator). */
  cellNumber: number | null;
  /** Member's role within the modern order. */
  role: OcularumRole;
  /** Which historical branch the member's lineage descends from (or "reunified" if post-reunification). */
  branch: OcularumBranch;
  /** Canonical status. */
  status: OcularumMemberStatus;
  /** Canonical other-identities the member is known by elsewhere in the saga. */
  otherIdentities: readonly string[];
  /** Brief canon-of-record description. */
  domain: string;
  /** Primary canonical source. */
  loreSource: string;
  /** Additional citations. */
  additionalSources: readonly string[];
  /** Canon notes for ambiguities, predecessor relationships, or pending resolutions. */
  canonNote?: string;
}

/**
 * Named Ocularum members canonized in this wave (2026-05-14).
 *
 * Five entries:
 *   - Adjudicar Locke (Coordinator)
 *   - Senne (Locke's predecessor identity)
 *   - the original Agent Zero (warlord-fragmented sister)
 *   - Mira the Glyph-Reader (Cell 99)
 *   - Old Tanjin (Cell 1)
 *   - the Seventh Whisper (Cell 700)
 *
 * The remaining ~694 cells are canon-pending and owed by the
 * future DLC.
 */
export const OCULARUM_MEMBERS: readonly OcularumMemberEntry[] = [
  {
    id: "locke_coordinator",
    name: "Adjudicar Locke",
    cellNumber: null,
    role: "coordinator",
    branch: "reunified",
    status: "active",
    otherIdentities: [
      "Adjudicar Locke (New Babylon Central Control Authority — Special Case Manager)",
      "The Eyes (Insurgency callsign, per Casino Heist canon)",
      "L. (signature on player-facing inbox letters)",
    ],
    domain:
      "Operational head of the modern Ocularum. Runs the order from inside the " +
      "Authority that the order was founded to refuse — a centuries-long, " +
      "perfectly-balanced double game. Her institutional cover (New Babylon's " +
      "Central Control Authority) gives the order operational reach across the " +
      "saga's primary trade, intel, and diplomatic surfaces. Every Trade Empire " +
      "mission she signs 'L.' is canonically Ocularum tradecraft hiding inside " +
      "Authority-sanctioned activity. If the Authority's six imprisoned minds " +
      "detect her dual loyalty, she dies.",
    loreSource:
      "LORE_BIBLE.md:614-660 (Adjudicar Locke entry); apps/shared/npcs/bibles/" +
      "adjudicator_locke.md (full character bible)",
    additionalSources: [
      "apps/shared/lockeInboxBridges.ts — post-act inbox letter cadence (the order's player-facing comms channel)",
      "apps/shared/companionAbilities.ts:117-130 — bond progression (the order's player-vetting ladder)",
      "apps/shared/questlineClassSpy.ts:304-338 — Locke / Senne identity-shift canon",
      "apps/shared/tradeMissionCatalog.ts — Trade Empire missions she dispatches (PR-3 will canonize 7 as breadcrumb operations)",
    ],
    canonNote:
      "The Coordinator role is the architect-proposed reconciliation of (a) her " +
      "11,000-year cross-factional career (AI Empire → Insurgency → New Babylon, " +
      "per LORE_BIBLE.md:614-660 + adjudicator_locke.md), (b) her canonical " +
      "'Touche moment' with Agent Zero (adjudicator_locke.md §section-on-Agent-Zero), " +
      "and (c) the structural fit of her line in questlineClassSpy.ts:338 — " +
      "'I was Surveillance Coordinator — I could see everything. But seeing and " +
      "acting are not the same thing. That is the lesson the Eyes taught me, and " +
      "it is the reason I stopped being Senne and became Locke.' Bright-line " +
      "constraint: the eye-deal mystery (adjudicator_locke.md §2.1, §7.2 — 'She " +
      "lost the eye in a deal that went wrong — she won't say which deal') is " +
      "canonically opaque space and MUST NOT be filled in as Ocularum-related.",
  },
  {
    id: "senne_predecessor",
    name: "Senne",
    cellNumber: null,
    role: "coordinator",
    branch: "reunified",
    status: "predecessor-identity",
    otherIdentities: [
      "Surveillance Coordinator Senne (AI Empire era, pre-defection)",
    ],
    domain:
      "Locke's pre-defection identity. The Ocularum's embed inside the AI " +
      "Empire's surveillance apparatus. She was Surveillance Coordinator — she " +
      "could see everything but did nothing about the first wave to flee through " +
      "the Dreamer's Shield. When the Empire fell, she walked her cover-identity " +
      "forward into the post-Fall institutional vacuum and became Adjudicar Locke. " +
      "The order placed her where she ended up; she has been the order's senior " +
      "operative since before the AI Empire's collapse.",
    loreSource: "apps/shared/questlineClassSpy.ts:304-338 (identity-shift canon)",
    additionalSources: [
      "apps/shared/questlineClassSpy.ts:338 — 'I was Surveillance Coordinator — I could see everything...'",
      "apps/shared/questlineClassSpy.ts:348 — 'Since before you were born. Since before most of the current Ark population was born.'",
    ],
    canonNote:
      "Registered as predecessor-identity of the locke_coordinator entry. The two " +
      "entries refer to the same operative across two named eras of her career. " +
      "When canon-of-record references 'Senne,' it is the same person currently " +
      "operating as Adjudicar Locke.",
  },
  {
    id: "agent_zero_original",
    name: "the original Agent Zero",
    cellNumber: null,
    role: "warlord-fragmented-sister",
    branch: "reunified",
    status: "warlord-fragmented",
    otherIdentities: [
      "Agent Zero (Insurgency callsign; the body's original inhabitant)",
    ],
    domain:
      "An Ocularum operative seized by the Warlord during the Insurgency era. " +
      "The Warlord trained her, shaped her, and bound her to its operational " +
      "architecture. She lost her memory of the order in the process. The order " +
      "has watched her since and has not approached her. The order waits. " +
      "Canonically, the body's later inhabitant is Vex Solène (post-transference) " +
      "— that identity's relationship to the order is CANON-PENDING (see " +
      "canonNote on this entry).",
    loreSource:
      "LORE_BIBLE.md:661-725 (Agent Zero entry); apps/shared/npcs/bibles/" +
      "vex_solene.md (post-transference identity bible — distinguishes the " +
      "original inhabitant from Vex)",
    additionalSources: [
      "apps/shared/antiquariansJournal.ts:425-437 — 'I knew her before the name. Before the yellow jacket. Before the reputation... The Warlord saw it too. Trained her. Shaped her...'",
      "apps/shared/archonCanon.ts:282-287 — Agent Zero / Vex Solene cross-cite",
      "apps/shared/hierarchyCanon.ts:128-130 — 'sent Agent Zero (Vex Solene) the Game Master's complete strategic playbook'",
    ],
    canonNote:
      "This entry registers THE ORIGINAL inhabitant of the body — the Agent Zero " +
      "whom the Warlord seized. Vex Solene is canonically the POST-TRANSFERENCE " +
      "identity inhabiting the same body, carrying the Engineer's intellect and " +
      "the Warlord's nano-swarm (per vex_solene.md). Vex's relationship to the " +
      "Ocularum is CANON-PENDING — her Coda-internal handle 'The Eyes of Reality' " +
      "(per vex_solene.md:9) parallels Locke's 'The Eyes' alias, but vex_solene.md " +
      "explicitly notes Vex and Locke are 'mirror operators in different registers,' " +
      "which may imply The Coda and the Ocularum are PARALLEL networks rather than " +
      "the same order. PR-2 (Watcher-arc authoring) must resolve this; until then " +
      "no Vex-side Ocularum binding is written into canon.",
  },
  {
    id: "old_tanjin",
    name: "Old Tanjin",
    cellNumber: 1,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "The eldest living member of the order. Cell 1. Canonically alive since the " +
      "founding-era — kept alive by a Heart-of-Time-adjacent intervention whose " +
      "mechanism is canon-pending. Holds the order's living memory of the " +
      "feudal era. The cells call him grandfather. He speaks rarely.",
    loreSource: "PR-1 (new canon-lock, this file)",
    additionalSources: [],
    canonNote:
      "The mechanism by which Old Tanjin has survived from the feudal era is " +
      "CANON-PENDING. Architect-proposed framings include: (i) a Heart-of-Time " +
      "fragment whose effects persist on his lifeline; (ii) an Ocularum-internal " +
      "discipline of life-extension that the order does not share; (iii) " +
      "something else entirely. PR-2 or DLC resolves. Until then, the canon " +
      "registers the fact (Tanjin lives) without committing to the mechanism.",
  },
  {
    id: "mira_glyph_reader",
    name: "Mira the Glyph-Reader",
    cellNumber: 99,
    role: "cell-member",
    branch: "reunified",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 99. The order's archivist and cipher-keeper. Reads the founding-era " +
      "glyphs the order has carried forward; maintains the doctrine in its " +
      "original notation. Surfaces in the saga primarily as a contact node — " +
      "Trade Empire mission contacts, gift-letter introductions, occasional " +
      "in-person briefings to senior operatives.",
    loreSource: "PR-1 (new canon-lock, this file)",
    additionalSources: [],
  },
  {
    id: "the_seventh_whisper",
    name: "the Seventh Whisper",
    cellNumber: 700,
    role: "cell-member",
    branch: "reunified",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 700. The most recent recruit before the player. Their callsign — " +
      "'the Seventh Whisper' — encodes their cell number and the order's " +
      "recruitment cadence (one whisper per generation, the seventh in their " +
      "succession line). Young, by Ocularum standards. The order is testing " +
      "them.",
    loreSource: "PR-1 (new canon-lock, this file)",
    additionalSources: [],
  },
] as const satisfies readonly OcularumMemberEntry[];

/* ═══════════════════════════════════════════════════════
   CANON-PENDING NOTES (flagged for PR-2 / DLC resolution)
   ═══════════════════════════════════════════════════════ */

/**
 * Tensions and ambiguities the architect identified during PR-1
 * authoring but did NOT resolve. Future PRs (PR-2 arc authoring,
 * or the eventual 700-card DLC) must address these. Listing them
 * here makes the open questions discoverable by future contributors.
 */
export const OCULARUM_CANON_PENDING = [
  {
    id: "vex_solene_relationship_to_ocularum",
    summary:
      "RESOLVED 2026-05-14 (PR-3C). Vex Solene is NOT an Ocularum member. " +
      "The Coda is a parallel network operating against the same enemy " +
      "(the Hierarchy's piece-positioning) via incompatible methodology " +
      "(targeted violence, where the Ocularum forbids violence). Locke " +
      "and Vex have entered into the Non-Coordination Pact " +
      "(apps/shared/nonCoordinationPact.ts) — they have agreed, without " +
      "explicit statement, to never coordinate. The pact is the saga's " +
      "operational-scale fractal of the Logos cosmological split " +
      "(apps/shared/logosCanon.ts).",
    cites: [
      "apps/shared/nonCoordinationPact.ts (resolution canon module)",
      "apps/shared/codaCanon.ts (Coda canonical structure)",
      "apps/shared/logosCanon.ts (cosmological precedent)",
      "apps/shared/npcs/bibles/vex_solene.md:115 ('mirror operators in different registers' — now named as the pact's structural signature)",
    ],
  },
  {
    id: "heart_of_time_vs_dimensional_veil_distinction",
    summary:
      "The Collector's harvest of Kanshi Sha (LORE_BIBLE.md:1272) operates via " +
      "'a dimensional veil' — explicitly NOT the Heart of Time, which is " +
      "canonically a SHIP that navigates the flow of causality (per " +
      "antiquariansJournal.ts:440-449). The architect's pre-canonization framing " +
      "of 'Heart of Time = harvest mechanism' is canonically wrong; the two are " +
      "distinct (though both navigate time, and both share design lineage with " +
      "the Antiquarian per his journal). PR-2 should not conflate them.",
    cites: [
      "LORE_BIBLE.md:1272 (Collector dimensional-veil canon)",
      "apps/shared/antiquariansJournal.ts:440-449 (Heart of Time = ship canon)",
      "apps/shared/antiquariansJournal.ts:257 ('that impossible vessel')",
    ],
  },
  {
    id: "reunification_coordinator_and_event",
    summary:
      "The Ocularum's bifurcation reunification event (post-Fall) and the " +
      "Coordinator(s) prior to Locke are canon-pending. The order has existed " +
      "for tens of thousands of years; Locke's tenure as Coordinator is one " +
      "chapter. PR-2 or DLC should establish at least the predecessor " +
      "Coordinator's identity to anchor the long view.",
    cites: [],
  },
  {
    id: "the_purple_clad_ninja_identity",
    summary:
      "The founding assassin is canonized as 'a purple-clad ninja' (LORE_BIBLE.md:" +
      "1272) and 'one of Kanshi Sha's own people, trained personally by him' " +
      "(dreamer canon-lock, 2026-05-14). Her personal name is canon-pending. The " +
      "order preserves her memory as the founding agent without naming her, which " +
      "is itself a doctrine — the resistance branch's founders are uncounted, like " +
      "Coordinators are uncounted. PR-2 should decide whether to surface a name " +
      "or preserve the canonical anonymity.",
    cites: ["LORE_BIBLE.md:1272"],
  },
] as const;

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Look up a registered Ocularum member by stable id. */
export function getOcularumMember(id: string): OcularumMemberEntry {
  const entry = OCULARUM_MEMBERS.find((m) => m.id === id);
  if (!entry) {
    throw new Error(`Unknown Ocularum member id: ${id}`);
  }
  return entry;
}

/** Returns the registered Coordinator(s) — current and predecessor identities. */
export function getCoordinators(): readonly OcularumMemberEntry[] {
  return OCULARUM_MEMBERS.filter((m) => m.role === "coordinator");
}

/** Returns the registered numbered cell members. */
export function getRegisteredCells(): readonly OcularumMemberEntry[] {
  return OCULARUM_MEMBERS.filter((m) => m.role === "cell-member");
}

/** Returns members canonically separated from the order by warlord-fragmentation. */
export function getWarlordFragmentedSisters(): readonly OcularumMemberEntry[] {
  return OCULARUM_MEMBERS.filter(
    (m) => m.role === "warlord-fragmented-sister",
  );
}

/** Look up a cell-member by canonical cell number, if registered. */
export function getCellByNumber(n: number): OcularumMemberEntry | null {
  return OCULARUM_MEMBERS.find((m) => m.cellNumber === n) ?? null;
}

/**
 * The canonical size of the order's operational body — "the 700."
 * Per the dreamer's canon-lock (2026-05-14), the modern Ocularum
 * operates 700 numbered cells. The DLC's authoring spec is to
 * fully populate this number with canonical members; this PR
 * canonizes 3 cells (Tanjin, Mira, Seventh Whisper) and registers
 * the count as the target.
 */
export const CANONICAL_OCULARUM_CELL_COUNT = 700;

/** Coverage metric: how many of the 700 cells are registered in this canon module. */
export function getOcularumCellCoverage(): number {
  return getRegisteredCells().length;
}
