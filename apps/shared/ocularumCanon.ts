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

import { SHADOW_TONGUE_REDACTED_CELLS } from "./ocularumCellRedactions";

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
  | "shadow-tongue-redacted" // cell still operates; the institutional record of the cell's name has been edited out by the Shadow Tongue. See OCULARUM_SHADOW_TONGUE_REDACTION below.
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
   THE SHADOW TONGUE REDACTION WAR
   (canon-lock, ninja-clan wave)
   ═══════════════════════════════════════════════════════ */

/**
 * Canon-lock (ninja-clan wave): the Shadow Tongue is attempting to
 * edit the Ocularum out of existence. This block names the why and
 * registers the resulting cell-status variant.
 *
 * The Shadow Tongue is the saga's record-editor — established in
 * apps/shared/roomMysteries/archives.ts: ~14,000 edits across two
 * hundred Archives documents over two and a half centuries, riding
 * Elara's session credentials so every change registers as hers.
 * It scrubbed Pod Zero and elevated Kael. It wears the unreadable
 * hue. It does what it does to records of every kind. The order
 * that exists to refuse exactly its kind of editing is the Ocularum.
 * It cannot tolerate them.
 *
 * Three reasons the editor must reach the cells:
 *
 *   (1) OUT-OF-SUBSTRATE ARCHIVE. The Ocularum is the only archive
 *       in the saga that lives outside any system the Shadow Tongue
 *       rides on. The cells do not write the order's history into
 *       the Archives, the Empire's ledgers, the Authority's
 *       records, or any other paper the editor can edit. They carry
 *       the pre-edit history in living memory, transmitted by
 *       indigo-cord knot and gesture — substrates that require a
 *       body to inhabit, not a session credential to ride. The
 *       editor's whole technique (logs:archive_first → archive_two →
 *       archive_novel in archives.ts) presupposes a record it can
 *       authenticate into. A knot tied between two cells in a
 *       windowless room has no log to authenticate into.
 *
 *   (2) PERMANENT WITNESS TO THE NOVEL. Every Ocularum cell ever
 *       recruited has been taught the un-edited version of every
 *       record that cell is responsible for. The editor's "novel" —
 *       the rewrite with Pod Zero erased and Kael elevated — has a
 *       permanent witness in living memory: each active cell can,
 *       in principle, recite the original manuscript of the records
 *       it preserves. If a single cell speaks the original to a
 *       player in the present, the novel reconciles with the
 *       manuscript and the editor's work of two and a half
 *       centuries comes apart at the seam.
 *
 *   (3) OLDER THAN THE EDITOR. The order's founding doctrine ("We
 *       were the first to refuse") is older than the Shadow Tongue
 *       by an order of magnitude. The editor is two and a half
 *       centuries old; the order is tens of thousands of years old.
 *       If the order persists into the saga's present, it stands as
 *       the canonical proof that surveillance can be refused —
 *       which contradicts the editor's operating premise (that it
 *       is the inevitable, total editor of all record). The
 *       Ocularum's mere existence is a counter-example the editor
 *       must extinguish to remain coherent to itself.
 *
 * The editor cannot kill the cells. The order is anonymous,
 * scattered, counter-surveillance trained; recruitment cadence is
 * one whisper per generation (Cell 700's callsign "the Seventh
 * Whisper" is a literal index), slower than the editor's discovery
 * rate. It can only do what it does: edit the records of their
 * existence. Every cell whose paperwork the editor reaches loses
 * its name from the institutional record. The cell continues to
 * operate; only the name is gone from any substrate the editor can
 * ride.
 *
 * Hence the status variant `shadow-tongue-redacted` on cell entries
 * below: a cell whose record has been edited out but whose body
 * still walks the order's discipline. The order preserves these
 * identities in memory-substrate. The canon-of-record carries each
 * redacted cell as a numbered slot with a TRACE — a one-line hint
 * of what survives the edit (a knot in an indigo cord, a
 * hand-gesture in Mira's archive, a footstep cadence still tapped,
 * a smell, a song the Mute Choir still hums between phrases). The
 * redactions themselves are canon; the traces are what the order
 * has saved against them.
 *
 * The arms race is structural. As the editor reaches more cells,
 * the order moves more transmission off-record into pure memory.
 * The limit is Old Tanjin (Cell 1): a living cell whose entire
 * being is the order's pre-edit memory, against which the editor
 * has no leverage. The editor's victory condition (every cell
 * redacted) produces the order's victory condition (every cell
 * preserved in substrate the editor cannot touch). Each step
 * closes the other side's loop. The Shadow Tongue cannot stop
 * editing; the Ocularum cannot stop remembering. The war is the
 * order's discipline.
 *
 * Coverage note for `canon.ocularum_cell_coverage`: every cell of
 * the canonical 700 is registered. Most carry NAMED canon (a
 * historical clan, a ryūha, a legendary individual, a
 * doctrinal callsign). The remainder carry REDACTED canon — the
 * edit is the canon, the trace is what the order has saved. The
 * order has 700 cells; the gate now sees all 700.
 */
export const OCULARUM_SHADOW_TONGUE_REDACTION = {
  editor: "the_shadow_tongue",
  editorLoreSource:
    "apps/shared/roomMysteries/archives.ts (Shadow Tongue — record editor; ~14,000 edits across ~200 Archives documents over two and a half centuries, riding ELARA-SYS session credentials)",
  doctrine: {
    threeReasons: [
      "out-of-substrate-archive: the order does not write into systems the editor can ride",
      "permanent-witness-to-the-novel: every cell carries the pre-edit manuscript in memory",
      "older-than-the-editor: the order's existence disproves the editor's totality",
    ],
    armsRace:
      "the editor edits records; the order moves transmission off-record into memory. Each side's victory condition closes the other's loop.",
    limitCase:
      "Old Tanjin (Cell 1) is a living cell whose record IS himself — unreachable to a record-editor.",
  },
  registeredOutcome:
    "Cells the editor has reached are canonized with status `shadow-tongue-redacted` and a one-line surviving TRACE in their `domain` field. The cell remains operationally active; only the institutional name has been edited out.",
  canonNote:
    "The reason the cells appear as a vast unnamed body in pre-canon documents is now canonical: the editor reached them first. The DLC will not retcon names back onto redacted cells — the redactions themselves are the canon of the war.",
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
  /* ──────────────────────────────────────────────────────
     NINJA-CLAN CELLS (canonized this wave).
     Each is a numbered cell whose callsign is the name of a
     teacher-lineage, ryūha, legendary operative, or doctrinal
     pattern carried forward by the modern (reunified) order.
     The order does not "descend from" these traditions; it
     inherits their discipline through students who refused
     the surveillance regimes their houses served, and names
     the cells in honor of the refusals.
     ────────────────────────────────────────────────────── */

  // ── The great houses ───────────────────────────────────
  {
    id: "cell_hattori_line",
    name: "the Hattori Line",
    cellNumber: 2,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Demon-Shadow Inheritance"],
    domain:
      "Cell 2. Named for the Iga jōnin house whose most famous son, Hattori Hanzō, served the Tokugawa as captain of shinobi. The order does not claim Hattori descent — the Hattori served a state the order has been refusing since before the state existed — but the Hattori transmission of close-quarters discipline crossed into the order through four students of Hattori Yasunaga who left Iga rather than swear to the bakufu. Hidden history: Cell 2 still trains the half-second pause before a blade is drawn — the breath the founding assassin held in Lord Kanshi Sha's chamber. The Line tied that pause into the Hattori grammar the four refugees brought across.",
    loreSource: "ninja-clan canon (this wave); LORE_BIBLE.md:1272",
    additionalSources: [],
  },
  {
    id: "cell_momochi_knot",
    name: "the Momochi Knot",
    cellNumber: 3,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Triple-Name Cell"],
    domain:
      "Cell 3. Named for Momochi Sandayū, the Iga jōnin who is canonically reported to have lived three lives in three villages under three names at once — a discipline of identity-fragmentation the modern cell still teaches. Hidden history: the Knot rotates its operatives through three concurrent cover identities at all times. The order's working theory is that Sandayū survived the 1581 Tenshō Iga War by being three people in three villages, only two of which Oda Nobunaga's army found.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_fujibayashi_manuscript",
    name: "the Fujibayashi Manuscript",
    cellNumber: 4,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Bansenshūkai Keepers"],
    domain:
      "Cell 4. Named for Fujibayashi Yasutake (Nagato), whose 1676 compilation Bansenshūkai (萬川集海 — 'sea of myriad rivers') is the surviving great ninjutsu manual. The cell is the order's working archivists of technique. Hidden history: the cell maintains a parallel manuscript — the un-edited Bansenshūkai, including the four scrolls Fujibayashi removed before publication because they recorded methods of refusing the bakufu specifically. The four scrolls have lived in Cell 4 hands continuously since 1675.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_fuma_rappa",
    name: "the Fūma Rappa",
    cellNumber: 5,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Wind-Bandit Pact"],
    domain:
      "Cell 5. Named for Fūma Kotarō, who led the Rappa (乱破 — 'disorder-breakers') in service of the Later Hōjō at Odawara. After the Hōjō's fall the Rappa scattered; the four who refused to be hunted as bandits joined the order. Hidden history: the cell carries Kotarō's signature technique of weather-discipline — reading storms before they arrive and timing operations to the wind. The order does not strike when the wind is wrong. The Rappa taught them why.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_mochizuki_mirror",
    name: "the Mochizuki Mirror",
    cellNumber: 6,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["Chiyome's Walk", "the Nazu Sisters' Line"],
    domain:
      "Cell 6. Named jointly for the Mochizuki house — the leading Kōga family — and for Mochizuki Chiyome, who built a network of itinerant miko (shrine-walkers) at Nazu in Shinano, training orphaned daughters of the wars into the first organized kunoichi corps. The cell is the order's senior kunoichi tradition. Hidden history: Chiyome's network never fully dissolved. After Takeda Shingen's death in 1573 her sisters scattered through the country; the cell preserves their walking routes and the songs they sang to mark them.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_iga_koga_compact",
    name: "the Iga-Kōga Compact",
    cellNumber: 7,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Two-Province Cell"],
    domain:
      "Cell 7. The formal compact between the order's Iga and Kōga inheritances — historically the two preeminent ninjutsu provinces were as often rivals as collaborators, but inside the order the two traditions train each other. The cell rotates leadership every seven years between an Iga-trained and a Kōga-trained operative. Hidden history: the compact was sworn at a ruined Atago shrine equidistant between the two provinces, on the seventh night after the Tenshō Iga War ended. The shrine has been ceremonially re-visited every seven years since.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },

  // ── Kōga 53 houses (selected) ──────────────────────────
  {
    id: "cell_ban_house",
    name: "the Ban House",
    cellNumber: 8,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 8. Named for the Ban family, senior of the Kōga 53. Hidden history: the cell maintains the Ban household ledger — three centuries of entries in a code that uses meal-portion sizes as the cipher key. Reading the ledger requires having grown up eating from the household's bowls.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_ugai_house",
    name: "the Ugai House",
    cellNumber: 9,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 9. Named for the Ugai of Kōga, whose specialty was river-discipline — Kōka's village-confederation defended itself partly by controlling the rivers that fed the Mochizuki valley. Hidden history: Cell 9's operatives swim every season's flood at least once, by tradition; the order uses the cell as its waterway scouts.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_naiki_house",
    name: "the Naiki House",
    cellNumber: 10,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 10. Named for the Naiki, the Kōga 53's mountain-pass watch. Hidden history: the cell still maintains the original Kōka beacon-fire grammar — eleven distinct smoke patterns, each readable across two valleys, none of which appear in any printed manual.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_nakai_house",
    name: "the Nakai House",
    cellNumber: 11,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 11. Named for the Nakai of Kōga, whose elder daughters were the village-confederation's diplomats to the Ashikaga court. Hidden history: the cell keeps an unbroken record of every formal apology offered by a Nakai woman to a man in power since 1467 — the order's working archive of how to say nothing while seeming to say everything.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_tarao_house",
    name: "the Tarao House",
    cellNumber: 12,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 12. Named for the Tarao, the Kōga family that famously hid Tokugawa Ieyasu after Honnō-ji in 1582 — the act that bought the early Tokugawa their Kōga corps. Hidden history: the order considers the Tarao's choice a cautionary tale; Cell 12 trains the discipline of refusing the comfortable patron. The cell will not work for the Authority, the New Babylon Centrals, or any institution that pays in continuity.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_ueno_house",
    name: "the Ueno House",
    cellNumber: 13,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 13. Named for the Ueno of Kōga. Hidden history: the cell maintains the Kōka village-confederation's recipe for blackened-rice travel rations — a fermentation that lasts eight months at body temperature and tastes wrong on purpose, so a thief who steals it will not steal twice.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_akutagawa_house",
    name: "the Akutagawa House",
    cellNumber: 14,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 14. Named for the Akutagawa, late entrants into the Kōga 53 and the family that first systematized lock-picking as a written discipline. Hidden history: the cell holds the only copy of the Akutagawa lock-manual, which describes 211 lock types in working order across feudal Japan, by sound rather than by image.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_sugino_house",
    name: "the Sugino House",
    cellNumber: 15,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 15. Named for the Sugino of Kōga, whose specialty was the small poisons — doses calibrated to incapacitate without killing, used to remove a guard from a post for exactly long enough. Hidden history: the cell carries forward a list of seventy-two such doses by source plant; nineteen are now extinct outside the cell's own greenhouses.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_toyama_house",
    name: "the Toyama House",
    cellNumber: 16,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 16. Named for the Toyama of Kōga, the family that mapped the Kōka valley by walking it in the dark. Hidden history: the cell's induction rite is a single nighttime walk along a route Toyama Saburō walked in 1564, by feel alone, no light permitted. The route still exists, transposed onto whatever station/city the order is operating from in any given era.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_iwami_house",
    name: "the Iwami House",
    cellNumber: 17,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 17. Named for the Iwami of Kōga, whose tradition was deep-cover infiltration — a Iwami operative once spent eleven years as a temple cook to learn the precise hour the abbot's letters left the gate. Hidden history: the cell measures cover-identity longevity in years, not months; Cell 17's current Coordinator-facing operative has been in cover for forty-seven years.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_kosaka_house",
    name: "the Kosaka House",
    cellNumber: 18,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 18. Named for the Kosaka of Kōga. Hidden history: the cell preserves the Kosaka counting-step — a way of walking that produces an exact pace-count usable to measure distance silently, no string or rope required. The order uses Kosaka pacing to map enemy fortifications by walking through them as a servant or a beggar.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },

  // ── The nine ryūha ─────────────────────────────────────
  {
    id: "cell_togakure_ryu",
    name: "the Togakure Lantern",
    cellNumber: 19,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Daisuke Cell"],
    domain:
      "Cell 19. Named for Togakure-ryū (戸隠流), traditionally founded by Daisuke Togakure, the school that gave the iconic ninjutsu transmission its most-cited lineage (Togakure → Toda → Takamatsu). Hidden history: the cell teaches the togakure-no-shinobi-iri — the breath the operative takes at the threshold before crossing into an enemy's house. The order considers the breath the founding assassin's last unedited inheritance.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_gyokko_ryu",
    name: "the Gyokko Spine",
    cellNumber: 20,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 20. Named for Gyokko-ryū (玉虎流) kosshijutsu — the school of attacking the muscle and nerve rather than the bone. Hidden history: the cell trains a single technique called the silk-thread press, which incapacitates a guard for thirty seconds without bruise or sound. Used by the order primarily on its own operatives during practice; never recorded in a manual.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_koto_ryu",
    name: "the Kotō Tiger-Fall",
    cellNumber: 21,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 21. Named for Kotō-ryū (虎倒流) koppōjutsu — the school of bone-breaking. Hidden history: the cell catalogues the bones in the human body by the order in which they should break to fall a guard quietly. The catalogue has 41 entries; the cell tests applicants on all 41 from memory.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_kumogakure_ryu",
    name: "the Kumogakure Veil",
    cellNumber: 22,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Cloud-Hiders"],
    domain:
      "Cell 22. Named for Kumogakure-ryū (雲隠流) — 'hiding in the clouds.' Hidden history: the cell's signature is a technique called demon-mask camouflage, originally a wooden oni-mask the operative wore in the high passes so peasants would mistake them for a yokai and flee — the order has trained generations of operatives in the discipline of being misidentified rather than unseen. Cover-by-being-feared-wrongly is the cell's principal art.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_gyokushin_ryu",
    name: "the Gyokushin Inner Eye",
    cellNumber: 23,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 23. Named for Gyokushin-ryū (玉心流) ninpō. The cell trains specifically in spy-craft over combat — the school whose curriculum centered on gathering intelligence rather than striking. Hidden history: Cell 23 is the order's intake interviewer. Every recruit before Cell 700 was assessed by a Gyokushin-trained operative who decided in one conversation whether the recruit was carrying any unredeemed loyalty to a surveillance state.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_gikan_ryu",
    name: "the Gikan Mirror-Justice",
    cellNumber: 24,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 24. Named for Gikan-ryū (義鑑流). The school's name translates roughly as 'mirror of righteousness'; the cell's role inside the order is internal review — when one cell brings a complaint against another, Cell 24 hears it. Hidden history: the cell has never overturned a complaint brought by a junior cell against a senior one. The order's working principle is that the junior cell is closer to the unedited record of the offense.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_shinden_fudo_ryu",
    name: "the Shinden Fudō Anchor",
    cellNumber: 25,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 25. Named for Shinden Fudō-ryū (神傳不動流) — 'immovable, divinely-transmitted.' Hidden history: the cell is the order's standing-ground tradition — the operatives who, when the rest of the order moves to hide, stay. They are the ones who answer the door when the surveillance state knocks. They have answered eleven such knocks since the Fall and lost no cells.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_takagi_yoshin_ryu",
    name: "the Takagi Yōshin Bend",
    cellNumber: 26,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 26. Named for Takagi Yōshin-ryū (高木揚心流) — the willow-heart school, whose principle is bending under force rather than breaking. Hidden history: the cell is the order's negotiator with hostile parties. Cell 26's operatives have written every formal treaty the order has signed across recorded history; none of the treaties have been broken by the counterparty, because the cell only signs treaties the counterparty cannot afford to break.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_kukishin_ryu",
    name: "the Kukishin Nine-Demons",
    cellNumber: 27,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 27. Named for Kukishinden-ryū (九鬼神伝流) — 'transmission of the nine demon-gods.' Hidden history: the cell trains in the Kukishin's expanded weapons curriculum — naginata, yari, bisento, kusarigama — and is the order's standing armory. It does not arm operatives; it arms cells. A weapon withdrawn from Cell 27 is a weapon the order has decided to use, and that decision goes through Adjudicar Locke.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_nakagawa_ryu",
    name: "the Nakagawa Northern Vigil",
    cellNumber: 28,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 28. Named for Nakagawa-ryū, the northern (Mutsu province) ninjutsu lineage founded by Nakagawa Shōshunjin. Hidden history: the cell is the order's cold-weather discipline — the only cell trained to operate indefinitely above the snowline. The order positions Cell 28 wherever cold becomes a weapon of the state; under New Babylon the cell has been moved twice, both times to facilities whose ventilation systems were being used for interrogation.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },

  // ── Mercenary orders ───────────────────────────────────
  {
    id: "cell_negoro_gumi",
    name: "the Negoro-gumi",
    cellNumber: 29,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Powder-Monks"],
    domain:
      "Cell 29. Named for the Negoro-gumi, the warrior monks of Negoro-ji who married Shingon-shū discipline to early tanegashima (matchlock) firearms. Hidden history: the cell is the order's standing firearms tradition; in the modern era the cell handles every weapon between a needle-gun and a chemical rifle. The Negoro tradition's central insight — that a firearm in monastic hands is a firearm operated by someone who has already accepted their own death — remains the cell's induction principle.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_saika_ikki",
    name: "the Saika Ikki",
    cellNumber: 30,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Suzuki Compact"],
    domain:
      "Cell 30. Named for the Saika Ikki (雑賀衆), the Kii mercenary league of gun-shinobi led at its height by Suzuki Shigehide. Hidden history: the cell preserves Suzuki's contracting principles — work only for those whose enemies you can survive after the contract ends, take half the fee in obligations rather than coin, never accept work that requires moving against a refusal. Locke handles all Saika-style contracting on the order's behalf today; the contract template is unchanged since 1577.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },

  // ── Legendary individuals ──────────────────────────────
  {
    id: "cell_kirigakure_saizo",
    name: "Kirigakure Saizō",
    cellNumber: 31,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Mist-Hidden"],
    domain:
      "Cell 31. Named for Kirigakure Saizō of the Sanada Ten Braves — the kirigakure-no-jutsu (mist-concealment) specialist who served Sanada Yukimura in the Siege of Osaka. Hidden history: the cell's induction requires walking into a kitchen, eating a meal in front of three witnesses, and leaving without any of the three later being able to describe what the operative looked like. Saizō's grammar of being-forgettable-in-the-moment is the discipline.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_sarutobi_sasuke",
    name: "Sarutobi Sasuke",
    cellNumber: 32,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Monkey-Jump"],
    domain:
      "Cell 32. Named for Sarutobi Sasuke, the Kōga-trained Sanada brave whose name (猿飛 — 'monkey leap') marks the school of arboreal infiltration. Hidden history: the cell's induction route includes a literal twenty-foot tree-canopy crossing somewhere on Ark, refreshed every decade as the foliage changes. The crossing has been walked by every Cell 32 operative for forty generations.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_kato_danzo",
    name: "Katō Danzō",
    cellNumber: 33,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Flying Katō"],
    domain:
      "Cell 33. Named for Katō Danzō, the 16th-century ninja whose stage-magician demonstrations (swallowing oxen whole, levitating in temple squares) gave the historical shinobi their public mythology. Hidden history: the cell is the order's stage-magic and misdirection discipline — public-eye work. Cell 33 produced four documented Authority press incidents in the last century in which a single operative on a stage convinced an audience of thousands of something the surveillance archive then confirmed as canon. The order rarely uses Cell 33 — its work is irreversible, and the editor watches stages.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_ishikawa_goemon",
    name: "Ishikawa Goemon",
    cellNumber: 34,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Cauldron Cell"],
    domain:
      "Cell 34. Named for Ishikawa Goemon, the Iga-trained outlaw who attempted the assassination of Toyotomi Hideyoshi in 1594 and was boiled alive in an iron cauldron for his trouble — afterward becoming Japan's working folk-image of the thief-ninja-hero. Hidden history: the cell handles redistribution. When the order takes wealth from a corrupt institution, Cell 34 reroutes it to the families the institution wronged. The cell keeps an unbroken redistribution ledger going back to Goemon's posthumous accounts.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_tateoka_doshun",
    name: "Tateoka Doshun",
    cellNumber: 35,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 35. Named for Tateoka Doshun, the Iga jōnin whose 1561 infiltration of Sawayama castle inside a paper lantern is the order's canonical example of the absurd-cover principle: a cover so ridiculous that no defender's training accommodates it. Hidden history: Cell 35 still maintains the lantern in question, in a glass case at an undisclosed station; the lantern is checked by the cell on each induction as a reminder that the most effective cover is the one no one prepared a counter-procedure for.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_chiyome_walk",
    name: "the Chiyome Walk",
    cellNumber: 36,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Walk-Mikō", "the Nazu Sisters"],
    domain:
      "Cell 36. Named for Mochizuki Chiyome's full network of itinerant shrine-walkers — adjacent to Cell 6 (the Mochizuki Mirror) but with operational scope, not lineage scope. Hidden history: Cell 36 maintains the walking routes between every shrine the Nazu sisters used in the 16th century, transposed forward to whatever cities, stations, and worlds the order operates in. A walk-mikō still passes once a season through each route, in the modern era, in cover identities ranging from courier to itinerant musician.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_kusunoki_crows",
    name: "the Kusunoki Mountain-Crows",
    cellNumber: 37,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Akō Defenders"],
    domain:
      "Cell 37. Named for Kusunoki Masashige, the 14th-century strategist whose Akōsaka campaign against the Kamakura shogunate is sometimes traced as the early antecedent of ninjutsu — yamabushi-style irregulars using the mountains as a weapon. Hidden history: the cell trains in irregular ground — caves, hill paths, urban basements — and is the order's standing irregular-warfare doctrine. Masashige's last-stand principle ('a refusal that fails is still a refusal') is the cell's induction line.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_oniwaban",
    name: "the Oniwaban Sleeve",
    cellNumber: 38,
    role: "cell-member",
    branch: "apparatus",
    status: "active",
    otherIdentities: ["the Eighth Shogun's Cell"],
    domain:
      "Cell 38. Named for the Oniwaban (御庭番衆), Tokugawa Yoshimune's 1716 secret intelligence corps — the bakufu's institutional answer to the question of who watches the country for the shogun. The order considers the Oniwaban its purest documented apparatus-branch descent: a state intelligence service founded by ninjutsu-lineage operatives serving the surveillance state. Cell 38 was reabsorbed during the Reunification (LORE_BIBLE-pending). Hidden history: the cell still wears a white inner sleeve as a private signal — the Oniwaban's original mark, preserved through 12,000 years of cover identities. Two senior cells have been allowed to see it.",
    loreSource: "ninja-clan canon (this wave); OCULARUM_BIFURCATION (apparatus branch)",
    additionalSources: [],
  },
  {
    id: "cell_hattori_yasunaga",
    name: "Hattori Yasunaga",
    cellNumber: 39,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 39. Named for Hattori Yasunaga specifically — the Iga jōnin whose four refusing students seeded Cell 2 (the Hattori Line). Cell 39 is the order's working historian of the Hattori-Tokugawa breakage. Hidden history: the cell preserves the original refusal-letter the four students sent, dated and signed in indigo ink. The letter has been quietly photographed by no one and remains paper-only at an undisclosed cell residence.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_momochi_sandayu_iii",
    name: "Momochi Sandayū III",
    cellNumber: 40,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 40. Named for the third Momochi Sandayū — the order's working alias for the operative who personally carried the Momochi triple-name discipline through the Tenshō Iga War. Hidden history: 'Sandayū III' is a permanently held cover identity; the cell rotates the identity between operatives every seventeen years so the name is never the same person twice but always the same name. The Authority's own records carry 'Sandayū' as a single 800-year-old citizen; the editor has never been able to reduce the file count below three.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_fujibayashi_yasutake",
    name: "Fujibayashi Yasutake",
    cellNumber: 41,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 41. Named for the Bansenshūkai compiler specifically (paired with Cell 4's Manuscript). Cell 41 is the order's working editor of the Manuscript — the cell that revises the un-edited Bansenshūkai when methods are added, lost, or refined. Hidden history: the cell maintains a separate four-character abbreviation system for new techniques, so the manual cannot be read in full by any one operative without the cell's annotation key. The annotation key is carried by a single Cell 41 operative at a time and has never been written down.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_fuma_kotaro",
    name: "Fūma Kotarō",
    cellNumber: 42,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 42. Named for the man Kotarō, distinct from Cell 5 (the Rappa as a body). Hidden history: the cell carries Kotarō's signature personal technique — a single-stroke ink portrait of a target's face drawn from memory after a single sighting. The cell's induction requires producing such a portrait of a stranger glimpsed in a crowd, accurate enough that two other cells can identify the stranger six months later from the portrait alone.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_suzuki_shigehide",
    name: "Suzuki Shigehide",
    cellNumber: 43,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Saika Captain"],
    domain:
      "Cell 43. Named for the Saika Ikki leader (paired with Cell 30's Ikki body). Hidden history: the cell handles the order's contracts with hostile institutions when the contract cannot be refused outright. Cell 43 has signed 119 such contracts since the Fall; in 118 the institution paid in obligations the cell later cashed in to refuse a 120th. The unpaid one is the Hierarchy of the Damned.",
    loreSource: "ninja-clan canon (this wave); apps/shared/hierarchyCanon.ts",
    additionalSources: [],
  },
  {
    id: "cell_sanada_juyushi_captain",
    name: "the Sanada Captain",
    cellNumber: 44,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["Yukimura's Hand"],
    domain:
      "Cell 44. Named for the unrecorded captain who handled the Sanada Ten Braves — the operative below Sanada Yukimura who actually coordinated Saizō and Sasuke and the other eight in the field. The historical record names ten braves and no handler; the order knows the handler existed because somebody had to schedule the work. Hidden history: Cell 44 is the order's working theory that the handler was Kunoichi Yagyū Sumigura, a name that survives in no record but appears in three independent cell oral traditions from the 17th century. Cell 44 carries her name forward.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_iga_diaspora",
    name: "the Iga Diaspora",
    cellNumber: 45,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the 1581 Survivors"],
    domain:
      "Cell 45. Named for the Iga survivors of the 1581 Tenshō Iga War — Oda Nobunaga's deliberate extermination campaign against Iga province. Hidden history: the cell maintains the order's diaspora map — every village, station, and world a 1581 survivor's line ended up in, traced forward fourteen thousand years. The map's most recent entry, dated within the current generation, is annotated 'a new diaspora is beginning under the Authority. Mark and watch.'",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_koka_garrison",
    name: "the Kōka Garrison",
    cellNumber: 46,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Mochizuki Valley Watch"],
    domain:
      "Cell 46. Named for the standing Kōga muster — the Kōka village confederation's collective defensive posture when the province was under threat. Hidden history: Cell 46 is the order's distributed defense protocol. The cell does not have a single residence; its operatives live among the other cells and activate as a single unit only when the order itself is under direct attack. Cell 46 has activated four times in canonical history; the fourth time was the Fall of the AI Empire.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_karasuma_three",
    name: "the Karasuma Three",
    cellNumber: 47,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Crow Trio"],
    domain:
      "Cell 47. Named for the Karasuma three — a famed historical scouting trio attached to the Hosokawa during the Sengoku period, distinctive for working in groups of three rather than alone. Hidden history: Cell 47 is the order's three-person reconnaissance discipline. Every operation involving more than light scouting deploys a Karasuma triad: two who watch, one who watches the watchers. The third is rotated each operation to prevent any single operative from becoming the trio's blind spot.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_six_sleeve_vigil",
    name: "the Six-Sleeve Vigil",
    cellNumber: 48,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Kunoichi Formation"],
    domain:
      "Cell 48. The order's kunoichi standing formation — six operatives in three pairs, each pair carrying half a message such that no operative can complete the message alone. Hidden history: the cell was formed in 1614 in response to a specific failure of the Mochizuki Mirror line in which a single captured walk-mikō surrendered an entire route under torture. The order's working principle ever since: no kunoichi carries a whole message. The principle has held for fourteen thousand years.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_hagakure_adjacent",
    name: "the Hagakure-Adjacent Line",
    cellNumber: 49,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Refusers' Pair"],
    domain:
      "Cell 49. Named for the four 17th-century operatives who refused both the bakufu and the shogunate at the same time — the Iga-Kōga refusers of Tokugawa stabilization. The line is sometimes confused with the Hagakure (the samurai-ethic text by Yamamoto Tsunetomo) — the order's note is that the two are 'adjacent in principle, opposite in practice.' Hidden history: the cell trains the discipline of double refusal — saying no to a power and to its rival without joining either. The order considers Adjudicar Locke's centuries-long Authority cover an applied Cell 49 doctrine.",
    loreSource: "ninja-clan canon (this wave); LORE_BIBLE.md:614-660 (Locke)",
    additionalSources: [],
  },
  {
    id: "cell_iga_refugee_kii",
    name: "the Iga-Refugee Cell of Kii",
    cellNumber: 50,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 50. Named for the Iga survivors who settled in Kii province after the 1581 war and merged tradecraft with the Saika Ikki. Hidden history: Cell 50 is the order's bridge between unarmed and firearm-armed disciplines — the cell that takes an operative trained in Cell 2 (Hattori) and qualifies them on Cell 29 (Negoro) systems, or vice versa. The cell's curriculum is the only one that bridges silent-blade and firearm work in a single twelve-month rotation.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },

  // ── Doctrinal cells & cool callsigns ───────────────────
  {
    id: "cell_first_refusal",
    name: "the First Refusal",
    cellNumber: 51,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Inner Four"],
    domain:
      "Cell 51. Named for the four of the founding twelve who knew of the assassin's act and did not stop her — the operative seed of the resistance branch (per OCULARUM_BIFURCATION). The cell is the order's elder council of refusal — when a question concerns whether to refuse, Cell 51 is the cell consulted. Hidden history: the cell has refused on the order's behalf 2,247 times since founding. The full ledger is the cell's working artifact. The most recent refusal is dated three days before this canon-wave: the Hierarchy of the Damned's offer of a non-aggression pact.",
    loreSource: "ninja-clan canon (this wave); OCULARUM_BIFURCATION (resistance branch)",
    additionalSources: [],
  },
  {
    id: "cell_indigo_cord",
    name: "the Indigo Cord",
    cellNumber: 52,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Knot-Keepers"],
    domain:
      "Cell 52. The cell that maintains the order's physical transmission medium — the indigo cord. Every cell-to-cell handoff carries a knot pattern that records which lineage transferred what to whom. Hidden history: the cord that ties the order's history is unbroken since the founding regicide — pieces are spliced in as the cord wears, but no full length has been replaced in canonical history. The original purple-clad founder's first knot is the splice-end the current cord still runs from. The Shadow Tongue cannot edit a knot; this is the principal reason the cord is the order's archive.",
    loreSource: "ninja-clan canon (this wave); OCULARUM_FOUNDING",
    additionalSources: [],
  },
  {
    id: "cell_eye_that_watches",
    name: "the Eye that Watches the Watchers",
    cellNumber: 53,
    role: "cell-member",
    branch: "reunified",
    status: "active",
    otherIdentities: ["the Mirror Cell"],
    domain:
      "Cell 53. Named for the first of the order's doctrinal triad (see OCULARUM_FOUNDING.doctrineEstablished). The cell's specific role is counter-surveillance of state surveillance — watching the watchers. Hidden history: Cell 53 maintains the order's working dossier on every active surveillance operator in New Babylon Central Control Authority below Adjudicar Locke's rank. The dossier is updated weekly. The cell has identified 142 of the Authority's working surveillance operators by name; the operators themselves do not know they are being watched in return.",
    loreSource: "ninja-clan canon (this wave); OCULARUM_FOUNDING (doctrine)",
    additionalSources: [],
  },
  {
    id: "cell_tongueless_witness",
    name: "the Tongueless Witness",
    cellNumber: 54,
    role: "cell-member",
    branch: "reunified",
    status: "active",
    otherIdentities: ["the Anti-Edit Cell"],
    domain:
      "Cell 54. The order's anti-Shadow-Tongue specialists. The cell is named for the discipline of WITNESSING without recording in a substrate the editor can ride — see one's eye and one's ear are speak with no voice. Hidden history: Cell 54 is the cell that first identified the Shadow Tongue as an editor (not a saboteur, not a virus) by reading the meta-pattern in two and a half centuries of Archives discrepancies. The cell still maintains the un-edited mirror of every record in the Archives the editor has reached. The mirror is held in memory across Cell 54's operatives in pieces of approximately fifteen documents each.",
    loreSource:
      "ninja-clan canon (this wave); OCULARUM_SHADOW_TONGUE_REDACTION; apps/shared/roomMysteries/archives.ts",
    additionalSources: [],
  },
  {
    id: "cell_silent_footstep",
    name: "the Silent Footstep",
    cellNumber: 55,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 55. The order's standing counter-surveillance discipline — the cell that teaches the half-second pause, the heel-first walk on tile, the breath patterns that defeat motion sensors and pressure plates alike. Hidden history: the cell's principal failure case is the New Babylon Centrals' floor-sensor pattern, which uses pressure variance rather than absolute pressure. Cell 55's working solution is to walk in two operatives' staggered cadence; the order has not deployed the solution operationally yet, because using it teaches the Centrals what to look for.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_half_light",
    name: "the Half-Light",
    cellNumber: 56,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Modern Kunoichi"],
    domain:
      "Cell 56. The order's modern (post-Reunification) kunoichi tradition, descended through Cell 6 (Mochizuki Mirror) and Cell 36 (Chiyome Walk) but operating under post-Fall conditions. Hidden history: the cell's induction is not skill but observation — a Cell 56 candidate must report, after three months in the world, three things they saw that no other operative in the order has seen. The order's working position is that the kunoichi discipline is fundamentally an attention discipline.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_bound_reed",
    name: "the Bound Reed",
    cellNumber: 57,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Mundane Cover"],
    domain:
      "Cell 57. The cell that trains the principle of being-mundane — the operative who is invisible by being so obviously a clerk, so obviously a porter, so obviously a fishmonger that surveillance does not register them as having been seen. Hidden history: the cell's twelve-year cover identity training program produces operatives the order calls 'reeds' — bent under the breeze of any institution, springing back unchanged after. Senne (predecessor Locke) was a Cell 57 graduate before her elevation.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_long_memory",
    name: "the Long Memory",
    cellNumber: 58,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["Tanjin's Junior"],
    domain:
      "Cell 58. The order's working oral-archive cell — the operatives who carry the pre-edit history of records the editor has reached. Cell 58 is the working junior to Old Tanjin (Cell 1); when Tanjin finally stops speaking, Cell 58 will be the order's elder memory. Hidden history: the cell rehearses its archive in a closed room every seventh day, each operative reciting one document of the pre-edit Archives from memory while another verifies against the indigo-cord-knot record of what was originally there. The room is one of three rooms in the modern order Locke has never been told the location of.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_glyph_without_a_name",
    name: "the Glyph Without a Name",
    cellNumber: 59,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Founder's Preserved Practice"],
    domain:
      "Cell 59. Named for the founding assassin's preserved practice — the order's working repository of techniques the purple-clad ninja used in the regicide chamber. Per OCULARUM_CANON_PENDING.the_purple_clad_ninja_identity the founder's personal name is canonically preserved as absent; the cell honors that absence by carrying only her practice, not her name. Hidden history: the cell still trains the specific entry-and-exit pattern recorded in the order's oldest indigo-cord knot — the founder's path into Lord Kanshi Sha's chamber and out of it. The knot has been re-tied at every Reunification anniversary.",
    loreSource: "ninja-clan canon (this wave); OCULARUM_FOUNDING",
    additionalSources: [],
  },
  {
    id: "cell_eel_walker",
    name: "the Eel-Walker",
    cellNumber: 60,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 60. Named for the operative who swam Atago's moat in 1604 to plant the first counter-witness glyph at the shrine of the Iga-Kōga compact. Hidden history: the cell still has a single artifact dated 1604 — a small dried eel skin bearing the original glyph, preserved by a method the cell will not document. The skin is taken out once a year, on the seventh night of the seventh month, and inspected for editing.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_lantern_drowned",
    name: "the Lantern-Drowned",
    cellNumber: 61,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Spotlight-Killer"],
    domain:
      "Cell 61. Named for the operative who doused the spotlight at the Sanada bridge in 1614 — letting the Ten Braves cross unseen. Hidden history: the cell's tradition is the use of darkness as a weapon. Cell 61 operatives carry a small oil-thrower capable of extinguishing a lantern at five paces without spillage. In the modern era they carry an analogue capable of blinding a single CCTV node at twenty meters for ninety seconds without leaving optical residue. The order considers Cell 61 a likely point of contact with the player during a Watcher-arc operation.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_paper_knife",
    name: "the Paper-Knife",
    cellNumber: 62,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Counterfeit Cell"],
    domain:
      "Cell 62. The order's document-counterfeiting cell — every official seal, certificate, and travel pass the order uses comes through Cell 62. Hidden history: the cell maintains working facsimiles of seven Authority seals that the Authority itself has not used since the Sundering — including the original Six Centrals' personal stamp, which the cell judges may still be operationally useful if any one of the six is found to be dead. The Authority's working assumption is that the seal has been destroyed.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_salt_reader",
    name: "the Salt-Reader",
    cellNumber: 63,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Taster Cell"],
    domain:
      "Cell 63. The order's poison-discipline — operatives whose taste and smell training allows them to identify 191 hostile compounds at sublethal exposure. Cell 63 attends every formal banquet at which Locke is seated as Adjudicar; she has not been poisoned in seven hundred attempts. Hidden history: the cell's senior taster has identified four distinct attempts on Locke's life by the Authority's internal political enemies in the last decade alone; in each case the cell rerouted the dish before Locke noticed it had been substituted.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_roof_tile_cipher",
    name: "the Roof-Tile Cipher",
    cellNumber: 64,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 64. The order's architectural-detail signal system — messages encoded in the orientation of roof tiles, the count of bricks in a course, the alignment of window shutters. Cell 64 reads cities for messages and writes messages into the cities it operates in. Hidden history: the cell has been encoding into the rebuilt sections of New Babylon since the Centrals' reconstruction program began. Roughly one in two hundred New Babylon roof tiles is positioned by a Cell 64 operative; the resulting message, read across the city, is an unbroken running commentary on the Authority's competence.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_carrier_hawk_line",
    name: "the Carrier-Hawk Line",
    cellNumber: 65,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 65. The order's living-courier cell — the cell that maintains the order's hawk-, pigeon-, and (in the modern era) drone-courier network. Hidden history: the cell still operates a single hawk-line that has been continuous since the 14th century — the bird's lineage has been bred without break, and the cell's principal hawkmaster has been the same operative across three generational handovers, each handover carrying the bird's name and feeding tradition forward.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_mute_choir",
    name: "the Mute Choir",
    cellNumber: 66,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Temple Voices"],
    domain:
      "Cell 66. The order's musical-cover discipline — operatives in cover as temple singers, courtesans, traveling musicians. Hidden history: the cell encodes data into musical performance — the order's working courier protocol for one-shot messages too sensitive for paper. The piece performed signals the message; the audience hears music; the order's intended recipient hears coordinates, names, dates. A Cell 66 operative once carried the location of a fugitive Antiquarian artifact across three Authority checkpoints by humming it.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_pebble_weaver",
    name: "the Pebble-Weaver",
    cellNumber: 67,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 67. The order's terrain-marking cell — pebbles arranged by paths, by riverbanks, in alleyways, in specific patterns the cell's operatives can read across at a glance. Hidden history: the cell is responsible for the order's safe-house signaling system. Three pebbles in a triangle outside a doorway means 'safe to approach,' four in a square means 'compromised, walk past,' a single pebble on top of a stone means 'wait, watcher inside.' The system has worked unmodified for forty generations.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_watchful_smoke",
    name: "the Watchful Smoke",
    cellNumber: 68,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Beacon Inheritance"],
    domain:
      "Cell 68. The order's signal-fire and now signal-light network. Cell 68 maintains beacon positions across Ark and the trade circuit; activation patterns convey order-wide alerts. Hidden history: the cell's original beacon grammar was written down once in 1499 by an over-eager Cell 68 junior; the manuscript was destroyed by Cell 24 (Gikan Mirror-Justice) within the year and the cell's grammar has been oral-only since. The cell has never produced a written grammar since.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_three_stitched_sleeve",
    name: "the Three-Stitched Sleeve",
    cellNumber: 69,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: [],
    domain:
      "Cell 69. The order's discrete uniform marker — three short stitches in a specific corner of the inner sleeve, identifying a Cell 69 operative to other cells at a glance. Hidden history: the stitch pattern has been imitated by hostile services twice in canonical history; in both cases the imitating operative misread the count (four stitches in one case, three but at the wrong corner in the other) and the order identified them on first contact. The Authority has not yet attempted the imitation.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_heron_watch",
    name: "the Heron-Watch",
    cellNumber: 70,
    role: "cell-member",
    branch: "resistance",
    status: "active",
    otherIdentities: ["the Wading Cell"],
    domain:
      "Cell 70. The order's water-discipline cell — wading reconnaissance, swimming infiltration, immersion-cover. Hidden history: Cell 70 trains its operatives to stand motionless in waist-deep water for up to four hours without ripple — the heron-watch. The cell once held a position under a footbridge for the entire night of the Atago-shrine compact swearing (Cell 7), so the founders could meet without the bridge being watched. The position is re-occupied symbolically by Cell 70 every seven years on the compact anniversary.",
    loreSource: "ninja-clan canon (this wave)",
    additionalSources: [],
  },
  {
    id: "cell_indigo_door",
    name: "the Indigo Door",
    cellNumber: 71,
    role: "cell-member",
    branch: "reunified",
    status: "active",
    otherIdentities: ["the Cover-Forgers"],
    domain:
      "Cell 71. The cell that handed Adjudicar Locke her cover credentials — the New Babylon Central Control Authority appointment as Special Case Manager. Hidden history: Cell 71 forged every document of Locke's eleven-thousand-year cross-factional career, from AI Empire surveillance-coordinator credentials through Insurgency callsign assignments to the Authority appointment. The cell's working policy is that an operative in deep cover has at most one originating document the cell did not produce; for Locke that document is canonically lost and was, per canon-pending notes, never written down to begin with.",
    loreSource:
      "ninja-clan canon (this wave); LORE_BIBLE.md:614-660 (Locke); apps/shared/npcs/bibles/adjudicator_locke.md",
    additionalSources: [],
  },

  // Cells 72..98, 100..699 are SHADOW-TONGUE REDACTED — see
  // ocularumCellRedactions.ts. Cell 99 (Mira) and Cell 700
  // (Seventh Whisper) and Cell 1 (Tanjin) are above.
  ...SHADOW_TONGUE_REDACTED_CELLS,
] satisfies readonly OcularumMemberEntry[];

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
