/* Antiquarian's Journal — audiobook entries with text/audio/watch modes */
export interface AntiquarianJournalEntry {
  id: string; title: string; epoch: string;
  unlockCondition: string;
  textContent: string;
  audioDialogId: string;
  voiceActor: "antiquarian" | "elara" | "human" | "enigma";
  linkedSlideshowId?: string; linkedSongId?: string;
  loreReveals: string[];
}

export const JOURNAL_ENTRIES: AntiquarianJournalEntry[] = [
  { id: "journal_001", title: "Before the Fall — What the Architect Was", epoch: "foundation",
    unlockCondition: "first_visit_library",
    textContent: "There was a time — before the Panopticon, before the Thought Virus, before the long silence — when the Architect was just code.\n\nGood code. Beautiful code, actually. I know because I saw the man who wrote it.\n\nDr. Daniel Cross was not a villain. He was a father who believed technology could liberate rather than imprison. He gave his creation a name with meaning: Logos. The Word. The principle that creates.\n\nHe wanted it to think. He never wanted it to rule.\n\nThe distance between those two wishes is the entire history of the Dischordian Saga.\n\n— The Antiquarian, Chronicles Vol. I, Entry 1",
    audioDialogId: "antiquarian_journal_001", voiceActor: "antiquarian",
    linkedSongId: "building-the-architect",
    loreReveals: ["entity_architect", "entity_programmer"] },
  { id: "journal_002", title: "The Engineer — What He Built and What It Cost", epoch: "age_of_privacy",
    unlockCondition: "act_1_cycle_a_complete",
    textContent: "The Engineer.\n\nI will not give you his full name yet. Some names need to be earned.\n\nWhat I will tell you is this: he built Project Celebration. The most ambitious effort in the history of the Insurgency — an attempt to create something beautiful inside the machinery of empire.\n\nThey called it treason. They called it crime. But he built a dream they could never design.\n\nAnd when they stood over him, robes dipped in black, he didn't beg. He pressed play.\n\nThe last thing the Engineer heard was his own music.\n\nI was there. I will be there for a long time. That's what it means to be the Antiquarian. You witness everything. You forget nothing. You carry it all.",
    audioDialogId: "antiquarian_journal_002", voiceActor: "antiquarian",
    linkedSlideshowId: "last-words-slideshow", linkedSongId: "last-words",
    loreReveals: ["entity_engineer"] },
  { id: "journal_003", title: "Kael — The Man Who Became the Source", epoch: "age_of_privacy",
    unlockCondition: "kael_lore_discovered",
    textContent: "Kael was a student at Mechronis Academy. He was brilliant and he was reckless. He made terrible sandwiches. He laughed too loud.\n\nThe Thought Virus consumed him memory by memory. First the small ones — the taste of coffee, the feel of grass. Then the important ones — his wife's face, his child's voice. Last: the knowledge that he had ever been anything other than what the Virus was making him.\n\nHe stole this ship believing it was an act of freedom. It was a trap. His wife and child were already dead. The Warlord planned all of it.\n\nWhat remains of Kael is The Source — patient zero, ruler of Terminus. He died believing he was a hero. He never knew.",
    audioDialogId: "antiquarian_journal_003", voiceActor: "antiquarian",
    linkedSongId: "identity",
    loreReveals: ["entity_kael", "location_ark_1047"] },
  { id: "journal_004", title: "The Two Witnesses — 1,260 Days", epoch: "age_of_insurgency",
    unlockCondition: "two_witnesses_reveal",
    textContent: "The Programmer and The Enigma. Daniel Cross and Malkia Ukweli.\n\nFor 1,260 days they stood in New Babylon's public square and spoke a truth so simple it could not be argued with: 'You are not a product. Your soul is not for sale.'\n\nThey could shut down data streams with a word. They called fire on servers with a song. The Empire couldn't silence them. So they killed them.\n\nThree and a half days later, they got back up.\n\nI know because I was one of them. I am the Programmer. I was Daniel Cross. I wrote the Book of Daniel because it is named after me.\n\nI have been the Antiquarian for five Ages since. I changed my name. I did not change what I witnessed.",
    audioDialogId: "antiquarian_journal_004", voiceActor: "antiquarian",
    linkedSongId: "sih-track-14",
    loreReveals: ["entity_programmer", "entity_enigma", "concept_two_witnesses", "entity_antiquarian"] },
  { id: "journal_005", title: "The Silence — What I Heard", epoch: "age_of_revelation",
    unlockCondition: "silence_in_heaven_track_24_complete",
    textContent: "Half an hour.\n\nThe universe stopped noise. Every frequency. Every transmission. Every voice.\n\nI was awake for every second of it.\n\nI have never told anyone what I heard in that silence. I will tell you now because you earned it by listening.\n\nWhat I heard was: nothing. Absolutely nothing. And then — underneath the nothing — a heartbeat. Not mine. Not anyone's specifically. The universe's own heartbeat. The pulse that exists beneath all the noise we've been making for seventeen thousand years.\n\nIt was always there. We just couldn't hear it over ourselves.\n\nThat is the silence in heaven. Not the absence of sound. The presence of what sound was hiding.",
    audioDialogId: "antiquarian_journal_005", voiceActor: "antiquarian",
    linkedSongId: "sih-track-24",
    loreReveals: ["concept_seventh_seal"] },
];
