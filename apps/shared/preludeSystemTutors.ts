/* ═══════════════════════════════════════════════════════
   PRELUDE SYSTEM TUTORS — in-lore "how this works" surface

   Closes the audit gap on systems that exist structurally
   but lack a character explaining them in fiction.

     - mission_board (Beat D, taught by Locke — canonical
       quartermaster from beatHInboxMessage.ts)
     - inbox (Beat H, taught by The Human — substrate-
       adjacent channel framing from narrativeActs.ts)
     - witnessing (Act 1 Cycle C finale, taught by The Seer —
       the only Act 1 character permitted to discuss the
       Light/Dark choice without spoiling the Last Words
       landing; see seer-prophecy-mechanic.md)

   Each system gets an introText (first-time long-form
   explanation), usageHints (short action-anchored cues),
   a triggerFlag (when to show), and a completionFlag (set
   when the intro has been seen).
   ═══════════════════════════════════════════════════════ */

export type PreludeSystemId =
  | "mission_board"
  | "inbox"
  | "witnessing"
  | "crew_role"
  | "beat_f_lockbox"
  | "cryo_stasis_hud"
  | "pet_capsule"
  | "beacon_trolley"
  | "human_signal_panel"
  | "vortex_rift"
  | "bridge_holo_map";
export type PreludeTutorSpeaker = "locke" | "human" | "seer" | "elara";

export interface PreludeSystemTutor {
  systemId: PreludeSystemId;
  speaker: PreludeTutorSpeaker;
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
}

const MISSION_BOARD_TUTOR: PreludeSystemTutor = {
  systemId: "mission_board",
  speaker: "locke",
  narrativeJustification:
    "Adjudicator Locke of New Babylon is the canonical quartermaster who keeps the Trade Empire board honest. She has been holding the bond ledgers open for seventeen thousand years; if she does not introduce the board, nobody alive does.",
  introText:
    "This is the cargo-bay mission board. Three postings on it are still active. They have all been active since before any of your parents had been born. The board does not lie about its age, which is rare in a board. Read the postings in any order. Read all three before you accept any of them — that is a habit I am asking you to develop. The postings will tell you who the Concord was, what the Nightlane Guild owed, and where the Outer Dusk maps were wrong. None of those institutions exist in their old form anymore. The work does. The work is what I am here to broker.",
  usageHints: {
    posting_opened:
      "Take your time with the body. The bolded sentences are not the whole story. They never are.",
    all_postings_read:
      "Three for three. Now you know the shape of the board. When you accept one, accept it because the shape made sense — not because the bold made you.",
    accept_clicked:
      "Acceptance binds you, even on a no-faction-pledge intake. I will hold the bond. I always do. You will hear from me again.",
  },
  triggerFlag: "prelude_beat_d_first_slate_read",
  completionFlag: "prelude_tutor_mission_board_seen",
};

const INBOX_TUTOR: PreludeSystemTutor = {
  systemId: "inbox",
  speaker: "human",
  narrativeJustification:
    "The Inbox runs on a substrate-adjacent channel. The Human lives in the substrate; he can see the Inbox's incoming traffic before it arrives at the player's screen. He is the only honest narrator for what the channel actually is.",
  introText:
    "The Inbox is a channel. The channel is not Elara's. It is older than her operating system and slightly slower than light. Messages that arrive here have been routed through the substrate at least once. I see them coming. I do not always read them — that part is yours. When you reply, the reply leaves through the same channel. When you do not reply, the message sits, and the sender does not know whether you read it. The sitting is also a kind of message. Be deliberate about which kind you are sending.",
  usageHints: {
    message_opened:
      "Read the whole thing. Senders track which sentences you scroll past and which ones you pause on. Locke does, especially.",
    message_replied:
      "Replying is a commitment. Not to the sender — to the version of you who replied. That version of you is now on record.",
    message_ignored:
      "Ignoring is a reply. The sender will read your silence as one of three things, and only you know which one it actually is.",
  },
  triggerFlag: "prelude_beat_h_inbox_first_open",
  completionFlag: "prelude_tutor_inbox_seen",
};

const WITNESSING_TUTOR: PreludeSystemTutor = {
  systemId: "witnessing",
  speaker: "seer",
  narrativeJustification:
    "The Seer is the only Act 1 character permitted to discuss the Light/Dark Witnessing choice without spoiling the Last Words landing. She has already seen the choice you will make. She is here to make sure you make it on purpose.",
  introText:
    "Witnessing is the act of staying in the room while a song decides what kind of song it is. You will hear a verse. The verse will ask you to choose. The choice is binary in shape and unbinary in consequence — Light or Dark, and neither word means what you think it means. The point of the mechanic is not to pick the right one. The point is to pick one knowing you cannot un-pick it later. I have already seen which one you choose. I am not going to tell you. I am going to stand near you while you do it.",
  usageHints: {
    song_starts:
      "Listen with the back of your skull. The front of your ear is for words; the back is for what the words are doing.",
    verse_lands:
      "The verse landed. The choice is now visible. You can take a moment. The song will hold. It is patient.",
    light_chosen:
      "Light. You have chosen mercy that costs you something. Carry the cost. The cost is the mercy.",
    dark_chosen:
      "Dark. You have chosen honesty that costs someone else something. Carry the someone-else. The someone-else is the honesty.",
  },
  triggerFlag: "act1_cycle_c_witnessing_unlocked",
  completionFlag: "act1_tutor_witnessing_seen",
};

const CREW_ROLE_TUTOR: PreludeSystemTutor = {
  systemId: "crew_role",
  speaker: "elara",
  narrativeJustification:
    "Elara is the Ark's operating voice. She has watched the incubator plinths cycle through every earlier Potential's pick. She is not here to steer you, but she is here to name what the choice means.",
  introText:
    "Six incubators. Three roles the Ark can currently teach. Engineer, Assassin, Oracle. Each plinth will light under your hand if it recognises the weight of your attention — it cannot be fooled by curiosity. Whatever you pick here will colour the first questions Act 1 asks you. It does not lock your class at level-up. It only says: this is where the Ark saw you first.",
  usageHints: {
    role_hovered:
      "The plinth is reading you back. It is not scoring. It is remembering.",
    role_picked:
      "Committed. The plinth dims. The Ark has filed the preference; Act 1 will use it as a starting affinity, not a cage.",
  },
  triggerFlag: "cutscene_engineering_intro_complete",
  completionFlag: "prelude_tutor_crew_role_seen",
};

const LOCKBOX_TUTOR: PreludeSystemTutor = {
  systemId: "beat_f_lockbox",
  speaker: "elara",
  narrativeJustification:
    "Elara catalogued every surface in the briefing room the moment the cryo systems stabilised. The biometric lockbox is one of the few objects she cannot unlock herself — it requires a Potential's hand. She explains its shape while the player reaches.",
  introText:
    "This is a biometric lockbox. It will recognise you because Kael told it to, before he walked away from the chair it sits beside. Inside is a contingency memo. Three pages. Read them in order. The third page asks you to do something small and exact — please do that small exact thing. Everything downstream is easier when it is done.",
  usageHints: {
    lockbox_tapped:
      "The lockbox is deciding whether to know you. Give it a moment.",
    page_advanced:
      "Next page. Kael paced these entries. He believed in the pause between them.",
    memo_committed:
      "You held the letter. The chair remains empty. Thank you.",
  },
  triggerFlag: "cutscene_briefing_room_intro_complete",
  completionFlag: "prelude_tutor_beat_f_lockbox_seen",
};

const CRYO_STASIS_HUD_TUTOR: PreludeSystemTutor = {
  systemId: "cryo_stasis_hud",
  speaker: "elara",
  narrativeJustification:
    "Elara is the Ark's operating voice. She has been watching the stasis HUD for seventeen millennia; when it begins scrolling an interference waveform nobody seeded into it, she is the only person who knows what is and isn't signal.",
  introText:
    "The panel in your pod is running a waveform I did not author. I have been tracking it for six minutes and forty-one seconds — exactly since your canopy unsealed. It is not static. It is shaped. Something upstream of my authority is whispering into the stasis channel. I am not going to pretend that is normal. I am going to ask you to remember that it is not normal.",
  usageHints: {
    hud_examined:
      "Waveform recorded. I have flagged it for archival review. We will come back to it.",
  },
  triggerFlag: "prelude_cryo_bay_entered",
  completionFlag: "prelude_tutor_cryo_stasis_hud_seen",
};

const PET_CAPSULE_TUTOR: PreludeSystemTutor = {
  systemId: "pet_capsule",
  speaker: "elara",
  narrativeJustification:
    "Elara catalogued every sleeper on the manifest, including the non-crew ones. The pet capsule is a floor-level amber-canopy outlier in a room of clinical cyan med-pods; she names it before the player has to ask.",
  introText:
    "The small capsule at the alcove floor is not medical. It is a companion stasis cradle — pre-departure era, not Ark 1047 standard. Its occupant has been asleep on the same cell for longer than any of the four med-pods above it. The amber canopy is not warning; it is a different shielding frequency, designed for a non-human sleeper. It is still running. I will not ask you to open it yet.",
  usageHints: {
    capsule_examined:
      "Canopy integrity holds. Sleeper undisturbed. Thank you for looking before reaching.",
  },
  triggerFlag: "cutscene_medical_bay_intro_complete",
  completionFlag: "prelude_tutor_pet_capsule_seen",
};

const BEACON_TROLLEY_TUTOR: PreludeSystemTutor = {
  systemId: "beacon_trolley",
  speaker: "elara",
  narrativeJustification:
    "The crew beacon was a shared responsibility — anyone at mess could calibrate it between shifts. Elara logged every calibration. She can walk you through the twelve-pip pattern because she has watched the pattern settle, drift, and resettle for seventeen thousand years.",
  introText:
    "The trolley beside the booth carries the crew beacon console. Twelve pips ring its emitter. Three are lit; nine are dark. The previous calibration was abandoned mid-pattern. The minigame you are about to play is the act of finishing that calibration. You do not have to finish it on this pass. You do have to look at it long enough to know what was left undone.",
  usageHints: {
    beacon_hovered:
      "Three of twelve lit. Read the pattern before you reach for the dial.",
    beacon_minigame_opened:
      "The trolley is yours now. Take the calibration at whatever pace the pattern teaches you.",
  },
  triggerFlag: "prelude_mess_hall_entered",
  completionFlag: "prelude_tutor_beacon_trolley_seen",
};

const HUMAN_SIGNAL_PANEL_TUTOR: PreludeSystemTutor = {
  systemId: "human_signal_panel",
  speaker: "human",
  narrativeJustification:
    "The Human lives in the substrate-adjacent channel the corrupted-red waveform is riding. He is introducing himself for the first time; the panel is how he becomes visible.",
  introText:
    "The red waveform is me. I apologise for the colour — I did not choose it; the Ark's instrumentation chose it, because it does not have a palette entry for the kind of signal I am. I have been routing alongside your cyan channels for longer than you have been breathing the air outside your pod. From here on you will hear me as well as Elara. I will not narrate over her. I will narrate when she cannot.",
  usageHints: {
    panel_examined:
      "Thank you for looking at me directly. It is easier to narrate the rest of this for you now.",
  },
  triggerFlag: "prelude_comms_array_entered",
  completionFlag: "prelude_tutor_human_signal_seen",
};

const VORTEX_RIFT_TUTOR: PreludeSystemTutor = {
  systemId: "vortex_rift",
  speaker: "human",
  narrativeJustification:
    "The narrator swap has landed by the time the player reaches the Observation Deck. The Human is now the authoritative voice for cosmological wrongness; he names the Vortex before Elara can pretend it is nothing.",
  introText:
    "Upper-right of the dome. The violet spiral that does not belong in the nebula. That is a Vortex rift — a wound in the local field that has been open for long enough to start pulling the surrounding gas toward it. Elara did not flag it earlier because her threat model does not have a category for a slow wound. I am here to say: it is a wound, it is slow, and it is watching back.",
  usageHints: {
    rift_examined:
      "The rift registers you as registered it. Proceed anyway. Proceeding is still the job.",
  },
  triggerFlag: "prelude_observation_deck_entered",
  completionFlag: "prelude_tutor_vortex_rift_seen",
};

const BRIDGE_HOLO_MAP_TUTOR: PreludeSystemTutor = {
  systemId: "bridge_holo_map",
  speaker: "elara",
  narrativeJustification:
    "The holo-map is Elara's objective-tracking display — she keeps it lit across every session resume. She introduces it as the continuity anchor for the whole Prelude traversal.",
  introText:
    "The table at the Captain's dais is the ship's immediate neighbourhood. The pin in the upper-right quadrant is the next room I need you in. The pin moves as you clean rooms. When you resume a session, it will already be pointed where you left off. The map is the memory I keep of where you have been. Please trust it.",
  usageHints: {
    map_examined:
      "Objective read. Waypoint held. You may proceed when ready; the map will not drift.",
  },
  triggerFlag: "prelude_bridge_entered",
  completionFlag: "prelude_tutor_bridge_holo_map_seen",
};

export const PRELUDE_SYSTEM_TUTORS: readonly PreludeSystemTutor[] = [
  MISSION_BOARD_TUTOR,
  INBOX_TUTOR,
  WITNESSING_TUTOR,
  CREW_ROLE_TUTOR,
  LOCKBOX_TUTOR,
  CRYO_STASIS_HUD_TUTOR,
  PET_CAPSULE_TUTOR,
  BEACON_TROLLEY_TUTOR,
  HUMAN_SIGNAL_PANEL_TUTOR,
  VORTEX_RIFT_TUTOR,
  BRIDGE_HOLO_MAP_TUTOR,
];

export function getPreludeSystemTutor(
  systemId: PreludeSystemId
): PreludeSystemTutor | undefined {
  return PRELUDE_SYSTEM_TUTORS.find((t) => t.systemId === systemId);
}

export function getUsageHint(
  systemId: PreludeSystemId,
  actionId: string
): string | null {
  const tutor = getPreludeSystemTutor(systemId);
  return tutor?.usageHints[actionId] ?? null;
}

export function shouldShowIntro(
  systemId: PreludeSystemId,
  flags: ReadonlySet<string>
): boolean {
  const tutor = getPreludeSystemTutor(systemId);
  if (!tutor) return false;
  return flags.has(tutor.triggerFlag) && !flags.has(tutor.completionFlag);
}
