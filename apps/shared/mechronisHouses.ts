import { assetUrl } from "@shared/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   MECHRONIS HOUSES — Sorting & House Cup

   Twelve Guilds collapse into four Houses for Academy life.
   Every first-year is sorted the day they arrive: the
   dominant Archon mentor decides, but the ceremony is
   staged. The Crownless Lectern "feels" you. Everyone pretends.

   Houses compete all semester. Points come from lesson
   grades, detentions (negative), Distinctions (+5), and
   House Cup week. At semester's end, the winning House's
   common room is lit for one night and the Architect's
   personal commendation is read aloud. No one explains
   what a commendation actually unlocks.

   Design parity: shape mirrors celebrationTrial /
   mechronisLessons so the daily-loop UI can surface House
   state without branching.
   ═══════════════════════════════════════════════════════ */

export interface MechronisHouse {
  id: string;
  /** Formal public name ("House Corvex"). */
  name: string;
  /** Informal student slang. */
  nickname: string;
  /** Three-line motto engraved above the hearth. */
  motto: string;
  /** The creature or sigil students wear on their robes. */
  sigil: string;
  /** Accent colour — used for UI and crest. */
  color: string;
  /** Secondary/trim colour. */
  accent: string;
  /** Thematic domain. What this House is FOR. */
  domain: string;
  /** Which Archon numbers belong to this House (by guild). */
  archonNumbers: number[];
  /** The Head of House — a Professor whose signature defines the place. */
  headProfessorId: string;
  /** The disciplinary specialty — their favorite punishment. */
  signatureDetention: string;
  /** What a graduate becomes (the brochure version). */
  graduateFlavor: string;
  /** The darker truth under the brochure. */
  hiddenTruth: string;
  /** Common room description — Hogwarts-common-room tone. */
  commonRoom: string;
  /** Background art key (see MechronisAcademyPage CLASSROOM_ART). */
  commonRoomArt: string;
  /**
   * Short ambient loop path. Silently falls back to no-audio if absent.
   * Convention: /audio/ambient/mechronis/<house-id>.mp3
   */
  ambientAudio: string;
}

export const MECHRONIS_HOUSES: MechronisHouse[] = [
  {
    id: "house_resonance",
    name: "House Resonance",
    nickname: "The Choirboys",
    motto: "One voice. One verdict. One vote.",
    sigil: "A tuning fork crossed with an open mouth",
    color: "#C59A3F",      // warm brass
    accent: "#F4E4B8",
    domain: "Orchestration, persuasion, soft-power choreography",
    archonNumbers: [1, 5, 7], // Chorus, Influencers, Congress
    headProfessorId: "prof_conductor",
    signatureDetention:
      "Write the class anthem. Sing it alone at morning assembly. Keep singing until the Headmaster nods.",
    graduateFlavor:
      "Diplomats, choir-masters, press secretaries, public-mood engineers.",
    hiddenTruth:
      "Resonance students are the Architect's voice-box. Half of them never speak in their own register again.",
    commonRoom:
      "A tiered amphitheatre with no proscenium. Every seat is a prompter. The walls hum at 432 Hz when the House is winning. When it loses, they whisper the names of every Resonance student who ever graded below the mean.",
    commonRoomArt: assetUrl("art/mechronis/common-rooms/resonance.jpg"),
    ambientAudio: assetUrl("audio/ambient/mechronis/resonance.mp3"),
  },
  {
    id: "house_umbra",
    name: "House Umbra",
    nickname: "The Watchers",
    motto: "Observe. Record. Never be the subject.",
    sigil: "An unblinking eye inside a keyhole",
    color: "#3A4A5E",      // overcast slate
    accent: "#A8B4C2",
    domain: "Surveillance, archive-keeping, counterintelligence",
    archonNumbers: [2, 3, 8], // Eyes, Archive, Locks
    headProfessorId: "prof_watcher",
    signatureDetention:
      "Keep a ledger of every word every Umbra classmate says for a week. Submit. Discover yours was also kept.",
    graduateFlavor:
      "Investigators, conservators, intelligence officers, night librarians.",
    hiddenTruth:
      "Umbra graduates own every other House's secrets. They carry them quietly to the Architect, which is why they walk so softly.",
    commonRoom:
      "A low-ceilinged reading room lit by green-shaded lamps. The bookcases are two-way mirrors. Cushions have the gentle depression of someone who was just sitting there. The fire never crackles — fireplaces leak information.",
    commonRoomArt: assetUrl("art/mechronis/common-rooms/umbra.jpg"),
    ambientAudio: assetUrl("audio/ambient/mechronis/umbra.mp3"),
  },
  {
    id: "house_ironflight",
    name: "House Ironflight",
    nickname: "The Pyrelings",
    motto: "Forged once. Broken once. Re-forged until useful.",
    sigil: "A winged anvil with a grave engraved beneath it",
    color: "#B83232",      // forge red
    accent: "#F4B13A",
    domain: "Warfare, craft, resurrection-grade endurance",
    archonNumbers: [6, 10, 11], // Yellow Coats, Living, Forge
    headProfessorId: "prof_warlord",
    signatureDetention:
      "Carry a classmate's failed project across the quad while the class grades your posture. Do not drop it. Do not speak.",
    graduateFlavor:
      "Officers, artificers, field medics, weapons-testing volunteers.",
    hiddenTruth:
      "Ironflight graduates come back from the dead on request. They bring less of themselves each time. The House pretends not to count.",
    commonRoom:
      "A long-hall with a running forge at one end and a running wake at the other. The sword rack is also the memorial. Students sharpen their blades on the whetstones of students who didn't come back.",
    commonRoomArt: assetUrl("art/mechronis/common-rooms/ironflight.jpg"),
    ambientAudio: assetUrl("audio/ambient/mechronis/ironflight.mp3"),
  },
  {
    id: "house_liminal",
    name: "House Liminal",
    nickname: "The Threshold Kids",
    motto: "There is always one more door. It is probably this one.",
    sigil: "A seven-door compass with no needle",
    color: "#6B4EA8",      // dusk violet
    accent: "#C9A8E0",
    domain: "Mystery, rule-exploitation, dimensional cartography",
    archonNumbers: [4, 9, 12], // Between, Grey Gamers, Architect's Study
    headProfessorId: "prof_game_master",
    signatureDetention:
      "Solve a puzzle whose first clue is 'you are the puzzle.' Turn in your answer by walking through the seventh door. If you chose wrong, the detention lasts a semester.",
    graduateFlavor:
      "Detectives, probability scouts, Matrix engineers, the Architect's personal agents.",
    hiddenTruth:
      "Liminal graduates are the only ones who ever meet the Architect in person. The meeting happens inside a classroom door they cannot later locate on any map.",
    commonRoom:
      "A sitting room that reshuffles when no one is looking. The armchairs know who prefers them. The hearth rug is stitched from every lost-property scarf the House has ever failed to return. The door number on the common-room door is a different prime every morning.",
    commonRoomArt: assetUrl("art/mechronis/common-rooms/liminal.jpg"),
    ambientAudio: assetUrl("audio/ambient/mechronis/liminal.mp3"),
  },
];

/* ─── HELPERS ─── */

export function getHouse(id: string): MechronisHouse | undefined {
  return MECHRONIS_HOUSES.find(h => h.id === id);
}

export function getHouseForArchon(archonNumber: number): MechronisHouse | undefined {
  return MECHRONIS_HOUSES.find(h => h.archonNumbers.includes(archonNumber));
}

export function getHouseForProfessor(professorId: string): MechronisHouse | undefined {
  // Walk each house's archonNumbers and match via professor archon mapping.
  // Keeps House lookup independent of Professor file ordering.
  const archonByProf: Record<string, number> = {
    prof_conductor: 1, prof_watcher: 2, prof_collector: 3, prof_vortex: 4,
    prof_meme: 5, prof_warlord: 6, prof_politician: 7, prof_warden: 8,
    prof_game_master: 9, prof_necromancer: 10, prof_engineer: 11, prof_human: 12,
  };
  const archon = archonByProf[professorId];
  if (archon === undefined) return undefined;
  return getHouseForArchon(archon);
}

/**
 * Map a lesson grade to House Cup points.
 * Distinction = +5, Honor = +2, Pass = 0, Fail = -3.
 * Mirrors scholarly-rivalry pacing (enough points to notice, not enough to runaway).
 */
export function houseCupPointsForGrade(grade: "fail" | "pass" | "honor" | "distinction"): number {
  switch (grade) {
    case "distinction": return 5;
    case "honor": return 2;
    case "pass": return 0;
    case "fail": return -3;
  }
}

/**
 * Compute current House Cup standings from a points record.
 * Houses missing from the record default to 0. Returned sorted high→low.
 */
export function houseStandings(points: Record<string, number>): { house: MechronisHouse; points: number }[] {
  return MECHRONIS_HOUSES
    .map(house => ({ house, points: points[house.id] ?? 0 }))
    .sort((a, b) => b.points - a.points);
}
