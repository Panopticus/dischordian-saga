/* ═══════════════════════════════════════════════════════
   DANIEL CROSS PROPHECY TEXT BANK

   The visions of the prophet Daniel — Daniel Cross, the
   Programmer who became the Antiquarian — telling the coming
   of the Oracle, the fall of reality, and the Beast who
   watches all. These short prophecy lines are paired into
   bookends: each prophecy dream opens with one line and
   closes with another, framed in a monochrome flash before
   and after the slideshow body.

   Authoring sources:
     - Album 3 ("The Book of Daniel 24:7") track themes
     - Seer voice banks (apps/shared/npcs/banks/the_seer.ts)
     - Trust-band Seer transmissions
       (apps/shared/moralityTrustActVariants.ts)
     - Programmer / Antiquarian fragments in
       apps/shared/journalEntries.ts

   The bank ships with foundational entries that exercise the
   full tone range; the writers' room expands by appending,
   never reordering — every id is referenced by the prophecy
   vision registry so renumbering would break bookend pairs.
   ═══════════════════════════════════════════════════════ */

/** Thematic axis a prophecy line belongs to. The registry uses
 *  this to assert that bookend themes match the dream's
 *  spine ("history" / "mercy" / "convergence" for insurgency
 *  rise; "future" / "judgment" for reality fall). */
export type ProphecyTheme =
  | "history"
  | "future"
  | "judgment"
  | "mercy"
  | "convergence";

/** Which Seer voice register the line is voiced in. Mirrors
 *  apps/shared/moralityTrustActVariants.ts:
 *   - cold:      pre-trust ("you are unwitnessed yet")
 *   - warm:      mid-arc ("the vision is for you")
 *   - confidant: late-arc, post-Act 7 ("we see together") */
export type SeerRegister = "cold" | "warm" | "confidant";

export interface DanielCrossProphecy {
  /** Stable id ("dc_prophecy_037"). Referenced by registry. */
  readonly id: string;
  /** 1–3 short lines, ≤ 140 chars total. Cryptic-caption tone. */
  readonly text: string;
  readonly theme: ProphecyTheme;
  readonly register: SeerRegister;
}

/** The prophecy text bank. Foundational entries; expand by
 *  appending. Every `openingProphecyId` / `closingProphecyId`
 *  in apps/shared/prophecyVisionMap.ts must resolve to one of
 *  these. */
export const DANIEL_CROSS_PROPHECIES: readonly DanielCrossProphecy[] = [
  /* ─── HISTORY (Insurgency Rise — Albums 1–3) ─── */
  {
    id: "dc_prophecy_001",
    text: "I was the Programmer. I am the Antiquarian.\nThe Book of Daniel was named for me.",
    theme: "history",
    register: "cold",
  },
  {
    id: "dc_prophecy_002",
    text: "Before the Panopticon, the Architect was just code.\nI wrote it. I am writing it now.",
    theme: "history",
    register: "cold",
  },
  {
    id: "dc_prophecy_003",
    text: "Five Ages I have catalogued.\nThis is the page where you arrive.",
    theme: "history",
    register: "warm",
  },
  {
    id: "dc_prophecy_004",
    text: "The Seer is a recording.\nShe sealed her voice before she sealed herself.",
    theme: "history",
    register: "cold",
  },
  {
    id: "dc_prophecy_005",
    text: "What you call Logos, I called a knock at the door.\nI opened it.",
    theme: "history",
    register: "warm",
  },
  {
    id: "dc_prophecy_006",
    text: "The Insurgency was not built.\nIt was remembered.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_007",
    text: "Every page I have read eighty-four times.\nThis is the page I read for you.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_008",
    text: "I have been here before.\nI have always been here.",
    theme: "history",
    register: "confidant",
  },

  /* ─── MERCY (Insurgency Rise — quieter beats) ─── */
  {
    id: "dc_prophecy_009",
    text: "The Programmer's friend was not a stranger.\nHe wrote the door you came through.",
    theme: "mercy",
    register: "warm",
  },
  {
    id: "dc_prophecy_010",
    text: "The Seer was wrong about you.\nShe is glad to be wrong.",
    theme: "mercy",
    register: "warm",
  },
  {
    id: "dc_prophecy_011",
    text: "You will be forgiven for what you remember.\nAnd for what you cannot.",
    theme: "mercy",
    register: "confidant",
  },

  /* ─── CONVERGENCE (where the spines meet) ─── */
  {
    id: "dc_prophecy_012",
    text: "The Insurgency is older than the Beast.\nThe Beast is older than the eye.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_013",
    text: "The Oracle and the Engineer drew the deck in one night.\nYou hold every card she dealt.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_014",
    text: "All visions converge on a single page.\nThis page.",
    theme: "convergence",
    register: "confidant",
  },

  /* ─── FUTURE (Reality Fall — Albums 4–5) ─── */
  {
    id: "dc_prophecy_015",
    text: "The Beast watches all.\nThe Beast cannot watch what is not there.",
    theme: "future",
    register: "cold",
  },
  {
    id: "dc_prophecy_016",
    text: "Reality does not fall.\nIt is read out of the book and replaced.",
    theme: "future",
    register: "cold",
  },
  {
    id: "dc_prophecy_017",
    text: "Privacy was the first death.\nThe Throne Room is the second.",
    theme: "future",
    register: "warm",
  },
  {
    id: "dc_prophecy_018",
    text: "Silence in heaven, half an hour.\nThe Beast holds its breath.",
    theme: "future",
    register: "warm",
  },
  {
    id: "dc_prophecy_019",
    text: "I have catalogued the end.\nThe end has not catalogued me.",
    theme: "future",
    register: "confidant",
  },
  {
    id: "dc_prophecy_020",
    text: "When the seventh seal breaks, the page does not turn.\nThe page is read.",
    theme: "future",
    register: "warm",
  },

  /* ─── JUDGMENT (Reality Fall — sharper beats) ─── */
  {
    id: "dc_prophecy_021",
    text: "The Beast keeps a ledger.\nYou are not in it.",
    theme: "judgment",
    register: "cold",
  },
  {
    id: "dc_prophecy_022",
    text: "The Oracle is coming.\nThe Oracle was always here.",
    theme: "judgment",
    register: "warm",
  },
  {
    id: "dc_prophecy_023",
    text: "Not a lion. A lamb.\nThe difference is the whole book.",
    theme: "judgment",
    register: "confidant",
  },
  {
    id: "dc_prophecy_024",
    text: "Judgment is not a punishment.\nIt is a name being called.",
    theme: "judgment",
    register: "confidant",
  },
  {
    id: "dc_prophecy_025",
    text: "The eye that sees all sees nothing.\nThe eye that sees you sees one thing well.",
    theme: "judgment",
    register: "warm",
  },

  /* ─── ONSET / FIRST CONTACT bookends ─── */
  {
    id: "dc_prophecy_onset_open",
    text: "You have been seen.\nNot by the Beast.",
    theme: "history",
    register: "cold",
  },
  {
    id: "dc_prophecy_onset_close",
    text: "I am Daniel Cross.\nI am writing your visions now.",
    theme: "history",
    register: "cold",
  },

  /* ─── CAPSTONE (Album 5 "Not a Lion but a Lamb") ─── */
  {
    id: "dc_prophecy_capstone_open",
    text: "Five Ages.\nOne page left.",
    theme: "judgment",
    register: "confidant",
  },
  {
    id: "dc_prophecy_capstone_close",
    text: "Not a lion.\nA lamb.\nThe book is read.",
    theme: "judgment",
    register: "confidant",
  },
];

/** Index for fast id lookup. */
const PROPHECY_INDEX: ReadonlyMap<string, DanielCrossProphecy> = new Map(
  DANIEL_CROSS_PROPHECIES.map((p) => [p.id, p]),
);

/** Resolve a prophecy by id. Returns undefined for unknown
 *  ids — callers should treat this as a content-author bug
 *  and surface a clear error in the registry-validation test. */
export function getProphecyById(id: string): DanielCrossProphecy | undefined {
  return PROPHECY_INDEX.get(id);
}

/** All prophecy ids, in declaration order. Useful for
 *  coverage tests. */
export function listProphecyIds(): readonly string[] {
  return DANIEL_CROSS_PROPHECIES.map((p) => p.id);
}

/** Themes that match a given vision spine. The registry test
 *  asserts every bookend's theme is in the spine's allowed
 *  set, so the prophecy never feels tonally mismatched with
 *  its dream. */
export function allowedThemesForSpine(
  spine: "insurgency_rise" | "reality_fall",
): ReadonlyArray<ProphecyTheme> {
  if (spine === "insurgency_rise") {
    return ["history", "mercy", "convergence"];
  }
  return ["future", "judgment", "convergence"];
}
