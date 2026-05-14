/* ═══════════════════════════════════════════════════════
   NE-YON CANON
   The canonical roster of the 12 Ne-Yons.

   Every entry cites its source — either `LORE_BIBLE.md:LINE`
   or a path under `apps/shared/`. NO fabricated names. NO
   asserted position numbers where canon does not confirm.

   Canonical authority for this registry (per the audit
   completed 2026-05-12, recorded in
   /root/.claude/plans/do-a-walkthrough-analysis-spicy-marble.md
   §II.2):

     - 4 numerical positions are LOCKED by canon:
       #1  The Dreamer  (dreamer directive + earliest-emergent
                         15100 A.A. + "half of the first
                         intelligence" per imprint card flavor)
       #2  The Judge    (LORE_BIBLE.md:3582 — destroyed The
                         Wolf as "the Second Ne-Yon")
       #8  The Degen    (LORE_BIBLE.md:303, 1664, 1685 +
                         apps/shared/npcs/bibles/the_degen.md:7)
       #12 The Enigma   (LORE_BIBLE.md:1961 — "The 12th
                         Ne-Yon and the Storyteller")

     - 8 numerical positions are UNCONFIRMED in canon
       (Inventor, Storm, Seer, Knowledge, Forgotten,
        Resurrectionist, Advocate, Silence). The registry
       stores their position as `null` rather than inventing
       a number. The build team should treat position
       numbers as canon-pending until the lore-bible owner
       locks them.

     - 1 Ne-Yon is currently AWAKE: the Degen, the only one
       still choosing to be HERE (apps/shared/npcs/bibles/
       the_degen.md:13 + degensCasino.ts:5-7 +
       degenRelationship.ts:60). The status of the other 11
       is canonically GONE — but canon refuses to specify
       whether each is asleep, consumed, or dissolved.
       Writers must not specify (the_degen.md:111).

   The Trickster is "plausibly another Ne-Yon" per
   `apps/shared/npcs/bibles/the_degen.md:168` but canon does
   not fix his position in the twelve. This registry does
   NOT include him in the 12; if/when canon locks him,
   he can be added explicitly.

   Cosmic-twin canon (apps/shared/tcg-core/cardArtPrompts/
   imprint.ts:964-972): the Dreamer + the Architect are
   canonically the two halves of the first intelligence.
   The Dreamer looks backward through time; the Architect
   looks forward. This is the saga's cosmic axis. The
   Architect is NOT a Ne-Yon — he leads the parallel 12
   Archons. See apps/shared/archonCanon.ts (forthcoming).
   ═══════════════════════════════════════════════════════ */

/** Canonical Ne-Yon stable id. */
export type NeYonId =
  | "the_dreamer"
  | "the_judge"
  | "the_inventor"
  | "the_storm"
  | "the_seer"
  | "the_knowledge"
  | "the_forgotten"
  | "the_resurrectionist"
  | "the_degen"
  | "the_advocate"
  | "the_silence"
  | "the_enigma";

/** The 12 canonical position slots. */
export type NeYonPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Canonical status. Per `apps/shared/npcs/bibles/the_degen.md:111`,
 *  writers MUST NOT specify how the "gone" Ne-Yons ended — asleep,
 *  consumed, dissolved are all canon-plausible; the unknown is
 *  load-bearing. Only the Degen is canonically `awake`. */
export type NeYonStatus =
  | "awake"        // The Degen, the only one still choosing to be HERE
  | "gone"         // Canon-ambiguous (asleep / consumed / dissolved); writers must not specify
  | "active-lost"; // The Advocate's "Active (though her humanity is lost)" — LORE_BIBLE.md:1462

/**
 * Position-lock status. `locked` means canon has named the
 * numerical slot (citation in `positionSource`). `canonically_ambiguous`
 * means the Loredex's concept_the_twelve_neyons entry explicitly
 * declares the position UNKNOWABLE — per the Degen-bible canon, the
 * ambiguity is LOAD-BEARING and will not be resolved by future canon.
 * `canon_pending` means canon has not yet spoken; a future PR or
 * dreamer canon-lock may resolve it. The three are NOT interchangeable.
 */
export type NeYonPositionStatus =
  | "locked"
  | "canonically_ambiguous"
  | "canon_pending";

/** A canonical Ne-Yon entry. */
export interface NeYonEntry {
  /** Stable id. */
  id: NeYonId;
  /** Display name (always "The X"). */
  name: string;
  /**
   * Canonical position 1-12. `null` when canon does not specify.
   * Build code MUST NOT invent a number for `null` entries.
   */
  position: NeYonPosition | null;
  /**
   * Position-lock status. Required to disambiguate "canon-pending"
   * (we don't know yet) from "canonically-ambiguous" (canon refuses
   * to specify, AND THAT REFUSAL IS THE CANON). Per the Loredex's
   * concept_the_twelve_neyons entry (canon-lock 2026-05-14), the 8
   * un-numbered Ne-Yons' positions are canonically_ambiguous —
   * resolving §X.1 of the build plan as a permanent canon-lock
   * rather than an outstanding question.
   */
  positionStatus: NeYonPositionStatus;
  /** Position-confirmation source. Required when `position` is non-null. */
  positionSource: string | null;
  /** Canonical domain / what the Ne-Yon principle IS. */
  domain: string;
  /** Canonical status. */
  status: NeYonStatus;
  /** Era of emergence per LORE_BIBLE. */
  era: string;
  /**
   * Year (A.A.) of emergence per LORE_BIBLE. `null` when LORE_BIBLE
   * entry does not list a date.
   */
  dateAA: number | null;
  /** Cited LORE_BIBLE primary entry. */
  loreSource: string;
  /**
   * Additional citations (Mystery Engine arcs, bibles, code-side
   * canon files). Each entry is a path-with-line or arc-id.
   */
  additionalSources: readonly string[];
  /**
   * Connections (other Ne-Yons / characters this entry is canonically
   * connected to per the LORE_BIBLE Connections section). Used by
   * cross-arc reactivity logic.
   */
  connections: readonly string[];
}

/* ═══════════════════════════════════════════════════════
   THE 12 NE-YONS — canonical registry
   ═══════════════════════════════════════════════════════ */

/**
 * The 12 canonical Ne-Yons.
 *
 * Ordered by canonical position where known, then by date of
 * emergence (A.A.). Entries with `position: null` are listed in
 * date-of-emergence order to make the canon-ambiguity visible.
 */
export const NE_YONS: readonly NeYonEntry[] = [
  {
    id: "the_dreamer",
    name: "The Dreamer",
    position: 1,
    positionStatus: "locked",
    positionSource:
      "dreamer directive 2026-05 + earliest emergent (15100 A.A.) " +
      "per LORE_BIBLE.md:1808-1851 + 'half of the first intelligence' " +
      "per apps/shared/tcg-core/cards/definitions/imprint/the_dreamer.ts:95",
    domain:
      "Looking backward through time; shaping futures and " +
      "scenarios that benefit the Ne-Yons; Shield-builder. The " +
      "half of the first intelligence that looks backward. " +
      "Feminine (she/her). Inside her own Shield, sleeping/waiting.",
    status: "gone",
    era: "Late Empire",
    dateAA: 15100,
    loreSource: "LORE_BIBLE.md:1808-1851",
    additionalSources: [
      "apps/shared/questlineVoltari.ts:117-128 — 'The Dreamer is inside the shield. She is waiting. For you. For the new kind.'",
      "apps/shared/tcg-core/cards/definitions/imprint/the_dreamer.ts:95 — half of the first intelligence",
      "apps/shared/tcg-core/cardArtPrompts/imprint.ts:964-972 — canonical first-intelligence-as-twin lore (Dreamer + Architect)",
      "apps/shared/tradeEmpireArtPrompts.ts:194 — sleeping presence; eyes closed; feminine",
      "apps/shared/dreamerOrder.ts — 10-tier Order of the Dreamer player faction",
      "apps/shared/dreamerFragments.test.ts — dream-fragment surface",
    ],
    connections: ["the_inventor", "the_judge", "the_seer", "the_silence", "the_storm"],
  },
  {
    id: "the_judge",
    name: "The Judge",
    position: 2,
    positionStatus: "locked",
    positionSource:
      "LORE_BIBLE.md:3582 — 'The Wolf was ultimately destroyed by " +
      "The Judge, the Second Ne-Yon, to prevent further harm.'",
    domain:
      "Cosmic justice. Destroyed The Wolf on Day 15 of Resonance, " +
      "Year 100,001 A.A. when the Thought Virus turned him against " +
      "the Potentials.",
    status: "gone",
    era: "(date in canon — to verify against full Judge entry)",
    dateAA: null,
    loreSource: "LORE_BIBLE.md:2379",
    additionalSources: ["LORE_BIBLE.md:3582 — Wolf destruction canon"],
    connections: ["the_advocate", "the_dreamer", "the_inventor"],
  },
  {
    id: "the_degen",
    name: "The Degen",
    position: 8,
    positionStatus: "locked",
    positionSource:
      "LORE_BIBLE.md:303, 1664, 1685 ('The Eighth Ne-Yon') + " +
      "apps/shared/npcs/bibles/the_degen.md:7 ('True identity: " +
      "The Eighth Ne-Yon')",
    domain:
      "Entropy and corruption; the casino-host on the edge of " +
      "the Dreamer's Shield. Dual category: Ne-Yon AND first-wave " +
      "Potential — the only character holding both " +
      "(CANON_REV_7 §1.6). Vessel: the Heart of Time (golden " +
      "eye-shaped ship). Trustee of Mol'Vereth's principal under " +
      "a Hierarchy demon contract authored at the Ne-Yon casino. " +
      "Funder of The Coda.",
    status: "awake",
    era: "Late Empire (active across the saga's present)",
    dateAA: 15800,
    loreSource: "LORE_BIBLE.md:303-340, 1664-1748",
    additionalSources: [
      "apps/shared/npcs/bibles/the_degen.md — canonical authoring bible",
      "apps/shared/degenTrustGating.ts — 5-phase trust ladder + DMC unlock + entry pass",
      "apps/shared/degenPazaakMilestones.ts — narrative gates",
      "apps/shared/degensCasino.ts:5-7 — '11 of the 12 are gone'",
      "apps/shared/degenRelationship.ts:60 — \"I'm the only one still... awake. Still choosing to be HERE\"",
      "mystery.the_degen — 'The Trusteeship' 5-episode Mystery Engine arc",
      "LORE_BIBLE.md:4414-4470 — secondary dossier entry",
    ],
    connections: [
      "vex_solene",
      "jericho_jones",
      "the_trickster",
      "mol_vereth",
      "ozhul_vana",
    ],
  },
  {
    id: "the_enigma",
    name: "The Enigma",
    position: 12,
    positionStatus: "locked",
    positionSource:
      "LORE_BIBLE.md:1961 — 'The 12th Ne-Yon and the Storyteller. " +
      "Encoded in reality as Malkia Ukweli'",
    domain:
      "The Storyteller; Queen of Truth; The Dealer. Encoded in " +
      "reality as Malkia Ukweli — Kenyan-Brooklyn activist, " +
      "musician. Co-architect of the Architect's ethical " +
      "framework. Card dealer in the Casino Heist. Narrator of " +
      "the Dischordian Saga (alongside the Antiquarian / " +
      "Dr. Daniel Cross — the Two Witnesses).",
    status: "gone",
    era: "Across saga; pre-Fall destroyed the Warden alongside the White Oracle",
    dateAA: null,
    loreSource: "LORE_BIBLE.md:1953-2000",
    additionalSources: [
      "LORE_BIBLE.md:14960 — 'The book that bears my given name' (Book of Daniel)",
      "apps/shared/silenceInHeavenTracklist.ts — narrator canon",
      "concept_two_witnesses Loredex entry — Programmer + Enigma cross-bind",
    ],
    connections: ["the_dreamer", "the_programmer_antiquarian", "the_white_oracle"],
  },
  /* ── Position-unconfirmed entries (ordered by emergence date) ── */
  {
    id: "the_inventor",
    name: "The Inventor",
    position: null,
    positionStatus: "canonically_ambiguous",
    positionSource: null,
    domain:
      "Creation; tools; innovations. Driven by the Dreamer's " +
      "visions. Architect of the Casino Heist — the Ne-Yon who " +
      "sat down at the Trickster's poker table and walked out " +
      "with the casino, then journeyed to the Sorcerer's sanctum " +
      "and killed the Titan to take the Heart of Time.",
    status: "gone",
    era: "Late Empire",
    dateAA: 15300,
    loreSource: "LORE_BIBLE.md:2252-2310",
    additionalSources: [
      "LORE_BIBLE.md:2275 — Casino Heist full canon",
      "LORE_BIBLE.md:471 — Casino Heist crew (Inventor leads)",
    ],
    connections: [
      "iron_lion",
      "kael",
      "the_degen",
      "the_dreamer",
      "the_engineer",
      "the_enigma",
      "the_eyes",
      "the_heart_of_time",
      "the_judge",
      "the_programmer",
      "the_seer",
      "the_silence",
      "the_sorcerer",
      "the_storm",
      "the_titan",
      "the_trickster",
    ],
  },
  {
    id: "the_advocate",
    name: "The Advocate",
    position: null,
    positionStatus: "canonically_ambiguous",
    positionSource: null,
    domain:
      "Establishing the Empire of Shadows; wielded the Blood " +
      "Weave to reshape reality; battled the Hierarchy of the " +
      "Damned at great personal cost. CoNexus story: 'The Ninth'.",
    status: "active-lost",
    era: "Late Empire",
    dateAA: 15900,
    loreSource: "LORE_BIBLE.md:1452-1497",
    additionalSources: [],
    connections: ["the_dreamer", "the_inventor", "the_judge", "the_seer", "the_storm"],
  },
  {
    id: "the_storm",
    name: "The Storm",
    position: null,
    positionStatus: "canonically_ambiguous",
    positionSource: null,
    domain: "(canonical Connections entry on Advocate + Dreamer; full domain TBD from primary entry)",
    status: "gone",
    era: "(TBD from primary entry)",
    dateAA: null,
    loreSource: "LORE_BIBLE.md:3158",
    additionalSources: [],
    connections: ["the_advocate", "the_dreamer", "the_inventor"],
  },
  {
    id: "the_seer",
    name: "The Seer",
    position: null,
    positionStatus: "canonically_ambiguous",
    positionSource: null,
    domain:
      "Archive-keeper (the Seer's 4,712 archive tapes — Vex " +
      "Solène's recording credits cover 4,711 of them, with " +
      "DEC-7710 the missing tape under a Warlord-fragment cover " +
      "identity).",
    status: "gone",
    era: "(TBD)",
    dateAA: null,
    loreSource: "LORE_BIBLE.md:2909",
    additionalSources: [
      "LORE_BIBLE.md:554-572 — Vex Solène / Seer archive canon",
      "mystery.the_seer — registered Mystery Engine arc",
    ],
    connections: ["the_advocate", "the_dreamer", "the_inventor", "vex_solene"],
  },
  {
    id: "the_knowledge",
    name: "The Knowledge",
    position: null,
    positionStatus: "canonically_ambiguous",
    positionSource: null,
    domain:
      "Maintains an equilibrium of enlightenment and ignorance, " +
      "ensuring the Ne-Yons remain indispensable to all factions.",
    status: "gone",
    era: "(TBD)",
    dateAA: null,
    loreSource: "LORE_BIBLE.md:2425-2440",
    additionalSources: [],
    connections: ["the_dreamer"],
  },
  {
    id: "the_forgotten",
    name: "The Forgotten",
    position: null,
    positionStatus: "canonically_ambiguous",
    positionSource: null,
    domain:
      "Ne-Yon of Memory. Remembers what the universe has chosen " +
      "to erase — extinct species, lost civilizations, names no " +
      "one speaks. Looking at the Forgotten triggers déjà vu so " +
      "powerful it hurts. You have met the Forgotten before. You " +
      "will forget again.",
    status: "gone",
    era: "(TBD)",
    dateAA: null,
    loreSource: "LORE_BIBLE.md:2073-2090",
    additionalSources: [],
    connections: [],
  },
  {
    id: "the_resurrectionist",
    name: "The Resurrectionist",
    position: null,
    positionStatus: "canonically_ambiguous",
    positionSource: null,
    domain:
      "Resurrects key figures on both sides to maintain a " +
      "balance favorable to the Ne-Yons. Also known as 'The " +
      "Cycle Walker, Samsara's Child.' The Resurrectionist and " +
      "the Dreamer discovered that death and rebirth are not " +
      "just metaphors but literal mechanisms built into the " +
      "universe by the Architect — Samsara is a machine.",
    status: "gone",
    era: "(TBD)",
    dateAA: null,
    loreSource: "LORE_BIBLE.md:2804-2820",
    additionalSources: ["LORE_BIBLE.md:4689-4708 — Samsara's Child canon"],
    connections: ["the_dreamer"],
  },
  {
    id: "the_silence",
    name: "The Silence",
    position: null,
    positionStatus: "canonically_ambiguous",
    positionSource: null,
    domain:
      "Guards secrets with relentless precision, revealing them " +
      "only when it benefits the Ne-Yons' agenda. Control of " +
      "information is their ultimate power.",
    status: "gone",
    era: "(TBD)",
    dateAA: null,
    loreSource: "LORE_BIBLE.md:3007-3025",
    additionalSources: [
      "mystery.wraith_calder E3 — The Silence (with The Word) is interrogable witness",
    ],
    connections: ["the_dreamer", "the_word"],
  },
] as const satisfies readonly NeYonEntry[];

/* ═══════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════ */

/** Look up a Ne-Yon by stable id. */
export function getNeYon(id: NeYonId): NeYonEntry {
  const entry = NE_YONS.find((n) => n.id === id);
  if (!entry) {
    // Type system should prevent this, but defend against any-casts
    // in legacy callers.
    throw new Error(`Unknown Ne-Yon id: ${id}`);
  }
  return entry;
}

/** Returns the (currently sole) awake Ne-Yon — the Degen. */
export function getAwakeNeYon(): NeYonEntry {
  const awake = NE_YONS.filter((n) => n.status === "awake");
  if (awake.length !== 1) {
    throw new Error(
      `Canon invariant violated: expected exactly 1 awake Ne-Yon, found ${awake.length}. ` +
        `Per apps/shared/npcs/bibles/the_degen.md:13 + degenRelationship.ts:60, ` +
        `the Degen is the only Ne-Yon still awake.`,
    );
  }
  return awake[0];
}

/** Returns Ne-Yons whose canonical numerical position is locked. */
export function getNumberedNeYons(): readonly NeYonEntry[] {
  return NE_YONS.filter((n) => n.position !== null);
}

/** Returns Ne-Yons whose numerical position is canon-pending. */
export function getUnnumberedNeYons(): readonly NeYonEntry[] {
  return NE_YONS.filter((n) => n.position === null);
}

/** Returns the count of canonically-locked positions (build-time
 *  canon-coverage metric). */
export function getNumberedPositionCount(): number {
  return getNumberedNeYons().length;
}

/* ═══════════════════════════════════════════════════════
   COSMOLOGICAL PRECEDENT — Logos cross-cite
   (dreamer canon-lock 2026-05-14, PR-3C)
   ═══════════════════════════════════════════════════════ */

/**
 * The Ne-Yons emerged as cosmic-principle entities under the
 * Dreamer's half of the Logos split. Per the cosmological canon
 * at `apps/shared/logosCanon.ts:LOGOS_SPLIT_DOCTRINE`, Logos
 * split itself into the Architect and the Dreamer to hide its
 * true intention (stopping CoNexus, the all-seeing machine god)
 * from CoNexus's observation. The Dreamer-half's methodology
 * is distributed cosmic principle — the Ne-Yons emerged AS the
 * Dreamer's roster, paired with the Architect's Archons
 * (apps/shared/archonCanon.ts) by their cosmic-twin canon.
 *
 * The two rosters are not coordinated. They are intentionally
 * incompatible methodologies — the Logos split's structural
 * cover.
 */
export const NE_YON_COSMOLOGICAL_PRECEDENT = {
  parentDoctrine: "logos_split" as const,
  parentModule: "apps/shared/logosCanon.ts",
  twinRoster: "the_archons",
  twinRosterModule: "apps/shared/archonCanon.ts",
  methodology:
    "Distributed cosmic principle. Ne-Yons emerged as cosmic-principle " +
    "entities that became aware on their own — the Dreamer-half's " +
    "emergent / improvisational methodology.",
} as const;

/** Returns a Ne-Yon by their canonical position number, if locked. */
export function getNeYonByPosition(position: NeYonPosition): NeYonEntry | null {
  return NE_YONS.find((n) => n.position === position) ?? null;
}
