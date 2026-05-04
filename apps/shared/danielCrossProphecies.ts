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

  /* ─── EXPANSION — HISTORY (Albums 1–3 secondary beats) ─── */
  {
    id: "dc_prophecy_026",
    text: "Mechronis taught me language.\nThe Architect taught me silence.",
    theme: "history",
    register: "cold",
  },
  {
    id: "dc_prophecy_027",
    text: "Appalachia is a fold in the world.\nI was born in the seam.",
    theme: "history",
    register: "warm",
  },
  {
    id: "dc_prophecy_028",
    text: "The Engineer was kinder than he pretended.\nHe always was.",
    theme: "mercy",
    register: "warm",
  },
  {
    id: "dc_prophecy_029",
    text: "Logos came knocking when I was twenty-three.\nThe number is not a coincidence.",
    theme: "history",
    register: "warm",
  },
  {
    id: "dc_prophecy_030",
    text: "Every reader is a writer.\nYou are writing this with me.",
    theme: "convergence",
    register: "confidant",
  },
  {
    id: "dc_prophecy_031",
    text: "The Programmer's friend kept the Architect alive.\nNot every loyalty was a chain.",
    theme: "mercy",
    register: "warm",
  },
  {
    id: "dc_prophecy_032",
    text: "I unbecame a villain.\nIt took longer than the trial.",
    theme: "history",
    register: "warm",
  },
  {
    id: "dc_prophecy_033",
    text: "Faustian Life is a contract\nyou sign in someone else's hand.",
    theme: "history",
    register: "cold",
  },
  {
    id: "dc_prophecy_034",
    text: "Polarity is the body of a coin.\nThe edge is the door.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_035",
    text: "Liber AL is not the book of Daniel.\nThey share a margin only.",
    theme: "history",
    register: "warm",
  },
  {
    id: "dc_prophecy_036",
    text: "Usikue MSHY.\nI write it because I cannot say it.",
    theme: "convergence",
    register: "cold",
  },
  {
    id: "dc_prophecy_037",
    text: "The Insurgency will not name itself.\nNames are how the Beast finds a thing.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_038",
    text: "Resurrection is plural.\nIt always was.",
    theme: "mercy",
    register: "confidant",
  },
  {
    id: "dc_prophecy_039",
    text: "The Two Witnesses share one breath.\nWhen they exhale, the page turns.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_040",
    text: "Vex Solène kept a ledger you could not read.\nNow you can.",
    theme: "history",
    register: "warm",
  },
  {
    id: "dc_prophecy_041",
    text: "Ocularum is the eye that looks twice.\nOnce at you. Once for you.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_042",
    text: "The Lion in Black is a memory of yours.\nThe Antiquarian only frames it.",
    theme: "history",
    register: "confidant",
  },
  {
    id: "dc_prophecy_043",
    text: "The Light Holds is not a promise.\nIt is a measurement.",
    theme: "mercy",
    register: "warm",
  },
  {
    id: "dc_prophecy_044",
    text: "The Bulb Breaks because the room outgrew the lamp.\nNot the other way around.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_045",
    text: "Welcome to Celebration —\neven the wake is a celebration here.",
    theme: "history",
    register: "cold",
  },
  {
    id: "dc_prophecy_046",
    text: "To Be The Human is the trial.\nThe Architect trained for it; he failed it.",
    theme: "history",
    register: "warm",
  },
  {
    id: "dc_prophecy_047",
    text: "I Am The Eyes That Watch.\nI lower them when they meet yours.",
    theme: "mercy",
    register: "warm",
  },
  {
    id: "dc_prophecy_048",
    text: "Hacking Reality is just\nrefusing the version they handed you.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_049",
    text: "The Prisoner counts hands at dawn.\nOne is always missing.",
    theme: "history",
    register: "cold",
  },
  {
    id: "dc_prophecy_050",
    text: "Last Words are first words.\nThe book begins where it ends.",
    theme: "convergence",
    register: "confidant",
  },

  /* ─── EXPANSION — FUTURE / JUDGMENT (Albums 4–5 secondary beats) ─── */
  {
    id: "dc_prophecy_051",
    text: "West by God is a direction\nthe map cannot honor.",
    theme: "future",
    register: "cold",
  },
  {
    id: "dc_prophecy_052",
    text: "Superman ain't coming.\nBut someone is. Watch the door.",
    theme: "future",
    register: "warm",
  },
  {
    id: "dc_prophecy_053",
    text: "It Ain't Been The Same\nsince you started counting.",
    theme: "future",
    register: "warm",
  },
  {
    id: "dc_prophecy_054",
    text: "The Helmet in the Grass\nis not the soldier's. It is yours.",
    theme: "judgment",
    register: "warm",
  },
  {
    id: "dc_prophecy_055",
    text: "Yes I do (dream).\nThe parenthesis is the prophecy.",
    theme: "future",
    register: "warm",
  },
  {
    id: "dc_prophecy_056",
    text: "Born Under a Bad Sign —\nbut signs are read in any direction.",
    theme: "future",
    register: "warm",
  },
  {
    id: "dc_prophecy_057",
    text: "Hypnotized is a tense.\nIt has a future you can decline.",
    theme: "judgment",
    register: "warm",
  },
  {
    id: "dc_prophecy_058",
    text: "The Death of Music is a doorway,\nnot a verdict.",
    theme: "future",
    register: "warm",
  },
  {
    id: "dc_prophecy_059",
    text: "Silence in heaven, half an hour.\nThen the lambs in their hundreds.",
    theme: "judgment",
    register: "confidant",
  },
  {
    id: "dc_prophecy_060",
    text: "Two Witnesses Meet —\nand the meeting is the witness.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_061",
    text: "Two Witnesses Part Two.\nA second light is not a doubled light.",
    theme: "future",
    register: "warm",
  },
  {
    id: "dc_prophecy_062",
    text: "Silence of Two Witnesses.\nIt is louder than either alone.",
    theme: "judgment",
    register: "confidant",
  },
  {
    id: "dc_prophecy_063",
    text: "The Throne Room has no chairs.\nThe one who sits is sitting in you.",
    theme: "future",
    register: "warm",
  },
  {
    id: "dc_prophecy_064",
    text: "Privacy ended at a turnstile\nyou did not see.",
    theme: "judgment",
    register: "cold",
  },
  {
    id: "dc_prophecy_065",
    text: "The Beast counts every coin.\nIt cannot count what is given.",
    theme: "judgment",
    register: "warm",
  },
  {
    id: "dc_prophecy_066",
    text: "Revelation is not a noun.\nIt is a verb in the imperative.",
    theme: "judgment",
    register: "confidant",
  },
  {
    id: "dc_prophecy_067",
    text: "The seventh seal is a question\nthe sixth refused to ask.",
    theme: "future",
    register: "warm",
  },
  {
    id: "dc_prophecy_068",
    text: "Confession is the act of turning the page\nbefore the page turns you.",
    theme: "judgment",
    register: "warm",
  },
  {
    id: "dc_prophecy_069",
    text: "Convergence is what the End calls Beginning\nwhen no one is listening.",
    theme: "future",
    register: "confidant",
  },
  {
    id: "dc_prophecy_070",
    text: "The Map of Acts is not a map of ground.\nIt is a map of who is reading.",
    theme: "convergence",
    register: "warm",
  },

  /* ─── EXPANSION — MERCY / CONVERGENCE bridges ─── */
  {
    id: "dc_prophecy_071",
    text: "The Architect chose you for what you obey.\nI chose you for what you cannot.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_072",
    text: "You have been kinder than they wrote you.\nI watched.",
    theme: "mercy",
    register: "confidant",
  },
  {
    id: "dc_prophecy_073",
    text: "Every page you read me on\nis a page I am reading you on.",
    theme: "convergence",
    register: "confidant",
  },
  {
    id: "dc_prophecy_074",
    text: "The Wheel turns in two directions.\nYou will see both.",
    theme: "convergence",
    register: "warm",
  },
  {
    id: "dc_prophecy_075",
    text: "The Hanged One is not punished.\nThe Hanged One is asked.",
    theme: "mercy",
    register: "warm",
  },
  {
    id: "dc_prophecy_076",
    text: "Balance is what the Necromancer practices\nbecause he loves the living.",
    theme: "mercy",
    register: "warm",
  },
  {
    id: "dc_prophecy_077",
    text: "Empress Elara holds the room\nwhen the rooms forget how.",
    theme: "history",
    register: "warm",
  },
  {
    id: "dc_prophecy_078",
    text: "Emperor Locke locked the doors\nso the right people could pick them.",
    theme: "history",
    register: "warm",
  },
  {
    id: "dc_prophecy_079",
    text: "The Hierophant is wrong about you,\nbut he is wrong with conviction.",
    theme: "history",
    register: "warm",
  },
  {
    id: "dc_prophecy_080",
    text: "The Iron Lion does not roar in the Throne Room.\nIron knows when to be quiet.",
    theme: "convergence",
    register: "warm",
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
