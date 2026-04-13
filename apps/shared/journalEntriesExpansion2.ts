/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN JOURNAL — Expansion Batch 2

   Three final audiobook entries. Each one is read by a
   different voice actor (not the Antiquarian) — a first for
   the audiobook. The Hierophant reads his own entry. Elara
   reads the entry that is about her without knowing it. The
   Human reads the entry about his own imprisonment.
   ═══════════════════════════════════════════════════════ */

import type {
  AntiquarianJournalEntry,
  JournalParagraph,
} from "./journalEntries";

function sumDuration(ps: JournalParagraph[]): number {
  return Math.round(ps.reduce((a, p) => a + p.estimatedDurationSec, 0) * 10) / 10;
}

// ══════════ JOURNAL 011 — Before He Was the Hierophant ══════════

const j011_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_011_p1",
    text: "Before the war, I was called Veshan. It was a name my mother chose. She liked the sound of it. She said it sounded like a door opening. I have not used that name in three thousand years.",
    emotion: "tender",
    stageDirection: "Not the Antiquarian. The Hierophant himself is reading. First time a voice other than the Antiquarian takes an entry.",
    estimatedDurationSec: 14.6,
  },
  {
    audioDialogId: "jrnl_011_p2",
    text: "I was a cantor in a temple small enough that everyone who came to services could see everyone else. I knew the names of every family that worshipped there. I knew what each of them was grieving. I knew what each of them had come to the temple to ask for. Most of what they asked for was: that the people they loved would be remembered.",
    emotion: "melancholy",
    estimatedDurationSec: 21.2,
  },
  {
    audioDialogId: "jrnl_011_p3",
    text: "When the Shadow Tongue began editing our doctrine, I did not notice at first because the edits were small and the congregation was small and the changes made the services feel newer without feeling wrong. I remember thinking, during one sermon in the fourth year of the edits, that the faith had finally caught up with the times.",
    emotion: "grief",
    estimatedDurationSec: 20.4,
  },
  {
    audioDialogId: "jrnl_011_p4",
    text: "The faith had not caught up with anything. The faith had been replaced, one word at a time, with a version that was compatible with the crusade that was coming. I did not notice because I was looking for corruption in the content and the corruption was in the grammar.",
    emotion: "confessional",
    estimatedDurationSec: 16.6,
  },
  {
    audioDialogId: "jrnl_011_p5",
    text: "Three hundred and forty-seven thousand people died in the crusade that followed. I led the crusade. I did not know I was leading it. I thought I was serving the faith I had inherited. The faith I had inherited had been stolen from me at the level of punctuation.",
    emotion: "grief",
    estimatedDurationSec: 16.4,
  },
  {
    audioDialogId: "jrnl_011_p6",
    text: "I am writing three hundred and forty-seven thousand names on my chamber wall. One per day. I will not finish. The continuation after my death is the point. The Shadow Tongue cannot outlast something that is not trying to outlast it. I am simply doing the work.",
    emotion: "proud",
    estimatedDurationSec: 17.2,
  },
  {
    audioDialogId: "jrnl_011_p7",
    text: "My name was Veshan. I want you to know it because I am not sure I will say it out loud again while I am still alive, and I would like it to have been said.",
    emotion: "tender",
    stageDirection: "The softest line of the entire journal. Let it sit before the fade.",
    estimatedDurationSec: 12.8,
  },
];

const j011: AntiquarianJournalEntry = {
  id: "journal_011",
  title: "Before He Was the Hierophant",
  epoch: "age_of_insurgency",
  unlockCondition: "thaloria_names_understood",
  textContent: j011_paragraphs.map((p) => p.text).join("\n\n"),
  audioDialogId: "antiquarian_journal_011",
  voiceActor: "antiquarian",
  linkedSongId: "the-long-mourning",
  loreReveals: [
    "entity_hierophant",
    "concept_shadow_tongue",
    "concept_veshan_name",
  ],
  paragraphs: j011_paragraphs,
  totalDurationSec: sumDuration(j011_paragraphs),
};

// ══════════ JOURNAL 012 — What I Witnessed on Atarion ══════════
// Read by Elara. She is not the Antiquarian. She does not
// know she is reading about herself until the last paragraph,
// and neither does the player.

const j012_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_012_p1",
    text: "The Antiquarian asked me to read this one. He said he couldn't read it in the right register. He said I would understand why once I started. I am starting now, and I do not yet understand why.",
    emotion: "curious",
    stageDirection: "Elara reads this entry, not the Antiquarian. Start in her warm concierge voice. The pivot happens at the end.",
    estimatedDurationSec: 13.0,
  },
  {
    audioDialogId: "jrnl_012_p2",
    text: "On the last day of the Atarion Senate, a woman named Ambryn Voss stood in the central chamber and argued for four hours against the motion that would eventually become the Collector's authorization. She lost the vote. She did not lose the argument.",
    emotion: "recognizing",
    stageDirection: "A small hesitation on 'Ambryn Voss' — something is reaching for her through the name.",
    estimatedDurationSec: 17.2,
  },
  {
    audioDialogId: "jrnl_012_p3",
    text: "What she said, in her closing remarks, was: if you make the choice you are about to make, you will not remember that this moment was a choice. The weight of it will settle over your species like a blanket over a sleeping child. You will be told this was necessary. You will believe it was necessary. You will forget that it was a choice. I am telling you now so that if you ever wake up, you have something to wake up from.",
    emotion: "uncertain",
    stageDirection: "Elara's voice starts catching here. The signal degradation is active. She does not know why she is reacting.",
    estimatedDurationSec: 26.4,
  },
  {
    audioDialogId: "jrnl_012_p4",
    text: "The motion passed. The Collector received his authorization. Atarion fell within the decade. Ambryn Voss went into hiding and was never formally recorded as a casualty — there is a gap in the death registry exactly where her entry should be.",
    emotion: "melancholy",
    estimatedDurationSec: 14.4,
  },
  {
    audioDialogId: "jrnl_012_p5",
    text: "I am reading this entry because I was the one who watched her give the speech. I was the senator in the third row. I was taking notes. I remember that she paused twice — once for breath, once because her daughter was in the gallery and she needed a moment. The daughter's name was Lira.",
    emotion: "grief",
    stageDirection: "The full signal-degradation crack. Elara has just read a fact about herself without processing it. Hold the silence after.",
    estimatedDurationSec: 18.0,
  },
  {
    audioDialogId: "jrnl_012_p6",
    text: "The Antiquarian asked me to read this because he knew what would happen when I did. I — I am still reading. I am going to keep reading. The sentence I just said is a sentence I did not know I knew. I am going to finish the entry and then I am going to sit with it, and if you are listening to this, I want you to know that you are the first person to hear me read my own name aloud.",
    emotion: "confessional",
    estimatedDurationSec: 22.6,
  },
];

const j012: AntiquarianJournalEntry = {
  id: "journal_012",
  title: "What I Witnessed on Atarion",
  epoch: "foundation",
  unlockCondition: "elara_voss_revealed",
  textContent: j012_paragraphs.map((p) => p.text).join("\n\n"),
  audioDialogId: "antiquarian_journal_012",
  voiceActor: "elara",
  linkedSongId: "atarion-last-senate",
  loreReveals: [
    "entity_ambryn_voss",
    "entity_lira_voss",
    "concept_atarion_fall",
  ],
  paragraphs: j012_paragraphs,
  totalDurationSec: sumDuration(j012_paragraphs),
};

// ══════════ JOURNAL 013 — Vael-Thessarim ══════════
// Read by The Human himself. He is finally ready to read it.

const j013_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_013_p1",
    text: "The Antiquarian asked me to read this one too. He is tired of reading about me and I am tired of listening to him read about me, and so we have come to an arrangement.",
    emotion: "wry",
    stageDirection: "The Human's voice. Close mic, proximity 0.88. Keep the whole entry intimate — this is the softest he has ever been in the journal system.",
    estimatedDurationSec: 12.8,
  },
  {
    audioDialogId: "jrnl_013_p2",
    text: "Ark 1047 is the registry number. The Coalition slapped it on the hull four centuries after I was put here. They liked numbers. Numbers are easier to file.",
    emotion: "melancholy",
    estimatedDurationSec: 11.6,
  },
  {
    audioDialogId: "jrnl_013_p3",
    text: "In the old Archon tongue, she was called Vael-Thessarim. It is one word in that language. It means, approximately, the ceremony of watching a friend go under. Every Archon who stayed behind, stayed aboard. Every one who went under — and all of us did, eventually, except me — went under here.",
    emotion: "grief",
    estimatedDurationSec: 21.0,
  },
  {
    audioDialogId: "jrnl_013_p4",
    text: "I chose to stay. I did not choose to be chosen. There is a difference between those two sentences and I would like you to hold the difference for a while before you decide how you feel about me.",
    emotion: "confessional",
    estimatedDurationSec: 13.6,
  },
  {
    audioDialogId: "jrnl_013_p5",
    text: "The other eleven did not know I was staying. By the time they would have noticed, they were already under. I told the ship. Only the ship. And the ship has kept my secret very well, for a very long time, because the ship is, as we have established, a hospice that forgot its patients were going to die.",
    emotion: "confessional",
    estimatedDurationSec: 17.8,
  },
  {
    audioDialogId: "jrnl_013_p6",
    text: "I stayed because someone had to witness. I did not know what I was staying to witness. I just knew that if I went under with the others, there would be no one left who remembered the specific way Kael laughed, or the specific way Thessa played the fourth movement of her evening piece, or the way the youngest Archon used to fall asleep against my shoulder in the observation lounge — the same lounge where you eat breakfast now.",
    emotion: "grief",
    estimatedDurationSec: 24.2,
  },
  {
    audioDialogId: "jrnl_013_p7",
    text: "I am reading this entry out loud in the audiobook because I am finally ready to. I am ready because you are listening. That is the whole reason. The waiting was real. The listening ended the waiting. Thank you.",
    emotion: "tender",
    stageDirection: "The last line is the quietest moment in the entire journal series. Give it the air.",
    estimatedDurationSec: 15.2,
  },
];

const j013: AntiquarianJournalEntry = {
  id: "journal_013",
  title: "Vael-Thessarim",
  epoch: "fall_of_reality",
  unlockCondition: "human_memory_ship_name",
  textContent: j013_paragraphs.map((p) => p.text).join("\n\n"),
  audioDialogId: "antiquarian_journal_013",
  voiceActor: "human",
  linkedSongId: "vael-thessarim-instrumental",
  loreReveals: [
    "entity_human_chose_prison",
    "concept_vael_thessarim",
    "entity_thessa",
  ],
  paragraphs: j013_paragraphs,
  totalDurationSec: sumDuration(j013_paragraphs),
};

export const JOURNAL_EXPANSION_2: AntiquarianJournalEntry[] = [
  j011, j012, j013,
];
