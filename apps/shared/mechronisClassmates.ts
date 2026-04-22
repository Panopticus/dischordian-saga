import { assetUrl } from "../client/src/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   MECHRONIS CLASSMATES — Recurring NPC Year-Mates

   The Academy without classmates is a prison. These eight
   students re-appear across lessons, detentions, and
   common-room vignettes. Four map one-per-House (the
   "nemesis/friend/bully/crush" quartet of school-story
   archetypes) and four rove between Houses so loyalties
   feel live.

   Each classmate has a single sharpened line they say often
   enough to become a running joke — see `catchphrase`.

   These are DATA only. UI rendering lives in
   MechronisAcademyPage and the common-room drawer.
   ═══════════════════════════════════════════════════════ */

export type ClassmateRole =
  | "rival"       // sharper than you, graded ahead
  | "friend"      // the one you protect
  | "bully"       // who grades you down when they can
  | "crush"       // the ambiguous one
  | "ghost"       // dropped out mid-semester — still on the roster
  | "prodigy"     // Distinction-hoarder
  | "rulekeeper"  // enforces the classroom rule harder than the professor
  | "fugitive";   // on the run from a detention they refuse to serve

export interface Classmate {
  id: string;
  name: string;
  /** Tag for quick reference in lesson prompts. */
  houseId: string;
  role: ClassmateRole;
  /** One-line characterization. */
  description: string;
  /** Recurring line used in flavor text and common-room vignettes. */
  catchphrase: string;
  /** Two-to-three sentence quiet truth about this student. */
  hiddenTruth: string;
  /** Portrait asset path (falls back gracefully if absent). */
  portrait: string;
}

export const MECHRONIS_CLASSMATES: Classmate[] = [
  // ── House Resonance ──
  {
    id: "classmate_aria_wen",
    name: "Aria Wen",
    houseId: "house_resonance",
    role: "prodigy",
    description:
      "First-chair soprano in Kanevas's class. Sings other students' parts when they miss their entrance, then apologizes with a bow that is technically correct.",
    catchphrase: "I'll take your line. You don't mind, do you?",
    hiddenTruth:
      "Aria has memorized every classmate's failure by timbre. She can reproduce them on cue. She will, if asked by the Head.",
    portrait: assetUrl("art/mechronis/classmates/aria-wen.png"),
  },
  {
    id: "classmate_benik_holt",
    name: "Benik Holt",
    houseId: "house_resonance",
    role: "friend",
    description:
      "A kind boy with a bad stammer. Sits next to you on purpose so the Harmony Drill's burden is carried in a straight line.",
    catchphrase: "We… we start together, yeah?",
    hiddenTruth:
      "Benik's stammer evaporates when he's alone. He keeps it on purpose, because he has seen what perfect voices get asked to do.",
    portrait: assetUrl("art/mechronis/classmates/benik-holt.png"),
  },

  // ── House Umbra ──
  {
    id: "classmate_tess_corvia",
    name: "Tess Corvia",
    houseId: "house_umbra",
    role: "rival",
    description:
      "Aoki's star. Takes notes in a code she invented at nine. Her grades come from everyone else's work and she has never been wrong about a classmate yet.",
    catchphrase: "You looked up three times during my answer. Interesting.",
    hiddenTruth:
      "Tess is also keeping a second ledger, in ink no one at the Academy has taught her to mix. She has not decided whom to give it to.",
    portrait: assetUrl("art/mechronis/classmates/tess-corvia.png"),
  },
  {
    id: "classmate_ollen_mire",
    name: "Ollen Mire",
    houseId: "house_umbra",
    role: "ghost",
    description:
      "Third-row, quiet, always early. Missed roll call on week four. His chair is still there. His name is still on the seating chart. No one removes it.",
    catchphrase: "(his chair, politely, does not answer)",
    hiddenTruth:
      "Ollen is in the Archive. Not as a student. Curator Halverez gets a new artifact every week that has Ollen's handwriting on it.",
    portrait: assetUrl("art/mechronis/classmates/ollen-mire.png"),
  },

  // ── House Ironflight ──
  {
    id: "classmate_mara_thorne",
    name: "Mara Thorne",
    houseId: "house_ironflight",
    role: "bully",
    description:
      "Third-semester repeat. Older than the rest of you by two years and a war. Will shoulder-check you into the forge because it 'teaches heat.'",
    catchphrase: "Bleed on your own time, first-year.",
    hiddenTruth:
      "Mara failed her first Resurrection Draft. Something came back with her. It reads Ironflight rosters over her shoulder at night.",
    portrait: assetUrl("art/mechronis/classmates/mara-thorne.png"),
  },
  {
    id: "classmate_ozen_kade",
    name: "Ozen Kade",
    houseId: "house_ironflight",
    role: "crush",
    description:
      "Engineer-track. Always has oil on their collar. Laughs with their whole body. Fixes your broken project during lunch and tells you they found it that way.",
    catchphrase: "Hand me that. No, the other one. Yeah. Now don't look.",
    hiddenTruth:
      "Ozen is building something in the sub-basement of the Forge that cannot be graded. The Architect does not know. Yet.",
    portrait: assetUrl("art/mechronis/classmates/ozen-kade.png"),
  },

  // ── House Liminal ──
  {
    id: "classmate_juno_reeve",
    name: "Juno Reeve",
    houseId: "house_liminal",
    role: "rulekeeper",
    description:
      "Knows every Academy bylaw by heart. Cites them loudly in Professor Vex's class, which Vex enjoys and rewards. Cites them quietly in Orphic's, which Orphic enjoys less.",
    catchphrase: "Page forty-one, footnote eight. Read it before you argue.",
    hiddenTruth:
      "Juno is drafting the 42nd footnote. They have told no one. It reverses the other forty-one.",
    portrait: assetUrl("art/mechronis/classmates/juno-reeve.png"),
  },
  {
    id: "classmate_vessa_lark",
    name: "Vessa Lark",
    houseId: "house_liminal",
    role: "fugitive",
    description:
      "Skipped a detention in week two and has been skipping ever since. Appears in classes at random, gets Distinctions, vanishes before the bell. No one reports her.",
    catchphrase: "If you tell, I'll take the door with me when I go.",
    hiddenTruth:
      "Vessa has found one of Orphic's seven doors. The one that leads out. She has not used it yet.",
    portrait: assetUrl("art/mechronis/classmates/vessa-lark.png"),
  },
];

/* ─── HELPERS ─── */

export function getClassmate(id: string): Classmate | undefined {
  return MECHRONIS_CLASSMATES.find(c => c.id === id);
}

export function getClassmatesByHouse(houseId: string): Classmate[] {
  return MECHRONIS_CLASSMATES.filter(c => c.houseId === houseId);
}

/**
 * Pick a deterministic classmate for a given day + house. Used by
 * common-room vignettes so the same day always features the same NPC.
 */
export function pickDailyClassmate(day: number, houseId?: string): Classmate {
  const pool = houseId
    ? getClassmatesByHouse(houseId)
    : MECHRONIS_CLASSMATES;
  const list = pool.length > 0 ? pool : MECHRONIS_CLASSMATES;
  return list[Math.abs(day) % list.length];
}

/* ─── COMMON ROOM VIGNETTES ─── */

/**
 * One-tap between-class moment. Pure flavor, no stats. Keyed by
 * classmate id so the same day's classmate has their own beat.
 */
export interface CommonRoomVignette {
  classmateId: string;
  moment: string;
}

export const COMMON_ROOM_VIGNETTES: CommonRoomVignette[] = [
  {
    classmateId: "classmate_aria_wen",
    moment:
      "Aria is humming a Harmony Drill under her breath in the hearth armchair. She pats the cushion next to her without looking up.",
  },
  {
    classmateId: "classmate_benik_holt",
    moment:
      "Benik is practicing his entrance for tomorrow's Drill in the mirror. He's alone. His stammer is gone. He sees you see him. He smiles like he's been caught stealing.",
  },
  {
    classmateId: "classmate_tess_corvia",
    moment:
      "Tess is writing in her ledger by green-lamp light. She closes it one page earlier than she normally does when you pass. She thanks you for stopping, though you hadn't.",
  },
  {
    classmateId: "classmate_ollen_mire",
    moment:
      "Ollen's armchair is still warm. You check the page of the book open on its arm. It's a page from YOUR transcript. You don't remember Ollen being in your Professor's class.",
  },
  {
    classmateId: "classmate_mara_thorne",
    moment:
      "Mara is sharpening a butter knife at the mess-hall table. 'Good for grading bread,' she says. You sit somewhere else.",
  },
  {
    classmateId: "classmate_ozen_kade",
    moment:
      "Ozen hands you a still-warm pocket watch. It tells the time in a city you haven't been to. 'Keep it. I've got another. Don't wind it counter-clockwise.' They wink.",
  },
  {
    classmateId: "classmate_juno_reeve",
    moment:
      "Juno is annotating the Academy bylaws with a fountain pen. They ask whether you think 'habitual' means 'three times' or 'any amount the grader feels.' You are not sure why they're asking.",
  },
  {
    classmateId: "classmate_vessa_lark",
    moment:
      "Vessa is in the armchair for exactly long enough for you to notice. By the time you look up, there's only a folded note: a hand-drawn doorway, labeled YOURS.",
  },
];

export function getVignetteForDay(day: number, houseId?: string): CommonRoomVignette {
  const classmate = pickDailyClassmate(day, houseId);
  const match = COMMON_ROOM_VIGNETTES.find(v => v.classmateId === classmate.id);
  return match ?? COMMON_ROOM_VIGNETTES[Math.abs(day) % COMMON_ROOM_VIGNETTES.length];
}
