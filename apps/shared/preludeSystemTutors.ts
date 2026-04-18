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

export type PreludeSystemId = "mission_board" | "inbox" | "witnessing";
export type PreludeTutorSpeaker = "locke" | "human" | "seer";

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

export const PRELUDE_SYSTEM_TUTORS: readonly PreludeSystemTutor[] = [
  MISSION_BOARD_TUTOR,
  INBOX_TUTOR,
  WITNESSING_TUTOR,
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
