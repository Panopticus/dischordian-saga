/* ═══════════════════════════════════════════════════════
   CELEBRATION TRIAL — Daily Decision System

   The 4-week (28-day) trial your Apprentice faces at
   Celebration. Each day brings a Mascoteer's game — a choice
   card with 2-3 options. Outcomes shift bond, corruption,
   survival probability, and player morality.

   Design goals:
     • One decision per day (low-friction, 1-tap play)
     • Missed days increase death probability on next day
     • Decisions reveal the Mascoteer's hidden truth gradually
     • Each Mascoteer appears multiple times across the trial
     • Graduation at Day 28 → Apprentice joins the ship

   "Welcome to Celebration, where dreams don't always shine,
    Step lightly, wander carefully, and watch for every sign."
   ═══════════════════════════════════════════════════════ */

export const TRIAL_LENGTH_DAYS = 28;

/** How many days missed before death becomes likely */
export const DEATH_GRACE_DAYS = 2;

/** Base daily death probability (applied after grace period) */
export const DEATH_PROBABILITY_BASE = 0.15;

/** Multiplier per day past grace */
export const DEATH_PROBABILITY_PER_MISSED_DAY = 0.25;

export interface DecisionOption {
  id: string;
  /** Short label for button */
  label: string;
  /** Longer description of the choice */
  description: string;
  /** What happens if chosen */
  outcome: TrialOutcome;
}

export interface TrialOutcome {
  bondDelta: number;
  corruptionDelta: number;
  moralityDelta: number;
  /** Chance of immediate death (0-1) */
  deathChance?: number;
  /** Flavor text shown after choice */
  resultFlavor: string;
}

export interface DailyDecision {
  id: string;
  day: number;
  mascoteerId: string;
  /** The scenario presented */
  prompt: string;
  options: DecisionOption[];
}

/* ─── DECISION CARD TEMPLATES (by Mascoteer) ─── */

export const MASCOTEER_DECISIONS: Record<string, DailyDecision[]> = {
  the_conductor: [
    {
      id: "conductor_1", day: 0, mascoteerId: "the_conductor",
      prompt: "Conni the Conductor hands you a baton. 'The choir is waiting. Lead them.' Forty Apprentices stand in silence, watching you.",
      options: [
        { id: "follow_tradition", label: "Follow the old song", description: "Conduct the hymn Conni hums under her breath.",
          outcome: { bondDelta: 3, corruptionDelta: 1, moralityDelta: -2, resultFlavor: "They sang. Conni smiled. You felt watched." } },
        { id: "write_new", label: "Write something new", description: "Improvise a melody no one taught you.",
          outcome: { bondDelta: 5, corruptionDelta: -2, moralityDelta: 3, resultFlavor: "The choir falters, then finds the new song. Conni's smile thins." } },
        { id: "refuse", label: "Refuse to conduct", description: "Set the baton down and walk away.",
          outcome: { bondDelta: -4, corruptionDelta: 0, moralityDelta: 1, deathChance: 0.05, resultFlavor: "The silence stretched. The Mascoteers took notes." } },
      ],
    },
  ],
  mr_unblink: [
    {
      id: "unblink_1", day: 0, mascoteerId: "mr_unblink",
      prompt: "Mr. Unblink's white mask tilts. 'I see everything. Today, tell me what YOU see.' He gestures at another Apprentice.",
      options: [
        { id: "report_true", label: "Report what you see", description: "Describe the other Apprentice's weakness honestly.",
          outcome: { bondDelta: 2, corruptionDelta: 4, moralityDelta: -5, resultFlavor: "Mr. Unblink nods. The other Apprentice looks at you later." } },
        { id: "lie", label: "Lie to protect them", description: "Give a false or flattering description.",
          outcome: { bondDelta: 4, corruptionDelta: -1, moralityDelta: 4, deathChance: 0.08, resultFlavor: "His mask doesn't move. But the day feels longer after." } },
        { id: "ask_him", label: "Ask what HE sees", description: "Turn the question back on him.",
          outcome: { bondDelta: 6, corruptionDelta: 0, moralityDelta: 2, deathChance: 0.1, resultFlavor: "He laughs. Only his mouth. 'Bold. We remember bold.'" } },
      ],
    },
  ],
  little_corey: [
    {
      id: "corey_1", day: 0, mascoteerId: "little_corey",
      prompt: "Little Corey opens his jar of 'favorite things.' 'Trade me a memory,' he says. 'Any memory. I'll give you something shiny.'",
      options: [
        { id: "trade_small", label: "Trade a small memory", description: "Offer something trivial — a childhood smell, a forgotten song.",
          outcome: { bondDelta: 2, corruptionDelta: 2, moralityDelta: -1, resultFlavor: "The smell is gone. The shiny thing is a marble. You don't know why you wanted it." } },
        { id: "trade_big", label: "Trade a precious memory", description: "Give him the one you'd never trade. See what he gives back.",
          outcome: { bondDelta: 5, corruptionDelta: 6, moralityDelta: -4, resultFlavor: "Corey's mask doesn't match his voice. You have a new favorite color. You can't remember the old one." } },
        { id: "refuse_trade", label: "Refuse the trade", description: "Walk away without bargaining.",
          outcome: { bondDelta: -2, corruptionDelta: -2, moralityDelta: 3, deathChance: 0.06, resultFlavor: "Corey frowns. 'Everyone trades eventually.' The jar waits for tomorrow." } },
      ],
    },
  ],
  wanda_wee: [
    {
      id: "wanda_1", day: 0, mascoteerId: "wanda_wee",
      prompt: "Wanda Wee in her oversized boots divides the Apprentices into two teams. 'Pick one,' she says. 'The losers don't graduate.'",
      options: [
        { id: "join_strong", label: "Join the strong team", description: "The team that's obviously going to win.",
          outcome: { bondDelta: 1, corruptionDelta: 3, moralityDelta: -3, resultFlavor: "You won. The losers were removed. Wanda saluted you." } },
        { id: "join_weak", label: "Join the weak team", description: "The underdogs who need another body.",
          outcome: { bondDelta: 6, corruptionDelta: -3, moralityDelta: 5, deathChance: 0.12, resultFlavor: "You lost. You're still here — barely. Wanda respects the choice. She didn't promise you'd graduate." } },
        { id: "refuse_team", label: "Refuse to pick", description: "Walk the line between both teams.",
          outcome: { bondDelta: 3, corruptionDelta: 1, moralityDelta: 2, deathChance: 0.18, resultFlavor: "Wanda watched. The teams kept playing. You're not sure which side you're on now." } },
      ],
    },
  ],
  gary: [
    {
      id: "gary_1", day: 0, mascoteerId: "gary",
      prompt: "Gary the Ninth sets a puzzle-box in front of you. 'Solve it in ten moves,' he says. You see the pieces shifting even as you reach for them.",
      options: [
        { id: "play_by_rules", label: "Play by his rules", description: "Try to solve it as he described.",
          outcome: { bondDelta: 2, corruptionDelta: 2, moralityDelta: 0, deathChance: 0.15, resultFlavor: "You failed. You always fail his puzzles on his terms. Gary clapped politely." } },
        { id: "break_box", label: "Break the box", description: "Refuse the puzzle. Smash the structure.",
          outcome: { bondDelta: 5, corruptionDelta: 4, moralityDelta: 2, deathChance: 0.20, resultFlavor: "The pieces scattered. Gary's smile widened. 'Now you're playing.'" } },
        { id: "rewrite_rules", label: "Rewrite the rules", description: "Declare a new rule before he can stop you.",
          outcome: { bondDelta: 7, corruptionDelta: 5, moralityDelta: 3, deathChance: 0.08, resultFlavor: "Gary paused. For the first time, his goggles glinted. 'Oh. Oh, you listen.'" } },
      ],
    },
  ],
};

/* ─── DAILY DECISION GENERATOR ─── */

const MASCOTEER_POOL = Object.keys(MASCOTEER_DECISIONS);

export function generateDailyDecision(day: number, playerSeed?: number): DailyDecision {
  // Seeded random so same day always gets same decision for same player
  const seed = (playerSeed ?? 0) + day * 9973;
  const mascoteerId = MASCOTEER_POOL[seed % MASCOTEER_POOL.length];
  const decisions = MASCOTEER_DECISIONS[mascoteerId];
  const base = decisions[seed % decisions.length];
  return {
    ...base,
    id: `${mascoteerId}_day${day}`,
    day,
  };
}

/* ─── DEATH PROBABILITY ─── */

export function computeDeathProbability(missedDays: number, currentDayChance: number = 0): number {
  const missedBonus = Math.max(0, missedDays - DEATH_GRACE_DAYS) * DEATH_PROBABILITY_PER_MISSED_DAY;
  const baseChance = missedDays > DEATH_GRACE_DAYS ? DEATH_PROBABILITY_BASE : 0;
  return Math.min(1, baseChance + missedBonus + currentDayChance);
}

export function rollForDeath(missedDays: number, choiceDeathChance: number = 0): boolean {
  const p = computeDeathProbability(missedDays, choiceDeathChance);
  return Math.random() < p;
}
