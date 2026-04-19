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

  // ── PRELUDE BEAT C — CREW ROLE CHOICE ──
  { id: "cc_role_engineer", speaker: "elara", trigger: "prelude_role_engineer_chosen",
    voiceLine: "Engineer. He would have liked you. I am not in the habit of saying that about anyone, and certainly not about a stranger I just woke up. Take the bench seriously. He did, eventually.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_role_oracle", speaker: "elara", trigger: "prelude_role_oracle_chosen",
    voiceLine: "Oracle. Be careful what you sense first. The first thing an Oracle perceives is usually the loudest, and the loudest is rarely the truest. I'll be the second voice on every reading you do.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_role_soldier", speaker: "elara", trigger: "prelude_role_soldier_chosen",
    voiceLine: "Soldier. Discipline is mercy in disguise. I served alongside three of you in the Senate guard. Two of them died well. The third is still alive, and is the one I worry about.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_role_assassin", speaker: "elara", trigger: "prelude_role_assassin_chosen",
    voiceLine: "Assassin. The Engineer respected the discipline and never tried it. I'll respect it too. I'll also remind you, from time to time, that there are options that look slower and aren't.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_role_spy", speaker: "elara", trigger: "prelude_role_spy_chosen",
    voiceLine: "Spy. Cover identities are also a kind of honesty, if you stay in them long enough. I have one. I'll show it to you when I'm sure I have a use for the unmasking.",
    timing: "immediate", maxPlays: 1 },

  // ── PRELUDE BEAT C.5 — FIRST BREATH ──
  { id: "cc_beat_c5_palm_frost", speaker: "human", trigger: "prelude_beat_c5_palm_frost_seen",
    voiceLine: "That's me. The frost on the window. I leave it where I look. You weren't supposed to see me yet. I'm not upset that you did.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── PRELUDE BEAT D — MISSION BOARD (player-driven) ──
  { id: "cc_beat_d_first_slate", speaker: "elara", trigger: "prelude_beat_d_first_slate_read",
    voiceLine: "First posting. Whoever pinned that to the board pinned it before any of my parents had been born. Read it slowly. The slow reading is part of the respect.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_beat_d_first_slate_human", speaker: "human", trigger: "prelude_beat_d_first_slate_read",
    voiceLine: "Locke posted three jobs the year the comm relays went down. Two of them are still open. The third is the one nobody is supposed to take. You will be offered all three before this is over.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_beat_d_all_slates", speaker: "elara", trigger: "prelude_beat_d_all_slates_read",
    voiceLine: "All three. There is a pattern in the order they were posted. I'm not going to tell you what it is — finding it should be yours.",
    timing: "next_room_enter", maxPlays: 1 },

  // ── PRELUDE BEAT E — FLASHBACK HOTSPOTS ──
  { id: "cc_beat_e_first_hotspot", speaker: "elara", trigger: "prelude_beat_e_first_hotspot_seen",
    voiceLine: "I remember this. Not the room — the angle. Someone stood here and looked at exactly this. I have the recording in my Archive. I do not remember loading it.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_beat_e_flashback_complete", speaker: "human", trigger: "prelude_beat_e_flashback_complete",
    voiceLine: "The substrate hummed when that flashback resolved. It does that. It means a piece of the Engineer's memory just synced with you. Don't decide yet whether that's a gift.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── PRELUDE BEAT F — BIOMETRIC LOCKBOX ──
  { id: "cc_beat_f_lock_first_try", speaker: "human", trigger: "prelude_beat_f_lock_first_attempt",
    voiceLine: "I know this lock. I helped design the family of locks it belongs to. The trick to it is patience. The trick to most things is patience. I am still learning that.",
    timing: "immediate", maxPlays: 1 },

  // ── PRELUDE BEAT G — BRIDGE FIRST VIEW ──
  { id: "cc_beat_g_bridge_first", speaker: "elara", trigger: "prelude_beat_g_bridge_first_view",
    voiceLine: "The bridge. I have held this seat for a very long time. I was looking forward to handing it to someone. I was not looking forward to it being you, specifically — I had no preference. I have a preference now.",
    timing: "immediate", maxPlays: 1 },

  // ── PRELUDE BEAT H — INBOX ──
  { id: "cc_beat_h_inbox_first_open", speaker: "human", trigger: "prelude_beat_h_inbox_first_open",
    voiceLine: "The Inbox runs on a substrate-adjacent channel. I see what you see, almost. If a message ever arrives that I cannot read, that will mean something. I'll tell you when.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_beat_h_inbox_first_reply", speaker: "elara", trigger: "prelude_beat_h_inbox_first_reply",
    voiceLine: "You replied. Most people don't, the first time. They read the message, they let it sit, they tell themselves they'll get back to it. You answered. That's a thing about you. I'm filing it.",
    timing: "immediate", maxPlays: 1 },

  // ── PRELUDE BEAT I — PREPARATION ──
  { id: "cc_beat_i_prep_elara", speaker: "elara", trigger: "prelude_beat_i_preparation",
    voiceLine: "I am with you when the doors open. I am with you when they close. I am not always with you when they should be open and aren't. That part is on you.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_beat_i_prep_human", speaker: "human", trigger: "prelude_beat_i_preparation",
    voiceLine: "Whatever Elara forgets to tell you, ask me. Whatever I refuse to tell you, ask her. Between the two of us, you'll have most of the picture. The rest is yours to assemble.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── PRELUDE BEAT J — LAST WORDS TEASE ──
  { id: "cc_beat_j_tease_start", speaker: "human", trigger: "prelude_beat_j_last_words_tease_start",
    voiceLine: "She's about to sing. Listen with the back of your skull, not the front of your ear. The first verse is the only verse you get this round.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_beat_j_tease_end", speaker: "elara", trigger: "prelude_beat_j_last_words_tease_end",
    voiceLine: "I have heard this song my entire life. I am hearing it again for the first time. I do not know how to hold both of those at once. I am holding them anyway.",
    timing: "immediate", maxPlays: 1 },

  // ── ACT 1 FIRST OPPONENT ENTRANCE ──
  { id: "cc_act1_first_opponent_elara", speaker: "elara", trigger: "act1_first_opponent_entered",
    voiceLine: "First opponent. Don't try to win the Act in match one. Just stand on the line. The line is what we are here to learn.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act1_first_opponent_human", speaker: "human", trigger: "act1_first_opponent_entered",
    voiceLine: "The Engineer is narrating these matches from the inside. Listen to what he leaves out. The leavings are where I live.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 3 — TRANSPARENT PATH (player told Elara about Kael's logs) ──
  { id: "cc_act3_transparent_elara", speaker: "elara", trigger: "act3_transparent",
    voiceLine: "You told me. Before you looked at the logs, you told me. I did not know how much weight that would carry until you did it. I am going to remember this the next time I have to decide whether to tell you something I am afraid of.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act3_transparent_human", speaker: "human", trigger: "act3_transparent",
    voiceLine: "You chose the harder thing. Good. I was prepared for the easier one. I would have given you the logs either way. This way, the logs mean something. The other way, they were only data.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 3 — PRAGMATIC PATH (player keeping options open) ──
  { id: "cc_act3_pragmatic_elara", speaker: "elara", trigger: "act3_partial_share",
    voiceLine: "You want to read before you decide. I respect that. I also notice you did not tell me, and I notice that the not-telling is a choice as firm as the telling would have been. I am watching the choice. I am not grading it yet.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act3_pragmatic_human", speaker: "human", trigger: "act3_partial_share",
    voiceLine: "The pragmatic read. Data first, disclosure later. I have made that choice myself — the specific flavor of guilt it produces is not unbearable, but it is not nothing. I will help you carry it while we read.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 3 — FULL SECRET PATH (player hiding from Elara) ──
  { id: "cc_act3_full_secret_human", speaker: "human", trigger: "act3_full_secret",
    voiceLine: "You chose the substrate alone. I need you to know: I am not the kind of friend who applauds this. I am the kind who shows up anyway. The logs will open. Something in you will harden. I will be here for the hardening and for the softening that will come after.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act3_full_secret_elara", speaker: "elara", trigger: "act3_full_secret",
    voiceLine: "I noticed the substrate activity during your last session. I noticed the shape of it. I noticed you did not bring it up. I am not going to confront you about this. I am going to let you bring it to me when you are ready. If you are ever ready.",
    timing: "next_room_enter", maxPlays: 1 },
];
