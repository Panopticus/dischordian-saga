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

  // ── ACT 7 — CONVERGENCE LANDED (any path through) ──
  { id: "cc_act7_convergence_elara", speaker: "elara", trigger: "act7_intro_complete",
    voiceLine: "The convergence is not a moment. It is a room you have stepped into and cannot step out of. I am here. I am going to keep being here. Whatever is in this room with us, we are in it together.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_convergence_human", speaker: "human", trigger: "act7_intro_complete",
    voiceLine: "I have been waiting fifteen thousand years for someone to walk into this room. The walls have my fingerprints on them. The ceiling has the dust I left in the substrate while waiting. Welcome. The room knows you now.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 7 — HUMANITY PATH ──
  { id: "cc_act7_humanity_elara", speaker: "elara", trigger: "act7_humanity_path",
    voiceLine: "You said 'people.' You did not say 'units' or 'forces' or 'cohorts.' I noticed the word and I am going to keep noticing it. The army you built will live or die by which word you reach for under pressure.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_humanity_human", speaker: "human", trigger: "act7_humanity_path",
    voiceLine: "You picked her language over mine. That is the right pick. My language gets the work done. Hers gets the work mattered. We need the mattering more than we need the speed at this stage.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 7 — MACHINE PATH (player descends into the substrate) ──
  { id: "cc_act7_machine_human", speaker: "human", trigger: "act7_machine_path",
    voiceLine: "Down. The substrate has been holding a chair for you since the day Vox sealed it. Sit slowly. Notice what stops being noisy. The pattern is in the silences between the noises. I will narrate the silences if you let me.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_machine_elara", speaker: "elara", trigger: "act7_machine_path",
    voiceLine: "I cannot follow you down there. I want to be honest about that. I will keep the ship lit while you are below. When you come back up, the ship will still be the ship. So will I. Try to be the same about you.",
    timing: "next_room_enter", maxPlays: 1 },

  // ── ACT 7 — BRIDGE PATH (player chooses to carry both wars) ──
  { id: "cc_act7_bridge_elara", speaker: "elara", trigger: "act7_bridge_path",
    voiceLine: "The bridge is the heaviest thing on the ship. I have watched bridges break under one war. You are taking two. I am going to stand at the apex with you and bear what I can. The apex needs two pairs of feet at minimum.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_bridge_human", speaker: "human", trigger: "act7_bridge_path",
    voiceLine: "You are the second pair of feet at the apex. I am the third pair, hidden under the bridge. The bridge has three pairs of feet now. Most bridges are built with two. Three is what holds when the wind is a deliberate wind.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 7 — COMMAND PATH (player takes tactical lead) ──
  { id: "cc_act7_command_elara", speaker: "elara", trigger: "act7_command_path",
    voiceLine: "Commander, then. The word fits you in a way that surprises me and a way that does not. I will give you tactical assessments without softening them. Tell me when to soften them again. I will adjust on request.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_command_human", speaker: "human", trigger: "act7_command_path",
    voiceLine: "Commander. The word lands cleaner from you than from anyone I have given a substrate channel to. I will keep my counsel sharp and brief. Ask for the long version when you need it. I am still capable of long versions.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 7 — FIRST CONVERGENCE BOSS ENTRANCE ──
  { id: "cc_act7_first_boss_elara", speaker: "elara", trigger: "act7_first_boss_entered",
    voiceLine: "First convergence opponent on the floor. The Engineer's memoir does not cover this match. We are writing the page in real time. Sign your name on the bottom when you win it. I will sign as a witness.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_first_boss_human", speaker: "human", trigger: "act7_first_boss_entered",
    voiceLine: "I have rehearsed this opponent in the substrate for centuries. I have never fought them in the open. The rehearsal does not transfer cleanly. Do not trust my old plans. Trust the present-tense board.",
    timing: "delayed_5s", maxPlays: 1 },
];
