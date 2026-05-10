/* ═══════════════════════════════════════════════════════
   VEX SOLÈNE — RECRUITMENT COMMISSIONS

   Vex Solène (npcKey: vex_solene) is canonically the wrong
   person to give an army a pep talk and the right person
   to read the contract that builds it. Per her bible
   (apps/shared/npcs/bibles/vex_solene.md): pre-insurgency
   diplomat, post-transference hitman, currently the
   Maestro of The Coda — the person in the saga who has
   been counted-against in every room she ever walked into,
   and who has, in turn, learned to count rooms.

   The army recruitment system today is a bare counter
   (apps/shared/armyRecruitment.ts): missions complete, the
   number ticks up, Acts 6 and 7 unlock. The counter has no
   voice. The five unit types in the recruitment data are
   functionally indistinguishable in play.

   This module ships:

     1. **Commissions** — at canonical milestones (1st,
        5th, 10th, 15th, 20th completed mission) Vex files
        a Coda Commission. The commissions are not pep
        talks; they are inventories. Vex states what the
        player has acquired, what they have spent, and
        what is now legible about them to people they
        have not met.

     2. **Operational directives** — each commission
        unlocks a directive the player can apply to one of
        their five unit types. Directives are small
        (8–15 percentage points) success-chance modifiers
        on a mission kind that suits that unit type. The
        five-and-five mapping gives the unit roster the
        differentiation it has been missing.

   Vex's voice (per bible §1.1): inventory followed by
   courtesy. Three short declaratives, then a resolution.
   Trailing-word cadence. No exclamation marks. No
   apologies as standalone moves. "I'm glad it's you" is
   reserved — used here only at the capstone (milestone 20).

   Pure module. No React, no server.
   ═══════════════════════════════════════════════════════ */

import { RECRUITMENT_THRESHOLDS } from "./armyRecruitment";

/* ─── UNIT TYPES (mirrored from armyRecruitment data) ─── */

/**
 * The five canonical unit types the army roster supports. Mirrored
 * here as a string-literal type so this module doesn't take a
 * runtime dep on the data file (which contains React-pulling content).
 */
export type ArmyUnitType =
  | "operative"
  | "dreamer"
  | "engineer"
  | "insurgent"
  | "diplomat";

export const ARMY_UNIT_TYPES: ReadonlyArray<ArmyUnitType> = [
  "operative",
  "dreamer",
  "engineer",
  "insurgent",
  "diplomat",
] as const;

/* ─── MILESTONES ─── */

/** Canonical milestone counts. The 5/8 numbers shadow
 *  RECRUITMENT_THRESHOLDS so a structural rename surfaces here.
 *  Act 7 threshold tightened from 15 → 8 in the BioWare-grade
 *  pacing pass; the 8-mission commission slots in where 15 was. */
export const COMMISSION_MILESTONES = [1, 5, 8, 10, 20] as const;
export type CommissionMilestone = (typeof COMMISSION_MILESTONES)[number];

/** Defensive cross-check: Act 6 / Act 7 thresholds must each be a
 *  commission milestone too. */
export function commissionMilestonesCoverActGates(): boolean {
  const set = new Set<number>(COMMISSION_MILESTONES);
  return set.has(RECRUITMENT_THRESHOLDS.act6) && set.has(RECRUITMENT_THRESHOLDS.act7);
}

/* ─── DIRECTIVES (the mechanical reward) ─── */

export type MissionKind =
  | "infiltration"
  | "outreach"
  | "logistics"
  | "skirmish"
  | "diplomacy";

export interface OperationalDirective {
  /** Stable id; format: "vex_solene.directive.<unitType>". */
  id: string;
  unitType: ArmyUnitType;
  missionKind: MissionKind;
  /** Success-chance bonus, in percentage points (8..15). */
  successBonusPct: number;
  /** Vex's one-line counsel attached to the directive. */
  counsel: string;
}

const DIRECTIVES: ReadonlyArray<OperationalDirective> = [
  {
    id: "vex_solene.directive.operative",
    unitType: "operative",
    missionKind: "infiltration",
    successBonusPct: 12,
    counsel:
      "An operative is a sentence you do not finish out loud. Send them where the room is " +
      "still being counted. Do not check on them.",
  },
  {
    id: "vex_solene.directive.dreamer",
    unitType: "dreamer",
    missionKind: "outreach",
    successBonusPct: 10,
    counsel:
      "Dreamers do not recruit. They remind. Place them where someone has forgotten what they " +
      "wanted, and let the room remember.",
  },
  {
    id: "vex_solene.directive.engineer",
    unitType: "engineer",
    missionKind: "logistics",
    successBonusPct: 12,
    counsel:
      "An engineer is a supply line in a coat. Keep them behind the line. The contracts I have " +
      "seen lost on supply outnumber the ones lost on courage.",
  },
  {
    id: "vex_solene.directive.insurgent",
    unitType: "insurgent",
    missionKind: "skirmish",
    successBonusPct: 15,
    counsel:
      "Insurgents are the cheapest sentence in the contract. Hit. Move. Hit again. If they are " +
      "holding ground, the contract has been mis-signed.",
  },
  {
    id: "vex_solene.directive.diplomat",
    unitType: "diplomat",
    missionKind: "diplomacy",
    successBonusPct: 12,
    counsel:
      "A diplomat is a unit that wins by being the audience the other side wants. They cost more " +
      "than a soldier. They save you ten. Treat them as such.",
  },
];

const DIRECTIVE_BY_MILESTONE: Record<CommissionMilestone, OperationalDirective> = {
  1:  DIRECTIVES[0],
  5:  DIRECTIVES[1],
  8:  DIRECTIVES[3],
  10: DIRECTIVES[2],
  20: DIRECTIVES[4],
};

export function getDirectiveForMilestone(m: CommissionMilestone): OperationalDirective {
  return DIRECTIVE_BY_MILESTONE[m];
}

export function allDirectives(): ReadonlyArray<OperationalDirective> {
  return DIRECTIVES;
}

/* ─── COMMISSIONS (the narrative payload) ─── */

export interface CodaCommission {
  /** Stable id; format: "vex_solene.commission.<count>". */
  id: string;
  milestone: CommissionMilestone;
  /** Vex's monologue at this milestone. Inventory + courtesy. */
  line: string;
  /** Optional callback used when the player has already received
   *  an earlier commission — Vex is a counter of rooms; she
   *  remembers her own earlier filings. */
  callbackLine?: string;
  /** The directive unlocked alongside this commission. */
  directive: OperationalDirective;
}

const COMMISSION_LINES: Record<CommissionMilestone, { line: string; callbackLine?: string }> = {
  1: {
    line:
      "First commission filed. The contract has one signature. The recruit was already in the room " +
      "before you arrived. The next one will not be.",
  },
  5: {
    line:
      "Five. The Insurgency is a sentence other people are saying about you now. I have heard it " +
      "twice this week. I am only telling you the version I heard.",
    callbackLine:
      "I told you the second recruit would not be in the room when you arrived. I was correct.",
  },
  10: {
    line:
      "Ten. You have a column. The Architect's clerks have a number for you. The number is mine " +
      "before it is yours; I will not say which they reach. Make peace with the count.",
  },
  8: {
    line:
      "Eight. The contract has weight now. You can feel it when you walk. You will feed it, " +
      "mislead it, and lose some of it on purpose. I am not going to soften the math. Neither are " +
      "you, after this.",
    callbackLine:
      "The version of you who signed at one would not recognise the version signing at eight. " +
      "That is correct. The work is the difference.",
  },
  20: {
    line:
      "Twenty. You command an army. The Architect commanded one until he became it. The line is " +
      "where the count starts feeling like a body. Do not cross it. I'm glad it's you.",
    callbackLine:
      "I have read every commission you have filed. I am keeping this one in the drawer where I " +
      "keep the ones I will not file twice.",
  },
};

export function buildCodaCommission(
  milestone: CommissionMilestone,
): CodaCommission {
  const lines = COMMISSION_LINES[milestone];
  return {
    id: `vex_solene.commission.${milestone}`,
    milestone,
    line: lines.line,
    callbackLine: lines.callbackLine,
    directive: getDirectiveForMilestone(milestone),
  };
}

/* ─── EVENT TRIGGER ─── */

/**
 * Given a previous and current mission count, return any milestone
 * commissions the player just crossed. The recruitment counter is
 * monotonic so we only fire forward.
 */
export function milestonesCrossed(
  prevCount: number,
  nextCount: number,
): CommissionMilestone[] {
  if (nextCount <= prevCount) return [];
  return COMMISSION_MILESTONES.filter(m => prevCount < m && m <= nextCount);
}

/**
 * One-shot helper: returns the full commission objects (with their
 * directives) for the typical "after a mission completes" flow.
 */
export function commissionsForMissionCount(
  prevCount: number,
  nextCount: number,
): CodaCommission[] {
  return milestonesCrossed(prevCount, nextCount).map(buildCodaCommission);
}

/* ─── DIRECTIVE APPLICATION ─── */

/**
 * Compute the applicable success-chance bonus for a unit type +
 * mission kind given the directives the player has unlocked. A
 * directive only applies when both unitType and missionKind match.
 * No stacking — one directive per (unit, kind) pair by construction.
 */
export function directiveSuccessBonus(
  unlocked: ReadonlyArray<{ unitType: ArmyUnitType; missionKind: MissionKind; successBonusPct: number }>,
  unitType: ArmyUnitType,
  missionKind: MissionKind,
): number {
  for (const d of unlocked) {
    if (d.unitType === unitType && d.missionKind === missionKind) {
      return d.successBonusPct;
    }
  }
  return 0;
}
