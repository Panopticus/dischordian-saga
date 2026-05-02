/* ═══════════════════════════════════════════════════════
   DREAMER DOSSIER — cryptic vision-summary surface (C4
   in /root/.claude/plans/continue-your-qr-assessment-mighty
   -valley.md).

   Mirror of architectDossier.ts but with the Dreamer's
   register: the same psychological-axis profile data, read
   back as cryptic vision fragments rather than calibration
   codes. The Architect side files; the Dreamer side
   describes.

   Visibility: gated on having received Vision 3 (the
   threshold at which the recruitment plan says the
   Dreamer-side surfaces become visible). The
   `dreamerFragmentsSectionVisible()` pure helper from
   apps/shared/dreamerFragments.ts is the single source of
   truth for that gate — both surfaces unlock at the same
   moment.

   When the gate is closed, returns a sentinel shape
   `{ available: false }` so the client can render the
   404-shape page without conditional logic. When the gate
   is open the dossier returns the same axis values the
   Architect side does, mapped to the cryptic register.
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
} from "../../shared/playerProfile";
import { getDreamerAwareness } from "../services/dreamerAwareness";
import { dreamerFragmentsSectionVisible } from "../../shared/dreamerFragments";

/** Cryptic vision-fragment label per axis. Distinct vocabulary from
 *  the Architect's `AXIS_LABEL_ARCHITECT` so the dossier reads as
 *  a Dreamer-side reading rather than a surveillance file. Each
 *  label is a short noun phrase the Dreamer's pages would use. */
const AXIS_LABEL_DREAMER: Readonly<Record<ProfileAxis, string>> = {
  aggression: "the loud hand",
  mercy: "the held hand",
  curiosity: "the open eye",
  conformity: "the matched footstep",
  vigilance: "the unsleeping watcher",
  vulnerability: "the unguarded room",
  wit: "the listening ear",
};

/** Cryptic-register reading per signed bucket. Mirrors the
 *  5-tier Architect calibration scale but in lyric-fragment
 *  prose — same data, different voice. */
function dreamerReading(value: number): string {
  if (value <= -50) return "absent";
  if (value <= -10) return "quiet";
  if (value < 10) return "uncertain";
  if (value < 50) return "open";
  return "unmistakable";
}

/** Top-line summary the Dreamer leaves on the cover page.
 *  Mirrors `candidateStatus` shape from architectDossier but in
 *  the Dreamer's register. Picks the strongest two axes and
 *  composes a one-sentence reading; falls back to a "still
 *  reading" tag when the player has too few observations. */
function dreamerSummary(profile: PlayerProfile): string {
  if (profile.eventCount === 0) return "the page is empty.";
  if (profile.eventCount < 5) return "the page is half-written.";
  // Pick the two highest-magnitude axes (signed magnitude — both
  // poles count as "loud").
  const ranked = [...PROFILE_AXES].sort(
    (a, b) => Math.abs(profile[b]) - Math.abs(profile[a]),
  );
  const top = ranked[0];
  const topMag = Math.abs(profile[top]);
  if (topMag < 30) return "the reading is faint.";
  const second = ranked[1];
  const secondMag = Math.abs(profile[second]);
  if (secondMag < 30) {
    return `${AXIS_LABEL_DREAMER[top]} is ${dreamerReading(profile[top])}.`;
  }
  return (
    `${AXIS_LABEL_DREAMER[top]} is ${dreamerReading(profile[top])}; ` +
    `${AXIS_LABEL_DREAMER[second]} is ${dreamerReading(profile[second])}.`
  );
}

interface DreamerDossierAxisRow {
  axis: ProfileAxis;
  /** Cryptic-register label (e.g. "the open eye"). */
  label: string;
  value: number;
  /** Lyric-fragment reading (e.g. "open"). */
  reading: string;
}

export interface DreamerDossier {
  /** False when the section is gated off (player has not yet
   *  received Vision 3). When false, no other fields are
   *  populated — the client renders the 404-shape page. */
  available: boolean;
  /** Dreamer's cover-page reading. One short sentence. */
  summary?: string;
  /** Number of observed events backing the reading. Same data
   *  as the Architect dossier — different voice. */
  observedEvents?: number;
  /** ISO timestamp of the most recent observation. */
  lastObservedAt?: string | null;
  /** Per-axis cryptic readings. */
  axes?: readonly DreamerDossierAxisRow[];
}

export const dreamerDossierRouter = router({
  /**
   * Fetch the caller's Dreamer Dossier. Returns the gated-off
   * shape `{ available: false }` until Vision 3 has been
   * received. When available, returns the same axis data the
   * Architect side serves but mapped to the cryptic register.
   *
   * Idempotent and read-only. No-DB-safe via the existing
   * empty-profile fallback.
   */
  getMyDossier: protectedProcedure.query(
    async ({ ctx }): Promise<DreamerDossier> => {
      // Section gate first — if the player hasn't received
      // Vision 3 yet, we don't even read playerProfile. The
      // dossier doesn't exist for them yet.
      const awareness = await getDreamerAwareness(ctx.user.id);
      const visionsReceived = awareness?.visionsReceived ?? [];
      if (!dreamerFragmentsSectionVisible(visionsReceived)) {
        return { available: false };
      }

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
          // Read failure ⇒ neutral profile. The Dreamer dossier
          // should never crash a session, just like the
          // Architect side.
        }
      }

      return {
        available: true,
        summary: dreamerSummary(profile),
        observedEvents: profile.eventCount,
        lastObservedAt: profile.lastUpdatedAt
          ? profile.lastUpdatedAt.toISOString()
          : null,
        axes: PROFILE_AXES.map((axis) => ({
          axis,
          label: AXIS_LABEL_DREAMER[axis],
          value: profile[axis],
          reading: dreamerReading(profile[axis]),
        })),
      };
    },
  ),
});

// Exposed for unit tests — the cryptic-register helpers are pure
// and worth asserting in isolation.
export const _internals = {
  dreamerSummary,
  dreamerReading,
  AXIS_LABEL_DREAMER,
};
