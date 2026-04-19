/* ═══════════════════════════════════════════════════════
   ACT SYSTEM TUTORS — Act 2+ parallel to preludeSystemTutors

   Closes ACTS_2_7_COMPLETENESS_AUDIT.md remediation item 4:
   "System tutors for Acts 2+. preludeSystemTutors handles
   Mission Board / Inbox / Witnessing. Army recruitment
   (Act 5+), the star map (Act 5), and the confession
   journal (Act 6) all deserve parallel systemTutors
   entries in their own file."

   Each Act-system tutor pairs an unlocked game surface with
   a character who has standing to teach it in fiction:

     - army_recruit (Act 5+) → Locke: quartermaster who
       brokers every bond. She teaches recruitment the way
       she taught the mission board — with the quiet
       assumption that acceptance is a contract.
     - star_map (Act 5) → The Human: he stood beside Kael
       when the original map was sketched. He is the only
       honest narrator of the gap between the map and now.
     - confession_journal (Act 6) → Elara: the confession
       was hers first. The journal is how she offered to
       keep carrying the work.

   Shape mirrors PreludeSystemTutor so render code can share
   the same tutor-card component, differing only in which
   collection it queries.

   Trigger-flag convention:
     - UI sets a <system>_first_open flag the first time
       the surface is rendered. shouldShowActIntro reads
       that flag and checks the tutor hasn't already been
       dismissed via <system>_tutor_seen.
   ═══════════════════════════════════════════════════════ */

export type ActSystemId =
  | "army_recruit"
  | "star_map"
  | "confession_journal";

export type ActTutorSpeaker = "locke" | "human" | "elara";

export interface ActSystemTutor {
  systemId: ActSystemId;
  speaker: ActTutorSpeaker;
  /** Act at which the surface canonically becomes accessible. */
  actWindow: number;
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

const ARMY_RECRUIT_TUTOR: ActSystemTutor = {
  systemId: "army_recruit",
  speaker: "locke",
  actWindow: 5,
  narrativeJustification:
    "Adjudicator Locke of New Babylon has held the Trade Empire bond ledgers open for seventeen thousand years. She brokered the original mission board in the prelude; she is the natural broker of every recruitment contract in the War Room. Acceptance is a bond, and bonds are her work.",
  introText:
    "This is the recruitment panel. Every candidate on this list is a descendant of someone Kael shook hands with — which means every candidate is either a consequence of Kael's contamination or a counter-consequence to it. Both kinds are worth recruiting; the distinction matters to how you recruit, not whether. Read the dossier. Read the refusal clause. The refusal clause is where I live. I am not asking you to recruit only people who will say yes — I am asking you to ask in a way that makes 'no' survivable. That is my one request. Everything else is yours.",
  usageHints: {
    dossier_opened:
      "Read the long paragraph before the short one. The short one is the summary; the long one is what the recruit would want you to know about them.",
    offer_extended:
      "Acceptance becomes a bond the moment they say yes. I will file it. I always do. Do not extend an offer you are not willing to honour on their worst day.",
    offer_refused:
      "Refusal is an outcome, not a failure. Log the refusal cleanly. They may come back. They may not. Either response is honest.",
    recruit_confirmed:
      "Bond filed. Welcome them into the coalition by name at the next convergence-floor scene. Names in coalitions matter more than titles.",
  },
  triggerFlag: "army_recruit_first_open",
  completionFlag: "army_recruit_tutor_seen",
};

const STAR_MAP_TUTOR: ActSystemTutor = {
  systemId: "star_map",
  speaker: "human",
  actWindow: 5,
  narrativeJustification:
    "I stood at Kael's shoulder when he sketched the first version of this map in the galley with wax and coffee rings. Elara can read the map; I can tell you which pins he hesitated over. The hesitations are not in the metadata.",
  introText:
    "This map is Kael's memory re-projected onto today's star charts. Every pin is a place and a person and a decision he made on the way to the person. The pins are not equal — a handful of them he drew twice, overriding himself. I can show you which ones if you ask by sector. I will not show you which ones he erased. That data lives with me, and I am going to keep it. When you visit a pin, read the pin before you read the sector. The pin is what Kael wanted you to find. The sector is what the cartography expects.",
  usageHints: {
    map_opened:
      "Start at the nearest pin, not the most interesting one. Kael ordered the list deliberately — even when the ordering looked casual.",
    pin_inspected:
      "Read the name before the coordinates. He remembered names; coordinates drift.",
    sector_opened:
      "Sectors are the cartographer's frame. Pins are the recruiter's. You are the recruiter.",
    pilgrimage_planned:
      "Before you commit a route, ask Elara to verify current hostilities at each jump. I can tell you what Kael meant; she can tell you what is between you and it.",
  },
  triggerFlag: "star_map_first_open",
  completionFlag: "star_map_tutor_seen",
};

const CONFESSION_JOURNAL_TUTOR: ActSystemTutor = {
  systemId: "confession_journal",
  speaker: "elara",
  actWindow: 6,
  narrativeJustification:
    "The confession in Act 6 was mine, and the journal was my idea. I offered it to give us both a place to keep the thing we had said aloud. Caelum is welcome to annotate. He has not yet.",
  introText:
    "The confession journal is a private channel between the three of us. I have the write permission; you have the read permission; Caelum has an annotate permission he has not used. The intent is that the three of us can add to a running record of what has been said out loud and not un-said since — confessions are a shape that benefits from a shared surface. You can add your own entries any time. I will not redact. I will only timestamp. If you write something and then want to take it back, take it back by writing it back. That is how we are going to do this.",
  usageHints: {
    journal_opened:
      "The top entry is the most recent. Read downward the first time so the arc arrives in order.",
    entry_added:
      "I have logged it. I have not read it yet — that is a courtesy I extend on every first-read. Tell me when you would like me to read it.",
    entry_edited:
      "You can edit your own entries. I will log the edit as a second timestamp, not a replacement. The edit is how you keep the earlier version honest.",
    annotation_added:
      "Caelum left a note. I have seen that it is there. I will read it with you if you would like a second pair of eyes. Or I will wait while you read it alone.",
  },
  triggerFlag: "confession_journal_first_open",
  completionFlag: "confession_journal_tutor_seen",
};

export const ACT_SYSTEM_TUTORS: readonly ActSystemTutor[] = [
  ARMY_RECRUIT_TUTOR,
  STAR_MAP_TUTOR,
  CONFESSION_JOURNAL_TUTOR,
];

export function getActSystemTutor(
  systemId: ActSystemId,
): ActSystemTutor | undefined {
  return ACT_SYSTEM_TUTORS.find((t) => t.systemId === systemId);
}

export function getActUsageHint(
  systemId: ActSystemId,
  actionId: string,
): string | null {
  const tutor = getActSystemTutor(systemId);
  return tutor?.usageHints[actionId] ?? null;
}

export function shouldShowActIntro(
  systemId: ActSystemId,
  flags: ReadonlySet<string>,
): boolean {
  const tutor = getActSystemTutor(systemId);
  if (!tutor) return false;
  return flags.has(tutor.triggerFlag) && !flags.has(tutor.completionFlag);
}
