/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN ASSIGNMENTS — diegetic CoNexus prescriptions

   The Antiquarian doesn't dump 33 tomes on the player at once.
   At each Act + Antiquarian-trust milestone, he hands them a
   single Tome that resonates with what's about to unfold in
   the main saga. Completing the assignment sets a one-shot
   narrativeFlag that other systems (Epoch Witness gates,
   Antiquarian dialogue callbacks, lore unlocks) already key off.

   Lore framing: every assignment is something the Antiquarian
   has *already watched happen* in another timeline. He's not
   asking the player to read for fun — he's asking them to
   carry that ending forward so this timeline's choice is
   informed by the others' grief.
   ═══════════════════════════════════════════════════════ */

export interface AntiquarianAssignment {
  /** Stable id; sets `antiquarian_assignment_<id>_complete` on completion. */
  id: string;
  /** CoNexus game id (must match conexusGames.ts ConexusGame.id). */
  gameId: string;
  /** Lowest narrativeAct the Antiquarian will hand this over (0-7). */
  requiredAct: number;
  /** Antiquarian trust (npcTrust["antiquarian"]) required. */
  requiredTrust: number;
  /** Optional extra narrativeFlag that must already be set (e.g. previous act beat). */
  requiredFlag?: string;
  /** The Antiquarian's in-character pitch when he hands it over. */
  prescription: string;
  /** What he says after the Tome is closed — usually a sting that previews the next saga beat. */
  postscript: string;
}

export const ANTIQUARIAN_ASSIGNMENTS: AntiquarianAssignment[] = [
  {
    id: "fulcrum",
    gameId: "welcome-to-celebration",
    requiredAct: 1,
    requiredTrust: 10,
    prescription:
      "Begin with Celebration. Every Architect was a child who thought the city loved them back. " +
      "Read what they refused to see, so you'll recognise it when this Ark starts smiling at you.",
    postscript:
      "Good. Now you know the shape of a happy lie. The Bridge will start telling you one tomorrow.",
  },
  {
    id: "watcher_eyes",
    gameId: "eyes-of-the-watcher",
    requiredAct: 2,
    requiredTrust: 20,
    prescription:
      "Elara's about to ask you to trust the conspiracy board. Before you do — meet a synthetic " +
      "spy whose loyalty fractured exactly the way hers did. Same wound, different timeline.",
    postscript:
      "You felt the Watcher hesitate. Hold onto that. Elara hesitates the same way; she just hides it better.",
  },
  {
    id: "engineer_trial",
    gameId: "the-engineer-foundation",
    requiredAct: 2,
    requiredTrust: 30,
    prescription:
      "The Empire is about to put an engineer on trial. In another timeline they put The Engineer " +
      "on the same dais — for the same reason, with the same evidence. Read his last day, then vote.",
    postscript:
      "The Witness vote will come. Don't ask me how to mark your ballot — I want to see if reading " +
      "him changes how you weigh what 'a weapon' means.",
  },
  {
    id: "kael_loaded",
    gameId: "kaels-revenge",
    requiredAct: 3,
    requiredTrust: 30,
    prescription:
      "Before you forgive Kael — or curse him — read what the Recruiter actually carried out of " +
      "the Panopticon. The Warlord let him go. The Thought Virus is in every Ark he's ever touched. " +
      "Including, almost certainly, this one.",
    postscript:
      "Now you know why Elara won't meet your eyes when you mention his name.",
  },
  {
    id: "samsara_cycle",
    gameId: "civil-war-samsara-rising",
    requiredAct: 4,
    requiredTrust: 40,
    prescription:
      "Samsara is not a god. He is a loop with branding. I have watched the Potentials lose to him " +
      "in eleven timelines I can name and forty I cannot. Walk the loop once, on paper, before he " +
      "asks you to walk it for real.",
    postscript:
      "You broke the cycle in the Tome. Remember how. The Bazaar is going to ask the same question " +
      "with louder consequences.",
  },
  {
    id: "host_symbiosis",
    gameId: "the-host",
    requiredAct: 4,
    requiredTrust: 50,
    prescription:
      "The Source will offer you a bond soon. Before you answer, witness a Potential who said yes. " +
      "There is a difference between symbiosis and possession. The Tome teaches you where the line " +
      "lives — and where it lies about living.",
    postscript:
      "When the Source asks, you'll know which question is the real one. That's all I can give you.",
  },
  {
    id: "blood_weave_gates",
    gameId: "blood-weave-gates-of-hell",
    requiredAct: 5,
    requiredTrust: 60,
    prescription:
      "The Hierarchy is not a religion. It is a corporate structure that bills in blood. Mol'Garath " +
      "is about to offer you a contract. Read someone else's first — and notice which clauses are " +
      "always written in the same hand.",
    postscript:
      "Every gate in that Tome opened from this side. Remember that the next time something asks " +
      "you nicely to step closer.",
  },
  {
    id: "dischordian_logic",
    gameId: "dischordian-logic",
    requiredAct: 6,
    requiredTrust: 70,
    prescription:
      "We are out of metaphors. The Architect, the Source, the Enigma — they're going to break " +
      "cause and effect on purpose, soon, and you'll be standing inside the break. This Tome is " +
      "a manual for thinking when the rules stop. I wrote half of it. The other half wrote me.",
    postscript:
      "If you finished it without losing your name, the next vote is yours to lose. I trust you to lose it well.",
  },
  {
    id: "silence_in_heaven",
    gameId: "whispers-of-madness",
    requiredAct: 7,
    requiredTrust: 80,
    prescription:
      "There is a sound at the edge of every timeline I have catalogued. It is not silence. It is " +
      "the noise the universe makes when something older than narrative starts paying attention. " +
      "You're about to hear it. This Tome is the only one I have read more than once.",
    postscript:
      "Now you know what I've been listening to. Now you know why the goggles glow. " +
      "Whatever you decide next — decide it knowing I will witness it. That is the only promise I have left.",
  },
];

/** Read the player's Antiquarian trust from npcTrust (key: "antiquarian"). */
export function getAntiquarianTrust(npcTrust: Record<string, number> | undefined): number {
  return npcTrust?.["antiquarian"] ?? 0;
}

/** All assignments unlocked for the current act/trust/flags but not yet completed. */
export function getActiveAssignments(opts: {
  narrativeAct: number;
  antiquarianTrust: number;
  narrativeFlags: Record<string, boolean>;
  completedGames: ReadonlyArray<string>;
}): AntiquarianAssignment[] {
  const { narrativeAct, antiquarianTrust, narrativeFlags, completedGames } = opts;
  return ANTIQUARIAN_ASSIGNMENTS.filter((a) => {
    if (narrativeAct < a.requiredAct) return false;
    if (antiquarianTrust < a.requiredTrust) return false;
    if (a.requiredFlag && !narrativeFlags?.[a.requiredFlag]) return false;
    if (narrativeFlags?.[`antiquarian_assignment_${a.id}_complete`]) return false;
    if (completedGames.includes(a.gameId)) return false;
    return true;
  });
}

/** Stable, predictable flag the Antiquarian sets when an assignment is closed. */
export function assignmentCompletionFlag(id: string): string {
  return `antiquarian_assignment_${id}_complete`;
}
