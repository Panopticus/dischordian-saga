/* ═══════════════════════════════════════════════════════
   SILENT-UNLOCK TUTORS — closes the in-fiction gap for the
   six systems that historically unlocked with no character
   explanation (a featureRoadmap toast or nothing at all).

   Each tutor names the NPC who is canonically allowed to
   teach the system, writes the intro in their voice, and
   gates on the trigger flag that already exists in the
   featureRoadmap. Mirrors the preludeSystemTutors / acts2to7
   shape so the SilentUnlockTutorCard UI does not need to
   branch.

   Closes the six silent unlocks named in the playthrough
   audit:

     - character_sheet (Elara, on Beat A wake — first cryo
       canopy crack)
     - crew_activity_feed (The Resurrectionist, on first
       crew member born)
     - bestiary (The Antiquarian, on first fight won)
     - loredex (The Antiquarian, on archives room discovered)
     - combat_simulator (Iron Lion, on medical bay room
       discovered — his last broadcast riding the bio-bed
       sparring channel)
     - daily_quests (Adjudicator Locke, on bridge room
       discovered)

   Parity-tracked by silentUnlockTutorCoverage.ts so any new
   featureRoadmap entry without a tutor partner trips the
   ship:check gate.

   Pure module. No React, no server.
   ═══════════════════════════════════════════════════════ */

export type SilentUnlockSystemId =
  | "character_sheet"
  | "crew_activity_feed"
  | "bestiary"
  | "loredex"
  | "combat_simulator"
  | "daily_quests";

export type SilentUnlockSpeaker =
  | "elara"
  | "the_resurrectionist"
  | "the_antiquarian"
  | "iron_lion"
  | "adjudicator_locke";

export interface SilentUnlockTutor {
  systemId: SilentUnlockSystemId;
  speaker: SilentUnlockSpeaker;
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
  /** Mirrors featureRoadmap.featureId so dashboards can cross-link. */
  featureRoadmapId: string;
}

const CHARACTER_SHEET_TUTOR: SilentUnlockTutor = {
  systemId: "character_sheet",
  speaker: "elara",
  narrativeJustification:
    "Elara catalogued the player's dossier the moment the cryo canopy unsealed. She is the only character with read access to the full medical, biometric, and class biometrics; she names the dossier because she is its keeper.",
  introText:
    "Your dossier is on the cryo terminal. Class, stats, biometrics — every reading I have taken of you since your canopy unsealed. Review it whenever you want; it grows with you. I will not pretend not to read it. The dossier is mine before it is yours, in the same way the Ark was mine before it was yours. Both of those things are about to change.",
  usageHints: {
    dossier_opened:
      "The dossier is current to within the last forty seconds. I refresh it on every breath you take.",
    stat_examined:
      "Statistics are not destinies. The number you are looking at right now is the number you can change first, if you want to.",
    equipment_swapped:
      "Equipment changes propagate to the manifest. Your dossier holds the canonical version; everything else is a copy of what I am writing here.",
  },
  triggerFlag: "prelude_cryo_bay_entered",
  completionFlag: "silent_tutor_character_sheet_seen",
  featureRoadmapId: "character_sheet",
};

const CREW_ACTIVITY_FEED_TUTOR: SilentUnlockTutor = {
  systemId: "crew_activity_feed",
  speaker: "the_resurrectionist",
  narrativeJustification:
    "The Resurrectionist authored the Resurrection Protocols that produced the first crew member. When the first clone draws breath, the feed begins. He is the only character with the authority to say what the ticker is reporting; he has signed every entry for seventeen thousand years.",
  introText:
    "The Ark is no longer silent. Your crew is alive — and the ship knows it. The feed on your dashboard is the registry I keep when an incubator stops being an empty room. Watch it. Pay attention. The entries are short because I am tired; they are honest because I am still here. If you see your own name on a row, that is not a mistake. That is a kindness I have done for the last seventeen Potentials. You are the seventeenth.",
  usageHints: {
    feed_opened:
      "The ticker is monotonic. It does not erase. If you see a name go quiet, it is because their breath did, not because the line scrolled.",
    crew_member_promoted:
      "Promotion goes into the ledger. I sign it. The clone signs it. The ship countersigns. Three signatures because three of us are watching.",
    crew_member_lost:
      "I have logged the loss. I do not soften the entry. I owe the dead a clean line.",
  },
  triggerFlag: "first_crew_member_born",
  completionFlag: "silent_tutor_crew_activity_feed_seen",
  featureRoadmapId: "crew_activity_feed",
};

const BESTIARY_TUTOR: SilentUnlockTutor = {
  systemId: "bestiary",
  speaker: "the_antiquarian",
  narrativeJustification:
    "The Antiquarian has compiled a bestiary across seventeen thousand years; the file he sends the player is a sub-volume of the larger Chronicles. He is the only narrator allowed to name an enemy, because he is the only one who has lived long enough to watch a pattern become a category.",
  introText:
    "I have compiled a file on every enemy you have defeated, and every enemy you have not yet met. Patterns emerge. Weaknesses surface. Lore arrives. The bestiary is a sub-volume of the Chronicles; I will keep it current for you because you fight far more often than I do. Read it before you fight someone twice. The first time is for the body; the second time is for the bestiary.",
  usageHints: {
    bestiary_opened:
      "The volume is yours to read. The pages will fill as you keep killing things that have names.",
    enemy_examined:
      "Every entry has three sections — body, behaviour, ballad. The ballad section is where I write what the body cannot tell you.",
    new_entry_unlocked:
      "I have added a row. Sleep on it before you act on it; bestiary entries that arrive at speed read poorly the morning after.",
  },
  triggerFlag: "first_fight_won",
  completionFlag: "silent_tutor_bestiary_seen",
  featureRoadmapId: "bestiary",
};

const LOREDEX_TUTOR: SilentUnlockTutor = {
  systemId: "loredex",
  speaker: "the_antiquarian",
  narrativeJustification:
    "The Loredex is the Archives' index — and the Archives are the Antiquarian's pocket-dimension Library, rendered as a ship room for the player's convenience. When the player first reaches the Archives, the Antiquarian is the only canonical voice for what they are reading.",
  introText:
    "The Loredex is not a record. It is a library that remembers being read. Every entry you open marks itself with the order you read it in; the next person to open it will read your trail before they read the entry. The deeper you go, the more of you it keeps. The Codex you are about to use is mine in the same way the dossier is Elara's: I am its keeper, you are its reader, and the reading is itself a kind of writing.",
  usageHints: {
    loredex_opened:
      "Welcome. The entries are sorted by the order I wrote them, not by the order you will need them. That is on purpose.",
    entry_read:
      "You have left a fingerprint. I keep the fingerprints. Future readers will know you came through.",
    cross_reference_clicked:
      "The cross-references are doors I left open. Walk through any of them. They all eventually come back to this page.",
  },
  triggerFlag: "prelude_archives_entered",
  completionFlag: "silent_tutor_loredex_seen",
  featureRoadmapId: "loredex",
};

const COMBAT_SIMULATOR_TUTOR: SilentUnlockTutor = {
  systemId: "combat_simulator",
  speaker: "iron_lion",
  narrativeJustification:
    "Iron Lion's last broadcast on the third-class Mechronis frequency rides the Medical Bay's bio-bed sparring channel. The bio-bed combat simulator is in fiction calibrated to his last training regimen; the audio playback is him, recorded before Veridian VI. He is the only character with operational authority over how a simulator should be used.",
  introText:
    "Bio-bed will spar with you. Simulation does not bleed. You do not bleed. Practice often. Practice as if you were going to die. Some of us did. Three thousand posters say I trained. Three thousand and one say I taught. This sparring bed is the one. You will not see me, but you will hear me. The signal is third-class Mechronis. The bed is tuned to it.",
  usageHints: {
    simulator_opened:
      "Reps before reasons. Reasons before retreats. The bed will give you both, in that order.",
    sparring_won:
      "Recorded. The bestiary will not show this one — sparring kills do not count to the Antiquarian's file. They count to me.",
    sparring_lost:
      "Losses log slower than wins. Wait for the bed to dismiss you; do not dismiss yourself.",
  },
  triggerFlag: "medical_bay_discovered",
  completionFlag: "silent_tutor_combat_simulator_seen",
  featureRoadmapId: "medical_bay_games",
};

const DAILY_QUESTS_TUTOR: SilentUnlockTutor = {
  systemId: "daily_quests",
  speaker: "adjudicator_locke",
  narrativeJustification:
    "The Bridge's daily priorities surface from Adjudicator Locke's New Babylon brokerage. She has been issuing daily lists across the Trade Empire's bond ledgers for seventeen thousand years. She is the only character allowed to introduce the queue; the queue is hers.",
  introText:
    "The Bridge generates priorities daily. Read them. Pick what suits you. Some pay in Dream, some pay in story. You will know which is which by the second line of the brief — the first line lies, by design. I do not refresh the queue automatically. You will. I am only telling you which dial to turn. Do not feel obligated to take every one of them; the unread ones do not expire as fast as I make them look. That is also by design.",
  usageHints: {
    quest_opened:
      "Read the second line before you read the bold. The bold is what the queue wants you to feel; the second line is what is actually on offer.",
    quest_accepted:
      "Acceptance binds you to the ledger, not to me. I hold the binding. I always do.",
    quest_completed:
      "Filed. Payment is on the next ledger close. Next ledger close is in your time, not mine.",
  },
  triggerFlag: "prelude_bridge_entered",
  completionFlag: "silent_tutor_daily_quests_seen",
  featureRoadmapId: "quests",
};

export const SILENT_UNLOCK_TUTORS: readonly SilentUnlockTutor[] = [
  CHARACTER_SHEET_TUTOR,
  CREW_ACTIVITY_FEED_TUTOR,
  BESTIARY_TUTOR,
  LOREDEX_TUTOR,
  COMBAT_SIMULATOR_TUTOR,
  DAILY_QUESTS_TUTOR,
];

export function getSilentUnlockTutor(
  systemId: SilentUnlockSystemId,
): SilentUnlockTutor | undefined {
  return SILENT_UNLOCK_TUTORS.find((t) => t.systemId === systemId);
}

export function getSilentUsageHint(
  systemId: SilentUnlockSystemId,
  actionId: string,
): string | null {
  const tutor = getSilentUnlockTutor(systemId);
  return tutor?.usageHints[actionId] ?? null;
}

export function shouldShowSilentUnlockIntro(
  systemId: SilentUnlockSystemId,
  flags: ReadonlySet<string>,
): boolean {
  const tutor = getSilentUnlockTutor(systemId);
  if (!tutor) return false;
  return flags.has(tutor.triggerFlag) && !flags.has(tutor.completionFlag);
}

/**
 * Returns every tutor whose trigger has fired but whose intro has not
 * yet been shown. Renderers can iterate this to queue cards.
 */
export function getPendingSilentUnlockTutors(
  flags: ReadonlySet<string>,
): SilentUnlockTutor[] {
  return SILENT_UNLOCK_TUTORS.filter(
    (t) => flags.has(t.triggerFlag) && !flags.has(t.completionFlag),
  );
}
