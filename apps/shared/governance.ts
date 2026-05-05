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
  /** Cadence: most votes are one-off; `annual` marks the four
   *  headline yearly votes that anchor governance-vote suits in
   *  recurringSuitArtPrompts.ts. */
  cadence?: "once" | "annual";
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

/**
 * Structured 24-hour modifier activated when a daily vote
 * closes. Mirrors the `world_modifier` arm of VoteConsequence
 * but bound to a single side ("A" or "B") of a daily binary
 * choice. The applier sets `expiresAt = now + 24h`.
 */
export interface DailyVoteModifier {
  modifierKey: string;
  modifierType: string;
  modifierValue: number;
}

export interface DailyResourceVote {
  id: string;
  date: string; // YYYY-MM-DD
  question: string;
  optionA: { label: string; effect: string; modifier: DailyVoteModifier };
  optionB: { label: string; effect: string; modifier: DailyVoteModifier };
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
    optionA: {
      label: "Defense Systems",
      effect: "+10% TD turret damage today",
      modifier: { modifierKey: "daily_td_turret", modifierType: "td_turret_damage_pct", modifierValue: 10 },
    },
    optionB: {
      label: "Research",
      effect: "+10% lore discovery rate today",
      modifier: { modifierKey: "daily_lore_discovery", modifierType: "lore_discovery_pct", modifierValue: 10 },
    },
    elaraContext: "Our Dream reserves are limited. I need your decision on allocation priority.",
  },
  {
    question: "A signal fragment was intercepted. Who should analyze it?",
    optionA: {
      label: "Elara (fast, surface-level)",
      effect: "Quick lore snippet revealed",
      modifier: { modifierKey: "daily_signal_fast", modifierType: "lore_snippet_grant", modifierValue: 1 },
    },
    optionB: {
      label: "The Antiquarian (slow, deep)",
      effect: "Delayed but richer Loredex entry",
      modifier: { modifierKey: "daily_signal_deep", modifierType: "loredex_entry_grant", modifierValue: 1 },
    },
    elaraContext: "I can process this in minutes. The Antiquarian would take hours but may find what I'd miss.",
  },
  {
    question: "Crew rotation: which department gets extra hands?",
    optionA: {
      label: "Armory",
      effect: "+5% fight XP today",
      modifier: { modifierKey: "daily_fight_xp", modifierType: "fight_xp_pct", modifierValue: 5 },
    },
    optionB: {
      label: "Engineering",
      effect: "+5% crafting success today",
      modifier: { modifierKey: "daily_crafting_success", modifierType: "crafting_success_pct", modifierValue: 5 },
    },
    elaraContext: "We're short-staffed everywhere. Where do you want the extra support?",
  },
  {
    question: "Power grid fluctuation detected. Prioritize which system?",
    optionA: {
      label: "Shields",
      effect: "Reduced TD core damage for 24h",
      modifier: { modifierKey: "daily_td_core_shield", modifierType: "td_core_damage_reduction_pct", modifierValue: 15 },
    },
    optionB: {
      label: "Scanners",
      effect: "Reveal hidden room items for 24h",
      modifier: { modifierKey: "daily_hidden_reveal", modifierType: "hidden_room_reveal_pct", modifierValue: 100 },
    },
    elaraContext: "Power grid instability. I can stabilize one system. Choose carefully.",
  },
  {
    question: "The Meme is broadcasting on two frequencies. Which do we listen to?",
    optionA: {
      label: "Frequency Alpha",
      effect: "Comedy commentary, +mood bonus",
      modifier: { modifierKey: "daily_meme_alpha", modifierType: "morale_pct", modifierValue: 5 },
    },
    optionB: {
      label: "Frequency Omega",
      effect: "Cryptic lore hint, +discovery",
      modifier: { modifierKey: "daily_meme_omega", modifierType: "lore_discovery_pct", modifierValue: 5 },
    },
    elaraContext: "The Meme is... being the Meme. Both signals seem intentional. Which one resonates?",
  },
  {
    question: "Ration distribution: feed the crew or stockpile for emergencies?",
    optionA: {
      label: "Feed the crew",
      effect: "+3% all XP today",
      modifier: { modifierKey: "daily_all_xp", modifierType: "all_xp_pct", modifierValue: 3 },
    },
    optionB: {
      label: "Stockpile",
      effect: "+50 Dream banked for weekend event",
      modifier: { modifierKey: "daily_dream_stockpile", modifierType: "dream_grant", modifierValue: 50 },
    },
    elaraContext: "Morale versus preparedness. There's never a right answer. Only a necessary one.",
  },
  {
    question: "A stowaway specimen was found in Cargo Bay. Release or study?",
    optionA: {
      label: "Release into the wild",
      effect: "Specimen encounter chance +20% today",
      modifier: { modifierKey: "daily_specimen_encounter", modifierType: "specimen_encounter_pct", modifierValue: 20 },
    },
    optionB: {
      label: "Study in Medical Bay",
      effect: "Specimen evolution XP +15% today",
      modifier: { modifierKey: "daily_specimen_xp", modifierType: "specimen_evolution_xp_pct", modifierValue: 15 },
    },
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

/* ─── ENGINEER RECORDING VOTES ─── */

/**
 * Re-export the Engineer's recording-triggered governance votes for
 * integration with the hub.  See engineerGovernanceVotes.ts for the
 * full vote definitions.
 */
export { ENGINEER_GOVERNANCE_VOTES, getAvailableEngineerVotes } from "./engineerGovernanceVotes";
export type { EngineerGovernanceVote } from "./engineerGovernanceVotes";

/* ─── ANNUAL HEADLINE VOTES ─── */

/**
 * The four yearly headline votes that anchor the annual-vote suits in
 * recurringSuitArtPrompts.ts. Every active Lions-Club-rented member can
 * wear the year's vestment — having voted in all four is a
 * recommended-but-not-required prerequisite surfaced on the
 * Governance Hub.
 *
 * These use `cadence: "annual"` so the hub can filter them into the
 * "year-long civic calendar" row. Options + consequences here are
 * season-opening scaffolds; the Antiquarian adds per-cycle detail.
 */
export const ANNUAL_HEADLINE_VOTES: readonly CommunityVote[] = [
  {
    id: "annual-state-of-the-ark",
    month: 1,
    week: 1,
    question:
      "State of the Ark: where do we point the Ark's budget this year?",
    proposedBy: "the Antiquarian",
    antiquarianIntro:
      "Every year the Ark takes stock of itself. Read the ledger. Choose the direction. I will inscribe the course you set.",
    options: [
      {
        id: "ark-food",
        label: "Food & water systems",
        description: "Invest in the Ark's sustenance infrastructure.",
        consequences: ["+10% global stamina regen for the year"],
      },
      {
        id: "ark-defense",
        label: "Defensive bulwarks",
        description: "Reinforce hull and turret coverage.",
        consequences: ["+10% global DEF for the year"],
      },
      {
        id: "ark-research",
        label: "Research labs",
        description: "Fund Antiquarian and Architect research grants.",
        consequences: ["+10% crafting XP for the year"],
      },
      {
        id: "ark-culture",
        label: "Cultural programs",
        description: "Reopen libraries, festivals, rehearsal halls.",
        consequences: ["Unlocks annual cultural quests"],
      },
    ],
    durationHours: 168,
    category: "seasonal",
    cadence: "annual",
    affectedSystems: ["economy", "dungeon", "crafting", "questing"],
    quorum: 500,
  },
  {
    id: "annual-faction-succession",
    month: 4,
    week: 2,
    question: "Faction Succession: whose banner leads the Ark this year?",
    proposedBy: "the Council of Factions",
    antiquarianIntro:
      "The banner rotates. The Council convenes. The question is older than the ship.",
    options: [
      {
        id: "succession-insurgency",
        label: "Insurgency",
        description: "Iron Lions lead the year.",
        consequences: ["Insurgency storylines highlighted"],
      },
      {
        id: "succession-antiquarians",
        label: "Antiquarians",
        description: "Scholars carry the standard.",
        consequences: ["Antiquarian storylines highlighted"],
      },
      {
        id: "succession-architects",
        label: "Architects",
        description: "The builders take the lead.",
        consequences: ["Architect storylines highlighted"],
      },
    ],
    durationHours: 168,
    category: "seasonal",
    cadence: "annual",
    affectedSystems: ["storyline", "questing", "cosmetic"],
    quorum: 500,
  },
  {
    id: "annual-apocalypse-protocol",
    month: 7,
    week: 3,
    question:
      "Apocalypse Protocol: which failsafe do we rehearse this year?",
    proposedBy: "the Architect",
    antiquarianIntro:
      "Rehearsal is not fear. Rehearsal is memory. Choose which ending we practice surviving.",
    options: [
      {
        id: "protocol-fire",
        label: "Heat-death protocol",
        description: "The fires that never go out.",
        consequences: ["Fire-themed world event unlocks"],
      },
      {
        id: "protocol-silence",
        label: "Silence protocol",
        description: "The signal that stops.",
        consequences: ["Communications-outage event unlocks"],
      },
      {
        id: "protocol-fracture",
        label: "Fracture protocol",
        description: "The Ark in pieces.",
        consequences: ["Hull-breach event unlocks"],
      },
    ],
    durationHours: 168,
    category: "seasonal",
    cadence: "annual",
    affectedSystems: ["world-event"],
    quorum: 500,
  },
  {
    id: "annual-oracles-question",
    month: 10,
    week: 4,
    question: "The Oracle's Question: what do we dare to know?",
    proposedBy: "the Oracle",
    antiquarianIntro:
      "The Oracle offers an answer this year. The price is a matching question. Pick carefully.",
    options: [
      {
        id: "oracle-past",
        label: "A truth from before the Fall",
        description: "A recovered record of what used to be.",
        consequences: ["New lore entry revealed"],
      },
      {
        id: "oracle-future",
        label: "A glimpse of the next year",
        description: "A preview of the choice to come.",
        consequences: ["Preview of next year's headline vote"],
      },
      {
        id: "oracle-self",
        label: "A truth about ourselves",
        description: "An aggregate profile of the community.",
        consequences: ["Community profile reveal"],
      },
    ],
    durationHours: 168,
    category: "seasonal",
    cadence: "annual",
    affectedSystems: ["lore", "community"],
    quorum: 500,
  },
];

export function getAnnualHeadlineVote(
  id: string,
): CommunityVote | undefined {
  return ANNUAL_HEADLINE_VOTES.find((v) => v.id === id);
}
