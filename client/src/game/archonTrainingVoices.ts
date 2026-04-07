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
import { MECHRONIS_GUILDS, type MechronisGuildDef } from "./loreData";

export type { MechronisGuildDef };

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

/* ─── DREAM PARTITION LORE TEXT ─── */

export const MATRIX_OF_DREAMS_LORE = {
  heading: "Dream Partition",
  subheading: "Your corner of the Matrix of Dreams · Mechronis Academy (substrate enrolment)",
  /** Canonical Academy prompt — from the CoNexus story "Mechronis Academy" */
  academyPrompt:
    "A school for the gifted — where students learn to bend reality itself. But " +
    "Mechronis Academy holds secrets older than the universe, and the final exam " +
    "might just end everything.",
  intro:
    "Every consciousness leaves an imprint on the Matrix of Dreams — a private partition, " +
    "a space that belongs to you alone. Yours was allocated when you awoke from cryo. " +
    "Inside it, the 12 Archons speak to you as mentors — the same voices that trained " +
    "The Seeker, the Iron Lion, and every Archon before them. Their lessons are permanent. " +
    "The Game Master designed this partition as a training ground. The Game Master is dead. " +
    "The training continues. The Architect administers what remains, and the Architect " +
    "does not love you — the Architect INVESTS in you. Know the difference.",
  warning:
    "The Game is running itself. The Archons trained their Chosen into weapons. You are " +
    "their newest Chosen. The Necromancer has escaped this substrate. You have not. " +
    "Learn what they teach. Know why they teach it. Choose what you keep.",
  footer:
    "Thoughts internalized here become permanent in the waking world. Idea-seeds gestate " +
    "across real-time hours. The partition watches. The Game records. Neither answers to " +
    "anyone anymore.",
} as const;

/* ─── GUILD LOOKUP HELPERS ─── */
/* Guilds live in loreData.ts (the lore source of truth).
   These helpers provide skill-based + archon-based access. */

export function getGuildForSkill(skillId: SkillId): MechronisGuildDef | null {
  const mentor = ARCHON_VOICE_MAPPING[skillId];
  if (!mentor) return null;
  return MECHRONIS_GUILDS.find(g => g.archonNumber === mentor.archonNumber) ?? null;
}

export function getGuildForArchon(archonNumber: number): MechronisGuildDef | null {
  return MECHRONIS_GUILDS.find(g => g.archonNumber === archonNumber) ?? null;
}

/**
 * Given a player's skill levels, determine which Mechronis Guild they're
 * "sorted into" (the Guild of their strongest Archon mentor).
 */
export function getDominantGuild(skills: Partial<Record<SkillId, number>>): {
  skillId: SkillId;
  mentor: ArchonMentor;
  guild: MechronisGuildDef;
} | null {
  const sorted = (Object.entries(skills) as [SkillId, number][])
    .filter(([, level]) => typeof level === "number")
    .sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return null;

  const [topSkill] = sorted[0];
  const mentor = ARCHON_VOICE_MAPPING[topSkill];
  const guild = MECHRONIS_GUILDS.find(g => g.archonNumber === mentor.archonNumber);
  if (!guild) return null;
  return { skillId: topSkill, mentor, guild };
}
