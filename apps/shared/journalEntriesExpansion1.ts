/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN JOURNAL — Expansion Batch 1

   Five new audiobook entries covering story beats not in the
   original five: the Collector's Garden, the water crisis on
   New Atarion, Iron Lion's full broadcast, the Voltari arrival,
   and the Oracle's last argument that the Clones would later
   prove.
   ═══════════════════════════════════════════════════════ */

import type {
  AntiquarianJournalEntry,
  JournalParagraph,
} from "./journalEntries";

function sumDuration(ps: JournalParagraph[]): number {
  return Math.round(ps.reduce((a, p) => a + p.estimatedDurationSec, 0) * 10) / 10;
}

// ══════════ JOURNAL 006 — The Garden of the Collector ══════════

const j006_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_006_p1",
    text: "The Collector was not a person. He was a project. A name assigned to the being who decided, with the certainty of someone who had never asked permission, that the galaxy needed its own custom-built people.",
    emotion: "cautious",
    stageDirection: "Clinical opening. Do not color it yet. The color comes later.",
    estimatedDurationSec: 13.8,
  },
  {
    audioDialogId: "jrnl_006_p2",
    text: "His Garden was a moon-sized facility in orbit around a dying star. Twelve thousand biomes, each tuned for a different kind of sapient life. He seeded each biome with base stock — spliced from every sentient species he could find — and let the biomes run without interference for a thousand years.",
    emotion: "melancholy",
    estimatedDurationSec: 18.4,
  },
  {
    audioDialogId: "jrnl_006_p3",
    text: "The ones that survived, he called Potentials. He was not wrong about the word. They were, and are, exactly that. Potentials. Unfinished. Still becoming.",
    emotion: "tender",
    estimatedDurationSec: 11.0,
  },
  {
    audioDialogId: "jrnl_006_p4",
    text: "What the Collector did not understand — what he could not understand, because his entire framework was optimization — is that the ones who survived did not survive because they were optimized. They survived because they found each other. Because they shared bread. Because they forgave.",
    emotion: "proud",
    stageDirection: "The moral of the entry lives in 'shared bread'. Land it unironically.",
    estimatedDurationSec: 17.2,
  },
  {
    audioDialogId: "jrnl_006_p5",
    text: "I have been a Potential and I have been a man and I have been the Antiquarian. All three were unfinished. All three still are. That is not a failure. That is the design. The Collector just mislabeled it.",
    emotion: "confessional",
    estimatedDurationSec: 13.4,
  },
];

const j006: AntiquarianJournalEntry = {
  id: "journal_006",
  title: "The Garden of the Collector",
  epoch: "foundation",
  unlockCondition: "entity_collector_discovered",
  textContent: j006_paragraphs.map((p) => p.text).join("\n\n"),
  audioDialogId: "antiquarian_journal_006",
  voiceActor: "antiquarian",
  loreReveals: ["entity_collector", "concept_potential_origin"],
  paragraphs: j006_paragraphs,
  totalDurationSec: sumDuration(j006_paragraphs),
};

// ══════════ JOURNAL 007 — What Mirren's Grandmother Knew ══════════

const j007_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_007_p1",
    text: "Mirren Hale's grandmother was named Corin. She was not a scientist. She was not a politician. She was a woman who ran a small repair shop in the third ring of New Atarion and who, during the first water crisis, ended up with more trust than any elected official.",
    emotion: "warm",
    stageDirection: "This is a human-scale entry. No cosmic register. Read it like you are telling a friend about someone you admired.",
    estimatedDurationSec: 17.0,
  },
  {
    audioDialogId: "jrnl_007_p2",
    text: "The crisis itself was simple on the surface. The contaminated supply zone needed to be taken by someone. Whoever took it would get sick. Whoever took it would likely die. Every faction on New Atarion had a reason not to be the one.",
    emotion: "melancholy",
    estimatedDurationSec: 15.0,
  },
  {
    audioDialogId: "jrnl_007_p3",
    text: "Corin Hale called a meeting. She brought a pot of lentils. She fed the room before she spoke. Then she said: I will take it. Here is what I need from you in return.",
    emotion: "proud",
    estimatedDurationSec: 11.4,
  },
  {
    audioDialogId: "jrnl_007_p4",
    text: "What she needed was not money. Not monuments. She needed four specific compromises between factions who had been refusing to compromise for eleven years. She offered her own life in exchange for those compromises, and she named each one aloud, and she wrote them down, and she made the room sign.",
    emotion: "confessional",
    estimatedDurationSec: 16.8,
  },
  {
    audioDialogId: "jrnl_007_p5",
    text: "Three weeks after the water system stabilized, Corin Hale died. The compromises held. The compromises are still holding. Her granddaughter carries a handwritten journal in the top drawer of her desk that explains exactly how one ordinary woman solved a problem no institution could touch.",
    emotion: "tender",
    estimatedDurationSec: 17.0,
  },
  {
    audioDialogId: "jrnl_007_p6",
    text: "I am telling you this because the Potentials have libraries full of data and none of them have Corin's kind of knowledge. You cannot download what she knew. You have to sit with it until it becomes yours.",
    emotion: "grief",
    estimatedDurationSec: 12.4,
  },
];

const j007: AntiquarianJournalEntry = {
  id: "journal_007",
  title: "What Corin Knew",
  epoch: "age_of_privacy",
  unlockCondition: "humans_archive_ordinary_things",
  textContent: j007_paragraphs.map((p) => p.text).join("\n\n"),
  audioDialogId: "antiquarian_journal_007",
  voiceActor: "antiquarian",
  loreReveals: ["entity_corin_hale", "concept_ordinary_knowledge"],
  paragraphs: j007_paragraphs,
  totalDurationSec: sumDuration(j007_paragraphs),
};

// ══════════ JOURNAL 008 — Iron Lion's Full Broadcast ══════════

const j008_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_008_p1",
    text: "The broadcast every Insurgency child knows by heart has seven sentences. The public version.",
    emotion: "tender",
    estimatedDurationSec: 6.2,
  },
  {
    audioDialogId: "jrnl_008_p2",
    text: "The full broadcast has nine. I am going to give you all nine, because you have earned the two that were cut.",
    emotion: "confessional",
    estimatedDurationSec: 9.2,
  },
  {
    audioDialogId: "jrnl_008_p3",
    text: "\"To the free souls of the galaxy — if you are hearing this, then I have fallen, but the resistance has not. Take what I was and make it something larger. Take what we built and make it something that does not need a general to keep it standing.\"",
    emotion: "proud",
    stageDirection: "The public-facing Iron Lion voice. Projection, conviction, a little theatrical.",
    estimatedDurationSec: 18.4,
  },
  {
    audioDialogId: "jrnl_008_p4",
    text: "That is where the public recording ends. Here is what he said next, to Commander Renn alone, on a private frequency, seven hours before the last stand.",
    emotion: "melancholy",
    stageDirection: "Pivot to intimate register. Close mic.",
    estimatedDurationSec: 11.0,
  },
  {
    audioDialogId: "jrnl_008_p5",
    text: "\"I am afraid this will not be enough. I am afraid I am not enough. I am going anyway. I want you to remember this part specifically. The fear was real. The going was also real. Neither cancels the other.\"",
    emotion: "afraid",
    stageDirection: "The 'afraid part' of the broadcast. Do not perform courage. Let the fear be real.",
    estimatedDurationSec: 14.4,
  },
  {
    audioDialogId: "jrnl_008_p6",
    text: "\"Tell whoever comes next that the bravery of the fallen is not the absence of fear. It is the decision to carry it to the place where it is most needed. Tell them, and then let them decide for themselves.\"",
    emotion: "confessional",
    estimatedDurationSec: 14.2,
  },
  {
    audioDialogId: "jrnl_008_p7",
    text: "Renn has carried those two sentences for seventeen thousand years. I am one of the few people she has ever told. She told me because she needed to know that someone else would remember them if she didn't survive. I am telling you for the same reason.",
    emotion: "grief",
    estimatedDurationSec: 15.4,
  },
];

const j008: AntiquarianJournalEntry = {
  id: "journal_008",
  title: "Iron Lion's Full Broadcast",
  epoch: "age_of_insurgency",
  unlockCondition: "insurgency_iron_lion_fragment_known",
  textContent: j008_paragraphs.map((p) => p.text).join("\n\n"),
  audioDialogId: "antiquarian_journal_008",
  voiceActor: "antiquarian",
  linkedSongId: "iron-lion-broadcast",
  loreReveals: ["entity_iron_lion", "concept_afraid_and_going_anyway"],
  paragraphs: j008_paragraphs,
  totalDurationSec: sumDuration(j008_paragraphs),
};

// ══════════ JOURNAL 009 — The Voltari Wake Slowly ══════════

const j009_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_009_p1",
    text: "The Voltari do not experience time the way we do. A decade is a breath. A century is a thought. I have had one full conversation with them in five Ages and it is still, as far as I can tell, ongoing on their end.",
    emotion: "curious",
    estimatedDurationSec: 15.2,
  },
  {
    audioDialogId: "jrnl_009_p2",
    text: "Their first transmission to humanity was a single word: AWAKE. Translated with difficulty, because the Voltari language does not distinguish between 'we are awake,' 'you are awake,' and 'something which had been sleeping has woken up.' All three meanings arrived at once.",
    emotion: "recognizing",
    stageDirection: "Scholar voice. He finds this genuinely interesting, not ominous.",
    estimatedDurationSec: 17.0,
  },
  {
    audioDialogId: "jrnl_009_p3",
    text: "We assumed, because we are an arrogant species, that AWAKE referred to us. That we had passed some threshold and they were greeting us. We spent two years celebrating. We threw ceremonies. We composed music for the occasion.",
    emotion: "wry",
    estimatedDurationSec: 13.8,
  },
  {
    audioDialogId: "jrnl_009_p4",
    text: "The second transmission arrived two years later. It was also one word. REMEMBER. The Voltari, as it turned out, had not been greeting us. They had been warning us. AWAKE was not a statement about our condition. It was a statement about theirs. Something had woken them. They wanted us to remember what.",
    emotion: "cautious",
    estimatedDurationSec: 18.0,
  },
  {
    audioDialogId: "jrnl_009_p5",
    text: "We did not remember. We had not been alive when whatever-it-was last stirred. The Voltari, who had been, were being extremely patient with us while we figured that out.",
    emotion: "melancholy",
    estimatedDurationSec: 11.6,
  },
  {
    audioDialogId: "jrnl_009_p6",
    text: "I am telling you this because the next transmission in the sequence is going to arrive on your watch, not mine. When it does, I want you to know that 'AWAKE' was never about you. You are not the thing that woke. You are the thing that was supposed to notice.",
    emotion: "confessional",
    estimatedDurationSec: 16.0,
  },
];

const j009: AntiquarianJournalEntry = {
  id: "journal_009",
  title: "The Voltari Wake Slowly",
  epoch: "age_of_prophecy",
  unlockCondition: "voltari_first_transmission",
  textContent: j009_paragraphs.map((p) => p.text).join("\n\n"),
  audioDialogId: "antiquarian_journal_009",
  voiceActor: "antiquarian",
  loreReveals: ["entity_voltari", "concept_voltari_transmissions"],
  paragraphs: j009_paragraphs,
  totalDurationSec: sumDuration(j009_paragraphs),
};

// ══════════ JOURNAL 010 — The Oracle's Last Argument ══════════

const j010_paragraphs: JournalParagraph[] = [
  {
    audioDialogId: "jrnl_010_p1",
    text: "The Oracle was not called the Oracle in his own lifetime. He was called Tev. Tev Kareel. He was a civil engineer on a colony world I am not going to name, because the name is classified by forces that no longer exist and I respect the forms.",
    emotion: "warm",
    stageDirection: "Warm. He is remembering a friend.",
    estimatedDurationSec: 16.4,
  },
  {
    audioDialogId: "jrnl_010_p2",
    text: "Tev made one argument his entire life, in many different ways. The argument was this: who you are is not where you came from. Who you are is what you choose. What you protect. What you refuse to trade. What you carry into the next room.",
    emotion: "proud",
    estimatedDurationSec: 16.0,
  },
  {
    audioDialogId: "jrnl_010_p3",
    text: "The institutions of his time hated this argument. They preferred the version where identity was heritable and verifiable and could be printed on a card. Tev made his argument anyway, in every room that would hold him, for forty years.",
    emotion: "wry",
    estimatedDurationSec: 14.2,
  },
  {
    audioDialogId: "jrnl_010_p4",
    text: "His last argument was made in a council chamber where the final decision about clone citizenship was being debated. He walked in uninvited, held up a child's drawing of a sun — his own child's drawing, from thirty years earlier — and said: this is what identity looks like. Someone made it. Someone kept it. Someone remembered where she had put it. The biology is irrelevant. The keeping is the thing.",
    emotion: "confessional",
    estimatedDurationSec: 24.0,
  },
  {
    audioDialogId: "jrnl_010_p5",
    text: "The council rejected the argument. Tev died three years later without ever learning that the Collector had secretly taken his DNA, without consent, and seeded it into what would become the Awakened Clones. The clones have been proving his argument with their lives for seventeen thousand years. He never got to hear that his argument won.",
    emotion: "grief",
    estimatedDurationSec: 20.0,
  },
  {
    audioDialogId: "jrnl_010_p6",
    text: "General Binath-VII of the Awakened Clones would like someone to tell him. I am telling you so that, if the opportunity comes, you can be the one.",
    emotion: "tender",
    estimatedDurationSec: 9.6,
  },
];

const j010: AntiquarianJournalEntry = {
  id: "journal_010",
  title: "The Oracle's Last Argument",
  epoch: "age_of_privacy",
  unlockCondition: "clones_oracle_legacy_shared",
  textContent: j010_paragraphs.map((p) => p.text).join("\n\n"),
  audioDialogId: "antiquarian_journal_010",
  voiceActor: "antiquarian",
  loreReveals: ["entity_tev_kareel", "concept_oracle_argument"],
  paragraphs: j010_paragraphs,
  totalDurationSec: sumDuration(j010_paragraphs),
};

export const JOURNAL_EXPANSION_1: AntiquarianJournalEntry[] = [
  j006, j007, j008, j009, j010,
];
