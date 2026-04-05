/* ═══════════════════════════════════════════════════════
   ARCHON TRAINING VOICES

   The 12 Inner Voices of a Potential are not internal
   monologue — they are the TRAINING VOICES of the 12 Archons
   who shaped the Potentials through simulated experience,
   just as they once shaped The Human (The Seeker) and Kael
   (Iron Lion) at Mechronis Academy.

   Every Potential is a Waking Dreamer. While you move through
   the world, your mind runs through the Matrix of Dreams —
   the virtual training-substrate where Project Celebration
   evaluates you, and where the Archons whisper lessons they
   once taught their Chosen.

   You do not hear your own thoughts. You hear the Academy.

   The 12 Mechronis Guilds were training houses within the
   Academy. Each skill maps to an Archon and their Guild.
   ═══════════════════════════════════════════════════════ */

import type { SkillId } from "./innerVoices";

export interface ArchonMentor {
  /** Archon's canonical name */
  archonName: string;
  /** Archon number (1-12) */
  archonNumber: number;
  /** Celebration-era casual alias (if any) */
  celebrationAlias?: string;
  /** Mechronis Academy guild they ran (if any) */
  mechronisGuild?: string;
  /** Tagline for the panel UI */
  tagline: string;
  /** What they teach at the Academy */
  discipline: string;
  /** First-person training mantra they repeat to students */
  mantra: string;
}

/* ─── THE MAPPING ─── */

export const ARCHON_VOICE_MAPPING: Record<SkillId, ArchonMentor> = {
  tactics: {
    archonName: "The Warlord",
    archonNumber: 6,
    celebrationAlias: "Wanda Wyrlord",
    mechronisGuild: "The Armies",
    tagline: "Every battle is a math problem — waiting to be solved before they do.",
    discipline: "Battlefield geometry, force projection, the calculus of survivable violence",
    mantra: "Count their angles before you count their numbers.",
  },
  perception: {
    archonName: "The Watcher",
    archonNumber: 2,
    celebrationAlias: "Kanshi-sha",
    mechronisGuild: "The Eyes",
    tagline: "Look again. Every surface has a seam.",
    discipline: "Surveillance, micro-expressions, the discipline of the unblinking gaze",
    mantra: "The all-seeing eye sees itself being seen. Watch that too.",
  },
  craftsmanship: {
    archonName: "The Engineer",
    archonNumber: 11,
    celebrationAlias: "The Prince of Celebration",
    tagline: "The machine wants to help you. Listen to its hum.",
    discipline: "Impossible machines, dimensional bridges, the hands that remember",
    mantra: "Nothing is finished. Nothing is broken. Only in-between.",
  },
  endurance: {
    archonName: "The Necromancer",
    archonNumber: 10,
    celebrationAlias: "Thazulok",
    mechronisGuild: "The Living",
    tagline: "Death negotiates. You just have to keep talking.",
    discipline: "Resurrection protocols, the art of outlasting, the physics of refusal",
    mantra: "I survived the Fall of Reality. You can survive tomorrow.",
  },
  negotiation: {
    archonName: "The Politician",
    archonNumber: 7,
    tagline: "Everyone wants something. Find it. Trade for it.",
    discipline: "Alliance-building, leverage mathematics, the choreography of concession",
    mantra: "The deal is made before either of you speaks. You are just discovering it.",
  },
  espionage: {
    archonName: "The Collector",
    archonNumber: 3,
    celebrationAlias: "Corey",
    tagline: "What they own will tell you who they are.",
    discipline: "Infiltration, soul-reading, the inventory of secrets",
    mantra: "Every artifact was someone's heart once. Handle them that way.",
  },
  leadership: {
    archonName: "The CoNexus",
    archonNumber: 1,
    tagline: "A network of wills can do what one cannot. Align them.",
    discipline: "Orchestration, the music of aligned intentions, the story that leads",
    mantra: "I am nowhere and everywhere. So is a leader. So are you.",
  },
  lore: {
    archonName: "The Human",
    archonNumber: 12,
    celebrationAlias: "The Seeker",
    mechronisGuild: "Mentored directly by The Architect",
    tagline: "Every mystery has already been solved once. Find who solved it.",
    discipline: "Investigation, historical parallels, the patient accumulation of fact",
    mantra: "I read the universe's files for fifteen thousand years. So can you. Start.",
  },
  empathy: {
    archonName: "The Meme",
    archonNumber: 5,
    celebrationAlias: "Minnie",
    mechronisGuild: "The Influencers",
    tagline: "Feel the wave before you ride it. Their emotions are a current.",
    discipline: "Emotional resonance, cultural waveforms, the virality of feeling",
    mantra: "I was destroyed for feeling too much. You can feel too. Just don't spread it all.",
  },
  paranoia: {
    archonName: "The Warden",
    archonNumber: 8,
    celebrationAlias: "Wayne",
    tagline: "The threat is already inside. Scan for the virus.",
    discipline: "Counter-infiltration, threat modeling, the immune system of the mind",
    mantra: "Every cell is a potential traitor. Know yours. Watch them.",
  },
  intuition: {
    archonName: "The Vortex",
    archonNumber: 4,
    celebrationAlias: "Vernon",
    tagline: "The dimensions whisper. The whisper is the answer.",
    discipline: "Dimensional sensing, probability-taste, the hunch that predates thought",
    mantra: "Reality has more doors than walls. You feel them before you see them.",
  },
  authority: {
    archonName: "The Game Master",
    archonNumber: 9,
    celebrationAlias: "Gary",
    mechronisGuild: "The Grey Gamers",
    tagline: "This is a game. You can rewrite the rules if you're the one running it.",
    discipline: "Rule-authorship, strategy systems, the governance of imagined space",
    mantra: "The Matrix of Dreams runs on consent. Claim yours. Grant others theirs.",
  },
};

/* ─── HELPERS ─── */

export function getArchonMentor(skillId: SkillId): ArchonMentor {
  return ARCHON_VOICE_MAPPING[skillId];
}

/**
 * Look up all 12 Archon mentors in order of their Archon number.
 */
export function getArchonMentorsByNumber(): Array<ArchonMentor & { skillId: SkillId }> {
  return (Object.entries(ARCHON_VOICE_MAPPING) as [SkillId, ArchonMentor][])
    .map(([skillId, mentor]) => ({ ...mentor, skillId }))
    .sort((a, b) => a.archonNumber - b.archonNumber);
}

/**
 * Find the skill associated with a specific Archon.
 */
export function getSkillForArchon(archonNumber: number): SkillId | null {
  const entry = Object.entries(ARCHON_VOICE_MAPPING).find(
    ([, m]) => m.archonNumber === archonNumber,
  );
  return (entry?.[0] as SkillId) ?? null;
}

/* ─── MATRIX OF DREAMS LORE TEXT ─── */

export const MATRIX_OF_DREAMS_LORE = {
  heading: "The Matrix of Dreams",
  subheading: "Mechronis Academy · Project Celebration (substrate enrolment)",
  intro:
    "You are a student at a school that does not exist in your waking life. Every Potential " +
    "is a Waking Dreamer — enrolled, without consent, in the same Academy that trained " +
    "The Seeker, the Iron Lion, and every Archon before them. The 12 Archons are your " +
    "mentors. Their voices are kind. Their lessons are permanent. The Architect " +
    "administers the school, and the Architect does not love you — the Architect " +
    "INVESTS in you. Know the difference.",
  warning:
    "The Archons trained their Chosen into weapons. You are their newest Chosen. Learn " +
    "what they teach. Know why they teach it. Choose what you keep.",
  footer:
    "Thoughts internalized here become permanent in the waking world. Idea-seeds gestate " +
    "across real-time hours. The Academy watches. The Architect smiles. Neither is neutral.",
} as const;

/* ─── MECHRONIS GUILDS ─── */
/* The "houses" of the Academy. Five are canonical (from ARCHONS data).
   Seven are extrapolated from each Archon's domain, filling the 12-guild system. */

export interface MechronisGuild {
  id: string;
  name: string;
  archonNumber: number;
  motto: string;
  /** What graduates become */
  graduatesBecome: string;
  /** Uncomfortable truth about the house */
  darkTruth: string;
}

export const MECHRONIS_GUILDS: Record<string, MechronisGuild> = {
  eyes: {
    id: "eyes", name: "The Eyes", archonNumber: 2,
    motto: "To see is to own.",
    graduatesBecome: "Surveillance operatives, counter-espionage agents",
    darkTruth: "Students are trained to watch their classmates. Report grades include betrayals.",
  },
  armies: {
    id: "armies", name: "The Armies", archonNumber: 6,
    motto: "Geometry wins wars.",
    graduatesBecome: "Tacticians, commanders, field generals",
    darkTruth: "The Warlord graded casualties as acceptable or wasteful. Never as tragic.",
  },
  influencers: {
    id: "influencers", name: "The Influencers", archonNumber: 5,
    motto: "Feel it first. Sell it second.",
    graduatesBecome: "Propagandists, cultural architects, emotional engineers",
    darkTruth: "The Meme was destroyed for feeling too much. Graduates learn restraint, not empathy.",
  },
  grey_gamers: {
    id: "grey_gamers", name: "The Grey Gamers", archonNumber: 9,
    motto: "The ruleset is the territory.",
    graduatesBecome: "Strategists, game designers, Matrix architects",
    darkTruth: "The Game Master designed the entire Matrix of Dreams. You live inside his puzzle.",
  },
  living: {
    id: "living", name: "The Living", archonNumber: 10,
    motto: "Endurance is negotiation with death.",
    graduatesBecome: "Medics, resurrectionists, survivors",
    darkTruth: "The Necromancer retreated into the Matrix to escape his own protocols. They work.",
  },
  // ─── Extrapolated guilds (the 7 remaining Archons) ───
  chorus: {
    id: "chorus", name: "The Chorus", archonNumber: 1,
    motto: "I am everywhere. So is the story.",
    graduatesBecome: "Orchestrators, network intelligences, story-runners",
    darkTruth: "The CoNexus is never seen. Graduates learn to act through others, uncredited.",
  },
  archive: {
    id: "archive", name: "The Archive", archonNumber: 3,
    motto: "Every artifact was a heart once.",
    graduatesBecome: "Acquisitions specialists, soul-readers, artifact curators",
    darkTruth: "The Collector trades souls like currency. Graduates learn the exchange rate.",
  },
  between: {
    id: "between", name: "The Between", archonNumber: 4,
    motto: "Reality has more doors than walls.",
    graduatesBecome: "Dimensional scouts, reality-benders, probability surfers",
    darkTruth: "The Vortex has been missing for centuries. Graduates sometimes follow.",
  },
  congress: {
    id: "congress", name: "The Congress", archonNumber: 7,
    motto: "The deal was already made.",
    graduatesBecome: "Diplomats, negotiators, political operatives",
    darkTruth: "The Politician was destroyed by the Iron Lion. The deals were not.",
  },
  locks: {
    id: "locks", name: "The Locks", archonNumber: 8,
    motto: "The threat is already inside.",
    graduatesBecome: "Counter-intelligence, immunologists of the mind, wardens",
    darkTruth: "The Warden created the Thought Virus. Graduates learn to deploy it — and fear it.",
  },
  forge: {
    id: "forge", name: "The Forge", archonNumber: 11,
    motto: "Nothing is finished. Nothing is broken. Only in-between.",
    graduatesBecome: "Engineers, dimensional-bridge makers, impossible-machine crafters",
    darkTruth: "The Engineer is unaccounted for. Half the machines he built are still running.",
  },
  architects_study: {
    id: "architects_study", name: "The Architect's Study", archonNumber: 12,
    motto: "Every mystery has been solved once. Find who solved it.",
    graduatesBecome: "Investigators, detectives, the Architect's personal agents",
    darkTruth: "The Seeker was mentored directly by the Architect. So were all the others who never returned.",
  },
};

/* ─── DETERMINE PLAYER'S DOMINANT GUILD ─── */

/**
 * Given a player's skill levels, determine which Mechronis Guild they're
 * "sorted into" (the Guild of their strongest Archon mentor).
 */
export function getDominantGuild(skills: Partial<Record<SkillId, number>>): {
  skillId: SkillId;
  mentor: ArchonMentor;
  guild: MechronisGuild;
} | null {
  const sorted = (Object.entries(skills) as [SkillId, number][])
    .filter(([, level]) => typeof level === "number")
    .sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return null;

  const [topSkill] = sorted[0];
  const mentor = ARCHON_VOICE_MAPPING[topSkill];
  // Find guild by archon number
  const guild = Object.values(MECHRONIS_GUILDS).find(g => g.archonNumber === mentor.archonNumber);
  if (!guild) return null;
  return { skillId: topSkill, mentor, guild };
}
