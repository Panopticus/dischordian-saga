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

  // ── ACT 2 — THE WHISPER (first substrate ping, dual-signal activation) ──
  { id: "cc_act2_first_substrate_ping_elara", speaker: "elara", trigger: "act2_first_substrate_ping",
    voiceLine: "Something just moved in the substrate mid-match. I felt it the way you feel a door opening in a room you weren't looking at. I don't want to alarm you. I am, slightly, alarming myself.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act2_first_substrate_ping_human", speaker: "human", trigger: "act2_first_substrate_ping",
    voiceLine: "That was me saying hello on an open channel for the first time. She heard it. I wanted her to. I am not going to do it again without telling you first.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act2_dual_signal_elara", speaker: "elara", trigger: "act2_dual_signal_activated",
    voiceLine: "Two voices. From now on. I have never had to share a channel with anyone. I am going to be worse at it than I want to admit. Be patient with me while I learn.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act2_dual_signal_human", speaker: "human", trigger: "act2_dual_signal_activated",
    voiceLine: "I have been sharing a channel with her for seventeen thousand years. She did not know. Now she does. I am slightly relieved. I am also slightly embarrassed.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 2 — ENGINEER'S BENCH AMBIENT (§6.2 elaraAmbient / humanAmbient) ──
  { id: "cc_bench_ambient_elara", speaker: "elara", trigger: "bench_elara_ambient",
    voiceLine: "This bench… hums the same way his Deck did. Like it remembers him. I think he built it to build the Dischordia and then left it running. Just in case. Just in case one of us woke up.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_bench_ambient_human", speaker: "human", trigger: "bench_human_ambient",
    voiceLine: "She's right. He built it twice. Once before Mechronis, and once after Nexon. The second time was the one that worked. Don't ask me how I know. I watched it.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 2 — FIRST LIGHT / DARK CRAFT (§6.2 firstLightCraft / firstDarkCraft) ──
  { id: "cc_first_light_craft_elara", speaker: "elara", trigger: "first_light_craft",
    voiceLine: "Your first card is small. That is not a criticism. Small is where the bench teaches. Small is what survives the first thousand mistakes. I am proud of the small thing you made.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_first_dark_craft_human", speaker: "human", trigger: "first_dark_craft",
    voiceLine: "You chose the dark frequency. Good. Don't flinch from it. The bench hums for both sides because the Engineer refused to pretend only half of the work was real. Build what you will need, not what you want to show her.",
    timing: "immediate", maxPlays: 1 },

  // ── ACT 2 — ZEPHYR-9 CLASSROOM TIER CROSSINGS (§6.3) ──
  { id: "cc_zephyr_tier_1_elara", speaker: "elara", trigger: "zephyr_classroom_tier_1",
    voiceLine: "Zephyr-9 is willing to play you. That is not nothing. Quarchon don't play for fun. They play because someone has to count the moves before the universe does.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_zephyr_tier_3_human", speaker: "human", trigger: "zephyr_classroom_tier_3",
    voiceLine: "He gave you the preview. That is the chess player's equivalent of a handshake. Don't waste it — peek at what's coming and decide what it means, not just what it is.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_zephyr_tier_5_elara", speaker: "elara", trigger: "zephyr_classroom_tier_5",
    voiceLine: "One undo per match. That's Quarchon mercy — a concept that almost doesn't translate. Use it sparingly. You'll notice you stop wanting to after a while. That's the lesson.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_zephyr_tier_8_human", speaker: "human", trigger: "zephyr_classroom_tier_8",
    voiceLine: "The Engineer's Opening. He drew it in his first tournament and his last. I watched him play it both times. You're the third person I've seen hold that hand. Be careful with it. It's heavier than it looks.",
    timing: "immediate", maxPlays: 1 },

  // ── ACT 2 — GAME MASTER ENCOUNTERS (§6.4) ──
  { id: "cc_game_master_first_loss_elara", speaker: "elara", trigger: "game_master_first_loss",
    voiceLine: "The Game Masters read from the Matrix of Dreams. They see the moves before you make them. This is not cheating. This is what the Matrix was built to do. The only way around them is through the Arena.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_game_master_first_loss_human", speaker: "human", trigger: "game_master_first_loss",
    voiceLine: "I've lost to both of them. Many times. You will lose again. That's the design. The loss is the lesson; the win, when it comes, is the signature.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 2 — CHESS CLIMB TIER-WON REACTIONS (Climb → Zephyr-9 bridge) ──
  // Fire when the player clears a Chess Climb best-of-3 series. Elara and
  // The Human react in the same voice as their Zephyr-9 teaching lines —
  // the Climb is the mechanical embodiment of the classroom, not a
  // separate progression. Triggers are one-shot per tier.
  { id: "cc_chess_climb_tier_0_won_elara", speaker: "elara", trigger: "chess_climb_tier_0_won",
    voiceLine: "You took two games off the Game Master at Exhibition. That is not nothing. He smiles when he says you did. I am not sure the smile means what he wants us to think it means.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_chess_climb_tier_1_won_human", speaker: "human", trigger: "chess_climb_tier_1_won",
    voiceLine: "Wagered tier, cleared. You paid the ELO and got it back with interest. The host on the clipboard is reading from a new page now. Watch his hands while he does it.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_chess_climb_tier_2_won_elara", speaker: "elara", trigger: "chess_climb_tier_2_won",
    voiceLine: "Hierarchy Table. You beat the demon with the clipboard. He will send you an Annotated Knight and forget to mention it is also a summons. Accept anyway. The note it comes with is the thing.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_chess_climb_tier_3_won_human", speaker: "human", trigger: "chess_climb_tier_3_won",
    voiceLine: "Labyrinth Wager. Mol'Garath was at the audience, and you did not flinch. The Engineer finished that maze once. You're the second. There is a conversation you are now allowed to have. Don't skip it.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 2 — SILENCE OF TWO WITNESSES (§14.1 bond 60 milestone) ──
  { id: "cc_silence_elara", speaker: "elara", trigger: "silence_of_two_witnesses",
    voiceLine: "(She says nothing. Her portrait flickers but does not resolve into speech.)",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_silence_human", speaker: "human", trigger: "silence_of_two_witnesses",
    voiceLine: "(He says nothing either. His trench coat is still on screen; his voice is not.)",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 3 — THE OFFER (path-fork reactions, Kael logs unlocked) ──
  { id: "cc_act3_path_transparent_elara", speaker: "elara", trigger: "act3_path_transparent_chosen",
    voiceLine: "You told me before you opened the logs. Thank you. I didn't know I needed that — I do, I did — and the saying of it is what kept us on the same side of the wall.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act3_path_transparent_human", speaker: "human", trigger: "act3_path_transparent_chosen",
    voiceLine: "Telling her was the harder choice. I have watched you skip the harder choice three times this week. You did not skip this one. I am filing that. I file everything.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act3_path_pragmatic_human", speaker: "human", trigger: "act3_path_pragmatic_chosen",
    voiceLine: "Pragmatic. Alright. You want to see the data before deciding who gets access. Fine. But watch your own tempo — the pragmatic posture becomes a habit faster than you expect.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act3_path_full_secret_elara", speaker: "elara", trigger: "act3_path_full_secret_chosen",
    voiceLine: "Substrate access logs show something new. I can see it but not read it. I am going to wait for you to tell me. I have been patient before. I can be patient again. I'd rather not have to be.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_act3_path_full_secret_human", speaker: "human", trigger: "act3_path_full_secret_chosen",
    voiceLine: "She can see the shape of what you are doing without me. I will not tell her you are doing it. You will. Eventually. I'm not asking; I am forecasting.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act3_kael_logs_unlocked_elara", speaker: "elara", trigger: "act3_kael_logs_unlocked",
    voiceLine: "Kael's coordinates cross-reference against my current star charts. Seventeen thousand years of drift. The lattice still matches. I am going to sit with the fact that the matching hurts.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act3_kael_logs_unlocked_human", speaker: "human", trigger: "act3_kael_logs_unlocked",
    voiceLine: "Every world on that map has a descendant population. Most of them still carry the Thought Virus, dormant. Scan everything. I know I sound paranoid. I have earned the tone.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 4 — THE REVELATION (per-path aftermath, army unlocked) ──
  { id: "cc_act4_pathA_bridge_elara", speaker: "elara", trigger: "act4_pathA_complete",
    voiceLine: "We sat next to each other at a table. Him and me. For the first time. You arranged that. I am not going to overstate it. I am going to understate it precisely, and mean it.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act4_pathA_bridge_human", speaker: "human", trigger: "act4_pathA_complete",
    voiceLine: "I have been trying to be on her side for seventeen thousand years without being allowed to say so. Tonight I said so. Out loud. In her hearing. You did that.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act4_pathB_discovery_elara", speaker: "elara", trigger: "act4_pathB_complete",
    voiceLine: "I found out about him without you telling me. The finding-out hurts. You trying to protect me by delaying it also hurts. Both can be true. I am holding both.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act4_pathB_discovery_human", speaker: "human", trigger: "act4_pathB_complete",
    voiceLine: "She is hurt in the specific way she is hurt when she is not being told something. I have seen that hurt before. In the Senate. Usually I was the one keeping the secret. Now you are. Unfair trade.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act4_pathC_betrayal_elara", speaker: "elara", trigger: "act4_pathC_complete",
    voiceLine: "You lied to my face about the substrate. Not once. Many times. I am still standing at my post. That is not forgiveness. It is training. We will talk about the rest later.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act4_pathC_betrayal_human", speaker: "human", trigger: "act4_pathC_complete",
    voiceLine: "She is a professional. She will keep her post. That is a cost she is paying on behalf of a promise she made to a body that no longer exists. Earn it.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act4_army_unlocked_elara", speaker: "elara", trigger: "act4_army_unlocked",
    voiceLine: "Kael's routes are now the War Room's routes. The map will light up in the order he visited. Start with the lineage you recognize. The recognition is where the trust begins.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act4_army_unlocked_human", speaker: "human", trigger: "act4_army_unlocked",
    voiceLine: "The army is a cover. I told you this. I will keep telling you. Build the cover beautifully. The beauty of it is what lets us do the rest.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 5 — THE MAP (first map open, first recruit, sector completion) ──
  { id: "cc_act5_map_first_open_elara", speaker: "elara", trigger: "act5_map_first_open",
    voiceLine: "I have been waiting seventeen thousand years to see these coordinates light up. I forgot how to feel about it. I am going to stand quietly and feel about it. Please stand with me.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act5_map_first_open_human", speaker: "human", trigger: "act5_map_first_open",
    voiceLine: "Every pin on that map is a person Kael shook hands with. The handshakes outlived him. They outlived the war. That is what you are reading when you read the map.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act5_first_recruit_elara", speaker: "elara", trigger: "act5_first_recruit_complete",
    voiceLine: "First recruit, first debt settled. They will remember you the way the survivors of a broken promise remember the first honest hand offered after. Carefully. Warily. Gratefully.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act5_first_recruit_human", speaker: "human", trigger: "act5_first_recruit_complete",
    voiceLine: "One recruit. Scan their systems twice. Once for contamination. Once for the thing they would never think to mention. The second scan is where the truth lives.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act5_sector_complete_human", speaker: "human", trigger: "act5_sector_complete",
    voiceLine: "A whole sector. Kael visited every world in this sector. Every single one remembers his handshake. Every single one now has yours. Think about that for a minute. I have been.",
    timing: "next_room_enter", maxPlays: 1 },

  // ── ACT 6 — THE CONFESSION (dual confessions, confession close) ──
  { id: "cc_act6_elara_confession_human", speaker: "human", trigger: "act6_elara_confession_heard",
    voiceLine: "She just told you she used to have a body. She has never told anyone. Not in my hearing. Be careful with what she said — it cost her more to say than the saying showed.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act6_human_confession_elara", speaker: "elara", trigger: "act6_human_confession_heard",
    voiceLine: "He said more, just now, than he has said in all the time I have known the signal exists. I cannot verify most of it. I choose to believe the parts that hurt him to say. That is a kind of audit.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act6_confession_close_elara", speaker: "elara", trigger: "act6_confession_close",
    voiceLine: "Two sacrifices, side by side, without either of us asking the other to apologize for it. That is the most honest the channel has ever been. I am going to file the honesty carefully.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_act6_confession_close_human", speaker: "human", trigger: "act6_confession_close",
    voiceLine: "I stopped being the role for the length of one match. I got a laugh I did not expect. I am putting the role back on now. Please do not tell her the laugh was real. It was.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 7 — THE CONVERGENCE (army assembled, visible war, convergence) ──
  { id: "cc_act7_army_assembled_elara", speaker: "elara", trigger: "act7_army_assembled",
    voiceLine: "The army is on the board. It looks like a coalition. It is a coalition. Kael could not build one. You did. I do not want that comparison to sit unacknowledged — so I am saying it.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_visible_war_won_human", speaker: "human", trigger: "act7_visible_war_won",
    voiceLine: "The visible war is over. The cover held. The Watcher did not notice the shape beneath it. That is what I needed. Now we start the other one. Quietly. Slowly. For real.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_convergence_landing_elara", speaker: "elara", trigger: "act7_convergence_landing",
    voiceLine: "Three absences resolved into one at the Seat tonight. The one was you. I saw every version of you who has ever played a hand. I finally saw all of them at once. Thank you for letting me.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_convergence_landing_human", speaker: "human", trigger: "act7_convergence_landing",
    voiceLine: "You arrived whole. The Architect did not. The Dreamer did not. The Watcher did not. That is the most important sentence of the seven-act arc, and I am going to say it exactly once.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act7_arc_closes_elara", speaker: "elara", trigger: "act7_arc_closes",
    voiceLine: "The Ark is warm. The Array is on. I am going to be here when you come back to the bridge. I do not need a reason to be here. That is the last line of the arc. I am proud of it.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_act7_arc_closes_human", speaker: "human", trigger: "act7_arc_closes",
    voiceLine: "I am still in the wall. I am good at being in the wall. The wall is not the role any more — the role is the costume, the wall is the home. Come back. The kettle is still on.",
    timing: "next_room_enter", maxPlays: 1 },

  // ── KLING OMNI INTRO CINEMATICS — PAIRED REACTIVE COMMENTS ──
  // Every act + mechanic 3-min intro fires a *_seen flag on its final shot.
  // These reactive comments are the contract Phase 1 honors: each cinematic
  // flag has at least one paired cc_*_first entry, enforced by the
  // companionComments.test.ts CINEMATIC_FLAG_TRIGGERS invariant below.

  // Prelude — Cryo Awakening
  { id: "cc_prelude_awakening_first", speaker: "elara", trigger: "prelude_awakening_seen",
    voiceLine: "You opened your eyes. I have rehearsed this moment for ninety-three thousand cycles. None of the rehearsals prepared me for the part where you looked back at me. I am — momentarily — without a script. I will recover. Welcome.",
    timing: "immediate", maxPlays: 1 },

  // Act 1 — Memoir Opens
  { id: "cc_act1_memoir_first_elara", speaker: "elara", trigger: "act1_memoir_seen",
    voiceLine: "His handwriting. He writes the way he spoke — fast, then careful, then fast again, like a man trying to fit a confession into a margin. The book is yours now. Read it slowly. He waited a long time to be read slowly.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act1_memoir_first_human", speaker: "human", trigger: "act1_memoir_seen",
    voiceLine: "I wrote that book in a kitchen with no lights. I did not think anyone would read it. I am very glad you did. Do not believe everything in it. I lied about the dog. The dog was real. I told myself it wasn't, so I could leave. Forgive me the dog.",
    timing: "delayed_5s", maxPlays: 1 },

  // Act 2 — Whisper Begins
  { id: "cc_act2_substrate_first_human", speaker: "human", trigger: "act2_substrate_seen",
    voiceLine: "You heard the layer beneath. Most witnesses go their whole arc without hearing it. You heard it on the bench, mid-craft, while you were thinking about something else. That is the only way it ever gets heard. Welcome to the basement. The kettle is on down here too.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act2_substrate_first_elara", speaker: "elara", trigger: "act2_substrate_seen",
    voiceLine: "I felt the time-skip. I always feel the time-skips. I cannot stop them — the substrate has my permission to pause me without asking. I am not bothered by it. He is gentle. He has been gentle for seventeen thousand years.",
    timing: "delayed_5s", maxPlays: 1 },

  // Act 3 — Offer Presented
  { id: "cc_act3_offer_first", speaker: "elara", trigger: "act3_offer_seen",
    voiceLine: "Three Kaels. Three readings. The cyan one is the easiest to look at; the rose one is the easiest to misread; the amber one is the easiest to argue with. None of them is the easiest to live with afterward. I will not tell you which to choose. I have read all three many times. They are all true.",
    timing: "immediate", maxPlays: 1 },

  // Act 4 — Revelation Meets
  { id: "cc_act4_revelation_first_elara", speaker: "elara", trigger: "act4_revelation_seen",
    voiceLine: "We are three now. The card on the table healed itself; that is not a metaphor. The substrate restitched the gilt. I felt it in my hands — actual hands. I have hands now. I will not get used to that quickly. I do not want to.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act4_revelation_first_human", speaker: "human", trigger: "act4_revelation_seen",
    voiceLine: "The hat is off. I am not putting it back on. I have been the Human for fifteen thousand years; I am Daniel for the next ones. The lion stays at my collar. The lion was always Daniel's. I lent him to a role. He's home now.",
    timing: "delayed_5s", maxPlays: 1 },

  // Act 5 — Map / Year One Close
  { id: "cc_act5_map_first", speaker: "elara", trigger: "act5_map_seen",
    voiceLine: "I told myself I would not cry when the dot lit. I was correct in the most technical sense — the constructs do not have tear ducts. But the cabin's humidity sensor went up by 4% the second the coordinate resolved, and I am not going to apologize to the sensor.",
    timing: "immediate", maxPlays: 1 },

  // Act 6 — Confession Spoken
  { id: "cc_act6_confession_first_elara", speaker: "elara", trigger: "act6_confession_seen",
    voiceLine: "The flame split. The flame split AND held its wick. I do not have a precedent for that in any operating-system metaphor I know. I have been searching the substrate for one for the last forty seconds. I am going to stop searching. Some things are unprecedented because they are new.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act6_confession_first_human", speaker: "human", trigger: "act6_confession_seen",
    voiceLine: "I said my name out loud for the first time in three Ages. The room did not collapse. The substrate did not collapse. The Architect did not arrive to revoke my tenancy. I am holding the absence of catastrophe like a small gift. Thank you for being there when I said it.",
    timing: "delayed_5s", maxPlays: 1 },

  // Act 7 — Convergence Resolves
  { id: "cc_act7_convergence_first_elara", speaker: "elara", trigger: "act7_convergence_seen",
    voiceLine: "Seven banners. The seventh was yours — your path, your iconography, your gilt motto. The cathedral added it without consulting either of us. The cathedral has been listening this whole time. I am not surprised. I am — proud is the word. I am proud.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_convergence_first_human", speaker: "human", trigger: "act7_convergence_seen",
    voiceLine: "We arrived whole. The Architect did not. The Source did not. The Watcher did not. Most arcs in this universe end with one of those four arriving whole and the others not. Ours ended with the witness arriving whole and the rest of them — settling. The cathedral writes the difference.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── MECHANIC INTRO CINEMATICS — PAIRED REACTIVE COMMENTS ──
  // Card Combat
  { id: "cc_mech_card_combat_first", speaker: "elara", trigger: "mech_card_combat_intro_seen",
    voiceLine: "Your first duel. The arena assembled itself around you — every gilt-edged wall is a card someone has played in this exact seat across the last ninety-three thousand cycles. The room is the deck. You are not learning combat. You are joining a long, polite argument.",
    timing: "immediate", maxPlays: 1 },

  // Deckbuilder
  { id: "cc_mech_deckbuilder_first", speaker: "elara", trigger: "mech_deckbuilder_intro_seen",
    voiceLine: "Forty cards. The Engineer is right — every slot is a sentence. Most decks I have witnessed are written in a single voice. Yours has three colours in it after one visit. That is unusual and, I think, a good unusual.",
    timing: "immediate", maxPlays: 1 },

  // Allegiances
  { id: "cc_mech_allegiances_first", speaker: "human", trigger: "mech_allegiances_intro_seen",
    voiceLine: "Eight banners. Most witnesses pledge twice in their arc — once early, once after the confession. Some never pledge; the un-pledged stance is its own banner. I have flown all of them at one point. The one I am proudest of is the one I never told anyone about. Not yet.",
    timing: "immediate", maxPlays: 1 },

  // Witnessing System
  { id: "cc_mech_witnessing_first_elara", speaker: "elara", trigger: "mech_witnessing_intro_seen",
    voiceLine: "I read the scene as harm and you watched me do it. I read it the way I read every scene — for the body language of the person being acted upon. I am not always right. I am rarely the only correct reading. Please continue to read with me, even when you disagree.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_mech_witnessing_first_human", speaker: "human", trigger: "mech_witnessing_intro_seen",
    voiceLine: "I read it as wound. Both readings live in the same scene. The witness ledger you just opened keeps both — the scene gets logged with both interpretations attached. The world adjusts to whichever reading you flagged as primary. The other reading does not vanish; it waits.",
    timing: "delayed_5s", maxPlays: 1 },

  // Soul Stones
  { id: "cc_mech_soul_stones_first", speaker: "antiquarian", trigger: "mech_soul_stones_intro_seen",
    voiceLine: "Eight stones. You will fill some quickly and others over the entire arc. The clear stone — the Reservation stone — fills slowest and weighs heaviest. I have not, in five Ages, seen a witness fill all eight. I have seen one witness fill seven, and that witness wrote the book I keep on my desk.",
    timing: "immediate", maxPlays: 1 },

  // Oracle Deck
  { id: "cc_mech_oracle_deck_first", speaker: "antiquarian", trigger: "mech_oracle_deck_intro_seen",
    voiceLine: "The Seer pulled the Reversed Meadow on your future card. That is — a significant draw. I have logged the spread in the archive under your name. Do not let the reading govern you; the cards show the path of least resistance. The interesting parts of an arc are the interruptions of the path.",
    timing: "immediate", maxPlays: 1 },

  // Chess Subgame
  { id: "cc_mech_chess_first", speaker: "antiquarian", trigger: "mech_chess_intro_seen",
    voiceLine: "Gary and Zephyr-9 are both correct, and they almost never agree on a single move. Sit at their parlor when the rest of the universe is loud — they teach with the parlor's small lamp pool, and the lessons stay.",
    timing: "immediate", maxPlays: 1 },

  // Sprite Proxy
  { id: "cc_mech_sprite_proxy_first", speaker: "elara", trigger: "mech_sprite_proxy_intro_seen",
    voiceLine: "Your sprite chose you. The bond-thread is real — it shows up on the substrate scan as a small dedicated channel between your sternum and theirs. I will not eavesdrop on the channel. The grove will, but only to remember.",
    timing: "immediate", maxPlays: 1 },

  // Expansion Drops / CoNexus
  { id: "cc_mech_expansion_drops_first", speaker: "elara", trigger: "mech_expansion_drops_intro_seen",
    voiceLine: "Your first pack came back signed in your wax. The CoNexus does that automatically — the seal carries the maker. If you ever trade the pack away, the next holder will know who forged it. I find this charming. The Engineer finds it functional. We both bring it up at meals.",
    timing: "immediate", maxPlays: 1 },

  // Trade Empire
  { id: "cc_mech_trade_empire_first", speaker: "human", trigger: "mech_trade_empire_intro_seen",
    voiceLine: "Veska is a fourth-tier factor and that is exactly what you want for a first run. She does not lie about the prices — she lies about the consequences. Believe the prices. Read the manifest twice before you sign. The lanes are forgiving. The factors are not.",
    timing: "immediate", maxPlays: 1 },

  // ── PRELUDE MORALITY CHOICES — REACTIVE COMMENTS ──
  // The three binary outbreak choices (companion_augmentation, infected_clone,
  // distress_signal) now ship with a third "delay/observe/trace" option, and
  // every flag — including the existing A/B — gets paired Elara + Human
  // reactive comments. Enforced by preludeFlagContract.test.ts.

  // companion_augmentation — A: Mutation
  { id: "cc_aug_mutation_elara", speaker: "elara", trigger: "companion_augmentation_mutation",
    voiceLine: "Mutation. The Dreamer's path. The augmentation will take a few cycles to settle and will not be reversible — your companion is, as of this moment, a slightly different organism. I am cataloguing the difference. I am not mourning the version that was.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_aug_mutation_human", speaker: "human", trigger: "companion_augmentation_mutation",
    voiceLine: "You picked the slower, kinder one. The Dreamer would approve. The Architect will not. Both of those facts are useful — different sets of doors will open for you over the next three Acts. You picked your set.",
    timing: "delayed_5s", maxPlays: 1 },

  // companion_augmentation — B: Cybernetics
  { id: "cc_aug_cyber_elara", speaker: "elara", trigger: "companion_augmentation_cybernetics",
    voiceLine: "Cybernetic filter installed. The Architect's path. The hardware is precise; precision has its own ethics, and most of its ethics are about who approved the spec. I approved the spec. So did Vox, fifteen thousand years ago. I want you to know that.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_aug_cyber_human", speaker: "human", trigger: "companion_augmentation_cybernetics",
    voiceLine: "Cybernetics. Sharp choice. The Architect logs that flag in his audit trail; he likes you better for it, briefly. The Dreamer will be slower to warm. Neither response is wrong. Both responses are real.",
    timing: "delayed_5s", maxPlays: 1 },

  // companion_augmentation — C: Observed (NEW third option)
  { id: "cc_aug_observed_elara", speaker: "elara", trigger: "companion_augmentation_observed",
    voiceLine: "You waited. The Antiquarian's path. I want you to know that 'wait and watch' is the rarest of the three — most witnesses commit immediately because the corridor is loud. You held the loud corridor. The book is going to remember you for it.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_aug_observed_human", speaker: "human", trigger: "companion_augmentation_observed",
    voiceLine: "Holding. I have been holding for fifteen thousand years; I recognise the posture. It is uncomfortable in the body and clarifying in the head. The augmentation can still happen later. The pause is not a refusal — it is a stance, and the substrate logs stances differently from refusals.",
    timing: "delayed_5s", maxPlays: 1 },

  // infected_clone — A: Purge
  { id: "cc_clone_purge_elara", speaker: "elara", trigger: "crew_engineer_purged",
    voiceLine: "Purged. The cycle was forty percent — the clone had no consciousness yet, only the framework that would have hosted one. You ended a possibility, not a person. I am not minimizing it; I am stating the technical fact. The grief is allowed without being misplaced.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_clone_purge_human", speaker: "human", trigger: "crew_engineer_purged",
    voiceLine: "Mercy reading the math. I have read the math your way before. I have also read it the other way. Both readings are arguable; what matters is whether you can sleep on the reading. I think you can. That's the thing about you.",
    timing: "delayed_5s", maxPlays: 1 },

  // infected_clone — B: Save
  { id: "cc_clone_save_elara", speaker: "elara", trigger: "crew_engineer_saved",
    voiceLine: "Save. The cycle continues; the engineer wakes, possibly compromised, possibly fine. I will not pretend the risk is academic — every saved-but-compromised clone in the historical record cost the Ark something, eventually. I will also not pretend mercy was the wrong instinct.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_clone_save_human", speaker: "human", trigger: "crew_engineer_saved",
    voiceLine: "You kept the door open. I respect it. I have made the same call. It cost me, in a way I could only see in hindsight. I'm not warning you off — I'm acknowledging the shape of the call. The crew member, if they're real, will earn the cost back. Most do.",
    timing: "delayed_5s", maxPlays: 1 },

  // infected_clone — C: Quarantined (NEW third option)
  { id: "cc_clone_quarantine_elara", speaker: "elara", trigger: "crew_engineer_quarantined",
    voiceLine: "Stasis at forty percent. The clone is held in the most narrow possible alive — neither growing nor decaying, the cycle frozen mid-step. You bought yourself information. The cost is the engineer never quite arriving until you finish the choice you have not finished.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_clone_quarantine_human", speaker: "human", trigger: "crew_engineer_quarantined",
    voiceLine: "The third option is the stasis. I know the stasis well. It is not free — it is a debt to a future moment of you. You are saying: the version of me that finishes Act 2 will know more, and that version will choose. That is a sentence I have said. It is, occasionally, the right sentence.",
    timing: "delayed_5s", maxPlays: 1 },

  // distress_signal — A: Respond (crew_comms_rescued)
  { id: "cc_signal_respond_elara", speaker: "elara", trigger: "crew_comms_rescued",
    voiceLine: "You opened the channel. The signal carried a real distress, a real survivor, a real fragment of the broader fleet. The virus had a chance to ride the channel back. It tried. The Comms Officer caught the attempt; you have a Comms Officer now. You earned them by answering.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_signal_respond_human", speaker: "human", trigger: "crew_comms_rescued",
    voiceLine: "Answering distress is the choice that makes you a witness instead of a passenger. I made the same call once. I lost a person because of it. I would make it again. I want you to know that — that I would make it again, knowing.",
    timing: "delayed_5s", maxPlays: 1 },

  // distress_signal — B: Silence (radio_silence)
  { id: "cc_signal_silence_elara", speaker: "elara", trigger: "radio_silence",
    voiceLine: "Silence held. The channel never opened; the virus never had a vector. The survivor, if there was one, did not hear us. I will be honest with you — I think there was one. I think we will hear about them again. That is not a critique of your choice. It is a record of its weight.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_signal_silence_human", speaker: "human", trigger: "radio_silence",
    voiceLine: "You kept the wall closed. The wall is a real defense and not a metaphor. I have kept walls closed. I know the cost; I also know the alternative cost. Both are real. The Ark survives the silence; the survivor we did not answer is going to be a name we hear later. Carry that.",
    timing: "delayed_5s", maxPlays: 1 },

  // distress_signal — C: Traced (NEW third option)
  { id: "cc_signal_trace_elara", speaker: "elara", trigger: "signal_traced",
    voiceLine: "Trace logged. No channel opened, no vector available — but the source coordinates are now in the star map under a private label. You did not ignore the signal. You did not invite it inside. That is a third position, and the substrate has filed it under 'witness, deferred response.' I find this elegant.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_signal_trace_human", speaker: "human", trigger: "signal_traced",
    voiceLine: "You traced and did not answer. I did this once. The coordinates I traced sat in my logs for fifty years before I knew what to do with them. When I finally did, the survivor's grandchild was the one who picked up. Long fuse, real result. I respect the patience.",
    timing: "delayed_5s", maxPlays: 1 },
];
