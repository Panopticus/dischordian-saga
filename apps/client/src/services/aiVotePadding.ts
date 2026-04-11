/* ═══════════════════════════════════════════════════════
   AI VOTE PADDING SERVICE

   Makes the Governance Hub feel ALIVE — even with 10
   players or 10,000. AI-simulated voters create ambient
   participation without ever changing real outcomes.

   RULES:
   1. AI votes cast at random intervals (30-120s)
   2. AI votes mirror real player distribution (60/40 lean)
   3. AI votes NEVER exceed 40% of total displayed votes
   4. Names are lore-appropriate Potential designations
   5. Even distribution (±5%) when no real votes exist
   6. Tagged { isAI: true } — excluded from analytics
   7. Post-close results show ONLY real player percentages
   8. Visual "vote cast" flickers use AI names when quiet
   ═══════════════════════════════════════════════════════ */

import { generateVoterName } from "@shared/governance";

/* ─── TYPES ─── */

export interface SimulatedVoter {
  name: string;
  optionId: string;
  timestamp: number;
  isAI: true;
}

export interface PaddingConfig {
  /** Min seconds between AI votes */
  minIntervalSec: number;
  /** Max seconds between AI votes */
  maxIntervalSec: number;
  /** Max ratio of AI votes to total displayed (0-1) */
  maxAIRatio: number;
  /** How strongly AI mirrors real distribution (0=even, 1=exact mirror) */
  mirrorStrength: number;
  /** Randomness applied to even distribution (±percent) */
  evenJitter: number;
}

const DEFAULT_CONFIG: PaddingConfig = {
  minIntervalSec: 30,
  maxIntervalSec: 120,
  maxAIRatio: 0.4,
  mirrorStrength: 0.6,
  evenJitter: 0.05,
};

/* ─── LORE-APPROPRIATE NAME GENERATION ─── */

const AI_NAME_PREFIXES = [
  "Potential",
  "Operative",
  "Citizen",
  "Sentinel",
  "Seeker",
  "Signal_Zero",
  "Cryo_Delta",
  "Echo_Prime",
  "Dreamer",
  "Watcher",
];

const AI_NAME_SUFFIXES = [
  "ARK1047",
  "ARK2049",
  "ARK0331",
  "ARK0777",
  "ARK1138",
  "CRYO",
  "ECHO",
  "PRIME",
];

/** Generate a richer lore-appropriate voter name for display notifications */
export function generateAIVoterName(): string {
  const style = Math.random();
  if (style < 0.4) {
    // Potential_Ark1047_0892 format
    return generateVoterName();
  } else if (style < 0.7) {
    // Operative_Cryo_Delta format
    const prefix = AI_NAME_PREFIXES[Math.floor(Math.random() * AI_NAME_PREFIXES.length)];
    const suffix = AI_NAME_SUFFIXES[Math.floor(Math.random() * AI_NAME_SUFFIXES.length)];
    const num = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}_${suffix}_${num}`;
  } else {
    // Signal_Zero_Echo format
    const num = Math.floor(Math.random() * 90000) + 10000;
    return `Potential ${num.toLocaleString()}`;
  }
}

/* ─── WEIGHTED OPTION SELECTION ─── */

/**
 * Pick which option an AI voter should vote for, respecting
 * the real distribution while adding slight randomness.
 */
export function pickAIVoteOption(
  optionIds: string[],
  realBreakdown: Record<string, number>,
  config: PaddingConfig = DEFAULT_CONFIG,
): string {
  const totalReal = Object.values(realBreakdown).reduce((a, b) => a + b, 0);

  if (totalReal === 0) {
    // No real votes yet — distribute evenly with jitter
    const weights = optionIds.map(() => {
      const base = 1 / optionIds.length;
      const jitter = (Math.random() * 2 - 1) * config.evenJitter;
      return Math.max(0.01, base + jitter);
    });
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * totalWeight;
    for (let i = 0; i < optionIds.length; i++) {
      r -= weights[i];
      if (r <= 0) return optionIds[i];
    }
    return optionIds[optionIds.length - 1];
  }

  // Mirror real distribution with configurable strength
  const evenWeight = 1 / optionIds.length;
  const weights = optionIds.map((id) => {
    const realRatio = (realBreakdown[id] || 0) / totalReal;
    // Blend between even and real distribution
    return evenWeight * (1 - config.mirrorStrength) + realRatio * config.mirrorStrength;
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < optionIds.length; i++) {
    r -= weights[i];
    if (r <= 0) return optionIds[i];
  }
  return optionIds[optionIds.length - 1];
}

/* ─── PADDING ENGINE ─── */

/**
 * Calculate the display tally that includes AI padding.
 * Returns a new tally object with AI votes added, respecting the 40% cap.
 */
export function calculatePaddedTally(
  realTally: Record<string, number>,
  targetTotalDisplayed: number,
  config: PaddingConfig = DEFAULT_CONFIG,
): { displayTally: Record<string, number>; aiVoteCount: number } {
  const totalReal = Object.values(realTally).reduce((a, b) => a + b, 0);
  const optionIds = Object.keys(realTally);

  if (optionIds.length === 0) {
    return { displayTally: {}, aiVoteCount: 0 };
  }

  // How many AI votes to add (capped at 40% of target)
  const maxAIVotes = Math.floor(targetTotalDisplayed * config.maxAIRatio);
  const desiredAI = Math.max(0, targetTotalDisplayed - totalReal);
  const aiVoteCount = Math.min(desiredAI, maxAIVotes);

  if (aiVoteCount === 0) {
    return { displayTally: { ...realTally }, aiVoteCount: 0 };
  }

  // Distribute AI votes
  const displayTally: Record<string, number> = { ...realTally };

  if (totalReal === 0) {
    // Even distribution with jitter
    const perOption = Math.floor(aiVoteCount / optionIds.length);
    let remaining = aiVoteCount - perOption * optionIds.length;
    for (const id of optionIds) {
      displayTally[id] = (displayTally[id] || 0) + perOption;
      if (remaining > 0) {
        displayTally[id]++;
        remaining--;
      }
    }
  } else {
    // Mirror real distribution
    let assigned = 0;
    for (const id of optionIds) {
      const realRatio = (realTally[id] || 0) / totalReal;
      const aiForOption = Math.round(realRatio * aiVoteCount);
      displayTally[id] = (displayTally[id] || 0) + aiForOption;
      assigned += aiForOption;
    }
    // Assign rounding remainder to leading option
    if (assigned < aiVoteCount) {
      const leadingOption = optionIds.reduce((a, b) =>
        (realTally[a] || 0) >= (realTally[b] || 0) ? a : b,
      );
      displayTally[leadingOption] += aiVoteCount - assigned;
    }
  }

  return { displayTally, aiVoteCount };
}

/* ─── LIVE FEED SIMULATION ─── */

export interface VoteFeedItem {
  id: string;
  voterName: string;
  optionId: string;
  optionLabel: string;
  isAI: boolean;
  timestamp: number;
}

/**
 * Generate a single simulated voter feed notification.
 * Used by the live activity ticker at the bottom of the Governance Hub.
 */
export function generateFeedItem(
  optionIds: string[],
  optionLabels: Record<string, string>,
  realBreakdown: Record<string, number>,
  config: PaddingConfig = DEFAULT_CONFIG,
): VoteFeedItem {
  const optionId = pickAIVoteOption(optionIds, realBreakdown, config);
  return {
    id: `ai-vote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    voterName: generateAIVoterName(),
    optionId,
    optionLabel: optionLabels[optionId] || optionId,
    isAI: true,
    timestamp: Date.now(),
  };
}

/**
 * Calculate the next AI vote interval in milliseconds.
 */
export function nextAIVoteInterval(
  config: PaddingConfig = DEFAULT_CONFIG,
): number {
  const range = config.maxIntervalSec - config.minIntervalSec;
  return (config.minIntervalSec + Math.random() * range) * 1000;
}

/* ─── RESULT SANITIZATION ─── */

/**
 * Strip AI votes from the final results display.
 * Called when a vote closes — the "How the Community Voted" panel
 * shows ONLY real player percentages.
 */
export function sanitizeResultsForDisplay(
  realTally: Record<string, number>,
): { percentages: Record<string, number>; totalReal: number } {
  const totalReal = Object.values(realTally).reduce((a, b) => a + b, 0);
  const percentages: Record<string, number> = {};

  for (const [id, count] of Object.entries(realTally)) {
    percentages[id] = totalReal > 0 ? Math.round((count / totalReal) * 100) : 0;
  }

  return { percentages, totalReal };
}

export { DEFAULT_CONFIG as AI_PADDING_CONFIG };
