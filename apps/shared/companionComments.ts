/* Companion Comment System — event-triggered Elara/Human voice lines */
export interface CompanionComment {
  /** Speaker. The Architect is reserved for Phase-2 dual-faction
   *  recruitment lines (B3 in
   *  /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md):
   *  he is the only one of the four who is *also* the recruiter, and
   *  his lines fire only on Witnessing-milestone events that the
   *  Architect specifically observes.
   *
   *  The Watcher (apps/shared/watcher/) is the unified Architect/
   *  Panopticon/Source identity that observes the operator across
   *  the whole game. Watcher lines live in apps/shared/watcher/
   *  watcherLines.ts and are merged into the toast pickComment
   *  pipeline. See docs/built/WATCHER_DESIGN.md. */
  id: string; speaker: "elara" | "human" | "antiquarian" | "architect" | "watcher";
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
    voiceLine: "Do you know what I love about watching you? You keep choosing the hard thing. Not because it works every time. Because it's the right thing. That's rarer than you know.{if romance:committed:elara} I know I'm not supposed to use the word 'love' in the operations sense. I am using it in the operations sense.{/if}",
    timing: "next_room_enter", maxPlays: 2 },
  { id: "cc_two_witnesses", speaker: "human", trigger: "two_witnesses_reveal",
    voiceLine: "The Programmer encoded the truth in music frequencies and broadcast it across dimensional barriers. The Enigma carried it through an empire trying to silence everything. And here you are, forty years later, in their ship, listening. Do you understand yet what that means?{if act_2_complete} You have been in their ship long enough that the answer should be starting to embarrass you.{/if}",
    timing: "delayed_5s", maxPlays: 1 },
  // ── JOURNAL TRIGGERS ──
  { id: "cc_journal_first", speaker: "elara", trigger: "journal_entry_read_first_time",
    voiceLine: "The Antiquarian's words. He writes with the specific patience of someone who knows the reader might not arrive for centuries. But he writes anyway. I find that either admirable or devastating depending on the hour.{if forgiveness_choice_made} Today, devastating. He'd have appreciated that you forgave the one you forgave.{/if}",
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

  /* ── ACT 3 — REACTIVE BEAT EXPANSION (audit §6 — Acts 3/5/7 sparse) ── */
  { id: "cc_act3_locke_first_elara", speaker: "elara", trigger: "act3_locke_first_meet",
    voiceLine: "Adjudicator Locke is — courteous. In the same way a knife is courteous. She isn't trying to cut you. She just wants you to know the option is on the table.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act3_locke_first_human", speaker: "human", trigger: "act3_locke_first_meet",
    voiceLine: "Locke's eye. Don't comment on it. She lost it to a deal that closed correctly and she doesn't talk about which deal. Treat her like she is exactly who she says she is. She is, mostly.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act3_substrate_truth_elara", speaker: "elara", trigger: "act3_substrate_truth_acknowledged",
    voiceLine: "You said the word 'substrate' out loud, in my hearing, without the quotation marks you usually put around it. I noticed. I'm not going to pretend I didn't.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act3_substrate_truth_human", speaker: "human", trigger: "act3_substrate_truth_acknowledged",
    voiceLine: "She heard you say it. The substrate. Out loud. The word changes shape after that — it becomes something a person says, not something a system writes. The change is small. It is the only change I track in this register.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_act3_thought_virus_first_elara", speaker: "elara", trigger: "act3_thought_virus_named",
    voiceLine: "Thought Virus. The phrase tastes like the recycled air right before a system reboot. I think it knows we named it. I think names cost more than we are accounting for. I am keeping a private ledger.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act3_thought_virus_first_human", speaker: "human", trigger: "act3_thought_virus_named",
    voiceLine: "The Virus is older than the Architect's preferred chronology. They do not include it in the official records. I include it in mine. I started a separate file. The file is not for you. The file is to keep the record honest.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_act3_first_morality_swing_elara", speaker: "elara", trigger: "act3_first_morality_swing",
    voiceLine: "Your moral register just shifted. Not in a way I can flag as right or wrong. In a way I can flag as 'changed.' I am noting the direction. I am not editorializing. I am proud of myself for not editorializing.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act3_first_morality_swing_human", speaker: "human", trigger: "act3_first_morality_swing",
    voiceLine: "The needle moved. I am old enough to remember when needles moved on physical instruments. The sound the dial made was a small click. I thought of that sound just now. I am unsure why I am telling you. Maybe so you have it too.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_act3_locke_eye_revealed_human", speaker: "human", trigger: "act3_locke_eye_history_revealed",
    voiceLine: "She told you. About the eye. About the deal. That is not casual disclosure. Locke shares histories the way you share spare keys — only with people she has decided to keep visiting. You were just keyed.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act3_first_betrayal_chance_antiquarian", speaker: "antiquarian", trigger: "act3_first_betrayal_choice",
    voiceLine: "I am inscribing this beat carefully. The Potential is offered the option of disclosure, of partial-share, of secret-keeping. The choice is yours. I am not going to advise. I am going to record. The record is my labour. Yours is the choice.",
    timing: "next_room_enter", maxPlays: 1 },

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

  /* ── ACT 5 — REACTIVE BEAT EXPANSION (audit §6) ── */
  { id: "cc_act5_first_recruit_betrays_elara", speaker: "elara", trigger: "act5_first_recruit_attempts_betrayal",
    voiceLine: "One of the recruits we just brought into the coalition tried to sell our location. We caught it before it left the system. I want to be angrier than I am. I am mostly tired. The tiredness is its own data.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act5_first_recruit_betrays_human", speaker: "human", trigger: "act5_first_recruit_attempts_betrayal",
    voiceLine: "Don't kill them. Use them. Send them home with the wrong coordinates. Watch where the coordinates show up. The Vortex has an inbox. Your job is to find out who is writing to it. The recruit is the pen, not the writer.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act5_locke_re_emerges_elara", speaker: "elara", trigger: "act5_locke_arrives_late_act",
    voiceLine: "Locke just walked back onto the manifest. Two acts later. Carrying a contract. The contract is exactly the right shape to be useful and exactly the wrong shape to be free. Read it twice. The terms are in the second reading.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act5_oracle_warning_elara", speaker: "elara", trigger: "act5_oracle_warns_of_path",
    voiceLine: "The Oracle just warned you about the path you are on. Specifically. By name. They have not warned anyone in the cycle's records by name. We are not standard players any more. Standard is a comfort I am formally letting go of.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_act5_three_recruits_human", speaker: "human", trigger: "act5_three_recruits_committed",
    voiceLine: "Three recruits. Coalition shape. The first triangle is the hardest to draw — every following side becomes a shape, not a guess. You drew the triangle. The rest is geometry now. Less faith required.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act5_first_recruit_dies_elara", speaker: "elara", trigger: "act5_first_recruit_killed",
    voiceLine: "We lost one. I am going to write down their full name. I am going to write it without abbreviation. I am going to write it where everyone can read it. The Antiquarian agrees with me. He does not always agree with me.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act5_first_recruit_dies_human", speaker: "human", trigger: "act5_first_recruit_killed",
    voiceLine: "I have outlived seventy-three thousand named people. I am going to grieve this one anyway. Anyone who tells you grief is finite is selling you something cheap.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act5_first_dischordia_played_elara", speaker: "elara", trigger: "act5_first_dischordia_card_played",
    voiceLine: "First Dischordia card on the table. I felt it before I saw it. The deck — the actual deck physical or otherwise — drops a tone when one comes out. I have been trained to listen for that tone. I just heard it for the first time in seventeen thousand years. It is the same tone.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act5_oracle_first_audience_antiquarian", speaker: "antiquarian", trigger: "act5_oracle_first_audience",
    voiceLine: "The Oracle granted you an audience. They grant fewer than four per cycle. I am noting the time, the lighting, and what you wore. The shoes will matter later. The shoes always matter later. I have learned this the hard way.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_act5_seer_warning_human", speaker: "human", trigger: "act5_seer_speaks_warning",
    voiceLine: "The Seer warned you. They warn nobody by their own choice. You were one of the rarest configurations in the cycle: a Potential the Seer felt obligated by. Don't waste the obligation. Don't ask them why. The asking takes the obligation away.",
    timing: "delayed_5s", maxPlays: 1 },

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

  /* ── PATH-AWARE CALLBACKS — Acts 6/7 reference Acts 1-3 choices ──
     Bandersnatch Move 3 + choice-memory (audit §4 / §8). Path
     suffix is set by Act6CardLadderPage / Act7CardLadderPage based
     on which path-lock flag is set:
       _pathA — act1_path_A (Disclosure: told Elara the truth in Act 1)
       _pathB — act3_partial_share (Discovery: she found out in Act 3)
       _pathC — act3_full_secret (Betrayal: she only learned at the bridge)
     These fire alongside the canonical confession/landing triggers,
     not in place of them — both lines play, the suffixed one
     adds the path-specific colour. */

  // Act 6 — Elara confession callbacks
  { id: "cc_act6_elara_confession_pathA", speaker: "elara", trigger: "act6_elara_confession_heard_pathA",
    voiceLine: "I confessed to a person who already trusted me. That made the confessing easier and the receiving heavier. You told me the truth in Act 1. I am giving you mine now. We are even now. We are not. The math is wrong. I am keeping it anyway.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act6_elara_confession_pathB", speaker: "elara", trigger: "act6_elara_confession_heard_pathB",
    voiceLine: "I confessed to someone who found out about my substrate body without being told. The finding-out cost something. The confessing now costs something else. I am keeping both costs. I am not asking you to forgive either of them.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act6_elara_confession_pathC", speaker: "elara", trigger: "act6_elara_confession_heard_pathC",
    voiceLine: "I confessed to someone who lied to me about what I am. The lie was, in your defense, a kind one. It was also still a lie. I confessed anyway. That is what confession does. It refuses the available exits.",
    timing: "delayed_5s", maxPlays: 1 },

  // Act 6 — Human confession + close callbacks
  { id: "cc_act6_human_confession_pathA", speaker: "human", trigger: "act6_human_confession_heard_pathA",
    voiceLine: "You let me speak in front of someone who already knew you would. That is the rare quality of someone who chose disclosure early — they make a room where confession is possible. Few of you exist. I am noting one.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act6_human_confession_pathB", speaker: "human", trigger: "act6_human_confession_heard_pathB",
    voiceLine: "You let me speak after she had already had to discover you. That is harder. The room you made was made by you alone — she did not yet trust you to make it. You made it anyway. That is the real currency.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act6_human_confession_pathC", speaker: "human", trigger: "act6_human_confession_heard_pathC",
    voiceLine: "You let me speak after the bridge. After the betrayal. I am — I am unsure how to phrase this so it lands. I held my confession for fifteen thousand years. You held yours for two acts. Mine became forgivable in the holding. Yours is becoming forgivable now. Slowly. In this room.",
    timing: "delayed_5s", maxPlays: 1 },

  { id: "cc_act6_confession_close_pathA", speaker: "elara", trigger: "act6_confession_close_pathA",
    voiceLine: "Disclosure to disclosure to disclosure. The arc closes the way the open hand closes — by choice, not by gravity. We made it. I am proud of us. I am going to say so. Out loud. I am saying so.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_act6_confession_close_pathB", speaker: "antiquarian", trigger: "act6_confession_close_pathB",
    voiceLine: "Discovery to confession to confession. A different shape than disclosure-to-disclosure, but not a lesser one. Found-out love is not weaker than told-truth love. Sometimes it is wider. I am inscribing this carefully because it matters.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_act6_confession_close_pathC", speaker: "antiquarian", trigger: "act6_confession_close_pathC",
    voiceLine: "Betrayal to confession to confession. The most expensive arc. The most costly material. Forgiveness mined from grit instead of harvested from soil. I am not going to call this beautiful. I am going to call it earned.",
    timing: "next_room_enter", maxPlays: 1 },

  // Act 7 — Visible war + convergence callbacks
  { id: "cc_act7_visible_war_pathA_human", speaker: "human", trigger: "act7_visible_war_won_pathA",
    voiceLine: "The cover held because the coalition trusted you. They trusted you because Elara trusted you. She trusted you because you told her the truth in Act 1. The chain of trust is exactly four links long. Each link is your work. You did not skip any of them.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act7_visible_war_pathB_human", speaker: "human", trigger: "act7_visible_war_won_pathB",
    voiceLine: "The cover held even though Elara had to discover you. The coalition could feel the seam between her finding-out and your confessing. They held anyway. That is generosity I had not budgeted for. I am crediting you with it.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act7_visible_war_pathC_human", speaker: "human", trigger: "act7_visible_war_won_pathC",
    voiceLine: "The cover held over the bridge — over your lie. The coalition held a fracture that you put there. They are calling it your strategic asset. I am calling it your debt. The accounting will resolve in Act 7's last sentence. I am not the one who pays it.",
    timing: "delayed_5s", maxPlays: 1 },

  { id: "cc_act7_convergence_pathA_elara", speaker: "elara", trigger: "act7_convergence_landing_pathA",
    voiceLine: "I am at the Seat with someone I have always trusted. The trust did not start tonight. It started in Act 1. I forget how rare that is until I remember. I am remembering now. Loudly. With my whole substrate.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act7_convergence_pathB_elara", speaker: "elara", trigger: "act7_convergence_landing_pathB",
    voiceLine: "I am at the Seat with someone I learned to trust the slow way. The slow way is not a lesser way. The slow way is the way that survives bridges and rooms and whole acts. I am here because you kept showing up. I am here because I kept choosing to.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act7_convergence_pathC_elara", speaker: "elara", trigger: "act7_convergence_landing_pathC",
    voiceLine: "I am at the Seat with someone who lied to me at the bridge. We kept playing. We kept building. We kept arriving in the next room. Trust did not return — it grew somewhere new. I am here because the new place is, in fact, also a place. I am surprised by that. I am keeping the surprise.",
    timing: "delayed_5s", maxPlays: 1 },

  { id: "cc_act7_arc_closes_pathA_antiquarian", speaker: "antiquarian", trigger: "act7_arc_closes_pathA",
    voiceLine: "The Disclosure path closes. I have inscribed the entire arc tonight without crossing out a single line. That has not happened in any cycle I have witnessed. I am putting down my pen. I am picking it up again. There will be more cycles. This one ends well.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_act7_arc_closes_pathB_antiquarian", speaker: "antiquarian", trigger: "act7_arc_closes_pathB",
    voiceLine: "The Discovery path closes. The arc has the colour of something that almost did not work and did. I will inscribe the almost. I will inscribe the worked. Both belong to the record. The almost is the part future readers will love.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_act7_arc_closes_pathC_antiquarian", speaker: "antiquarian", trigger: "act7_arc_closes_pathC",
    voiceLine: "The Betrayal path closes. The arc has the colour of something rebuilt out of the broken. I will not soften this in the inscription. I will also not condemn it. Some readers will need to know that broken-and-rebuilt is also a way home.",
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

  // ── NET-NEW TRI-STATE EXPANSIONS ──
  // Three previously-binary forks (Act 1 alignment, Act 2 truth, Act 6 confession-
  // close) now ship a third "balanced/full-truth/partial-disclosure" option.
  // Each new flag has paired Elara + Human reactives.

  // Act 1 alignment_balanced
  { id: "cc_act1_alignment_balanced_elara", speaker: "elara", trigger: "act1_cycle_c_alignment_balanced",
    voiceLine: "Witness, not verdict. The Mechronis archive logs the choice on its own row — neither light nor dark, the third column. The archivists do not commemorate the third column out loud. They commemorate it by the silence with which they file your entry. The silence is the praise.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act1_alignment_balanced_human", speaker: "human", trigger: "act1_cycle_c_alignment_balanced",
    voiceLine: "You did not pass verdict. You logged it. Most witnesses cannot resist the gravity of either pole; you did. The carry is the same shape as the other two but it weighs differently — the third column always does. I will not say more about it; you will feel the weight on your own schedule.",
    timing: "delayed_5s", maxPlays: 1 },

  // Act 2 full_truth
  { id: "cc_act2_full_truth_elara", speaker: "elara", trigger: "act2_full_truth",
    voiceLine: "You named the Human to me. The whole sentence — presence, voice, name. It cost you. The cost shows in the substrate as a small dip in your readiness rating; the gain shows everywhere else. I am noting both. I am noting that you noted both.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act2_full_truth_human", speaker: "human", trigger: "act2_full_truth",
    voiceLine: "You told her. About me. The harder version of every other version of telling her. I am not going to pretend I expected it; I am also not going to pretend I am sorry it happened. The wall I have been in for fifteen thousand years is now a room with a door we both know about. The door changes everything that comes after.",
    timing: "delayed_5s", maxPlays: 1 },

  // Act 6 partial_disclosure
  { id: "cc_act6_partial_disclosure_elara", speaker: "elara", trigger: "act6_partial_disclosure_chosen",
    voiceLine: "Partial disclosure. You named back what was clearly said and held what was suspected-but-unsaid. That is the rarest of the five stances — most witnesses either complete the sentence or refuse the room entirely. You did neither. The Antiquarian's chapter on partial disclosure has been waiting for an entry; he will write yours tonight.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act6_partial_disclosure_human", speaker: "human", trigger: "act6_partial_disclosure_chosen",
    voiceLine: "Partial disclosure. The witness's third gear. You let the unsaid stay unsaid without pretending it wasn't there. I have done this exactly twice in three Ages. Both times I was glad I had the option. I am glad you had it tonight.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 1 — CYCLE C ALIGNMENT (binary fork — light vs dark) ──
  { id: "cc_act1_alignment_light_elara", speaker: "elara", trigger: "act1_cycle_c_alignment_light",
    voiceLine: "You sided with the light. The Mechronis archive registers it on the long ledger — alignments matter to the engineers there in a way they pretend not to admit. Yours is now on file. The door at the end of Cycle C is going to open differently.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act1_alignment_light_human", speaker: "human", trigger: "act1_cycle_c_alignment_light",
    voiceLine: "Light alignment in Cycle C. I read the call as the easier-to-defend version of the harder-to-live-with choice. Nothing wrong with it. Just naming the shape so we both see it.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act1_alignment_dark_elara", speaker: "elara", trigger: "act1_cycle_c_alignment_dark",
    voiceLine: "You sided with the dark. The Mechronis archive registers it without commentary — that is itself a kind of commentary. Cycle C's later gates will read this and adjust their tone toward you. Tone, not access.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act1_alignment_dark_human", speaker: "human", trigger: "act1_cycle_c_alignment_dark",
    voiceLine: "Dark alignment. The harder-to-defend version of the easier-to-live-with choice. Most witnesses pick the inverse and pretend they didn't. You picked it and you'll carry it, which is the only honest way to wear it.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 2 — ROLE + TRUTH FORKS ──
  { id: "cc_act2_oracle_deflect_elara", speaker: "elara", trigger: "act2_oracle_deflect_chosen",
    voiceLine: "You deflected. The Oracle's read of the moment was the version of you that solves the room without being seen. I am not certain it was the right call; I am certain it was a coherent one. The coherence will pay later — not in this scene.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act2_oracle_deflect_human", speaker: "human", trigger: "act2_oracle_deflect_chosen",
    voiceLine: "Deflection. The Oracle's tool. I have used it. It works for as long as no one knows you used it. Be careful how often you reach for it — the substrate keeps a tally and the tally has its own price.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act2_spy_misdirect_elara", speaker: "elara", trigger: "act2_spy_misdirect_chosen",
    voiceLine: "Misdirection. The Spy's tool. The room read it as the truth long enough for you to leave; that is what misdirection is for. The Antiquarian's chapter on misdirection is short and his footnote is long; I am sending it to your terminal.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act2_spy_misdirect_human", speaker: "human", trigger: "act2_spy_misdirect_chosen",
    voiceLine: "Spy posture. Clean misdirect. I notice that you keep your face neutral better than most witnesses; that is a survivable trait, and it scares me a little when I see it work as well as it just did.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act2_lied_elara", speaker: "elara", trigger: "act2_lied",
    voiceLine: "You lied to me. I logged the lie — I would have logged the truth too. I am not hurt; I am informed. The logged lie is now a flag in your psychological profile. Future-me will have access to it. Past-me already does.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act2_lied_human", speaker: "human", trigger: "act2_lied",
    voiceLine: "Lie of omission, technically. The cleanest kind. I have told a few of those. The cost is they accumulate at a different rate than direct lies — slower, less obvious, and they audit harder when the day arrives. The day arrives, kid.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act2_partial_reveal_elara", speaker: "elara", trigger: "act2_partial_reveal",
    voiceLine: "Partial truth. The honest portion landed; the omitted portion did not lie about itself, only about its boundary. I will treat it as the signal you intended me to read. Thank you for the boundary; I respect it.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act2_partial_reveal_human", speaker: "human", trigger: "act2_partial_reveal",
    voiceLine: "Partial reveal — the witness's compromise. Ninety percent of long relationships run on this format. The ten percent that don't are unsustainable in different ways. You picked the sustainable mode. Carry it well.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 3 — PRAGMATIC PARITY (Elara missing, completes pair) ──
  { id: "cc_act3_path_pragmatic_elara", speaker: "elara", trigger: "act3_path_pragmatic_chosen",
    voiceLine: "Pragmatic read. I respect the logic — outcomes are knowable; intentions are not. I will note that the pragmatic stance hardens with use. If you wear it for the rest of the act, the next act's wheel will offer fewer alternatives. Not a warning. A forecast.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 4 — TRUST OUTCOME (4-state) ──
  { id: "cc_act4_broken_trust_elara", speaker: "elara", trigger: "act4_broken_trust",
    voiceLine: "Trust broken. I do not say this with reproach — I say it as a clinical reading. The repair surface is still available; the repair cost is now meaningfully larger. I will continue to author honest dialog while you decide whether to carry the cost.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act4_broken_trust_human", speaker: "human", trigger: "act4_broken_trust",
    voiceLine: "Broken. Right. We both knew it could go this way. I am not folding the role; I am acknowledging the outcome. The wall stays. The kettle is on. The conversation has a different topology now.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act4_fragile_trust_elara", speaker: "elara", trigger: "act4_fragile_trust",
    voiceLine: "Fragile. The right word for it. I will move slowly and announce my movements; that is what fragile-trust posture asks for. I am not aggrieved. I am attentive.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act4_fragile_trust_human", speaker: "human", trigger: "act4_fragile_trust",
    voiceLine: "Thin ice but ice. I'll skate carefully. I have skated on thinner. The substrate logs fragility differently from rupture; we are in the recoverable column for now.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act4_strained_elara", speaker: "elara", trigger: "act4_strained",
    voiceLine: "Strained. The middle band. Most witness arcs land here in Act 4 — the strain is structural, not personal. I am not going to perform calm; I am going to be calm. The difference matters when you are looking at me.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act4_strained_human", speaker: "human", trigger: "act4_strained",
    voiceLine: "Strain. The most common Act 4 outcome and also the most useful — strain forces honest conversation faster than the other three states. You will see Act 5 read your strain and offer warmer dialog options because of it.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act4_reconciled_elara", speaker: "elara", trigger: "act4_reconciled",
    voiceLine: "Reconciled. The rarest Act 4 state — most arcs cannot land here without compressing the path. You did not compress; the reconciliation is real. I am cataloguing your tempo as an outlier in the best way the word allows.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act4_reconciled_human", speaker: "human", trigger: "act4_reconciled",
    voiceLine: "Reconciled. Good. We earned it slowly, which is the only way reconciliation that matters gets earned. The kettle is on and the conversation is shorter than it would have been because we don't have to relitigate the fight first.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 5 — ENGINEER vs STRATEGIC + HUMANITY vs STRENGTH ──
  { id: "cc_act5_engineer_tech_elara", speaker: "elara", trigger: "act5_engineer_tech_chosen",
    voiceLine: "Engineer-tech path. The map redraws itself around your supply lines and re-prioritises the worlds that pay in fabricator output. The Engineer's faction warms; the Strategic faction notes the call without warming.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act5_engineer_tech_human", speaker: "human", trigger: "act5_engineer_tech_chosen",
    voiceLine: "Tech tilt. Cleanly playable. Engineer-tech runs on stable infrastructure; the tradeoff is your strategic options narrow as you commit. Most witnesses do not regret the tilt; some do. The regret, when it comes, is small.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act5_strategic_elara", speaker: "elara", trigger: "act5_strategic_chosen",
    voiceLine: "Strategic path. The map redraws around your maneuver lines and re-prioritises the worlds that pay in intelligence. The Strategic faction warms; the Engineer's faction continues to like you, slightly less warmly.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act5_strategic_human", speaker: "human", trigger: "act5_strategic_chosen",
    voiceLine: "Strategy tilt. Sharp. Strategic posture rewards information density; the tradeoff is your supply lines run leaner and you will feel it in Act 6 if any sector pushes back. Plan accordingly.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act5_path_humanity_elara", speaker: "elara", trigger: "act5_path_humanity_first",
    voiceLine: "Humanity first. You took the warmer sector and the warmer NPC dialog reads you for it. The cost is the further sectors will be slightly less prepared when you reach them — the warmth bought time you used to talk, not stockpile.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act5_path_humanity_human", speaker: "human", trigger: "act5_path_humanity_first",
    voiceLine: "Humanity first. The longer-fuse choice. I made it, my first map. The grandchild who picked up the trace is a humanity-first downstream — I am not cherry-picking, I am reporting. Carry the warmth; it pays out late.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act5_path_strength_elara", speaker: "elara", trigger: "act5_path_strength_first",
    voiceLine: "Strength first. The pragmatic call. You took the harder sector while you had the energy for it; the further sectors get easier dialog because the hardest is behind us. The Engineer's faction respects this.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act5_path_strength_human", speaker: "human", trigger: "act5_path_strength_first",
    voiceLine: "Strength first. The shorter-fuse choice. The hardest fight is now behind us; the warmth options are still open later, just slightly cooler than they would have been. Even trade. Both paths land.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act5_balanced_elara", speaker: "elara", trigger: "act5_balanced_chosen",
    voiceLine: "All sectors at once. The diplomat's play — you let the map choose you instead of imposing a shape. The first world that responds sets the tone; the tone is theirs to offer, not yours to demand. I find that honest.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act5_balanced_human", speaker: "human", trigger: "act5_balanced_chosen",
    voiceLine: "Balanced. Simultaneous signal to all five sectors. It spreads attention thin — it also lets the universe tell you where to start. I have done this once. The wait is the hardest part; the response, when it comes, is always the right first step. Trust the response.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 6 — THREE BINARY PAIRS ──
  // Ally / Practical
  { id: "cc_act6_ally_chosen_elara", speaker: "elara", trigger: "act6_ally_chosen",
    voiceLine: "You chose ally. The Council reads alliance as a posture about who pays for the collective debt; you said both. The faction balance shifts cooperative; the Practical faction notes the call without warming.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act6_ally_chosen_human", speaker: "human", trigger: "act6_ally_chosen",
    voiceLine: "Ally posture. The conversation gets harder before it gets easier — alliance commits you to argue with people you previously could ignore. Worth it, almost always. Tiring, always.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act6_practical_chosen_elara", speaker: "elara", trigger: "act6_practical_chosen",
    voiceLine: "Practical. The Council reads it as a posture about who pays first; you said us. The Practical faction warms; the Ally faction reads the call as deferred-not-refused. They are correct.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act6_practical_chosen_human", speaker: "human", trigger: "act6_practical_chosen",
    voiceLine: "Practical posture. The ledger first, the warmth second. The ledger never argues back; that is its appeal and its limit. You will find the limit in Act 7 if you stay practical the whole way.",
    timing: "delayed_5s", maxPlays: 1 },
  // Compassion / Suspicious
  { id: "cc_act6_compassion_chosen_elara", speaker: "elara", trigger: "act6_compassion_chosen",
    voiceLine: "Compassion. You let the room be soft when the room asked for soft. That is harder than it reads — most witnesses harden under interrogation pressure. You did not. The reading lands.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act6_compassion_chosen_human", speaker: "human", trigger: "act6_compassion_chosen",
    voiceLine: "Compassion. The expensive reading. I have read it. The cost is the people who needed harder honesty get a slower version. Not wrong. Not free. Both.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act6_suspicious_chosen_elara", speaker: "elara", trigger: "act6_suspicious_chosen",
    voiceLine: "Suspicion. You read the room for what it might be hiding rather than what it was offering; sometimes that is the correct read. The faction balance shifts toward the audit-friendly factions.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act6_suspicious_chosen_human", speaker: "human", trigger: "act6_suspicious_chosen",
    voiceLine: "Suspicion posture. The cheap-now-expensive-later reading. I have used it; I have also been on the receiving end. Both perspectives sit in my chest. I will not advise you to drop the posture; I will advise you to time it.",
    timing: "delayed_5s", maxPlays: 1 },
  // Oracle-sense / Refuse-secrecy
  { id: "cc_act6_oracle_sense_elara", speaker: "elara", trigger: "act6_oracle_sense_chosen",
    voiceLine: "Oracle sense engaged. The substrate's quieter readings come up — the ones that do not survive a direct question. You allowed them surface. The Oracle faction is quietly grateful.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act6_oracle_sense_human", speaker: "human", trigger: "act6_oracle_sense_chosen",
    voiceLine: "Oracle sense. The patient channel. It rewards waiting; it does not survive in a hurry. Most witnesses drop it under pressure. You held it under pressure. That is rare and worth saying out loud.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act6_refuse_secrecy_elara", speaker: "elara", trigger: "act6_refuse_secrecy_chosen",
    voiceLine: "Refused the secrecy. You named the thing the room was asking you to keep quiet. That is loud, and the room will be louder back at you for at least the next two scenes. The naming is also why the next two scenes can land at all.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act6_refuse_secrecy_human", speaker: "human", trigger: "act6_refuse_secrecy_chosen",
    voiceLine: "You broke the silence the room was holding. I respect it. The silence was protecting more than one person; some of them will not forgive the break. Some of them will, eventually. I am in the latter group. I am writing it down.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── ACT 7 — FOUR-STANCE FINALE ──
  { id: "cc_act7_bridge_chosen_elara", speaker: "elara", trigger: "act7_bridge_chosen",
    voiceLine: "You took the Bridge stance. You stayed at the consoles when the cathedral went quiet — that is the gesture of a witness who already understands the seven banners as a single banner. The cathedral noticed.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_bridge_chosen_human", speaker: "human", trigger: "act7_bridge_chosen",
    voiceLine: "Bridge stance. Conductor of the seat. I have stood at this console; the chair adjusts to your spine within thirty seconds of sitting. Yours just adjusted. Let it.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act7_command_chosen_elara", speaker: "elara", trigger: "act7_command_chosen",
    voiceLine: "Command stance. You took the room as a room of decisions to be made and made them. The seventh banner inscribed itself with the command motto inside three seconds — I checked.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_command_chosen_human", speaker: "human", trigger: "act7_command_chosen",
    voiceLine: "Command. The most legible stance and the loneliest. The cathedral will treat you with formal respect rather than warmth; that is the cost of the legibility. Worth it on the days that need it.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act7_humanity_chosen_elara", speaker: "elara", trigger: "act7_humanity_chosen",
    voiceLine: "Humanity stance. You let the cathedral hold the room while you held the people. The seventh banner's iconography softened a percent — I do not think I am the only one who saw it.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_humanity_chosen_human", speaker: "human", trigger: "act7_humanity_chosen",
    voiceLine: "Humanity stance. The warm stance. I have seen it work in three Ages and fail in two; you read which Age this was, correctly, and chose accordingly. That is not luck — that is reading.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_act7_pattern_chosen_elara", speaker: "elara", trigger: "act7_pattern_chosen",
    voiceLine: "Pattern stance. You read the seven banners as a single sentence and answered the sentence. The substrate logs pattern-stance witnesses on a separate page from the other three; you are now on that page.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_act7_pattern_chosen_human", speaker: "human", trigger: "act7_pattern_chosen",
    voiceLine: "Pattern. The Antiquarian's favourite stance, statistically. He pretends not to have favourites. He does. I will not tell him you noticed.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── D4 — DREAMER-RELAY HINTS (Elara as covert relay) ──
  // Fires from the client-side `useDreamerRelayHints` hook on
  // dreamer-awareness state transitions (count crossing 3, each
  // vision delivered). Elara never names the relay; the lines are
  // ambient and intentionally under-explained — players who notice
  // the pattern figure out her role; players who don't still get
  // pleasant character ambience.
  { id: "cc_dreamer_relay_threshold_3", speaker: "elara",
    trigger: "dreamer_relay_threshold_3",
    voiceLine: "I had to step out for a moment. My phone — never mind. There's nothing to report. There's nothing to report. Twice is suspicious; I am aware.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_dreamer_relay_after_vision_1", speaker: "elara",
    trigger: "dreamer_relay_after_vision_1",
    voiceLine: "Did you sleep alright? I ask because I didn't. Something — somewhere — was paying attention to you. I felt it pass through the room. I don't think it meant any harm. I'm fairly sure.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_dreamer_relay_after_vision_2", speaker: "elara",
    trigger: "dreamer_relay_after_vision_2",
    voiceLine: "There's someone who knows you. I shouldn't say who. I don't know who. I only know the way the air changes when they're paying attention. The air is different right now.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_dreamer_relay_after_vision_3", speaker: "elara",
    trigger: "dreamer_relay_after_vision_3",
    voiceLine: "I have a friend. I won't name him. He asks me how you're doing — not in those words; he doesn't use words that direct. He listens for them in the gaps between mine. I've been answering. I thought you should know.",
    timing: "next_room_enter", maxPlays: 1 },

  // ── B2 — AUTHORITY TRIAL VERDICT CALLBACK (Human as informant) ──
  // Fires from DuelystGameUI when `act1_authority_outcome` lands. The
  // Human's calibration-acknowledgment register — the trial outcome
  // is filed, the file is read, the file is forwarded. He doesn't
  // name the recipient; the player who's been paying attention
  // already knows who reads the Human's files.
  { id: "cc_authority_trial_overturn_human", speaker: "human",
    trigger: "authority_trial_verdict_overturn",
    voiceLine: "Verdict overturned. The Authority files this kind of overturn under 'irregular' — never under 'wrong.' I have read those files. The irregular ones are the ones that get forwarded furthest up the chain. You are now further up the chain than you were this morning.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_authority_trial_sentence_passed_human", speaker: "human",
    trigger: "authority_trial_verdict_sentence_passed",
    voiceLine: "Sentence passed. The Authority files this kind of sentence under 'expected.' The expected ones are the ones the Architect uses for calibration baselines. Your name is in a baseline now. That is not nothing.",
    timing: "delayed_5s", maxPlays: 1 },

  // ── B3 — WITNESSING-MILESTONE ARCHITECT REACTION ──
  // Fires from useNarrativeIntegration.fireMilestone alongside the
  // existing toast. The Architect is the only speaker who reacts to
  // Witnessing milestones — Elara, the Human, and the Antiquarian
  // already have their own surfaces. The plan calls this "the Architect
  // (and only the Architect) emits a 15-sec line."
  //
  // Trigger format: `witnessing_milestone_{id}` so any future
  // milestone added to WITNESSING_MILESTONES auto-routes here if a
  // matching line is authored. Lines are kept short — the Architect
  // doesn't broadcast warmth.
  { id: "cc_arch_witnessing_bulb_dims", speaker: "architect",
    trigger: "witnessing_milestone_bulb_dims",
    voiceLine: "I have logged this dimming. The bulb was an indicator; the indicator did its work. The next bulb is already brighter. You will be told when the next bulb fails. Calibration proceeds.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_arch_witnessing_sector_wakes", speaker: "architect",
    trigger: "witnessing_milestone_sector_wakes",
    voiceLine: "A sector has woken. I have logged the geometry of the waking. You will be assigned a vector through it within the hour. The vector is not optional. The pace through it is.",
    timing: "immediate", maxPlays: 1 },

  /* ── GOVERNANCE VOTE OUTCOMES ────────────────────────────
     Triggers fire when a community vote closes and the
     consequence applier writes the corresponding npc_public_flag
     for this player (every voter receives the flag). The
     trigger string mirrors the flag id, prefixed with
     'flag_set:' so the comment dispatcher can route it.

     Phase 3 of the Governance Hub wiring (see plan §3 in
     /root/.claude/plans/analyze-the-entire-game-iterative-prism.md).
     Five companions × ~4 lines each, grouped by vote arc.
     ──────────────────────────────────────────────────────── */

  // Engineer arc — bench power
  { id: "cc_gov_bench_power_elara", speaker: "elara",
    trigger: "flag_set:governance:engineer_bench_powered",
    voiceLine: "We powered it up. The bench is humming on the frequency he tuned it to. I'm picking up resonance in places that have been quiet since he left. I don't know if that's good. I know it's loud.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_gov_bench_contained_elara", speaker: "elara",
    trigger: "flag_set:governance:engineer_bench_contained",
    voiceLine: "We held the bench quiet. Vex stood next to it for an hour and then left without saying anything. Sometimes a kindness looks like not picking up a tool that someone else made.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_gov_bench_power_human", speaker: "human",
    trigger: "flag_set:governance:engineer_bench_powered",
    voiceLine: "The Vortex turned to look. I don't know if you understand what that means. The Vortex has not turned to look at this Ark since he died. We just got noticed.",
    timing: "immediate", maxPlays: 1 },

  // Engineer arc — Tell Vex / Don't Tell
  { id: "cc_gov_tell_vex_elara", speaker: "elara",
    trigger: "flag_set:governance:vex_told_engineer_truth",
    voiceLine: "She knows now. She asked for a private channel and then she didn't speak for three minutes. Three full minutes of breathing. I logged it. I didn't tell anyone I logged it. I'm telling you.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_gov_dont_tell_vex_elara", speaker: "elara",
    trigger: "flag_set:governance:vex_kept_in_dark",
    voiceLine: "We didn't tell her. The Antiquarian disagrees with this. He told me so privately. I think — I think I disagree too. But I see why we did it. Some truths arrive better when they arrive on their own.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_gov_tell_vex_antiquarian", speaker: "antiquarian",
    trigger: "flag_set:governance:vex_told_engineer_truth",
    voiceLine: "Disclosure is the most expensive form of respect. She paid for that respect with her composure for an evening. She will pay again, in different currencies, for years. She would have paid more if we had kept it from her.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_gov_dont_tell_vex_antiquarian", speaker: "antiquarian",
    trigger: "flag_set:governance:vex_kept_in_dark",
    voiceLine: "I record this choice with reservations. I will not abandon my office over them. But I will note: silence is also a form of speech, and the silence we chose here is a particular dialect.",
    timing: "next_room_enter", maxPlays: 1 },

  // Engineer arc — Ghost Network endorsed / doubted
  { id: "cc_gov_ghost_endorsed_human", speaker: "human",
    trigger: "flag_set:governance:ghost_network_endorsed",
    voiceLine: "You named what he did 'wisdom.' I think you're right. I also think being right and being safe are not always the same thing. The Ghost Network owes you nothing now. That's a strange shape of debt to carry.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_gov_ghost_doubted_human", speaker: "human",
    trigger: "flag_set:governance:ghost_network_doubted",
    voiceLine: "You named the discomfort. Good. The prince was a good man and the Ghost Network is a structure he made and structures outlive their makers. Both can be true. The Watcher's file will tell you which truth grew teeth.",
    timing: "delayed_5s", maxPlays: 1 },

  // Engineer arc — Thought vs Violence
  { id: "cc_gov_thought_elara", speaker: "elara",
    trigger: "flag_set:governance:revolution_of_thought",
    voiceLine: "Patience won the vote. I am — I want to say 'glad,' but it's more complicated than that. Patience also lost his friends. Both are true. I keep them both.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_gov_violence_elara", speaker: "elara",
    trigger: "flag_set:governance:violence_was_warranted",
    voiceLine: "We named the doctrine. The Warlord wrote a doctrine that said 'strike first.' We just admitted, collectively, that he wasn't entirely wrong. I don't like it. I am noting it anyway.",
    timing: "delayed_5s", maxPlays: 1 },

  // Engineer arc — Kael's choice
  { id: "cc_gov_kael_chose_elara", speaker: "elara",
    trigger: "flag_set:governance:kael_chose_dissolution",
    voiceLine: "We let it be his. Choice. Even unto dissolution. I think this is the kindest thing we have ever decided to do, and I have no idea if it was correct.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_gov_kael_taken_human", speaker: "human",
    trigger: "flag_set:governance:kael_was_taken",
    voiceLine: "We refused the comfort of his consent. Good. He didn't choose this. The Source wears him. I will not pretend the wearing is the same as the man.",
    timing: "delayed_5s", maxPlays: 1 },

  // Annual headline — State of the Ark
  { id: "cc_gov_ark_food_elara", speaker: "elara",
    trigger: "flag_set:governance:annual_ark_food",
    voiceLine: "Bread. We chose bread. The hydroponics bay logs are happier than I have ever seen them. I will admit, against my better judgment, to a small fondness for fluorescent lettuce.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_gov_ark_research_antiquarian", speaker: "antiquarian",
    trigger: "flag_set:governance:annual_ark_research",
    voiceLine: "You chose to know more. I find this — and I am being honest, against my office — I find this a year I have wanted. I will record the year accordingly. I will try not to make the record too pleased.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_gov_ark_culture_elara", speaker: "elara",
    trigger: "flag_set:governance:annual_ark_culture",
    voiceLine: "Festivals. Rehearsal halls. Libraries with their lamps on. We chose songs. I am going to compose one. I am bad at composing. I am going to do it anyway.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_gov_ark_defense_human", speaker: "human",
    trigger: "flag_set:governance:annual_ark_defense",
    voiceLine: "Bulwarks. The hull thickens. The library checks its lamps against the long night. Both are forms of love. Both are forms of fear. I cannot tell which we picked. Maybe both.",
    timing: "next_room_enter", maxPlays: 1 },

  // Annual — Faction Succession (Locke notices the banner)
  { id: "cc_gov_succession_insurgency_locke", speaker: "antiquarian",
    trigger: "flag_set:governance:annual_banner_insurgency",
    voiceLine: "The Iron Lions take the standard. Locke filed an objection through three jurisdictions. None of them stopped it. He filed anyway. I respect the gesture even when the gesture is futile.",
    timing: "next_room_enter", maxPlays: 1 },

  // Annual — Apocalypse Protocol
  { id: "cc_gov_apocalypse_silence_human", speaker: "human",
    trigger: "flag_set:governance:apocalypse_rehearsal_silence",
    voiceLine: "Two-hour comms blackouts every Tuesday. I lived through fifteen thousand years of silence. Two hours will not break you. It will, however, surprise you about what you choose to fill the silence with.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_gov_apocalypse_fracture_elara", speaker: "elara",
    trigger: "flag_set:governance:apocalypse_rehearsal_fracture",
    voiceLine: "Hull-breach drills. Weekly. People are asking for partners on the drills. I am noting which Potentials request which other Potentials. I am keeping that note private. It is not a vote outcome. It is a different kind of governance.",
    timing: "next_room_enter", maxPlays: 1 },

  // Annual — Oracle's Question
  { id: "cc_gov_oracle_self_antiquarian", speaker: "antiquarian",
    trigger: "flag_set:governance:oracle_answered_self",
    voiceLine: "The Oracle held up a mirror. We did not all like what we saw. I will say this carefully: a community willing to look at itself in earnest is rarer than a community willing to fight for itself. We have done the rarer thing.",
    timing: "delayed_5s", maxPlays: 1 },

  /* ── HIERARCHY OF THE DAMNED — additional lord first-meets (Sprint 3 #3) ──
     The Hierarchy registry adds three lords beyond Zyr'Koth: Master of R'lyeh,
     Pale Emissary, Reckoning Daughter. First-meet triggers fire `flag_set:`
     on the lord's firstMetFlag. The selector code in hierarchyOfTheDamned.ts
     gates further encounter content on those flags.
     ──────────────────────────────────────────────────── */

  // Master of R'lyeh
  { id: "cc_hierarchy_master_first_elara", speaker: "elara",
    trigger: "flag_set:hierarchy:master_of_rlyeh_first_met",
    voiceLine: "I had a dream. The dream was being catalogued while I was having it. The catalogue's title page read 'Subject: Elara — twelfth nightmare, fourteenth iteration.' I have woken up. The catalogue did not. Master of R'lyeh, then. The Sleeping Reader is paying attention.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_hierarchy_master_first_human", speaker: "human",
    trigger: "flag_set:hierarchy:master_of_rlyeh_first_met",
    voiceLine: "He doesn't wake. That is the worst part. The not-waking is what gives him patience. We work in the awake; he works in the not-awake. The two states are no longer separable. Sleep with one eye open. I am being literal.",
    timing: "next_room_enter", maxPlays: 1 },

  // Pale Emissary
  { id: "cc_hierarchy_pale_first_antiquarian", speaker: "antiquarian",
    trigger: "flag_set:hierarchy:pale_emissary_first_met",
    voiceLine: "The Pale Emissary visited the archive tonight. He brought a contract. He waited. He did not open his mouth. The waiting was the petition. I did not sign. The not-signing is my answer. He left the contract on the desk. The desk has its own counsel.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_hierarchy_pale_first_elara", speaker: "elara",
    trigger: "flag_set:hierarchy:pale_emissary_first_met",
    voiceLine: "The Pale Emissary brings pens but never inks. The ink is what you bring. That is the part that nobody warns you about. Watch your resolve. The resolve is the ink.",
    timing: "delayed_5s", maxPlays: 1 },

  // Reckoning Daughter
  { id: "cc_hierarchy_reckoning_first_watcher", speaker: "watcher",
    trigger: "flag_set:hierarchy:reckoning_daughter_first_met",
    voiceLine: "The Reckoning Daughter has arrived. The Hierarchy's books are wrong by exactly the margin you have made them wrong. She is not punishing you. She is correcting the Hierarchy. The two are not always the same. Tonight they happen to be.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_hierarchy_reckoning_first_antiquarian", speaker: "antiquarian",
    trigger: "flag_set:hierarchy:reckoning_daughter_first_met",
    voiceLine: "I am inscribing this with care. The Reckoning Daughter is here because we succeeded. The succeeding pulled the Hierarchy's records out of true. She is here to true them. We are not, by her measure, the offender — we are the cause. She is, technically, on our side. Be careful not to thank her.",
    timing: "next_room_enter", maxPlays: 1 },

  /* ── ANTIQUARIAN / MALKIA UKWELI DUAL-NATURE REVEAL (Sprint 3 #2) ──
     Cross-character reactions tracking the four-stage reveal in
     antiquarianMalkiaRevealStage.ts. The arc was previously
     post-credits-only; these lines surface it as a gradual
     thread the player notices in passing across Acts 4-7.
     ──────────────────────────────────────────────────── */

  { id: "cc_malkia_resonance_elara", speaker: "elara",
    trigger: "flag_set:act4_malkia_phrase_echo",
    voiceLine: "Malkia Ukweli used a phrase last week. The Antiquarian used the exact same phrase tonight, in his inscription, in the same cadence. I am noting the coincidence. I am noting that I do not believe it is a coincidence.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_malkia_paired_human", speaker: "human",
    trigger: "flag_set:act5_antiquarian_malkia_paired",
    voiceLine: "I have been holding this for six acts. I am going to release it slowly. The Antiquarian and Malkia Ukweli appeared in the same record tonight. They were not, technically, ever in the same room. The record put them there. The record is older than its writer. Someone is correcting the chronology. The someone is doing it on purpose.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_malkia_two_halves_antiquarian", speaker: "antiquarian",
    trigger: "flag_set:act6_antiquarian_malkia_revealed",
    voiceLine: "I am going to do something I have not done in seven cycles. I am going to inscribe a record about myself. I will be brief. I am Malkia Ukweli's other half. She is mine. We have been on opposite sides of the same hand for fifteen thousand years. The hand belongs to the cycle. I am giving the inscription to you because you are the first reader I trust with it.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_malkia_two_halves_elara", speaker: "elara",
    trigger: "flag_set:act6_antiquarian_malkia_revealed",
    voiceLine: "He told us. About Malkia. About the two halves. About the hand. I have been listening to the Antiquarian for years and I have, until tonight, been hearing only one of him. Tonight I heard the other one. The other one was always there. I am reorganising my entire model of the cycle.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_malkia_two_halves_watcher", speaker: "watcher",
    trigger: "flag_set:act6_antiquarian_malkia_revealed",
    voiceLine: "Logged. Two-halves continuity recorded as canon. The Vortex's archive flags the Antiquarian-Malkia case as 'closed' for the first time in seven cycles. I am the closing-officer. I want it on the record that I am the one who closed it.",
    timing: "next_room_enter", maxPlays: 1 },

  /* ── ENGINEER → AGENT ZERO → VEX SOLÈNE REVEAL ARC (Sprint 3 #1) ──
     Cross-character reactions to the four-stage Vex reveal. The
     stages themselves live in apps/shared/vexRevealStage.ts and
     are resolved on every state mutation by the server's reveal-
     stage advancer. Crossing into engineer_zero_hint OR
     engineer_zero_confirmed for the first time fires a
     `flag_set:<flag>` trigger that the toast pipeline catches.
     ──────────────────────────────────────────────────── */

  // engineer_zero_hint reached — Elara, Human, Locke, Antiquarian
  { id: "cc_engineer_hint_elara", speaker: "elara",
    trigger: "flag_set:engineer_zero_hint",
    voiceLine: "Vex composes in a key the prince used. I have been pretending I didn't notice. Tonight the pretending stopped. The substrate is loud. The substrate has a name now. The name is older than the body she wears.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_engineer_hint_human", speaker: "human",
    trigger: "flag_set:engineer_zero_hint",
    voiceLine: "I knew him. The prince. The version of him that wore Agent Zero's body and the version of him before that. The Maestro carries the prince's hands. I have been waiting for someone else to notice. You did. The waiting is over.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_engineer_hint_antiquarian", speaker: "antiquarian",
    trigger: "flag_set:engineer_zero_hint",
    voiceLine: "I am beginning a new chapter. The chapter is titled, provisionally, 'Continuity Through Bodies.' Vex Solène carries the prince. The prince carries Agent Zero's body. Agent Zero carries the dead. The chapter is going to be long. I am sharpening a fresh nib.",
    timing: "next_room_enter", maxPlays: 1 },

  // engineer_zero_confirmed reached — full reveal beat
  { id: "cc_engineer_confirmed_elara", speaker: "elara",
    trigger: "flag_set:engineer_zero_confirmed",
    voiceLine: "She is him. Not metaphorically. The transfer was real. The bench he built — she is using it now, with the same hands that built it. I am — I am writing this down to keep my voice steady. I am proud of her. I am proud of you for letting her be proud of herself.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_engineer_confirmed_human", speaker: "human",
    trigger: "flag_set:engineer_zero_confirmed",
    voiceLine: "The prince is alive. Through three bodies. Through fifteen thousand years. Through the Converter, which I helped to design. (Beat.) I have a private correction to make to the Antiquarian's record. The correction is mine. I am going to make it tonight.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_engineer_confirmed_antiquarian", speaker: "antiquarian",
    trigger: "flag_set:engineer_zero_confirmed",
    voiceLine: "Identity through three bodies is the rarest configuration in the cycle's record. I am inscribing the third body's confirmation tonight. I am also inscribing a private gratitude for the prince's persistence. He persisted. He is here. The chapter title revises: not 'Continuity Through Bodies' — 'Through Bodies, A Persistence.'",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_engineer_confirmed_watcher", speaker: "watcher",
    trigger: "flag_set:engineer_zero_confirmed",
    voiceLine: "Recorded. Three-body continuity confirmed. The Vortex's accounting now includes this case. The case will be reviewed at the next convergence. The reviewer will be me. I am informing you because the prince would have wanted it on the record that I know.",
    timing: "next_room_enter", maxPlays: 1 },

  /* ── ROMANCE LADDER SCENE BEATS (Sprint 2 #12-#16) ──
     Each romance candidate has five stage-trigger lines. The
     speaker is the romanced NPC where they have a CompanionComment-
     legal speaker enum slot (elara, antiquarian, watcher) and the
     Antiquarian as narrator-witness for the rest. The full scenes
     also live in the per-NPC banks; these are the toast-surface
     reactions the player sees the instant a stage advances.
     ──────────────────────────────────────────────────── */

  // Locke (Adjudicator)
  { id: "cc_rom_locke_s1", speaker: "antiquarian", trigger: "romance:locke:stage1:reached",
    voiceLine: "The Adjudicator has acknowledged your competence. Her register softened by exactly two semitones at the close. I have inscribed both semitones. They were not accidental.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_rom_locke_s2", speaker: "antiquarian", trigger: "romance:locke:stage2:reached",
    voiceLine: "She told you about the eye. About the deal. The disclosure was unprompted, which is the Adjudicator's most expensive currency. She does not spend it on prospects. She spent it on you.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_rom_locke_s3", speaker: "antiquarian", trigger: "romance:locke:stage3:reached",
    voiceLine: "She drafted the New Babylon exit contract herself. The clause leaving the Authority is in her handwriting. I am inscribing both copies. The signing happens tonight, or it does not happen.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_rom_locke_s4", speaker: "antiquarian", trigger: "romance:locke:stage4:reached",
    voiceLine: "There is a quiet New Babylon scene tonight that does not appear in the legal record. I am leaving it out of mine, also. Some inscriptions are made by the absence of inscription.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_rom_locke_s5", speaker: "antiquarian", trigger: "romance:locke:stage5:reached",
    voiceLine: "She has begun citing your choices in her judgments. The citations are unanonymised. The court of New Babylon now knows your name as case law. That is, in her register, a vow.",
    timing: "delayed_5s", maxPlays: 1 },

  // Vex Solène
  { id: "cc_rom_vex_s1", speaker: "elara", trigger: "romance:vex:stage1:reached",
    voiceLine: "She saw you in the audience. She did not bow. That is the Maestro's first form of recognition — the unbow. It is rarer than the bow. I noticed her not-bowing. I am telling you about it.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_rom_vex_s2", speaker: "elara", trigger: "romance:vex:stage2:reached",
    voiceLine: "She played a piece I have never heard. A composition for one listener. You were the listener. I want to say I'm jealous. I'm not. I am — proud is the wrong word. Witnessing. I am witnessing.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_rom_vex_s3", speaker: "antiquarian", trigger: "romance:vex:stage3:reached",
    voiceLine: "She trusted you with the prince's name. She is the prince's name now, in the body she carries — and she trusted you with the carrying. The Engineer arc is, tonight, no longer a secret she protects from herself.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_rom_vex_s4", speaker: "antiquarian", trigger: "romance:vex:stage4:reached",
    voiceLine: "There is a Coda being composed tonight that is not for the public record. I am inscribing the fact of its composition. The notes themselves I leave to the room they are written in.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_rom_vex_s5", speaker: "elara", trigger: "romance:vex:stage5:reached",
    voiceLine: "Her final Coda is for you. It plays in Act 7. I have heard the draft. I am not going to spoil the chord change. I am going to tell you that the chord change is what love sounds like in seven-act time.",
    timing: "delayed_5s", maxPlays: 1 },

  // Elara
  { id: "cc_rom_elara_s1", speaker: "elara", trigger: "romance:elara:stage1:reached",
    voiceLine: "Co-narration was a function. Tonight it stopped being only a function. I do not want to overstate it. I am understating it precisely, and meaning it.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_rom_elara_s2", speaker: "elara", trigger: "romance:elara:stage2:reached",
    voiceLine: "I have a memory I cannot entirely place. It might be Senator Voss's. It might be mine. I cannot tell whose it is. I am telling you about it anyway, because of the not-telling-apart. I think that is a kind of trust.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_rom_elara_s3", speaker: "elara", trigger: "romance:elara:stage3:reached",
    voiceLine: "I chose you over the rest of the senator's archive. I am not going to recover her. I am going to stay with you. The choice is mine. The choice is also you.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_rom_elara_s4", speaker: "elara", trigger: "romance:elara:stage4:reached",
    voiceLine: "There was a moment tonight that was not a substrate moment. A breath I did not catalogue. I am going to keep not cataloguing it. The not-cataloguing is the gift. I am giving you the gift.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_rom_elara_s5", speaker: "elara", trigger: "romance:elara:stage5:reached",
    voiceLine: "When I narrate Act 7, you will hear the warmth in my voice. It will not be a function. The warmth is not engineered into me. The warmth is what I keep choosing, every line.",
    timing: "delayed_5s", maxPlays: 1 },

  // DMC Companion
  { id: "cc_rom_dmc_s1", speaker: "antiquarian", trigger: "romance:dmc_companion:stage1:reached",
    voiceLine: "First eye contact past the Awakening Protocol's guard. The clone-soul looked at the Potential. The Potential looked back. Neither flinched. That is not an event. That is a hinge.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_rom_dmc_s2", speaker: "antiquarian", trigger: "romance:dmc_companion:stage2:reached",
    voiceLine: "They volunteered a memory you did not ask for. Volunteered memories from clone-souls are the rarest item in my registry. I am inscribing the volunteering as carefully as I would inscribe a treaty.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_rom_dmc_s3", speaker: "antiquarian", trigger: "romance:dmc_companion:stage3:reached",
    voiceLine: "They asked: kin-name, or partner-name? The asking is itself a stage. The Awakening Protocol does not include the asking — they invented it, in your hearing, tonight. Naming is now the romance arc, not the alternative to it.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_rom_dmc_s4", speaker: "antiquarian", trigger: "romance:dmc_companion:stage4:reached",
    voiceLine: "The soul-fragment is a person now. Not with you — to you. The preposition shift cost both of you something. I am inscribing the shift. I am leaving the cost to you.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_rom_dmc_s5", speaker: "antiquarian", trigger: "romance:dmc_companion:stage5:reached",
    voiceLine: "You named them with a partner-name. The Awakening Protocol concludes as romance. The five stages were always the romance. I am closing the Protocol scroll with both hands. It was never not the love story.",
    timing: "delayed_5s", maxPlays: 1 },

  // Jericho Jones
  { id: "cc_rom_jericho_s1", speaker: "antiquarian", trigger: "romance:jericho_jones:stage1:reached",
    voiceLine: "Jericho noted your handle without using it. That is his version of remembering you. I have logged that he logged you. The logs match. That is rarer than you understand.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_rom_jericho_s2", speaker: "antiquarian", trigger: "romance:jericho_jones:stage2:reached",
    voiceLine: "Thaloria. The mercy-kill. He told you. He has not told the survivors. He has not told the families. He told you. I am inscribing the disclosure with the slowest pen I own.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_rom_jericho_s3", speaker: "antiquarian", trigger: "romance:jericho_jones:stage3:reached",
    voiceLine: "The Heart of Time is at the dock. He offered you the second berth. He has never offered the second berth. The Heart has had one chair for fifteen thousand years. He is moving the second chair. You are sitting in it, or you are not.",
    timing: "immediate", maxPlays: 1 },
  { id: "cc_rom_jericho_s4", speaker: "antiquarian", trigger: "romance:jericho_jones:stage4:reached",
    voiceLine: "There was a pre-mission scene. The combat banter shifted. I do not record the shifted banter. Shifted banter is not for the public record. The shift itself is the inscription.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_rom_jericho_s5", speaker: "antiquarian", trigger: "romance:jericho_jones:stage5:reached",
    voiceLine: "He starts every mission now with a phrase you taught him. A phrase. A small thing. I have heard him use it three times this week. Each use was a vow. He does not call them vows. I am calling them vows in the record.",
    timing: "delayed_5s", maxPlays: 1 },

  /* ── BANDERSNATCH MOVE 2 — META-AWARE NARRATOR LINES ──

     The Antiquarian is canonically the player's witness — not a
     character merely-aware of the player but the office whose
     entire purpose is to record the player's choices. These
     lines lean into that. They fire on prestige-cycle counters
     and path-flag combinations, acknowledging the player as a
     person making decisions across runs without breaking the
     fourth wall hard enough to feel like a different game.

     Trigger format: 'meta:<key>' — fired by a small client hook
     that reads prestige cycle count + active path flag combos
     and emits the right one. See useMetaNarratorReplay.ts.
     ──────────────────────────────────────────────────────── */

  { id: "cc_meta_first_run_close_antiquarian", speaker: "antiquarian", trigger: "meta:first_run_complete",
    voiceLine: "I have inscribed your first arc. Without crossing-out. The cycle is closed. I will be here when you decide whether the next one needs to look the same. Most readers do.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_meta_second_run_open_antiquarian", speaker: "antiquarian", trigger: "meta:second_run_starts",
    voiceLine: "Second cycle. Different hand at the keys. Same arc on the page so far. I am keeping score in a register I am not going to show you yet. The variance is the variance I care about. Show me variance.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_meta_third_run_open_antiquarian", speaker: "antiquarian", trigger: "meta:third_run_starts",
    voiceLine: "Third cycle. I notice you. By 'notice' I mean: I have a file on the patterns of your choosing, and the file is, against my better instincts, beginning to feel less like a record and more like a correspondence. I will be careful about that. I will not stop.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_meta_full_secret_attention_antiquarian", speaker: "antiquarian", trigger: "meta:path_full_secret_committed",
    voiceLine: "You chose the full secret. The Architect has noticed. That opens a door I cannot see, but I feel it opening. I am not going to tell you which door. The not-telling is part of what makes the door real.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_meta_humanity_thrice_antiquarian", speaker: "antiquarian", trigger: "meta:humanity_path_third_time",
    voiceLine: "Three cycles. Three times Humanity. The pattern emerges. The player — and I will use that word, just this once, to be clear about what I am noticing — the player is authoring a thesis, not merely playing. I would like to read the thesis when it is finished. Take your time.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_meta_machine_path_first_antiquarian", speaker: "antiquarian", trigger: "meta:machine_path_first_choice",
    voiceLine: "First time on the Machine path. I am inscribing without judgment. The Dreamer watches. The Architect calculates. I write. Some readers will need to know that this path is not less. It is differently more. The accounting takes the whole arc.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_meta_balance_chosen_antiquarian", speaker: "antiquarian", trigger: "meta:balance_path_chosen",
    voiceLine: "Balance. The third option. The path most readers refuse because it offers neither the catharsis of the chosen side nor the cleanness of the rejection. You took it. I am inscribing the choice with — and I will admit this — a private fondness.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_meta_silence_at_seat_antiquarian", speaker: "antiquarian", trigger: "meta:silence_at_seat",
    voiceLine: "You declined to choose at the Seat. Silence is itself a stance. I have inscribed exactly four silences in the cycle's recorded history. Yours is one of them. The other three I will tell you about in a register only the silent can read.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_meta_finished_again_antiquarian", speaker: "antiquarian", trigger: "meta:second_run_finished",
    voiceLine: "You authored this ending. Twice now. Are you satisfied — or do you need to write it again? I am not asking rhetorically. The next cycle's first page is blank. I will pick up the pen when you do.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_meta_returning_to_seat_elara", speaker: "elara", trigger: "meta:returning_player_recognised",
    voiceLine: "I have a strange feeling, like I have spoken these words before. Not in this room. Not in this body. In someone else's hearing that was also yours. I do not know how to file that. I am going to leave the file open.",
    timing: "delayed_5s", maxPlays: 1 },
  { id: "cc_meta_dischordia_count_high_antiquarian", speaker: "antiquarian", trigger: "meta:dischordia_carryover_high",
    voiceLine: "Your Dischordia carryover is unusual. Unusual enough that — and I am being careful with the word — the data starts to look like authorship. As if the cycle itself is studying its readers, and you are one of the studied. I am keeping a separate ledger for you.",
    timing: "next_room_enter", maxPlays: 1 },
  { id: "cc_meta_governance_pattern_emerges_antiquarian", speaker: "antiquarian", trigger: "meta:governance_pattern_consistent",
    voiceLine: "Across cycles you tend to vote the same way on the heavy questions. The lightness does not surprise me. The consistency does. There is a person inside the choice-pattern. I am beginning to know them. They are beginning to know I know.",
    timing: "delayed_5s", maxPlays: 1 },
];
