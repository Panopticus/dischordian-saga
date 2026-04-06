/* ═══════════════════════════════════════════════════════
   GOVERNANCE SYSTEM — Community Votes + Living Universe

   The Potentials shape reality through collective choice.
   Every decision is inscribed in the Antiquarian's Tome.

   Systems:
   - Monthly Votes: 4 per month, 3-5 options, 1-week window
   - Daily Resource Allocation: quick binary choices
   - Antiquarian's Tome: narrated history of all decisions
   - Participation Tracking: engagement metrics
   - AI Voters: simulated activity (never changes outcomes)
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export interface VoteOption {
  id: string;
  label: string;
  description: string;
  /** What happens if this wins */
  consequences: string[];
  /** Icon hint for UI */
  icon?: string;
}

export interface CommunityVote {
  id: string;
  /** Which month/week this belongs to */
  month: number;
  week: number;
  /** The question posed to the community */
  question: string;
  /** Lore framing — who is asking? */
  proposedBy: string;
  /** How the Antiquarian introduces this choice */
  antiquarianIntro: string;
  options: VoteOption[];
  /** Duration in hours */
  durationHours: number;
  /** Vote category */
  category: "monthly" | "daily" | "seasonal" | "crisis";
  /** Which game systems are affected */
  affectedSystems: string[];
  /** Minimum participation threshold (votes) for result to count */
  quorum: number;
}

export interface VoteResult {
  voteId: string;
  winningOptionId: string;
  /** Total real votes cast */
  totalVotes: number;
  /** Breakdown per option */
  breakdown: Record<string, number>;
  /** When voting ended */
  closedAt: number;
  /** The Antiquarian's inscription about this outcome */
  antiquarianInscription: string;
  /** What was actually changed in the game */
  appliedConsequences: string[];
}

export interface DailyResourceVote {
  id: string;
  date: string; // YYYY-MM-DD
  question: string;
  optionA: { label: string; effect: string };
  optionB: { label: string; effect: string };
  /** Elara frames these as ship management decisions */
  elaraContext: string;
}

export interface AntiquarianTomeEntry {
  id: string;
  week: number;
  /** The event or vote this entry refers to */
  referenceId: string;
  referenceType: "vote" | "event" | "milestone" | "discovery";
  /** The Antiquarian's narration */
  body: string;
  /** His private annotation (visible after trust 60+) */
  annotation?: string;
  /** Timestamp */
  inscribedAt: number;
}

export interface ParticipationStats {
  totalKills: number;
  totalMissions: number;
  totalTrades: number;
  totalVotesCast: number;
  totalDiscoveries: number;
  totalTransmissionsWatched: number;
  totalApprenticesGraduated: number;
  totalBetrayalsSurvived: number;
  totalArenaWins: number;
  totalTdWavesCleared: number;
  /** Per-vote participation rate */
  voteParticipation: Record<string, number>;
}

/* ─── AI VOTER SIMULATION ─── */

/**
 * Generate simulated vote activity. These votes:
 * - NEVER change the outcome (they mirror the real distribution)
 * - Add ambient activity to make the hub feel alive
 * - Use lore-appropriate names (Potential designations)
 */
export function generateSimulatedVotes(
  realBreakdown: Record<string, number>,
  simulatedCount: number,
): Record<string, number> {
  const totalReal = Object.values(realBreakdown).reduce((a, b) => a + b, 0);
  if (totalReal === 0) {
    // If no real votes yet, distribute evenly
    const optionIds = Object.keys(realBreakdown);
    const perOption = Math.floor(simulatedCount / optionIds.length);
    const sim: Record<string, number> = {};
    optionIds.forEach(id => { sim[id] = perOption; });
    return sim;
  }

  // Mirror real distribution proportionally
  const sim: Record<string, number> = {};
  for (const [optionId, count] of Object.entries(realBreakdown)) {
    const ratio = count / totalReal;
    sim[optionId] = Math.round(ratio * simulatedCount);
  }
  return sim;
}

/** Generate a lore-appropriate voter name for display */
export function generateVoterName(): string {
  const prefixes = ["Potential", "Operative", "Citizen", "Sentinel", "Seeker"];
  const numbers = Math.floor(Math.random() * 9000) + 1000;
  const arks = ["1047", "2049", "0331", "0777", "1138"];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}-${numbers}-ARK${arks[Math.floor(Math.random() * arks.length)]}`;
}

/* ─── DAILY RESOURCE VOTE TEMPLATES ─── */

export const DAILY_VOTE_TEMPLATES: Omit<DailyResourceVote, "id" | "date">[] = [
  {
    question: "How should the Ark allocate today's Dream reserves?",
    optionA: { label: "Defense Systems", effect: "+10% TD turret damage today" },
    optionB: { label: "Research", effect: "+10% lore discovery rate today" },
    elaraContext: "Our Dream reserves are limited. I need your decision on allocation priority.",
  },
  {
    question: "A signal fragment was intercepted. Who should analyze it?",
    optionA: { label: "Elara (fast, surface-level)", effect: "Quick lore snippet revealed" },
    optionB: { label: "The Antiquarian (slow, deep)", effect: "Delayed but richer Loredex entry" },
    elaraContext: "I can process this in minutes. The Antiquarian would take hours but may find what I'd miss.",
  },
  {
    question: "Crew rotation: which department gets extra hands?",
    optionA: { label: "Armory", effect: "+5% fight XP today" },
    optionB: { label: "Engineering", effect: "+5% crafting success today" },
    elaraContext: "We're short-staffed everywhere. Where do you want the extra support?",
  },
  {
    question: "Power grid fluctuation detected. Prioritize which system?",
    optionA: { label: "Shields", effect: "Reduced TD core damage for 24h" },
    optionB: { label: "Scanners", effect: "Reveal hidden room items for 24h" },
    elaraContext: "Power grid instability. I can stabilize one system. Choose carefully.",
  },
  {
    question: "The Meme is broadcasting on two frequencies. Which do we listen to?",
    optionA: { label: "Frequency Alpha", effect: "Comedy commentary, +mood bonus" },
    optionB: { label: "Frequency Omega", effect: "Cryptic lore hint, +discovery" },
    elaraContext: "The Meme is... being the Meme. Both signals seem intentional. Which one resonates?",
  },
  {
    question: "Ration distribution: feed the crew or stockpile for emergencies?",
    optionA: { label: "Feed the crew", effect: "+3% all XP today" },
    optionB: { label: "Stockpile", effect: "+50 Dream banked for weekend event" },
    elaraContext: "Morale versus preparedness. There's never a right answer. Only a necessary one.",
  },
  {
    question: "A stowaway specimen was found in Cargo Bay. Release or study?",
    optionA: { label: "Release into the wild", effect: "Specimen encounter chance +20% today" },
    optionB: { label: "Study in Medical Bay", effect: "Specimen evolution XP +15% today" },
    elaraContext: "It's scared. It's also potentially valuable. Your call, Operative.",
  },
];

/** Get today's daily vote (deterministic based on date) */
export function getDailyVote(dateStr: string): DailyResourceVote {
  const dayIndex = dateStr.split("-").reduce((a, b) => a + parseInt(b), 0);
  const template = DAILY_VOTE_TEMPLATES[dayIndex % DAILY_VOTE_TEMPLATES.length];
  return {
    ...template,
    id: `daily-${dateStr}`,
    date: dateStr,
  };
}

/* ─── ANTIQUARIAN TOME GENERATION ─── */

/**
 * Generate the Antiquarian's inscription for a vote outcome.
 * He writes in his characteristic voice — poetic, personally invested,
 * sometimes disagreeing with the choice made.
 */
export function generateAntiquarianInscription(
  vote: CommunityVote,
  winningOption: VoteOption,
  totalVotes: number,
): string {
  const participation = totalVotes > 100 ? "decisively" : totalVotes > 50 ? "with conviction" : "in small numbers";

  return `The Potentials spoke ${participation} on the matter of "${vote.question}" — ` +
    `and chose: "${winningOption.label}." ` +
    `${totalVotes} voices. One outcome. ` +
    `I have watched this choice ripple forward through seventeen possible timelines. ` +
    `In twelve of them, they will not regret it. In the other five... ` +
    `we shall see. I inscribe this without judgment. The Dreamer watches. The Architect calculates. ` +
    `I merely write.`;
}
