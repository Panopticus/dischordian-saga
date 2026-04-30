/* ═══════════════════════════════════════════════════════
   THE GAME MASTERS — TRIAL INTERVENTION

   Per the Game Master bible (apps/shared/npcs/bibles/
   the_game_master.md): the Original is canonically
   destroyed. What persists is **the Game Masters cult** —
   the followers maintaining the Matrix of Dreams — and
   the cult speaks through two split-personality
   splinters wearing the lenses from the Original's split
   goggles: the **Left Game Master** (cold, analytical,
   arithmetic-driven, no exclamation marks, ever) and the
   **Right Game Master** (theatrical, ALL CAPS for
   aesthetic verbs, "darling," commands as invitations).

   The Celebration system (apps/shared/celebrationTrial.ts)
   is a 28-day apprentice trial: bond, corruption, and
   missed-day counters compound until the trial resolves.
   The current code raises the death probability sharply
   with each missed day and offers no recourse.

   This module ships a recourse path the Celebration
   needed: at canonical sanctuary days (7, 14, 21, 28) —
   the quarter-marks of the trial — the player can
   surrender one bond point to the Matrix of Dreams in
   exchange for an intervention. The cult does not give
   the intervention directly. They speak through the Left
   on days 7 and 21, the Right on day 14, and on day 28
   both speak (with the cult's redacted signature
   surfacing through the strikethrough mechanic).

   Mechanically, an intervention:

     • costs the player 1 bond (the cult bills in
       intimacy, not currency)
     • forgives 1 missed day from the apprentice's record
     • grants a Matrix Boon — a small persistent buff
     • is one-shot per (apprentice, sanctuary day) so it
       can't be ground

   The four boons are themed to the four voices: Left
   gives arithmetic-precise corrections (corruption shield,
   alignment-light shift), Right gives mood-bound
   theatrical pleasures (bond shield, combat buff), and
   the cult's day-28 closing carries the load-bearing
   redaction-as-signature.

   Pure module. No React, no server.
   ═══════════════════════════════════════════════════════ */

/* ─── INTERVENTION DAYS ─── */

/**
 * The four canonical intervention days. Aligned to quarter-marks of
 * the 28-day trial.
 */
export const INTERVENTION_DAYS = [7, 14, 21, 28] as const;
export type InterventionDay = (typeof INTERVENTION_DAYS)[number];

/** Bond cost the cult charges. The Matrix bills in intimacy. */
export const INTERVENTION_BOND_COST = 1;

/** How many missed days the cult forgives — capped at 1 per day. */
export const INTERVENTION_MISSED_DAY_FORGIVENESS = 1;

/* ─── SPEAKER (which voice carries the intervention) ─── */

/**
 * Which Game Master voice carries the intervention.
 *   - "left" — cold, analytical, arithmetic; days 7 and 21
 *   - "right" — theatrical, ALL CAPS aesthetic verbs; day 14
 *   - "cult" — both at once with strikethrough redaction; day 28
 *
 * Writers must specify which voice authors the line; lines
 * authored for the wrong voice are out of canon.
 */
export type GameMasterSpeaker = "left" | "right" | "cult";

const SPEAKER_BY_DAY: Record<InterventionDay, GameMasterSpeaker> = {
  7:  "left",
  14: "right",
  21: "left",
  28: "cult",
};

export function speakerForDay(day: InterventionDay): GameMasterSpeaker {
  return SPEAKER_BY_DAY[day];
}

/* ─── BOONS ─── */

/**
 * Mechanical effect of an intervention. Each carries a small persistent
 * modifier the apprentice keeps for the rest of the trial. Stacking
 * across all four days is intentional — the apprentice who survives
 * the Matrix's notice four times is the apprentice the player has
 * already won the trial with.
 */
export interface MatrixBoon {
  /** Bond-loss resistance, in percentage points. */
  bondShieldPct?: number;
  /** Corruption resistance, in percentage points. */
  corruptionShieldPct?: number;
  /** Final-trial alignment shift, in points (positive favors light). */
  alignmentLightShift?: number;
  /** End-of-trial combat buff bonus, in flat points. */
  combatBuffBonus?: number;
}

export interface Intervention {
  day: InterventionDay;
  /** Stable id; format: "game_masters.intervention.<day>". */
  id: string;
  /** Display name shown in the apprentice's panel. */
  name: string;
  /** Which split is speaking. */
  speaker: GameMasterSpeaker;
  /** What the intervention grants. */
  grant: MatrixBoon;
  /** The line spoken at the moment of intervention.
   *  Day 28 lines deliberately preserve the cult's strikethrough
   *  mechanic via Unicode combining-strikethrough characters; the
   *  fallback `lineFallback` carries the same text without
   *  formatting for terminal/log surfaces. */
  line: string;
  /** Plain-text fallback used by surfaces that cannot render
   *  combining strikethroughs. */
  lineFallback?: string;
}

const INTERVENTIONS: Readonly<Record<InterventionDay, Intervention>> = {
  7: {
    day: 7,
    id: "game_masters.intervention.7",
    name: "Arithmetic Pardon",
    speaker: "left",
    grant: { corruptionShieldPct: 8 },
    // Left voice: cold, analytical, future-tense, no exclamation marks
    line:
      "The arithmetic was the wrong question. I am correcting it on your behalf. " +
      "You will see the correction on the ledger in seven days. The corruption you accrued in " +
      "the asking is the cost of being told.",
  },
  14: {
    day: 14,
    id: "game_masters.intervention.14",
    name: "The Drawer Where I Keep The Good Ones",
    speaker: "right",
    grant: { bondShieldPct: 10 },
    // Right voice: theatrical, ALL CAPS aesthetic verbs, "darling," commands as invitations
    line:
      "Sit. Sit, darling. That was a READ — that was a WHOLE BOOK on what your apprentice will be. " +
      "I am keeping it in the drawer. Their bond holds because I am HOLDING it. Stay.",
  },
  21: {
    day: 21,
    id: "game_masters.intervention.21",
    name: "Register Adjustment",
    speaker: "left",
    grant: { alignmentLightShift: 6, corruptionShieldPct: 4 },
    // Left again: arithmetic, register, future-tense
    line:
      "The register has shifted. Your apprentice is no longer being read against the curve they " +
      "started against. I am informing you because the curve is mine and I am being fair. " +
      "I will not tell you often.",
  },
  28: {
    day: 28,
    id: "game_masters.intervention.28",
    name: "M̶a̶i̶n̶t̶e̶n̶a̶n̶c̶e̶ Rite",
    speaker: "cult",
    grant: { combatBuffBonus: 12, alignmentLightShift: 4 },
    // Cult voice: redaction-as-signature; both Left and Right surfacing in
    // the same moment; the strikethrough is canonical (per bible §1.5)
    line:
      "[LEFT]: The trial is finished. The arithmetic was correct in the end.\n" +
      "[RIGHT]: They WALKED. Darling, they WALKED. I am genuinely delighted.\n" +
      "[CULT]: They were always going to. The ~~Matrix~~ of Dreams ~~maintained~~ them. " +
      "We are the Game ~~Masters~~. Plural.",
    lineFallback:
      "[LEFT]: The trial is finished. The arithmetic was correct in the end.\n" +
      "[RIGHT]: They WALKED. Darling, they WALKED. I am genuinely delighted.\n" +
      "[CULT]: They were always going to. The Matrix of Dreams maintained them. " +
      "We are the Game Masters. Plural.",
  },
} as const;

export function getIntervention(day: InterventionDay): Intervention {
  return INTERVENTIONS[day];
}

export function allInterventions(): ReadonlyArray<Intervention> {
  return INTERVENTION_DAYS.map(d => INTERVENTIONS[d]);
}

/* ─── ELIGIBILITY ─── */

export interface InterventionEligibilityInput {
  /** The current trial day. */
  trialDay: number;
  /** Current bond (0..100). */
  bond: number;
  /** Number of missed days currently on the apprentice's record. */
  missedDays: number;
  /** Days the player has already redeemed for this apprentice. */
  redeemedDays: ReadonlyArray<number>;
}

export type InterventionEligibility =
  | { eligible: true; day: InterventionDay; intervention: Intervention }
  | { eligible: false; reason:
      | "not_an_intervention_day"
      | "already_redeemed"
      | "insufficient_bond"
      | "no_missed_days_to_forgive"
    };

export function checkInterventionEligibility(
  input: InterventionEligibilityInput,
): InterventionEligibility {
  if (!isInterventionDay(input.trialDay)) {
    return { eligible: false, reason: "not_an_intervention_day" };
  }
  const day = input.trialDay as InterventionDay;
  if (input.redeemedDays.includes(day)) {
    return { eligible: false, reason: "already_redeemed" };
  }
  if (input.bond < INTERVENTION_BOND_COST) {
    return { eligible: false, reason: "insufficient_bond" };
  }
  if (input.missedDays < 1) {
    return { eligible: false, reason: "no_missed_days_to_forgive" };
  }
  return { eligible: true, day, intervention: INTERVENTIONS[day] };
}

export function isInterventionDay(day: number): day is InterventionDay {
  return (INTERVENTION_DAYS as ReadonlyArray<number>).includes(day);
}

/* ─── INVOCATION ─── */

export interface InterventionResult {
  /** The intervention applied (returned for UI rendering). */
  intervention: Intervention;
  /** New bond after the cult's bill. */
  bondAfter: number;
  /** New missed-day count after forgiveness. */
  missedDaysAfter: number;
  /** Updated redemption ledger — caller persists. */
  redeemedDaysAfter: number[];
  /** The line spoken at this moment, with formatting if available. */
  line: string;
}

export function invokeIntervention(
  input: InterventionEligibilityInput,
): InterventionResult {
  const day = input.trialDay as InterventionDay;
  const intervention = INTERVENTIONS[day] ?? INTERVENTIONS[28];
  const bondAfter = Math.max(0, input.bond - INTERVENTION_BOND_COST);
  const missedDaysAfter = Math.max(
    0,
    input.missedDays - INTERVENTION_MISSED_DAY_FORGIVENESS,
  );
  const redeemedDaysAfter = [...input.redeemedDays];
  if (!redeemedDaysAfter.includes(day)) redeemedDaysAfter.push(day);
  return {
    intervention,
    bondAfter,
    missedDaysAfter,
    redeemedDaysAfter,
    line: intervention.line,
  };
}

/* ─── BOON AGGREGATION ─── */

/**
 * Sum the grants from the boons the apprentice currently holds.
 * The trial summary reads this when rolling the apprentice's combat
 * buff at end of run.
 */
export function aggregateBoons(
  held: ReadonlyArray<{ day: InterventionDay }>,
): Required<MatrixBoon> {
  let bond = 0, corr = 0, light = 0, combat = 0;
  for (const h of held) {
    const b = INTERVENTIONS[h.day]?.grant;
    if (!b) continue;
    bond += b.bondShieldPct ?? 0;
    corr += b.corruptionShieldPct ?? 0;
    light += b.alignmentLightShift ?? 0;
    combat += b.combatBuffBonus ?? 0;
  }
  return {
    bondShieldPct: bond,
    corruptionShieldPct: corr,
    alignmentLightShift: light,
    combatBuffBonus: combat,
  };
}
