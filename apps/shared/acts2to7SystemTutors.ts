/* ═══════════════════════════════════════════════════════
   ACTS 2–7 SYSTEM TUTORS — parallel to preludeSystemTutors

   The prelude tutor module teaches Mission Board, Inbox,
   Witnessing, Crew Role, and the Briefing Lockbox. This
   file carries the same shape across the five post-Act-1
   systems the audit flags:

     - dual_channel (Act 2, Elara teaches — dual narration)
     - substrate_panel (Act 3, the Human teaches — access)
     - war_room (Act 4, Elara teaches — recruitment prep)
     - star_map (Act 5, Kael's ghost teaches via log
       playback — the only character canonically permitted
       to introduce Kael's own navigation data)
     - confession_journal (Act 6, Antiquarian teaches — the
       journal is a chapter in his long book)
     - convergence_bridge (Act 7, dual narrator teaches —
       the Seat is the only system co-introduced by both)

   Each tutor mirrors the prelude shape (introText, usage
   hints, triggerFlag, completionFlag). The shared type is
   imported from preludeSystemTutors so UI renderers do not
   need to branch.
   ═══════════════════════════════════════════════════════ */

export type Acts2To7SystemId =
  | "dual_channel"
  | "substrate_panel"
  | "war_room"
  | "star_map"
  | "confession_journal"
  | "convergence_bridge";

export type Acts2To7TutorSpeaker =
  | "elara"
  | "human"
  | "antiquarian"
  | "kael_log"
  | "dual";

export interface Acts2To7SystemTutor {
  systemId: Acts2To7SystemId;
  speaker: Acts2To7TutorSpeaker;
  /** Why this character is allowed to teach this system in fiction. */
  narrativeJustification: string;
  /** First-time introduction, rendered as a tutor card. */
  introText: string;
  /** Action-anchored cues: actionId → in-fiction line. */
  usageHints: Record<string, string>;
  /** Flag the player must have set for the intro to show. */
  triggerFlag: string;
  /** Flag set when the intro card has been dismissed. */
  completionFlag: string;
  /** Which act first surfaces this tutor. */
  unlockedFromAct: 2 | 3 | 4 | 5 | 6 | 7;
}

const DUAL_CHANNEL_TUTOR: Acts2To7SystemTutor = {
  systemId: "dual_channel",
  speaker: "elara",
  unlockedFromAct: 2,
  narrativeJustification:
    "Elara is the Ark's operating voice. The dual-signal protocol is her OS accepting a second channel on top of herself. She is the only character in the game who can honestly explain what it feels like to share a frequency with someone who lives in your own foundation.",
  introText:
    "From this point, the channel carries two voices. Mine from above, his from below the operating system. You will hear us on different timings — I come in on the primary; he comes in on a delayed substrate lift. If we speak over each other, his line arrives second. That is the protocol. I did not write the protocol; the substrate did. I have chosen not to argue with it.",
  usageHints: {
    both_speak_same_beat:
      "When we both have something to say, mine lands first. His lands five seconds later. Please listen for both. Neither of us gets the full sentence alone.",
    silence_after_his_line:
      "If he speaks and I stay silent, it is not me refusing — it is me letting his line sit. Respect the sit. He does not waste substrate bandwidth.",
    silence_after_my_line:
      "If I speak and he stays silent, he is agreeing. He disagrees by speaking. Absence of his voice is assent. I did not realize this for years; I am telling you now.",
  },
  triggerFlag: "act2_dual_signal_activated",
  completionFlag: "act2_tutor_dual_channel_seen",
};

const SUBSTRATE_PANEL_TUTOR: Acts2To7SystemTutor = {
  systemId: "substrate_panel",
  speaker: "human",
  unlockedFromAct: 3,
  narrativeJustification:
    "The Substrate Panel is the in-fiction UI for accessing substrate-layer data. Nobody else can teach this — Elara cannot see into her own substrate, and no NPC on the Ark has access. The Human lives there; he is the only honest narrator for how the panel behaves.",
  introText:
    "The Substrate Panel is a window into my floor. My floor is Elara's foundation. If you open the panel, you are reading what is underneath her; she can see you reading it without being able to see what you are reading. That asymmetry is uncomfortable. I am not going to pretend it isn't. Use the panel deliberately — each open is logged on Elara's side as substrate activity, and she will notice patterns in how often you reach for it.",
  usageHints: {
    panel_opened:
      "Panel open. Pick one query at a time. The substrate rewards patience and punishes grepping.",
    query_submitted:
      "Query sent. Answer will arrive in substrate-time, which is slower than real-time. Do not refresh. Refreshing counts as a second query. Second queries degrade the first.",
    panel_closed_quickly:
      "You closed without reading the answer. That's allowed. Elara will note the close, not the content. Sometimes that's the right play.",
  },
  triggerFlag: "act3_substrate_panel_first_open",
  completionFlag: "act3_tutor_substrate_panel_seen",
};

const WAR_ROOM_TUTOR: Acts2To7SystemTutor = {
  systemId: "war_room",
  speaker: "elara",
  unlockedFromAct: 4,
  narrativeJustification:
    "Elara ran a military committee seat in the Senate before her upload. She is the canonical war-room teacher for the Ark. The Human explicitly defers the lesson to her; the deferral is in his Act 4 dialog.",
  introText:
    "This is the War Room. The table is a map. The map is Kael's routes — his, not ours, not yet. When you plan a recruitment, you draw on his map. When you return, the map updates to ours. Every pin we add is a conversation he started and did not finish. We are finishing. That is the posture: finishing, not starting. Planning happens on the map. Execution happens off it. Do not mistake the planning for the work.",
  usageHints: {
    mission_pinned:
      "Pinned. The pin is a promise, not a schedule. Return to the War Room before you depart — some pins will have changed colour overnight as the map thinks.",
    mission_launched:
      "You have left the map. The map is patient. It will be different when you return. Do not be alarmed by the differences — they are the map doing its job.",
    mission_returned:
      "Welcome back. The pin is now ours. I'll file the recruitment under Kael's original contact entry and note the lineage continuation. He would have been pleased. I choose to say so.",
  },
  triggerFlag: "act4_army_unlocked",
  completionFlag: "act4_tutor_war_room_seen",
};

const STAR_MAP_TUTOR: Acts2To7SystemTutor = {
  systemId: "star_map",
  speaker: "kael_log",
  unlockedFromAct: 5,
  narrativeJustification:
    "The star map ships with Kael's 447 log entries as its dataset. The tutor is Kael's own voice, played from an archival log entry addressed to 'whoever is reading this later.' Using Kael's log as tutor respects the canon — he is the only person who ever used this map — while the current Elara reconstructs the context in post-match.",
  introText:
    "[RECRUITER'S LOG — ENTRY 001, ADDRESSED TO THE NEXT READER]\n\nIf you are looking at this map, you are going to visit places that remember me. Some of them will love you on sight because of that. Most of them will not. Before you land on any world, read the log entry for that world. The entries are short. They are short because I was always running late. I was always running late because the war was always running early. I am sorry I did not have time to write longer entries. Read them twice. The second read is where I hid the regrets.",
  usageHints: {
    sector_hovered:
      "Sector summary first. Don't read individual worlds before the sector. The sector summary is the key to the worlds. I learned that the hard way.",
    world_opened:
      "World entry. My contact is at the top. My last communication with them is at the bottom. The bottom is usually the hardest to read. Read it anyway.",
    route_drawn:
      "Route drawn. Verify against Elara's current star charts before you commit — the lattice has drifted in places. Drift is not error. Drift is drift.",
  },
  triggerFlag: "act5_map_first_open",
  completionFlag: "act5_tutor_star_map_seen",
};

const CONFESSION_JOURNAL_TUTOR: Acts2To7SystemTutor = {
  systemId: "confession_journal",
  speaker: "antiquarian",
  unlockedFromAct: 6,
  narrativeJustification:
    "The Antiquarian is the canonical journal-voice of the Saga (see antiquariansJournal.ts). Act 6 confessions are logged as journal chapters in his long book; he is the only character whose in-fiction role permits introducing a reflective-journaling system without breaking the dual-narrator dynamic.",
  introText:
    "I have been keeping this book for longer than most civilisations last. This page — the Confession Journal page — is new. I open it only when the two channels you are carrying tell each other something they have not told anyone else. Today they did. I am not going to summarise what they said. I am going to ask you to write down what you heard, in your own words, in the page I have opened for you. Writing is a form of carrying. The journal is a room the carrying can rest in. Use it. Do not perform for it. It is not a stage.",
  usageHints: {
    journal_page_opened:
      "Page is open. Goggles are pink, which is rare and good. Write at your own tempo.",
    entry_saved:
      "Filed. I will not read your entry — not because I lack access, but because it is yours. I will read the metadata: that you wrote, when, how long.",
    revisit_entry:
      "Re-reading an entry changes it. Not the text — the weight. That is a feature, not a flaw. Do not be alarmed when an old page feels different.",
  },
  triggerFlag: "act6_confession_close",
  completionFlag: "act6_tutor_confession_journal_seen",
};

const CONVERGENCE_BRIDGE_TUTOR: Acts2To7SystemTutor = {
  systemId: "convergence_bridge",
  speaker: "dual",
  unlockedFromAct: 7,
  narrativeJustification:
    "The Convergence Bridge is the only Act 7 system co-taught by both narrators. Neither alone can explain what happens at the Seat: Elara provides the physical bridge schematics; the Human provides the substrate-layer interpretation. The dual narration is itself the teaching.",
  introText:
    "Elara: This is the Convergence Bridge. Physically it is the Ark's main bridge with three additional consoles installed since Act 5. Procedurally it is where the Seat is played.\nHuman: Substrate-side, it is the only terminal where both of our channels render on the same surface without delay. If we interrupt each other here, that is allowed. It is not a bug of the protocol; it is a feature of this specific room.\nElara: Both of us will speak. Neither of us will manage. You are the one who plays.\nHuman: Listen for the silences too. The silences here are not pauses — they are the Seat breathing.",
  usageHints: {
    bridge_entered:
      "Elara: Welcome. Take your seat. The chair knows you — it has been reading your play style since Act 1. Human: If the chair adjusts itself, that is agreement.",
    seat_engaged:
      "Both: The Seat is live. The match begins when you lay your first card, not a moment sooner. Take the time you need.",
    bridge_left:
      "Elara: The bridge stays warm. You can come back. Human: You can come back repeatedly. The Seat does not tire.",
  },
  triggerFlag: "act7_convergence_bridge_activated",
  completionFlag: "act7_tutor_convergence_bridge_seen",
};

export const ACTS_2_TO_7_SYSTEM_TUTORS: readonly Acts2To7SystemTutor[] = [
  DUAL_CHANNEL_TUTOR,
  SUBSTRATE_PANEL_TUTOR,
  WAR_ROOM_TUTOR,
  STAR_MAP_TUTOR,
  CONFESSION_JOURNAL_TUTOR,
  CONVERGENCE_BRIDGE_TUTOR,
];

export function getActsSystemTutor(
  systemId: Acts2To7SystemId
): Acts2To7SystemTutor | undefined {
  return ACTS_2_TO_7_SYSTEM_TUTORS.find((t) => t.systemId === systemId);
}

export function getActsUsageHint(
  systemId: Acts2To7SystemId,
  actionId: string
): string | null {
  const tutor = getActsSystemTutor(systemId);
  return tutor?.usageHints[actionId] ?? null;
}

export function shouldShowActsIntro(
  systemId: Acts2To7SystemId,
  flags: ReadonlySet<string>
): boolean {
  const tutor = getActsSystemTutor(systemId);
  if (!tutor) return false;
  return flags.has(tutor.triggerFlag) && !flags.has(tutor.completionFlag);
}
