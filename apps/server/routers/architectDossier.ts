/* ═══════════════════════════════════════════════════════
   ARCHITECT DOSSIER — Candidate Briefing (A3 in
   /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md)

   Player-facing read-only surface that surfaces the data the
   Architect would have logged about the player to date. The
   recruitment frame: the Architect has been observing every
   decision; this is the candidate file.

   Distinct from architectConsoleRouter which is admin-only and
   exposes site-wide surveillance metrics. The dossier shows ONLY
   the caller's own data, in a coded-bureaucratic voice meant to
   read like an internal observation log.

   Signal sources surfaced today:
     - playerProfile (7 psychological axes from
       apps/shared/playerProfile.ts)
     - eventCount (size of the audit trail behind the snapshot)
     - lastUpdatedAt (recency)

   Future iterations (when the upstream signals settle) can extend
   the response shape with:
     - Authority Trial verdict (overturn / sentence_passed)
     - Witnessing milestones reached (apps/shared/witnessingEvents.ts)
     - Palimpsest signal/noise contribution
     - Transmission-watch count
   These fields aren't included yet to keep the surface honest —
   only data the codebase already aggregates makes it into v1.
   ═══════════════════════════════════════════════════════ */
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { playerProfile } from "../../db/schema";
import {
  PROFILE_AXES,
  emptyProfile,
  type PlayerProfile,
  type ProfileAxis,
} from "@shared/playerProfile";

/** Architect-coded label per axis. Distinct vocabulary from the
 *  player-facing AXIS_POLES so the dossier reads like a
 *  surveillance file rather than a friendly trait card. */
const AXIS_LABEL_ARCHITECT: Readonly<Record<ProfileAxis, string>> = {
  aggression: "DECISIVENESS",
  mercy: "RESTRAINT",
  curiosity: "INVESTIGATIVE_WEIGHT",
  conformity: "ALIGNMENT",
  vigilance: "ATTENTION",
  vulnerability: "EXPOSURE",
  wit: "PROCESSING",
};

/** Bucketing helper. Maps -100..100 to a 5-step calibration label
 *  matching the Architect's voice. */
function calibrationLabel(value: number): string {
  if (value <= -50) return "DEEP_NEGATIVE";
  if (value <= -10) return "BELOW_BASELINE";
  if (value < 10) return "BASELINE";
  if (value < 50) return "ABOVE_BASELINE";
  return "DEEP_POSITIVE";
}

/** Recruitment-status heuristic. Until the formal Architect-trust
 *  axis exists, derive a candidate-status label from the existing
 *  signals: enough observed events + non-baseline alignment ⇒
 *  CANDIDATE_IN_OBSERVATION; small footprint ⇒ AWAITING_DATA. */
function candidateStatus(profile: PlayerProfile): string {
  if (profile.eventCount === 0) return "AWAITING_FIRST_OBSERVATION";
  if (profile.eventCount < 5) return "INSUFFICIENT_DATA";
  const significantAxes = PROFILE_AXES.filter(
    (a) => Math.abs(profile[a]) >= 30,
  ).length;
  if (significantAxes >= 3) return "CANDIDATE_IN_OBSERVATION";
  if (significantAxes >= 1) return "PROVISIONAL_INTEREST";
  return "BASELINE_CONTOUR";
}

interface DossierAxisRow {
  axis: ProfileAxis;
  /** Architect's coded label (e.g. "DECISIVENESS"). */
  label: string;
  value: number;
  /** Bucketed calibration term (e.g. "ABOVE_BASELINE"). */
  calibration: string;
}

export interface ArchitectDossier {
  candidateStatus: string;
  observedEvents: number;
  lastObservedAt: string | null;
  axes: readonly DossierAxisRow[];
}

export const architectDossierRouter = router({
  /**
   * Fetch the caller's Candidate Dossier. Returns a sentinel
   * "no observations yet" shape when the player has no
   * playerProfile row, so the client can branch on the
   * empty-state path without separate plumbing.
   */
  getMyDossier: protectedProcedure.query(async ({ ctx }): Promise<ArchitectDossier> => {
    const db = await getDb();
    let profile = emptyProfile();

    if (db) {
      try {
        const [row] = await db
          .select()
          .from(playerProfile)
          .where(eq(playerProfile.userId, ctx.user.id))
          .limit(1);
        if (row) {
          profile = {
            aggression: row.aggression,
            mercy: row.mercy,
            curiosity: row.curiosity,
            conformity: row.conformity,
            vigilance: row.vigilance,
            vulnerability: row.vulnerability,
            wit: row.wit,
            eventCount: row.eventCount,
            lastUpdatedAt: row.lastUpdatedAt ?? null,
          };
        }
      } catch {
        // Read failure ⇒ neutral profile. The Architect dossier
        // should never crash a session.
      }
    }

    return {
      candidateStatus: candidateStatus(profile),
      observedEvents: profile.eventCount,
      lastObservedAt: profile.lastUpdatedAt
        ? profile.lastUpdatedAt.toISOString()
        : null,
      axes: PROFILE_AXES.map((axis) => ({
        axis,
        label: AXIS_LABEL_ARCHITECT[axis],
        value: profile[axis],
        calibration: calibrationLabel(profile[axis]),
      })),
    };
  }),
});
