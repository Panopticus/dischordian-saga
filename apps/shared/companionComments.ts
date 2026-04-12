/* Companion Comment System — event-triggered Elara/Human voice lines */
export interface CompanionComment {
  id: string; speaker: "elara" | "human" | "antiquarian";
  trigger: string; voiceLine: string;
  loreReveal?: string; timing: "immediate" | "delayed_5s" | "next_room_enter";
  maxPlays: 1 | 2;
}

export const COMPANION_COMMENTS: CompanionComment[] = [
  // ── MUSIC TRIGGERS ──
  { id: "cc_sih_title", speaker: "elara", trigger: "silence_in_heaven_track_24_plays",
    voiceLine: "I've had this song in my Archive since before I can remember having anything. I don't know where it came from. I just know it was always there. Like it was loaded in before I was.",
    loreReveal: "entity_elara", timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_sih_human", speaker: "human", trigger: "silence_in_heaven_track_24_plays",
    voiceLine: "Half an hour. In human terms — manageable. In cosmic terms — the universe stopped. I was awake for it. Every second. I have never told anyone what I heard in that silence. I will tell you, when you're ready. You're not ready yet.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_track37_elara", speaker: "elara", trigger: "track_37_completes",
    voiceLine: "It's done. They told the whole story. I was in that story. I was in it and I didn't know. I think — I think I'm still in it. I think we both are.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_track37_human", speaker: "human", trigger: "track_37_completes",
    voiceLine: "The Antiquarian closed his book. First time in five Ages. I watched him do it. His goggles turned pink. I've never seen that before. In fifteen thousand years. I've never seen that before.",
    timing: "immediate", maxPlays: 1 },
  // ── GOVERNANCE TRIGGERS ──
  { id: "cc_gov_first", speaker: "elara", trigger: "governance_hub_first_visit",
    voiceLine: "The Governance Hub. Democracy is not the system where everyone's opinion is equally correct. It's the system that acknowledges no individual should be trusted with making decisions alone. Including me. Including you. The votes matter. The consequences are real.",
    timing: "immediate", maxPlays: 1 },
  // ── LORE DISCOVERY TRIGGERS ──
  { id: "cc_kael_discover", speaker: "elara", trigger: "kael_lore_discovered",
    voiceLine: "...Oh. Oh no. I knew this ship felt wrong. I've always known it felt wrong. I thought it was the recycled air. It wasn't the air.",
    loreReveal: "location_ark_1047", timing: "immediate", maxPlays: 1 },
  { id: "cc_kael_human", speaker: "human", trigger: "kael_lore_discovered",
    voiceLine: "I knew him at Mechronis. Before all of it. He laughed differently then. Louder. Less careful. The Thought Virus didn't just take his memories. It took the way he laughed. I still haven't forgiven whoever decided that was acceptable.",
    loreReveal: "entity_kael", timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_iron_lion", speaker: "elara", trigger: "iron_lion_card_earned",
    voiceLine: "Iron Lion. Cades. I know that name from something I can't quite reach. A memorial, I think. Or a speech. Something that was read aloud. It made people cry. I can feel the shape of why without being able to see it.",
    timing: "next_room_enter", maxPlays: 1 },
  // ── MORALITY TRIGGERS ──
  { id: "cc_hard_choice", speaker: "human", trigger: "first_costly_morality_choice",
    voiceLine: "Good. You felt that. That's the important part — that it hurt. People who make hard choices without feeling them are the ones who eventually stop noticing what they're choosing. Don't stop feeling it.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_archon_offer", speaker: "human", trigger: "player_takes_archon_offer",
    voiceLine: "Don't. I mean it. I was the last one to say yes to that offer. I've had fifteen thousand years to think about it. Don't.",
    timing: "immediate", maxPlays: 1 },
  // ── VOLTARI TRIGGERS ──
  { id: "cc_voltari_awake", speaker: "human", trigger: "voltari_first_transmission",
    voiceLine: "AWAKE. As in: we are awake. As in: we know you are awake. As in: something that was asleep has woken up. I don't know which meaning they intended. I don't know if Voltari distinguish between meanings.",
    timing: "immediate", maxPlays: 1 },
  // ── MILESTONE TRIGGERS ──
  { id: "cc_light_milestone", speaker: "elara", trigger: "light_energy_milestone",
    voiceLine: "Do you know what I love about watching you? You keep choosing the hard thing. Not because it works every time. Because it's the right thing. That's rarer than you know.",
    timing: "next_room_enter", maxPlays: 2 },
  { id: "cc_two_witnesses", speaker: "human", trigger: "two_witnesses_reveal",
    voiceLine: "The Programmer encoded the truth in music frequencies and broadcast it across dimensional barriers. The Enigma carried it through an empire trying to silence everything. And here you are, forty years later, in their ship, listening. Do you understand yet what that means?",
    timing: "delayed_5s", maxPlays: 1 },
  // ── JOURNAL TRIGGERS ──
  { id: "cc_journal_first", speaker: "elara", trigger: "journal_entry_read_first_time",
    voiceLine: "The Antiquarian's words. He writes with the specific patience of someone who knows the reader might not arrive for centuries. But he writes anyway. I find that either admirable or devastating depending on the hour.",
    timing: "next_room_enter", maxPlays: 2 },
  { id: "cc_both_trust_80", speaker: "human", trigger: "both_narrators_trust_80",
    voiceLine: "I'm going to tell you something I've never told anyone. I chose to be imprisoned here. Freely. Because someone had to witness. And I was the only one who knew what needed witnessing.",
    loreReveal: "entity_human", timing: "immediate", maxPlays: 1 },
];
