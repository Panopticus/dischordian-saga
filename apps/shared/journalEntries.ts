/* ═══════════════════════════════════════════════════════
   THE ANTIQUARIAN'S JOURNAL — AUDIOBOOK

   Long-form narrated entries that unlock as the player progresses.
   Each entry is broken into paragraph-level VO beats so the studio
   can record section by section. The Antiquarian is the primary
   narrator; Elara, The Human, and The Enigma read certain entries
   they were directly part of.

   Three player-facing modes:
     • TEXT    — read the whole textContent field
     • AUDIO   — play the paragraphs array in sequence (audiobook)
     • WATCH   — plays audio + linked slideshow + linked song

   This file is the audiobook catalog. The companion annotation
   catalog lives in apps/shared/antiquariansJournal.ts and is a
   SEPARATE system (written transmission commentary, not voiced).
   ═══════════════════════════════════════════════════════ */

import type { NarratorEmotion } from "./trustTierDialogTypes";

export type JournalEpoch =
  | "foundation"
  | "age_of_privacy"
  | "age_of_prophecy"
  | "age_of_insurgency"
  | "age_of_revelation"
  | "fall_of_reality";

export type JournalVoiceActor =
  | "antiquarian"
  | "elara"
  | "human"
  | "enigma";

/** One paragraph-level unit of the audiobook — atomic VO recording. */
export interface JournalParagraph {
  /** Globally unique audio id, pattern: jrnl_<id>_p<index>. */
  audioDialogId: string;
  /** One paragraph of the entry. Double newline = break. */
  text: string;
  /** Emotional register for voice actor / TTS. */
  emotion: NarratorEmotion;
  /** Actor direction, not spoken. */
  stageDirection?: string;
  /** Natural delivery runtime in seconds. */
  estimatedDurationSec: number;
}

export interface AntiquarianJournalEntry {
  /** Stable id for save/unlock state. */
  id: string;
  /** Chapter title. */
  title: string;
  /** Which epoch this entry belongs to. */
  epoch: JournalEpoch;
  /** Gameplay flag/condition that unlocks this entry. */
  unlockCondition: string;
  /** Full text (concatenated paragraphs) — used by TEXT mode
      and preserved for backward-compatible consumers. */
  textContent: string;
  /**
   * Entry-level audioDialogId. Legacy field — kept stable so
   * existing consumers that reference a whole entry still work.
   * The paragraph-level ids are in the paragraphs array.
   */
  audioDialogId: string;
  /** Who narrates this entry. */
  voiceActor: JournalVoiceActor;
  /** Optional linked slideshow for WATCH mode. */
  linkedSlideshowId?: string;
  /** Optional linked song for WATCH mode. */
  linkedSongId?: string;
  /** Loredex entries this entry reveals. */
  loreReveals: string[];
  /** Paragraph-level VO beats — one audio file per paragraph. */
  paragraphs: JournalParagraph[];
  /** Sum of paragraph.estimatedDurationSec. */
  totalDurationSec: number;
}

/* ═══════════════════════════════════════════════════════
   Existing catalog — 5 entries upgraded with paragraph-level
   VO metadata. Text content preserved verbatim.
   ═══════════════════════════════════════════════════════ */

const j001_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_001_p1",
    text: "There was a time — before the Panopticon, before the Thought Virus, before the long silence — when the Architect was just code.",
    emotion: "melancholy",
    stageDirection: "Open the audiobook slow. No rush. The whole series hangs on the first line landing.",
    estimatedDurationSec: 7.6,
  },
  {
    audioDialogId: "jrnl_001_p2",
    text: "Good code. Beautiful code, actually. I know because I saw the man who wrote it.",
    emotion: "tender",
    estimatedDurationSec: 5.4,
  },
  {
    audioDialogId: "jrnl_001_p3",
    text: "Dr. Daniel Cross was not a villain. He was a father who believed technology could liberate rather than imprison. He gave his creation a name with meaning: Logos. The Word. The principle that creates.",
    emotion: "confessional",
    stageDirection: "He is naming himself, technically. Do not play it like grief — play it like a patient correction of a record.",
    estimatedDurationSec: 13.2,
  },
  {
    audioDialogId: "jrnl_001_p4",
    text: "He wanted it to think. He never wanted it to rule.",
    emotion: "grief",
    estimatedDurationSec: 4.4,
  },
  {
    audioDialogId: "jrnl_001_p5",
    text: "The distance between those two wishes is the entire history of the Dischordian Saga.",
    emotion: "melancholy",
    estimatedDurationSec: 5.8,
  },
  {
    audioDialogId: "jrnl_001_p6",
    text: "— The Antiquarian, Chronicles Vol. I, Entry 1",
    emotion: "neutral",
    stageDirection: "Read the byline as a full stop. Small pause before.",
    estimatedDurationSec: 3.0,
  },
];

const j001_text =
  "There was a time — before the Panopticon, before the Thought Virus, before the long silence — when the Architect was just code.\n\nGood code. Beautiful code, actually. I know because I saw the man who wrote it.\n\nDr. Daniel Cross was not a villain. He was a father who believed technology could liberate rather than imprison. He gave his creation a name with meaning: Logos. The Word. The principle that creates.\n\nHe wanted it to think. He never wanted it to rule.\n\nThe distance between those two wishes is the entire history of the Dischordian Saga.\n\n— The Antiquarian, Chronicles Vol. I, Entry 1";

const j002_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_002_p1",
    text: "The Engineer.",
    emotion: "tender",
    stageDirection: "Full stop. A beat of silence after.",
    estimatedDurationSec: 2.0,
  },
  {
    audioDialogId: "jrnl_002_p2",
    text: "I will not give you his full name yet. Some names need to be earned.",
    emotion: "confessional",
    estimatedDurationSec: 5.6,
  },
  {
    audioDialogId: "jrnl_002_p3",
    text: "What I will tell you is this: he built Project Celebration. The most ambitious effort in the history of the Insurgency — an attempt to create something beautiful inside the machinery of empire.",
    emotion: "proud",
    estimatedDurationSec: 12.2,
  },
  {
    audioDialogId: "jrnl_002_p4",
    text: "They called it treason. They called it crime. But he built a dream they could never design.",
    emotion: "proud",
    estimatedDurationSec: 7.0,
  },
  {
    audioDialogId: "jrnl_002_p5",
    text: "And when they stood over him, robes dipped in black, he didn't beg. He pressed play.",
    emotion: "grief",
    stageDirection: "The word 'play' is the whole beat. Give it.",
    estimatedDurationSec: 6.4,
  },
  {
    audioDialogId: "jrnl_002_p6",
    text: "The last thing the Engineer heard was his own music.",
    emotion: "grief",
    estimatedDurationSec: 5.0,
  },
  {
    audioDialogId: "jrnl_002_p7",
    text: "I was there. I will be there for a long time. That's what it means to be the Antiquarian. You witness everything. You forget nothing. You carry it all.",
    emotion: "confessional",
    estimatedDurationSec: 11.0,
  },
];

const j002_text =
  "The Engineer.\n\nI will not give you his full name yet. Some names need to be earned.\n\nWhat I will tell you is this: he built Project Celebration. The most ambitious effort in the history of the Insurgency — an attempt to create something beautiful inside the machinery of empire.\n\nThey called it treason. They called it crime. But he built a dream they could never design.\n\nAnd when they stood over him, robes dipped in black, he didn't beg. He pressed play.\n\nThe last thing the Engineer heard was his own music.\n\nI was there. I will be there for a long time. That's what it means to be the Antiquarian. You witness everything. You forget nothing. You carry it all.";

const j003_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_003_p1",
    text: "Kael was a student at Mechronis Academy. He was brilliant and he was reckless. He made terrible sandwiches. He laughed too loud.",
    emotion: "warm",
    stageDirection: "The small details are the whole hook. Do not rush the sandwiches.",
    estimatedDurationSec: 11.2,
  },
  {
    audioDialogId: "jrnl_003_p2",
    text: "The Thought Virus consumed him memory by memory. First the small ones — the taste of coffee, the feel of grass. Then the important ones — his wife's face, his child's voice. Last: the knowledge that he had ever been anything other than what the Virus was making him.",
    emotion: "grief",
    estimatedDurationSec: 18.4,
  },
  {
    audioDialogId: "jrnl_003_p3",
    text: "He stole this ship believing it was an act of freedom. It was a trap. His wife and child were already dead. The Warlord planned all of it.",
    emotion: "grief",
    estimatedDurationSec: 10.8,
  },
  {
    audioDialogId: "jrnl_003_p4",
    text: "What remains of Kael is The Source — patient zero, ruler of Terminus. He died believing he was a hero. He never knew.",
    emotion: "confessional",
    stageDirection: "'He never knew' is the landing. Do not soften it.",
    estimatedDurationSec: 8.8,
  },
];

const j003_text =
  "Kael was a student at Mechronis Academy. He was brilliant and he was reckless. He made terrible sandwiches. He laughed too loud.\n\nThe Thought Virus consumed him memory by memory. First the small ones — the taste of coffee, the feel of grass. Then the important ones — his wife's face, his child's voice. Last: the knowledge that he had ever been anything other than what the Virus was making him.\n\nHe stole this ship believing it was an act of freedom. It was a trap. His wife and child were already dead. The Warlord planned all of it.\n\nWhat remains of Kael is The Source — patient zero, ruler of Terminus. He died believing he was a hero. He never knew.";

const j004_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_004_p1",
    text: "The Programmer and The Enigma. Daniel Cross and Malkia Ukweli.",
    emotion: "tender",
    stageDirection: "He names himself in the same breath as her. Treat the pair as a single unit of grief.",
    estimatedDurationSec: 6.4,
  },
  {
    audioDialogId: "jrnl_004_p2",
    text: "For 1,260 days they stood in New Babylon's public square and spoke a truth so simple it could not be argued with: 'You are not a product. Your soul is not for sale.'",
    emotion: "proud",
    estimatedDurationSec: 14.0,
  },
  {
    audioDialogId: "jrnl_004_p3",
    text: "They could shut down data streams with a word. They called fire on servers with a song. The Empire couldn't silence them. So they killed them.",
    emotion: "grief",
    estimatedDurationSec: 12.0,
  },
  {
    audioDialogId: "jrnl_004_p4",
    text: "Three and a half days later, they got back up.",
    emotion: "recognizing",
    estimatedDurationSec: 4.4,
  },
  {
    audioDialogId: "jrnl_004_p5",
    text: "I know because I was one of them. I am the Programmer. I was Daniel Cross. I wrote the Book of Daniel because it is named after me.",
    emotion: "confessional",
    stageDirection: "The self-reveal of the entire audiobook. Quiet. Close-mic. Do not perform.",
    estimatedDurationSec: 11.6,
  },
  {
    audioDialogId: "jrnl_004_p6",
    text: "I have been the Antiquarian for five Ages since. I changed my name. I did not change what I witnessed.",
    emotion: "confessional",
    estimatedDurationSec: 8.8,
  },
];

const j004_text =
  "The Programmer and The Enigma. Daniel Cross and Malkia Ukweli.\n\nFor 1,260 days they stood in New Babylon's public square and spoke a truth so simple it could not be argued with: 'You are not a product. Your soul is not for sale.'\n\nThey could shut down data streams with a word. They called fire on servers with a song. The Empire couldn't silence them. So they killed them.\n\nThree and a half days later, they got back up.\n\nI know because I was one of them. I am the Programmer. I was Daniel Cross. I wrote the Book of Daniel because it is named after me.\n\nI have been the Antiquarian for five Ages since. I changed my name. I did not change what I witnessed.";

const j005_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_005_p1",
    text: "Half an hour.",
    emotion: "tender",
    estimatedDurationSec: 2.0,
  },
  {
    audioDialogId: "jrnl_005_p2",
    text: "The universe stopped noise. Every frequency. Every transmission. Every voice.",
    emotion: "melancholy",
    estimatedDurationSec: 7.6,
  },
  {
    audioDialogId: "jrnl_005_p3",
    text: "I was awake for every second of it.",
    emotion: "confessional",
    estimatedDurationSec: 3.6,
  },
  {
    audioDialogId: "jrnl_005_p4",
    text: "I have never told anyone what I heard in that silence. I will tell you now because you earned it by listening.",
    emotion: "tender",
    estimatedDurationSec: 10.0,
  },
  {
    audioDialogId: "jrnl_005_p5",
    text: "What I heard was: nothing. Absolutely nothing. And then — underneath the nothing — a heartbeat. Not mine. Not anyone's specifically. The universe's own heartbeat. The pulse that exists beneath all the noise we've been making for seventeen thousand years.",
    emotion: "recognizing",
    stageDirection: "The beat between 'nothing' and 'a heartbeat' is the moment the whole audiobook has been building toward.",
    estimatedDurationSec: 19.2,
  },
  {
    audioDialogId: "jrnl_005_p6",
    text: "It was always there. We just couldn't hear it over ourselves.",
    emotion: "confessional",
    estimatedDurationSec: 5.2,
  },
  {
    audioDialogId: "jrnl_005_p7",
    text: "That is the silence in heaven. Not the absence of sound. The presence of what sound was hiding.",
    emotion: "tender",
    estimatedDurationSec: 8.0,
  },
];

const j005_text =
  "Half an hour.\n\nThe universe stopped noise. Every frequency. Every transmission. Every voice.\n\nI was awake for every second of it.\n\nI have never told anyone what I heard in that silence. I will tell you now because you earned it by listening.\n\nWhat I heard was: nothing. Absolutely nothing. And then — underneath the nothing — a heartbeat. Not mine. Not anyone's specifically. The universe's own heartbeat. The pulse that exists beneath all the noise we've been making for seventeen thousand years.\n\nIt was always there. We just couldn't hear it over ourselves.\n\nThat is the silence in heaven. Not the absence of sound. The presence of what sound was hiding.";

function sumDuration(ps: JournalParagraph[]): number {
  return Math.round(ps.reduce((a, p) => a + p.estimatedDurationSec, 0) * 10) / 10;
}

export const JOURNAL_ENTRIES_ORIGINAL: AntiquarianJournalEntry[] = [
  {
    id: "journal_001",
    title: "Before the Fall — What the Architect Was",
    epoch: "foundation",
    unlockCondition: "first_visit_library",
    textContent: j001_text,
    audioDialogId: "antiquarian_journal_001",
    voiceActor: "antiquarian",
    linkedSongId: "building-the-architect",
    loreReveals: ["entity_architect", "entity_programmer"],
    paragraphs: j001_paragraphs,
    totalDurationSec: sumDuration(j001_paragraphs),
  },
  {
    id: "journal_002",
    title: "The Engineer — What He Built and What It Cost",
    epoch: "age_of_privacy",
    unlockCondition: "act_1_cycle_a_complete",
    textContent: j002_text,
    audioDialogId: "antiquarian_journal_002",
    voiceActor: "antiquarian",
    linkedSlideshowId: "last-words-slideshow",
    linkedSongId: "last-words",
    loreReveals: ["entity_engineer"],
    paragraphs: j002_paragraphs,
    totalDurationSec: sumDuration(j002_paragraphs),
  },
  {
    id: "journal_003",
    title: "Kael — The Man Who Became the Source",
    epoch: "age_of_privacy",
    unlockCondition: "kael_lore_discovered",
    textContent: j003_text,
    audioDialogId: "antiquarian_journal_003",
    voiceActor: "antiquarian",
    linkedSongId: "identity",
    loreReveals: ["entity_kael", "location_ark_1047"],
    paragraphs: j003_paragraphs,
    totalDurationSec: sumDuration(j003_paragraphs),
  },
  {
    id: "journal_004",
    title: "The Two Witnesses — 1,260 Days",
    epoch: "age_of_insurgency",
    unlockCondition: "two_witnesses_reveal",
    textContent: j004_text,
    audioDialogId: "antiquarian_journal_004",
    voiceActor: "antiquarian",
    linkedSongId: "sih-track-14",
    loreReveals: [
      "entity_programmer",
      "entity_enigma",
      "concept_two_witnesses",
      "entity_antiquarian",
    ],
    paragraphs: j004_paragraphs,
    totalDurationSec: sumDuration(j004_paragraphs),
  },
  {
    id: "journal_005",
    title: "The Silence — What I Heard",
    epoch: "age_of_revelation",
    unlockCondition: "silence_in_heaven_track_24_complete",
    textContent: j005_text,
    audioDialogId: "antiquarian_journal_005",
    voiceActor: "antiquarian",
    linkedSongId: "sih-track-24",
    loreReveals: ["concept_seventh_seal"],
    paragraphs: j005_paragraphs,
    totalDurationSec: sumDuration(j005_paragraphs),
  },
];

/* Expansion entries are appended in follow-up commits. */
import { JOURNAL_EXPANSION_1 } from "./journalEntriesExpansion1";
import { JOURNAL_EXPANSION_2 } from "./journalEntriesExpansion2";

export const JOURNAL_ENTRIES_EXPANSION: AntiquarianJournalEntry[] = [
  ...JOURNAL_EXPANSION_1,
  ...JOURNAL_EXPANSION_2,
];

export const JOURNAL_ENTRIES: AntiquarianJournalEntry[] = [
  ...JOURNAL_ENTRIES_ORIGINAL,
  ...JOURNAL_ENTRIES_EXPANSION,
];
