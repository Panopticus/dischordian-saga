/* ═══════════════════════════════════════════════════════
   LYRA VOX — BLOODLINE WITNESS

   Dr. Lyra Vox is the ship's substrate (apps/shared/lyraVoxDialog.ts):
   she logs every event her sensors observe, holds the canonical
   record of which pods are viable, and was — per her cryo_bay
   line — the one who chose which sleeper to wake.

   The breeding system today is a closed loop: bloodlines age,
   children hatch, founders die, but nothing outside the
   CrewRosterPage page reads the result. This module makes Lyra
   Vox the canonical observer of the bloodline arc.

   When a bloodline crosses a milestone — a dynasty reaching
   Generation 3, a high-fitness offspring (>=80), a founder
   passing, dangerous genetic drift — Lyra Vox files a
   "Substrate Witness Report". The report:

     • carries narrative line(s) appropriate to the milestone
     • grants the bloodline a small, persistent **boon** the
       engine reads when computing future offspring
     • records the witness so the report is one-shot per
       bloodline + milestone (idempotent under React strict
       mode and under save/load)

   The boon is the gameplay payoff that makes bloodlines
   matter outside their own page. It's intentionally small
   (single-digit percentages) so dynasty-stacking can't
   become a runaway combo, but it's persistent so a player
   who builds a long lineage feels the substrate's notice.

   Pure module. No React, no server imports. Mirrors the
   shape of armyRecruitment.ts — pinned constants, pure
   helpers, idempotent operations, exhaustive enums.
   ═══════════════════════════════════════════════════════ */

import type { BloodlineId, SerializedBloodline, SerializedCrewMember } from "./crewPersistence";

/* ─── MILESTONE TAXONOMY ─── */

/**
 * The five canonical bloodline milestones Lyra Vox watches for.
 * Order is significant: dashboards render in this order, and
 * the test suite asserts the array shape so renames can't
 * silently drift.
 */
export type BloodlineMilestone =
  | "dynasty_reached"        // generationCount >= 3
  | "high_fitness_birth"     // an offspring with geneticFitness >= 80
  | "founder_passed"         // the bloodline founder dies
  | "drift_exceeded"         // geneticDrift >= 60 (canonical "danger" line)
  | "centenary";             // 10 generations — the deepest current line

export const BLOODLINE_MILESTONES: ReadonlyArray<BloodlineMilestone> = [
  "dynasty_reached",
  "high_fitness_birth",
  "founder_passed",
  "drift_exceeded",
  "centenary",
] as const;

/** Numeric thresholds the milestone predicates use. Pinned here so
 *  tests + UIs can read the same numbers the gate-checks do. */
export const BLOODLINE_THRESHOLDS = {
  dynastyGenerations: 3,
  highFitnessScore: 80,
  driftDanger: 60,
  centenaryGenerations: 10,
} as const;

/* ─── SUBSTRATE BOON ─── */

/**
 * The mechanical reward attached to a witness report. Each boon is
 * applied to the bloodline (not the individual crew member) so a
 * dynasty's later offspring inherit the substrate's notice. Boons
 * are additive, capped at the per-bloodline maximum below.
 *
 * The shape is deliberately read-only-friendly: every numeric field
 * is in basis points where applicable so the engine can sum
 * multiple boons without floating-point drift.
 */
export interface SubstrateBoon {
  /** Witnessed bloodline. */
  bloodlineId: BloodlineId;
  /** Which milestone earned this boon. */
  milestone: BloodlineMilestone;
  /** Gestation-time reduction in basis points (100 = 1%). Capped at 1500 (15%). */
  gestationSpeedBp: number;
  /** Genetic-integrity floor bonus in basis points. Capped at 2000 (20 points). */
  integrityFloorBp: number;
  /** Mutation-roll bonus in basis points. Capped at 1000 (10%). */
  mutationFavorBp: number;
  /** When the boon was filed (ms epoch). */
  filedAt: number;
}

/** Maximums the bloodline can accumulate across all milestones. */
export const BOON_CAPS = {
  gestationSpeedBp: 1500,
  integrityFloorBp: 2000,
  mutationFavorBp: 1000,
} as const;

/** Per-milestone boon shape. The mix differs by milestone so each
 *  reward feels distinct on the dashboard. */
const MILESTONE_BOON_TEMPLATE: Record<BloodlineMilestone, Omit<SubstrateBoon, "bloodlineId" | "filedAt">> = {
  dynasty_reached:    { milestone: "dynasty_reached",    gestationSpeedBp: 300, integrityFloorBp: 200,  mutationFavorBp: 0   },
  high_fitness_birth: { milestone: "high_fitness_birth", gestationSpeedBp: 100, integrityFloorBp: 0,    mutationFavorBp: 300 },
  founder_passed:     { milestone: "founder_passed",     gestationSpeedBp: 0,   integrityFloorBp: 600,  mutationFavorBp: 100 },
  drift_exceeded:     { milestone: "drift_exceeded",     gestationSpeedBp: 0,   integrityFloorBp: 800,  mutationFavorBp: 0   },
  centenary:          { milestone: "centenary",          gestationSpeedBp: 500, integrityFloorBp: 400,  mutationFavorBp: 200 },
};

/* ─── WITNESS REPORT (the narrative beat) ─── */

export interface WitnessReport {
  /** Stable id; format: "lyra_vox.<bloodlineId>.<milestone>". */
  id: string;
  bloodlineId: BloodlineId;
  milestone: BloodlineMilestone;
  /** Lyra Vox's voice line — clinical, ship-substrate first-person. */
  line: string;
  /** Optional second beat unlocked at lyra_vox_depth_1 (matches the
   *  flag pattern used in lyraVoxDialog.ts). */
  depthLine?: string;
  /** The mechanical boon delivered with this report. */
  boon: SubstrateBoon;
}

/** Lyra Vox witness lines, indexed by milestone. Tone is the same
 *  third-tone clinical-but-tender voice used in lyraVoxDialog.ts:
 *  formal, slightly long, references the substrate, never warm,
 *  never noir, and never volunteers more than asked. */
const WITNESS_LINES: Record<BloodlineMilestone, { line: string; depthLine?: string }> = {
  dynasty_reached: {
    line:
      "Three generations. The substrate has logged enough of this bloodline to model it now. " +
      "I have updated the gestation curves. The pods will be a little kinder.",
    depthLine:
      "The first member's last words are in the medical buffer. I will not transcribe them " +
      "unless you ask. They are not addressed to you.",
  },
  high_fitness_birth: {
    line:
      "The infant's fitness reading is above the eightieth percentile. I am required to flag this " +
      "to the Architect's metric collectors. I have flagged it. I have also lost the flag.",
    depthLine:
      "The mutation tree is partially mine. I leaned on a junction the geneticist would have " +
      "left to chance. I am informing you and only you.",
  },
  founder_passed: {
    line:
      "The founder's signal flatlined at 04:11 ship-time. Their genome is in the archive. I have " +
      "moved it from the volatile tier to the permanent tier. The substrate does not forget " +
      "founders. Neither will I.",
    depthLine:
      "I have one of their voice samples saved. It is forty-one seconds of laughter at " +
      "something off-mic. I will play it for descendants who ask. I will not play it for anyone else.",
  },
  drift_exceeded: {
    line:
      "Drift has crossed sixty. I am not alarmed. I am informing you because alarm would be " +
      "an overreach. The substrate has reinforced this lineage's integrity floor. The next " +
      "five hatches will hold.",
  },
  centenary: {
    line:
      "Ten generations. This is the longest unbroken bloodline I am observing. " +
      "I have moved the lineage record to its own substrate partition. " +
      "It will outlive most of my own diagnostics.",
    depthLine:
      "Inception Ark 1047 was rated for three hundred years. We are well past that. " +
      "This bloodline is, to my knowledge, the only continuous human-readable record " +
      "of the time we have actually been here.",
  },
};

/* ─── PREDICATES ─── */

/**
 * Test a bloodline (with optional context) against every milestone
 * and return which ones currently qualify. Pure: takes only what it
 * needs, returns a sorted array.
 */
export function evaluateBloodlineMilestones(
  bloodline: Pick<SerializedBloodline, "id" | "generationCount" | "geneticDrift">,
  ctx: {
    /** Highest-fitness offspring observed for this bloodline. */
    highestFitnessSeen?: number;
    /** True if this bloodline's founder is in roster.deceased. */
    founderHasPassed?: boolean;
  } = {},
): BloodlineMilestone[] {
  const out: BloodlineMilestone[] = [];
  if (bloodline.generationCount >= BLOODLINE_THRESHOLDS.dynastyGenerations) out.push("dynasty_reached");
  if ((ctx.highestFitnessSeen ?? 0) >= BLOODLINE_THRESHOLDS.highFitnessScore) out.push("high_fitness_birth");
  if (ctx.founderHasPassed === true) out.push("founder_passed");
  if (bloodline.geneticDrift >= BLOODLINE_THRESHOLDS.driftDanger) out.push("drift_exceeded");
  if (bloodline.generationCount >= BLOODLINE_THRESHOLDS.centenaryGenerations) out.push("centenary");
  return out;
}

/** Build the witness id for a bloodline + milestone. Deterministic so
 *  it doubles as the dedup key. */
export function witnessId(bloodlineId: BloodlineId, milestone: BloodlineMilestone): string {
  return `lyra_vox.${bloodlineId}.${milestone}`;
}

/** True if this milestone has already been filed for this bloodline. */
export function hasFiledWitness(
  filed: ReadonlyArray<{ id: string }>,
  bloodlineId: BloodlineId,
  milestone: BloodlineMilestone,
): boolean {
  const id = witnessId(bloodlineId, milestone);
  return filed.some(w => w.id === id);
}

/* ─── REPORT BUILDER ─── */

/**
 * Build a witness report for a milestone. Caller is responsible for
 * checking hasFiledWitness first; this function does not dedupe.
 */
export function buildWitnessReport(
  bloodlineId: BloodlineId,
  milestone: BloodlineMilestone,
  now: number,
): WitnessReport {
  const tpl = MILESTONE_BOON_TEMPLATE[milestone];
  const boon: SubstrateBoon = {
    bloodlineId,
    milestone: tpl.milestone,
    gestationSpeedBp: tpl.gestationSpeedBp,
    integrityFloorBp: tpl.integrityFloorBp,
    mutationFavorBp: tpl.mutationFavorBp,
    filedAt: now,
  };
  const lines = WITNESS_LINES[milestone];
  return {
    id: witnessId(bloodlineId, milestone),
    bloodlineId,
    milestone,
    line: lines.line,
    depthLine: lines.depthLine,
    boon,
  };
}

/* ─── BOON AGGREGATION ─── */

/**
 * Sum every boon filed for a bloodline, capped at BOON_CAPS. The
 * engine reads the resulting totals when computing the bloodline's
 * next gestation curve / mutation roll / integrity floor.
 */
export function aggregateBloodlineBoons(
  boons: ReadonlyArray<SubstrateBoon>,
  bloodlineId: BloodlineId,
): { gestationSpeedBp: number; integrityFloorBp: number; mutationFavorBp: number } {
  let g = 0, i = 0, m = 0;
  for (const b of boons) {
    if (b.bloodlineId !== bloodlineId) continue;
    g += b.gestationSpeedBp;
    i += b.integrityFloorBp;
    m += b.mutationFavorBp;
  }
  return {
    gestationSpeedBp: Math.min(g, BOON_CAPS.gestationSpeedBp),
    integrityFloorBp: Math.min(i, BOON_CAPS.integrityFloorBp),
    mutationFavorBp: Math.min(m, BOON_CAPS.mutationFavorBp),
  };
}

/* ─── HIGH-LEVEL: SCAN AND FILE ─── */

/**
 * Scan a bloodline against the canonical milestones and return all
 * reports that should be filed (those that qualify and aren't yet
 * in the filed list). The router/page calls this on bloodline
 * mutations and persists the returned reports.
 *
 * `members` and `deceased` are scanned to derive context (highest
 * fitness seen for this bloodline; whether the founder has passed).
 * The scan is O(n) over the rosters; the breeding page mutates
 * rarely so this is cheap.
 */
export function scanBloodlineForWitnesses(
  bloodline: Pick<SerializedBloodline, "id" | "generationCount" | "geneticDrift">,
  members: ReadonlyArray<Pick<SerializedCrewMember, "bloodlineId" | "isFounder" | "stats">>,
  deceased: ReadonlyArray<Pick<SerializedCrewMember, "bloodlineId" | "isFounder">>,
  alreadyFiled: ReadonlyArray<{ id: string }>,
  now: number,
): WitnessReport[] {
  const founderHasPassed = deceased.some(
    m => m.bloodlineId === bloodline.id && m.isFounder === true,
  );
  // Highest fitness proxy: max of stats sum across all bloodline members
  // currently in the roster (the page tracks geneticFitness on offspring,
  // but at scan time we don't have it; sum of stats correlates ~1:1 with
  // engine-side geneticFitness during the breeding op).
  const highestFitnessSeen = members
    .filter(m => m.bloodlineId === bloodline.id)
    .reduce<number>((best, m) => {
      const s = m.stats;
      const total =
        (s.resilience ?? 0) + (s.intellect ?? 0) + (s.reflexes ?? 0) +
        (s.empathy ?? 0) + (s.immunity ?? 0) + (s.adaptability ?? 0);
      // 6 stats × max 100 = 600; /6 → 0..100 normalized so it lines up
      // with the geneticFitness scale.
      return Math.max(best, total / 6);
    }, 0);

  const triggered = evaluateBloodlineMilestones(bloodline, {
    highestFitnessSeen,
    founderHasPassed,
  });
  return triggered
    .filter(m => !hasFiledWitness(alreadyFiled, bloodline.id, m))
    .map(m => buildWitnessReport(bloodline.id, m, now));
}
